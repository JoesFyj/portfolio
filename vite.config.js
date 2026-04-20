import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const env = loadEnv('development', process.cwd(), '')
Object.assign(process.env, env)

// 飞书 token
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

// DeepSeek
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

// DeepSeek 总结接口
async function handleSummarize(req, res) {
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })
  req.on('end', async () => {
    let text
    try { ({ text } = JSON.parse(body || '{}')) } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid JSON' })); return
    }
    if (!text || text.trim().length < 20) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: '内容太短' })); return
    }
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'DeepSeek API Key 未配置' })); return
    }
    try {
      const mmRes = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: '你是一个内容提炼专家。请严格返回JSON格式，不要包含任何解释文字。' },
            { role: 'user', content: `你是一个内容提炼专家。请从以下内容中提炼出核心信息，返回纯JSON格式：\n\n{\n  "title": "提取的核心标题（不超过12个字）",\n  "points": [{"label": "核心词（2-4个字）","short": "一句话补充说明（5-10字）","desc": "详细解释（15-30字）"}]\n}\n\n内容如下：\n${text.trim()}` },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      })
      if (!mmRes.ok) { res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'DeepSeek API 错误' })); return }
      const data = await mmRes.json()
      const content = (data.choices?.[0]?.message?.content || '').trim()
      if (!content) { res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'AI返回为空' })); return }
      try {
        const jsonStr = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(JSON.parse(jsonStr)))
      } catch {
        res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'JSON解析错误' }))
      }
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: e.message }))
    }
  })
}

// 内容创作链路 API
async function handleWrite(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Method not allowed' })); return
  }
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })
  req.on('end', async () => {
    let parsed
    try { parsed = JSON.parse(body || '{}') } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Invalid JSON' })); return
    }
    const { action, fields } = parsed

    try {
      // 选题列表
      if (action === 'list_topics') {
        const { app_token, table_id } = fields
        const token = await getFeishuToken()
        const response = await fetch(
          `https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records?page_size=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await response.json()
        if (!response.ok) { res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: '飞书API错误', detail: data })); return }
        const items = (data.data?.items || []).map(r => ({
          record_id: r.record_id,
          title: r.fields['📌 选题库'] || r.fields['标题候选'] || '',
          category: r.fields['分类'] || '',
          priority: r.fields['优先级'] || '',
          status: r.fields['状态'] || '',
          source: r.fields['选题来源'] || '',
          angle: r.fields['选题角度'] || '',
        }))
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ items, has_more: data.data?.has_more || false }))
        return
      }

      // 文案生成
      if (action === 'write') {
        const { topic, category, framework, has_story, target_audience, article_type } = fields
        
        // 根据文章类型调整字数和风格
        const typeConfig = {
          'long': { wordCount: '1000-1500字', style: '深度长文，三层递进，每层展开充分' },
          'koubo': { wordCount: '600-900字', style: '口播稿，开头3秒抓人，节奏快，金句可截图' },
          'short': { wordCount: '300-500字', style: '短文章，一针见血，核心观点+一句话论据' },
        }
        const config = typeConfig[article_type] || typeConfig['koubo']

        const systemPrompt = `你是小福老师，一个从甘肃深山走出来的自媒体创作者。

你的风格：真实、朴素、有血有肉。

写作铁律（必须严格遵守）：
1. 禁止破折号「——」
2. 不硬融个人故事，故事是加分项不是必要项
3. 开头只有两种模式（二选一，随机使用）：
   - 结论先行：强结论（一句话带力度词）+ 现象支撑 + 过渡句
   - 反问句开头：反问（直接戳痛点）+ 人群 + 行动 + 证据
4. 结尾金句必须用「不是...是...」句式，且必须跟开头核心论点呼应
5. 禁止胡编数字和故事
6. 故事要灵活用，讲完一层后预判读者反驳，扎进去共鸣
7. 思维拆解每层回答：是什么→为什么→还有什么局限

${config.style}

字数要求：${config.wordCount}

结构要求：
1. 开头（强结论或反问句，三要素齐全）
2. 现象/故事（支撑第一层）
3. 预判反驳→读者代入
4. 第一层：观点+机制+局限
5. 第二层：观点+机制+局限
6. 第三层：观点+机制+局限（口播稿/短文章可省略）
7. 照镜子（你以为你不是，其实你是）
8. 执行路径（2-3个，「你以为X？错。」反问带出，不用序号）
9. 结尾金句（呼应开头，用「不是...是...」句式）

只输出纯文案，不要任何解释或分析。`

        const content = await deepseek(
          `请根据以上规则，写一篇${config.style}的自媒体文案。

核心论点：${topic}
分类：${category || '成长认知'}
目标人群：${target_audience || '想做自媒体/副业的人'}
${has_story === 'yes' ? '可以用个人故事（甘肃深山、放牛、爷爷挖药、母亲）来支撑观点' : '不用个人故事'}

注意：
- 字数严格控制在 ${config.wordCount}
- 开头必须完整，不能半句话
- 结尾必须用「不是...是...」句式`,
          systemPrompt
        )
        const lines = content.split('\n').filter(l => l.trim())
        const title = lines.find(l => l.trim().length > 2 && l.trim().length < 35 && !l.startsWith('#')) || topic
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ title, content: lines.join('\n'), wordCount: content.length, article_type }))
        return
      }

      // 录入多维表
      if (action === 'save_to_bitable') {
        const { title, content, category, platform, framework, word_count, topic_record_id } = fields
        const token = await getFeishuToken()
        const response = await fetch(
          `https://open.feishu.cn/open-apis/bitable/v1/apps/T9GPbvSvyanRwrsSaHjc2m0Wnle/tables/tblCpFs6xT8pIkQT/records`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ fields: {
              '✍️ 文案库': title,
              '分类': category || '成长认知',
              '平台': platform || ['抖音'],
              '内容框架': framework || '破立结构',
              '脚本正文': content,
              '字数': Math.round(content.length / 2),
              '封面文案': title,
              '关联素材': topic_record_id || '',
              '文案状态': '已定稿',
            } }),
          }
        )
        const data = await response.json()
        if (!response.ok) { res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: '录入失败', detail: data })); return }
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ record_id: data.data?.record?.record_id }))
        return
      }

      // 多平台格式化
      if (action === 'format_content') {
        const { content, title, platforms } = fields || {}
        if (!content) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: '内容为空' })); return }
        const wechat = `【${title}】\n\n${content.split('\n').filter(l => l.trim()).map(l => l.trim()).join('\n\n')}`
        const emojis = ['💡', '🌿', '📖', '✨', '🔥', '💪', '🎯', '🧠']
        const emoji = emojis[Math.floor(Math.random() * emojis.length)]
        const xhs = `${emoji} ${title}\n\n${
          content.split('\n').filter(l => l.trim()).slice(0, 8).map(l => l.trim().substring(0, 150)).join('\n\n')
        }\n\n# WaytoAGI # 个人成长 # 自媒体 # 小福老师`
        const result = {}
        if (platforms?.includes('wechat')) result.wechat = wechat
        if (platforms?.includes('xhs')) result.xhs = xhs
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(result))
        return
      }

      // TTS
      if (action === 'tts') {
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ hint: '前端使用 TTS 工具生成音频' }))
        return
      }

      res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: '未知action: ' + action }))
    } catch (e) {
      console.error('Write API error:', e)
      res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: e.message }))
    }
  })
}

export default defineConfig({
  optimizeDeps: { exclude: [] },
  plugins: [
    react(),
    {
      name: 'portfolio-apis',
      configureServer(server) {
        server.middlewares.use('/api/summarize', (req, res) => {
          if (req.method === 'POST') handleSummarize(req, res)
          else { res.writeHead(405, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Method not allowed' })) }
        })
        server.middlewares.use('/api/write', (req, res) => {
          if (req.method === 'POST') handleWrite(req, res)
          else { res.writeHead(405, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Method not allowed' })) }
        })
      },
    },
  ],
})
