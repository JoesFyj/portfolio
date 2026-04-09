// 全站固定滚动背景文字
const PHRASES = [
  '少工作，多赚钱，以书为粮，以路为行',
  'Less Working More Earning Books As Food Roads As Path',
  '提示词工程 · 智能体搭建 · AI自媒体',
  'Prompt Engineering AI Agents Self Media',
]
const LONG_TEXT = PHRASES.join(' · ')

export default function PageBackground({ theme }) {
  const isDark = theme === 'dark'
  const rows = [
    { top: '5%',  dur: 28, delay: 0 },
    { top: '25%', dur: 35, delay: -10 },
    { top: '48%', dur: 22, delay: -5 },
    { top: '70%', dur: 32, delay: -15 },
  ]

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: r.top,
            width: '100%',
            animation: `sbScroll ${r.dur}s linear ${r.delay}s infinite`,
          }}
        >
          <div style={{ whiteSpace: 'nowrap' }}>
            {[...Array(8)].map((_, j) => (
              <span
                key={j}
                style={{
                  display: 'inline-block',
                  marginRight: '5rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
                  background: isDark
                    ? 'linear-gradient(90deg, #0f2744 0%, #38bdf8 40%, #0ea5e9 60%, #0f2744 100%)'
                    : 'linear-gradient(90deg, #cec9c0 0%, #9a9488 50%, #cec9c0 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  opacity: isDark ? 0.055 : 0.3,
                }}
              >
                {LONG_TEXT}
              </span>
            ))}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes sbScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
