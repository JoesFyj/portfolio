import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

// 硬编码数据（后续接后台）
const BOOKS_DATA = [
  { id: 1, name: '纳瓦尔宝典', note: '财富与幸福的底层逻辑', progress: 68, status: 'reading', cover: '📚' },
  { id: 2, name: '穷查理宝典', note: '多元思维模型', progress: 100, status: 'finished', cover: '📖' },
  { id: 3, name: '原则', note: '系统化决策', progress: 100, status: 'finished', cover: '📖' },
  { id: 4, name: '黑天鹅', note: '不确定性思维', progress: 100, status: 'finished', cover: '📖' },
  { id: 5, name: '反脆弱', note: '从混乱中获益', progress: 100, status: 'finished', cover: '📖' },
  { id: 6, name: '思考快与慢', note: '双系统决策模型', progress: 100, status: 'finished', cover: '📖' },
  { id: 7, name: '刻意练习', note: '技能习得的科学', progress: 100, status: 'finished', cover: '📖' },
  { id: 8, name: '原子习惯', note: '微小改变巨大成果', progress: 100, status: 'finished', cover: '📖' },
  { id: 9, name: '纳瓦尔宝典', note: '财富与幸福的底层逻辑', progress: 100, status: 'finished', cover: '📖' },
  { id: 10, name: '金钱心理学', note: '财富的心理学视角', progress: 100, status: 'finished', cover: '📖' },
  { id: 11, name: '置身事内', note: '中国经济逻辑', progress: 100, status: 'finished', cover: '📖' },
  { id: 12, name: '乡土中国', note: '中国社会结构', progress: 100, status: 'finished', cover: '📖' },
]

const PAGE_SIZE = 6

export default function Reading({ theme }) {
  const isDark = theme === 'dark'
  const [page, setPage] = useState(1)

  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'

  const totalPages = Math.ceil(BOOKS_DATA.length / PAGE_SIZE)
  const currentBooks = BOOKS_DATA.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
            读书 · 以书为粮
          </h1>
          <p className="text-sm" style={{ color: muted }}>
            今年已读 {BOOKS_DATA.filter(b => b.status === 'finished').length} 本
          </p>
        </div>

        {/* 书籍列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {currentBooks.map(book => (
            <div
              key={book.id}
              className="rounded-xl p-6 transition-all hover:shadow-lg"
              style={{ background: cardBg, border: `1px solid ${border}` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{book.cover}</span>
                <div className="flex-1">
                  <div className="font-semibold mb-1" style={{ color: text }}>{book.name}</div>
                  <div className="text-xs" style={{ color: muted }}>{book.note}</div>
                </div>
              </div>
              
              {/* 进度条 */}
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-2 rounded-full"
                  style={{ background: isDark ? '#21262D' : '#E8E5DF' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${book.progress}%`, 
                      background: book.status === 'reading' ? '#2D6A4F' : '#6366F1' 
                    }}
                  />
                </div>
                <span className="text-xs font-medium" style={{ color: book.status === 'reading' ? '#2D6A4F' : muted }}>
                  {book.progress}%
                </span>
              </div>
              
              {book.status === 'reading' && (
                <div
                  className="mt-3 text-xs px-2 py-1 rounded-full inline-block"
                  style={{ background: 'rgba(45,106,79,0.1)', color: '#2D6A4F' }}
                >
                  当前在读
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50"
              style={{ 
                background: cardBg, 
                border: `1px solid ${border}`,
                color: muted,
              }}
            >
              <ChevronLeft size={16} /> 上一页
            </button>
            <span className="text-sm" style={{ color: muted }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50"
              style={{ 
                background: cardBg, 
                border: `1px solid ${border}`,
                color: muted,
              }}
            >
              下一页 <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
