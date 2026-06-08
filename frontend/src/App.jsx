import { useState, useEffect, useRef } from 'react';
import './App.css';

const API = 'http://localhost:3002/api';

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const categoryRefs = useRef({});

  useEffect(() => {
    fetch(`${API}/menu`)
      .then(r => r.json())
      .then(data => {
        setMenu(data.categories || []);
        if (data.categories?.length) setActiveCategory(data.categories[0].id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scrollToCategory = (id) => {
    setActiveCategory(id);
    categoryRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => {
      return prev.map(c => {
        if (c.id !== id) return c;
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : null;
      }).filter(Boolean);
    });
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const placeOrder = async (customerName, tableNumber, notes) => {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        tableNumber,
        notes,
        items: cart.map(c => ({ id: c.id, quantity: c.quantity })),
      }),
    });
    const order = await res.json();
    if (res.ok) {
      setCart([]);
      setShowCheckout(false);
      setShowSuccess(order);
      setMobileCartOpen(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
        Loading menu...
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-top">
          <h1>The Golden Fork</h1>
          <p>Fine Dining Experience</p>
        </div>
        <nav className="category-nav">
          {menu.map(cat => (
            <button
              key={cat.id}
              className={activeCategory === cat.id ? 'active' : ''}
              onClick={() => scrollToCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </nav>
      </header>

      {/* MAIN LAYOUT */}
      <div className="app-layout">
        {/* MENU */}
        <main className="menu-section">
          {menu.map(cat => (
            <section key={cat.id} ref={el => categoryRefs.current[cat.id] = el}>
              <div className="category-header">
                <span className="icon">{cat.icon}</span>
                <h2>{cat.name}</h2>
              </div>
              <div className="menu-grid">
                {cat.items.map(item => (
                  <MenuCard key={item.id} item={item} onAdd={() => addToCart(item)} />
                ))}
              </div>
            </section>
          ))}
        </main>

        {/* CART SIDEBAR */}
        {mobileCartOpen && <div className="cart-overlay" onClick={() => setMobileCartOpen(false)} />}
        <aside className={`cart-sidebar ${mobileCartOpen ? 'open' : ''}`}>
          <div className="cart-header">
            <h2>
              Your Order
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </h2>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Add items from the menu to get started</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">${item.price.toFixed(2)} each</div>
                    </div>
                    <div className="cart-item-controls">
                      <button className="qty-btn remove" onClick={() => updateQty(item.id, -1)}>-</button>
                      <span className="cart-item-qty">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                    <div className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
                  Place Order
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* MOBILE CART BUTTON */}
      <button className="mobile-cart-btn" onClick={() => setMobileCartOpen(!mobileCartOpen)}>
        🛒
        {cartCount > 0 && <span className="badge">{cartCount}</span>}
      </button>

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <CheckoutModal
          total={cartTotal}
          onClose={() => setShowCheckout(false)}
          onSubmit={placeOrder}
        />
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="modal-overlay" onClick={() => setShowSuccess(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="success-modal">
              <div className="success-icon">✅</div>
              <h2>Order Placed!</h2>
              <p>Thank you, {showSuccess.customerName}!</p>
              <p className="order-id">Order #{showSuccess.id} — ${showSuccess.total.toFixed(2)}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '24px' }}>
                Your food is being prepared. Sit tight!
              </p>
              <button onClick={() => setShowSuccess(null)}>Back to Menu</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MenuCard({ item, onAdd }) {
  return (
    <div className="menu-card">
      {item.popular && <span className="popular-badge">Popular</span>}
      <img className="menu-card-image" src={item.image} alt={item.name} loading="lazy" />
      <div className="menu-card-body">
        <div className="menu-card-header">
          <h3>{item.name}</h3>
          <span className="menu-card-price">${item.price.toFixed(2)}</span>
        </div>
        <p className="menu-card-desc">{item.description}</p>
        <div className="menu-card-footer">
          <div className="tags">
            {item.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
          <button className="add-btn" onClick={onAdd} title="Add to order">+</button>
        </div>
      </div>
    </div>
  );
}

function CheckoutModal({ total, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [table, setTable] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    await onSubmit(name.trim(), table.trim() || null, notes.trim());
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Checkout</h2>
          <p>Complete your order — ${total.toFixed(2)}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                id="name"
                type="text"
                placeholder="e.g. John Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="table">Table Number</label>
              <input
                id="table"
                type="text"
                placeholder="e.g. 5 (optional)"
                value={table}
                onChange={e => setTable(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="notes">Special Requests</label>
              <textarea
                id="notes"
                placeholder="Allergies, preferences, etc."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={!name.trim() || submitting}>
              {submitting ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
