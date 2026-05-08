import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Activity, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

// 硬编码数据（后续接后台）
const SOCIAL_DATA = [
  { name: '抖音', icon: '📱', fans: '1200', works: '45', color: '#000000' },
  { name: '视频号', icon: '🎬', fans: '800', works: '32', color: '#07C160' },
  { name: '快手', icon: '🎯', fans: '600', works: '28', color: '#FF4906' },
  { name: '公众号', icon: '📝', fans: '350', works: '15', color: '#2D6A4F' },
]

// Hero 区作品轮播展示（右侧大图）
function HeroWorksShowcase({ theme }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isDark = theme === 'dark'
  
  // 所有作品的图片合并轮播
  const allImages = WORKS_DATA.flatMap(work => 
    work.images.map(img => ({ ...work, image: img }))
  )
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [allImages.length])

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
      {/* 图片区域 */}
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
        
        {/* 渐变遮罩 */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
          }}
        />
        
        {/* 作品信息 */}
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
      
      {/* 指示器 */}
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

// 作品轮播图组件
function WorkCarousel({ images, theme }) {
  const [current, setCurrent] = useState(0)
  const isDark = theme === 'dark'
  
  const next = () => setCurrent((c) => (c + 1) % images.length)
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length)

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 group">
      <img
        src={images[current]}
        alt={`截图 ${current + 1}`}
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev() }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); next() }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i) }}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === current ? '#fff' : 'rgba(255,255,255,0.5)' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const WORKS_DATA = [
  {
    id: 1,
    name: '多Agent内容创作运营系统',
    desc: '7个AI Agent 24小时自动化运营，选题→文案→发布→复盘全链路',
    icon: '🤖',
    color: '#6366F1',
    url: '/works',
    images: [
      'https://placehold.co/600x340/6366F1/ffffff?text=Agent+Dashboard',
      'https://placehold.co/600x340/4F46E5/ffffff?text=Content+Flow',
      'https://placehold.co/600x340/4338CA/ffffff?text=Analytics',
    ],
  },
  {
    id: 2,
    name: 'VideoGenerator V2',
    desc: '动画视频自动生成引擎，5套风格预设，一键生成抖音口播视频',
    icon: '🎬',
    color: '#2D6A4F',
    url: 'https://40cb5522c78940d6856379baab1876af.prod.enter.pro/',
    external: true,
    images: [
      'https://placehold.co/600x340/2D6A4F/ffffff?text=Video+Editor',
      'https://placehold.co/600x340/1B4332/ffffff?text=Style+Presets',
      'https://placehold.co/600x340/40916C/ffffff?text=Export+Panel',
    ],
  },
]

const BOOKS_DATA = {
  current: { name: '纳瓦尔宝典', progress: 68, cover: '📚' },
  finished: [
    { name: '穷查理宝典', note: '多元思维模型', cover: '📖' },
    { name: '原则', note: '系统化决策', cover: '📖' },
    { name: '黑天鹅', note: '不确定性思维', cover: '📖' },
  ],
  total: 12,
}

const EXERCISE_DATA = {
  streak: 30,
  yearDistance: 200,
  weekDistance: 15,
  motto: '不是自律，是习惯',
}

export default function HomeNew({ theme }) {
  const isDark = theme === 'dark'

  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      
      {/* ===== Hero - 左右布局 ===== */}
      <section className="flex items-center" style={{ minHeight: '90dvh', paddingTop: '4rem' }}>
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* 左侧：头像 + 介绍 */}
            <div>
              {/* 标签 */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: isDark ? 'rgba(45,106,79,0.15)' : 'rgba(45,106,79,0.08)',
                  border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}`,
                }}
              >
                <span className="text-sm font-medium" style={{ color: '#2D6A4F' }}>
                  从甘肃深山到职业自由的普通人
                </span>
              </div>

              {/* 头像 */}
              <div className="mb-6">
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-4xl"
                  style={{
                    background: isDark ? '#21262D' : '#F0EFEA',
                    border: `3px solid ${isDark ? '#30363D' : '#E8E5DF'}`,
                  }}
                >
                  🧑‍💻
                </div>
              </div>

              {/* 主标题 */}
              <h1
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
                style={{ color: text }}
              >
                你好，我是小福
              </h1>

              {/* 一句话介绍 */}
              <p
                className="text-base md:text-lg mb-6 max-w-lg leading-relaxed"
                style={{ color: muted }}
              >
                一个人 + 7个AI Agent = 24小时帮你干活
                <br />
                <span style={{ color: '#2D6A4F' }}>少工作，多赚钱，以书为粮，以路为行</span>
              </p>

              {/* 三个入口 */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/works"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg"
                  style={{ background: '#2D6A4F', color: '#FFFFFF' }}
                >
                  <Zap size={16} /> 自媒体+AI实验
                </Link>
                <a
                  href="#reading"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all"
                  style={{ borderColor: border, color: muted }}
                >
                  <BookOpen size={16} /> 读书
                </a>
                <a
                  href="#exercise"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all"
                  style={{ borderColor: border, color: muted }}
                >
                  <Activity size={16} /> 锻炼
                </a>
              </div>
            </div>

            {/* 右侧：作品轮播展示 */}
            <div className="hidden lg:block">
              <HeroWorksShowcase theme={theme} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 自媒体+AI实验 ===== */}
      <section className="py-20 px-6" style={{ background: isDark ? '#161B22' : '#F8F7F4' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: text }}>
            自媒体+AI实验
          </h2>
          <p className="text-sm mb-10" style={{ color: muted }}>
            少工作多赚钱的路径：用AI放大个人产出，一个人干出一个小团队的量
          </p>

          {/* 平台数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {SOCIAL_DATA.map(platform => (
              <div
                key={platform.name}
                className="rounded-xl p-5 transition-all hover:shadow-md"
                style={{ background: cardBg, border: `1px solid ${border}` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="font-medium" style={{ color: text }}>{platform.name}</span>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: platform.color }}>
                  {platform.fans}
                </div>
                <div className="text-xs" style={{ color: muted }}>
                  粉丝 · {platform.works} 作品
                </div>
              </div>
            ))}
          </div>

          {/* 作品集预览 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg" style={{ color: text }}>作品</h3>
            <Link
              to="/works"
              className="text-sm font-medium flex items-center gap-1"
              style={{ color: '#2D6A4F' }}
            >
              查看更多 <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WORKS_DATA.map(work => (
              <div
                key={work.id}
                className="rounded-xl p-4 transition-all hover:shadow-lg group"
                style={{ background: cardBg, border: `1px solid ${border}` }}
              >
                {/* 封面轮播 */}
                <WorkCarousel images={work.images} theme={theme} />

                {/* 作品信息 */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{work.icon}</span>
                  <h4 className="font-semibold text-lg" style={{ color: text }}>
                    {work.name}
                  </h4>
                </div>
                <p className="text-sm mb-3" style={{ color: muted }}>{work.desc}</p>

                {/* 按钮 */}
                {work.external ? (
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
                    style={{ color: work.color }}
                  >
                    前往使用 <ArrowRight size={14} />
                  </a>
                ) : (
                  <Link
                    to={work.url}
                    className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
                    style={{ color: work.color }}
                  >
                    查看详情 <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 读书 · 以书为粮 ===== */}
      <section id="reading" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2" style={{ color: text }}>
                读书 · 以书为粮
              </h2>
              <p className="text-sm" style={{ color: muted }}>
                今年已读 {BOOKS_DATA.total} 本
              </p>
            </div>
            <Link
              to="/reading"
              className="text-sm font-medium flex items-center gap-1"
              style={{ color: '#2D6A4F' }}
            >
              查看全部 <ArrowRight size={14} />
            </Link>
          </div>

          {/* 当前在读 */}
          <div
            className="rounded-xl p-6 mb-8"
            style={{
              background: isDark ? 'rgba(45,106,79,0.1)' : 'rgba(45,106,79,0.05)',
              border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}`,
            }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{BOOKS_DATA.current.cover}</span>
              <div className="flex-1">
                <div className="font-semibold mb-1" style={{ color: text }}>
                  当前在读：{BOOKS_DATA.current.name}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 h-2 rounded-full"
                    style={{ background: isDark ? '#21262D' : '#E8E5DF' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${BOOKS_DATA.current.progress}%`, background: '#2D6A4F' }}
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#2D6A4F' }}>
                    {BOOKS_DATA.current.progress}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 最近读完 */}
          <h3 className="font-medium mb-4" style={{ color: muted }}>最近读完</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BOOKS_DATA.finished.map(book => (
              <div
                key={book.name}
                className="rounded-xl p-5 transition-all hover:shadow-md"
                style={{ background: cardBg, border: `1px solid ${border}` }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{book.cover}</span>
                  <div>
                    <div className="font-medium mb-1" style={{ color: text }}>{book.name}</div>
                    <div className="text-xs" style={{ color: muted }}>{book.note}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 锻炼 · 以路为行 ===== */}
      <section id="exercise" className="py-20 px-6" style={{ background: isDark ? '#161B22' : '#F8F7F4' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2" style={{ color: text }}>
                锻炼 · 以路为行
              </h2>
              <p className="text-sm" style={{ color: muted }}>
                {EXERCISE_DATA.motto}
              </p>
            </div>
            <Link
              to="/exercise"
              className="text-sm font-medium flex items-center gap-1"
              style={{ color: '#2D6A4F' }}
            >
              查看全部 <ArrowRight size={14} />
            </Link>
          </div>

          {/* 核心数据 */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: '连续打卡', value: `${EXERCISE_DATA.streak}天`, icon: '🔥' },
              { label: '今年跑量', value: `${EXERCISE_DATA.yearDistance}km`, icon: '🏃' },
              { label: '本周跑量', value: `${EXERCISE_DATA.weekDistance}km`, icon: '📊' },
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
            className="rounded-xl p-8 text-center"
            style={{
              background: isDark ? '#0D1117' : '#FFFFFF',
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
        </div>
      </section>

      {/* ===== 关于我 ===== */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-6" style={{ color: text }}>
            关于我
          </h2>
          <div
            className="rounded-xl p-8 mb-8"
            style={{ background: cardBg, border: `1px solid ${border}` }}
          >
            <p className="text-base leading-relaxed mb-6" style={{ color: muted }}>
              我是小福，甘肃深山出来的普通人。
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: muted }}>
              爷爷挖药给孙子攒娶媳妇的钱，到走都没看到孙子娶上媳妇。
              母亲不识字，照顾瘫痪爷爷三十年。
            </p>
            <p className="text-base leading-relaxed" style={{ color: muted }}>
              我靠读书走出大山，现在用AI给自己造一条自由的路。
            </p>
          </div>

          {/* 联系方式 */}
          <div className="flex flex-wrap gap-4">
            <a
              href="https://twitter.com/xiaofu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all hover:shadow-md"
              style={{ borderColor: border, color: muted }}
            >
              𝕏 推特
            </a>
            <a
              href="https://douyin.com/user/xiaofu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all hover:shadow-md"
              style={{ borderColor: border, color: muted }}
            >
              📱 抖音
            </a>
            <a
              href="mailto:xiaofu@example.com"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all hover:shadow-md"
              style={{ borderColor: border, color: muted }}
            >
              ✉️ 邮箱
            </a>
            <span
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border"
              style={{ borderColor: border, color: muted }}
            >
              💬 微信：xiaofu_ai
            </span>
          </div>
        </div>
      </section>

    </div>
  )
}
