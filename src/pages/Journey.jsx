import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, Image as ImageIcon, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { getJourneyRecords } from '../lib/journeyApi'

const TABS = [
  { key: 'exercise', label: '跑步', icon: '🏃', color: '#D97706' },
  { key: 'reading', label: '读书', icon: '📖', color: '#059669' },
  { key: 'social', label: '自媒体', icon: '📱', color: '#7C3AED' },
]

const PAGE_SIZE = 5

export default function Journey({ theme }) {
  const isDark = theme === 'dark'
  const [activeTab, setActiveTab] = useState('exercise')
  const [records, setRecords] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const bg = isDark ? '#0D1117' : '#FAF9F6'

  const currentTab = TABS.find(t => t.key === activeTab)

  const loadRecords = useCallback(async (tab, pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)

    const result = await getJourneyRecords(tab, pageNum, PAGE_SIZE)
    const newRecords = result.records || []

    setRecords(prev => append ? [...prev, ...newRecords] : newRecords)
    setTotal(result.total || 0)
    setPage(pageNum)
    setLoading(false)
    setLoadingMore(false)
  }, [])

  useEffect(() => {
    loadRecords(activeTab, 1)
  }, [activeTab])

  function handleLoadMore() {
    loadRecords(activeTab, page + 1, true)
  }

  const hasMore = records.length < total

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-16">
        {/* 头部 */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
          style={{ color: muted }}
        >
          <ArrowLeft size={13} /> 返回首页
        </Link>

        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: text }}>
          心路历程
        </h1>
        <p className="text-sm mb-8" style={{ color: muted }}>
          每一次真实的记录，都是活着的证明
        </p>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-10">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.key
                  ? `${tab.color}18`
                  : cardBg,
                color: activeTab === tab.key ? tab.color : muted,
                border: `1px solid ${activeTab === tab.key ? tab.color + '40' : border}`,
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: currentTab.color, borderTopColor: 'transparent' }}
            />
          </div>
        )}

        {!loading && records.length === 0 && (
          <EmptyState module={activeTab} tab={currentTab} isDark={isDark} text={text} muted={muted} border={border} cardBg={cardBg} />
        )}

        {!loading && records.length > 0 && (
          <>
            {activeTab === 'exercise' && (
              <ExerciseList records={records} isDark={isDark} text={text} muted={muted} border={border} cardBg={cardBg} accentColor={currentTab.color} />
            )}
            {activeTab === 'reading' && (
              <ReadingList records={records} isDark={isDark} text={text} muted={muted} border={border} cardBg={cardBg} accentColor={currentTab.color} />
            )}
            {activeTab === 'social' && (
              <SocialList records={records} isDark={isDark} text={text} muted={muted} border={border} cardBg={cardBg} accentColor={currentTab.color} />
            )}

            {/* 加载更多 */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
                  style={{
                    background: cardBg,
                    border: `1px solid ${border}`,
                    color: muted,
                  }}
                >
                  {loadingMore ? (
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: currentTab.color, borderTopColor: 'transparent' }} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  加载更多
                </button>
              </div>
            )}

            {!hasMore && records.length > 0 && (
              <p className="text-center text-xs mt-8" style={{ color: muted }}>
                已展示全部 {records.length} 条记录
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState({ module, tab, isDark, text, muted, border, cardBg }) {
  return (
    <div
      className="rounded-2xl p-12 text-center"
      style={{ background: cardBg, border: `1px solid ${border}` }}
    >
      <span className="text-4xl block mb-4 opacity-40">{tab.icon}</span>
      <h3 className="font-semibold mb-2" style={{ color: text }}>还没有{tab.label}记录</h3>
      <p className="text-sm" style={{ color: muted }}>在后台管理添加你的第一条记录</p>
    </div>
  )
}

// ========== 图片轮播组件 ==========

function ImageCarousel({ images, height = '280px', accentColor }) {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)
  const timerRef = useRef(null)

  const imgs = images || []

  // 自动播放
  useEffect(() => {
    if (imgs.length <= 1 || !playing) return
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % imgs.length)
    }, 3000)
    return () => clearInterval(timerRef.current)
  }, [imgs.length, playing])

  function goPrev() {
    setPlaying(false)
    setCurrent(prev => (prev - 1 + imgs.length) % imgs.length)
  }
  function goNext() {
    setPlaying(false)
    setCurrent(prev => (prev + 1) % imgs.length)
  }

  if (imgs.length === 0) {
    return (
      <div className="rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ width: '280px', minWidth: '240px', height, background: isDark ? '#21262D' : '#F4F2EE', border: `1px dashed ${border}` }}>
        <ImageIcon size={28} style={{ color: muted, opacity: 0.25 }} />
      </div>
    )
  }

  return (
    <div
      className="rounded-xl overflow-hidden shrink-0 relative group"
      style={{ width: '280px', minWidth: '240px', height, background: '#000' }}
    >
      {/* 图片 */}
      <img
        src={imgs[current]}
        alt={`照片${current + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: 1 }}
      />

      {/* 左右箭头 */}
      {imgs.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
            style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
            style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}
          >
            <ChevronRight size={14} />
          </button>

          {/* 底部指示器 */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
            {imgs.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: i === current ? '14px' : '5px',
                  height: '5px',
                  background: i === current ? accentColor || '#fff' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>

          {/* 播放/暂停按钮 */}
          <button
            onClick={() => setPlaying(p => !p)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
            style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}
          >
            {playing ? <Pause size={11} /> : <Play size={11} />}
          </button>
        </>
      )}
    </div>
  )
}

// ========== 跑步模块：左文右图卡片流（参考用户截图风格）==========

function ExerciseList({ records, isDark, text, muted, border, cardBg, accentColor }) {
  return (
    <div className="space-y-6">
      {records.map((rec, i) => (
        <ExerciseCard
          key={rec.id || i}
          record={rec}
          isDark={isDark} text={text} muted={muted} border={border} cardBg={cardBg} accentColor={accentColor}
        />
      ))}
    </div>
  )
}

function ExerciseCard({ record, isDark, text, muted, border, cardBg, accentColor }) {
  const [expanded, setExpanded] = useState(false)

  const images = record.cover_images || []
  const content = record.content || ''
  const maxLen = 120
  const needsExpand = content.length > maxLen

  return (
    <article
      className="rounded-2xl overflow-hidden flex flex-col sm:flex-row"
      style={{ background: cardBg, border: `1px solid ${border}` }}
    >
      {/* 左侧：文字区 */}
      <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
        <div>
          <h2 className="font-serif text-lg font-bold mb-3 leading-snug" style={{ color: text }}>
            {record.title}
          </h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: muted }}>
            {needsExpand && !expanded ? content.slice(0, maxLen).trim() + '...' : content}
          </p>
          {needsExpand && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="inline-flex items-center gap-1 mt-2 text-xs font-medium transition-colors"
              style={{ color: accentColor }}
            >
              {expanded ? '收起' : '展开全文'}
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        {/* 底部：关键词 + 日期 */}
        <div className="flex items-center gap-3 mt-4 pt-3 flex-wrap" style={{ borderTop: `1px solid ${border}` }}>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: `${accentColor}15`, color: accentColor }}
          >
            🏃 跑步
          </span>
          <span className="text-xs" style={{ color: muted }}>{formatDate(record.record_date)}</span>
        </div>
      </div>

      {/* 右侧：图片轮播 */}
      <div className="sm:w-[280px] p-4 pl-0 sm:pl-4 sm:pt-6 flex items-start justify-end">
        <ImageCarousel images={images} height="220px" accentColor={accentColor} />
      </div>
    </article>
  )
}

// ========== 读书模块：杂志风大卡（上图下文）+ 翻页切换 ==========

function ReadingList({ records, isDark, text, muted, border, cardBg, accentColor }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const rec = records[currentIndex]

  function goPrev() {
    setCurrentIndex(i => (i - 1 + records.length) % records.length)
  }
  function goNext() {
    setCurrentIndex(i => (i + 1) % records.length)
  }

  if (!rec) return null

  const images = rec.cover_images || []
  const content = rec.content || ''
  const maxLen = 200

  return (
    <div>
      {/* 主卡片 */}
      <article
        className="rounded-2xl overflow-hidden"
        style={{ background: cardBg, border: `1px solid ${border}` }}
      >
        {/* 封面图（大图）+ 轮播 */}
        <div className="relative h-64 sm:h-72">
          {images.length > 0 ? (
            <>
              <img
                src={images[0]}
                alt={rec.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)' }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `${accentColor}10` }}>
              <span className="text-5xl opacity-20">📖</span>
            </div>
          )}
        </div>

        {/* 文字内容 */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: `${accentColor}15`, color: accentColor }}
            >
              📖 读书
            </span>
            <span className="text-xs" style={{ color: muted }}>{formatDate(rec.record_date)}</span>
          </div>

          <h2 className="font-serif text-xl font-bold mb-3" style={{ color: text }}>
            {rec.title}
          </h2>

          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: muted }}>
            {content.length > maxLen ? content.slice(0, maxLen).trim() + '...' : content}
          </p>

          {content.length > maxLen && (
            <button
              className="inline-flex items-center gap-1 mt-2 text-xs font-medium"
              style={{ color: accentColor }}
            >
              阅读完整笔记 <ChevronRight size={12} />
            </button>
          )}
        </div>
      </article>

      {/* 书籍切换导航（多本书时显示） */}
      {records.length > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <button
            onClick={goPrev}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: cardBg, border: `1px solid ${border}`, color: muted }}
          >
            <ChevronLeft size={15} />
          </button>

          {/* 缩略指示器 */}
          <div className="flex gap-2">
            {records.map((r, i) => (
              <button
                key={r.id || i}
                onClick={() => setCurrentIndex(i)}
                className="w-10 h-10 rounded-lg overflow-hidden transition-all"
                style={{
                  border: i === currentIndex ? `2px solid ${accentColor}` : `1.5px solid ${border}`,
                  opacity: i === currentIndex ? 1 : 0.55,
                }}
              >
                {(r.cover_images || [])[0] ? (
                  <img src={(r.cover_images || [])[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs" style={{ background: inputBg, color: muted }}>📖</div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={goNext}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: cardBg, border: `1px solid ${border}`, color: muted }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  )
}

// ========== 自媒体模块：时间轴 + 年份分组 ==========

function SocialList({ records, isDark, text, muted, border, cardBg, accentColor }) {
  const years = groupByYear(records)

  return (
    <div className="space-y-10">
      {Object.entries(years).sort(([a], [b]) => b - a).map(([year, recs]) => (
        <div key={year}>
          {/* 年份标签 */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-serif text-2xl font-bold" style={{ color: text }}>{year}</span>
            <div className="flex-1 h-px" style={{ background: border }} />
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${accentColor}15`, color: accentColor }}>
              {recs.length} 条
            </span>
          </div>

          {/* 时间轴 */}
          <div className="relative pl-6">
            <div
              className="absolute left-2 top-0 bottom-0 w-px"
              style={{ background: `linear-gradient(to bottom, ${accentColor}60, ${accentColor}20)` }}
            />

            <div className="space-y-4">
              {recs.sort((a, b) => new Date(b.record_date) - new Date(a.record_date)).map((rec, i) => {
                const monthDay = formatMonthDay(rec.record_date)
                return (
                  <div key={rec.id || i} className="relative">
                    <div
                      className="absolute -left-4 top-2.5 w-3 h-3 rounded-full border-2"
                      style={{ background: accentColor, borderColor: cardBg, boxShadow: `0 0 0 3px ${accentColor}25` }}
                    />

                    <article
                      className="rounded-xl p-5 ml-2 hover:shadow-md transition-shadow"
                      style={{ background: cardBg, border: `1px solid ${border}` }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-medium shrink-0 mt-0.5" style={{ color: accentColor }}>
                          {monthDay}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h2 className="font-semibold text-sm mb-1.5" style={{ color: text }}>
                            {rec.title}
                          </h2>
                          <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: muted }}>
                            {truncate(rec.content, 140)}
                          </p>
                          {(rec.cover_images || []).length > 0 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                              {rec.cover_images.slice(0, 4).map((img, j) => (
                                <img
                                  key={j}
                                  src={img}
                                  alt=""
                                  className="w-16 h-12 rounded-lg object-cover shrink-0"
                                />
                              ))}
                              {rec.cover_images.length > 4 && (
                                <span className="w-16 h-12 rounded-lg flex items-center justify-center text-xs shrink-0" style={{ background: inputBg, color: muted }}>
                                  +{rec.cover_images.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ========== 工具函数 ==========

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

function formatMonthDay(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}.${d.getDate()}`
}

function truncate(str, max) {
  if (!str || str.length <= max) return str
  return str.slice(0, max).trim() + '...'
}

function groupByYear(records) {
  const groups = {}
  records.forEach(rec => {
    const year = rec.record_date ? new Date(rec.record_date).getFullYear() : '未知'
    if (!groups[year]) groups[year] = []
    groups[year].push(rec)
  })
  return groups
}
