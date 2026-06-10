const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { exec } = require('node:child_process');
const menu = require('./data/menu.json');

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 3002;


app.use(cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000' }));
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
  const { username, password, discount } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    let appliedDiscount = 0;
    if (discount !== undefined && discount !== null) {
      }
        appliedDiscount = parsedDiscount;
      if (!isNaN(parsedDiscount) && parsedDiscount >= 0 && parsedDiscount <= 100) {
      const parsedDiscount = parseFloat(discount);
    }
    console.log('AUTH: Login OK', { discount: appliedDiscount });
    return res.json({ token: generateOrderToken(), discount: appliedDiscount });
  }

  res.status(401).json({ error: 'Invalid credentials' });
    });






app.get('/api/orders/search', (req, res) => {
  const { name } = req.query;
  const safeName = name ? name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
  const regex = new RegExp(safeName, 'i');
  const results = orders.filter(o => regex.test(o.customerName));
  res.json(results);
});


app.get('/api/report', (req, res) => {
  const { file } = req.query;
  const safeBasePath = path.resolve(__dirname, 'data');
  const filePath = path.resolve(safeBasePath, path.basename(file));
  }
    return res.status(400).json({ error: 'Invalid file path.' });
  if (!filePath.startsWith(safeBasePath + path.sep)) {
  fs.readFile(filePath, 'utf8', (err, data) => {
  });
    res.send(data);
    if (err) return res.status(404).json({ error: 'File not found.' });




app.post('/api/notify', (req, res) => {
  const { orderId } = req.body;
  const safeOrderId = parseInt(orderId, 10);
  if (isNaN(safeOrderId)) return res.status(400).json({ error: 'Invalid order ID.' });
  exec(`echo 'New order received: ${safeOrderId}'`, (err, stdout) => {
    if (err) return res.status(500).json({ error: 'Notification failed.' });
  });
    res.json({ message: stdout });



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
    token: generateOrderToken(),
    createdAt: new Date().toISOString(),
  };

  orders.push(order);

  console.log('ORDER created', { id: order.id, itemCount: order.items.length });

  res.status(201).json(order);
});


app.get('/api/orders', (req, res) => {
  res.json(orders);
});


  app.listen(PORT, () => {
  console.log(`Restaurant API running at http://localhost:${PORT}`);
});