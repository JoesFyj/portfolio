export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text } = req.body

  if (!text || text.trim().length < 20) {
    return res.status(400).json({ error: '内容太短，请输入至少20个字符' })
  }

  if (text.trim().length > 8000) {
    return res.status(400).json({ error: '内容过长，请控制在8000字以内' })
  }

  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'DeepSeek API 未配置，请联系站长' })
  }

  // 双模式：原内容 + 精炼格式（供中国风用）
  const prompt = `你是一个内容提炼专家。请从以下内容中提炼出核心信息，返回纯JSON格式（不要包含任何其他文字）：

{
  "title": "提取的核心标题（不超过12个字）",
  "points": [
    {
      "label": "核心词（2-4个字，精炼有冲击力）",
      "short": "一句话补充说明（5-10字）",
      "desc": "详细解释（15-30字，要具体有说服力）",
      "formatted": "精炼格式：事件描述（4-8字）：核心感悟（4-8字），共10-16字"
    }
  ]
}

重要规则：
- 如果原文明确提到了几个维度/角度（如"三个方面"、"刚需性、高频次、有门槛"、"三点：XXX、XXX、XXX"），必须严格按照原文列出的维度生成对应数量的points，一个不多一个不少，label必须使用原文中的关键词
- 如果原文没有明确分类，则按内容自然分出的主题点提取，通常3-5个
- label 要简洁有力，吸引眼球
- desc 要具体，能让人快速理解
- formatted 字段：这是给中国风样式专用的精炼格式，格式为"数字. 事件描述：核心感悟"，每个部分4-8字，整体控制在10-16字，必须包含核心洞察，参考例子：至亲逝去：悟离别懂珍惜、疾病突袭：知健康是根本、创业失败：懂风险与现实、情感背叛：看透人心冷暖
- 严格返回JSON，不要任何解释文字

内容如下：
${text.trim()}`

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个内容提炼专家。请严格返回JSON格式，不要包含任何解释文字。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('DeepSeek API error:', response.status, err)
      return res.status(502).json({ error: `DeepSeek API 错误: ${response.status}` })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content?.trim()

    if (!content) {
      return res.status(502).json({ error: 'AI返回内容为空' })
    }

    // 尝试解析 JSON（可能带有markdown代码块）
    let parsed
    try {
      const jsonStr = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
      parsed = JSON.parse(jsonStr)
    } catch (e) {
      console.error('JSON parse error:', content)
      return res.status(502).json({ error: 'AI返回格式错误，请重试' })
    }

    // 基本校验（接受3-6个点）
    if (!parsed.title || !Array.isArray(parsed.points) || parsed.points.length < 1) {
      return res.status(502).json({ error: 'AI返回数据格式不符合要求，请重试' })
    }

    return res.status(200).json(parsed)
  } catch (e) {
    console.error('Summarize error:', e)
    return res.status(500).json({ error: `服务器错误: ${e.message}` })
  }
}