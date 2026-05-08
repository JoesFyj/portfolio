import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, User, Sparkles } from 'lucide-react'

// 快捷问题
const QUICK_QUESTIONS = [
  '你是谁？',
  '你在做什么项目？',
  '怎么联系你？',
  '你的愿景是什么？',
]

// 系统提示词 - 基于 USER.md 的内容
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
- 爷爷：瘫痪前一直在干活，挖药、种地，说"挖药给孙子挣娶媳妇的钱"
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

export default function AIAssistant({ theme }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '你好！我是小福的AI数字分身。可以帮你了解我的故事、项目和想法。有什么想问的？',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const isDark = theme === 'dark'
  const bg = isDark ? '#0D1117' : '#FFFFFF'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#F8F7F4'
  const assistantBg = isDark ? '#21262D' : '#F0EFEA'

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 调用大模型 API
  async function callLLM(userMessage) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 用户需要替换为自己的 API Key
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      if (!response.ok) {
        throw new Error('API 调用失败')
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || '抱歉，我暂时无法回答。'
    } catch (error) {
      console.error('LLM Error:', error)
      // 降级：使用本地预设回答
      return getLocalResponse(userMessage)
    }
  }

  // 本地预设回答（降级方案）
  function getLocalResponse(question) {
    const q = question.toLowerCase()
    if (q.includes('谁') || q.includes('介绍')) {
      return '我是小福，甘肃深山里走出来的普通人。30岁，在职老师，正在用AI给自己造一条自由的路。'
    }
    if (q.includes('项目') || q.includes('做什么')) {
      return '目前在做一个多Agent内容创作系统，7个AI Agent帮我24小时运营自媒体。还有一个VideoGenerator，一键生成动画视频。'
    }
    if (q.includes('联系') || q.includes('找')) {
      return '可以通过页面底部的联系方式找到我，或者关注我的公众号「小福AI自由」。'
    }
    if (q.includes('愿景') || q.includes('梦想') || q.includes('目标')) {
      return '我的梦想很简单：一家小书店，一个朴素的健身房，每天阅读、跑步，接娃做饭陪家人。少工作，多赚钱，以书为粮，以路为行。'
    }
    return '这是个好问题。我还在学习和成长中，可以换个方式问我，或者通过页面底部的联系方式直接找我聊。'
  }

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    const reply = await callLLM(userMsg)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  function handleQuickQuestion(q) {
    setInput(q)
    // 自动发送
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} }
      handleSend()
    }, 100)
  }

  return (
    <>
      {/* 悬浮按钮 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)',
            boxShadow: '0 4px 20px rgba(45,106,79,0.4)',
          }}
        >
          <Sparkles size={24} color="#fff" />
        </button>
      )}

      {/* 对话窗口 */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] rounded-2xl shadow-2xl overflow-hidden"
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
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)' }}
              >
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: text }}>AI 助手</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs" style={{ color: muted }}>在线</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg transition-colors hover:bg-black/5"
              style={{ color: muted }}
            >
              <X size={18} />
            </button>
          </div>

          {/* 消息区 */}
          <div className="h-[320px] overflow-y-auto p-4 space-y-4" style={{ background: bg }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
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
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)' }}
                >
                  <Bot size={16} color="#fff" />
                </div>
                <div
                  className="rounded-2xl px-4 py-2.5 flex items-center gap-1"
                  style={{ background: assistantBg }}
                >
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
                style={{
                  background: input.trim() ? '#2D6A4F' : 'transparent',
                }}
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
