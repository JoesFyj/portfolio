import { useState } from 'react'
import {
  Rss, Image, Share2, Database,
  Play, CheckCircle, Loader,
  ChevronRight, Sparkles, Edit3, Volume2,
  RotateCcw, Lightbulb
} from 'lucide-react'

const STEPS = [
  { key: 'topic',   label: '选题',    icon: Sparkles, desc: '确定文章主题' },
  { key: 'write',   label: '文案',    icon: Edit3,    desc: '生成完整文章' },
  { key: 'cover',   label: '封面',    icon: Image,    desc: '生成封面图' },
  { key: 'wechat',  label: '公众号',  icon: Rss,      desc: '推送至公众号' },
  { key: 'xhs',     label: '小红书',  icon: Share2,   desc: '推送至小红书' },
  { key: 'bitable', label: '多维表',  icon: Database, desc: '录入多维表' },
  { key: 'audio',   label: '音频',    icon: Volume2,  desc: '生成播报音频' },
]

const INITIAL_STATE = {
  topic:   { status: 'idle', mode: 'manual', topicText: '', topicList: [], selectedTopic: '' },
  write:   { status: 'idle', title: '', content: '', wordCount: 0 },
  cover:   { status: 'idle', wechatUrl: '', xhsUrl: '' },
  wechat:  { status: 'idle', draftUrl: '' },
  xhs:     { status: 'idle', draftUrl: '' },
  bitable: { status: 'idle', recordId: '' },
  audio:   { status: 'idle', audioUrl: '', duration: 0 },
}

export default function SelfMedia({ lang, theme }) {
  const isDark = theme === 'dark'
  const isZh = lang === 'zh'

  const bg         = isDark ? '#111110' : '#FAF9F6'
  const text       = isDark ? '#FAFAF8' : '#1C1C1E'
  const muted      = isDark ? '#8B8B87' : '#6B6860'
  const cardBg     = isDark ? '#1C1C1E' : '#FFFFFF'
  const cardBorder = isDark ? '#2C2C2A' : '#E8E5DF'
  const inputBg    = isDark ? 'rgba(255,255,255,0.05)' : '#FAFAF6'
  const barBg      = isDark ? 'rgba(255,255,255,0.05)' : '#E8E5DF'
  const stepIdle   = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
  const stepBdr    = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  const mutedLight = isDark ? 'rgba(139,139,135,0.6)' : '#A8A29E'

  const cs = (extra = {}) => ({ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '1rem', ...extra })

  const [states, setStates] = useState(INITIAL_STATE)
  const [expandedStep, setExpandedStep] = useState('topic')
  const [topicMode, setTopicMode] = useState('manual')
  const [topicText, setTopicText] = useState('')

  function isDone(key) { return states[key].status === 'done' }
  function isActive(key) { return expandedStep === key }
  function canExec(key) {
    const idx = STEPS.findIndex(s => s.key === key)
    if (idx === 0) return states[STEPS[0].key].status === 'idle'
    return isDone(STEPS[idx - 1].key) && states[key].status === 'idle'
  }
  const allDone = STEPS.every(s => isDone(s.key))
  const completedCount = STEPS.filter(s => isDone(s.key)).length
  const progress = Math.round((completedCount / STEPS.length) * 100)

  async function runStep(stepKey) {
    setStates(prev => ({ ...prev, [stepKey]: { ...prev[stepKey], status: 'loading' } }))
    setExpandedStep(stepKey)
    await new Promise(r => setTimeout(r, 1800))

    const topic = states.topic
    const results = {
      topic: {
        status: 'done', mode: topicMode, topicText,
        topicList: topicMode === 'auto' ? [
          '我在AI浪潮里，反而把手机放下了',
          '被AI控住的三年，没人告诉的真相',
          '从田埂到书桌：我的AI自媒体之路',
        ] : [],
        selectedTopic: topicMode === 'auto' ? '我在AI浪潮里，反而把手机放下了' : topicText || '我在AI浪潮里，反而把手机放下了',
      },
      write: {
        status: 'done',
        title: topic.selectedTopic || '我在AI浪潮里，反而把手机放下了',
        content: `三年前，我买了一套自媒体课。每天花4小时在手机上——找选题、刷同行、剪视频、回复评论。结果账号没做起来，眼睛越来越差，脾气越来越躁。

后来我才明白：不是AI没用，是我自己用错了方法。

一年后重新开始。不追热点，不日更，不研究算法。只做一件事：让AI帮我写，我负责想。每天两小时，写一篇。三个月后，阅读量稳定在三四千。

AI不是灵丹妙药，但它能把创作从4小时压缩到1小时。省下来的时间，我用来读书、跑步、陪家人。`,
        wordCount: 186,
      },
      cover:   { status: 'done', wechatUrl: '/cover_wechat.jpg', xhsUrl: '/cover_xhs.jpg' },
      wechat:  { status: 'done', draftUrl: 'https://mp.weixin.qq.com' },
      xhs:     { status: 'done', draftUrl: 'https://creator.xiaohongshu.com' },
      bitable: { status: 'done', recordId: 'recvg42Y5oGHuv' },
      audio:   { status: 'done', audioUrl: '/ai_news_final.mp3', duration: 210 },
    }

    setStates(prev => ({ ...prev, [stepKey]: { ...prev[stepKey], ...results[stepKey] } }))
  }

  function goBackTo(key) {
    const idx = STEPS.findIndex(s => s.key === key)
    const resetKeys = STEPS.slice(idx).map(s => s.key)
    setStates(prev => {
      const next = { ...prev }
      resetKeys.forEach(k => { next[k] = { ...INITIAL_STATE[k] } })
      return next
    })
    setExpandedStep(key)
  }

  function resetAll() {
    setStates(INITIAL_STATE)
    setExpandedStep('topic')
    setTopicText('')
  }

  return (
    <section id="selfmedia" className="py-24 px-6" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto">

        {/* 标题 */}
        <div className="mb-16">
          <span className="section-label">
            <span className="text-2xl font-bold" style={{ color: isDark ? '#2C2C2A' : '#D4C9B8' }}>03</span>
            Self Media
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: text }}>
            内容创作中心
          </h2>
          <p className="mt-2 text-sm" style={{ color: muted }}>分步执行 · 内容可见 · 可返回重做</p>
          <div className="accent-bar mt-4" />
        </div>

        {/* 进度条卡片 */}
        <div style={cs({ padding: '1.25rem', marginBottom: '2rem' })}>
          <div className="flex justify-between text-xs mb-3">
            <span style={{ color: muted }}>发布流水线</span>
            <span style={{ color: text }}>{completedCount} / {STEPS.length} 步完成</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: barBg }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(to right, #D97706, #F59E0B)' }} />
          </div>

          {/* 步骤图标 */}
          <div className="flex items-center justify-between mt-4 overflow-x-auto">
            {STEPS.map((step, i) => {
              const done = isDone(step.key)
              const active = expandedStep === step.key
              const iconBg = done ? 'rgba(217,119,6,0.2)' : active ? 'rgba(217,119,6,0.1)' : stepIdle
              const iconBdr = done ? 'rgba(217,119,6,0.4)' : active ? 'rgba(217,119,6,0.3)' : stepBdr
              const iconCol = done || active ? '#D97706' : muted
              const lblCol  = done ? 'rgba(217,119,6,0.7)' : active ? muted : mutedLight

              return (
                <div key={step.key} className="flex items-center min-w-0">
                  <div className="flex flex-col items-center gap-1 px-1">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                      style={{ background: iconBg, border: `1px solid ${iconBdr}`, color: iconCol }}>
                      {done ? '✓' : <step.icon size={12} />}
                    </div>
                    <span className="text-xs whitespace-nowrap" style={{ color: lblCol }}>{step.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-4 h-px mx-0.5 shrink-0 rounded"
                      style={{ background: isDone(step.key) ? 'rgba(217,119,6,0.4)' : stepBdr }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 选题区 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(217,119,6,0.2)', border: '1px solid rgba(217,119,6,0.4)' }}>
              <Sparkles size={11} style={{ color: '#D97706' }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: text }}>第一步 · 选题</span>
            {isDone('topic') && <CheckCircle size={13} style={{ color: '#22C55E' }} />}
          </div>

          {states.topic.status === 'idle' && (
            <div className="flex gap-2 mb-3">
              {[{ key: 'manual', zh: '手动输入' }, { key: 'auto', zh: 'AI 自动选题' }].map(({ key, zh }) => (
                <button key={key} onClick={() => setTopicMode(key)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                  style={topicMode === key
                    ? { background: 'rgba(217,119,6,0.15)', borderColor: 'rgba(217,119,6,0.4)', color: '#D97706' }
                    : { borderColor: cardBorder, color: muted }
                  }>
                  {zh}
                </button>
              ))}
            </div>
          )}

          {topicMode === 'manual' && states.topic.status === 'idle' && (
            <div>
              <textarea
                value={topicText}
                onChange={e => setTopicText(e.target.value)}
                placeholder="输入文章主题或方向..."
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm resize-none transition-colors"
                style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: text, outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
              />
              <div className="flex justify-end mt-2">
                <button onClick={() => runStep('topic')} disabled={!topicText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={topicText.trim()
                    ? { background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#D97706' }
                    : { opacity: 0.4, color: muted, cursor: 'not-allowed', border: `1px solid ${cardBorder}` }
                  }>
                  <Lightbulb size={13} />
                  确定选题
                </button>
              </div>
            </div>
          )}

          {topicMode === 'auto' && states.topic.status === 'idle' && (
            <button onClick={() => runStep('topic')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#D97706' }}>
              <Sparkles size={13} />
              让 AI 帮我选题
            </button>
          )}

          {(states.topic.status === 'loading' || states.topic.status === 'done') && (
            <div className="mt-1">
              {states.topic.status === 'loading' && (
                <div className="flex items-center gap-2 py-3 text-sm" style={{ color: '#3B82F6' }}>
                  <Loader size={13} className="animate-spin" />
                  AI 选题中...
                </div>
              )}
              {states.topic.status === 'done' && (
                <StepContent step="topic" state={states.topic} text={text} muted={muted} cardBg={cardBg} cardBorder={cardBorder} inputBg={inputBg} />
              )}
            </div>
          )}
        </div>

        {/* 其他步骤 */}
        <div className="space-y-2 mb-8">
          {STEPS.slice(1).map(step => (
            <StepCard
              key={step.key}
              step={step}
              stepState={states[step.key]}
              isActive={isActive(step.key)}
              isDone={isDone(step.key)}
              canExec={canExec(step.key)}
              onExpand={() => setExpandedStep(isActive(step.key) ? null : step.key)}
              onAction={() => runStep(step.key)}
              onBack={() => goBackTo(step.key)}
              text={text} muted={muted} cardBg={cardBg} cardBorder={cardBorder} inputBg={inputBg}
            />
          ))}
        </div>

        {/* 全部完成 */}
        {allDone && (
          <div style={cs({ padding: '1.5rem', textAlign: 'center', borderColor: 'rgba(34,197,94,0.2)' })}>
            <div className="text-lg font-semibold mb-1" style={{ color: '#22C55E' }}>全链路完成</div>
            <div className="text-sm mb-4" style={{ color: muted }}>文章已推送至双平台，多维表已录入，音频已生成</div>
            <button onClick={resetAll}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#D97706' }}>
              开始下一篇
            </button>
          </div>
        )}

        {/* 底部提示 */}
        {!allDone && (
          <div style={cs({ padding: '1rem' })}>
            <div className="text-xs leading-relaxed" style={{ color: muted }}>
              <span style={{ color: text }} className="font-medium">使用说明：</span>
              选题（手动/AI） → 确定后解锁后续步骤 → 每步完成后展开可查看内容 → 点击 ↺ 可返回重做。
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

// ===================== StepCard =====================
function StepCard({ step, stepState, isActive, isDone, canExec, onExpand, onAction, onBack, text, muted, cardBg, cardBorder, inputBg }) {
  const Icon = step.icon
  const [showContent, setShowContent] = useState(false)

  const sDone   = { background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: 'rgba(34,197,94,0.25)' }
  const sActive  = { background: 'rgba(217,119,6,0.15)', color: '#D97706', border: 'rgba(217,119,6,0.3)' }
  const sIdle    = { background: cardBg, color: muted, border: cardBorder }

  const s = isDone ? sDone : isActive ? sActive : sIdle
  const borderColor = isDone ? 'rgba(34,197,94,0.2)' : isActive ? 'rgba(217,119,6,0.3)' : cardBorder

  return (
    <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '1rem', overflow: 'hidden' }}>
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-all"
        onClick={() => { setShowContent(v => !v); onExpand() }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: s.background, color: s.color, border: `1px solid ${s.border}` }}>
          {isDone ? <CheckCircle size={16} /> : <Icon size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: text }}>{step.label}</span>
            {isDone && <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>✓</span>}
            {isActive && !isDone && <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(217,119,6,0.15)', color: '#D97706' }}>进行中</span>}
          </div>
          <div className="text-xs" style={{ color: muted }}>{step.desc}</div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isDone && (
            <button onClick={e => { e.stopPropagation(); onBack() }}
              className="p-1.5 rounded-lg transition-all" style={{ color: muted }} title="重做此步骤">
              <RotateCcw size={13} />
            </button>
          )}
          {canExec && !isDone && (
            <button onClick={e => { e.stopPropagation(); onAction() }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#D97706' }}>
              <Play size={11} />
              执行
            </button>
          )}
          <ChevronRight size={14} style={{ color: muted, transform: showContent ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </div>

      {showContent && (
        <div className="px-5 pb-5 pt-4 space-y-2" style={{ borderTop: `1px solid ${cardBorder}` }}>
          <StepContent step={step.key} state={stepState} text={text} muted={muted} cardBg={cardBg} cardBorder={cardBorder} inputBg={inputBg} />
        </div>
      )}
    </div>
  )
}

// ===================== StepContent =====================
function StepContent({ step, state, text, muted, cardBg, cardBorder, inputBg }) {
  const s = state

  if (s.status === 'loading') {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: '#3B82F6' }}>
        <Loader size={14} className="animate-spin" />
        处理中，请稍候...
      </div>
    )
  }
  if (s.status === 'idle') return <div className="text-xs py-2" style={{ color: muted }}>点击上方「执行」开始此步骤</div>
  if (s.status !== 'done') return null

  const boxStyle = { background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.75rem' }

  switch (step) {
    case 'topic':
      if (s.mode === 'auto' && s.topicList.length > 0) {
        return (
          <div className="space-y-2">
            <div className="text-xs" style={{ color: muted }}>点击选择选题：</div>
            {s.topicList.map((t, i) => (
              <div key={i} className="p-3 rounded-xl cursor-pointer transition-all"
                style={{ border: `1px solid ${cardBorder}`, background: inputBg }}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                    style={s.selectedTopic === t ? { borderColor: '#D97706', background: 'rgba(217,119,6,0.2)' } : { borderColor: cardBorder }}>
                    {s.selectedTopic === t && <CheckCircle size={10} style={{ color: '#D97706' }} />}
                  </div>
                  <span className="text-sm" style={{ color: text }}>{t}</span>
                </div>
              </div>
            ))}
          </div>
        )
      }
      if (s.selectedTopic) {
        return (
          <div className="p-3 rounded-xl" style={boxStyle}>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#22C55E' }}>
              <CheckCircle size={13} />
              选题已确认
            </div>
            <div className="text-sm mt-1 ml-5" style={{ color: text }}>{s.selectedTopic}</div>
          </div>
        )
      }
      return null

    case 'write':
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl" style={{ background: inputBg, border: `1px solid ${cardBorder}` }}>
            <div className="text-xs mb-1" style={{ color: muted }}>文章标题</div>
            <div className="text-sm font-semibold" style={{ color: text }}>{s.title}</div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1" style={{ color: muted }}>
              <span>正文内容</span><span>{s.wordCount} 字</span>
            </div>
            <div className="p-3 rounded-xl max-h-40 overflow-y-auto" style={{ background: inputBg, border: `1px solid ${cardBorder}` }}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: muted }}>{s.content}</div>
            </div>
          </div>
        </div>
      )

    case 'cover':
    case 'wechat':
    case 'xhs':
    case 'bitable':
    case 'audio':
      return (
        <div className="p-3 rounded-xl" style={boxStyle}>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#22C55E' }}>
            <CheckCircle size={13} />
            {step === 'cover' && '封面图已生成'}
            {step === 'wechat' && '已推送至公众号草稿箱'}
            {step === 'xhs' && '已推送至小红书草稿箱'}
            {step === 'bitable' && `已录入多维表 (${s.recordId || '—'})`}
            {step === 'audio' && `音频已生成 (约${Math.round((s.duration || 0) / 60)}分钟)`}
          </div>
        </div>
      )

    default:
      return null
  }
}
