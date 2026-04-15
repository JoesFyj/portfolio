import { getConfig } from '../lib/siteConfig'
import { ExternalLink } from 'lucide-react'

export default function HomeTimeline({ theme }) {
  const isDark = theme === 'dark'
  const bg      = isDark ? '#1F1F1F' : '#F4F2EE'
  const text    = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted   = isDark ? '#8B949E' : '#6B6860'
  const border  = isDark ? '#30363D' : '#E8E5DF'
  const cardBg  = isDark ? '#2D2D2D' : '#FFFFFF'
  const numColor= isDark ? '#8B949E' : '#D4C9B8'

  const cfg = getConfig()
  const t = cfg.homeTimeline || {}
  const title = t.title || '我走了多远'
  const nodes = t.nodes || []

  return (
    <section className="py-24 px-6" style={{ background: isDark ? 'rgba(31,31,31,0.15)' : 'rgba(250,249,246,0.15)', position: 'relative', zIndex: 1 }}>
      <div className="max-w-4xl mx-auto">

        {/* 标题 */}
        <div className="mb-16">
          <span className="section-label">
            <span className="text-2xl font-bold" style={{ color: numColor }}>05</span>
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
        <div className="relative">
          {/* 中心竖线 */}
          <div
            className="absolute left-1/2 top-2 bottom-2 w-0.5 -translate-x-1/2 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #D97706, #FDE68A, transparent 95%)' }}
          />

          <div className="space-y-8">
            {nodes.map((node, i) => {
              const isLeft = i % 2 === 0
              return (
                <div
                  key={node.id || i}
                  className="relative h-24"
                >
                  {/* 中心圆点 */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 border-white"
                      style={{ background: '#D97706', boxShadow: '0 0 0 3px #FEF3C7' }}
                    />
                  </div>

                  {/* 左侧卡片：右边贴线 */}
                  {isLeft && (
                    <div className="absolute right-1/2 translate-x-[-1rem] top-1/2 -translate-y-1/2 w-56">
                      <Card node={node} text={text} muted={muted} cardBg={cardBg} border={border} align="right" />
                    </div>
                  )}

                  {/* 右侧卡片：左边贴线 */}
                  {!isLeft && (
                    <div className="absolute left-1/2 translate-x-[1rem] top-1/2 -translate-y-1/2 w-56">
                      <Card node={node} text={text} muted={muted} cardBg={cardBg} border={border} align="left" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Card({ node, text, muted, cardBg, border, align }) {
  const content = (
    <div
      className="p-5 w-full"
      style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '1rem', textAlign: align }}
    >
      <div className="flex items-baseline gap-3 mb-1" style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
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
  )

  if (node.url) {
    return (
      <a
        href={node.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center cursor-pointer"
        style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}
      >
        {content}
        <ExternalLink
          size={14}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          style={{ color: '#D97706', marginLeft: align === 'right' ? 8 : 0, marginRight: align === 'left' ? 8 : 0 }}
        />
      </a>
    )
  }

  return content
}
