import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Activity, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getConfig } from '../config/siteConfig'
import TypewriterText from '../components/TypewriterText'

function useSiteConfig() {
  const [config, setConfig] = useState(() => getConfig())
  useEffect(() => {
    const handleStorage = () => setConfig(getConfig())
    window.addEventListener('storage', handleStorage)
    const handleConfigUpdate = () => setConfig(getConfig())
    window.addEventListener('configUpdated', handleConfigUpdate)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('configUpdated', handleConfigUpdate)
    }
  }, [])
  return config
}

// ======================= 能力图标映射 =======================
const CAPABILITY_ICONS = {
  'AI智能体': '🤖',
  '提示词工程': '✍️',
  'AI写作': '📝',
  '自动化运营': '⚡',
  '自媒体运营': '📱',
  '教育培训': '🎓',
}

// ======================= Hero 区作品轮播（右侧大图）=======================
function HeroWorksShowcase({ works, theme }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isDark = theme === 'dark'
  const enabledWorks = works.filter(w => w.enabled !== false)
  const allImages = enabledWorks.flatMap(work =>
    work.images.map(img => ({ ...work, image: img }))
  )

  useEffect(() => {
    if (allImages.length === 0) return
    const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % allImages.length), 4000)
    return () => clearInterval(timer)
  }, [allImages.length])

  if (allImages.length === 0) return null

  const current = allImages[currentIndex]
  const border = isDark ? '#30363D' : '#E8E5DF'

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: isDark ? '#161B22' : '#FFFFFF',
        border: `1px solid ${border}`,
        boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.15)',
      }}>
      <div className="relative aspect-[16/10] overflow-hidden">
        {allImages.map((item, idx) => (
          <img key={`${item.id}-${idx}`} src={item.image} alt={item.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: idx === currentIndex ? 1 : 0 }} />
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{current.icon}</span>
            <span className="text-white font-semibold text-lg">{current.name}</span>
          </div>
          <p className="text-white/80 text-sm mb-4">{current.desc}</p>
          <Link to="/works"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: '#2D6A4F', color: '#fff' }}>
            查看全部作品 <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex gap-1.5">
        {allImages.map((_, idx) => (
          <button key={idx} onClick={() => setCurrentIndex(idx)}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: idx === currentIndex ? '#2D6A4F' : 'rgba(255,255,255,0.4)',
              transform: idx === currentIndex ? 'scale(1.2)' : 'scale(1)',
            }} />
        ))}
      </div>
    </div>
  )
}

// ======================= 作品轮播图（小） =======================
function WorkCarousel({ images, theme }) {
  const [current, setCurrent] = useState(0)
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

// ======================= 主页组件 =======================
export default function HomeNew({ theme }) {
  const isDark = theme === 'dark'
  const config = useSiteConfig()

  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const altBg = isDark ? '#161B22' : '#F8F7F4'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const accent = config.theme?.primaryColor || '#2D6A4F'

  const heroConfig = config.hero || {}
  const worksConfig = config.works || {}
  const readingConfig = config.reading || {}
  const exerciseConfig = config.exercise || {}
  const aboutConfig = config.about || {}
  const capabilitiesConfig = config.homeCapabilities || {}

  const enabledWorks = (worksConfig.items || []).filter(w => w.enabled !== false)

  // 能力卡片数据：优先用 homeCapabilities.items，否则用 homeCapabilities.capabilities 文本数组
  const capabilityItems = (capabilitiesConfig.items || [])
    .filter(c => c.enabled !== false)
  const capabilities = capabilityItems.length > 0
    ? capabilityItems
    : (capabilitiesConfig.capabilities || []).map(name => ({
        name,
        desc: '',
        icon: CAPABILITY_ICONS[name] || '✨'
      }))

  return (
    <div style={{ background: bg }}>

      {/* ==================================================== */}
      {/* SECTION 1: Hero — 左右双栏 */}
      {/* ==================================================== */}
      {heroConfig.enabled !== false && (
        <section className="relative flex items-center" style={{ minHeight: '90dvh', paddingTop: '4rem' }}>
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* 左侧：文字区 */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{
                    background: isDark ? 'rgba(45,106,79,0.15)' : 'rgba(45,106,79,0.08)',
                    border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}`,
                  }}>
                  <span className="text-sm font-medium" style={{ color: accent }}>{heroConfig.tag}</span>
                </div>

                <div className="mb-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: isDark ? '#21262D' : '#F0EFEA', border: `3px solid ${border}` }}>
                    {heroConfig.avatar ? (
                      <img src={heroConfig.avatar} alt="头像" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🧑‍💻</span>
                    )}
                  </div>
                </div>

                {heroConfig.typewriter?.enabled ? (
                  <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: text }}>
                    <TypewriterText
                      texts={heroConfig.typewriter.texts || []}
                      fixedText={heroConfig.typewriter.fixedText || '我是'}
                      fixedColor={heroConfig.typewriter.fixedColor || text}
                      typingColor={heroConfig.typewriter.typingColor || accent}
                      typingSpeed={heroConfig.typewriter.typingSpeed || 100}
                      deleteSpeed={heroConfig.typewriter.deleteSpeed || 50}
                      pauseTime={heroConfig.typewriter.pauseTime || 2000}
                    />
                  </h1>
                ) : (
                  <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: text }}>
                    {heroConfig.title}
                  </h1>
                )}
                <p className="text-base md:text-lg mb-6 max-w-lg leading-relaxed" style={{ color: muted }}>
                  {heroConfig.subtitle}
                </p>
                <p className="text-base md:text-lg mb-8 max-w-lg leading-relaxed font-medium" style={{ color: accent }}>
                  {heroConfig.motto}
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
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all hover:border-current"
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

              {/* 右侧：作品轮播 */}
              {worksConfig.showOnHero !== false && enabledWorks.length > 0 && (
                <div className="hidden lg:block">
                  <HeroWorksShowcase works={enabledWorks} theme={theme} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================== */}
      {/* SECTION 2: 我能做什么 — 能力卡片 */}
      {/* ==================================================== */}
      {capabilities.length > 0 && (
        <section className="py-20 px-6" style={{ background: bg }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3" style={{ color: text }}>
                我能做什么
              </h2>
              <p className="text-sm" style={{ color: muted }}>
                {capabilitiesConfig.title || '这是我的核心能力，也是我能为你提供的价值'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {capabilities.map((cap, idx) => (
                <div key={idx}
                  className="rounded-xl p-5 md:p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: altBg,
                    border: `1px solid ${border}`,
                    boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                  }}>
                  <div className="text-3xl md:text-4xl mb-3">{cap.icon || CAPABILITY_ICONS[cap.name] || '✨'}</div>
                  <h3 className="font-semibold text-base md:text-lg mb-2" style={{ color: text }}>
                    {cap.name}
                  </h3>
                  {cap.desc && (
                    <p className="text-xs md:text-sm" style={{ color: muted }}>{cap.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================== */}
      {/* SECTION 3: 精选作品 */}
      {/* ==================================================== */}
      {worksConfig.enabled !== false && enabledWorks.length > 0 && (
        <section className="py-20 px-6" style={{ background: altBg }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2" style={{ color: text }}>
                  {worksConfig.title || '精选作品'}
                </h2>
                <p className="text-sm" style={{ color: muted }}>
                  {worksConfig.subtitle || '一些我做过的事情'}
                </p>
              </div>
              <Link to="/works" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                style={{ background: accent, color: '#fff' }}>
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enabledWorks.slice(0, 2).map(work => (
                <div key={work.id} className="rounded-xl overflow-hidden transition-all hover:shadow-xl group"
                  style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <WorkCarousel images={work.images} theme={theme} />
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{work.icon}</span>
                      <h3 className="font-semibold text-lg" style={{ color: text }}>{work.name}</h3>
                    </div>
                    <p className="text-sm mb-4" style={{ color: muted }}>{work.desc}</p>
                    <div className="flex items-center justify-between">
                      {work.tags && work.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {work.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded text-xs"
                              style={{ background: isDark ? 'rgba(45,106,79,0.15)' : 'rgba(45,106,79,0.08)', color: accent }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {work.external ? (
                        <a href={work.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
                          style={{ color: work.color || accent }}>
                          前往使用 <ArrowRight size={14} />
                        </a>
                      ) : (
                        <Link to={`/works/${work.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
                          style={{ color: work.color || accent }}>
                          查看详情 <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================== */}
      {/* SECTION 4: 我的日常 — 读书 + 跑步（轻量汇总卡片） */}
      {/* ==================================================== */}
      {(readingConfig.enabled !== false || exerciseConfig.enabled !== false) && (
        <section className="py-20 px-6" style={{ background: bg }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2" style={{ color: text }}>
                我的日常
              </h2>
              <p className="text-sm" style={{ color: muted }}>
                以书为粮，以路为行
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 读书卡片 */}
              {readingConfig.enabled !== false && (
                <Link to="/reading"
                  className="rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg block group"
                  style={{ background: altBg, border: `1px solid ${border}` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">📚</span>
                    <h3 className="font-semibold text-lg" style={{ color: text }}>{readingConfig.title || '阅读'}</h3>
                  </div>

                  {/* 环形进度 */}
                  {readingConfig.overview?.enabled !== false && (
                    <div className="flex items-center gap-6 mb-4">
                      <div className="relative flex-shrink-0 w-20 h-20">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="32" fill="none"
                            stroke={isDark ? '#21262D' : '#E8E5DF'} strokeWidth="6" />
                          <circle cx="40" cy="40" r="32" fill="none"
                            stroke={accent} strokeWidth="6" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            strokeDashoffset={`${2 * Math.PI * 32 * (1 - Math.min(1, (readingConfig.overview.total || 0) / Math.max(1, (readingConfig.overview.target || 24))))}`}
                            transform="rotate(-90 40 40)"
                            style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="font-bold text-lg" style={{ color: text }}>
                            {Math.round(((readingConfig.overview.total || 0) / Math.max(1, (readingConfig.overview.target || 24))) * 100)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                        <div><div className="font-bold" style={{ color: accent }}>{readingConfig.overview.total || 0}</div><div className="text-xs" style={{ color: muted }}>已读</div></div>
                        <div><div className="font-bold" style={{ color: accent }}>{readingConfig.overview.pages || 0}</div><div className="text-xs" style={{ color: muted }}>页数</div></div>
                        <div><div className="font-bold" style={{ color: accent }}>{readingConfig.overview.hours || 0}h</div><div className="text-xs" style={{ color: muted }}>时长</div></div>
                      </div>
                    </div>
                  )}

                  {/* 当前在读 */}
                  {readingConfig.current?.enabled !== false && (
                    <div className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ background: isDark ? 'rgba(45,106,79,0.1)' : 'rgba(45,106,79,0.05)' }}>
                      <span className="text-3xl">{readingConfig.current.cover}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate" style={{ color: text }}>{readingConfig.current.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 rounded-full" style={{ background: isDark ? '#21262D' : '#E8E5DF' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${readingConfig.current.progress || 0}%`, background: accent }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: accent }}>{readingConfig.current.progress || 0}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end mt-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accent }}>
                    查看阅读记录 <ArrowRight size={14} />
                  </div>
                </Link>
              )}

              {/* 跑步卡片 */}
              {exerciseConfig.enabled !== false && (
                <Link to="/exercise"
                  className="rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg block group"
                  style={{ background: altBg, border: `1px solid ${border}` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🏃</span>
                    <h3 className="font-semibold text-lg" style={{ color: text }}>{exerciseConfig.title || '运动'}</h3>
                  </div>

                  {exerciseConfig.stats?.enabled !== false && (
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: '连续打卡', value: `${exerciseConfig.stats.streak || 0}天`, icon: '🔥' },
                        { label: '今年跑量', value: `${(exerciseConfig.stats.yearDistance || 0)}km`, icon: '🏅' },
                        { label: '本周跑量', value: `${(exerciseConfig.stats.weekDistance || 0)}km`, icon: '📊' },
                      ].map((stat, i) => (
                        <div key={i} className="text-center p-3 rounded-lg"
                          style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                          <div className="text-xl mb-1">{stat.icon}</div>
                          <div className="font-bold text-lg" style={{ color: text }}>{stat.value}</div>
                          <div className="text-xs" style={{ color: muted }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {exerciseConfig.motto && (
                    <p className="text-sm italic text-center" style={{ color: muted }}>
                      "{exerciseConfig.motto}"
                    </p>
                  )}

                  <div className="flex items-center justify-end mt-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accent }}>
                    查看跑步记录 <ArrowRight size={14} />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================== */}
      {/* SECTION 5: 联系我 */}
      {/* ==================================================== */}
      {aboutConfig.enabled !== false && (
        <section className="py-20 px-6" style={{ background: altBg }}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: text }}>联系我</h2>
              <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
            </div>
            <p className="text-sm mb-10" style={{ color: muted }}>选择你喜欢的方式，随时找我聊聊</p>

            {/* 二维码 */}
            {(aboutConfig.qrcodes?.wechatOfficial || aboutConfig.qrcodes?.wechat) && (
              <div className="inline-flex flex-wrap items-center justify-center gap-8 mb-10">
                {aboutConfig.qrcodes?.wechatOfficial && (
                  <div className="text-center">
                    <div className="p-3 rounded-xl inline-block mb-2" style={{ background: cardBg, border: `1px solid ${border}` }}>
                      <img src={aboutConfig.qrcodes.wechatOfficial} alt="公众号" className="w-28 h-28 object-contain" />
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ background: accent, color: '#fff' }}>
                      公众号
                    </div>
                  </div>
                )}
                {aboutConfig.qrcodes?.wechat && (
                  <div className="text-center">
                    <div className="p-3 rounded-xl inline-block mb-2" style={{ background: cardBg, border: `1px solid ${border}` }}>
                      <img src={aboutConfig.qrcodes.wechat} alt="微信" className="w-28 h-28 object-contain" />
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ background: accent, color: '#fff' }}>
                      加好友
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 快捷链接 */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {(aboutConfig.quickLinks || []).filter(l => l.url).map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: `1px solid ${border}`, color: text }}>
                  <span>{link.icon === 'feishu' ? '📚' : link.icon === 'twitter' ? '🐦' : link.icon === 'github' ? '🔗' : link.icon === 'location' ? '📍' : '🔗'}</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>

            {/* 社交图标 */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {(aboutConfig.contacts || []).filter(c => c.enabled !== false && c.url).map((c, idx) => (
                <a key={idx} href={c.url} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: `1px solid ${border}`, color: muted }}
                  title={c.name}>
                  <span className="text-lg">{c.icon?.length <= 2 ? c.icon : c.name[0]}</span>
                </a>
              ))}
            </div>

            <p className="text-xs" style={{ color: muted }}>
              {aboutConfig.copyright || `© ${new Date().getFullYear()} ${heroConfig.name || '小福'}. All rights reserved.`}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
