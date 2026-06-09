{
  "operations": [
    {
      "operation": "REPLACE",
      "lineNumber": 3,
      "content": "const path = require('node:path');"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 4,
      "content": "const fs = require('node:fs');"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 5,
      "content": "const crypto = require('node:crypto');"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 6,
      "content": "const { execFile } = require('node:child_process');"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 9,
      "content": "const app = express(); app.disable('x-powered-by');"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 13,
      "content": "app.use(cors({ origin: 'https://trusted-domain.com' }));"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 18,
      "content": "const ADMINPASSWORD = process.env.ADMIN_PASSWORD || ''; // Removed hardcoded password"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 23,
      "content": "function generateOrderToken() {"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 24,
      "content": "  return crypto.randomUUID();"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 28,
      "content": "  return crypto.createHash('sha256').update(password).digest('hex');"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 50,
      "content": "    appliedDiscount = parseFloat(discount); // safely parsed discount"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 54,
      "content": "  console.log('AUTH Login OK, discount applied', appliedDiscount); // Sensitive data removed"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 65,
      "content": "  const safeName = name.replace(/[^a-zA-Z0-9\\s]/g, ''); const regex = new RegExp(safeName, 'i');"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 74,
      "content": "  const baseDir = path.join(__dirname, 'data'); const safeFile = path.basename(file); const filePath = path.join(baseDir, safeFile);"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 85,
      "content": "  execFile('echo', [`New order received ${orderId}`], (err, stdout) => {"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 133,
      "content": "  console.log('ORDER created', { id: order.id, total: order.total }); // avoid sensitive info in logs"
    }
  ]
}
