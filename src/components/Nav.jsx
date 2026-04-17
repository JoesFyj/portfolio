import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getConfig } from '../lib/siteConfig'
import { Settings, Globe, Sun, Moon, Menu, X } from 'lucide-react'

export default function Nav({ lang, theme, onLangToggle, onThemeToggle, onAdminClick }) {
  const cfg = getConfig()
  const isZh = lang === 'zh'
  const isDark = theme === 'dark'
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const path = location.pathname

  const textColor    = isDark ? '#E6EDF3' : '#1C1C1E'
  const mutedColor   = isDark ? '#8B949E' : '#6B6860'
  const borderColor  = isDark ? '#30363D' : '#E8E5DF'
  const activeBg     = isDark ? 'rgba(88,166,255,0.15)' : '#FEF3C7'
  const navBg        = isDark ? 'rgba(31,31,31,0.95)' : 'rgba(250,249,246,0.90)'
  const accentColor  = isDark ? '#58A6FF' : '#D97706'
  const cardBg       = isDark ? '#2D2D2D' : '#FFFFFF'

  function isActive(p) {
    if (p === '/') return path === '/'
    return path.startsWith(p)
  }

  const links = [
    { to: '/',        label: isZh ? '首页' : 'Home' },
    { to: '/hub',     label: isZh ? '龙虾内容创作' : 'Self Media' },
    { to: '/hub/ops', label: isZh ? '龙虾运营中心' : 'Operations' },
    { to: '/gen',     label: isZh ? '网页生成器' : 'Page Generator' },
  ]

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: navBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link
          to="/"
          className="font-serif text-xl font-bold tracking-tight"
          style={{ color: textColor }}
          onClick={() => setMenuOpen(false)}
        >
          {cfg.site.title}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                color: isActive(to) ? accentColor : mutedColor,
                background: isActive(to) ? activeBg : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg border transition-all"
            style={{ borderColor, color: mutedColor }}
            title={isDark ? '切换浅色模式' : '切换深色模式'}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            onClick={onLangToggle}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-all"
            style={{ borderColor, color: mutedColor }}
          >
            <Globe size={13} />
            {isZh ? 'EN' : '中'}
          </button>
          <button
            onClick={onAdminClick}
            className="p-2 rounded-lg border transition-all"
            style={{ borderColor, color: mutedColor }}
          >
            <Settings size={14} />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg border md:hidden transition-all"
            style={{ borderColor, color: mutedColor }}
          >
            {menuOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t py-3 px-6 space-y-1"
          style={{ borderColor, background: cardBg }}
        >
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block px-4 py-3 text-sm font-medium rounded-lg transition-all"
              style={{
                color: isActive(to) ? accentColor : mutedColor,
                background: isActive(to) ? activeBg : 'transparent',
              }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
