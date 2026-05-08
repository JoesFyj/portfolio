import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Github, Twitter, ExternalLink } from 'lucide-react'
import { getConfig } from '../config/siteConfig'

export default function Connect({ theme }) {
  const isDark = theme === 'dark'
  const config = getConfig()

  // about 模块配置
  const about = config.about || {}

  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? 'rgba(22,27,34,0.8)' : 'rgba(255,255,255,0.7)'
  const accent = config.theme?.primaryColor || '#2D6A4F'

  // 从 hero 取头像和名字
  const avatar = config.hero?.avatar || '🧑‍💻'
  const name = config.hero?.name || '小福'
  const tagline = about.tagline || '热爱 · 创造 · 分享'
  const bio = about.bio || '专注于 AI 自由实验与内容创作，致力于用技术放大个人产出。'
  const navLinks = about.navLinks || [
    { label: '首页', to: '/' },
    { label: '作品', to: '/works' },
    { label: '读书', to: '/#reading' },
    { label: '跑步', to: '/#exercise' },
  ]
  const skills = about.skills || ['AI', 'React', '内容创作', '自媒体运营', 'Python', 'Prompt Engineering']
  const contacts = about.contacts || []
  const location = about.location || '中国 · 甘肃'
  const email = about.email || 'xiaofu@example.com'
  const copyright = about.copyright || `© ${new Date().getFullYear()} ${name}. All rights reserved.`

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8" style={{ background: bg }}>
      <div
        className="w-full max-w-5xl rounded-2xl p-6 md:p-10 backdrop-blur-xl"
        style={{
          background: cardBg,
          border: `1px solid ${border}`,
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0,0,0,0.5)'
            : '0 25px 50px -12px rgba(0,0,0,0.1)',
        }}
      >

        {/* 主布局：左侧信息 + 右侧三列 */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ===== 左侧：个人名片 ===== */}
          <div className="lg:w-[320px] flex-shrink-0">
            {/* 头像 */}
            <div className="mb-6">
              {avatar.startsWith('data:') || avatar.startsWith('http') ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 rounded-2xl object-cover"
                  style={{ boxShadow: `0 8px 24px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.12)'}` }}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
                    color: '#fff',
                    boxShadow: `0 8px 24px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.12)'}`,
                  }}
                >
                  {avatar}
                </div>
              )}
            </div>

            {/* 名字 + 标语 */}
            <h1 className="text-2xl font-bold mb-2" style={{ color: text }}>{name}</h1>
            <p className="text-sm mb-4" style={{ color: accent }}>{tagline}</p>

            {/* 简介 */}
            <p className="text-sm leading-relaxed mb-6" style={{ color: muted }}>{bio}</p>

            {/* 社交图标行 */}
            <div className="flex items-center gap-3">
              {(contacts.filter(c => c.enabled !== false && c.url).map((c) => (
                <a
                  key={c.name}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${border}`,
                    color: muted,
                  }}
                  title={c.name}
                >
                  {c.icon?.length <= 2 ? (
                    <span className="text-base">{c.icon}</span>
                  ) : c.name === '邮箱' ? (
                    <Mail size={16} />
                  ) : c.name === '推特' || c.name === 'Twitter' ? (
                    <Twitter size={16} />
                  ) : c.name === 'GitHub' ? (
                    <Github size={16} />
                  ) : (
                    <ExternalLink size={16} />
                  )}
                </a>
              )))}
            </div>
          </div>

          {/* ===== 右侧三列 ===== */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* 快速导航 */}
            <div>
              <h3 className="text-sm font-semibold mb-4" style={{ color: text }}>快速导航</h3>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="block px-3 py-2 rounded-lg text-sm transition-all"
                    style={{
                      color: muted,
                      ...(isDark
                        ? { background: 'transparent' }
                        : { background: 'transparent' }),
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
                      e.currentTarget.style.color = accent
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = muted
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 技能 / 标签 */}
            <div>
              <h3 className="text-sm font-semibold mb-4" style={{ color: text }}>技能标签</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: isDark ? 'rgba(45,106,79,0.12)' : 'rgba(45,106,79,0.08)',
                      color: accent,
                      border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.15)'}`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 联系方式 */}
            <div>
              <h3 className="text-sm font-semibold mb-4" style={{ color: text }}>联系方式</h3>
              <div className="space-y-3">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 text-sm transition-colors"
                    style={{ color: muted }}
                    onMouseEnter={(e) => e.currentTarget.style.color = accent}
                    onMouseLeave={(e) => e.currentTarget.style.color = muted}
                  >
                    <Mail size={14} style={{ color: accent, flexShrink: 0 }} />
                    <span className="truncate">{email}</span>
                  </a>
                )}
                {location && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: muted }}>
                    <MapPin size={14} style={{ color: accent, flexShrink: 0 }} />
                    <span>{location}</span>
                  </div>
                )}
                {/* 额外联系方式 */}
                {contacts.filter(c => c.enabled !== false && !c.url && c.value).map((c) => (
                  <div key={c.name} className="flex items-center gap-2 text-sm" style={{ color: muted }}>
                    <span className="text-base">{c.icon}</span>
                    <span>{c.name}: {c.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 底部版权栏 */}
        <div
          className="mt-10 pt-6 flex items-center justify-between text-xs"
          style={{ borderTop: `1px solid ${border}`, color: muted }}
        >
          <span>{copyright}</span>
          <span className="flex items-center gap-1">
            Made with <span style={{ color: '#EF4444' }}>❤</span>
          </span>
        </div>

      </div>
    </div>
  )
}
