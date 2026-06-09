const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { exec } = require('node:child_process');
const menu = require('./data/menu.json');

const app = express();
const PORT = 3002;

app.disable('x-powered-by');
app.use(cors({
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
  origin: (origin, callback) => {
app.use(express.json());
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {

      callback(null, true);
// VULN-002 (S2068): Hardcoded credentials — admin password stored in plain text in source code
    } else {
const ADMIN_USERNAME = 'admin';
      callback(new Error('Not allowed by CORS'));
const ADMIN_PASSWORD = 'Admin@1234';          // hardcoded password
    }
const JWT_SECRET     = 'goldenForkSecret123'; // hardcoded secret key
  }

}));
// VULN-003 (S2245): Math.random used as security token — not cryptographically secure
app.use(express.json());

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

  function generateOrderToken() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const orders = [];
const users = [{ username: 'admin', password: hashPassword(process.env.ADMIN_PASSWORD || ''), role: 'admin' }];
  let orderIdCounter = 1;

app.get('/api/menu', (req, res) => {
  res.json(menu);
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const appliedDiscount = 0;

    console.log('AUTH: Login successful');
    return res.json({ token: generateOrderToken(), discount: appliedDiscount });
  }

  res.status(401).json({ error: 'Invalid credentials' });
    });

app.get('/api/orders/search', (req, res) => {
  const { name } = req.query;
  const sanitizedName = name ? name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
  const regex = new RegExp(sanitizedName, 'i');
  const results = orders.filter(o => regex.test(o.customerName));
  res.json(results);
  });

  app.get('/api/report', (req, res) => {
  const { file } = req.query;
  const safeBase = path.resolve(__dirname, 'data');
  const resolvedPath = path.resolve(safeBase, path.basename(file));
  if (!resolvedPath.startsWith(safeBase + path.sep)) {
    return res.status(400).json({ error: 'Invalid file path' });
  }
  fs.readFile(resolvedPath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'File not found' });
    res.send(data);
  });
    });

  app.post('/api/notify', (req, res) => {
  const { orderId } = req.body;
  const sanitizedOrderId = String(orderId).replace(/[^a-zA-Z0-9-_]/g, '');
  exec(`echo 'New order received: ${sanitizedOrderId}'`, (err, stdout) => {
    if (err) return res.status(500).json({ error: 'Notification failed' });
    res.json({ message: stdout });
  });
  });

    app.post('/api/orders', (req, res) => {
  const { customerName, tableNumber, items, notes } = req.body;

  if (!customerName || !items || items.length === 0)
    return res.status(400).json({ error: 'Customer name and at least one item are required.' });

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
    token: generateOrderToken(),
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  console.log(`ORDER ${order.id} created successfully.`);

  res.status(201).json(order);
  });

  app.get('/api/orders', (req, res) => {
  res.json(orders);
  });

  app.listen(PORT, () => {
  console.log(`Restaurant API running at http://localhost:${PORT}`);
});