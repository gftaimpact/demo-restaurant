{"operations":[
{"operation":"REPLACE","lineNumber":3,"content":"const path = require('node:path');"},
{"operation":"REPLACE","lineNumber":4,"content":"const fs = require('node:fs');"},
{"operation":"REPLACE","lineNumber":5,"content":"const crypto = require('node:crypto');"},
{"operation":"REPLACE","lineNumber":6,"content":"const { exec } = require('node:child_process');"},
{"operation":"REPLACE","lineNumber":13,"content":"app.use(cors({ origin: 'https://trusted.restaurant.com' }));"},
{"operation":"REPLACE","lineNumber":18,"content":"const ADMINPASSWORD = process.env.ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex');"},
{"operation":"REPLACE","lineNumber":23,"content":"  return crypto.randomBytes(12).toString('hex');"},
{"operation":"REPLACE","lineNumber":28,"content":"  return crypto.createHash('sha256').update(password).digest('hex');"},
{"operation":"REPLACE","lineNumber":50,"content":"  appliedDiscount = parseFloat(discount);"},
{"operation":"REPLACE","lineNumber":65,"content":"  const regex = new RegExp(name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i');"},
{"operation":"REPLACE","lineNumber":75,"content":"  const safeFile = path.basename(file); const filePath = path.join(__dirname, 'data', safeFile);"},
{"operation":"REPLACE","lineNumber":85,"content":"  exec(`echo New order received ${Number(orderId)}`, (err, stdout) => {"},
{"operation":"REPLACE","lineNumber":133,"content":"console.log(`ORDER ${order.id} processed successfully`);"}
]}
