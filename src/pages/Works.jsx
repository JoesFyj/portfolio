import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getConfig } from '../config/siteConfig'

function WorkCard({ work, theme }) {
  const isDark = theme === 'dark'
  const [currentImage, setCurrentImage] = useState(0)
  
  const bg = isDark ? '#161B22' : '#FFFFFF'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'

  if (!work.images || work.images.length === 0) return null

  const nextImage = () => setCurrentImage((c) => (c + 1) % work.images.length)
  const prevImage = () => setCurrentImage((c) => (c - 1 + work.images.length) % work.images.length)

  return (
    <div 
      className="rounded-2xl overflow-hidden transition-all hover:shadow-xl group"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      {/* 图片轮播 */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={work.images[currentImage]} 
          alt={work.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* 渐变遮罩 */}
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)' }}
        />
        
        {/* 图片切换按钮 */}
        {work.images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.preventDefault(); prevImage() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); nextImage() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        
        {/* 图片指示器 */}
        <div className="absolute top-4 right-4 flex gap-1.5">
          {work.images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.preventDefault(); setCurrentImage(idx) }}
              className="w-2 h-2 rounded-full transition-all"
              style={{ 
                background: idx === currentImage ? '#fff' : 'rgba(255,255,255,0.4)',
                transform: idx === currentImage ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
        
        {/* 图标和名称 */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <span className="text-3xl">{work.icon}</span>
          <span className="text-white font-semibold text-lg">{work.name}</span>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="p-6">
        <p className="text-sm mb-4 leading-relaxed" style={{ color: muted }}>{work.desc}</p>
        
        {work.features && work.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {work.features.map((feature, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  color: muted,
                  border: `1px solid ${border}`,
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        )}
        
        {/* 链接按钮 */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${border}` }}>
          {work.external ? (
            <a 
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md"
              style={{ background: work.color, color: '#fff' }}
            >
              前往使用 <ExternalLink size={14} />
            </a>
          ) : (
            <Link 
              to={work.url}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md"
              style={{ background: work.color, color: '#fff' }}
            >
              查看详情 <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Works({ theme }) {
  const isDark = theme === 'dark'
  const config = getConfig()
  
  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const accent = config.theme?.primaryColor || '#2D6A4F'
  
  const worksConfig = config.works || {}
  const allWorks = (worksConfig.items || []).filter(w => w.enabled !== false)

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      
      {/* 顶部标题 */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-70"
            style={{ color: muted }}
          >
            <ChevronLeft size={16} /> 返回首页
          </Link>
          
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" style={{ color: text }}>
            {worksConfig.title || '作品集'}
          </h1>
          <p className="text-base" style={{ color: muted }}>
            用 AI 放大个人产出，一个人干出一个小团队的量
          </p>
        </div>
      </div>
      
      {/* 作品列表 */}
      <div className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          {allWorks.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔧</div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: text }}>暂无作品</h2>
              <p className="text-sm" style={{ color: muted }}>在后台添加作品后，这里会展示</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {allWorks.map(work => (
                <WorkCard key={work.id} work={work} theme={theme} />
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  )
}
