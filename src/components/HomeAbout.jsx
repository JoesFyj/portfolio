import { getConfig } from '../lib/siteConfig'

export default function HomeAbout({ theme }) {
  const isDark = theme === 'dark'
  const bg        = isDark ? '#0D1117' : '#FAF9F6'
  const text       = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted      = isDark ? '#8B949E' : '#6B6860'
  const border     = isDark ? '#30363D' : '#E8E5DF'
  const cardBg     = isDark ? '#161B22' : '#FFFFFF'
  const numColor   = isDark ? '#8B949E' : '#D4C9B8'

  const cfg = getConfig()
  const a = cfg.homeAbout || {}
  const title = a.title || '我从哪里来'
  const story = a.story || ''
  const paragraphs = story.split('\n\n').filter(p => p.trim())
  const labels = a.labels || [
    { label: '出生地', val: '甘肃·陇山' },
    { label: '学历',   val: '西安工业大学·硕士' },
    { label: '现居',   val: '西安' },
  ]

  return (
    <section className="py-24 px-6" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto">

        {/* 标题 */}
        <div className="mb-16">
          <span className="section-label">
            <span className="text-2xl font-bold" style={{ color: numColor }}>01</span>
            Origin Story
          </span>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold"
            style={{ color: text }}
          >
            {title}
          </h2>
          <div className="accent-bar mt-4" />
        </div>

        {/* 内容 */}
        <div className="grid md:grid-cols-[220px_1fr] gap-12 items-start">

          {/* 左侧信息卡 */}
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '1rem', padding: '1.5rem' }}>
            {labels.map(({ label, val }) => (
              <div key={label}>
                <div className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: '#D97706' }}>
                  {label}
                </div>
                <div className="text-sm font-medium mb-5" style={{ color: text }}>{val}</div>
              </div>
            ))}
            <div className="pt-4 border-t" style={{ borderColor: border }}>
              <div className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: '#D97706' }}>
                Tagline
              </div>
              <div className="font-serif text-sm italic" style={{ color: muted }}>
                {cfg.footer?.tagline || '以书为粮，以路为行。'}
              </div>
            </div>
          </div>

          {/* 右侧故事 */}
          <div className="space-y-6">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-base leading-relaxed"
                style={{ color: i === 0 ? text : muted }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
