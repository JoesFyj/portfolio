// 获取飞书 Access Token
async function getFeishuToken() {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET,
    }),
  })
  const data = await response.json()
  return data.tenant_access_token
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { action, app_token, table_id, record_id, fields } = req.body

  try {
    const token = await getFeishuToken()

    if (action === 'list_records') {
      // 获取选题库记录
      const response = await fetch(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records?page_size=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json()
      if (!response.ok) {
        return res.status(502).json({ error: '飞书API错误', detail: data })
      }
      return res.status(200).json(data)
    }

    if (action === 'create_record') {
      // 创建新记录
      const response = await fetch(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fields }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        return res.status(502).json({ error: '飞书API错误', detail: data })
      }
      return res.status(200).json(data)
    }

    if (action === 'update_record') {
      // 更新记录
      const response = await fetch(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/${record_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fields }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        return res.status(502).json({ error: '飞书API错误', detail: data })
      }
      return res.status(200).json(data)
    }

    return res.status(400).json({ error: '未知action' })
  } catch (e) {
    console.error('Feishu API error:', e)
    return res.status(500).json({ error: e.message })
  }
}
