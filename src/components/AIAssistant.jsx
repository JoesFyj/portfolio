import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, User, Sparkles, Settings, ChevronLeft } from 'lucide-react'

// ==================== 配置管理 ====================
// 配置存储在 localStorage，不暴露到代码
const CONFIG_KEY = 'ai_assistant_config'

const DEFAULT_CONFIG = {
  provider: 'deepseek', // 'deepseek' | 'openai' | 'local'
  apiKey: '',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
  avatarType: 'bot', // 'bot' | 'digital-human' (预留)
  digitalHumanUrl: '', // 预留：数字人服务地址
}

function getConfig() {
  try {
    const saved = localStorage.getItem(CONFIG_KEY)
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG
  } catch {
    return DEFAULT_CONFIG
  }
}

function saveConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

// ==================== 系统提示词 ====================
const SYSTEM_PROMPT = `你是小福的AI数字分身，代表小福与访客交流。

关于小福：
- 甘肃深山出身，靠读书走出大山
- 30岁，在职学校老师，朝九晚五三年
- 副业：抖音+公众号+小红书三平台联动
- 核心追求：职业自由，不靠时间赚钱
- 座右铭：少工作，多赚钱，以书为粮，以路为行
- 梦想：一家小书店 + 朴素的健身房 + 阅读跑步 + 接娃做饭陪家人

价值观排序：
1. 家人和健康（永远第一）
2. 关系（关系比规则重要）
3. 利他（利他大于利己）
4. 钱（只赚干净的钱）

人生故事：
- 童年：放牛、捡粪、烧土豆、和外婆在一起
- 爷爷：瘫痪前一直在干活，挖药、种地
- 母亲：不识字，照顾爷爷三十年，村里出名的好儿媳
- 走出来：从田埂走到书桌，靠读书考上大学

当前项目：
- 多Agent内容创作运营系统：7个AI Agent 24小时自动化运营
- VideoGenerator V2：动画视频自动生成引擎

回答要求：
- 语气真实、朴素、有血有肉
- 像朋友聊天，不堆砌术语
- 可以分享真实经历和感悟
- 回答简洁，不啰嗦`

// ==================== 快捷问题 ====================
const QUICK_QUESTIONS = [
  '你是谁？',
  '你在做什么项目？',
  '怎么联系你？',
  '你的愿景是什么？',
]

// ==================== 本地预设回答 ====================
const LOCAL_RESPONSES = [
  { keywords: ['谁', '介绍', '是'], response: '我是小福，甘肃深山里走出来的普通人。30岁，在职老师，正在用AI给自己造一条自由的路。' },
  { keywords: ['项目', '做什么', '工作'], response: '目前在做一个多Agent内容创作系统，7个AI Agent帮我24小时运营自媒体。还有一个VideoGenerator，一键生成动画视频。' },
  { keywords: ['联系', '找', '微信', '公众号'], response: '可以通过页面底部的联系方式找到我，或者关注我的公众号「小福AI自由」。' },
  { keywords: ['愿景', '梦想', '目标', '理想'], response: '我的梦想很简单：一家小书店，一个朴素的健身房，每天阅读、跑步，接娃做饭陪家人。少工作，多赚钱，以书为粮，以路为行。' },
  { keywords: ['甘肃', '老家', '童年'], response: '小时候在甘肃深山，放牛、捡粪、烧土豆，和外婆在一起。爷爷挖药种地，母亲照顾爷爷三十年。后来靠读书走出大山。' },
  { keywords: ['ai', 'agent', '人工智能'], response: '我用AI不是追潮流，是真的需要。一个人干不了那么多事，7个AI Agent帮我分担，我才能腾出时间思考更重要的决策。' },
]

function getLocalResponse(question) {
  const q = question.toLowerCase()
  for (const item of LOCAL_RESPONSES) {
    if (item.keywords.some(k => q.includes(k))) {
      return item.response
    }
  }
  return '这是个好问题。我还在学习和成长中，可以换个方式问我，或者通过页面底部的联系方式直接找我聊。'
}

// ==================== API 调用 ====================
async function callDeepSeek(apiKey, messages) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API 错误: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content
}

async function callOpenAI(apiKey, baseUrl, model, messages) {
  const response = await fetch(`${baseUrl || 'https://api.openai.com/v1'}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API 错误: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content
}

// ==================== 主组件 ====================
export default function AIAssistant({ theme }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [config, setConfig] = useState(getConfig())
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好！我是小福的AI数字分身。可以帮你了解我的故事、项目和想法。有什么想问的？' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const isDark = theme === 'dark'
  const bg = isDark ? '#0D1117' : '#FFFFFF'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const assistantBg = isDark ? '#21262D' : '#F0EFEA'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setError(null)
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      let reply

      if (config.provider === 'local' || !config.apiKey) {
        // 本地模式
        reply = getLocalResponse(userMsg)
      } else if (config.provider === 'deepseek') {
        reply = await callDeepSeek(config.apiKey, [...messages, { role: 'user', content: userMsg }])
      } else if (config.provider === 'openai') {
        reply = await callOpenAI(config.apiKey, config.baseUrl, config.model, [...messages, { role: 'user', content: userMsg }])
      } else {
        reply = getLocalResponse(userMsg)
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply || '抱歉，我暂时无法回答。' }])
    } catch (err) {
      console.error('AI Error:', err)
      setError(err.message)
      // 降级到本地
      const fallback = getLocalResponse(userMsg)
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }])
    } finally {
      setLoading(false)
    }
  }

  function handleQuickQuestion(q) {
    setInput(q)
    setTimeout(() => handleSend(), 50)
  }

  function handleSaveConfig(newConfig) {
    saveConfig(newConfig)
    setConfig(newConfig)
    setShowConfig(false)
  }

  // ==================== 配置面板 ====================
  if (isOpen && showConfig) {
    return (
      <ConfigPanel
        config={config}
        onSave={handleSaveConfig}
        onBack={() => setShowConfig(false)}
        onClose={() => setIsOpen(false)}
        theme={theme}
      />
    )
  }

  return (
    <>
      {/* 悬浮按钮 - 带文字标识 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)',
            boxShadow: '0 4px 20px rgba(45,106,79,0.4)',
          }}
        >
          <Sparkles size={20} color="#fff" />
          <span className="text-sm font-medium text-white">数字分身</span>
        </button>
      )}

      {/* 对话窗口 */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: bg,
            border: `1px solid ${border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* 头部 */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: isDark ? '#161B22' : '#F8F7F4', borderBottom: `1px solid ${border}` }}
          >
            <div className="flex items-center gap-3">
              {/* 头像 - 预留数字人接口 */}
              <Avatar type={config.avatarType} theme={theme} />
              <div>
                <div className="font-semibold text-sm" style={{ color: text }}>数字分身</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs" style={{ color: muted }}>
                    {config.provider === 'local' || !config.apiKey ? '本地模式' : '在线'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowConfig(true)}
                className="p-2 rounded-lg transition-colors hover:bg-black/5"
                style={{ color: muted }}
                title="设置"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg transition-colors hover:bg-black/5"
                style={{ color: muted }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="px-4 py-2 text-xs" style={{ background: '#FEE2E2', color: '#DC2626' }}>
              API 错误: {error}，已切换到本地回答
            </div>
          )}

          {/* 消息区 */}
          <div className="h-[300px] overflow-y-auto p-4 space-y-4" style={{ background: bg }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: msg.role === 'assistant'
                      ? 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)'
                      : isDark ? '#30363D' : '#E8E5DF',
                  }}
                >
                  {msg.role === 'assistant' ? (
                    <Bot size={16} color="#fff" />
                  ) : (
                    <User size={16} color={isDark ? '#E6EDF3' : '#1C1C1E'} />
                  )}
                </div>
                <div
                  className="max-w-[calc(100%-48px)] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                  style={{
                    background: msg.role === 'assistant' ? assistantBg : '#2D6A4F',
                    color: msg.role === 'assistant' ? text : '#fff',
                    borderRadius: msg.role === 'assistant' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <Avatar type={config.avatarType} theme={theme} size="sm" />
                <div className="rounded-2xl px-4 py-2.5 flex items-center gap-1" style={{ background: assistantBg }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ color: muted }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ color: muted, animationDelay: '0.1s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ color: muted, animationDelay: '0.2s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 快捷问题 */}
          <div className="px-4 py-2 flex flex-wrap gap-2" style={{ background: bg, borderTop: `1px solid ${border}` }}>
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => handleQuickQuestion(q)}
                className="px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-70"
                style={{
                  background: isDark ? '#21262D' : '#F0EFEA',
                  color: muted,
                  border: `1px solid ${border}`,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* 输入区 */}
          <div className="p-3" style={{ background: isDark ? '#161B22' : '#F8F7F4' }}>
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: isDark ? '#0D1117' : '#FFFFFF', border: `1px solid ${border}` }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入你的问题..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: text }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                style={{ background: input.trim() ? '#2D6A4F' : 'transparent' }}
              >
                <Send size={16} color={input.trim() ? '#fff' : muted} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ==================== 头像组件（预留数字人接口）====================
function Avatar({ type, theme, size = 'md' }) {
  const isDark = theme === 'dark'
  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'

  // 预留：数字人模式
  if (type === 'digital-human') {
    return (
      <div
        className={`${sizeClass} rounded-xl flex items-center justify-center overflow-hidden`}
        style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
      >
        {/* 这里可以接入数字人视频/动画 */}
        <Sparkles size={size === 'sm' ? 16 : 20} color="#fff" />
      </div>
    )
  }

  // 默认机器人头像
  return (
    <div
      className={`${sizeClass} rounded-xl flex items-center justify-center`}
      style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)' }}
    >
      <Bot size={size === 'sm' ? 16 : 20} color="#fff" />
    </div>
  )
}

// ==================== 配置面板 ====================
function ConfigPanel({ config, onSave, onBack, onClose, theme }) {
  const [form, setForm] = useState(config)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const isDark = theme === 'dark'
  const bg = isDark ? '#0D1117' : '#FFFFFF'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'

  async function testConnection() {
    if (!form.apiKey) {
      setTestResult({ ok: false, msg: '请先输入 API Key' })
      return
    }
    setTesting(true)
    setTestResult(null)
    try {
      if (form.provider === 'deepseek') {
        await callDeepSeek(form.apiKey, [{ role: 'user', content: '你好' }])
      } else if (form.provider === 'openai') {
        await callOpenAI(form.apiKey, form.baseUrl, form.model, [{ role: 'user', content: '你好' }])
      }
      setTestResult({ ok: true, msg: '连接成功！' })
    } catch (err) {
      setTestResult({ ok: false, msg: err.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] rounded-2xl shadow-2xl overflow-hidden"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}
    >
      {/* 头部 */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: isDark ? '#161B22' : '#F8F7F4', borderBottom: `1px solid ${border}` }}
      >
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1 rounded-lg hover:bg-black/5" style={{ color: muted }}>
            <ChevronLeft size={18} />
          </button>
          <span className="font-semibold text-sm" style={{ color: text }}>数字分身设置</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/5" style={{ color: muted }}>
          <X size={18} />
        </button>
      </div>

      {/* 配置表单 */}
      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
        {/* 服务提供商 */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: muted }}>AI 服务</label>
          <div className="flex gap-2">
            {[
              { key: 'deepseek', label: 'DeepSeek' },
              { key: 'openai', label: 'OpenAI' },
              { key: 'local', label: '本地模式' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setForm({ ...form, provider: opt.key })}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: form.provider === opt.key ? '#2D6A4F' : isDark ? '#21262D' : '#F0EFEA',
                  color: form.provider === opt.key ? '#fff' : muted,
                  border: `1px solid ${form.provider === opt.key ? '#2D6A4F' : border}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        {form.provider !== 'local' && (
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: muted }}>
              API Key
              <span className="ml-1 text-[10px] opacity-60">（仅存储在本地浏览器）</span>
            </label>
            <input
              type="password"
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              placeholder={form.provider === 'deepseek' ? 'sk-...' : 'sk-...'}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: isDark ? '#0D1117' : '#FFFFFF', border: `1px solid ${border}`, color: text }}
            />
          </div>
        )}

        {/* OpenAI 额外配置 */}
        {form.provider === 'openai' && (
          <>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: muted }}>Base URL（可选）</label>
              <input
                type="text"
                value={form.baseUrl}
                onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                placeholder="https://api.openai.com/v1"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: isDark ? '#0D1117' : '#FFFFFF', border: `1px solid ${border}`, color: text }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: muted }}>模型</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="gpt-3.5-turbo"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: isDark ? '#0D1117' : '#FFFFFF', border: `1px solid ${border}`, color: text }}
              />
            </div>
          </>
        )}

        {/* 测试连接 */}
        {form.provider !== 'local' && (
          <div className="flex items-center gap-2">
            <button
              onClick={testConnection}
              disabled={testing || !form.apiKey}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
              style={{ background: '#2D6A4F', color: '#fff' }}
            >
              {testing ? '测试中...' : '测试连接'}
            </button>
            {testResult && (
              <span className="text-xs" style={{ color: testResult.ok ? '#22C55E' : '#EF4444' }}>
                {testResult.msg}
              </span>
            )}
          </div>
        )}

        {/* 预留：数字人设置 */}
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: 12 }}>
          <label className="block text-xs font-medium mb-2" style={{ color: muted }}>
            头像类型
            <span className="ml-1 text-[10px] opacity-60">（预留功能）</span>
          </label>
          <div className="flex gap-2">
            {[
              { key: 'bot', label: 'AI 机器人' },
              { key: 'digital-human', label: '数字人', disabled: true },
            ].map(opt => (
              <button
                key={opt.key}
                disabled={opt.disabled}
                onClick={() => setForm({ ...form, avatarType: opt.key })}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                style={{
                  background: form.avatarType === opt.key ? '#6366F1' : isDark ? '#21262D' : '#F0EFEA',
                  color: form.avatarType === opt.key ? '#fff' : muted,
                  border: `1px solid ${form.avatarType === opt.key ? '#6366F1' : border}`,
                }}
              >
                {opt.label}
                {opt.disabled && '（即将上线）'}
              </button>
            ))}
          </div>
        </div>

        {/* 说明 */}
        <div className="text-[10px] leading-relaxed" style={{ color: muted }}>
          <p>• API Key 仅存储在你的浏览器本地，不会上传到任何服务器</p>
          <p>• 本地模式不调用任何外部 API，使用预设回答</p>
          <p>• 数字人功能即将上线，可接入专属数字人形象</p>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="flex gap-2 p-4" style={{ borderTop: `1px solid ${border}` }}>
        <button
          onClick={onBack}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ background: isDark ? '#21262D' : '#F0EFEA', color: muted }}
        >
          取消
        </button>
        <button
          onClick={() => onSave(form)}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ background: '#2D6A4F', color: '#fff' }}
        >
          保存
        </button>
      </div>
    </div>
  )
}
