// 获取飞书 Access Token（从环境变量读取）
async function getFeishuToken() {
  const appId = process.env.FEISHU_APP_ID
  const appSecret = process.env.FEISHU_APP_SECRET
  if (!appId || !appSecret) {
    throw new Error('FEISHU_APP_ID 或 FEISHU_APP_SECRET 未配置')
  }
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  })
  const data = await res.json()
  if (!data.tenant_access_token) throw new Error('获取飞书token失败: ' + JSON.stringify(data))
  return data.tenant_access_token
}

export { getFeishuToken }

// 读取记录列表
export async function listRecords(appToken, tableId, pageSize = 20) {
  const token = await getFeishuToken()
  const res = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=${pageSize}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.json()
}

// 创建记录
export async function createRecord(appToken, tableId, fields) {
  const token = await getFeishuToken()
  const res = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ fields }),
    }
  )
  return res.json()
}

// 更新记录
export async function updateRecord(appToken, tableId, recordId, fields) {
  const token = await getFeishuToken()
  const res = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ fields }),
    }
  )
  return res.json()
}
