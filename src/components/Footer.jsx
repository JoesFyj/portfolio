import { getConfig } from '../lib/siteConfig'

export default function Footer({ theme }) {
  const isDark = theme === 'dark'
  const bg     = isDark ? '#1C1C1E' : '#1C1C1E'
  const text    = isDark ? '#FAFAF8' : '#FAFAF8'
  const muted  = isDark ? '#6B6860' : '#6B6860'
  const accent = '#FDE68A'

  const cfg = getConfig()
  const f = cfg.footer || {}
  const tagline = f.tagline || '以书为粮，以路为行。'
  const copyright = f.copyright || '© 2026 生活的小虾 · 小福老师'

  return (
    <footer
      className="py-16 px-6 text-center"
      style={{ background: bg, color: text }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="accent-bar mx-auto mb-6" />
        <p
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: accent }}
        >
          {tagline}
        </p>
        <p className="text-sm" style={{ color: muted }}>
          {copyright}
        </p>
      </div>
    </footer>
  )
}
