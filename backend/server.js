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
      "content": "const app = express();"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 13,
      "content": "app.use(require('cors')({ origin: 'https://yourdomain.com' }));"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 18,
      "content": "const ADMINPASSWORD = process.env.ADMIN_PASSWORD;"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 19,
      "content": "const JWTSECRET = process.env.JWT_SECRET;"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 23,
      "content": "  return crypto.randomBytes(16).toString('hex');"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 28,
      "content": "  return crypto.createHash('sha256').update(password).digest('hex');"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 50,
      "content": "    appliedDiscount = Number(discount) || 0; // sanitized numeric input"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 65,
      "content": "  const safeName = name ? name.replace(/[^\\w\\s]/gi, '') : '';"
    },
    {
      "operation": "INSERT",
      "lineNumber": 65,
      "content": "  const regex = new RegExp(safeName, 'i');"
    },
    {
      "operation": "DELETE",
      "lineNumber": 66
    },
    {
      "operation": "REPLACE",
      "lineNumber": 75,
      "content": "  const safeFile = path.basename(file);"
    },
    {
      "operation": "INSERT",
      "lineNumber": 75,
      "content": "  const filePath = path.join(__dirname, 'data', safeFile);"
    },
    {
      "operation": "DELETE",
      "lineNumber": 76
    },
    {
      "operation": "REPLACE",
      "lineNumber": 85,
      "content": "  execFile('echo', [`New order received ${orderId}`], (err, stdout) => {"
    },
    {
      "operation": "REPLACE",
      "lineNumber": 133,
      "content": "console.log(`ORDER ${order.id} created successfully.`);"
    }
  ]
}
