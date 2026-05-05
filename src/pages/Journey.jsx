import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Dumbbell, TrendingUp, Mail, MessageCircle, ArrowRight } from 'lucide-react'
import { getReadingBooks, getFitnessRecords, getMilestones, getMediaStats, getSiteConfig } from '../lib/supabase'

const TABS = [
  { key: 'about', label: '关于我', icon: '👋' },
  { key: 'reading', label: '读书', icon: '📖' },
  { key: 'fitness', label: '锻炼', icon: '💪' },
  { key: 'media', label: '自媒体', icon: '📱' },
  { key: 'connect', label: '联系', icon: '📬' },
]

const BOOK_CATEGORIES = ['全部', '财富', '认知', '技术', '文学']

export default function Journey({ theme }) {
  const isDark = theme === 'dark'
  const [activeTab, setActiveTab] = useState('about')
  const [data, setData] = useState({
    reading: [],
    fitness: [],
    milestones: [],
    media: [],
    config: null,
  })
  const [loading, setLoading] = useState(true)

  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#1C1C1E' : '#FFFFFF'
  const accentColor = '#2D6A4F'
  const accentBg = isDark ? 'rgba(45,106,79,0.15)' : '#F0FDF4'

  useEffect(() => {
    loadAllData()
  }, [])

  async function loadAllData() {
    setLoading(true)
    try {
      const [reading, fitness, milestones, media, config] = await Promise.all([
        getReadingBooks(),
        getFitnessRecords(90),
        getMilestones(),
        getMediaStats(),
        getSiteConfig(),
      ])
      setData({ reading, fitness, milestones, media, config })
    } catch (e) {
      console.error('Failed to load journey data:', e)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#0D1117' : '#FAF9F6' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* 头部 */}
        <Link to="/" className="flex items-center gap-2 text-sm mb-6 transition-colors" style={{ color: muted }}>
          <ArrowLeft size={14} /> 返回首页
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2" style={{ color: text }}>
          一个人的远征
        </h1>
        <p className="text-sm mb-8" style={{ color: muted }}>
          从甘肃深山到AI时代的自我实验
        </p>

        {/* Tab 切换 */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-1 px-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab.key ? accentBg : 'transparent',
                color: activeTab === tab.key ? accentColor : muted,
                border: activeTab === tab.key ? `1px solid ${isDark ? 'rgba(45,106,79,0.3)' : 'rgba(45,106,79,0.2)'}` : '1px solid transparent',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 加载 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: accentColor, borderTopColor: 'transparent' }} />
          </div>
        )}

        {/* 内容区 */}
        {!loading && (
          <>
            {activeTab === 'about' && <AboutSection data={data} isDark={isDark} text={text} muted={muted} border={border} cardBg={cardBg} accentColor={accentColor} accentBg={accentBg} />}
            {activeTab === 'reading' && <ReadingSection books={data.reading} isDark={isDark} text={text} muted={muted} border={border} cardBg={cardBg} accentColor={accentColor} accentBg={accentBg} />}
            {activeTab === 'fitness' && <FitnessSection records={data.fitness} isDark={isDark} text={text} muted={muted} border={border} cardBg={cardBg} accentColor={accentColor} accentBg={accentBg} />}
            {activeTab === 'media' && <MediaSection milestones={data.milestones} media={data.media} isDark={isDark} text={text} muted={muted} border={border} cardBg={cardBg} accentColor={accentColor} accentBg={accentBg} />}
            {activeTab === 'connect' && <ConnectSection isDark={isDark} text={text} muted={muted} border={border} cardBg={cardBg} accentColor={accentColor} accentBg={accentBg} />}
          </>
        )}
      </div>
    </div>
  )
}

function AboutSection({ data, isDark, text, muted, border, cardBg, accentColor, accentBg }) {
  const config = data.config || {}
  return (
    <div className="space-y-8">
      {/* 自我介绍 */}
      <div className="rounded-2xl p-8" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: text }}>
          👋 我是小福
        </h2>
        <p className="leading-relaxed mb-4" style={{ color: muted }}>
          甘肃深山走出来的普通人。放牛、捡粪、烧土豆的童年，靠读书走出大山。现在是一个学校的老师，同时在用AI给自己造一条自由的路。
        </p>
        <p className="leading-relaxed mb-4" style={{ color: muted }}>
          不靠时间赚钱，是我的执念。不是懒，是因为见过太多人用一辈子换了微薄的收入，然后发现时间已经没了。
        </p>
        <p className="leading-relaxed" style={{ color: muted }}>
          我相信：吃饱饭，爱对人，睡好觉，别较劲。
        </p>
      </div>

      {/* 三支柱 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-6 text-center" style={{ background: accentBg, border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}` }}>
          <span className="text-3xl mb-3 block">💰</span>
          <h3 className="font-semibold mb-1" style={{ color: accentColor }}>财富逻辑</h3>
          <p className="text-xs" style={{ color: muted }}>普通人如何不靠时间赚钱</p>
        </div>
        <div className="rounded-xl p-6 text-center" style={{ background: isDark ? 'rgba(212,163,115,0.1)' : '#FFFBEB', border: `1px solid ${isDark ? 'rgba(212,163,115,0.2)' : 'rgba(212,163,115,0.1)'}` }}>
          <span className="text-3xl mb-3 block">🧠</span>
          <h3 className="font-semibold mb-1" style={{ color: '#D4A373' }}>成长认知</h3>
          <p className="text-xs" style={{ color: muted }}>从深山到职业自由的思考</p>
        </div>
        <div className="rounded-xl p-6 text-center" style={{ background: isDark ? 'rgba(99,102,241,0.1)' : '#EEF2FF', border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)'}` }}>
          <span className="text-3xl mb-3 block">🤖</span>
          <h3 className="font-semibold mb-1" style={{ color: '#6366F1' }}>AI工具</h3>
          <p className="text-xs" style={{ color: muted }}>用AI放大个人能力的实战</p>
        </div>
      </div>

      {/* 里程碑时间轴 */}
      {data.milestones && data.milestones.length > 0 && (
        <div>
          <h2 className="font-serif text-xl font-bold mb-4" style={{ color: text }}>关键时刻</h2>
          <div className="space-y-4">
            {data.milestones.slice(0, 6).map((ms, i) => (
              <div key={ms.id || i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xl">{ms.icon || '🎯'}</span>
                  {i < data.milestones.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ background: border }} />
                  )}
                </div>
                <div className="pb-6">
                  <div className="text-xs mb-1" style={{ color: muted }}>{ms.date}</div>
                  <h4 className="font-semibold text-sm" style={{ color: text }}>{ms.title}</h4>
                  {ms.description && <p className="text-xs mt-1" style={{ color: muted }}>{ms.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ReadingSection({ books, isDark, text, muted, border, cardBg, accentColor, accentBg }) {
  const [catFilter, setCatFilter] = useState('全部')

  const filtered = catFilter === '全部'
    ? books
    : books.filter(b => b.category === catFilter)

  const reading = books.filter(b => b.status === '在读')
  const finished = books.filter(b => b.status === '已读')
  const goal = 52
  const progress = Math.min(100, Math.round((finished.length / goal) * 100))

  return (
    <div className="space-y-6">
      {/* 年度目标 */}
      <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: text }}>📖 年度读书目标</h3>
          <span className="text-sm font-bold" style={{ color: accentColor }}>{finished.length} / {goal} 本</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: isDark ? '#21262D' : '#F4F2EE' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, #2D6A4F, #40916C)` }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: muted }}>完成 {progress}%</p>
      </div>

      {/* 正在读 */}
      {reading.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3" style={{ color: text }}>正在读</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reading.map((book, i) => (
              <div key={book.id || i} className="flex gap-4 p-4 rounded-xl" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="w-16 h-22 rounded-lg shrink-0 overflow-hidden" style={{ background: isDark ? '#21262D' : '#F4F2EE' }}>
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">📖</div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm truncate" style={{ color: text }}>{book.title}</h4>
                  {book.author && <p className="text-xs mt-0.5" style={{ color: muted }}>{book.author}</p>}
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full" style={{ background: accentBg, color: accentColor }}>
                    {book.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 分类筛选 */}
      <div className="flex gap-2 overflow-x-auto">
        {BOOK_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs transition-all"
            style={{
              background: catFilter === cat ? accentColor : (isDark ? '#21262D' : '#F4F2EE'),
              color: catFilter === cat ? '#FFFFFF' : muted,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 已读书单 */}
      <div className="space-y-3">
        {filtered.filter(b => b.status === '已读').map((book, i) => (
          <div key={book.id || i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="w-12 h-16 rounded-lg shrink-0 overflow-hidden" style={{ background: isDark ? '#21262D' : '#F4F2EE' }}>
              {book.cover ? (
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg opacity-30">📖</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate" style={{ color: text }}>{book.title}</h4>
              <p className="text-xs" style={{ color: muted }}>{book.author}</p>
              {book.short_review && <p className="text-xs mt-1 line-clamp-1" style={{ color: muted }}>「{book.short_review}」</p>}
            </div>
            <div className="shrink-0 flex items-center gap-1">
              {book.rating && Array.from({ length: 5 }, (_, j) => (
                <span key={j} className="text-xs" style={{ color: j < book.rating ? '#F59E0B' : (isDark ? '#30363D' : '#E8E5DF') }}>★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FitnessSection({ records, isDark, text, muted, border, cardBg, accentColor, accentBg }) {
  const totalRuns = records.filter(r => r.type === '跑步').length
  const totalMinutes = records.reduce((sum, r) => sum + (r.duration_min || 0), 0)
  const totalKm = records.reduce((sum, r) => sum + (parseFloat(r.distance_km) || 0), 0).toFixed(1)
  const goal = 200
  const progress = Math.min(100, Math.round((records.length / goal) * 100))

  return (
    <div className="space-y-6">
      {/* 年度目标 */}
      <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: text }}>💪 年度锻炼目标</h3>
          <span className="text-sm font-bold" style={{ color: accentColor }}>{records.length} / {goal} 次</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: isDark ? '#21262D' : '#F4F2EE' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #D4A373, #F59E0B)' }}
          />
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4 text-center" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="text-2xl font-bold" style={{ color: accentColor }}>{totalRuns}</div>
          <div className="text-xs" style={{ color: muted }}>跑步次数</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="text-2xl font-bold" style={{ color: '#D4A373' }}>{totalKm}</div>
          <div className="text-xs" style={{ color: muted }}>总公里数</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="text-2xl font-bold" style={{ color: '#6366F1' }}>{totalMinutes}</div>
          <div className="text-xs" style={{ color: muted }}>总分钟数</div>
        </div>
      </div>

      {/* 运动哲学 */}
      <div className="rounded-xl p-6" style={{ background: accentBg, border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}` }}>
        <p className="text-sm font-medium mb-2" style={{ color: accentColor }}>🏃 运动哲学</p>
        <p className="text-sm leading-relaxed" style={{ color: muted }}>
          身体是革命的本钱。不是要练成什么样子，是要让自己有足够的精力去做想做的事。跑步是最诚实的运动，你跑了多少步，身体不会骗你。
        </p>
      </div>

      {/* 最近记录 */}
      {records.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3" style={{ color: text }}>最近记录</h3>
          <div className="space-y-2">
            {records.slice(0, 10).map((rec, i) => (
              <div key={rec.id || i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{rec.type === '跑步' ? '🏃' : rec.type === '力量' ? '🏋️' : '🚴'}</span>
                  <div>
                    <span className="text-sm font-medium" style={{ color: text }}>{rec.type}</span>
                    <span className="text-xs ml-2" style={{ color: muted }}>{rec.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: muted }}>
                  {rec.duration_min && <span>{rec.duration_min}分钟</span>}
                  {rec.distance_km && <span>{rec.distance_km}km</span>}
                  {rec.calories && <span>{rec.calories}卡</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {records.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl block mb-4">🏃</span>
          <p style={{ color: muted }}>还没有运动记录</p>
          <p className="text-xs mt-1" style={{ color: muted }}>在后台添加你的第一条运动记录</p>
        </div>
      )}
    </div>
  )
}

function MediaSection({ milestones, media, isDark, text, muted, border, cardBg, accentColor, accentBg }) {
  const mediaMilestones = milestones.filter(m => m.category === '自媒体')

  return (
    <div className="space-y-6">
      {/* 平台数据 */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['抖音', '公众号', '小红书', 'Twitter'].map(platform => {
            const latest = media.find(m => m.platform === platform)
            const icon = platform === '抖音' ? '🎬' : platform === '公众号' ? '✍️' : platform === '小红书' ? '📕' : '🐦'
            return (
              <div key={platform} className="rounded-xl p-4 text-center" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <span className="text-2xl block mb-2">{icon}</span>
                <div className="text-xs mb-1" style={{ color: muted }}>{platform}</div>
                <div className="text-lg font-bold" style={{ color: text }}>
                  {latest ? latest.followers?.toLocaleString() : '-'}
                </div>
                <div className="text-xs" style={{ color: muted }}>粉丝</div>
              </div>
            )
          })}
        </div>
      )}

      {/* 品牌定位 */}
      <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <h3 className="font-semibold mb-3" style={{ color: text }}>🎬 小福分享舍</h3>
        <p className="text-sm leading-relaxed mb-3" style={{ color: muted }}>
          山里人的财商课。用普通人的视角聊赚钱、成长和适应这个时代。不教你怎么暴富，只分享真实的思考和踩过的坑。
        </p>
        <div className="flex gap-2">
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: accentBg, color: accentColor }}>财富逻辑 60%</span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: isDark ? 'rgba(212,163,115,0.1)' : '#FFFBEB', color: '#D4A373' }}>成长认知 25%</span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: isDark ? 'rgba(99,102,241,0.1)' : '#EEF2FF', color: '#6366F1' }}>AI工具 15%</span>
        </div>
      </div>

      {/* 自媒体里程碑 */}
      {mediaMilestones.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3" style={{ color: text }}>关键时刻</h3>
          <div className="space-y-3">
            {mediaMilestones.map((ms, i) => (
              <div key={ms.id || i} className="flex gap-4 p-4 rounded-xl" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <span className="text-xl">{ms.icon || '🎯'}</span>
                <div>
                  <div className="text-xs mb-0.5" style={{ color: muted }}>{ms.date}</div>
                  <h4 className="text-sm font-medium" style={{ color: text }}>{ms.title}</h4>
                  {ms.description && <p className="text-xs mt-0.5" style={{ color: muted }}>{ms.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 内容SOP */}
      <div className="rounded-xl p-6" style={{ background: accentBg, border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}` }}>
        <h3 className="font-semibold mb-2" style={{ color: accentColor }}>🤖 AI内容生产线</h3>
        <p className="text-sm leading-relaxed" style={{ color: muted }}>
          7个AI Agent 24小时协作：选题→创作→评审→发布→复盘。不是AI替我写，是AI帮我跑流程，我只管判断和决策。
        </p>
      </div>
    </div>
  )
}

function ConnectSection({ isDark, text, muted, border, cardBg, accentColor, accentBg }) {
  return (
    <div className="space-y-6">
      {/* 邮件订阅 */}
      <div className="rounded-2xl p-8 text-center" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <span className="text-4xl block mb-4">📬</span>
        <h2 className="font-serif text-xl font-bold mb-2" style={{ color: text }}>每周一封，关于赚钱和成长的真实思考</h2>
        <p className="text-sm mb-6" style={{ color: muted }}>随时退订，绝不 spam</p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="你的邮箱"
            className="flex-1 px-4 py-3 rounded-xl text-sm border-none outline-none"
            style={{ background: isDark ? '#21262D' : '#F4F2EE', color: text }}
          />
          <button
            className="px-6 py-3 rounded-xl text-sm font-medium"
            style={{ background: accentColor, color: '#FFFFFF' }}
          >
            订阅
          </button>
        </div>
      </div>

      {/* 社交链接 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: '公众号', desc: '小福AI自由', icon: '✍️', color: '#2D6A4F' },
          { name: '抖音', desc: '小福分享舍', icon: '🎬', color: '#1C1C1E' },
          { name: '小红书', desc: '小福分享舍', icon: '📕', color: '#FE2C55' },
          { name: 'Twitter/X', desc: '@xiaofu_ai', icon: '🐦', color: '#1DA1F2' },
        ].map(social => (
          <div key={social.name} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <span className="text-2xl">{social.icon}</span>
            <div>
              <h4 className="font-semibold text-sm" style={{ color: text }}>{social.name}</h4>
              <p className="text-xs" style={{ color: muted }}>{social.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 合作咨询 */}
      <div className="rounded-2xl p-6" style={{ background: accentBg, border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}` }}>
        <h3 className="font-semibold mb-2" style={{ color: accentColor }}>🤝 有合作想法？</h3>
        <p className="text-sm mb-4" style={{ color: muted }}>AI产品开发、内容共创、知识付费、出海合作...</p>
        <a
          href="mailto:hello@xiaofu.dev"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: accentColor, color: '#FFFFFF' }}
        >
          <Mail size={14} /> 联系我
        </a>
      </div>
    </div>
  )
}
