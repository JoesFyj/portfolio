import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, ExternalLink, GitBranch, FileText, Sparkles, Grid3X3, List } from 'lucide-react'
import { getProjects, getProjectCategories } from '../lib/supabase'

const STATUS_MAP = {
  live: { label: '已上线', color: '#22c55e', bg: '#f0fdf4' },
  beta: { label: '测试中', color: '#f59e0b', bg: '#fffbeb' },
  wip: { label: '开发中', color: '#6366f1', bg: '#eef2ff' },
  archived: { label: '已归档', color: '#9ca3af', bg: '#f3f4f6' },
}

export default function Works({ theme }) {
  const isDark = theme === 'dark'
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState(['全部'])
  const [activeCategory, setActiveCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)

  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#1C1C1E' : '#FFFFFF'
  const sidebarBg = isDark ? '#161B22' : '#F8F7F4'
  const activeBg = isDark ? 'rgba(45,106,79,0.2)' : '#FEF3C7'
  const activeColor = isDark ? '#58A6FF' : '#2D6A4F'

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [projs, cats] = await Promise.all([
        getProjects(),
        getProjectCategories(),
      ])
      setProjects(projs || [])
      setCategories(cats.length > 1 ? cats : ['全部', ...new Set((projs || []).map(p => p.category))])
    } catch (e) {
      console.error('Failed to load projects:', e)
    }
    setLoading(false)
  }

  const filtered = projects.filter(p => {
    if (activeCategory !== '全部' && p.category !== activeCategory) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return p.name.toLowerCase().includes(q)
        || p.description.toLowerCase().includes(q)
        || (p.tags || []).some(t => t.toLowerCase().includes(q))
    }
    return true
  })

  const featuredCount = projects.filter(p => p.featured).length

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#0D1117' : '#FAF9F6' }}>
      <div className="max-w-[1400px] mx-auto flex">
        
        {/* ===== 左侧边栏 ===== */}
        <aside
          className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
          style={{
            background: sidebarBg,
            borderRight: `1px solid ${border}`,
            padding: '2rem 1.5rem',
          }}
        >
          {/* 返回首页 */}
          <Link
            to="/"
            className="flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: muted }}
          >
            <ArrowLeft size={14} />
            返回首页
          </Link>

          {/* 搜索框 */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg mb-6"
            style={{ background: isDark ? '#21262D' : '#FFFFFF', border: `1px solid ${border}` }}
          >
            <Search size={14} style={{ color: muted }} />
            <input
              type="text"
              placeholder="搜索项目..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm flex-1"
              style={{ color: text }}
            />
          </div>

          {/* 分类筛选 */}
          <div className="space-y-1 mb-8">
            {categories.map(cat => {
              const isActive = activeCategory === cat
              const count = cat === '全部'
                ? projects.length
                : projects.filter(p => p.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between"
                  style={{
                    background: isActive ? activeBg : 'transparent',
                    color: isActive ? activeColor : muted,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <span>{cat}</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      background: isActive ? activeBg : (isDark ? '#21262D' : '#F0EDEA'),
                      color: isActive ? activeColor : muted,
                    }}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 合作卡片 */}
          <div
            className="rounded-xl p-4"
            style={{
              background: isDark ? 'rgba(45,106,79,0.1)' : 'rgba(45,106,79,0.05)',
              border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} style={{ color: '#2D6A4F' }} />
              <span className="text-sm font-semibold" style={{ color: '#2D6A4F' }}>开放合作中</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: muted }}>
              AI产品开发与出海合作<br />内容共创与知识付费
            </p>
            <Link
              to="/connect"
              className="inline-block mt-3 text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: '#2D6A4F', color: '#FFFFFF' }}
            >
              联系我 →
            </Link>
          </div>
        </aside>

        {/* ===== 主内容区 ===== */}
        <main className="flex-1 p-6 lg:p-10">
          {/* 页面头部 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {/* 移动端返回按钮 */}
              <Link
                to="/"
                className="lg:hidden flex items-center gap-2 text-sm"
                style={{ color: muted }}
              >
                <ArrowLeft size={14} />
                首页
              </Link>
              
              {/* 视图切换 */}
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: viewMode === 'grid' ? activeBg : 'transparent',
                    color: viewMode === 'grid' ? activeColor : muted,
                  }}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: viewMode === 'list' ? activeBg : 'transparent',
                    color: viewMode === 'list' ? activeColor : muted,
                  }}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2" style={{ color: text }}>
              作品集
            </h1>
            <p className="text-sm tracking-wider uppercase" style={{ color: muted }}>
              Curating {featuredCount > 0 ? featuredCount : filtered.length} Selected Projects
            </p>
          </div>

          {/* 移动端分类横向滚动 */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-6 -mx-2 px-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
                style={{
                  background: activeCategory === cat ? activeColor : (isDark ? '#21262D' : '#F0EDEA'),
                  color: activeCategory === cat ? '#FFFFFF' : muted,
                  fontWeight: activeCategory === cat ? 600 : 400,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: activeColor, borderTopColor: 'transparent' }} />
            </div>
          )}

          {/* 网格视图 */}
          {!loading && viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(project => (
                <ProjectCard key={project.id} project={project} isDark={isDark} cardBg={cardBg} border={border} text={text} muted={muted} activeColor={activeColor} />
              ))}
            </div>
          )}

          {/* 列表视图 */}
          {!loading && viewMode === 'list' && (
            <div className="space-y-3">
              {filtered.map(project => (
                <ProjectListItem key={project.id} project={project} isDark={isDark} cardBg={cardBg} border={border} text={text} muted={muted} activeColor={activeColor} />
              ))}
            </div>
          )}

          {/* 空状态 */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="text-4xl mb-4">🚧</span>
              <p className="text-lg font-medium" style={{ color: text }}>正在开发中...</p>
              <p className="text-sm mt-1" style={{ color: muted }}>更多作品即将上线</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function ProjectCard({ project, isDark, cardBg, border, text, muted, activeColor }) {
  const status = STATUS_MAP[project.status] || STATUS_MAP.wip

  return (
    <div
      className="group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
      }}
    >
      {/* 封面 */}
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{ background: isDark ? '#21262D' : '#F4F2EE' }}
      >
        {project.cover ? (
          <img
            src={project.cover}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-30">
              {project.category === 'AI工具' ? '🤖' : project.category === '自媒体运营' ? '📊' : '📦'}
            </span>
          </div>
        )}
        {/* 状态标签 */}
        <span
          className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: status.bg, color: status.color }}
        >
          {status.label}
        </span>
        {/* 精选标记 */}
        {project.featured && (
          <span
            className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full"
            style={{ background: 'rgba(45,106,79,0.9)', color: '#FFFFFF' }}
          >
            ⭐ 精选
          </span>
        )}
      </div>

      {/* 内容 */}
      <div className="p-5">
        <h3 className="font-semibold text-base mb-2 group-hover:text-[#2D6A4F] transition-colors" style={{ color: text }}>
          {project.name}
        </h3>
        <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: muted }}>
          {project.description}
        </p>
        
        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(project.tags || []).map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: isDark ? '#21262D' : '#F4F2EE',
                color: muted,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 链接 */}
        <div className="flex items-center gap-3">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: activeColor }}
            >
              <ExternalLink size={12} /> 演示
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: muted }}
            >
              <GitBranch size={12} /> 源码
            </a>
          )}
          {project.article_url && (
            <a
              href={project.article_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: muted }}
            >
              <FileText size={12} /> 文章
            </a>
          )}
          {project.video_url && (
            <a
              href={project.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: muted }}
            >
              <Video size={12} /> 视频
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectListItem({ project, isDark, cardBg, border, text, muted, activeColor }) {
  const status = STATUS_MAP[project.status] || STATUS_MAP.wip

  return (
    <div
      className="flex items-center gap-5 p-4 rounded-xl transition-all hover:shadow-md"
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
      }}
    >
      {/* 缩略图 */}
      <div
        className="w-20 h-14 rounded-lg overflow-hidden shrink-0"
        style={{ background: isDark ? '#21262D' : '#F4F2EE' }}
      >
        {project.cover ? (
          <img src={project.cover} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl opacity-30">
            {project.category === 'AI工具' ? '🤖' : project.category === '自媒体运营' ? '📊' : '📦'}
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate" style={{ color: text }}>{project.name}</h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full shrink-0"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>
        </div>
        <p className="text-xs truncate" style={{ color: muted }}>{project.description}</p>
      </div>

      {/* 分类 + 链接 */}
      <div className="hidden md:flex items-center gap-4 shrink-0">
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: isDark ? '#21262D' : '#F4F2EE', color: muted }}>
          {project.category}
        </span>
        {project.demo_url && (
          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" style={{ color: activeColor }}>
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  )
}
