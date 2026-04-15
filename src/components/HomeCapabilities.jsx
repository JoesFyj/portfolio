import { getConfig } from '../lib/siteConfig'

export default function HomeCapabilities({ theme }) {
  const isDark = theme === 'dark'
  const bg      = isDark ? '#1F1F1F' : '#F4F2EE'
  const text    = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted   = isDark ? '#8B949E' : '#6B6860'
  const cardBg  = isDark ? '#2D2D2D' : '#FFFFFF'
  const cardBorder = isDark ? '#30363D' : '#E8E5DF'

  const cfg = getConfig()
  const cap = cfg.homeCapabilities || {}
  const title  = cap.title  || '我有哪些能力'
  const items  = cap.items  || [
    { title: 'AI智能体', subtitle: 'Agent搭建与工作流设计' },
    { title: '提示词工程', subtitle: 'Prompt优化与框架设计' },
    { title: 'AI写作', subtitle: '公众号与自媒体文案' },
    { title: '自动化运营', subtitle: 'RPA与业务流程自动化' },
    { title: '自媒体', subtitle: '内容创作与账号运营' },
    { title: '智能体培训', subtitle: 'AI工具使用与教学' },
  ]

  return (
    <section className="py-24 px-6" style={{ background: isDark ? 'rgba(31,31,31,0.15)' : 'rgba(250,249,246,0.15)', position: 'relative', zIndex: 1 }}>
      <div className="max-w-4xl mx-auto">

        {/* 左标题 + 右卡片 并排布局 */}
        <div className="flex flex-col md:flex-row items-start gap-12">

          {/* 左侧标题 */}
          <div className="md:w-48 flex-shrink-0">
            <div className="mb-3">
              <span
                className="text-3xl font-bold"
                style={{ color: isDark ? '#8B949E' : '#D4C9B8' }}
              >
                02
              </span>
            </div>
            <span className="text-xs tracking-widest uppercase" style={{ color: muted }}>
              Capabilities
            </span>
            <h2
              className="font-serif text-3xl md:text-4xl font-bold mt-2 leading-tight"
              style={{ color: text }}
            >
              {title}
            </h2>
          </div>

          {/* 右侧 2×3 卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            {items.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-xl"
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#D97706' }}
                  />
                  <h3
                    className="text-sm font-bold leading-tight"
                    style={{ color: text }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: muted }}>
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
