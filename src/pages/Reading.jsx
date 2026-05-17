import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getConfig } from '../config/siteConfig'


export default function Reading({ theme }) {
  const isDark = theme === 'dark'
  const [page, setPage] = useState(1)


  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const accent = '#2D6A4F'

  // 从配置中心读取数据
  const [config, setConfig] = useState(() => getConfig())
  useEffect(() => {
    const handleUpdate = () => setConfig(getConfig())
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('configUpdated', handleUpdate)
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('configUpdated', handleUpdate)
    }
  }, [])

  const readingConfig = config.reading || {}
  const overview = readingConfig.overview || {}
  const current = readingConfig.current || {}
  const allBooks = (readingConfig.records || []).filter(b => b.enabled !== false)
  const finishedBooks = allBooks.filter(b => b.rating) // 有评分的视为已读完

  const PAGE_SIZE = 6
  const totalPages = Math.ceil(allBooks.length / PAGE_SIZE)
  const currentBooks = allBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const target = overview.target || 24
  const total = overview.total || finishedBooks.length
  const progress = Math.round((total / target) * 100)

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* 返回 */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm mb-10 transition-colors"
          style={{ color: muted }}
        >
          <ArrowLeft size={14} /> 返回首页
        </Link>

        {/* 标题 */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: text }}>
            {readingConfig.title || '读书 · 以书为粮'}
          </h1>
          <p className="text-sm" style={{ color: muted }}>
            {readingConfig.subtitle || '读有所思，思有所得'}
          </p>
        </div>

        {/* 顶部概览 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* 年度进度环 */}
          <div className="rounded-xl p-6" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg" style={{ color: text }}>2026 阅读进度</h3>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: accent }}>{total}</div>
                <div className="text-xs" style={{ color: muted }}>/ {target} 本</div>
              </div>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="58" fill="none" stroke={isDark ? '#21262D' : '#E8E5DF'} strokeWidth="12" />
                  <circle cx="70" cy="70" r="58" fill="none" stroke={accent} strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 58}`}
                    strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold" style={{ color: text }}>{progress}%</div>
                  <div className="text-xs" style={{ color: muted }}>完成</div>
                </div>
              </div>
            </div>
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

          {/* 当前在读 */}
          {current.enabled !== false && current.name && (
            <div className="rounded-xl p-6 flex flex-col justify-center"
              style={{
                background: isDark ? 'rgba(45,106,79,0.1)' : 'rgba(45,106,79,0.05)',
                border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}`,
              }}>
              <div className="text-xs font-medium mb-4" style={{ color: accent }}>当前在读</div>
              <div className="flex items-start gap-4">
                <span className="text-5xl">{current.cover || '📚'}</span>
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-2" style={{ color: text }}>{current.name}</div>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: muted }}>{current.summary}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-2 rounded-full" style={{ background: isDark ? '#21262D' : '#E8E5DF' }}>
                      <div className="h-full rounded-full" style={{ width: `${current.progress || 0}%`, background: accent }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: accent }}>{current.progress || 0}%</span>
                  </div>
                  {current.articleUrl && (
                    <Link to={current.articleUrl} className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: accent }}>
                      阅读笔记 <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 书籍列表 */}
        <h2 className="font-semibold text-lg mb-4" style={{ color: text }}>阅读记录</h2>
        {allBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: text }}>暂无阅读记录</h3>
            <p className="text-sm" style={{ color: muted }}>在后台添加阅读记录后，这里会展示</p>
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {currentBooks.map(book => (
              <div
                key={book.id}
                className="rounded-xl p-5 transition-all hover:shadow-lg group"
                style={{ background: cardBg, border: `1px solid ${border}` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-20 rounded-lg flex items-center justify-center text-3xl"
                      style={{ background: isDark ? '#21262D' : '#F0EFEA' }}>
                      {book.cover || '📖'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="font-semibold text-lg mb-1" style={{ color: text }}>{book.name}</div>
                        <div className="flex items-center gap-3 text-xs" style={{ color: muted }}>
                          {book.readAt && <span>{book.readAt}</span>}
                          {book.pages && <><span>·</span><span>{book.pages} 页</span></>}
                          {book.rating && <><span>·</span><span>{'⭐'.repeat(book.rating)}</span></>}
                        </div>
                      </div>
                      {book.articleUrl && (
                        <Link to={book.articleUrl}
                          className="flex-shrink-0 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: accent }}>
                          查看笔记 <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: muted }}>{book.summary}</p>
                    <div className="flex items-center justify-between">
                      {book.note && (
                        <div className="flex flex-wrap gap-2">
                          {book.note.split('、').map(tag => (
                            <span key={tag} className="px-2 py-1 rounded text-xs"
                              style={{ background: isDark ? 'rgba(45,106,79,0.15)' : 'rgba(45,106,79,0.08)', color: accent }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50"
              style={{ background: cardBg, border: `1px solid ${border}`, color: muted }}
            >
              <ChevronLeft size={16} /> 上一页
            </button>
            <span className="text-sm" style={{ color: muted }}>{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50"
              style={{ background: cardBg, border: `1px solid ${border}`, color: muted }}
            >
              下一页 <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
