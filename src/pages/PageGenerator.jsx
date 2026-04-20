import { useState, useRef, useEffect } from 'react'
import RecorderPlayer from './RecorderPlayer'
import {
  SHAPE_GROUPS,
  SHAPE_OPTIONS,
  COLOR_SCHEMES,
  BORDER_WIDTHS,
  LINE_WIDTHS,
  drawShapeThumb,
} from '../lib/shapes'

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
  const [styleOpts, setStyleOpts] = useState({ borderWidth: 4, lineWidth: 3, colorScheme: 'cinnabar' })
  const [showAdvanced, setShowAdvanced] = useState(false)

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
          shapeType={selectedShape}
          styleOpts={styleOpts}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="font-bold text-4xl mb-3" style={{ color: '#1C1C1E' }}>一键生成精简网页</h1>
          <p className="text-base" style={{ color: '#6B6860' }}>
            粘贴任意内容，AI提炼精华，生成直观可分享的总结页面
          </p>
          <p className="text-xs mt-2" style={{ color: '#A8A29E' }}>
            生成后自动录制视频，可下载
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* 左侧输入 */}
          <div>
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
                style={{
                  background: '#FAFAF6',
                  border: `1px solid ${error ? '#ef4444' : '#E8E5DF'}`,
                  color: '#1C1C1E',
                  minHeight: '180px',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = '#D97706' }}
                onBlur={e => { e.target.style.borderColor = error ? '#ef4444' : '#E8E5DF' }}
              />
              {error && (
                <div className="mt-2 px-3 py-2 rounded-lg text-xs"
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                  {error}
                </div>
              )}

              {/* 形状选择器 */}
              <div className="mt-4 p-4 rounded-xl" style={{ background: '#FAFAF6', border: '1px solid #E8E5DF' }}>
                <ShapePicker
                  value={selectedShape}
                  onChange={setSelectedShape}
                  styleOpts={styleOpts}
                />
              </div>

              {/* 高级选项折叠 */}
              <button
                onClick={() => setShowAdvanced(v => !v)}
                className="mt-2 w-full text-xs py-2 rounded-lg flex items-center justify-center gap-1"
                style={{ color: '#8b5cf6', cursor: 'pointer', background: 'transparent', border: 'none' }}
              >
                <span>{showAdvanced ? '收起' : '高级选项'}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M2 4l4 4 4-4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {showAdvanced && (
                <div className="mt-2 p-4 rounded-xl" style={{ background: '#FAFAF6', border: '1px solid #E8E5DF' }}>
                  <AdvancedOptions styleOpts={styleOpts} onChange={handleStyleChange} />
                </div>
              )}

              <button
                onClick={generate}
                disabled={!input.trim() || isLoading}
                className="mt-4 w-full py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: input.trim() && !isLoading ? '#D97706' : '#E8E5DF',
                  color: input.trim() && !isLoading ? '#FFFFFF' : '#A8A29E',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  border: 'none',
                }}>
                {isLoading ? 'AI 提炼中...' : '生成并录制视频 →'}
              </button>

              <p className="mt-3 text-xs text-center" style={{ color: '#A8A29E' }}>Powered by DeepSeek · 自动录制</p>
            </div>

            {/* 快捷文案 */}
            <div className="mt-4 p-4 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E5DF' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#6B6860' }}>快捷测试文案</div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setInput('暴利行业的筛选标准有三个维度：第一是刚需性——人们迫切需要的产品或服务，比如医疗、教育、房产。第二是高频率——使用或购买的次数要足够多，比如食品、化妆品、日用品。第三是有门槛——进入这个赛道需要有一定的壁垒，比如技术门槛、资金门槛或资质门槛。满足这三个条件的行业，往往能获得超额利润。')}
                  className="text-xs text-left px-3 py-2 rounded-lg"
                  style={{ background: '#FAFAF6', color: '#6B6860', border: '1px solid #E8E5DF', cursor: 'pointer' }}>
                  暴利行业三维度（3模块）
                </button>
                <button
                  onClick={() => setInput('成功的创业者有三个关键特质：第一是执行力强，能够快速把想法落地，不停留在空想阶段。第二是学习能力，能不断吸收新知识、迭代认知，保持竞争力。第三是抗压力，面对挫折不轻易放弃，能在逆境中坚持找到出路。')}
                  className="text-xs text-left px-3 py-2 rounded-lg"
                  style={{ background: '#FAFAF6', color: '#6B6860', border: '1px solid #E8E5DF', cursor: 'pointer' }}>
                  创业者三特质（3模块）
                </button>
                <button
                  onClick={() => setInput('创业成功的五大核心要素：第一是市场需求，必须找到真实存在的痛点，而非伪需求。第二是产品差异化，在同质化竞争中找到独特价值主张。第三是团队能力，创始团队的执行力和互补性决定成败。第四是资本效率，用最小的资源撬动最大的增长。第五是时机把握，太早成为先烈，太晚错过窗口。满足这五个要素，创业成功率会大幅提升。')}
                  className="text-xs text-left px-3 py-2 rounded-lg"
                  style={{ background: '#FAFAF6', color: '#6B6860', border: '1px solid #E8E5DF', cursor: 'pointer' }}>
                  创业成功五大要素（5模块）
                </button>
              </div>
            </div>
          </div>

          {/* 右侧预览 */}
          <div>
            <div className="rounded-2xl overflow-hidden"
              style={{ height: '520px', background: '#FFFFFF', border: '1px solid #E8E5DF', position: 'relative' }}>
              {!summarizedData ? (
                <div className="flex flex-col items-center justify-center h-full" style={{ color: '#A8A29E' }}>
                  <div className="text-5xl mb-4">🎬</div>
                  <p className="text-sm text-center px-8">
                    左侧输入内容并点击生成<br />
                    自动录制视频导出
                  </p>
                </div>
              ) : !showRecorder ? (
                <div className="flex flex-col items-center justify-center h-full" style={{ color: '#6B6860' }}>
                  <div className="text-5xl mb-4">✓</div>
                  <p className="text-sm">视频已生成完毕</p>
                  <button
                    onClick={() => setShowRecorder(true)}
                    className="mt-3 px-5 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: '#8b5cf6', color: 'white', border: 'none', cursor: 'pointer' }}>
                    重新播放录制
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
