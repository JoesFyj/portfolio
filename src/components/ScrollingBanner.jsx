// 全站通用滚动背景文字组件
// 支持 light / dark 模式，放在任意 section 内
const PHRASES = [
  '少工作，多赚钱，以书为粮，以路为行',
  'Less Working, More Earning, Books as Food, Roads as Path',
  '提示词工程 · 智能体搭建 · AI自媒体',
  'Prompt Engineering · AI Agents · Self-Media',
]

const LONG_TEXT = PHRASES.join(' · ')

export default function ScrollingBanner({ theme }) {
  const isDark = theme === 'dark'
  const rows = [
    { top: '8%',  duration: 22, delay: 0 },
    { top: '30%', duration: 30, delay: -8 },
    { top: '52%', duration: 26, delay: -4 },
    { top: '74%', duration: 20, delay: -12 },
  ]

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {rows.map((row, ri) => (
        <div
          key={ri}
          className="absolute w-full"
          style={{
            top: row.top,
            animation: `scrollLeft ${row.duration}s linear ${row.delay}s infinite`,
          }}
        >
          <div className="whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className="inline-block mr-20 font-bold tracking-widest"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                  background: isDark
                    ? 'linear-gradient(90deg, #1e3a5f 0%, #38bdf8 50%, #1e3a5f 100%)'
                    : 'linear-gradient(90deg, #d4cfc8 0%, #a09890 50%, #d4cfc8 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  opacity: isDark ? 0.06 : 0.35,
                }}
              >
                {LONG_TEXT}
              </span>
            ))}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
