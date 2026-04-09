import { getConfig } from '../lib/siteConfig'
import { Send, QrCode } from 'lucide-react'

export default function HomeConnect({ theme }) {
  const isDark = theme === 'dark'
  const bg      = isDark ? '#0D1117' : '#FAF9F6'
  const text    = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted   = isDark ? '#8B949E' : '#6B6860'
  const border  = isDark ? '#30363D' : '#E8E5DF'
  const cardBg  = isDark ? '#161B22' : '#FFFFFF'
  const numColor= isDark ? '#8B949E' : '#D4C9B8'
  const qrBg    = isDark ? '#161B22' : '#F4F2EE'

  const cfg = getConfig()
  const c = cfg.homeConnect || {}
  const title = c.title || '找到我'
  const subtitle = c.subtitle || 'AI探索路上，一起走'
  const description = c.description || '关注公众号，生活的小虾。回复「AI」入群，与同路人一起成长。'

  const wechat    = c.wechat    || ''
  const wechatQr  = c.wechatQr  || ''
  const gzh       = c.gzh       || ''
  const gzhQr     = c.gzhQr    || ''
  const jike      = c.jike     || ''
  const twitter   = c.twitter   || ''
  const douyin    = c.douyin   || ''

  const hasQr = wechatQr || gzhQr

  return (
    <section id="connect" className="py-24 px-6" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto">

        {/* 标题 */}
        <div className="mb-16">
          <span className="section-label">
            <span className="text-2xl font-bold" style={{ color: numColor }}>06</span>
            Connect
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: text }}>
            {title}
          </h2>
          <div className="accent-bar mt-4" />
        </div>

        {/* 主内容区：左侧文字 + 右侧二维码 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">

          {/* 左侧 */}
          <div>
            <h3 className="text-2xl font-bold font-serif mb-4" style={{ color: text }}>
              {subtitle}
            </h3>
            <p className="text-base leading-relaxed mb-8" style={{ color: muted }}>
              {description}
            </p>

            {/* 社交链接 */}
            <div className="space-y-3">
              {[
                wechat  && { label: '微信',   value: wechat,  color: '#22C55E' },
                gzh     && { label: '公众号', value: gzh,      color: '#3B82F6' },
                jike    && { label: '即刻',   value: jike,     color: '#EAB308' },
                twitter && { label: '推特',   value: twitter,  color: '#1DA1F2' },
                douyin  && { label: '抖音',   value: douyin,   color: '#EC4899' },
              ].filter(Boolean).map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: color + '15' }}>
                    <Send size={14} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: muted }}>{label}</div>
                    <div className="text-sm font-medium" style={{ color: text }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：二维码 */}
          {(wechatQr || gzhQr) && (
            <div className="flex flex-col gap-6 items-center">
              {wechatQr && (
                <div className="text-center">
                  <div
                    className="w-52 h-52 rounded-2xl overflow-hidden flex items-center justify-center mx-auto"
                    style={{ background: qrBg, border: `1px solid ${border}` }}
                  >
                    {wechatQr.startsWith('data:') || wechatQr.startsWith('http')
                      ? <img src={wechatQr} alt="微信" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex flex-col items-center justify-center">
                          <QrCode size={48} style={{ color: muted }} />
                          <span className="text-xs mt-2 block" style={{ color: muted }}>微信二维码</span>
                        </div>
                    }
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold" style={{ color: text }}>扫码添加微信</div>
                    <div className="text-xs mt-1" style={{ color: muted }}>
                      {wechat || '备注「AI」拉你入群'}
                    </div>
                  </div>
                </div>
              )}

              {gzhQr && (
                <div className="text-center">
                  <div
                    className="w-52 h-52 rounded-2xl overflow-hidden flex items-center justify-center mx-auto"
                    style={{ background: qrBg, border: `1px solid ${border}` }}
                  >
                    {gzhQr.startsWith('data:') || gzhQr.startsWith('http')
                      ? <img src={gzhQr} alt="公众号" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex flex-col items-center justify-center">
                          <QrCode size={48} style={{ color: muted }} />
                          <span className="text-xs mt-2 block" style={{ color: muted }}>公众号</span>
                        </div>
                    }
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold" style={{ color: text }}>{gzh || '生活的小虾'}</div>
                    <div className="text-xs mt-1" style={{ color: muted }}>公众号持续更新中</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 没有二维码时提示 */}
        {!hasQr && (
          <div className="text-center py-12 rounded-2xl" style={{ background: qrBg, border: `1px dashed ${border}` }}>
            <QrCode size={40} className="mx-auto mb-3" style={{ color: muted }} />
            <p className="text-sm" style={{ color: muted }}>二维码配置中...</p>
          </div>
        )}

      </div>
    </section>
  )
}
