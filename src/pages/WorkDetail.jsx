import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, Globe, Code, Calendar, Users } from 'lucide-react'
import { useState } from 'react'
import { getConfig } from '../config/siteConfig'

export default function WorkDetail({ theme }) {
  const isDark = theme === 'dark'
  const { id } = useParams()
  const navigate = useNavigate()
  const config = getConfig()

  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const accent = '#2D6A4F'

  // 查找作品
  const worksConfig = config.works || {}
  const allWorks = (worksConfig.items || []).filter(w => w.enabled !== false)
  const work = allWorks.find(w => String(w.id) === String(id))

  const [currentImage, setCurrentImage] = useState(0)

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: text }}>作品未找到</h2>
          <p className="text-sm mb-6" style={{ color: muted }}>这个作品可能已被移除或不存在</p>
          <Link to="/works" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: accent, color: '#fff' }}>
            <ArrowLeft size={16} /> 返回作品集
          </Link>
        </div>
      </div>
    )
  }

  const images = work.images || []
  const prevImage = () => setCurrentImage(i => (i - 1 + images.length) % images.length)
  const nextImage = () => setCurrentImage(i => (i + 1) % images.length)

  // 相关作品（同分类，排除自身）
  const related = allWorks.filter(w => String(w.id) !== String(id) && w.category === work.category).slice(0, 2)

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* 返回 */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-70"
          style={{ color: muted }}
        >
          <ArrowLeft size={16} /> 返回
        </button>

        {/* 图片轮播 */}
        {images.length > 0 && (
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ border: `1px solid ${border}` }}>
            <div className="relative aspect-[16/9]">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${work.name} 截图 ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  style={{ opacity: idx === currentImage ? 1 : 0 }}
                />
              ))}
              {/* 渐变遮罩 */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 30%)' }} />

              {/* 翻页按钮 */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-90"
                    style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-90"
                    style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                    <ChevronRight size={20} />
                  </button>
                  {/* 指示器 */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentImage(idx)}
                        className="w-2 h-2 rounded-full transition-all"
                        style={{ background: idx === currentImage ? '#fff' : 'rgba(255,255,255,0.4)' }} />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* 缩略图 */}
            {images.length > 1 && (
              <div className="flex gap-2 p-4" style={{ background: cardBg }}>
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setCurrentImage(idx)}
                    className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all"
                    style={{ border: idx === currentImage ? `2px solid ${accent}` : `1px solid ${border}`, opacity: idx === currentImage ? 1 : 0.6 }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 主内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧详情 */}
          <div className="lg:col-span-2">
            {/* 标题区 */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: `${work.color}15` }}>
                {work.icon}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: text }}>{work.name}</h1>
                <p className="text-base leading-relaxed" style={{ color: muted }}>{work.desc}</p>
              </div>
            </div>

            {/* 详细描述 */}
            {work.detail && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-3" style={{ color: text }}>项目详情</h3>
                <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: muted }}>
                  {work.detail}
                </div>
              </div>
            )}

            {/* 功能标签 */}
            {work.features && work.features.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-3" style={{ color: text }}>技术栈 & 功能</h3>
                <div className="flex flex-wrap gap-2">
                  {work.features.map((feature, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-xl text-sm font-medium"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${border}`,
                        color: text,
                      }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3">
              {work.external ? (
                <a href={work.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-lg"
                  style={{ background: work.color || accent, color: '#fff' }}>
                  前往使用 <ExternalLink size={16} />
                </a>
              ) : (
                <Link to={work.url}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-lg"
                  style={{ background: work.color || accent, color: '#fff' }}>
                  查看项目
                </Link>
              )}
              <Link to="/works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all"
                style={{ borderColor: border, color: muted }}>
                <ArrowLeft size={16} /> 所有作品
              </Link>
            </div>
          </div>

          {/* 右侧信息栏 */}
          <div className="space-y-4">
            {/* 项目信息卡 */}
            <div className="rounded-xl p-5" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <h4 className="font-semibold mb-4" style={{ color: text }}>项目信息</h4>
              <div className="space-y-3">
                {work.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: muted }}>分类</span>
                    <span className="text-sm font-medium" style={{ color: text }}>
                      {worksConfig.categories?.find(c => c.id === work.category)?.name || work.category}
                    </span>
                  </div>
                )}
                {work.collaboration && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: muted }}>合作方式</span>
                    <span className="text-sm font-medium" style={{ color: text }}>{work.collaboration}</span>
                  </div>
                )}
                {work.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: muted }}>创建时间</span>
                    <span className="text-sm font-medium" style={{ color: text }}>{work.createdAt}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: muted }}>状态</span>
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: `${accent}15`, color: accent }}>
                    {work.external ? '在线可用' : '开发中'}
                  </span>
                </div>
              </div>
            </div>

            {/* 联系合作 */}
            <div className="rounded-xl p-5" style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}>
              <h4 className="font-semibold mb-2" style={{ color: accent }}>想合作？</h4>
              <p className="text-sm mb-4" style={{ color: muted }}>如果你对类似项目感兴趣，欢迎聊聊</p>
              <Link to="/"
                className="block text-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: accent, color: '#fff' }}>
                联系我
              </Link>
            </div>
          </div>
        </div>

        {/* 相关作品 */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="font-semibold text-lg mb-6" style={{ color: text }}>相关作品</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map(r => (
                <Link key={r.id} to={`/works/${r.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md"
                  style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <span className="text-3xl">{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1" style={{ color: text }}>{r.name}</div>
                    <div className="text-sm line-clamp-1" style={{ color: muted }}>{r.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
