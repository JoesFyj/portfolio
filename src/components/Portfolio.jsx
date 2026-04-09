import { getConfig } from '../lib/siteConfig'
import { ExternalLink, ArrowRight } from 'lucide-react'

export default function Portfolio({ theme }) {
  const isDark = theme === 'dark'
  const bg      = isDark ? '#0D1117' : '#FAF9F6'
  const text    = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted   = isDark ? '#8B949E' : '#6B6860'
  const border  = isDark ? '#30363D' : '#E8E5DF'
  const numColor= isDark ? '#8B949E' : '#D4C9B8'

  const cfg = getConfig()
  const p = cfg.homePortfolio || {}
  const works = cfg.works || []
  const title = p.title || '我在写什么'
  const subtitle = p.subtitle || '公众号持续更新中'

  return (
    <section className="py-24 px-6" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto">

        {/* 标题 */}
        <div className="mb-16">
          <span className="section-label">
            <span className="text-2xl font-bold" style={{ color: numColor }}>03</span>
            Writing
          </span>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold"
            style={{ color: text }}
          >
            {title}
          </h2>
          <p className="mt-2 text-sm" style={{ color: muted }}>{subtitle}</p>
          <div className="accent-bar mt-4" />
        </div>

        {/* 文章列表 */}
        <div className="space-y-1">
          {works.map((work, i) => (
            <a
              key={work.id || i}
              href={work.url || '#'}
              target={work.url ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="block py-6 border-b group"
              style={{ borderColor: border }}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: '#FEF3C7', color: '#D97706' }}
                    >
                      {work.year || '2026'}
                    </span>
                  </div>
                  <h3
                    className="font-serif text-xl font-semibold mb-2 group-hover:text-amber-400 transition-colors"
                    style={{ color: text }}
                  >
                    {work.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed line-clamp-2"
                    style={{ color: muted }}
                  >
                    {work.description}
                  </p>
                  {work.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {work.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full border"
                          style={{ borderColor: border, color: muted }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0 pt-1">
                  {work.url ? (
                    <ExternalLink size={16} style={{ color: muted }} />
                  ) : (
                    <ArrowRight size={16} style={{ color: muted }} />
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="/#connect"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all"
            style={{ borderColor: border, color: muted }}
          >
            {p.ctaText || '扫码关注公众号'}
          </a>
        </div>
      </div>
    </section>
  )
}
