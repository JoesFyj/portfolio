import { useState, useEffect, useRef } from 'react'
import { playSubtitleSound, playGraphicSound, playLabelSound, playShortSound, playDescSound, playCompleteSound, playWhooshSound } from '../lib/sounds'

const DEMO_RESULT = {
  title: 'AI时代，普通人如何用AI提升效率',
  subtitle: '从写文案到做视频，一个人的效率革命',
  points: [
    { label: '写文案', short: 'AI快速生成', desc: '用AI助手快速生成、润色、校对各类文案，效率提升10倍' },
    { label: '做图片', short: '一键生图',   desc: 'AI生成配图、封面、海报，无需设计基础' },
    { label: '做视频', short: '自动剪辑',   desc: 'AI配音+自动剪辑，一个人也能日更' },
    { label: '做数据', short: '智能分析',   desc: 'AI分析数据、自动生成报告，看懂数字' },
  ],
}

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// ============================================================
// 动态图形组件 - 小尺寸，居中
// ============================================================
function DynamicGraphic({ pointCount, drawnCount }) {
  const sides = Math.max(3, Math.min(pointCount, 8))
  const cx = 50
  const cy = 50
  const r = Math.max(20, 34 - pointCount * 1.2)
  const isStar = sides === 5
  const lineColor = drawnCount === pointCount ? '#a855f7' : '#06b6d4'

  function getOuterPts(n) {
    return Array.from({ length: n }, (_, i) => ({
      x: cx + r * Math.cos((i / n) * 2 * Math.PI - Math.PI / 2),
      y: cy + r * Math.sin((i / n) * 2 * Math.PI - Math.PI / 2),
    }))
  }
  function getInnerPts(n) {
    return Array.from({ length: n }, (_, i) => ({
      x: cx + r * 0.45 * Math.cos(((i + 0.5) / n) * 2 * Math.PI - Math.PI / 2),
      y: cy + r * 0.45 * Math.sin(((i + 0.5) / n) * 2 * Math.PI - Math.PI / 2),
    }))
  }

  const outerPts = getOuterPts(sides)
  const innerPts = isStar ? getInnerPts(5) : null

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl"
      style={{ background: 'linear-gradient(135deg, #0a0a1a, #0f0f2a)' }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <circle cx={cx} cy={cy} r={r * 0.35} opacity="0.1" fill="#a855f7"
          style={{ animation: 'dgCpulse 2.5s ease-in-out infinite' }} />
        <circle cx={cx} cy={cy} r="1.8" fill={lineColor}
          style={{ filter: `drop-shadow(0 0 3px ${lineColor})`, animation: 'dgCpulse 2.5s ease-in-out infinite 0.3s' }} />
        {drawnCount > 0 && outerPts.map((pt, i) => {
          if (i >= drawnCount) return null
          const next = outerPts[(i + 1) % sides]
          if (isStar) {
            const next2 = outerPts[(i + 2) % sides]
            return (
              <g key={i}>
                <line x1={pt.x.toFixed(1)} y1={pt.y.toFixed(1)} x2={innerPts[i].x.toFixed(1)} y2={innerPts[i].y.toFixed(1)}
                  stroke="#ec4899" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"
                  style={{ filter: 'drop-shadow(0 0 2px #ec4899)' }} />
                <line x1={innerPts[i].x.toFixed(1)} y1={innerPts[i].y.toFixed(1)} x2={next2.x.toFixed(1)} y2={next2.y.toFixed(1)}
                  stroke="#a855f7" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"
                  style={{ filter: 'drop-shadow(0 0 1px #a855f7)' }} />
              </g>
            )
          }
          return (
            <line key={i} x1={pt.x.toFixed(1)} y1={pt.y.toFixed(1)}
              x2={next.x.toFixed(1)} y2={next.y.toFixed(1)}
              stroke={drawnCount >= pointCount ? 'url(#dgGrad2)' : lineColor}
              strokeWidth={drawnCount >= pointCount ? 1.2 : 0.9}
              strokeLinecap="round" opacity={drawnCount >= pointCount ? 1 : 0.6}
              style={{ filter: `drop-shadow(0 0 2px ${lineColor})` }} />
          )
        })}
        {drawnCount > 0 && outerPts.map((pt, i) => (
          i < drawnCount && (
            <circle key={`d-${i}`} cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)} r={isStar ? 1.8 : 1.6}
              fill={isStar ? '#ec4899' : lineColor}
              style={{ animation: `dgCpulse ${1.2 + i * 0.1}s ease-in-out infinite ${i * 0.15}s`, filter: `drop-shadow(0 0 3px ${isStar ? '#ec4899' : lineColor})` }} />
          )
        ))}
        {drawnCount === pointCount && (
          <circle cx={cx} cy={cy} r={r + 4}
            fill="none" stroke={lineColor} strokeWidth="0.5" strokeDasharray="2 4"
            opacity="0.2" style={{ animation: 'dgRotate 10s linear infinite' }} />
        )}
        <defs>
          <linearGradient id="dgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        @keyframes dgCpulse { 0%,100% { opacity:0.7; transform-origin: center; } 50% { opacity:1; transform: scale(1.2); } }
        @keyframes dgRotate { from { transform: rotate(0deg); transform-origin: 50px 50px; } to { transform: rotate(360deg); transform-origin: 50px 50px; } }
      `}</style>
    </div>
  )
}

// ============================================================
// 布局 0：图形居中，4点环绕（上下左右）
// ============================================================
function L0({ points, pointStates, phase }) {
  const drawnCount = Math.max(0, phase - 3)
  const [top, right, bottom, left] = points
  const colors = ['#7c3aed', '#059669', '#db2777', '#0891b2']
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 四个方向的卡片 */}
      {[
        { pt: top, i: 0, pos: 'top-full', w: '44%', h: '28%', top: '0', left: '28%', tx: '0', ty: '-8px', dir: 'up' },
        { pt: right, i: 1, pos: 'right-full', w: '32%', h: '28%', top: '36%', right: '0', tx: '8px', ty: '0', dir: 'right' },
        { pt: bottom, i: 2, pos: 'bottom-full', w: '44%', h: '28%', bottom: '0', left: '28%', tx: '0', ty: '8px', dir: 'down' },
        { pt: left, i: 3, pos: 'left-full', w: '32%', h: '28%', top: '36%', left: '0', tx: '-8px', ty: '0', dir: 'left' },
      ].map(({ pt, i, pos, w, h, top: t, right: r, bottom: b, left: l, tx, ty, dir }) => {
        if (!pt) return null
        const st = pointStates[i] || 0
        const visible = phase >= 4 + i
        const c = colors[i % colors.length]
        const keyframes = { up: 'from { opacity:0; transform:translateY(-8px); }', right: 'from { opacity:0; transform:translateX(8px); }', down: 'from { opacity:0; transform:translateY(8px); }', left: 'from { opacity:0; transform:translateX(-8px); }' }[dir]
        return (
          <div key={i} className="absolute rounded-xl px-2 py-1.5 flex flex-col justify-center overflow-hidden"
            style={{
              width: w, height: h, top: t, right: r, bottom: b, left: l,
              background: st >= 2 ? `${c}10` : 'rgba(255,255,255,0.6)',
              border: `1px solid ${st >= 1 ? `${c}50` : 'rgba(255,255,255,0.3)'}`,
              opacity: visible ? 1 : 0,
              transition: 'all 0.35s',
              animation: visible && st >= 1 ? `hubCard ${0.35}s cubic-bezier(0.16,1,0.3,1) both` : 'none',
            }}>
            <style>{`@keyframes hubCard { ${keyframes} to { opacity:1; transform:none; } }`}</style>
            <div className="text-xs font-bold mb-0.5" style={{ color: c }}>{pt.label}</div>
            {st >= 1 && <div className="text-xs truncate mb-0.5" style={{ color: `${c}88` }}>{pt.short}</div>}
            {st >= 2 && <p className="text-xs leading-tight" style={{ color: '#1C1C1E' }}>{pt.desc}</p>}
          </div>
        )
      })}
      {/* 居中图形 */}
      <div className="absolute rounded-xl overflow-hidden z-10"
        style={{
          width: '20%', height: '36%',
          top: '32%', left: '40%',
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}>
        <DynamicGraphic pointCount={points.length} drawnCount={drawnCount} />
      </div>
      <style>{`@keyframes fa { from { opacity:0; } to { opacity:1; } }`}</style>
    </div>
  )
}

// ============================================================
// 布局 1：图形居中，5点环绕（上加4周）
// ============================================================
function L1({ points, pointStates, phase }) {
  const drawnCount = Math.max(0, phase - 3)
  const colors = ['#7c3aed', '#059669', '#db2777', '#0891b2', '#d97706']
  const n = points.length
  // 4点围成一圈在下方，1点在顶部
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 顶部中心点 */}
      {points[0] && (() => {
        const st = pointStates[0] || 0
        const visible = phase >= 4
        const c = colors[0]
        return (
          <div className="absolute rounded-xl px-2 py-1.5 flex flex-col justify-center overflow-hidden"
            style={{
              width: '36%', top: '2%', left: '32%',
              background: st >= 2 ? `${c}10` : 'rgba(255,255,255,0.6)',
              border: `1px solid ${st >= 1 ? `${c}50` : 'rgba(255,255,255,0.3)'}`,
              opacity: visible ? 1 : 0,
              transition: 'all 0.35s',
              animation: visible && st >= 1 ? 'hubTop 0.35s cubic-bezier(0.16,1,0.3,1) both' : 'none',
            }}>
            <div className="text-xs font-bold mb-0.5" style={{ color: c }}>{points[0].label}</div>
            {st >= 1 && <div className="text-xs truncate" style={{ color: `${c}88` }}>{points[0].short}</div>}
            {st >= 2 && <p className="text-xs leading-tight">{points[0].desc}</p>}
            <style>{`@keyframes hubTop { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }`}</style>
          </div>
        )
      })()}
      {/* 周围4点 */}
      {[0, 1, 2, 3].map(j => {
        const i = j + 1
        if (!points[i]) return null
        const pt = points[i]
        const st = pointStates[i] || 0
        const visible = phase >= 4 + i
        const c = colors[i % colors.length]
        // 0=右下, 1=左下, 2=左上, 3=右上（围绕图形）
        const positions = [
          { w: '30%', right: '2%', top: '58%' },
          { w: '30%', left: '2%', top: '58%' },
          { w: '30%', left: '2%', top: '8%' },
          { w: '30%', right: '2%', top: '8%' },
        ]
        const pos = positions[j]
        return (
          <div key={i} className="absolute rounded-xl px-2 py-1.5 flex flex-col justify-center overflow-hidden"
            style={{
              width: pos.w, ...pos,
              height: '28%',
              background: st >= 2 ? `${c}10` : 'rgba(255,255,255,0.6)',
              border: `1px solid ${st >= 1 ? `${c}50` : 'rgba(255,255,255,0.3)'}`,
              opacity: visible ? 1 : 0,
              transition: 'all 0.35s',
              animation: visible && st >= 1 ? `hubCardR 0.35s cubic-bezier(0.16,1,0.3,1) both` : 'none',
            }}>
            <div className="text-xs font-bold mb-0.5" style={{ color: c }}>{pt.label}</div>
            {st >= 1 && <div className="text-xs truncate" style={{ color: `${c}88` }}>{pt.short}</div>}
            {st >= 2 && <p className="text-xs leading-tight">{pt.desc}</p>}
            <style>{`@keyframes hubCardR { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:none; } }`}</style>
          </div>
        )
      })}
      {/* 居中图形 */}
      <div className="absolute rounded-xl overflow-hidden z-10"
        style={{
          width: '22%', height: '36%', top: '32%', left: '39%',
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}>
        <DynamicGraphic pointCount={points.length} drawnCount={drawnCount} />
      </div>
    </div>
  )
}

// ============================================================
// 布局 2：图形居中，上下双列卡片
// ============================================================
function L2({ points, pointStates, phase }) {
  const drawnCount = Math.max(0, phase - 3)
  const half = Math.ceil(points.length / 2)
  const top = points.slice(0, half)
  const bottom = points.slice(half)
  const colors = ['#e11d48', '#7c3aed', '#059669', '#d97706', '#0891b2', '#db2777']
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* 上方卡片组 */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 px-1 pt-1">
        {top.map((pt, j) => {
          const i = j
          const st = pointStates[i] || 0
          const visible = phase >= 4 + i
          const c = colors[i % colors.length]
          return (
            <div key={i} className="flex-1 rounded-xl px-2 py-1.5 flex flex-col justify-center overflow-hidden"
              style={{
                height: '26%',
                background: st >= 2 ? `${c}10` : 'rgba(255,255,255,0.6)',
                border: `1px solid ${st >= 1 ? `${c}50` : 'rgba(255,255,255,0.3)'}`,
                opacity: visible ? 1 : 0,
                transition: 'all 0.35s',
                animation: visible && st >= 1 ? 'hubDown 0.35s cubic-bezier(0.16,1,0.3,1) both' : 'none',
              }}>
              <div className="text-xs font-bold mb-0.5 truncate" style={{ color: c }}>{pt.label}</div>
              {st >= 1 && <div className="text-xs truncate" style={{ color: `${c}88` }}>{pt.short}</div>}
              {st >= 2 && <p className="text-xs leading-tight truncate">{pt.desc}</p>}
            </div>
          )
        })}
      </div>
      {/* 居中图形 */}
      <div className="absolute rounded-xl overflow-hidden z-10"
        style={{
          width: '18%', height: '36%', top: '32%', left: '41%',
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}>
        <DynamicGraphic pointCount={points.length} drawnCount={drawnCount} />
      </div>
      {/* 下方卡片组 */}
      <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-1 pb-1">
        {bottom.map((pt, j) => {
          const i = half + j
          const st = pointStates[i] || 0
          const visible = phase >= 4 + i
          const c = colors[i % colors.length]
          return (
            <div key={i} className="flex-1 rounded-xl px-2 py-1.5 flex flex-col justify-center overflow-hidden"
              style={{
                height: '26%',
                background: st >= 2 ? `${c}10` : 'rgba(255,255,255,0.6)',
                border: `1px solid ${st >= 1 ? `${c}50` : 'rgba(255,255,255,0.3)'}`,
                opacity: visible ? 1 : 0,
                transition: 'all 0.35s',
                animation: visible && st >= 1 ? 'hubUp 0.35s cubic-bezier(0.16,1,0.3,1) both' : 'none',
              }}>
              <div className="text-xs font-bold mb-0.5 truncate" style={{ color: c }}>{pt.label}</div>
              {st >= 1 && <div className="text-xs truncate" style={{ color: `${c}88` }}>{pt.short}</div>}
              {st >= 2 && <p className="text-xs leading-tight truncate">{pt.desc}</p>}
            </div>
          )
        })}
      </div>
      <style>{`
        @keyframes hubDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        @keyframes hubUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
      `}</style>
    </div>
  )
}

// ============================================================
// 布局 3：图形居中，左右各一组
// ============================================================
function L3({ points, pointStates, phase }) {
  const drawnCount = Math.max(0, phase - 3)
  const half = Math.ceil(points.length / 2)
  const left = points.slice(0, half)
  const right = points.slice(half)
  const colors = ['#0891b2', '#7c3aed', '#059669', '#d97706', '#e11d48', '#db2777']
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 左侧 */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col gap-1 px-1 py-1 justify-center">
        {left.map((pt, j) => {
          const i = j
          const st = pointStates[i] || 0
          const visible = phase >= 4 + i
          const c = colors[i % colors.length]
          return (
            <div key={i} className="rounded-xl px-2 py-1.5 flex flex-col justify-center overflow-hidden"
              style={{
                height: `${100 / left.length}%`,
                background: st >= 2 ? `${c}10` : 'rgba(255,255,255,0.6)',
                border: `1px solid ${st >= 1 ? `${c}50` : 'rgba(255,255,255,0.3)'}`,
                opacity: visible ? 1 : 0,
                transition: 'all 0.35s',
                animation: visible && st >= 1 ? 'hubRight 0.35s cubic-bezier(0.16,1,0.3,1) both' : 'none',
              }}>
              <div className="text-xs font-bold mb-0.5" style={{ color: c }}>{pt.label}</div>
              {st >= 1 && <div className="text-xs truncate" style={{ color: `${c}88` }}>{pt.short}</div>}
              {st >= 2 && <p className="text-xs leading-tight truncate">{pt.desc}</p>}
            </div>
          )
        })}
      </div>
      {/* 居中图形 */}
      <div className="absolute rounded-xl overflow-hidden z-10"
        style={{
          width: '20%', height: '40%', top: '30%', left: '40%',
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}>
        <DynamicGraphic pointCount={points.length} drawnCount={drawnCount} />
      </div>
      {/* 右侧 */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col gap-1 px-1 py-1 justify-center">
        {right.map((pt, j) => {
          const i = half + j
          const st = pointStates[i] || 0
          const visible = phase >= 4 + i
          const c = colors[i % colors.length]
          return (
            <div key={i} className="rounded-xl px-2 py-1.5 flex flex-col justify-center overflow-hidden"
              style={{
                height: `${100 / right.length}%`,
                background: st >= 2 ? `${c}10` : 'rgba(255,255,255,0.6)',
                border: `1px solid ${st >= 1 ? `${c}50` : 'rgba(255,255,255,0.3)'}`,
                opacity: visible ? 1 : 0,
                transition: 'all 0.35s',
                animation: visible && st >= 1 ? 'hubLeft 0.35s cubic-bezier(0.16,1,0.3,1) both' : 'none',
              }}>
              <div className="text-xs font-bold mb-0.5" style={{ color: c }}>{pt.label}</div>
              {st >= 1 && <div className="text-xs truncate" style={{ color: `${c}88` }}>{pt.short}</div>}
              {st >= 2 && <p className="text-xs leading-tight truncate">{pt.desc}</p>}
            </div>
          )
        })}
      </div>
      <style>{`
        @keyframes hubRight { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:none; } }
        @keyframes hubLeft { from { opacity:0; transform:translateX(8px); } to { opacity:1; transform:none; } }
      `}</style>
    </div>
  )
}

// ============================================================
// 布局 4：图形居中，时间线环绕
// ============================================================
function L4({ points, pointStates, phase }) {
  const drawnCount = Math.max(0, phase - 3)
  const n = points.length
  const colors = ['#0891b2', '#7c3aed', '#db2777', '#059669', '#d97706', '#e11d48', '#4f46e5', '#0f766e']
  // 上、下、左、右四个方位
  const positions = [
    { pos: 'top', left: '40%', top: '2%', transform: 'translateX(-50%)' },
    { pos: 'right', right: '2%', top: '40%', transform: 'translateY(-50%)' },
    { pos: 'bottom', left: '40%', bottom: '2%', transform: 'translateX(-50%)' },
    { pos: 'left', left: '2%', top: '40%', transform: 'translateY(-50%)' },
  ]
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {points.map((pt, i) => {
        if (!pt) return null
        const st = pointStates[i] || 0
        const visible = phase >= 4 + i
        const c = colors[i % colors.length]
        const p = positions[i % positions.length]
        const isVertical = p.pos === 'top' || p.pos === 'bottom'
        return (
          <div key={i} className="absolute rounded-xl px-2 py-1.5 flex flex-col justify-center overflow-hidden"
            style={{
              ...p,
              transform: p.transform,
              width: isVertical ? '22%' : '26%',
              height: '28%',
              background: st >= 2 ? `${c}10` : 'rgba(255,255,255,0.6)',
              border: `1px solid ${st >= 1 ? `${c}50` : 'rgba(255,255,255,0.3)'}`,
              opacity: visible ? 1 : 0,
              transition: 'all 0.35s',
              animation: visible && st >= 1 ? `hubPulse 0.35s cubic-bezier(0.16,1,0.3,1) both` : 'none',
            }}>
            <div className="text-xs font-bold mb-0.5" style={{ color: c }}>{pt.label}</div>
            {st >= 1 && <div className="text-xs truncate" style={{ color: `${c}88` }}>{pt.short}</div>}
            {st >= 2 && <p className="text-xs leading-tight truncate">{pt.desc}</p>}
          </div>
        )
      })}
      {/* 居中图形 */}
      <div className="absolute rounded-xl overflow-hidden z-10"
        style={{
          width: '18%', height: '34%', top: '33%', left: '41%',
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}>
        <DynamicGraphic pointCount={points.length} drawnCount={drawnCount} />
      </div>
      <style>{`
        @keyframes hubPulse { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
      `}</style>
    </div>
  )
}

const LAYOUTS = [L0, L1, L2, L3, L4]

// ============================================================
// 生成的总结页面
// ============================================================
function SummaryPage({ data, layoutIdx }) {
  const pointCount = data.points.length
  const [isFinal, setIsFinal] = useState(false)
  const [phase, setPhase] = useState(0)             // 动画阶段
  const [titleLen, setTitleLen] = useState(0)       // 标题打字机
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [pointStates, setPointStates] = useState({})
  const [fadeOut, setFadeOut] = useState(false)     // 细节消失动画
  const timers = useRef([])
  const typeTimers = useRef([])
  const fired = useRef(new Set())

  const fire = (key, fn) => {
    if (fired.current.has(key)) return
    fired.current.add(key)
    if (fn) fn()
  }

  useEffect(() => {
    ;[...timers.current, ...typeTimers.current].forEach(clearTimeout)
    timers.current = []
    typeTimers.current = []
    fired.current = new Set()
    setPhase(0)
    setTitleLen(0)
    setSubtitleVisible(false)
    setPointStates({})
    setFadeOut(false)
    setIsFinal(false)

    const add = (fn, ms) => timers.current.push(setTimeout(fn, ms))
    const addType = (fn, ms) => typeTimers.current.push(setTimeout(fn, ms))

    const titleChars = data.title.split('')
    const descStart = 100 + titleChars.length * 180 + 300 + 600 + 400  // 图形后多久开始出标签

    // ---- 主标题打字机 ----
    add(() => setPhase(1), 100)
    titleChars.forEach((_, idx) => {
      addType(() => {
        setTitleLen(idx + 1)
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)()
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.type = 'square'
          osc.frequency.value = 600
          gain.gain.setValueAtTime(0, ctx.currentTime)
          gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.005)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
          osc.start(ctx.currentTime)
          osc.stop(ctx.currentTime + 0.12)
        } catch (e) {}
      }, 100 + idx * 180)
    })

    // ---- 副标题滑入 ----
    addType(() => {
      setPhase(2)
      setSubtitleVisible(true)
      playSubtitleSound()
    }, 100 + titleChars.length * 180 + 300)

    // ---- 图形出现 ----
    add(() => {
      setPhase(3)
      playGraphicSound()
    }, 100 + titleChars.length * 180 + 300 + 600)

    // ---- 标签逐个出现（每2秒）+ 短描述紧跟 ----
    data.points.forEach((_, i) => {
      add(() => {
        setPhase(4 + i)
        setPointStates(prev => ({ ...prev, [i]: 1 }))
        fire(`label${i}`, playLabelSound)
      }, descStart + i * 2000)

      // 完整描述梆梆
      add(() => {
        setPointStates(prev => ({ ...prev, [i]: 2 }))
        fire(`desc${i}`, playDescSound)
      }, descStart + data.points.length * 2000 + i * 400)
    })

    // ---- 全部播完，进入最终画面 ----
    const allDoneTime = descStart + data.points.length * 2000 + data.points.length * 400 + 1200
    add(() => {
      fire('complete', playCompleteSound)
    }, allDoneTime - 300)

    add(() => {
      playWhooshSound()
      setFadeOut(true)
    }, allDoneTime)

    add(() => {
      setIsFinal(true)
    }, allDoneTime + 1300) // 等融化动画完成后再切最终画面

    return () => {
      ;[...timers.current, ...typeTimers.current].forEach(clearTimeout)
    }
  }, [])

  const LayoutComp = LAYOUTS[layoutIdx]
  const slideDir = rand(0, 1) === 0 ? 'translateX(20px)' : 'translateX(-20px)'

  // 最终画面音效 - 啪一下弹出来
  const prevFinal = useRef(false)
  useEffect(() => {
    if (isFinal && !prevFinal.current) {
      const slamTimers = []
      data.points.forEach((_, i) => {
        slamTimers.push(setTimeout(() => {
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.type = 'square'
            osc.frequency.setValueAtTime(300 + i * 100)
            osc.frequency.exponentialRampToValueAtTime(700 + i * 100, ctx.currentTime + 0.1)
            gain.gain.setValueAtTime(0, ctx.currentTime)
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
            osc.start(ctx.currentTime)
            osc.stop(ctx.currentTime + 0.25)
          } catch (e) {}
        }, 420 + i * 80))
      })
      prevFinal.current = true
      return () => slamTimers.forEach(clearTimeout)
    }
    if (!isFinal) prevFinal.current = false
  }, [isFinal])

  // ===================== 最终总结画面 =====================
  if (isFinal) {
    return (
      <div className="rounded-2xl overflow-hidden flex flex-col relative"
        style={{ height: '100%', background: '#FAFAF6', border: '1px solid #E8E5DF', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        {/* 背景光晕 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200%', height: '200%',
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)',
            animation: 'finalGlow 3s ease-in-out infinite',
          }} />
        </div>

        {/* 主副标题区 */}
        <div className="px-6 pt-6 pb-4 flex-shrink-0 relative z-10">
          <h2 className="font-black text-3xl leading-tight text-center"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 35%, #ec4899 65%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.5))',
              textShadow: 'none',
              animation: 'finalTitleSlam 0.5s cubic-bezier(0.22,1,0.36,1) both',
            }}>
            {data.title}
          </h2>
          {/* 装饰下划线 */}
          <div style={{
            width: '60px', height: '3px',
            margin: '8px auto 0',
            background: 'linear-gradient(to right, #06b6d4, #8b5cf6, #ec4899)',
            borderRadius: '2px',
            animation: 'finalSub 0.5s ease 0.15s both',
          }} />
          <p className="text-sm text-center mt-2"
            style={{
              color: '#6B6860',
              fontStyle: 'italic',
              letterSpacing: '0.05em',
              animation: 'finalSub 0.5s ease 0.2s both',
            }}>
            {data.subtitle}
          </p>
        </div>

        {/* 四个核心标签 - 啪一下弹出来 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6 relative z-10">
          <div className="grid grid-cols-2 gap-3 w-full">
            {data.points.map((p, i) => (
              <div key={i}
                className="text-center font-black rounded-2xl py-4 px-3 relative overflow-hidden"
                style={{
                  background: [
                    'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))',
                    'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))',
                    'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05))',
                    'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
                  ][i],
                  border: [
                    '2px solid rgba(6,182,212,0.4)',
                    '2px solid rgba(139,92,246,0.4)',
                    '2px solid rgba(236,72,153,0.4)',
                    '2px solid rgba(245,158,11,0.4)',
                  ][i],
                  color: [
                    '#0891b2',
                    '#7c3aed',
                    '#be185d',
                    '#b45309',
                  ][i],
                  fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                  boxShadow: [
                    '0 0 20px rgba(6,182,212,0.2), inset 0 0 20px rgba(6,182,212,0.05)',
                    '0 0 20px rgba(139,92,246,0.2), inset 0 0 20px rgba(139,92,246,0.05)',
                    '0 0 20px rgba(236,72,153,0.2), inset 0 0 20px rgba(236,72,153,0.05)',
                    '0 0 20px rgba(245,158,11,0.2), inset 0 0 20px rgba(245,158,11,0.05)',
                  ][i],
                  animation: `coreSlam ${0.4 + i * 0.08}s cubic-bezier(0.22,1.6,0.64,1) ${0.4 + i * 0.06}s both`,
                }}>
                {/* 斜纹装饰 */}
                <div style={{
                  position: 'absolute', top: '0', right: '0',
                  width: '30px', height: '30px',
                  background: [
                    'linear-gradient(135deg, transparent 50%, rgba(6,182,212,0.3) 50%)',
                    'linear-gradient(135deg, transparent 50%, rgba(139,92,246,0.3) 50%)',
                    'linear-gradient(135deg, transparent 50%, rgba(236,72,153,0.3) 50%)',
                    'linear-gradient(135deg, transparent 50%, rgba(245,158,11,0.3) 50%)',
                  ][i],
                }} />
                {p.label}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes finalTitleSlam {
            0%   { opacity:0; transform:scale(0.6) translateY(20px); filter:blur(8px) drop-shadow(0 0 0px transparent); }
            50%  { opacity:1; transform:scale(1.08) translateY(-3px); filter:blur(2px) drop-shadow(0 0 30px rgba(139,92,246,0.6)); }
            75%  { transform:scale(0.97) translateY(2px); }
            100% { opacity:1; transform:scale(1) translateY(0); filter:blur(0px) drop-shadow(0 0 20px rgba(139,92,246,0.5)); }
          }
          @keyframes finalSub {
            0%   { opacity:0; transform:translateY(10px); }
            100% { opacity:1; transform:translateY(0); }
          }
          @keyframes coreSlam {
            0%   { opacity:0; transform:scale(0.2) rotate(-8deg) translateY(30px); }
            55%  { opacity:1; transform:scale(1.15) rotate(2deg) translateY(-5px); }
            72%  { transform:scale(0.94) rotate(-1deg) translateY(2px); }
            88%  { transform:scale(1.04) rotate(0.5deg) translateY(-1px); }
            100% { opacity:1; transform:scale(1) rotate(0deg) translateY(0); }
          }
          @keyframes finalGlow {
            0%,100% { opacity:0.8; transform: 'translate(-50%, -50%) scale(1)'; }
            50%      { opacity:1;   transform: 'translate(-50%, -50%) scale(1.1)'; }
          }
        `}</style>
      </div>
    )
  }

  // ===================== 内容动画中 =====================
  const meltPercent = fadeOut ? 100 : 0
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        height: '100%',
        background: '#FAFAF6',
        border: '1px solid #E8E5DF',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
      {/* 标题区 */}
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <h2 className="font-bold text-xl leading-tight"
          style={{
            background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 12px rgba(139,92,246,0.25))',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 0.1s',
            animation: fadeOut ? `meltText 0.9s ease-in-out forwards` : 'none',
            minHeight: '1.3em',
          }}>
          {data.title.slice(0, titleLen)}
          {phase >= 1 && titleLen < data.title.length && (
            <span style={{
              display: 'inline-block',
              width: '2px',
              height: '1em',
              background: '#D97706',
              marginLeft: '1px',
              verticalAlign: 'text-bottom',
              animation: 'typeBlink 0.6s step-end infinite',
            }} />
          )}
        </h2>
        <p className="text-xs mt-0.5 overflow-hidden"
          style={{
            color: '#6B6860',
            opacity: subtitleVisible ? 1 : 0,
            transform: subtitleVisible ? 'translateX(0)' : slideDir,
            transition: subtitleVisible
              ? 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)'
              : 'none',
            animation: fadeOut ? `meltText 0.8s ease-in-out 0.1s forwards` : 'none',
          }}>
          {data.subtitle}
        </p>
      </div>
      {/* 内容区 - 融化效果 */}
      <div className="px-4 pb-4 flex-1 overflow-hidden relative">
        <div
          className="h-full"
          style={{
            animation: fadeOut ? `meltContent 1.2s ease-in-out 0.15s forwards` : 'none',
          }}>
          <LayoutComp points={data.points} pointStates={pointStates} phase={phase} />
        </div>
        {/* 融化粒子叠加层 */}
        {fadeOut && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ animation: 'meltOverlay 1.2s ease-in-out 0.15s forwards' }} />
        )}
      </div>
      <style>{`
        @keyframes typeBlink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes fa { from { opacity:0; } to { opacity:1; } }
        @keyframes meltText {
          0%   { opacity:1; transform:translateY(0) scale(1); filter:blur(0px); }
          30%  { opacity:0.7; filter:blur(1.5px); transform:translateY(-2px) scale(1.01); }
          60%  { opacity:0.3; filter:blur(3px); transform:translateY(-4px) scale(0.98); }
          100% { opacity:0; filter:blur(6px); transform:translateY(-6px) scale(0.95); }
        }
        @keyframes meltContent {
          0%   { opacity:1; transform:scale(1); filter:blur(0px) saturate(1); }
          25%  { opacity:0.8; transform:scale(1.01); filter:blur(1px) saturate(0.9); }
          50%  { opacity:0.5; transform:scale(1.02); filter:blur(2.5px) saturate(0.6); }
          75%  { opacity:0.2; transform:scale(0.99); filter:blur(4px) saturate(0.3); }
          100% { opacity:0; transform:scale(0.96); filter:blur(8px) saturate(0); }
        }
        @keyframes meltOverlay {
          0%   { background: transparent; }
          40%  { background: rgba(255,255,255,0.05); }
          100% { background: rgba(255,255,255,0); }
        }
      `}</style>
    </div>
  )
}

// ============================================================
// 主页面
// ============================================================
export default function PageGenerator() {
  const [input, setInput] = useState('')
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [layoutIdx, setLayoutIdx] = useState(0)

  function generate() {
    if (!input.trim()) return
    setIsLoading(true)
    setLayoutIdx(rand(0, LAYOUTS.length - 1))
    setTimeout(() => {
      setHasGenerated(true)
      setIsLoading(false)
    }, 600)
  }

  function reset() { setHasGenerated(false); setInput('') }

  return (
    <div className="min-h-screen" style={{ background: '#FAF9F6' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="font-bold text-4xl mb-3" style={{ color: '#1C1C1E' }}>一键生成精简网页</h1>
          <p className="text-base" style={{ color: '#6B6860' }}>粘贴任意内容，AI提炼精华，生成直观可分享的总结页面</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E8E5DF' }}>
              <div className="mb-4">
                <div className="text-sm font-bold mb-1" style={{ color: '#1C1C1E' }}>粘贴内容</div>
                <div className="text-xs" style={{ color: '#6B6860' }}>粘贴文章链接、公众号内容、或任意文字</div>
              </div>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                placeholder="粘贴文章链接或文字内容..."
                className="w-full rounded-xl p-4 text-sm leading-relaxed resize-none outline-none"
                style={{ background: '#FAFAF6', border: '1px solid #E8E5DF', color: '#1C1C1E', minHeight: '280px' }}
                onFocus={e => e.target.style.borderColor = '#D97706'}
                onBlur={e => e.target.style.borderColor = '#E8E5DF'} />
              {hasGenerated ? (
                <button onClick={reset}
                  className="mt-4 w-full py-3 rounded-xl text-sm font-semibold"
                  style={{ background: '#FEF3C7', color: '#D97706', cursor: 'pointer' }}>
                  重新生成 ←
                </button>
              ) : (
                <button onClick={generate} disabled={!input.trim() || isLoading}
                  className="mt-4 w-full py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: input.trim() ? '#D97706' : '#E8E5DF',
                    color: input.trim() ? '#FFFFFF' : '#A8A29E',
                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                  }}>
                  {isLoading ? '生成中...' : '生成总结页面 →'}
                </button>
              )}
              <p className="mt-3 text-xs text-center" style={{ color: '#A8A29E' }}>MVP 演示版 · 音效已开启</p>
            </div>
          </div>
          <div>
            {!hasGenerated ? (
              <div className="rounded-2xl flex items-center justify-center"
                style={{ minHeight: '420px', background: '#FFFFFF', border: '2px dashed #E8E5DF', color: '#A8A29E' }}>
                <div className="text-center">
                  <div className="text-4xl mb-3">📄</div>
                  <p className="text-sm">左侧输入内容<br />即可预览生成的网页</p>
                </div>
              </div>
            ) : (
              <div style={{ height: '520px', overflow: 'hidden' }}>
                <SummaryPage key={layoutIdx} data={DEMO_RESULT} layoutIdx={layoutIdx} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
