import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react'

const CONTACTS = [
  {
    name: '推特',
    icon: '𝕏',
    url: 'https://twitter.com/xiaofu',
    desc: '日常思考、AI实验分享',
  },
  {
    name: '抖音',
    icon: '📱',
    url: 'https://douyin.com/user/xiaofu',
    desc: '短视频、财商认知',
  },
  {
    name: '公众号',
    icon: '📝',
    url: '#',
    desc: '小福AI自由',
  },
  {
    name: '邮箱',
    icon: '✉️',
    url: 'mailto:xiaofu@example.com',
    desc: 'xiaofu@example.com',
  },
  {
    name: '微信',
    icon: '💬',
    url: '#',
    desc: 'xiaofu_ai（备注：来自网站）',
  },
]

export default function Connect({ theme }) {
  const isDark = theme === 'dark'

  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto px-6 py-20">
        
        {/* 返回 */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm mb-10 transition-colors"
          style={{ color: muted }}
        >
          <ArrowLeft size={14} /> 返回首页
        </Link>

        {/* 标题 */}
        <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: text }}>
          联系我
        </h1>
        <p className="text-base mb-10" style={{ color: muted }}>
          合作、交流、或者只是打个招呼
        </p>

        {/* 联系方式 */}
        <div className="space-y-4 mb-16">
          {CONTACTS.map(contact => (
            <a
              key={contact.name}
              href={contact.url}
              target={contact.url.startsWith('http') ? '_blank' : undefined}
              rel={contact.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-4 p-5 rounded-xl transition-all hover:shadow-lg"
              style={{ background: cardBg, border: `1px solid ${border}` }}
            >
              <span className="text-3xl">{contact.icon}</span>
              <div className="flex-1">
                <div className="font-semibold mb-1" style={{ color: text }}>{contact.name}</div>
                <div className="text-sm" style={{ color: muted }}>{contact.desc}</div>
              </div>
            </a>
          ))}
        </div>

        {/* 合作说明 */}
        <div
          className="rounded-xl p-6"
          style={{
            background: isDark ? 'rgba(45,106,79,0.1)' : 'rgba(45,106,79,0.05)',
            border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🤝</span>
            <span className="font-semibold" style={{ color: '#2D6A4F' }}>开放合作</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: muted }}>
            AI产品开发与出海合作、内容共创与知识付费、自媒体运营咨询。
            <br />
            有想法随时联系，一起搞事情。
          </p>
        </div>

      </div>
    </div>
  )
}
