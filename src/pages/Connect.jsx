import { Link } from 'react-router-dom'
import { Mail, MapPin, Github, Twitter, ExternalLink, Send, MessageCircle, BookOpen } from 'lucide-react'
import { getConfig } from '../config/siteConfig'

export default function Connect({ theme }) {
  const isDark = theme === 'dark'
  const config = getConfig()
  const about = config.about || {}

  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? 'rgba(22,27,34,0.9)' : 'rgba(255,255,255,0.9)'
  const accent = config.theme?.primaryColor || '#2D6A4F'

  const name = config.hero?.name || '小福'
  const title = about.title || `联系${name}`
  const subtitle = about.subtitle || '选择你喜欢的方式，随时找我聊聊'
  const email = about.email || 'xiaofu@example.com'
  const location = about.location || '中国 · 甘肃'
  const copyright = about.copyright || `© ${new Date().getFullYear()} ${name}. All rights reserved.`

  // 二维码配置（支持 base64 或 URL）
  const qrcodes = about.qrcodes || {
    wechat: '',      // 微信二维码
    wechatOfficial: '', // 公众号二维码
  }

  // 快捷链接
  const quickLinks = about.quickLinks || [
    { icon: 'feishu', label: '飞书知识库', url: '#' },
    { icon: 'twitter', label: 'X (Twitter)', url: 'https://twitter.com/xiaofu' },
    { icon: 'github', label: 'GitHub', url: 'https://github.com/xiaofu' },
    { icon: 'location', label: location, url: null },
  ]

  // 社交图标
  const contacts = about.contacts || []

  const renderIcon = (type) => {
    switch (type) {
      case 'twitter': return <Twitter size={16} />
      case 'github': return <Github size={16} />
      case 'mail': return <Mail size={16} />
      case 'send': return <Send size={16} />
      case 'message': return <MessageCircle size={16} />
      case 'book': return <BookOpen size={16} />
      case 'location': return <MapPin size={16} />
      case 'feishu': return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      )
      default: return <ExternalLink size={16} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8" style={{ background: bg }}>
      
      {/* ===== 顶部标题区 ===== */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span 
            className="w-2 h-2 rounded-full"
            style={{ background: accent }}
          />
          <h1 
            className="text-3xl md:text-4xl font-bold tracking-wider"
            style={{ color: accent }}
          >
            {title}
          </h1>
          <span 
            className="w-2 h-2 rounded-full"
            style={{ background: accent }}
          />
        </div>
        <p className="text-base" style={{ color: muted }}>{subtitle}</p>
      </div>

      {/* ===== 主视觉卡片 ===== */}
      <div
        className="w-full max-w-3xl rounded-2xl overflow-hidden mb-8"
        style={{
          background: cardBg,
          border: `1px solid ${border}`,
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0,0,0,0.6)'
            : '0 25px 50px -12px rgba(0,0,0,0.15)',
        }}
      >
        {/* 背景图区域 */}
        <div 
          className="relative h-64 md:h-80"
          style={{
            background: about.heroImage 
              ? `url(${about.heroImage}) center/cover`
              : `linear-gradient(135deg, ${accent}22 0%, ${accent}08 50%, ${isDark ? '#0D1117' : '#FAF9F6'} 100%)`,
          }}
        >
          {/* 装饰性网格 */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* 左侧公众号二维码 */}
          {qrcodes.wechatOfficial && (
            <div 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2"
            >
              <div 
                className="p-2 rounded-xl"
                style={{ 
                  background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${border}`,
                }}
              >
                <img 
                  src={qrcodes.wechatOfficial} 
                  alt="公众号" 
                  className="w-24 h-24 md:w-28 md:h-28 object-contain"
                />
              </div>
              {/* 悬浮标签 */}
              <div 
                className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  background: accent, 
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                公众号
              </div>
            </div>
          )}

          {/* 右侧微信二维码 */}
          {qrcodes.wechat && (
            <div 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2"
            >
              <div 
                className="p-2 rounded-xl"
                style={{ 
                  background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${border}`,
                }}
              >
                <img 
                  src={qrcodes.wechat} 
                  alt="微信" 
                  className="w-24 h-24 md:w-28 md:h-28 object-contain"
                />
              </div>
              {/* 悬浮标签 */}
              <div 
                className="absolute -bottom-2 -left-2 px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  background: accent, 
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                加好友
              </div>
            </div>
          )}

          {/* 中间装饰文字（如果没有二维码时显示） */}
          {!qrcodes.wechat && !qrcodes.wechatOfficial && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="text-6xl md:text-8xl mb-4"
                  style={{ opacity: 0.1 }}
                >
                  {config.hero?.avatar || '🧑‍💻'}
                </div>
                <p style={{ color: muted }}>扫码添加微信</p>
              </div>
            </div>
          )}
        </div>

        {/* 底部快捷链接 */}
        <div 
          className="flex flex-wrap items-center justify-center gap-3 p-6"
          style={{ borderTop: `1px solid ${border}` }}
        >
          {quickLinks.map((link, index) => (
            link.url ? (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${border}`,
                  color: text,
                }}
              >
                {renderIcon(link.icon)}
                <span>{link.label}</span>
              </a>
            ) : (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${border}`,
                  color: muted,
                }}
              >
                {renderIcon(link.icon)}
                <span>{link.label}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* ===== 社交图标行 ===== */}
      <div className="flex items-center gap-4 mb-8">
        {contacts.filter(c => c.enabled !== false && c.url).map((c, index) => (
          <a
            key={index}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${border}`,
              color: muted,
            }}
            title={c.name}
          >
            {c.icon?.length <= 2 ? (
              <span className="text-xl">{c.icon}</span>
            ) : (
              renderIcon(c.icon)
            )}
          </a>
        ))}
      </div>

      {/* ===== 版权信息 ===== */}
      <p className="text-xs" style={{ color: muted }}>{copyright}</p>

    </div>
  )
}
