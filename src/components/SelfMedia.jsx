import { useState } from 'react'
import {
  Rss, Image, Share2, Database,
  Play, CheckCircle, Loader,
  ChevronRight, Sparkles, Edit3, Volume2,
  RotateCcw, Lightbulb, ExternalLink
} from 'lucide-react'

const STEPS = [
  { key: 'topic',   label: '选题',    icon: Sparkles, desc: '从选题库读取' },
  { key: 'write',   label: '文案',    icon: Edit3,    desc: 'AI生成完整文章' },
  { key: 'cover',   label: '封面',    icon: Image,    desc: '生成封面图' },
  { key: 'wechat',  label: '公众号',  icon: Rss,      desc: '格式化文案推送到公众号' },
  { key: 'xhs',     label: '小红书',  icon: Share2,   desc: '格式化文案推送到小红书' },
  { key: 'bitable', label: '多维表',  icon: Database, desc: '录入飞书文案库' },
  { key: 'audio',   label: '音频',    icon: Volume2,  desc: '生成播报音频' },
]

const INITIAL_STATE = {
  topic:   { status: 'idle', topicList: [], selectedTopic: '', selectedRecordId: '', selectedCategory: '' },
  write:   { status: 'idle', title: '', content: '', wordCount: 0 },
  cover:   { status: 'stub', hint: '点击生成封面图（暂未实现）' },
  wechat:  { status: 'stub', content: '' },
  xhs:     { status: 'stub', content: '' },
  bitable: { status: 'idle', recordId: '' },
  audio:   { status: 'stub', hint: '文案已就绪，可使用 TTS 工具生成音频' },
}

// 选题库
const TOPIC_APP_TOKEN = 'MGXMbPcpTaVDvVsHHNPcaC1gnwc'
const TOPIC_TABLE_ID  = 'tbljjgug9g0gQO2r'

export default function SelfMedia({ lang, theme }) {
  const isDark = theme === 'dark'
  const isZh  = lang === 'zh'

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

  function isDone(key)  { return states[key].status === 'done' }
  function isStub(key) { return states[key].status === 'stub' }
  function isActive(k)  { return expandedStep === k }
  function canExec(key) {
    const idx = STEPS.findIndex(s => s.key === key)
    if (idx === 0) return states[STEPS[0].key].status === 'idle'
    return isDone(STEPS[idx - 1].key) && states[key].status === 'idle'
  }

  const allDone = STEPS.every(s => isDone(s.key) || isStub(s.key))
  const completedCount = STEPS.filter(s => isDone(s.key)).length
  const progress = Math.round((completedCount / STEPS.length) * 100)

  // ---- 选题 ----
  async function loadTopics() {
    setStates(prev => ({ ...prev, topic: { ...prev.topic, status: 'loading', error: '' } }))
    try {
      const res = await fetch('/api/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list_topics', fields: { app_token: TOPIC_APP_TOKEN, table_id: TOPIC_TABLE_ID } }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '读取选题库失败')
      setStates(prev => ({ ...prev, topic: { ...prev.topic, status: 'done', topicList: data.items || [], error: '' } }))
    } catch (e) {
      setStates(prev => ({ ...prev, topic: { ...prev.topic, status: 'idle', error: e.message } }))
    }
  }

  function selectTopic(item) {
    setStates(prev => ({ ...prev, topic: { ...prev.topic, selectedTopic: item.title, selectedRecordId: item.record_id, selectedCategory: item.category } }))
  }

  // ---- 文案 ----
  async function generateWrite() {
    const { selectedTopic, selectedCategory } = states.topic
    if (!selectedTopic) return
    setStates(prev => ({ ...prev, write: { ...prev.write, status: 'loading', error: '' } }))
    try {
      const res = await fetch('/api/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'write',
          fields: { topic: selectedTopic, category: selectedCategory || '成长认知', framework: '破立结构', has_story: 'no', target_audience: '想做自媒体/副业的人' },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '生成失败')
      setStates(prev => ({ ...prev, write: { status: 'done', title: data.title, content: data.content, wordCount: data.wordCount, error: '' } }))
      // 自动格式化多平台文案
      await formatForPlatforms(data.title, data.content)
    } catch (e) {
      setStates(prev => ({ ...prev, write: { ...prev.write, status: 'idle', error: e.message } }))
    }
  }

  // ---- 多平台格式化 ----
  async function formatForPlatforms(title, content) {
    try {
      const res = await fetch('/api/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'format_content', fields: { content, title, platforms: ['wechat', 'xhs'] } }),
      })
      const data = await res.json()
      if (res.ok) {
        setStates(prev => ({
          ...prev,
          wechat: { status: 'done', content: data.wechat || '' },
          xhs:    { status: 'done', content: data.xhs || '' },
        }))
      }
    } catch (e) { /* ignore */ }
  }

  // ---- 多维表 ----
  async function saveToBitable() {
    const { title, content, wordCount } = states.write
    const { selectedRecordId, selectedCategory } = states.topic
    if (!content) return
    setStates(prev => ({ ...prev, bitable: { ...prev.bitable, status: 'loading', error: '' } }))
    try {
      const res = await fetch('/api/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_to_bitable',
          fields: { title, content, category: selectedCategory || '成长认知', platform: ['抖音'], framework: '破立结构', word_count: wordCount, topic_record_id: selectedRecordId },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '录入失败')
      setStates(prev => ({ ...prev, bitable: { status: 'done', recordId: data.record_id || '已录入', error: '' } }))
    } catch (e) {
      setStates(prev => ({ ...prev, bitable: { ...prev.bitable, status: 'idle', error: e.message } }))
    }
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
            {isZh ? '内容创作中心' : 'Content Creation Hub'}
          </h2>
          <p className="mt-2 text-sm" style={{ color: muted }}>{isZh ? '真实链路 · 每步可见 · 可返回重做' : 'Real pipeline · Visible steps · Redo available'}</p>
          <div className="accent-bar mt-4" />
        </div>

        {/* 进度条 */}
        <div style={cs({ padding: '1.25rem', marginBottom: '2rem' })}>
          <div className="flex justify-between text-xs mb-3">
            <span style={{ color: muted }}>发布流水线</span>
            <span style={{ color: text }}>{completedCount} / {STEPS.length} 步完成</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: barBg }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(to right, #D97706, #F59E0B)' }} />
          </div>
          <div className="flex items-center justify-between mt-4 overflow-x-auto">
            {STEPS.map((step, i) => {
              const done  = isDone(step.key)
              const stub  = isStub(step.key)
              const active = expandedStep === step.key
              const iconBg  = done ? 'rgba(217,119,6,0.2)' : stub ? 'rgba(139,139,135,0.08)' : active ? 'rgba(217,119,6,0.1)' : stepIdle
              const iconBdr = done ? 'rgba(217,119,6,0.4)' : stub ? 'rgba(139,139,135,0.15)' : active ? 'rgba(217,119,6,0.3)' : stepBdr
              const iconCol = done ? '#D97706' : stub ? '#A8A29E' : active ? '#D97706' : muted
              const lblCol  = done ? 'rgba(217,119,6,0.7)' : stub ? '#A8A29E' : active ? muted : mutedLight
              return (
                <div key={step.key} className="flex items-center min-w-0">
                  <div className="flex flex-col items-center gap-1 px-1">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                      style={{ background: iconBg, border: `1px solid ${iconBdr}`, color: iconCol }}>
                      {done ? '✓' : stub ? '—' : <step.icon size={12} />}
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

        {/* 步骤1: 选题 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(217,119,6,0.2)', border: '1px solid rgba(217,119,6,0.4)' }}>
              <Sparkles size={11} style={{ color: '#D97706' }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: text }}>第一步 · 选题</span>
            {isDone('topic') && <CheckCircle size={13} style={{ color: '#22C55E' }} />}
          </div>

          {states.topic.status === 'idle' && !states.topic.error && (
            <button onClick={loadTopics}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#D97706' }}>
              <Sparkles size={13} />
              从选题库读取候选选题
            </button>
          )}
          {states.topic.status === 'loading' && (
            <div className="flex items-center gap-2 py-3 text-sm" style={{ color: '#3B82F6' }}>
              <Loader size={13} className="animate-spin" />读取选题库中...
            </div>
          )}
          {states.topic.error && (
            <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
              {states.topic.error} <button onClick={loadTopics} className="ml-2 underline">重试</button>
            </div>
          )}
          {states.topic.status === 'done' && states.topic.topicList.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs" style={{ color: muted }}>共 {states.topic.topicList.length} 个候选选题，点击选择：</div>
              {states.topic.topicList.map(item => (
                <div key={item.record_id} onClick={() => selectTopic(item)} className="p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    border: `1px solid ${states.topic.selectedRecordId === item.record_id ? 'rgba(217,119,6,0.5)' : cardBorder}`,
                    background: states.topic.selectedRecordId === item.record_id ? 'rgba(217,119,6,0.08)' : inputBg,
                  }}>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                      style={states.topic.selectedRecordId === item.record_id ? { borderColor: '#D97706', background: 'rgba(217,119,6,0.2)' } : { borderColor: cardBorder }}>
                      {states.topic.selectedRecordId === item.record_id && <CheckCircle size={10} style={{ color: '#D97706' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: text }}>{item.title}</div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(217,119,6,0.1)', color: '#D97706' }}>{item.category}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: stepIdle, color: muted }}>{item.source}</span>
                        {item.priority === '高' && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>高优</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {states.topic.selectedTopic && (
                <div className="flex gap-2 mt-3">
                  <button onClick={generateWrite} disabled={states.write.status === 'loading'}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#D97706' }}>
                    {states.write.status === 'loading' ? <Loader size={13} className="animate-spin" /> : <Lightbulb size={13} />}
                    {states.write.status === 'loading' ? '生成中...' : '生成文案'}
                  </button>
                  <button onClick={() => goBackTo('topic')}
                    className="px-3 py-2 rounded-xl text-xs" style={{ color: muted, border: `1px solid ${cardBorder}` }}>重新选择</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 步骤2-7 */}
        <div className="space-y-2 mb-8">
          {STEPS.slice(1).map(step => (
            <StepCard
              key={step.key}
              step={step}
              stepState={states[step.key]}
              isActive={isActive(step.key)}
              isDone={isDone(step.key)}
              isStub={isStub(step.key)}
              canExec={canExec(step.key)}
              onExpand={() => setExpandedStep(isActive(step.key) ? null : step.key)}
              onAction={step.key === 'write' ? generateWrite : step.key === 'bitable' ? saveToBitable : null}
              onBack={() => goBackTo(step.key)}
              writeContent={states.write.content}
              text={text} muted={muted} cardBg={cardBg} cardBorder={cardBorder} inputBg={inputBg}
            />
          ))}
        </div>

        {/* 全链路完成 */}
        {allDone && (
          <div style={cs({ padding: '1.5rem', textAlign: 'center', borderColor: 'rgba(34,197,94,0.2)' })}>
            <div className="text-lg font-semibold mb-1" style={{ color: '#22C55E' }}>全链路完成 ✓</div>
            <div className="text-sm mb-4" style={{ color: muted }}>文案已录入飞书文案库，可前往复制发布</div>
            <div className="flex gap-3 justify-center">
              <a href="https://feishu.cn/base/T9GPbvSvyanRwrsSaHjc2m0Wnle?table=tblCpFs6xT8pIkQT" target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#D97706' }}>
                <ExternalLink size={13} />打开文案库
              </a>
              <button onClick={resetAll}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#D97706' }}>
                开始下一篇
              </button>
            </div>
          </div>
        )}

        {!allDone && (
          <div style={cs({ padding: '1rem' })}>
            <div className="text-xs leading-relaxed" style={{ color: muted }}>
              <span style={{ color: text }} className="font-medium">使用说明：</span>
              选题库读取 → AI生成文案 → 封面/公众号/小红书/多维表/音频每步可见。公众号和小红书文案自动格式化，复制即可发布。
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

function StepCard({ step, stepState, isActive, isDone, isStub, canExec, onExpand, onAction, onBack, text, muted, cardBg, cardBorder, inputBg }) {
  const Icon = step.icon
  const [showContent, setShowContent] = useState(false)

  const sDone  = { background: 'rgba(34,197,94,0.12)',  color: '#22C55E', border: 'rgba(34,197,94,0.25)' }
  const sStub  = { background: cardBg, color: '#A8A29E', border: cardBorder }
  const sActive = { background: 'rgba(217,119,6,0.15)', color: '#D97706', border: 'rgba(217,119,6,0.3)' }
  const sIdle   = { background: cardBg, color: muted, border: cardBorder }

  const s = isStub ? sStub : isDone ? sDone : isActive ? sActive : sIdle
  const borderColor = isDone ? 'rgba(34,197,94,0.2)' : isActive ? 'rgba(217,119,6,0.3)' : cardBorder

  return (
    <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '1rem', overflow: 'hidden' }}>
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-all"
        onClick={() => { setShowContent(v => !v); onExpand() }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: s.background, color: s.color, border: `1px solid ${s.border}` }}>
          {isDone ? <CheckCircle size={16} /> : isStub ? <span className="text-xs">—</span> : <Icon size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: text }}>{step.label}</span>
            {isDone  && <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(34,197,94,0.15)',  color: '#22C55E' }}>✓</span>}
            {isStub  && <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(139,139,135,0.1)', color: '#A8A29E' }}>待实现</span>}
            {isActive && !isDone && <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(217,119,6,0.15)', color: '#D97706' }}>进行中</span>}
          </div>
          <div className="text-xs" style={{ color: muted }}>{step.desc}</div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isDone && (
            <button onClick={e => { e.stopPropagation(); onBack() }}
              className="p-1.5 rounded-lg transition-all" style={{ color: muted }} title="重做">
              <RotateCcw size={13} />
            </button>
          )}
          {canExec && !isDone && !isStub && onAction && (
            <button onClick={e => { e.stopPropagation(); onAction() }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#D97706' }}>
              <Play size={11} />执行
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

function StepContent({ step, state, text, muted, cardBg, cardBorder, inputBg, writeContent }) {
  if (state.status === 'idle') return <div className="text-xs py-2" style={{ color: muted }}>点击上方「执行」开始此步骤</div>
  if (state.status === 'loading') return <div className="flex items-center gap-2 text-sm" style={{ color: '#3B82F6' }}><Loader size={14} className="animate-spin" />处理中...</div>

  const boxStyle = { background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.75rem' }
  const stubStyle = { background: 'rgba(139,139,135,0.05)', border: '1px solid rgba(139,139,135,0.15)', borderRadius: '0.75rem' }

  switch (step) {
    case 'write':
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl" style={{ background: inputBg, border: `1px solid ${cardBorder}` }}>
            <div className="text-xs mb-1" style={{ color: muted }}>文章标题</div>
            <div className="text-sm font-semibold" style={{ color: text }}>{state.title || '—'}</div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1" style={{ color: muted }}>
              <span>正文内容</span><span>{state.wordCount || 0} 字</span>
            </div>
            <div className="p-3 rounded-xl max-h-52 overflow-y-auto" style={{ background: inputBg, border: `1px solid ${cardBorder}` }}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: muted }}>{state.content}</div>
            </div>
          </div>
        </div>
      )

    case 'wechat':
      if (state.status === 'stub') return (
        <div className="p-3 rounded-xl" style={stubStyle}>
          <div className="text-sm" style={{ color: '#A8A29E' }}>{state.hint}</div>
          {state.content && (
            <div className="mt-2">
              <div className="text-xs mb-1" style={{ color: muted }}>公众号格式化预览：</div>
              <div className="p-3 rounded-xl max-h-40 overflow-y-auto text-sm whitespace-pre-wrap"
                style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: muted, fontSize: '0.8rem' }}>
                {state.content}
              </div>
            </div>
          )}
        </div>
      )
      return (
        <div className="space-y-2">
          <div className="p-3 rounded-xl flex items-center gap-2 text-sm" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}>
            <CheckCircle size={13} />公众号文案已格式化，可直接复制发布
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: muted }}>格式化内容（点击全选复制）：</div>
            <textarea readOnly value={state.content} rows={8}
              className="w-full p-3 rounded-xl text-sm resize-none" style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: muted, fontFamily: 'monospace', fontSize: '0.75rem' }} />
          </div>
        </div>
      )

    case 'xhs':
      if (state.status === 'stub') return (
        <div className="p-3 rounded-xl" style={stubStyle}>
          <div className="text-sm" style={{ color: '#A8A29E' }}>点击生成小红书格式化文案（暂未实现推送）</div>
          {state.content && (
            <div className="mt-2">
              <div className="text-xs mb-1" style={{ color: muted }}>小红书格式化预览：</div>
              <div className="p-3 rounded-xl max-h-40 overflow-y-auto text-sm whitespace-pre-wrap"
                style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: muted, fontSize: '0.8rem' }}>
                {state.content}
              </div>
            </div>
          )}
        </div>
      )
      return (
        <div className="space-y-2">
          <div className="p-3 rounded-xl flex items-center gap-2 text-sm" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}>
            <CheckCircle size={13} />小红书文案已格式化，可直接复制发布
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: muted }}>格式化内容（点击全选复制）：</div>
            <textarea readOnly value={state.content} rows={8}
              className="w-full p-3 rounded-xl text-sm resize-none" style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: muted, fontFamily: 'monospace', fontSize: '0.75rem' }} />
          </div>
        </div>
      )

    case 'bitable':
      if (state.status === 'idle') return null
      return (
        <div className="space-y-2">
          <div className="p-3 rounded-xl" style={boxStyle}>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#22C55E' }}>
              <CheckCircle size={13} />已录入飞书文案库
            </div>
            <div className="text-xs mt-1 ml-5" style={{ color: muted }}>记录ID: {state.recordId}</div>
          </div>
          <a href="https://feishu.cn/base/T9GPbvSvyanRwrsSaHjc2m0Wnle?table=tblCpFs6xT8pIkQT" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all"
            style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: muted }}>
            <ExternalLink size={11} />在飞书中查看文案库
          </a>
        </div>
      )

    case 'audio':
      return (
        <div className="p-3 rounded-xl" style={stubStyle}>
          <div className="text-sm mb-2" style={{ color: '#A8A29E' }}>{state.hint}</div>
          {writeContent && (
            <div className="text-xs" style={{ color: muted }}>
              字数：{(writeContent.length / 2).toFixed(0)} 字 | 音频约 {Math.ceil(writeContent.length / 400)} 分钟
            </div>
          )}
        </div>
      )

    case 'cover':
      return (
        <div className="p-3 rounded-xl" style={stubStyle}>
          <div className="text-sm" style={{ color: '#A8A29E' }}>{state.hint}</div>
        </div>
      )

    default:
      return null
  }
}

