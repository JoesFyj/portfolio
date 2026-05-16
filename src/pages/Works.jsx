import { Link } from 'react-router-dom'
import { 
  ArrowRight, ExternalLink, ChevronLeft, Search, 
  Grid3X3, Zap, PenTool, Settings, Plus, Eye
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { getConfig } from '../config/siteConfig'

// 图标映射
const ICON_MAP = {
  grid: Grid3X3,
  zap: Zap,
  pen: PenTool,
  settings: Settings,
}

function WorkCard({ work, theme }) {
  const isDark = theme === 'dark'
  
  const bg = isDark ? '#161B22' : '#FFFFFF'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'

  return (
    <div 
      className="rounded-2xl overflow-hidden transition-all hover:shadow-xl group"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      {/* 封面图 */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={work.images?.[0] || 'https://placehold.co/600x340/2D6A4F/ffffff?text=No+Image'} 
          alt={work.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* 渐变遮罩 */}
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }}
        />
        
        {/* 图标和名称 */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <span className="text-3xl">{work.icon}</span>
          <span className="text-white font-semibold text-lg">{work.name}</span>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="p-5">
        <p className="text-sm mb-4 leading-relaxed line-clamp-2" style={{ color: muted }}>
          {work.desc}
        </p>
        
        {/* 技术标签 */}
        {work.features && work.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {work.features.slice(0, 4).map((feature, idx) => (
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
            {work.features.length > 4 && (
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  color: muted,
                  border: `1px solid ${border}`,
                }}
              >
                +{work.features.length - 4}
              </span>
            )}
          </div>
        )}
        
        {/* 链接按钮 */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${border}` }}>
          {work.external ? (
            <a 
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md"
              style={{ background: work.color, color: '#fff' }}
            >
              前往使用 <ExternalLink size={14} />
            </a>
          ) : (
            <Link 
              to={`/works/${work.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md"
              style={{ background: work.color, color: '#fff' }}
            >
              查看详情 <Eye size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function Sidebar({ categories, activeCategory, onCategoryChange, searchQuery, onSearchChange, theme }) {
  const isDark = theme === 'dark'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const accent = '#2D6A4F'

  return (
    <div className="w-full lg:w-64 lg:shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
          style={{ background: accent }}
        >
          A
        </div>
        <div>
          <div className="font-bold text-lg" style={{ color: text }}>AI满</div>
          <div className="text-xs" style={{ color: muted }}>PORTFOLIO</div>
        </div>
      </div>

      {/* 搜索 */}
      <div className="mb-8">
        <div className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: muted }}>
          快速搜索
        </div>
        <div 
          className="flex items-center gap-2 px-4 py-3 rounded-xl border"
          style={{ borderColor: border, background: cardBg }}
        >
          <Search size={16} style={{ color: muted }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索项目..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: text }}
          />
        </div>
      </div>

      {/* 分类 */}
      <div className="mb-8">
        <div className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: muted }}>
          项目分类
        </div>
        <div className="space-y-1">
          {categories.filter(c => c.enabled !== false).map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Grid3X3
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isActive ? (isDark ? '#1C1C1E' : '#1C1C1E') : 'transparent',
                  color: isActive ? '#fff' : text,
                }}
              >
                <Icon size={18} />
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CollaborationSection({ config, theme }) {
  const isDark = theme === 'dark'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'

  if (!config?.enabled) return null

  return (
    <div 
      className="rounded-2xl p-6 mt-12"
      style={{ background: cardBg, border: `1px solid ${border}` }}
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'rgba(45,106,79,0.1)' }}
        >
          <div className="w-3 h-3 rounded-full" style={{ background: '#2D6A4F' }} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1" style={{ color: text }}>{config.title}</h3>
          <p className="text-sm mb-4" style={{ color: muted }}>{config.subtitle}</p>
          <Link
            to={config.buttonLink || '/connect'}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-medium border transition-all hover:shadow-md"
            style={{ borderColor: border, color: text }}
          >
            {config.buttonText || '联系我'}
          </Link>
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
  
  const worksConfig = config.works || {}
  const allWorks = (worksConfig.items || []).filter(w => w.enabled !== false)
  const categories = worksConfig.categories || [{ id: 'all', name: '全部作品', icon: 'grid', enabled: true }]
  
  // 状态
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 过滤作品
  const filteredWorks = useMemo(() => {
    return allWorks.filter(work => {
      // 分类过滤
      if (activeCategory !== 'all' && work.category !== activeCategory) {
        return false
      }
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchName = work.name?.toLowerCase().includes(query)
        const matchDesc = work.desc?.toLowerCase().includes(query)
        const matchFeatures = work.features?.some(f => f.toLowerCase().includes(query))
        return matchName || matchDesc || matchFeatures
      }
      return true
    })
  }, [allWorks, activeCategory, searchQuery])

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 返回首页 */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-70"
          style={{ color: muted }}
        >
          <ChevronLeft size={16} /> 返回首页
        </Link>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* 左侧边栏 */}
          <Sidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            theme={theme}
          />

          {/* 右侧内容 */}
          <div className="flex-1 min-w-0">
            {/* 标题区 */}
            <div className="mb-10">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: text }}>
                {worksConfig.title || '作品集'}
              </h1>
              <p className="text-base" style={{ color: muted }}>
                {worksConfig.subtitle || '用 AI 放大个人产出，一个人干出一个小团队的量'}
              </p>
              <div className="mt-4 text-sm" style={{ color: muted }}>
                共 {filteredWorks.length} 个精选项目
              </div>
            </div>

            {/* 作品网格 */}
            {filteredWorks.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔧</div>
                <h2 className="text-xl font-semibold mb-2" style={{ color: text }}>暂无作品</h2>
                <p className="text-sm" style={{ color: muted }}>在后台添加作品后，这里会展示</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredWorks.map(work => (
                  <WorkCard key={work.id} work={work} theme={theme} />
                ))}
              </div>
            )}

            {/* 合作区域 */}
            <CollaborationSection 
              config={worksConfig.collaboration} 
              theme={theme} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
