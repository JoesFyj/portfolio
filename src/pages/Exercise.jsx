import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

// 硬编码数据（后续接后台）
const EXERCISE_DATA = [
  { id: 1, date: '2026-05-08', distance: 5.2, duration: 32, location: '西安·曲江', type: 'run' },
  { id: 2, date: '2026-05-07', distance: 3.1, duration: 20, location: '西安·高新', type: 'run' },
  { id: 3, date: '2026-05-06', distance: 6.8, duration: 42, location: '兰州·城关', type: 'run' },
  { id: 4, date: '2026-05-05', distance: 4.5, duration: 28, location: '兰州·七里河', type: 'run' },
  { id: 5, date: '2026-05-04', distance: 5.0, duration: 30, location: '天水·秦州', type: 'run' },
  { id: 6, date: '2026-05-03', distance: 7.2, duration: 45, location: '西安·未央', type: 'run' },
  { id: 7, date: '2026-05-02', distance: 4.0, duration: 25, location: '西安·雁塔', type: 'run' },
  { id: 8, date: '2026-05-01', distance: 5.5, duration: 35, location: '兰州·安宁', type: 'run' },
  { id: 9, date: '2026-04-30', distance: 3.8, duration: 24, location: '天水·麦积', type: 'run' },
  { id: 10, date: '2026-04-29', distance: 6.0, duration: 38, location: '西安·碑林', type: 'run' },
]

const PAGE_SIZE = 6

export default function Exercise({ theme }) {
  const isDark = theme === 'dark'
  const [page, setPage] = useState(1)

  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'

  const totalPages = Math.ceil(EXERCISE_DATA.length / PAGE_SIZE)
  const currentData = EXERCISE_DATA.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  
  const totalDistance = EXERCISE_DATA.reduce((sum, e) => sum + e.distance, 0)
  const streak = 30 // 连续打卡天数

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
            锻炼 · 以路为行
          </h1>
          <p className="text-sm" style={{ color: muted }}>
            不是自律，是习惯
          </p>
        </div>

        {/* 核心统计 */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: '连续打卡', value: `${streak}天`, icon: '🔥' },
            { label: '总跑量', value: `${totalDistance.toFixed(1)}km`, icon: '🏃' },
            { label: '总次数', value: `${EXERCISE_DATA.length}次`, icon: '📊' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-5 text-center"
              style={{ background: cardBg, border: `1px solid ${border}` }}
            >
              <span className="text-2xl block mb-2">{stat.icon}</span>
              <div className="text-2xl font-bold mb-1" style={{ color: text }}>{stat.value}</div>
              <div className="text-xs" style={{ color: muted }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 跑步轨迹可视化占位 */}
        <div
          className="rounded-xl p-8 text-center mb-10"
          style={{
            background: isDark ? '#161B22' : '#FFFFFF',
            border: `1px solid ${border}`,
          }}
        >
          <div className="text-4xl mb-4">🗺️</div>
          <div className="font-medium mb-2" style={{ color: text }}>跑步轨迹地图</div>
          <div className="text-sm" style={{ color: muted }}>
            从甘肃天水到陕西西安，每一步都是向前的路
          </div>
          <div
            className="mt-4 inline-block px-4 py-2 rounded-lg text-xs"
            style={{ background: isDark ? '#21262D' : '#F4F2EE', color: muted }}
          >
            📍 兰州 → 天水 → 西安（可视化开发中）
          </div>
        </div>

        {/* 记录列表 */}
        <h2 className="font-semibold text-lg mb-4" style={{ color: text }}>跑步记录</h2>
        <div className="space-y-3 mb-10">
          {currentData.map(record => (
            <div
              key={record.id}
              className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md"
              style={{ background: cardBg, border: `1px solid ${border}` }}
            >
              <div className="text-2xl">🏃</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium" style={{ color: text }}>{record.date}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: isDark ? '#21262D' : '#F4F2EE', color: muted }}
                  >
                    {record.location}
                  </span>
                </div>
                <div className="text-xs" style={{ color: muted }}>
                  {record.distance}km · {record.duration}分钟
                </div>
              </div>
              <div className="text-lg font-bold" style={{ color: '#2D6A4F' }}>
                {record.distance}km
              </div>
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
