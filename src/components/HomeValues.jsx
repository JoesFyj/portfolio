import { getConfig } from '../lib/siteConfig'

export default function HomeValues({ theme }) {
  const isDark = theme === 'dark'
  const bg      = isDark ? '#0D1117' : '#F4F2EE'
  const text    = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted   = isDark ? '#8B949E' : '#6B6860'
  const border  = isDark ? '#30363D' : '#E8E5DF'
  const cardBg  = isDark ? '#161B22' : '#FFFFFF'

  const cfg = getConfig()
  const v = cfg.homeValues || {}
  const title = v.title || '我现在相信什么'
  const items = v.items || []

  return (
    <section className="py-24 px-6" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto">

        {/* 标题 */}
        <div className="mb-16">
          <span className="section-label">
            <span className="text-2xl font-bold" style={{ color: isDark ? '#8B949E' : '#D4C9B8' }}>02</span>
            What I Believe
          </span>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold"
            style={{ color: isDark ? '#58A6FF' : text }}
          >
            {title}
          </h2>
          <div className="accent-bar mt-4" />
        </div>

        {/* 价值观列表 */}
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: '1rem',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-serif font-bold text-lg"
                style={{ background: '#FEF3C7', color: '#D97706' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 pt-1">
                <p
                  className="text-base font-medium leading-relaxed"
                  style={{ color: isDark ? '#58A6FF' : text }}
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
