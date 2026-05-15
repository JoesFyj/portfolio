import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Activity, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getConfig } from '../config/siteConfig'
import ChinaMapTrajectory from '../components/ChinaMapTrajectory'

// 从配置中心获取数据
function useSiteConfig() {
  const [config, setConfig] = useState(() => getConfig())
  
  useEffect(() => {
    // storage 事件只在其他标签页触发
    const handleStorage = () => setConfig(getConfig())
    window.addEventListener('storage', handleStorage)
    
    // 同标签页监听配置更新事件
    const handleConfigUpdate = () => setConfig(getConfig())
    window.addEventListener('configUpdated', handleConfigUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('configUpdated', handleConfigUpdate)
    }
  }, [])
  
  return config
}

// Hero 区作品轮播展示（右侧大图）
function HeroWorksShowcase({ works, theme }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isDark = theme === 'dark'
  
  const enabledWorks = works.filter(w => w.enabled !== false)
  const allImages = enabledWorks.flatMap(work => 
    work.images.map(img => ({ ...work, image: img }))
  )
  
  useEffect(() => {
    if (allImages.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [allImages.length])

  if (allImages.length === 0) return null

  const current = allImages[currentIndex]
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'

  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-2xl"
      style={{ 
        background: cardBg, 
        border: `1px solid ${border}`,
        boxShadow: isDark 
          ? '0 25px 50px -12px rgba(0,0,0,0.5)' 
          : '0 25px 50px -12px rgba(0,0,0,0.15)',
      }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {allImages.map((item, idx) => (
          <img
            key={`${item.id}-${idx}`}
            src={item.image}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: idx === currentIndex ? 1 : 0 }}
          />
        ))}
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{current.icon}</span>
            <span className="text-white font-semibold text-lg">{current.name}</span>
          </div>
          <p className="text-white/80 text-sm mb-4">{current.desc}</p>
          <Link
            to="/works"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: '#2D6A4F', color: '#fff' }}
          >
            查看全部作品 <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex gap-1.5">
        {allImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="w-2 h-2 rounded-full transition-all"
            style={{ 
              background: idx === currentIndex ? '#2D6A4F' : 'rgba(255,255,255,0.4)',
              transform: idx === currentIndex ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// 年度阅读进度图组件
function ReadingProgressChart({ config, theme }) {
  const isDark = theme === 'dark'
  const accent = config.theme?.primaryColor || '#2D6A4F'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  
  const overview = config.reading?.overview || {}
  const target = overview.target || 24
  const total = overview.total || 0
  const progress = Math.round((total / target) * 100)
  
  // 计算每月的阅读分布（模拟数据）
  const monthlyData = [
    { month: '1月', books: 1 },
    { month: '2月', books: 2 },
    { month: '3月', books: 1 },
    { month: '4月', books: 3 },
    { month: '5月', books: 2 },
    { month: '6月', books: 3 },
  ]
  
  const maxBooks = Math.max(...monthlyData.map(d => d.books), 1)
  
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: isDark ? '#161B22' : '#FFFFFF', border: `1px solid ${border}` }}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg" style={{ color: text }}>2026 阅读进度</h3>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: accent }}>{total}</div>
            <div className="text-xs" style={{ color: muted }}>/ {target} 本</div>
          </div>
        </div>
        
        {/* 环形进度图 */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 140 140">
              {/* 背景圆环 */}
              <circle
                cx="70"
                cy="70"
                r="58"
                fill="none"
                stroke={isDark ? '#21262D' : '#E8E5DF'}
                strokeWidth="12"
              />
              {/* 进度圆环 */}
              <circle
                cx="70"
                cy="70"
                r="58"
                fill="none"
                stroke={accent}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold" style={{ color: text }}>{progress}%</div>
              <div className="text-xs" style={{ color: muted }}>完成</div>
            </div>
          </div>
        </div>
        
        {/* 月度柱状图 */}
        <div className="mb-4">
          <div className="text-xs font-medium mb-3" style={{ color: muted }}>月度阅读分布</div>
          <div className="flex items-end justify-between gap-2 h-20">
            {monthlyData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full rounded-t transition-all hover:opacity-80"
                  style={{ 
                    height: `${(item.books / maxBooks) * 60}px`,
                    background: accent,
                    minHeight: '4px',
                  }}
                />
                <div className="text-xs" style={{ color: muted }}>{item.month}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 统计数据 */}
        <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: `1px solid ${border}` }}>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: text }}>{overview.pages || 0}</div>
            <div className="text-xs" style={{ color: muted }}>累计页数</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: text }}>{overview.hours || 0}h</div>
            <div className="text-xs" style={{ color: muted }}>阅读时长</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: text }}>{overview.streak || 0}</div>
            <div className="text-xs" style={{ color: muted }}>连续阅读</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 作品轮播图组件
function WorkCarousel({ images, theme }) {
  const [current, setCurrent] = useState(0)
  const isDark = theme === 'dark'
  
  if (!images || images.length === 0) return null
  
  const next = () => setCurrent((c) => (c + 1) % images.length)
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length)

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 group">
      <img src={images[current]} alt={`截图 ${current + 1}`} className="w-full h-full object-cover" />
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev() }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); next() }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button key={i} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i) }}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === current ? '#fff' : 'rgba(255,255,255,0.5)' }} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function HomeNew({ theme }) {
  const isDark = theme === 'dark'
  const config = useSiteConfig()
  
  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const accent = config.theme?.primaryColor || '#2D6A4F'

  // 过滤启用的数据
  const heroConfig = config.hero || {}
  const socialConfig = config.social || {}
  const worksConfig = config.works || {}
  const readingConfig = config.reading || {}
  const exerciseConfig = config.exercise || {}
  const aboutConfig = config.about || {}

  const enabledWorks = (worksConfig.items || []).filter(w => w.enabled !== false)
  const enabledPlatforms = (socialConfig.platforms || []).filter(p => p.enabled !== false)
  const enabledBooks = (readingConfig.records || []).filter(b => b.enabled !== false)
  const enabledRuns = (exerciseConfig.records || []).filter(r => r.enabled !== false)

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      
      {/* ===== Hero - 左右布局 ===== */}
      {heroConfig.enabled !== false && (
        <section className="flex items-center" style={{ minHeight: '90dvh', paddingTop: '4rem' }}>
          <div className="w-full max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{
                    background: isDark ? 'rgba(45,106,79,0.15)' : 'rgba(45,106,79,0.08)',
                    border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}`,
                  }}>
                  <span className="text-sm font-medium" style={{ color: accent }}>{heroConfig.tag}</span>
                </div>
                <div className="mb-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-4xl"
                    style={{ background: isDark ? '#21262D' : '#F0EFEA', border: `3px solid ${border}` }}>
                    {heroConfig.avatar}
                  </div>
                </div>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: text }}>
                  {heroConfig.title}
                </h1>
                <p className="text-base md:text-lg mb-6 max-w-lg leading-relaxed" style={{ color: muted }}>
                  {heroConfig.subtitle}
                  <br />
                  <span style={{ color: accent }}>{heroConfig.motto}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {(heroConfig.buttons || []).map((btn, idx) => (
                    btn.primary ? (
                      <Link key={idx} to={btn.link}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg"
                        style={{ background: accent, color: '#FFFFFF' }}>
                        {btn.icon === 'Zap' && <Zap size={16} />}
                        {btn.icon === 'BookOpen' && <BookOpen size={16} />}
                        {btn.icon === 'Activity' && <Activity size={16} />}
                        {btn.label}
                      </Link>
                    ) : (
                      <a key={idx} href={btn.link}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all"
                        style={{ borderColor: border, color: muted }}>
                        {btn.icon === 'Zap' && <Zap size={16} />}
                        {btn.icon === 'BookOpen' && <BookOpen size={16} />}
                        {btn.icon === 'Activity' && <Activity size={16} />}
                        {btn.label}
                      </a>
                    )
                  ))}
                </div>
              </div>
              {worksConfig.showOnHero !== false && enabledWorks.length > 0 && (
                <div className="hidden lg:block">
                  <HeroWorksShowcase works={enabledWorks} theme={theme} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== 社交媒体 ===== */}
      {socialConfig.enabled !== false && (
        <section className="py-20 px-6" style={{ background: isDark ? '#161B22' : '#F8F7F4' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: text }}>{socialConfig.title}</h2>
            <p className="text-sm mb-10" style={{ color: muted }}>{socialConfig.subtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {enabledPlatforms.map(platform => (
                <div key={platform.name} className="rounded-xl p-5 transition-all hover:shadow-md"
                  style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <span className="font-medium" style={{ color: text }}>{platform.name}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: platform.color }}>{platform.fans}</div>
                  <div className="text-xs" style={{ color: muted }}>粉丝 · {platform.works} 作品</div>
                </div>
              ))}
            </div>
            {worksConfig.enabled !== false && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg" style={{ color: text }}>{worksConfig.title}</h3>
                  <Link to="/works" className="text-sm font-medium flex items-center gap-1" style={{ color: accent }}>
                    查看更多 <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enabledWorks.slice(0, 2).map(work => (
                    <div key={work.id} className="rounded-xl p-4 transition-all hover:shadow-lg group"
                      style={{ background: cardBg, border: `1px solid ${border}` }}>
                      <WorkCarousel images={work.images} theme={theme} />
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{work.icon}</span>
                        <h4 className="font-semibold text-lg" style={{ color: text }}>{work.name}</h4>
                      </div>
                      <p className="text-sm mb-3" style={{ color: muted }}>{work.desc}</p>
                      {work.external ? (
                        <a href={work.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
                          style={{ color: work.color }}>前往使用 <ArrowRight size={14} /></a>
                      ) : (
                        <Link to={work.url}
                          className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
                          style={{ color: work.color }}>查看详情 <ArrowRight size={14} /></Link>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ===== 读书 ===== */}
      {readingConfig.enabled !== false && (
        <section id="reading" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl font-bold mb-2" style={{ color: text }}>{readingConfig.title}</h2>
                <p className="text-sm" style={{ color: muted }}>{readingConfig.subtitle}</p>
              </div>
              <Link to="/reading" className="text-sm font-medium flex items-center gap-1" style={{ color: accent }}>
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {readingConfig.overview?.enabled !== false && (
                <div className="rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <div className="relative aspect-[16/9]">
                    <img src={readingConfig.overview.image} alt="阅读全貌" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white font-medium mb-2">2026 阅读之旅</div>
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span>目标 {readingConfig.overview.target} 本</span>
                        <span>·</span>
                        <span>已完成 {Math.round(readingConfig.overview.total / readingConfig.overview.target * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div><div className="text-xl font-bold" style={{ color: accent }}>{readingConfig.overview.total}</div><div className="text-xs" style={{ color: muted }}>已读书籍</div></div>
                      <div><div className="text-xl font-bold" style={{ color: accent }}>{readingConfig.overview.pages}</div><div className="text-xs" style={{ color: muted }}>累计页数</div></div>
                      <div><div className="text-xl font-bold" style={{ color: accent }}>{readingConfig.overview.hours}h</div><div className="text-xs" style={{ color: muted }}>阅读时长</div></div>
                    </div>
                  </div>
                </div>
              )}
              {readingConfig.current?.enabled !== false && (
                <div className="rounded-xl p-6 flex flex-col justify-center"
                  style={{ background: isDark ? 'rgba(45,106,79,0.1)' : 'rgba(45,106,79,0.05)', border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}` }}>
                  <div className="text-xs font-medium mb-4" style={{ color: accent }}>当前在读</div>
                  <div className="flex items-start gap-4">
                    <span className="text-5xl">{readingConfig.current.cover}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-lg mb-2" style={{ color: text }}>{readingConfig.current.name}</div>
                      <p className="text-sm mb-4 leading-relaxed" style={{ color: muted }}>{readingConfig.current.summary}</p>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-2 rounded-full" style={{ background: isDark ? '#21262D' : '#E8E5DF' }}>
                          <div className="h-full rounded-full" style={{ width: `${readingConfig.current.progress}%`, background: accent }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: accent }}>{readingConfig.current.progress}%</span>
                      </div>
                      <Link to={readingConfig.current.articleUrl} className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: accent }}>
                        阅读笔记 <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <h3 className="font-medium mb-4" style={{ color: muted }}>阅读记录</h3>
            <div className="space-y-4">
              {enabledBooks.slice(0, 4).map(book => (
                <div key={book.id} className="rounded-xl p-5 transition-all hover:shadow-md group" style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-20 rounded-lg flex items-center justify-center text-3xl" style={{ background: isDark ? '#21262D' : '#F0EFEA' }}>{book.cover}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="font-semibold text-lg mb-1" style={{ color: text }}>{book.name}</div>
                          <div className="flex items-center gap-3 text-xs" style={{ color: muted }}>
                            <span>{book.readAt}</span><span>·</span><span>{book.pages} 页</span><span>·</span><span>{'⭐'.repeat(book.rating)}</span>
                          </div>
                        </div>
                        <Link to={book.articleUrl} className="flex-shrink-0 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accent }}>
                          查看笔记 <ArrowRight size={14} />
                        </Link>
                      </div>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: muted }}>{book.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {book.note.split('、').map(tag => (
                          <span key={tag} className="px-2 py-1 rounded text-xs" style={{ background: isDark ? 'rgba(45,106,79,0.15)' : 'rgba(45,106,79,0.08)', color: accent }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 锻炼 ===== */}
      {exerciseConfig.enabled !== false && (
        <section id="exercise" className="py-20 px-6" style={{ background: isDark ? '#161B22' : '#F8F7F4' }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl font-bold mb-2" style={{ color: text }}>{exerciseConfig.title}</h2>
                <p className="text-sm" style={{ color: muted }}>{exerciseConfig.motto}</p>
              </div>
              <Link to="/exercise" className="text-sm font-medium flex items-center gap-1" style={{ color: accent }}>
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>
            {exerciseConfig.stats?.enabled !== false && (
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { label: '连续打卡', value: `${exerciseConfig.stats.streak}天`, icon: '🔥' },
                  { label: '今年跑量', value: `${exerciseConfig.stats.yearDistance}km`, icon: '🏃' },
                  { label: '本周跑量', value: `${exerciseConfig.stats.weekDistance}km`, icon: '📊' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl p-5 text-center" style={{ background: cardBg, border: `1px solid ${border}` }}>
                    <span className="text-2xl block mb-2">{stat.icon}</span>
                    <div className="text-2xl font-bold mb-1" style={{ color: text }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: muted }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {exerciseConfig.trajectory?.enabled !== false && (
                <div className="rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <div>  
                    <ChinaMapTrajectory theme={theme} />
                  </div>
                  <div className="p-4">
                    <p className="text-sm" style={{ color: muted }}>{exerciseConfig.trajectory.description}</p>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <h3 className="font-medium" style={{ color: muted }}>最近跑步</h3>
                {enabledRuns.slice(0, 3).map(record => (
                  <div key={record.id} className="rounded-xl overflow-hidden transition-all hover:shadow-md group" style={{ background: cardBg, border: `1px solid ${border}` }}>
                    <div className="flex">
                      <div className="w-32 h-24 flex-shrink-0">
                        <img src={record.image} alt={`跑步 ${record.date}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ color: muted }}>{record.date}</span>
                          <span className="text-xs font-medium" style={{ color: accent }}>{record.distance}km</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-2 line-clamp-2" style={{ color: text }}>{record.note}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs" style={{ color: muted }}>{record.duration} · 配速 {record.pace}</span>
                          <Link to={record.articleUrl} className="text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accent }}>
                            查看记录 <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== 联系我 ===== */}
      {aboutConfig.enabled !== false && (
        <section className="py-20 px-6" style={{ background: isDark ? '#161B22' : '#F8F7F4' }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
                <h2 className="text-3xl md:text-4xl font-bold tracking-wider" style={{ color: accent }}>联系我</h2>
                <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
              </div>
              <p className="text-base" style={{ color: muted }}>选择你喜欢的方式，随时找我聊聊</p>
            </div>

            {/* 二维码卡片 */}
            <div
              className="w-full rounded-2xl overflow-hidden mb-8"
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
                boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.15)',
              }}
            >
              <div
                className="relative h-64 md:h-72"
                style={{
                  background: aboutConfig.heroImage
                    ? `url(${aboutConfig.heroImage}) center/cover`
                    : `linear-gradient(135deg, ${accent}15 0%, ${accent}05 50%, ${isDark ? '#161B22' : '#FFFFFF'} 100%)`,
                }}
              >
                {/* 装饰网格 */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* 左侧公众号二维码 */}
                {(aboutConfig.qrcodes?.wechatOfficial) && (
                  <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2">
                    <div className="p-2 rounded-xl" style={{ background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)', border: `1px solid ${border}` }}>
                      <img src={aboutConfig.qrcodes.wechatOfficial} alt="公众号" className="w-24 h-24 md:w-28 md:h-28 object-contain" />
                    </div>
                    <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-medium" style={{ background: accent, color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                      公众号
                    </div>
                  </div>
                )}

                {/* 右侧微信二维码 */}
                {(aboutConfig.qrcodes?.wechat) && (
                  <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2">
                    <div className="p-2 rounded-xl" style={{ background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)', border: `1px solid ${border}` }}>
                      <img src={aboutConfig.qrcodes.wechat} alt="微信" className="w-24 h-24 md:w-28 md:h-28 object-contain" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 px-3 py-1 rounded-full text-xs font-medium" style={{ background: accent, color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                      加好友
                    </div>
                  </div>
                )}

                {/* 无二维码时占位 */}
                {!aboutConfig.qrcodes?.wechat && !aboutConfig.qrcodes?.wechatOfficial && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl md:text-7xl mb-3" style={{ opacity: 0.08 }}>{heroConfig.avatar || '🧑‍💻'}</div>
                      <p style={{ color: muted }}>扫码添加微信</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部快捷链接 */}
              <div className="flex flex-wrap items-center justify-center gap-3 p-6" style={{ borderTop: `1px solid ${border}` }}>
                {(aboutConfig.quickLinks || []).map((link, index) => (
                  link.url ? (
                    <a key={index} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: `1px solid ${border}`, color: text }}>
                      <span>{link.icon === 'feishu' ? '📚' : link.icon === 'twitter' ? '🐦' : link.icon === 'github' ? '🔗' : link.icon === 'location' ? '📍' : '🔗'}</span>
                      <span>{link.label}</span>
                    </a>
                  ) : (
                    <span key={index} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: `1px solid ${border}`, color: muted }}>
                      <span>📍</span>
                      <span>{link.label}</span>
                    </span>
                  )
                ))}
              </div>
            </div>

            {/* 社交图标行 */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {(aboutConfig.contacts || []).filter(c => c.enabled !== false && c.url).map((c, index) => (
                <a key={index} href={c.url} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: `1px solid ${border}`, color: muted }}
                  title={c.name}>
                  <span className="text-xl">{c.icon?.length <= 2 ? c.icon : c.name[0]}</span>
                </a>
              ))}
            </div>

            {/* 版权信息 */}
            <p className="text-xs text-center" style={{ color: muted }}>{aboutConfig.copyright || `© ${new Date().getFullYear()} ${heroConfig.name || '小福'}. All rights reserved.`}</p>
          </div>
        </section>
      )}
    </div>
  )
}
