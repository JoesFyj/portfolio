import { useState } from 'react'
import { X, Sparkles, RefreshCw, Check, Edit3, FileText } from 'lucide-react'

const API_KEY_STORAGE_KEY = 'deepseek_api_key'
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || ''
}

async function callDeepSeek(messages, apiKey) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
    }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content
}

// 本地降级回答
function getLocalOutline(topic, type) {
  if (type === 'reading') {
    return `我将围绕「${topic}」这本书/这个主题，按以下结构撰写读书笔记：

1. **核心观点** — 这本书/主题最打动你的1-2个观点
2. **触动片段** — 引用原文或具体案例，说明为什么重要
3. **联系实际** — 这个观点如何改变你的认知或行为
4. **行动启发** — 读完之后你打算怎么做

（当前为离线模式，连接 DeepSeek API 可获得更优质的大纲）`
  }
  return `我将围绕「${topic}」这个主题，按以下结构撰写跑步/运动笔记：

1. **背景** — 这次跑步/训练的背景和状态
2. **过程记录** — 距离、配速、感受
3. **突破点** — 这次有什么进步或感悟
4. **复盘启发** — 对训练或生活的启发

（当前为离线模式，连接 DeepSeek API 可获得更优质的大纲）`
}

function getLocalArticle(topic, outline, type) {
  return `## ${topic}

${outline}

---

（这是本地生成的简版内容。要获得完整深度文章，请在设置中填入 DeepSeek API Key。

DeepSeek API 申请地址：<ADDRESS_REDACTED>

接入后，AI 将为你生成完整文章，支持反复修改和润色。）`
}

export default function AIWriter({ type = 'reading', record, onSave }) {
  const [step, setStep] = useState('input') // input | outline | article
  const [topic, setTopic] = useState('')
  const [outline, setOutline] = useState('')
  const [article, setArticle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [apiKey, setApiKey] = useState(getApiKey())

  const theme = document.documentElement.getAttribute('data-theme') || 'dark'
  const isDark = theme === 'dark'
  const textColor = isDark ? '#E6EDF3' : '#1C1C1E'
  const mutedColor = isDark ? '#8B949E' : '#6B6860'
  const borderColor = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const inputBg = isDark ? '#0D1117' : '#F6F6F4'
  const accentColor = '#2D6A4F'

  async function generateOutline() {
    setLoading(true)
    setError('')
    try {
      const key = apiKey.trim()
      if (key) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key)
        const messages = [
          { role: 'system', content: '你是一个优秀的内容大纲设计师。用户会给你一个主题，请你生成一份清晰的文章大纲，包含4-6个要点，每个要点用一两句话说明。' },
          { role: 'user', content: `请为「${topic}」这个${type === 'reading' ? '读书笔记' : '跑步笔记'}主题生成文章大纲。` },
        ]
        const result = await callDeepSeek(messages, key)
        setOutline(result)
      } else {
        setOutline(getLocalOutline(topic, type))
      }
      setStep('outline')
    } catch (e) {
      setError('API 调用失败，使用本地大纲：' + e.message)
      setOutline(getLocalOutline(topic, type))
      setStep('outline')
    } finally {
      setLoading(false)
    }
  }

  async function generateArticle() {
    setLoading(true)
    setError('')
    try {
      const key = apiKey.trim()
      if (key) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key)
        const messages = [
          { role: 'system', content: `你是一个优秀的内容创作者，擅长写${type === 'reading' ? '读书笔记' : '运动/跑步笔记'}。文章要有真实感，有细节，有共鸣，不空洞。` },
          { role: 'user', content: `请基于以下主题和大纲，写一篇完整文章。\n\n主题：${topic}\n\n大纲：\n${outline}\n\n要求：字数800-1500字，有真实感和细节。` },
        ]
        const result = await callDeepSeek(messages, key)
        setArticle(result)
      } else {
        setArticle(getLocalArticle(topic, outline, type))
      }
      setStep('article')
    } catch (e) {
      setError('API 调用失败，使用本地简版：' + e.message)
      setArticle(getLocalArticle(topic, outline, type))
      setStep('article')
    } finally {
      setLoading(false)
    }
  }

  function handleSave() {
    onSave && onSave({ topic, outline, article })
    setStep('input')
    setTopic('')
    setOutline('')
    setArticle('')
  }

  function handleCancel() {
    setStep('input')
    setTopic('')
    setOutline('')
    setArticle('')
    setError('')
  }

  if (step === 'input') {
    return (
      <div className="mt-3 p-4 rounded-xl border" style={{ borderColor, background: cardBg }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} style={{ color: accentColor }} />
          <span className="text-sm font-medium" style={{ color: textColor }}>
            AI 写作助手
          </span>
        </div>
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder={type === 'reading' ? '输入书名或主题，如：认知觉醒' : '输入跑步主题，如：半程马拉松训练复盘'}
          className="w-full px-3 py-2 rounded-lg border text-sm"
          style={{ background: inputBg, borderColor, color: textColor }}
          onKeyDown={e => e.key === 'Enter' && topic.trim() && generateOutline()}
        />
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={generateOutline}
            disabled={!topic.trim() || loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
            style={{ background: accentColor, opacity: (!topic.trim() || loading) ? 0.5 : 1 }}
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Edit3 size={14} />}
            生成大纲
          </button>
          <button onClick={handleCancel} className="px-3 py-2 rounded-lg text-sm" style={{ color: mutedColor }}>
            取消
          </button>
        </div>
        {error && <p className="text-xs mt-2" style={{ color: '#EF4444' }}>{error}</p>}
        <p className="text-xs mt-2" style={{ color: mutedColor }}>
          {type === 'reading' ? '💡 输入书名或读书主题，AI 帮你生成笔记大纲' : '💡 输入跑步/运动主题，AI 帮你生成训练笔记大纲'}
        </p>
      </div>
    )
  }

  if (step === 'outline') {
    return (
      <div className="mt-3 p-4 rounded-xl border" style={{ borderColor, background: cardBg }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText size={16} style={{ color: accentColor }} />
            <span className="text-sm font-medium" style={{ color: textColor }}>大纲预览</span>
          </div>
          <button onClick={handleCancel} className="p-1 rounded" style={{ color: mutedColor }}>
            <X size={14} />
          </button>
        </div>
        <div className="text-sm whitespace-pre-wrap rounded-lg p-3 mb-3" style={{ background: inputBg, color: textColor }}>
          {outline}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateArticle}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
            style={{ background: accentColor, opacity: loading ? 0.5 : 1 }}
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            生成全文
          </button>
          <button
            onClick={() => { setStep('input'); setOutline('') }}
            className="px-3 py-2 rounded-lg text-sm border"
            style={{ borderColor, color: mutedColor }}
          >
            重新输入
          </button>
        </div>
      </div>
    )
  }

  // article step
  return (
    <div className="mt-3 p-4 rounded-xl border" style={{ borderColor, background: cardBg }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Check size={16} style={{ color: accentColor }} />
          <span className="text-sm font-medium" style={{ color: textColor }}>文章预览</span>
        </div>
        <button onClick={handleCancel} className="p-1 rounded" style={{ color: mutedColor }}>
          <X size={14} />
        </button>
      </div>
      <div
        className="text-sm whitespace-pre-wrap rounded-lg p-3 mb-3 overflow-y-auto"
        style={{ background: inputBg, color: textColor, maxHeight: '300px' }}
      >
        {article}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
          style={{ background: accentColor }}
        >
          <Check size={14} />
          保存并插入
        </button>
        <button
          onClick={generateArticle}
          disabled={loading}
          className="px-3 py-2 rounded-lg text-sm border flex items-center gap-2"
          style={{ borderColor, color: mutedColor }}
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          重新生成
        </button>
        <button
          onClick={() => { setStep('outline') }}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ color: mutedColor }}
        >
          返回大纲
        </button>
      </div>
    </div>
  )
}
