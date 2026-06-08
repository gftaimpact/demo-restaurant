const express = require('express');
const cors = require('cors');
const path = require('path');
const menu = require('./data/menu.json');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// In-memory orders store
const orders = [];
let orderIdCounter = 1;

// GET /api/menu - Return the full menu
app.get('/api/menu', (req, res) => {
  res.json(menu);
});

// POST /api/orders - Place a new order
app.post('/api/orders', (req, res) => {
  const { customerName, tableNumber, items, notes } = req.body;

  if (!customerName || !items || items.length === 0) {
    return res.status(400).json({ error: 'Customer name and at least one item are required.' });
  }

  const allItems = menu.categories.flatMap(c => c.items);
  let total = 0;
  const orderItems = items.map(item => {
    const menuItem = allItems.find(m => m.id === item.id);
    if (!menuItem) return null;
    const subtotal = menuItem.price * item.quantity;
    total += subtotal;
    return {
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
      subtotal,
    };
  }).filter(Boolean);

  if (orderItems.length === 0) {
    return res.status(400).json({ error: 'No valid items found.' });
  }

  const order = {
    id: orderIdCounter++,
    customerName,
    tableNumber: tableNumber || null,
    items: orderItems,
    notes: notes || '',
    total: Math.round(total * 100) / 100,
    status: 'received',
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  console.log(`Order #${order.id} placed by ${order.customerName} — $${order.total}`);

  res.status(201).json(order);
});

// GET /api/orders - List all orders (for demo purposes)
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`🍽️  Restaurant API running at http://localhost:${PORT}`);
});
