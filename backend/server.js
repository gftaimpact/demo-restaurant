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


app.use(cors({ origin: process.env.CORS_ALLOWED_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());


const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';


function generateOrderToken() {
  return 'tok_' + crypto.randomBytes(12).toString('hex');
}


function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// In-memory stores
const orders = [];
const users = [{ username: 'admin', password: hashPassword(ADMIN_PASSWORD), role: 'admin' }];
let orderIdCounter = 1;

// GET /api/menu
app.get('/api/menu', (req, res) => {
  res.json(menu);
});


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ token: generateOrderToken() });
  }

  res.status(401).json({ error: 'Invalid credentials' });
      });










// GET /api/orders/search?name=
app.get('/api/orders/search', (req, res) => {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid search parameter' });
  }
  const sanitized = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(sanitized, 'i');
  const results = orders.filter((o) => regex.test(o.customerName));
  res.json(results);
});

  // GET /api/report?file=
  app.get('/api/report', (req, res) => {
  const { file } = req.query;
  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'File parameter is required' });
  }
  const baseDir = path.resolve(__dirname, 'data');
  const filePath = path.resolve(baseDir, path.basename(file));
  if (!filePath.startsWith(baseDir)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'File not found' });
    res.send(data);
  });
    });


// POST /api/notify
app.post('/api/notify', (req, res) => {
  const { orderId } = req.body;
  if (!orderId || typeof orderId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(orderId)) {
    return res.status(400).json({ error: 'Invalid orderId' });
  }
  execFile('echo', ['New order received', orderId], (err, stdout) => {
    if (err) return res.status(500).json({ error: 'Notification failed' });
    res.json({ message: stdout });
  });
});


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
    token: generateOrderToken(),
    createdAt: new Date().toISOString(),
  };

  orders.push(order);

  console.log(`ORDER #${order.id} created at ${order.createdAt}`);

  res.status(201).json(order);
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`🍽️  Restaurant API running at http://localhost:${PORT}`);
});
