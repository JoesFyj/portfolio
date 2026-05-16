import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getConfig, saveConfig } from '../config/siteConfig'
import ChinaMapTrajectory from '../components/ChinaMapTrajectory'
import AIWriter from '../components/AIWriter'

export default function Exercise({ theme }) {
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

  const exerciseConfig = config.exercise || {}
  const stats = exerciseConfig.stats || {}
  const trajectory = exerciseConfig.trajectory || {}
  const allRecords = (exerciseConfig.records || []).filter(r => r.enabled !== false)

  const PAGE_SIZE = 6
  const totalPages = Math.ceil(allRecords.length / PAGE_SIZE)
  const currentData = allRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalDistance = allRecords.reduce((sum, e) => sum + (e.distance || 0), 0)
  const [aiWriting, setAiWriting] = useState(null)

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
            {exerciseConfig.title || '锻炼 · 以路为行'}
          </h1>
          <p className="text-sm" style={{ color: muted }}>
            {exerciseConfig.motto || '不是自律，是习惯'}
          </p>
        </div>

        {/* 核心统计 */}
        {stats.enabled !== false && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: '连续打卡', value: `${stats.streak || 0}天`, icon: '🔥' },
              { label: '今年跑量', value: `${stats.yearDistance || 0}km`, icon: '🏃' },
              { label: '本周跑量', value: `${stats.weekDistance || 0}km`, icon: '📊' },
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
        )}

        {/* 跑步轨迹地图 */}
        {trajectory.enabled !== false && (
          <div
            className="rounded-xl overflow-hidden mb-10"
            style={{
              background: cardBg,
              border: `1px solid ${border}`,
            }}
          >
            <ChinaMapTrajectory theme={theme} />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} style={{ color: accent }} />
                <span className="font-medium" style={{ color: text }}>
                  {trajectory.title || '跑步轨迹全貌'}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: muted }}>
                {trajectory.description || '每一步都是向前的路，每一公里都是自由的积累。'}
              </p>
              {trajectory.subtitle && (
                <div className="mt-3 inline-block px-3 py-1.5 rounded-lg text-xs"
                  style={{ background: isDark ? '#21262D' : '#F4F2EE', color: muted }}>
                  {trajectory.subtitle}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 跑步记录 */}
        <h2 className="font-semibold text-lg mb-4" style={{ color: text }}>跑步记录</h2>
        {allRecords.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏃</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: text }}>暂无跑步记录</h3>
            <p className="text-sm" style={{ color: muted }}>在后台添加跑步记录后，这里会展示</p>
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {currentData.map(record => (
              <div
                key={record.id}
                className="flex items-stretch rounded-xl overflow-hidden transition-all hover:shadow-lg group"
                style={{ background: cardBg, border: `1px solid ${border}` }}
              >
                {/* 左侧图片 */}
                {record.image && (
                  <div className="w-32 md:w-40 flex-shrink-0">
                    <img src={record.image} alt={`跑步 ${record.date}`} className="w-full h-full object-cover" />
                  </div>
                )}
                {/* 右侧内容 */}
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs" style={{ color: muted }}>{record.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: isDark ? '#21262D' : '#F4F2EE', color: muted }}>
                      📍 {record.distance}km
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: text }}>{record.note}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: muted }}>
                      {record.duration} · 配速 {record.pace}
                    </span>
                    <div className="flex items-center gap-2">
                      {record.articleUrl && (
                        <Link to={record.articleUrl}
                          className="text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: accent }}>
                          查看记录 <ChevronRight size={12} />
                        </Link>
                      )}
                      <button
                        onClick={() => setAiWriting(aiWriting === record.id ? null : record.id)}
                        className="text-xs px-3 py-1 rounded-lg border transition-all"
                        style={{ borderColor, color: accent, background: aiWriting === record.id ? (isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)') : 'transparent' }}
                      >
                        {aiWriting === record.id ? '✍️ 写作中...' : '✍️ AI 写作'}
                      </button>
                    </div>
                  </div>
                  {aiWriting === record.id && (
                    <AIWriter
                      type="exercise"
                      record={record}
                      onSave={({ topic, outline, article }) => {
                        const newConfig = getConfig()
                        const rec = newConfig.exercise.records.find(r => r.id === record.id)
                        if (rec) {
                          rec.articleTopic = topic
                          rec.articleOutline = outline
                          rec.articleContent = article
                          rec.articleUpdatedAt = new Date().toISOString()
                          saveConfig(newConfig)
                          setConfig(getConfig())
                        }
                        setAiWriting(null)
                      }}
                    />
                  )}
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
