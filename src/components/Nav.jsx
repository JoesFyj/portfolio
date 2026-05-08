import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Settings, Sun, Moon, Menu, X } from 'lucide-react'

// 社交图标组件
function GitHubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function TwitterIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function XiaohongshuIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 14.5h-7v-1h7v1zm0-3h-7v-1h7v1zm0-3h-7v-1h7v1zm0-3h-7v-1h7v1z"/>
    </svg>
  )
}

export default function Nav({ theme, onThemeToggle, onAdminClick }) {
  const isDark = theme === 'dark'
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const path = location.pathname

  const textColor    = isDark ? '#E6EDF3' : '#1C1C1E'
  const mutedColor   = isDark ? '#8B949E' : '#6B6860'
  const borderColor  = isDark ? '#30363D' : '#E8E5DF'
  const activeBg     = isDark ? 'rgba(45,106,79,0.15)' : 'rgba(45,106,79,0.08)'
  const navBg        = isDark ? 'rgba(13,17,23,0.95)' : 'rgba(250,249,246,0.90)'
  const accentColor  = isDark ? '#58A6FF' : '#2D6A4F'

  function isActive(p) {
    if (p === '/') return path === '/'
    return path.startsWith(p)
  }

  const links = [
    { to: '/',      label: '首页' },
    { to: '/works', label: '作品' },
    { to: '/connect', label: '联系' },
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
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link
          to="/"
          className="font-serif text-xl font-bold tracking-tight"
          style={{ color: textColor }}
          onClick={() => setMenuOpen(false)}
        >
          小福AI自由
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-3 py-2 text-sm font-medium rounded-lg transition-all"
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
          {/* 社交图标 */}
          <a
            href="https://github.com/xiaofu"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border transition-all hover:opacity-70"
            style={{ borderColor: borderColor, color: mutedColor }}
            title="GitHub"
          >
            <GitHubIcon size={16} />
          </a>
          <a
            href="https://twitter.com/xiaofu"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border transition-all hover:opacity-70"
            style={{ borderColor: borderColor, color: mutedColor }}
            title="推特"
          >
            <TwitterIcon size={16} />
          </a>
          <a
            href="https://xiaohongshu.com/user/xiaofu"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border transition-all hover:opacity-70"
            style={{ borderColor: borderColor, color: mutedColor }}
            title="小红书"
          >
            <XiaohongshuIcon size={16} />
          </a>

          <div className="w-px h-5 mx-1" style={{ background: borderColor }} />

          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg border transition-all"
            style={{ borderColor: borderColor, color: mutedColor }}
            title={isDark ? '切换浅色模式' : '切换深色模式'}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            onClick={onAdminClick}
            className="p-2 rounded-lg border transition-all"
            style={{ borderColor: borderColor, color: mutedColor }}
          >
            <Settings size={14} />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg border md:hidden transition-all"
            style={{ borderColor: borderColor, color: mutedColor }}
          >
            {menuOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t py-3 px-6 space-y-1"
          style={{ borderColor: borderColor, background: isDark ? '#161B22' : '#FFFFFF' }}
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
