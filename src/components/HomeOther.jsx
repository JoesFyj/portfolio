import { getConfig } from '../lib/siteConfig'

export default function HomeOther({ theme }) {
  const isDark = theme === 'dark'
  const bg      = isDark ? '#1F1F1F' : '#F4F2EE'
  const text    = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted   = isDark ? '#8B949E' : '#6B6860'
  const border  = isDark ? '#30363D' : '#E8E5DF'
  const cardBg  = isDark ? '#2D2D2D' : '#FFFFFF'

  const cfg = getConfig()
  const o = cfg.homeOther || {}
  const title   = o.title   || '我的其他'
  const items   = o.items   || [
    { label: '座右铭',     value: '少工作，多赚钱，以书为粮，以路为行' },
    { label: '喜欢的作家', value: '刘震云 · 史铁生' },
    { label: '喜欢的明星', value: '邓超' },
    { label: '喜欢宠物',   value: '狗' },
  ]

  return (
    <section className="py-24 px-6" style={{ background: isDark ? 'rgba(31,31,31,0.15)' : 'rgba(250,249,246,0.15)', position: 'relative', zIndex: 1 }}>
      <div className="max-w-3xl mx-auto">

        {/* 标题 */}
        <div className="mb-16">
          <span className="section-label">
            <span className="text-2xl font-bold" style={{ color: isDark ? '#8B949E' : '#D4C9B8' }}>06</span>
            Others
          </span>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold"
            style={{ color: text }}
          >
            {title}
          </h2>
          <div className="accent-bar mt-4" />
        </div>

        {/* 列表 */}
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-6 p-5 rounded-2xl"
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                style={{ background: '#FEF3C7', color: '#D97706' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-xs mb-1" style={{ color: muted }}>
                  {item.label}
                </p>
                <p className="text-base font-medium" style={{ color: text }}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
