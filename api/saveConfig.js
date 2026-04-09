export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const config = req.body
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'public', 'config.json')
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2))
    return res.status(200).json({ ok: true, saved: Object.keys(config).length + ' keys' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
