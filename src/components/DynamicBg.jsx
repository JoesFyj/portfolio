export default function DynamicBg({ theme }) {
  const isDark = theme === 'dark'
  const motto = '少工作，多赚钱，以书为粮，以路为行'

  const rows = [
    { top: '15%',  dur: 35, dir: 'left' },
    { top: '35%',  dur: 50, dir: 'right' },
    { top: '55%',  dur: 40, dir: 'left' },
    { top: '75%',  dur: 55, dir: 'right' },
    { top: '92%',  dur: 45, dir: 'left' },
  ]

  // 暗色用金色字，亮色用琥珀色，统一 18% 透明度
  const baseColor = isDark ? '253,230,138' : '217,119,6'
  const opacity  = '0.18'

  const repeat = (text, n) => Array.from({ length: n }, () => text).join('\u00A0\u00A0\u00A0')

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 0, overflow: 'hidden' }}
    >
      <style>{`
        @keyframes scrollLeft {
          from { transform: translateX(60vw); }
          to   { transform: translateX(-60vw); }
        }
        @keyframes scrollRight {
          from { transform: translateX(-60vw); }
          to   { transform: translateX(60vw); }
        }
      `}</style>

      {rows.map((row, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap"
          style={{
            top: row.top,
            animation: `${row.dir === 'left' ? 'scrollLeft' : 'scrollRight'} ${row.dur}s linear infinite`,
            willChange: 'transform',
          }}
        >
          <span
            className="font-serif font-bold"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 3rem)',
              color: `rgba(${baseColor}, ${opacity})`,
              letterSpacing: '0.05em',
            }}
          >
            {repeat(motto, 8)}
          </span>
        </div>
      ))}
    </div>
  )
}
