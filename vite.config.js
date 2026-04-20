import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const env = loadEnv('development', process.cwd(), '')
Object.assign(process.env, env)

// DeepSeek 总结接口（开发环境）
async function handleSummarize(req, res) {
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })

  req.on('end', async () => {
    let text
    try {
      ;({ text } = JSON.parse(body || '{}'))
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid JSON' }))
      return
    }

    if (!text || text.trim().length < 20) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: '内容太短，请输入至少20个字符' }))
      return
    }

    const apiKey = process.env.DEEPSEEK_API_KEY

    if (!apiKey) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: '本地未配置 DeepSeek API Key，请参考 .env.example 配置 .env.local' }))
      return
    }

    const prompt = `你是一个内容提炼专家。请从以下内容中提炼出核心信息，返回纯JSON格式（不要包含任何其他文字）：

{
  "title": "提取的核心标题（不超过12个字）",
  "points": [
    {
      "label": "核心词（2-4个字，精炼有冲击力）",
      "short": "一句话补充说明（5-10字）",
      "desc": "详细解释（15-30字，要具体有说服力）"
    }
  ]
}

重要规则：
- 如果原文明确提到了几个维度/角度（如"三个方面"、"刚需性、高频次、有门槛"、"三点：XXX、XXX、XXX"），必须严格按照原文列出的维度生成对应数量的points，一个不多一个不少，label必须使用原文中的关键词
- 如果原文没有明确分类，则按内容自然分出的主题点提取，通常3-5个
- label 要简洁有力，吸引眼球
- desc 要具体，能让人快速理解
- 严格返回JSON，不要任何解释文字

内容如下：
${text.trim()}`

    try {
      const mmRes = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: '你是一个内容提炼专家。请严格返回JSON格式，不要包含任何解释文字。' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      })

      if (!mmRes.ok) {
        const err = await mmRes.text()
        res.writeHead(502, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: `DeepSeek API 错误: ${mmRes.status}` }))
        return
      }

      const data = await mmRes.json()
      const content = (data.choices?.[0]?.message?.content || '').trim()

      if (!content) {
        console.log('DeepSeek raw response:', JSON.stringify(data))
        res.writeHead(502, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'AI返回内容为空' }))
        return
      }

      try {
        const jsonStr = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
        const parsed = JSON.parse(jsonStr)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(parsed))
      } catch {
        console.error('AI parse error, content was:', content)
        res.writeHead(502, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'AI返回格式错误，请重试' }))
      }
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
  })

  req.on('error', e => {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: e.message }))
  })
}

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [],
  },
  plugins: [
    react(),
    {
      name: 'deepseek-summarize',
      configureServer(server) {
        server.middlewares.use('/api/summarize', (req, res) => {
          if (req.method === 'POST') {
            handleSummarize(req, res)
          } else {
            res.writeHead(405, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Method not allowed' }))
          }
        })
      },
    },
  ],
})
