import { getConfig } from '../lib/siteConfig'
import { ExternalLink } from 'lucide-react'

export default function HomeTimeline({ theme }) {
  const isDark = theme === 'dark'
  const bg      = isDark ? '#0D1117' : '#F4F2EE'
  const text    = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted   = isDark ? '#8B949E' : '#6B6860'
  const border  = isDark ? '#30363D' : '#E8E5DF'
  const cardBg  = isDark ? '#161B22' : '#FFFFFF'
  const numColor= isDark ? '#8B949E' : '#D4C9B8'

  const cfg = getConfig()
  const t = cfg.homeTimeline || {}
  const title = t.title || '我走了多远'
  const nodes = t.nodes || []

  return (
    <section className="py-24 px-6" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto">

        {/* 标题 */}
        <div className="mb-16">
          <span className="section-label">
            <span className="text-2xl font-bold" style={{ color: numColor }}>04</span>
            Journey
          </span>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold"
            style={{ color: text }}
          >
            {title}
          </h2>
          <div className="accent-bar mt-4" />
        </div>

        {/* 时间轴 */}
        <div className="relative pl-10">
          {/* 竖线 */}
          <div
            className="absolute left-3 top-2 bottom-2 w-0.5 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #D97706, #FDE68A, transparent)' }}
          />

          <div className="space-y-6">
            {nodes.map((node, i) => (
              <div key={node.id || i} className="relative flex items-start gap-6">

                {/* 圆点 */}
                <div
                  className="absolute -left-7 top-1 w-3.5 h-3.5 rounded-full border-2 border-white z-10"
                  style={{ background: '#D97706', boxShadow: '0 0 0 3px #FEF3C7' }}
                />

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  {node.url ? (
                    <a
                      href={node.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-5 group cursor-pointer"
                      style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '1rem' }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-3 mb-1">
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: '#FEF3C7', color: '#D97706' }}
                            >
                              {node.year}
                            </span>
                          </div>
                          <h3
                            className="font-serif text-base font-semibold mb-1 group-hover:text-amber-400 transition-colors"
                            style={{ color: text }}
                          >
                            {node.label}
                          </h3>
                          <p className="text-sm leading-relaxed" style={{ color: muted }}>
                            {node.insight}
                          </p>
                        </div>
                        <ExternalLink
                          size={14}
                          className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: '#D97706' }}
                        />
                      </div>
                    </a>
                  ) : (
                    <div
                      className="p-5"
                      style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '1rem' }}
                    >
                      <div className="flex items-baseline gap-3 mb-1">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: '#FEF3C7', color: '#D97706' }}
                        >
                          {node.year}
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-semibold mb-1" style={{ color: text }}>
                        {node.label}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: muted }}>
                        {node.insight}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
