// 飞书 token 获取
async function getFeishuToken() {
  const appId = process.env.FEISHU_APP_ID
  const appSecret = process.env.FEISHU_APP_SECRET
  if (!appId || !appSecret) throw new Error('FEISHU_APP_ID / FEISHU_APP_SECRET 未配置')
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  })
  const data = await res.json()
  if (!data.tenant_access_token) throw new Error('飞书token获取失败')
  return data.tenant_access_token
}

// DeepSeek 调用
async function deepseek(prompt, system = '你是一个专业的内容创作者。') {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY 未配置')
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2500,
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { action, fields } = req.body
  try {
    // ============ 选题：读取飞书选题库 ============
    if (action === 'list_topics') {
      const { app_token, table_id } = fields
      const token = await getFeishuToken()
      const response = await fetch(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records?page_size=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()
      if (!response.ok) return res.status(502).json({ error: '飞书API错误', detail: data })
      // 提取有用字段返回
      const items = (data.data?.items || []).map(r => ({
        record_id: r.record_id,
        title: r.fields['📌 选题库'] || r.fields['标题候选'] || '',
        category: r.fields['分类'] || '',
        priority: r.fields['优先级'] || '',
        status: r.fields['状态'] || '',
        source: r.fields['选题来源'] || '',
        angle: r.fields['选题角度'] || '',
      }))
      return res.status(200).json({ items, has_more: data.data?.has_more || false })
    }

    // ============ 文案：根据选题生成内容 ============
    if (action === 'write') {
      const { topic, category, framework, has_story, target_audience } = fields

      const systemPrompt = `你是小福老师，一个从甘肃深山走出来的自媒体创作者。
你的风格：真实、朴素、有血有肉。
写作铁律（必须遵守）：
1. 禁止破折号「——」
2. 不硬融个人故事，故事是加分项不是必要项
3. 开头只有两种模式：结论先行 / 反问句开头
4. 结尾金句必须用「不是...是...」句式，且跟开头核心论点呼应
5. 禁止胡编数字和故事
6. 故事要灵活用，不是固定设定

结构要求：
1. 开头（强结论或反问句）
2. 现象/故事（支撑第一层）
3. 预判反驳→读者代入
4. 第一层：观点+机制+局限
5. 第二层：观点+机制+局限
6. 第三层：观点+机制+局限
7. 照镜子（你以为你不是，其实你是）
8. 执行路径（2-3个，「你以为X？错。」反问带出，不用序号）
9. 结尾金句（呼应开头）

只输出纯文案，不要任何解释或分析。`

      const content = await deepseek(
        `根据以下信息写一篇完整的自媒体文案：\n核心论点：${topic}\n分类：${category}\n目标人群：${target_audience || '想做自媒体/副业的人'}\n框架：${framework || '破立结构'}\n${has_story === 'yes' ? '可以用个人故事' : '不用个人故事'}`,
        systemPrompt
      )

      const lines = content.split('\n').filter(l => l.trim())
      const title = lines.find(l => l.trim().length > 2 && l.trim().length < 35 && !l.startsWith('#')) || topic
      const pureContent = lines.join('\n')
      const wordCount = pureContent.replace(/[\u4e00-\u9fff]/g, 'xx').length // 估算

      return res.status(200).json({ title, content: pureContent, wordCount })
    }

    // ============ 录入多维表 ============
    if (action === 'save_to_bitable') {
      const { title, content, category, platform, framework, word_count, topic_record_id } = fields
      const token = await getFeishuToken()

      const recordFields = {
        '✍️ 文案库': title,
        '分类': category || '成长认知',
        '平台': platform || ['抖音'],
        '内容框架': framework || '破立结构',
        '脚本正文': content,
        '字数': Math.round((content.length) / 2),
        '封面文案': title,
        '关联素材': topic_record_id || '',
        '文案状态': '已定稿',
      }

      const response = await fetch(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/T9GPbvSvyanRwrsSaHjc2m0Wnle/tables/tblCpFs6xT8pIkQT/records`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ fields: recordFields }),
        }
      )
      const data = await response.json()
      if (!response.ok) return res.status(502).json({ error: '录入失败', detail: data })
      return res.status(200).json({ record_id: data.data?.record?.record_id, data })
    }

    // ============ TTS 音频生成 ============
    if (action === 'tts') {
      const { text } = req.body
      if (!text || text.length < 10) return res.status(400).json({ error: '内容太短' })
      // 前端使用 TTS 工具，这里只返回确认
      return res.status(200).json({ text_length: text.length, hint: '前端使用 TTS 工具生成音频' })
    }

    return res.status(400).json({ error: '未知action: ' + action })
  } catch (e) {
    console.error('API error:', e)
    return res.status(500).json({ error: e.message })
  }
}
