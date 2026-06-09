const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { exec } = require('child_process');
const menu = require('./data/menu.json');

const app = express();
const PORT = 3002;

// VULN-001 (S5122): CORS wildcard — accepts requests from ANY origin, including malicious ones
app.use(cors({ origin: '*' }));
app.use(express.json());

// VULN-002 (S2068): Hardcoded credentials — admin password stored in plain text in source code
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin@1234';          // hardcoded password
const JWT_SECRET     = 'goldenForkSecret123'; // hardcoded secret key

// VULN-003 (S2245): Math.random used as security token — not cryptographically secure
function generateOrderToken() {
  return 'tok_' + Math.random().toString(36).substr(2, 16);
}

// VULN-004 (S4790): MD5 used for hashing — weak cryptographic algorithm
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// In-memory stores
const orders = [];
const users  = [{ username: 'admin', password: hashPassword('Admin@1234'), role: 'admin' }];
let orderIdCounter = 1;

// GET /api/menu
app.get('/api/menu', (req, res) => {
  res.json(menu);
});

// POST /api/login  — VULN-005 (S2068 + S5247): hardcoded creds + eval on user input
app.post('/api/login', (req, res) => {
  const { username, password, discount } = req.body;

  // VULN-005a: comparing against hardcoded credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // VULN-005b (S5247): eval() executed with unsanitized user input — code injection
    let appliedDiscount = 0;
    if (discount) {
      appliedDiscount = eval(discount); // dangerous: eval(user_input)
    }

    // VULN-002b: secret key logged to console — sensitive data exposure
    console.log(`[AUTH] Login OK — jwt_secret=${JWT_SECRET}, discount=${appliedDiscount}`);
    return res.json({ token: generateOrderToken(), discount: appliedDiscount });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// GET /api/orders/search?name=  — VULN-006 (S2631): ReDoS via uncontrolled regex from user input
app.get('/api/orders/search', (req, res) => {
  const { name } = req.query;
  // VULN: regex built directly from user input — ReDoS attack vector
  const regex = new RegExp(name, 'i');
  const results = orders.filter(o => regex.test(o.customerName));
  res.json(results);
});

// GET /api/report?file=  — VULN-007 (S6096 / path traversal): unsanitized file path from user
app.get('/api/report', (req, res) => {
  const { file } = req.query;
  // VULN: path.join does NOT prevent traversal when file = '../../etc/passwd'
  const filePath = path.join(__dirname, 'data', file);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'File not found', detail: err.message }); // stack trace exposed
    res.send(data);
  });
});

// POST /api/notify  — VULN-008 (S4823 / command injection): exec with user-controlled input
app.post('/api/notify', (req, res) => {
  const { orderId } = req.body;
  // VULN: orderId injected directly into shell command — e.g. "1; rm -rf /"
  exec(`echo "New order received: ${orderId}"`, (err, stdout) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: stdout });
  });
});

// POST /api/orders
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
    token: generateOrderToken(), // VULN-003: insecure token
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  // VULN-009 (S4792): sensitive order data (customer name, total) dumped to log
  console.log(`[ORDER] #${order.id} by ${order.customerName} — $${order.total} — token=${order.token}`);

  res.status(201).json(order);
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`🍽️  Restaurant API running at http://localhost:${PORT}`);
});
