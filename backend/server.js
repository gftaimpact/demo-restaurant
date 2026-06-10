const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { execFile } = require('node:child_process');
const menu = require('./data/menu.json');

const app = express();
app.disable('x-powered-by');
const PORT = 3002;

// VULN-001 (S5122): CORS wildcard — accepts requests from ANY origin, including malicious ones
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// VULN-002 (S2068): Hardcoded credentials — admin password stored in plain text in source code
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// VULN-003 (S2245): Math.random used as security token — not cryptographically secure
function generateOrderToken() {
  return 'tok-' + crypto.randomBytes(16).toString('hex');
}

// VULN-004 (S4790): MD5 used for hashing — weak cryptographic algorithm
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// In-memory stores
const orders = [];
const users = [{ username: 'admin', password: hashPassword(process.env.ADMIN_PASSWORD || 'changeme'), role: 'admin' }];
let orderIdCounter = 1;

// GET /api/menu
app.get('/api/menu', (req, res) => {
  res.json(menu);
});

// POST /api/login  — VULN-005 (S2068 + S5247): hardcoded creds + eval on user input
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // VULN-005a: comparing against hardcoded credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

    return res.json({ token: generateOrderToken() });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});








// GET /api/orders/search?name=  — VULN-006 (S2631): ReDoS via uncontrolled regex from user input
app.get('/api/orders/search', (req, res) => {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid search parameter' });
  }
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedName, 'i');
  const results = orders.filter(o => regex.test(o.customerName));

  res.json(results);
// GET /api/report?file=  — VULN-007 (S6096 / path traversal): unsanitized file path from user
});

  app.get('/api/report', (req, res) => {
  const { file } = req.query;
  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'File parameter is required' });
  }
  const safeFile = path.basename(file);
  const filePath = path.join(__dirname, 'data', safeFile);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'File not found' });
    res.send(data);
// POST /api/notify  — VULN-008 (S4823 / command injection): exec with user-controlled input
  });

});
  app.post('/api/notify', (req, res) => {
  const { orderId } = req.body;
  if (!orderId || typeof orderId !== 'string' || !/^[a-zA-Z0-9-]+$/.test(orderId)) {
    return res.status(400).json({ error: 'Invalid orderId' });
  }
  execFile('echo', ['New order received', orderId], (err, stdout) => {
    if (err) return res.status(500).json({ error: 'Notification failed' });
    res.json({ message: stdout });
  });
// POST /api/orders
});
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
  console.log(`ORDER #${order.id} created`);

  res.status(201).json(order);
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`🍽️  Restaurant API running at http://localhost:${PORT}`);
});
