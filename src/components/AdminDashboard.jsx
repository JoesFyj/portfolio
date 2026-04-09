import { useState, useRef } from 'react'
import { getConfig, saveConfig } from '../lib/siteConfig'
import { DEFAULT_CONFIG } from '../lib/defaultConfig'
import {
  Settings, Save, RotateCcw, CheckCircle, AlertCircle,
  X, ChevronDown, ChevronUp, Plus, Trash2, Download, Upload
} from 'lucide-react'

// ============================================================
// 基础样式卡片区块
// ============================================================
function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mb-4" style={{ background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: '1rem', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-all"
        style={{ background: open ? '#FAFAF6' : '#FFFFFF' }}
      >
        <span className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>{title}</span>
        {open
          ? <ChevronUp size={14} style={{ color: '#D97706' }} />
          : <ChevronDown size={14} style={{ color: '#6B6860' }} />
        }
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  )
}

// ============================================================
// 单行/多行字段
// ============================================================
function Field({ label, value, onChange, rows, placeholder }) {
  const baseStyle = {
    width: '100%',
    background: '#FAFAF6',
    border: '1px solid #E8E5DF',
    borderRadius: '0.75rem',
    padding: '0.625rem 1rem',
    fontSize: '0.875rem',
    color: '#1C1C1E',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    resize: rows ? 'vertical' : 'none',
  }
  const focusStyle = { borderColor: '#D97706' }
  const [focused, setFocused] = useState(false)

  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6B6860', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {rows ? (
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={rows}
          style={{ ...baseStyle, ...(focused ? focusStyle : {}) }}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          style={{ ...baseStyle, ...(focused ? focusStyle : {}) }}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}
    </div>
  )
}

// ============================================================
// 图片上传
// ============================================================
function FileUpload({ label, value, onChange }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)
  const hasValue = value && value.length > 0

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => onChange(e.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6B6860', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {hasValue ? (
        <div className="flex items-start gap-3">
          <img src={value} alt="" className="w-20 h-20 object-cover rounded-xl shrink-0" style={{ border: '1px solid #E8E5DF' }} />
          <div className="flex-1 min-w-0">
            <button
              onClick={() => inputRef.current.click()}
              className="block text-xs font-medium mb-1"
              style={{ color: '#D97706' }}
            >
              重新上传
            </button>
            <button onClick={() => onChange('')} className="block text-xs" style={{ color: '#EF4444' }}>
              移除图片
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => inputRef.current.click()}
          className="flex items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed cursor-pointer transition-all text-sm"
          style={
            dragging
              ? { borderColor: '#D97706', background: 'rgba(217,119,6,0.05)', color: '#D97706' }
              : { borderColor: '#E8E5DF', color: '#6B6860' }
          }
        >
          点击上传图片
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="或直接输入图片 URL"
        className="mt-2"
        style={{
          width: '100%',
          background: '#FAFAF6',
          border: '1px solid #E8E5DF',
          borderRadius: '0.75rem',
          padding: '0.5rem 1rem',
          fontSize: '0.8125rem',
          color: '#1C1C1E',
          outline: 'none',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
        value={value && (value.startsWith('http') || value.startsWith('/')) ? value : ''}
        onChange={e => {
          if (!value || (!value.startsWith('http') && !value.startsWith('/') && !value.startsWith('data:'))) {
            onChange(e.target.value)
          }
        }}
      />
    </div>
  )
}

// ============================================================
// 标签列表编辑器
// ============================================================
function LabelsEditor({ labels, onChange }) {
  function update(i, field, val) {
    const next = labels.map((l, idx) => idx === i ? { ...l, [field]: val } : l)
    onChange(next)
  }
  function add() { onChange([...labels, { label: '', val: '' }]) }
  function remove(i) { onChange(labels.filter((_, idx) => idx !== i)) }

  return (
    <div className="space-y-3">
      {(labels || []).map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text" value={l.label} placeholder="标签名"
            onChange={e => update(i, 'label', e.target.value)}
            className="flex-1"
            style={{ background: '#FAFAF6', border: '1px solid #E8E5DF', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: '#1C1C1E', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          />
          <input
            type="text" value={l.val} placeholder="内容"
            onChange={e => update(i, 'val', e.target.value)}
            className="flex-[2]"
            style={{ background: '#FAFAF6', border: '1px solid #E8E5DF', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: '#1C1C1E', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          />
          <button onClick={() => remove(i)} className="shrink-0 p-1.5" style={{ color: '#EF4444' }}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-2 border border-dashed rounded-xl text-sm transition-all"
        style={{ borderColor: '#E8E5DF', color: '#6B6860' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.color = '#D97706' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E5DF'; e.currentTarget.style.color = '#6B6860' }}
      >
        + 添加标签
      </button>
    </div>
  )
}

// ============================================================
// 价值观列表编辑器
// ============================================================
function ValuesEditor({ items, onChange }) {
  function update(i, val) {
    const next = items.map((v, idx) => idx === i ? { text: val } : v)
    onChange(next)
  }
  function add() { onChange([...items, { text: '' }]) }
  function remove(i) { onChange(items.filter((_, idx) => idx !== i)) }

  return (
    <div className="space-y-3">
      {(items || []).map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
            style={{ background: '#FEF3C7', color: '#D97706', fontFamily: "'Playfair Display', serif" }}
          >
            {String(i + 1).padStart(2, '0')}
          </div>
          <input
            type="text" value={v.text} placeholder="输入价值观..."
            onChange={e => update(i, e.target.value)}
            className="flex-1"
            style={{ background: '#FAFAF6', border: '1px solid #E8E5DF', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: '#1C1C1E', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          />
          <button onClick={() => remove(i)} className="shrink-0 p-1.5" style={{ color: '#EF4444' }}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-2 border border-dashed rounded-xl text-sm transition-all"
        style={{ borderColor: '#E8E5DF', color: '#6B6860' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.color = '#D97706' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E5DF'; e.currentTarget.style.color = '#6B6860' }}
      >
        + 添加价值观
      </button>
    </div>
  )
}

// ============================================================
// 成长轨迹节点编辑器
// ============================================================
function TimelineEditor({ nodes, onChange }) {
  function update(i, field, val) {
    const next = nodes.map((n, idx) => idx === i ? { ...n, [field]: val } : n)
    onChange(next)
  }
  function add() { onChange([...nodes, { year: '', label: '', insight: '', url: '' }]) }
  function remove(i) { onChange(nodes.filter((_, idx) => idx !== i)) }

  return (
    <div className="space-y-3">
      {(nodes || []).map((n, i) => (
        <div key={i} className="p-4 rounded-xl" style={{ background: '#FAFAF6', border: '1px solid #E8E5DF' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold" style={{ color: '#D97706' }}>节点 {i + 1}</span>
            <button onClick={() => remove(i)} style={{ color: '#EF4444' }}><Trash2 size={13} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input type="text" value={n.year} placeholder="年份/阶段"
              onChange={e => update(i, 'year', e.target.value)}
              style={{ background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: '#1C1C1E', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
            />
            <input type="text" value={n.label} placeholder="标题"
              onChange={e => update(i, 'label', e.target.value)}
              style={{ background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: '#1C1C1E', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
            />
          </div>
          <input type="text" value={n.insight} placeholder="感悟/描述"
            onChange={e => update(i, 'insight', e.target.value)}
            style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: '#1C1C1E', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          />
          <input type="text" value={n.url || ''} placeholder="链接（选填，输入则卡片可点击）"
            onChange={e => update(i, 'url', e.target.value)}
            style={{ width: '100%', marginTop: '0.5rem', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: '#1C1C1E', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          />
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-2 border border-dashed rounded-xl text-sm transition-all"
        style={{ borderColor: '#E8E5DF', color: '#6B6860' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.color = '#D97706' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E5DF'; e.currentTarget.style.color = '#6B6860' }}
      >
        + 添加节点
      </button>
    </div>
  )
}

// ============================================================
// 答题编辑器
// ============================================================
function QuizEditor({ questions, onChange }) {
  function updateQ(i, field, val) {
    const next = questions.map((q, idx) => idx === i ? { ...q, [field]: val } : q)
    onChange(next)
  }
  function updateOptLabel(qi, oi, val) {
    const next = questions.map((q, qi2) => {
      if (qi2 !== qi) return q
      const opts = q.options.map((o, oi2) => oi2 === oi ? { ...o, label: val } : o)
      return { ...q, options: opts }
    })
    onChange(next)
  }
  function updateOptReveal(qi, oi, val) {
    const next = questions.map((q, qi2) => {
      if (qi2 !== qi) return q
      const opts = q.options.map((o, oi2) => oi2 === oi ? { ...o, reveal: val } : o)
      return { ...q, options: opts }
    })
    onChange(next)
  }
  function addQ() {
    onChange([...questions, { question: '', options: [
      { label: '选项A', reveal: '' },
      { label: '选项B', reveal: '' },
    ] }])
  }
  function removeQ(i) { onChange(questions.filter((_, idx) => idx !== i)) }
  function addOpt(i) {
    const next = questions.map((q, qi2) => {
      if (qi2 !== i) return q
      return { ...q, options: [...q.options, { label: '新选项', reveal: '' }] }
    })
    onChange(next)
  }
  function removeOpt(qi, oi) {
    const next = questions.map((q, qi2) => {
      if (qi2 !== qi) return q
      return { ...q, options: q.options.filter((_, oi2) => oi2 !== oi) }
    })
    onChange(next)
  }

  return (
    <div className="space-y-5">
      {(questions || []).map((q, qi) => (
        <div key={qi} className="p-5 rounded-xl" style={{ background: '#FAFAF6', border: '1px solid #E8E5DF' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold" style={{ color: '#D97706' }}>第 {qi + 1} 题</span>
            <button onClick={() => removeQ(qi)} style={{ color: '#EF4444' }}><Trash2 size={13} /></button>
          </div>

          {/* 问题 */}
          <input type="text" value={q.question} placeholder="输入问题..."
            onChange={e => updateQ(qi, 'question', e.target.value)}
            className="w-full mb-3"
            style={{ background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: '#1C1C1E', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          />

          {/* 选项 */}
          <div className="space-y-2 mb-2">
            {(q.options || []).map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input type="text" value={opt.label} placeholder="选项文字"
                  onChange={e => updateOptLabel(qi, oi, e.target.value)}
                  className="flex-1"
                  style={{ background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: '0.75rem', padding: '0.4rem 0.75rem', fontSize: '0.8125rem', color: '#1C1C1E', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
                />
                <input type="text" value={opt.reveal || ''} placeholder="选中后显示（可不填）"
                  onChange={e => updateOptReveal(qi, oi, e.target.value)}
                  className="flex-[2]"
                  style={{ background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: '0.75rem', padding: '0.4rem 0.75rem', fontSize: '0.8125rem', color: '#6B6860', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
                />
                <button onClick={() => removeOpt(qi, oi)} style={{ color: '#EF4444', padding: '0 4px' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => addOpt(qi)}
            className="text-xs px-3 py-1 rounded-lg border transition-all"
            style={{ borderColor: '#E8E5DF', color: '#6B6860' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.color = '#D97706' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E5DF'; e.currentTarget.style.color = '#6B6860' }}>
            + 添加选项
          </button>
        </div>
      ))}
      <button onClick={addQ}
        className="w-full py-2.5 border border-dashed rounded-xl text-sm transition-all"
        style={{ borderColor: '#E8E5DF', color: '#6B6860' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.color = '#D97706' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E5DF'; e.currentTarget.style.color = '#6B6860' }}>
        + 添加题目
      </button>
    </div>
  )
}

// ============================================================
// 文章编辑器
// ============================================================
function ArticlesEditor({ articles, onChange }) {
  function update(i, field, value) {
    const next = articles.map((a, idx) => idx === i ? { ...a, [field]: value } : a)
    onChange(next)
  }
  function add() {
    onChange([...articles, {
      id: Date.now(),
      title: '', description: '', url: '',
      tags: [], year: '2026'
    }])
  }
  function remove(i) {
    onChange(articles.filter((_, idx) => idx !== i))
  }

  const inputStyle = (val) => ({
    width: '100%',
    background: '#FAFAF6',
    border: '1px solid #E8E5DF',
    borderRadius: '0.75rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.8125rem',
    color: '#1C1C1E',
    outline: 'none',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  })

  return (
    <div className="space-y-4">
      {(articles || []).map((a, i) => (
        <div key={a.id || i} className="p-4 rounded-xl space-y-3" style={{ background: '#FAFAF6', border: '1px solid #E8E5DF' }}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold" style={{ color: '#D97706' }}>文章 {i + 1}</span>
            <button onClick={() => remove(i)} style={{ color: '#EF4444' }}><Trash2 size={13} /></button>
          </div>
          <Field label="标题" value={a.title} onChange={v => update(i, 'title', v)} />
          <Field label="链接（完整URL，留空则不跳转）" value={a.url} onChange={v => update(i, 'url', v)} />
          <Field label="描述" value={a.description} onChange={v => update(i, 'description', v)} rows={2} />
          <Field
            label="标签（逗号分隔）"
            value={Array.isArray(a.tags) ? a.tags.join(',') : (a.tags || '')}
            onChange={v => update(i, 'tags', v.split(',').map(t => t.trim()).filter(Boolean))}
          />
          <Field label="年份" value={a.year} onChange={v => update(i, 'year', v)} />
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-2.5 border border-dashed rounded-xl text-sm transition-all"
        style={{ borderColor: '#E8E5DF', color: '#6B6860' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.color = '#D97706' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E5DF'; e.currentTarget.style.color = '#6B6860' }}
      >
        + 添加文章
      </button>
    </div>
  )
}

// ============================================================
// 打字机文字编辑器
// ============================================================
function TypingEditor({ phrases, onChange }) {
  function update(i, val) {
    const next = [...phrases]
    next[i] = val
    onChange(next)
  }
  function add() { onChange([...phrases, '']) }
  function remove(i) { onChange(phrases.filter((_, idx) => idx !== i)) }

  return (
    <div className="space-y-2">
      {(phrases || []).map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs shrink-0 w-5 text-center" style={{ color: '#D97706' }}>{i + 1}</span>
          <input
            type="text" value={p} onChange={e => update(i, e.target.value)}
            style={{ flex: 1, background: '#FAFAF6', border: '1px solid #E8E5DF', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: '#1C1C1E', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          />
          <button onClick={() => remove(i)} style={{ color: '#EF4444' }}><Trash2 size={13} /></button>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-2 border border-dashed rounded-xl text-xs transition-all"
        style={{ borderColor: '#E8E5DF', color: '#6B6860' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.color = '#D97706' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E5DF'; e.currentTarget.style.color = '#6B6860' }}
      >
        + 添加打字文字
      </button>
    </div>
  )
}

// ============================================================
// 主组件
// ============================================================
export default function AdminDashboard({ onClose }) {
  const cfg = getConfig()

  // 初始化表单数据（从 defaultConfig 结构读取）
  const [form, setForm] = useState({
    // site
    siteTitle:    cfg.site?.title     ?? DEFAULT_CONFIG.site.title,
    siteSubtitle: cfg.site?.subtitle  ?? DEFAULT_CONFIG.site.subtitle,
    siteAvatar:   cfg.site?.avatarBase64 ?? cfg.site?.avatar ?? '',
    // hero
    heroTagline:  cfg.hero?.tagline ?? DEFAULT_CONFIG.hero.tagline,
    heroSub:      cfg.hero?.sub      ?? DEFAULT_CONFIG.hero.sub,
    heroCta:      cfg.hero?.cta      ?? '',
    heroCta2:     cfg.hero?.cta2     ?? '',
    // heroTyping
    typingZh: cfg.heroTyping?.zh   ?? DEFAULT_CONFIG.heroTyping.zh,
    typingEn: cfg.heroTyping?.en   ?? DEFAULT_CONFIG.heroTyping.en,
    // homeAbout
    aboutTitle:  cfg.homeAbout?.title  ?? DEFAULT_CONFIG.homeAbout.title,
    aboutLabels: cfg.homeAbout?.labels ?? DEFAULT_CONFIG.homeAbout.labels,
    aboutStory:  cfg.homeAbout?.story  ?? DEFAULT_CONFIG.homeAbout.story,
    // homeValues
    valuesTitle: cfg.homeValues?.title ?? DEFAULT_CONFIG.homeValues.title,
    valuesItems: cfg.homeValues?.items ?? DEFAULT_CONFIG.homeValues.items,
    // homePortfolio
    portfolioTitle:   cfg.homePortfolio?.title   ?? DEFAULT_CONFIG.homePortfolio.title,
    portfolioSubtitle:cfg.homePortfolio?.subtitle ?? DEFAULT_CONFIG.homePortfolio.subtitle,
    portfolioCta:     cfg.homePortfolio?.ctaText ?? DEFAULT_CONFIG.homePortfolio.ctaText,
    // works
    works: cfg.works ?? DEFAULT_CONFIG.works,
    // homeTimeline
    timelineTitle: cfg.homeTimeline?.title ?? DEFAULT_CONFIG.homeTimeline.title,
    timelineNodes:  cfg.homeTimeline?.nodes ?? DEFAULT_CONFIG.homeTimeline.nodes,
    // homeConnect
    connectTitle:    cfg.homeConnect?.title       ?? DEFAULT_CONFIG.homeConnect.title,
    connectSubtitle: cfg.homeConnect?.subtitle    ?? DEFAULT_CONFIG.homeConnect.subtitle,
    connectDesc:     cfg.homeConnect?.description ?? DEFAULT_CONFIG.homeConnect.description,
    connectWechat:   cfg.homeConnect?.wechat   ?? '',
    connectWechatQr: cfg.homeConnect?.wechatQr ?? '',
    connectGzh:      cfg.homeConnect?.gzh      ?? DEFAULT_CONFIG.homeConnect.gzh,
    connectGzhQr:    cfg.homeConnect?.gzhQr    ?? '',
    connectJike:     cfg.homeConnect?.jike     ?? '',
    connectTwitter:  cfg.homeConnect?.twitter  ?? '',
    connectDouyin:   cfg.homeConnect?.douyin   ?? '',
    // homeQuiz
    quizTitle:    cfg.homeQuiz?.title    ?? DEFAULT_CONFIG.homeQuiz.title,
    quizSubtitle: cfg.homeQuiz?.subtitle ?? DEFAULT_CONFIG.homeQuiz.subtitle,
    quizQuestions: cfg.homeQuiz?.questions ?? DEFAULT_CONFIG.homeQuiz.questions,
    // footer
    footerTagline:   cfg.footer?.tagline   ?? DEFAULT_CONFIG.footer.tagline,
    footerCopyright: cfg.footer?.copyright ?? DEFAULT_CONFIG.footer.copyright,
    // admin
    adminPassword: cfg.adminPassword ?? DEFAULT_CONFIG.adminPassword,
  })

  const [saveStatus, setSaveStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  function update(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
    setSaveStatus(null)
  }

  function buildConfig() {
    return {
      site: {
        title: form.siteTitle,
        subtitle: form.siteSubtitle,
        avatar:    form.siteAvatar.startsWith('data:') ? '' : (form.siteAvatar || ''),
        avatarBase64: form.siteAvatar.startsWith('data:') ? form.siteAvatar : '',
      },
      hero: {
        tagline: form.heroTagline,
        sub:     form.heroSub,
        cta:     form.heroCta,
        cta2:    form.heroCta2,
      },
      heroTyping: {
        zh: form.typingZh,
        en: form.typingEn,
      },
      homeAbout: {
        title:  form.aboutTitle,
        labels: form.aboutLabels,
        story:  form.aboutStory,
      },
      homeValues: {
        title: form.valuesTitle,
        items: form.valuesItems,
      },
      homePortfolio: {
        title:    form.portfolioTitle,
        subtitle: form.portfolioSubtitle,
        ctaText:  form.portfolioCta,
      },
      works: form.works,
      homeTimeline: {
        title: form.timelineTitle,
        nodes: form.timelineNodes,
      },
      homeConnect: {
        title:       form.connectTitle,
        subtitle:    form.connectSubtitle,
        description: form.connectDesc,
        wechat:     form.connectWechat,
        wechatQr:   form.connectWechatQr,
        gzh:        form.connectGzh,
        gzhQr:      form.connectGzhQr,
        jike:       form.connectJike,
        twitter:    form.connectTwitter,
        douyin:     form.connectDouyin,
      },
      homeQuiz: {
        title:    form.quizTitle,
        subtitle: form.quizSubtitle,
        questions: form.quizQuestions,
      },
      footer: {
        tagline:   form.footerTagline,
        copyright: form.footerCopyright,
      },
      // 保留 Hub 相关字段
      courses:       cfg.courses       || [],
      achievements:  cfg.achievements  || [],
      contact:       cfg.contact        || {},
      privateGroup:  cfg.privateGroup  || {},
      adminPassword: form.adminPassword,
    }
  }

  async function handleSave() {
    try {
      const newConfig = buildConfig()
      await saveConfig(newConfig)
      setSaveStatus('saved')
      setErrorMsg('')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (e) {
      setSaveStatus('error')
      setErrorMsg(e.message)
    }
  }

  function handleReset() {
    if (confirm('确定重置所有配置？此操作不可撤销。')) {
      localStorage.removeItem('site_config_v2')
      window.location.reload()
    }
  }

  function handleExport() {
    const cfg = buildConfig()
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site-config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target.result)
        const merged = { ...getConfig(), ...imported }
        saveConfig(merged)
        alert('配置已导入，刷新页面后生效')
        setTimeout(() => window.location.reload(), 1000)
      } catch (err) {
        alert('导入失败：文件格式错误')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'rgba(250,249,246,0.95)', backdropFilter: 'blur(4px)' }}>
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <Settings size={18} style={{ color: '#D97706' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif" style={{ color: '#1C1C1E' }}>管理员后台</h2>
              <p className="text-xs" style={{ color: '#6B6860' }}>配置网站所有内容</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              title="导出配置备份"
              className="p-2 rounded-xl border transition-all"
              style={{ borderColor: '#E8E5DF', color: '#6B6860', background: '#FFFFFF' }}
            >
              <Download size={15} />
            </button>
            <button
              onClick={() => document.getElementById('importFile').click()}
              title="导入配置备份"
              className="p-2 rounded-xl border transition-all"
              style={{ borderColor: '#E8E5DF', color: '#6B6860', background: '#FFFFFF' }}
            >
              <Upload size={15} />
            </button>
            <input id="importFile" type="file" accept=".json" className="hidden" onChange={handleImport} />
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
              style={{ background: '#D97706', color: '#FFFFFF' }}
            >
              完成
            </button>
          </div>
        </div>

        {/* 提示条 */}
        <div className="mb-6 p-4 rounded-xl" style={{ background: '#FEF3C7', border: '1px solid rgba(217,119,6,0.2)' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
            配置保存在浏览器本地 + 云端备份。修改后点击「保存所有修改」生效。导出配置文件可永久保存。
          </p>
        </div>

        {/* ==========================================
            01 站点信息
        ========================================== */}
        <Section title="🏠 站点信息">
          <Field label="网站标题"       value={form.siteTitle}    onChange={v => update('siteTitle', v)} />
          <Field label="副标题"         value={form.siteSubtitle} onChange={v => update('siteSubtitle', v)} />
          <FileUpload label="头像" value={form.siteAvatar} onChange={v => update('siteAvatar', v)} />
        </Section>

        {/* ==========================================
            02 Hero 区域
        ========================================== */}
        <Section title="🎯 Hero 区域">
          <Field label="主标语"       value={form.heroTagline} onChange={v => update('heroTagline', v)} />
          <Field label="副标语"       value={form.heroSub}     onChange={v => update('heroSub', v)}     rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="主按钮文字"   value={form.heroCta}  onChange={v => update('heroCta', v)} />
            <Field label="次按钮文字"   value={form.heroCta2} onChange={v => update('heroCta2', v)} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#6B6860', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              打字机文字（中文）
            </label>
            <TypingEditor phrases={form.typingZh} onChange={v => update('typingZh', v)} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#6B6860', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              打字机文字（英文）
            </label>
            <TypingEditor phrases={form.typingEn} onChange={v => update('typingEn', v)} />
          </div>
        </Section>

        {/* ==========================================
            03 我从哪里来
        ========================================== */}
        <Section title="👤 01 我从哪里来">
          <Field label="标题" value={form.aboutTitle} onChange={v => update('aboutTitle', v)} />
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#6B6860', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              左侧信息标签
            </label>
            <LabelsEditor labels={form.aboutLabels} onChange={v => update('aboutLabels', v)} />
          </div>
          <Field label="个人故事（段落用空行分隔）" value={form.aboutStory} onChange={v => update('aboutStory', v)} rows={12} />
        </Section>

        {/* ==========================================
            04 我相信什么
        ========================================== */}
        <Section title="💡 02 我相信什么">
          <Field label="标题" value={form.valuesTitle} onChange={v => update('valuesTitle', v)} />
          <ValuesEditor items={form.valuesItems} onChange={v => update('valuesItems', v)} />
        </Section>

        {/* ==========================================
            05 我的作品
        ========================================== */}
        <Section title="✍️ 03 我的作品">
          <Field label="标题"         value={form.portfolioTitle}    onChange={v => update('portfolioTitle', v)} />
          <Field label="副标题"       value={form.portfolioSubtitle} onChange={v => update('portfolioSubtitle', v)} />
          <Field label="CTA 按钮文字" value={form.portfolioCta}     onChange={v => update('portfolioCta', v)} />
        </Section>

        <Section title="📝 文章列表" defaultOpen={false}>
          <ArticlesEditor articles={form.works} onChange={v => update('works', v)} />
        </Section>

        {/* ==========================================
            06 成长轨迹
        ========================================== */}
        <Section title="📍 04 成长轨迹">
          <Field label="标题" value={form.timelineTitle} onChange={v => update('timelineTitle', v)} />
          <TimelineEditor nodes={form.timelineNodes} onChange={v => update('timelineNodes', v)} />
        </Section>

        {/* ==========================================
            06 答题了解我
        ========================================== */}
        <Section title="🦞 06 答题了解我">
          <Field label="标题"    value={form.quizTitle}    onChange={v => update('quizTitle', v)} />
          <Field label="副标题"  value={form.quizSubtitle} onChange={v => update('quizSubtitle', v)} />
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#6B6860', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              题目（可增删，每个题目至少2个选项）
            </label>
            <QuizEditor questions={form.quizQuestions} onChange={v => update('quizQuestions', v)} />
          </div>
        </Section>

        {/* ==========================================
            07 找到我
        ========================================== */}
        <Section title="📞 05 找到我">
          <Field label="标题"       value={form.connectTitle}   onChange={v => update('connectTitle', v)} />
          <Field label="副标题"    value={form.connectSubtitle} onChange={v => update('connectSubtitle', v)} />
          <Field label="介绍语"    value={form.connectDesc}     onChange={v => update('connectDesc', v)} rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="微信号"   value={form.connectWechat}   onChange={v => update('connectWechat', v)} />
            <Field label="公众号名" value={form.connectGzh}     onChange={v => update('connectGzh', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="即刻"    value={form.connectJike}    onChange={v => update('connectJike', v)} />
            <Field label="推特"    value={form.connectTwitter} onChange={v => update('connectTwitter', v)} />
          </div>
          <Field label="抖音号" value={form.connectDouyin} onChange={v => update('connectDouyin', v)} />
          <div className="grid grid-cols-2 gap-4">
            <FileUpload label="微信二维码" value={form.connectWechatQr} onChange={v => update('connectWechatQr', v)} />
            <FileUpload label="公众号二维码" value={form.connectGzhQr}   onChange={v => update('connectGzhQr', v)} />
          </div>
        </Section>

        {/* ==========================================
            08 页脚
        ========================================== */}
        <Section title="🔚 页脚" defaultOpen={false}>
          <Field label="口号语"   value={form.footerTagline}   onChange={v => update('footerTagline', v)} />
          <Field label="版权信息" value={form.footerCopyright} onChange={v => update('footerCopyright', v)} />
        </Section>

        {/* ==========================================
            09 安全
        ========================================== */}
        <Section title="🔒 安全" defaultOpen={false}>
          <Field label="后台访问密码" value={form.adminPassword} onChange={v => update('adminPassword', v)} />
        </Section>

        {/* 保存区 */}
        <div className="sticky bottom-6 mt-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E8E5DF' }}>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all"
              style={{ background: '#D97706', color: '#FFFFFF' }}
            >
              <Save size={15} />
              保存所有修改
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-3 text-sm rounded-xl border transition-all"
              style={{ borderColor: '#E8E5DF', color: '#6B6860' }}
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {saveStatus === 'saved' && (
            <div className="flex items-center gap-2 mt-2 p-3 rounded-xl text-sm" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#16A34A' }}>
              <CheckCircle size={14} />
              已保存，刷新页面后生效
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 mt-2 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}>
              <AlertCircle size={14} />
              保存失败：{errorMsg}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
