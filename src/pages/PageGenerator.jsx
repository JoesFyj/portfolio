import { useState, useRef, useEffect } from 'react'
import RecorderPlayer from './RecorderPlayer'
import {
  SHAPE_GROUPS,
  SHAPE_OPTIONS,
  COLOR_SCHEMES,
  BORDER_WIDTHS,
  LINE_WIDTHS,
  drawShapeThumb,
  LANDMARK_GROUPS,
  LANDMARK_OPTIONS,
  drawLandmarkThumb,
} from '../lib/shapes'
import { AI_ICON_OPTIONS, drawAIThumb } from '../lib/ai_icons'

// 形状选择器
function ShapePicker({ value, onChange, styleOpts }) {
  const thumbs = useRef({})
  const [ready, setReady] = useState(false)

  // 预渲染所有形状缩略图
  useEffect(() => {
    SHAPE_OPTIONS.forEach(s => {
      if (!thumbs.current[s.id]) {
        thumbs.current[s.id] = drawShapeThumb(s.id, styleOpts)
      }
    })
    setReady(true)
  }, [styleOpts])

  // 重新渲染当前选中方案的缩略图（换配色时）
  useEffect(() => {
    Object.keys(thumbs.current).forEach(id => {
      thumbs.current[id] = drawShapeThumb(Number(id), styleOpts)
    })
    setReady(true)
  }, [styleOpts.colorScheme, styleOpts.lineWidth])

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold" style={{ color: '#1C1C1E' }}>封面形状</span>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#8b5cf6', color: '#fff' }}>
          {value === -1 ? '随机' : (SHAPE_OPTIONS.find(s => s.id === value)?.label ?? '随机')}
        </span>
      </div>

      {SHAPE_GROUPS.map(group => {
        const shapes = SHAPE_OPTIONS.filter(s => s.group === group)
        return (
          <div key={group} className="mb-3">
            <div className="text-xs mb-1.5" style={{ color: '#A8A29E' }}>{group}</div>
            <div className="flex flex-wrap gap-1.5">
              {/* 随机选项 */}
              {group === '图表' && (
                <button
                  onClick={() => onChange(-1)}
                  title="随机"
                  className="flex items-center justify-center rounded-lg transition-all"
                  style={{
                    width: 56, height: 56,
                    background: value === -1 ? '#1a1a1a' : '#2a2a2a',
                    border: `2px solid ${value === -1 ? '#8b5cf6' : 'transparent'}`,
                    cursor: 'pointer',
                  }}
                >
                  <span className="text-xl">🎲</span>
                </button>
              )}
              {shapes.map(s => (
                <button
                  key={s.id}
                  onClick={() => onChange(s.id)}
                  title={s.label}
                  className="rounded-lg overflow-hidden transition-all relative"
                  style={{
                    width: 56, height: 56,
                    background: '#1a1a1a',
                    border: `2px solid ${value === s.id ? '#8b5cf6' : 'transparent'}`,
                    cursor: 'pointer',
                    padding: 0,
                    transform: value === s.id ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {ready && thumbs.current[s.id] && (
                    <img
                      src={thumbs.current[s.id].toDataURL()}
                      alt={s.label}
                      style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'crisp-edges' }}
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 text-center"
                    style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', lineHeight: '14px', background: 'rgba(0,0,0,0.4)', paddingBottom: 2 }}>
                    {s.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// 高级选项
function AdvancedOptions({ styleOpts, onChange }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold" style={{ color: '#1C1C1E' }}>高级选项</span>
      </div>

      {/* 边框粗细 */}
      <div className="mb-3">
        <div className="text-xs mb-1.5" style={{ color: '#A8A29E' }}>边框粗细</div>
        <div className="flex gap-1.5">
          {BORDER_WIDTHS.map(b => (
            <button
              key={b.id}
              onClick={() => onChange({ ...styleOpts, borderWidth: b.id })}
              className="px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{
                background: styleOpts.borderWidth === b.id ? '#1a1a1a' : '#FAFAF6',
                color: styleOpts.borderWidth === b.id ? '#fff' : '#6B6860',
                border: `1px solid ${styleOpts.borderWidth === b.id ? '#8b5cf6' : '#E8E5DF'}`,
                cursor: 'pointer',
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* 线条粗细 */}
      <div className="mb-3">
        <div className="text-xs mb-1.5" style={{ color: '#A8A29E' }}>线条粗细</div>
        <div className="flex gap-1.5">
          {LINE_WIDTHS.map(l => (
            <button
              key={l.id}
              onClick={() => onChange({ ...styleOpts, lineWidth: l.id })}
              className="px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{
                background: styleOpts.lineWidth === l.id ? '#1a1a1a' : '#FAFAF6',
                color: styleOpts.lineWidth === l.id ? '#fff' : '#6B6860',
                border: `1px solid ${styleOpts.lineWidth === l.id ? '#8b5cf6' : '#E8E5DF'}`,
                cursor: 'pointer',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* 配色方案 */}
      <div className="mb-3">
        <div className="text-xs mb-1.5" style={{ color: '#A8A29E' }}>配色方案</div>
        <div className="flex gap-1.5 flex-wrap">
          {COLOR_SCHEMES.map(c => (
            <button
              key={c.id}
              onClick={() => onChange({ ...styleOpts, colorScheme: c.id })}
              className="px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
              style={{
                background: styleOpts.colorScheme === c.id ? '#1a1a1a' : '#FAFAF6',
                color: styleOpts.colorScheme === c.id ? '#fff' : '#6B6860',
                border: `1px solid ${styleOpts.colorScheme === c.id ? '#8b5cf6' : '#E8E5DF'}`,
                cursor: 'pointer',
              }}
            >
              <div className="flex gap-0.5">
                {c.colors.map((col, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: col, border: '1px solid rgba(0,0,0,0.1)' }} />
                ))}
              </div>
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PageGenerator() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [summarizedData, setSummarizedData] = useState(null)
  const [showRecorder, setShowRecorder] = useState(false)
  const [error, setError] = useState(null)
  const [selectedShape, setSelectedShape] = useState(-1)
  const [selectedLandmark, setSelectedLandmark] = useState(-1)
  const [selectedAI, setSelectedAI] = useState(-1)
  const [styleOpts, setStyleOpts] = useState({ borderWidth: 4, lineWidth: 3, colorScheme: 'cinnabar' })
  const [showAdvanced, setShowAdvanced] = useState(false)
  // 主风格：chinese（中国风）| city（城市地标）
  const [mainStyle, setMainStyle] = useState(null)
  // 动画风格（中国风专用）：chinese（网格）| minimal（单卡片）
  const [animationStyle, setAnimationStyle] = useState('chinese')

  // 城市地标缩略图缓存
  const landmarkThumbs = useRef({})
  const [landmarkReady, setLandmarkReady] = useState(false)
  const aiThumbs = useRef({})
  const [aiReady, setAIReady] = useState(false)

  useEffect(() => {
    LANDMARK_OPTIONS.forEach(s => {
      if (!landmarkThumbs.current[s.id]) {
        landmarkThumbs.current[s.id] = drawLandmarkThumb(s.id, styleOpts)
      }
    })
    setLandmarkReady(true)
  }, [])

  useEffect(() => {
    AI_ICON_OPTIONS.forEach(s => {
      if (!aiThumbs.current[s.id]) {
        aiThumbs.current[s.id] = drawAIThumb(s.id, {})
      }
    })
    setAIReady(true)
  }, [])

  function generate() {
    if (!input.trim()) return
    setIsLoading(true)
    setError(null)

    fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          setIsLoading(false)
          return
        }
        setSummarizedData(data)
        setIsLoading(false)
        setShowRecorder(true)
      })
      .catch(() => {
        setError('网络错误，请重试')
        setIsLoading(false)
      })
  }

  function handleClose() {
    setShowRecorder(false)
    setSummarizedData(null)
    setInput('')
  }

  function handleStyleChange(opts) {
    setStyleOpts(opts)
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAF9F6' }}>
      {/* 录屏全屏播放器 */}
      {showRecorder && summarizedData && (
        <RecorderPlayer
          data={summarizedData}
          onClose={handleClose}
          shapeType={mainStyle === 'city' ? selectedLandmark : mainStyle === 'ai' ? selectedAI : selectedShape}
          styleOpts={styleOpts}
          animationStyle={mainStyle === 'city' ? 'minimal' : mainStyle === 'ai' ? 'tech' : animationStyle}
          mainStyle={mainStyle}
        />
      )}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="font-bold text-4xl mb-3" style={{ color: '#1C1C1E' }}>一键生成精简网页</h1>
          <p className="text-base" style={{ color: '#6B6860' }}>
            粘贴任意内容，AI提炼精华，生成直观可分享的总结页面
          </p>
        </div>

        {/* ===================== 第一步：选择风格 ===================== */}
        {mainStyle === null && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold" style={{ color: '#6B6860' }}>选择一套视频风格</p>
              <p className="text-xs mt-1" style={{ color: '#A8A29E' }}>选择后可切换，共 {LANDMARK_OPTIONS.length + SHAPE_OPTIONS.length} 种封面</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 风格一：中国风 */}
              <button
                onClick={() => setMainStyle('chinese')}
                className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02] text-left"
                style={{ cursor: 'pointer', border: '2px solid #E8E5DF' }}
              >
                <div style={{ height: '280px', background: '#0a0a14', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '120px', height: '120px', borderRadius: '24px', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '48px' }}>🏮</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center' }}>
                    <div style={{ color: 'white', fontWeight: '700', fontSize: '18px', fontFamily: 'PingFang SC, sans-serif' }}>中国风</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '4px' }}>传统文化 · 网格卡片</div>
                  </div>
                  <div style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{SHAPE_OPTIONS.length} 种封面</div>
                </div>
                <div style={{ padding: '16px', background: '#FFFFFF' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px', color: '#1C1C1E' }}>中国传统文化风格</div>
                  <div style={{ fontSize: '12px', color: '#6B6860' }}>祥云、山水、龙凤等国风元素 · 网格卡片依次出现</div>
                </div>
              </button>

              {/* 风格二：城市地标 */}
              <button
                onClick={() => setMainStyle('city')}
                className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02] text-left"
                style={{ cursor: 'pointer', border: '2px solid #E8E5DF' }}
              >
                <div style={{ height: '280px', background: 'linear-gradient(180deg, #0d1b2a 0%, #1a2a4a 60%, #0f1c30 100%)', position: 'relative', overflow: 'hidden' }}>
                  {[...Array(12)].map((_, i) => (
                    <div key={i} style={{ position: 'absolute', left: `${(i * 8 + 5) % 100}%`, top: `${(i * 13 + 3) % 50}%`, width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
                  ))}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌆</div>
                    <div style={{ color: '#f5d87a', fontWeight: '700', fontSize: '24px', fontFamily: 'PingFang SC, sans-serif', textShadow: '0 0 20px rgba(212,160,23,0.5)' }}>城市地标</div>
                  </div>
                  <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center' }}>
                    <div style={{ color: 'white', fontWeight: '700', fontSize: '18px', fontFamily: 'PingFang SC, sans-serif' }}>城市地标</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '4px' }}>省会城市 · 夜景剪影</div>
                  </div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '11px', color: 'rgba(212,160,23,0.6)' }}>{LANDMARK_OPTIONS.length} 种封面</div>
                </div>
                <div style={{ padding: '16px', background: '#FFFFFF' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px', color: '#1C1C1E' }}>城市地标风格</div>
                  <div style={{ fontSize: '12px', color: '#6B6860' }}>24 个省会城市天际线剪影 · 深色夜景简约风格</div>
                </div>
              </button>

              {/* 风格三：AI科技 */}
              <button
                onClick={() => setMainStyle('ai')}
                className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02] text-left"
                style={{ cursor: 'pointer', border: '2px solid #E8E5DF' }}
              >
                <div style={{ height: '280px', background: '#080c14', position: 'relative', overflow: 'hidden' }}>
                  {/* 粒子 */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} style={{ position: 'absolute', left: `${(i * 37 + 5) % 100}%`, top: `${(i * 23 + 3) % 60}%`, width: 2, height: 2, borderRadius: '50%', background: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#a855f7' : '#ffffff', opacity: 0.3 }} />
                  ))}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '120px', height: '120px', borderRadius: '24px', border: '3px solid rgba(168,85,247,0.6)', boxShadow: '0 0 20px rgba(168,85,247,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '48px' }}>🤖</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center' }}>
                    <div style={{ color: 'white', fontWeight: '700', fontSize: '18px', fontFamily: 'PingFang SC, sans-serif' }}>AI 科技</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '4px' }}>AI工具 · 波浪动画</div>
                  </div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '11px', color: 'rgba(168,85,247,0.6)' }}>{AI_ICON_OPTIONS.length} 种封面</div>
                </div>
                <div style={{ padding: '16px', background: '#FFFFFF' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px', color: '#1C1C1E' }}>AI 科技风格</div>
                  <div style={{ fontSize: '12px', color: '#6B6860' }}>AI 工具/模型/公司 logo · 波浪式动感动画</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ===================== 第二步：配置内容 ===================== */}
        {mainStyle !== null && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              {/* 风格切换 */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setMainStyle(null)}
                  style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '8px', background: '#FAFAF6', color: '#8b5cf6', border: '1px solid #E8E5DF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  ← 重新选择风格
                </button>
                <span style={{ fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '8px', background: mainStyle === 'chinese' ? '#1a1a1a' : mainStyle === 'city' ? '#0d1b2a' : '#080c14', color: mainStyle === 'chinese' ? '#fff' : mainStyle === 'city' ? '#f5d87a' : '#a855f7', border: `1px solid ${mainStyle === 'chinese' ? '#8b5cf6' : mainStyle === 'city' ? '#d4a017' : '#a855f7'}` }}>
                  {mainStyle === 'chinese' ? '🏮 中国风' : mainStyle === 'city' ? '🌆 城市地标' : '🤖 AI科技'}
                </span>
              </div>

              <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E8E5DF' }}>
                <div className="mb-4">
                  <div className="text-sm font-bold mb-1" style={{ color: '#1C1C1E' }}>粘贴内容</div>
                  <div className="text-xs" style={{ color: '#6B6860' }}>粘贴文章链接、公众号内容、或任意文字</div>
                </div>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="粘贴文章链接或文字内容..."
                  className="w-full rounded-xl p-4 text-sm leading-relaxed resize-none outline-none"
                  style={{ background: '#FAFAF6', border: `1px solid ${error ? '#ef4444' : '#E8E5DF'}`, color: '#1C1C1E', minHeight: '160px', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#D97706' }}
                  onBlur={e => { e.target.style.borderColor = error ? '#ef4444' : '#E8E5DF' }}
                />
                {error && (
                  <div className="mt-2 px-3 py-2 rounded-lg text-xs" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                    {error}
                  </div>
                )}

                {/* ====== 中国风选项 ====== */}
                {mainStyle === 'chinese' && (
                  <>
                    <div className="mt-4 p-4 rounded-xl" style={{ background: '#FAFAF6', border: '1px solid #E8E5DF' }}>
                      <div className="text-xs font-bold mb-2" style={{ color: '#1C1C1E' }}>动画方式</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setAnimationStyle('chinese')}
                          style={{ background: animationStyle === 'chinese' ? '#1a1a1a' : '#FFFFFF', border: `2px solid ${animationStyle === 'chinese' ? '#8b5cf6' : '#E8E5DF'}`, borderRadius: '12px', padding: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                        >
                          <span style={{ fontSize: '16px' }}>📐</span>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: animationStyle === 'chinese' ? '#fff' : '#6B6860' }}>网格卡片</span>
                          <span style={{ fontSize: '12px', color: animationStyle === 'chinese' ? 'rgba(255,255,255,0.5)' : '#A8A29E' }}>依次出现</span>
                        </button>
                        <button
                          onClick={() => setAnimationStyle('minimal')}
                          style={{ background: animationStyle === 'minimal' ? '#1a1a1a' : '#FFFFFF', border: `2px solid ${animationStyle === 'minimal' ? '#8b5cf6' : '#E8E5DF'}`, borderRadius: '12px', padding: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                        >
                          <span style={{ fontSize: '16px' }}>📦</span>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: animationStyle === 'minimal' ? '#fff' : '#6B6860' }}>单卡片</span>
                          <span style={{ fontSize: '12px', color: animationStyle === 'minimal' ? 'rgba(255,255,255,0.5)' : '#A8A29E' }}>依次展示</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 p-4 rounded-xl" style={{ background: '#FAFAF6', border: '1px solid #E8E5DF' }}>
                      <ShapePicker value={selectedShape} onChange={setSelectedShape} styleOpts={styleOpts} />
                    </div>

                    <button
                      onClick={() => setShowAdvanced(v => !v)}
                      className="mt-2 w-full text-xs py-2 rounded-lg flex items-center justify-center gap-1"
                      style={{ color: '#8b5cf6', cursor: 'pointer', background: 'transparent', border: 'none' }}
                    >
                      <span>{showAdvanced ? '收起' : '高级选项'}</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <path d="M2 4l4 4 4-4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {showAdvanced && (
                      <div className="mt-2 p-4 rounded-xl" style={{ background: '#FAFAF6', border: '1px solid #E8E5DF' }}>
                        <AdvancedOptions styleOpts={styleOpts} onChange={handleStyleChange} />
                      </div>
                    )}
                  </>
                )}

                {/* ====== 城市地标选项 ====== */}
                {mainStyle === 'city' && (
                  <div className="mt-4 p-4 rounded-xl" style={{ background: '#FAFAF6', border: '1px solid #E8E5DF' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold" style={{ color: '#1C1C1E' }}>选择城市封面</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#d4a017', color: '#fff' }}>
                        {selectedLandmark < 0 ? '随机' : LANDMARK_OPTIONS[selectedLandmark]?.label}
                      </span>
                    </div>
                    {LANDMARK_GROUPS.map(group => {
                      const cities = LANDMARK_OPTIONS.filter(s => s.group === group)
                      return (
                        <div key={group} className="mb-3">
                          <div className="text-xs mb-1.5" style={{ color: '#A8A29E' }}>{group}</div>
                          <div className="flex flex-wrap gap-1.5">
                            {group === '华北东北' && (
                              <button
                                onClick={() => setSelectedLandmark(-1)}
                                title="随机"
                                style={{ width: 56, height: 56, background: selectedLandmark === -1 ? '#0d1b2a' : '#1a2a4a', border: `2px solid ${selectedLandmark === -1 ? '#d4a017' : 'transparent'}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <span style={{ fontSize: '24px' }}>🎲</span>
                              </button>
                            )}
                            {cities.map(s => (
                              <button
                                key={s.id}
                                onClick={() => setSelectedLandmark(s.id)}
                                title={`${s.label} · ${s.landmark}`}
                                style={{ width: 56, height: 56, background: '#0d1b2a', border: `2px solid ${selectedLandmark === s.id ? '#d4a017' : 'transparent'}`, borderRadius: '8px', cursor: 'pointer', padding: 0, overflow: 'hidden', transform: selectedLandmark === s.id ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.15s', position: 'relative' }}
                              >
                                {landmarkReady && landmarkThumbs.current[s.id] && (
                                  <img src={landmarkThumbs.current[s.id].toDataURL()} alt={s.label} style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'crisp-edges' }} />
                                )}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: 'rgba(255,255,255,0.7)', lineHeight: '14px', background: 'rgba(0,0,0,0.5)', paddingBottom: 2 }}>
                                  {s.label}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* ====== AI科技选项 ====== */}
                {mainStyle === 'ai' && (
                  <div className="mt-4 p-4 rounded-xl" style={{ background: '#FAFAF6', border: '1px solid #E8E5DF' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold" style={{ color: '#1C1C1E' }}>选择AI图标封面</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#a855f7', color: '#fff' }}>
                        {selectedAI < 0 ? '随机' : AI_ICON_OPTIONS[selectedAI]?.label}
                      </span>
                    </div>
                    {AI_ICON_OPTIONS.reduce((groups, icon) => {
                      const g = groups.find(gr => gr === icon.group)
                      if (!g) groups.push(icon.group)
                      return groups
                    }, []).map(group => {
                      const icons = AI_ICON_OPTIONS.filter(s => s.group === group)
                      return (
                        <div key={group} className="mb-3">
                          <div className="text-xs mb-1.5" style={{ color: '#A8A29E' }}>{group}</div>
                          <div className="flex flex-wrap gap-1.5">
                            {group === '大模型' && (
                              <button
                                onClick={() => setSelectedAI(-1)}
                                title="随机"
                                style={{ width: 56, height: 56, background: selectedAI === -1 ? '#080c14' : '#0a0e1a', border: `2px solid ${selectedAI === -1 ? '#a855f7' : 'transparent'}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <span style={{ fontSize: '24px' }}>🎲</span>
                              </button>
                            )}
                            {icons.map(s => (
                              <button
                                key={s.id}
                                onClick={() => setSelectedAI(s.id)}
                                title={s.label}
                                style={{ width: 56, height: 56, background: '#080c14', border: `2px solid ${selectedAI === s.id ? '#a855f7' : 'transparent'}`, borderRadius: '8px', cursor: 'pointer', padding: 0, overflow: 'hidden', transform: selectedAI === s.id ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.15s', position: 'relative' }}
                              >
                                {aiReady && aiThumbs.current[s.id] && (
                                  <img src={aiThumbs.current[s.id].toDataURL()} alt={s.label} style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'crisp-edges' }} />
                                )}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: 'rgba(255,255,255,0.7)', lineHeight: '14px', background: 'rgba(0,0,0,0.5)', paddingBottom: 2 }}>
                                  {s.label}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <button
                  onClick={generate}
                  disabled={!input.trim() || isLoading}
                  className="mt-4 w-full py-3 rounded-xl text-sm font-semibold"
                  style={{ background: input.trim() && !isLoading ? '#D97706' : '#E8E5DF', color: input.trim() && !isLoading ? '#FFFFFF' : '#A8A29E', cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed', border: 'none' }}>
                  {isLoading ? 'AI 提炼中...' : '生成并录制视频 →'}
                </button>
                <p className="mt-3 text-xs text-center" style={{ color: '#A8A29E' }}>Powered by DeepSeek · 自动录制视频</p>
              </div>

              {/* 快捷文案 */}
              <div className="mt-4 p-4 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E5DF' }}>
                <div className="text-xs font-bold mb-2" style={{ color: '#6B6860' }}>快捷测试文案</div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setInput('暴利行业的筛选标准有三个维度：第一是刚需性——人们迫切需要的产品或服务，比如医疗、教育、房产。第二是高频率——使用或购买的次数要足够多，比如食品、化妆品、日用品。第三是有门槛——进入这个赛道需要有一定的壁垒，比如技术门槛，资金门槛或资质门槛。满足这三个条件的行业，往往能获得超额利润。')}
                    style={{ fontSize: '12px', textAlign: 'left', padding: '8px 12px', background: '#FAFAF6', color: '#6B6860', border: '1px solid #E8E5DF', borderRadius: '8px', cursor: 'pointer' }}>
                    暴利行业三维度（3模块）
                  </button>
                  <button
                    onClick={() => setInput('成功的创业者有三个关键特质：第一是执行力强，能够快速把想法落地，不停留在空想阶段。第二是学习能力，能不断吸收新知识、迭代认知，保持竞争力。第三是抗压力，面对挫折不轻易放弃，能在逆境中坚持找到出路。')}
                    style={{ fontSize: '12px', textAlign: 'left', padding: '8px 12px', background: '#FAFAF6', color: '#6B6860', border: '1px solid #E8E5DF', borderRadius: '8px', cursor: 'pointer' }}>
                    创业者三特质（3模块）
                  </button>
                  <button
                    onClick={() => setInput('创业成功的五大核心要素：第一是市场需求，必须找到真实存在的痛点，而非伪需求。第二是产品差异化，在同质化竞争中找到独特价值主张。第三是团队能力，创始团队的执行力和互补性决定成败。第四是资本效率，用最小的资源撬动最大的增长。第五是时机把握，太早成为先烈，太晚错过窗口。满足这五个要素，创业成功率会大幅提升。')}
                    style={{ fontSize: '12px', textAlign: 'left', padding: '8px 12px', background: '#FAFAF6', color: '#6B6860', border: '1px solid #E8E5DF', borderRadius: '8px', cursor: 'pointer' }}>
                    创业成功五大要素（5模块）
                  </button>
                </div>
              </div>
            </div>

            {/* 右侧预览 */}
            <div>
              <div className="rounded-2xl overflow-hidden" style={{ height: '520px', background: '#FFFFFF', border: '1px solid #E8E5DF', position: 'relative' }}>
                {!summarizedData ? (
                  <div className="flex flex-col items-center justify-center h-full" style={{ color: '#A8A29E' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
                    <p className="text-sm text-center px-8">
                      选择风格并输入内容<br />
                      点击生成自动录制视频
                    </p>
                  </div>
                ) : !showRecorder ? (
                  <div className="flex flex-col items-center justify-center h-full" style={{ color: '#6B6860' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                    <p className="text-sm">视频已生成完毕</p>
                    <button
                      onClick={() => setShowRecorder(true)}
                      style={{ marginTop: '12px', padding: '8px 20px', borderRadius: '12px', background: '#8b5cf6', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                      重新播放录制
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
