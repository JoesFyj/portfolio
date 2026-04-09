export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify cron secret (optional security)
  const authHeader = req.headers.authorization
  const CRON_SECRET = process.env.CRON_SECRET || 'xiaofu2026'
  if (authHeader && authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Trigger OpenClaw agent to run monitoring
    const OPENCLAW_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789'
    const OPENCLAW_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || ''

    // Try to notify via OpenClaw gateway if available
    try {
      await fetch(`${OPENCLAW_URL}/api/cron/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
        },
        body: JSON.stringify({
          jobId: 'daily-monitor',
          action: 'run',
        }),
        signal: AbortSignal.timeout(5000),
      })
    } catch (e) {
      // OpenClaw not reachable, that's fine for serverless
    }

    // Save a timestamp to public/config.json to indicate cron ran
    const fs = require('fs')
    const path = require('path')
    const cronFile = path.join(process.cwd(), 'public', 'cron-status.json')
    const status = {
      lastCronRun: new Date().toISOString(),
      nextCronRun: new Date(Date.now() + 86400000).toISOString(),
    }
    fs.writeFileSync(cronFile, JSON.stringify(status, null, 2))

    return res.status(200).json({
      ok: true,
      message: 'Daily monitoring triggered',
      ...status,
    })
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message })
  }
}
