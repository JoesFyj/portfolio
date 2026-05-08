import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { getSiteConfig } from '../lib/supabase'

function TypewriterText({ phrases }) {
  const [displayText, setDisplayText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const charRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    const current = phrases[phraseIndex]
    function tick() {
      if (isTyping) {
        charRef.current++
        setDisplayText(current.slice(0, charRef.current))
        if (charRef.current > current.length) {
          setIsTyping(false)
          timerRef.current = setTimeout(tick, 2200)
        } else {
          timerRef.current = setTimeout(tick, 50)
        }
      } else {
        charRef.current--
        setDisplayText(current.slice(0, Math.max(0, charRef.current)))
        if (charRef.current <= 0) {
          setPhraseIndex(prev => (prev + 1) % phrases.length)
          setIsTyping(true)
        } else {
          timerRef.current = setTimeout(tick, 25)
        }
      }
    }
    charRef.current = 0
    timerRef.current = setTimeout(tick, 600)
    return () => clearTimeout(timerRef.current)
  }, [phraseIndex, isTyping, phrases])

  return <span>{displayText}<span className="animate-pulse" style={{ color: '#2D6A4F' }}>|</span></span>
}

export default function HomeNew({ theme }) {
  const isDark = theme === 'dark'
  const [config, setConfig] = useState(null)

  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'

  useEffect(() => {
    getSiteConfig().then(setConfig)
  }, [])

  const heroTitle = config?.hero_title || '山里人的财商课'
  const heroSubtitle = config?.hero_subtitle || '用AI给自己造一条自由的路'
  const heroSlogan = config?.hero_slogan || '少工作，多赚钱，以书为粮，以路为行'

  const phrases = [heroSlogan, heroTitle, heroSubtitle]

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      {/* ===== Hero ===== */}
      <section className="flex items-center" style={{ minHeight: '100dvh', paddingTop: '5rem' }}>
        <div className="w-full max-w-5xl mx-auto px-6">
          {/* 标签 */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: isDark ? 'rgba(45,106,79,0.15)' : 'rgba(45,106,79,0.08)',
              border: `1px solid ${isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)'}`,
            }}
          >
            <Sparkles size={14} style={{ color: '#2D6A4F' }} />
            <span className="text-sm font-medium" style={{ color: '#2D6A4F' }}>
              1人 + n个AI 的自由实验
            </span>
          </div>

          {/* 打字机标题 */}
          <div className="min-h-[4rem] mb-8">
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ color: text }}
            >
              <TypewriterText phrases={phrases} />
            </h1>
          </div>

          {/* 介绍 */}
          <div
            className="rounded-2xl p-6 mb-8 max-w-2xl"
            style={{ background: cardBg, border: `1px solid ${border}` }}
          >
            <p className="text-base leading-relaxed" style={{ color: muted }}>
              从甘肃深山走出来的普通人，用AI给自己造一条自由的路。
              分享关于赚钱、成长和适应时代的真实思考。
              不教暴富，只说真话。
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/works"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-lg"
              style={{ background: '#2D6A4F', color: '#FFFFFF' }}
            >
              看我的作品 <ArrowRight size={15} />
            </Link>
            <Link
              to="/journey"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all"
              style={{ borderColor: border, color: muted }}
            >
              一个人的远征
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 三支柱 ===== */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-10 text-center" style={{ color: text }}>
            三个方向，一条路
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '💰',
                title: '财富逻辑',
                desc: '普通人如何不靠时间赚钱。打工是最穷的赚钱方式，但大多数人只知道这一条路。',
                color: '#2D6A4F',
                bg: isDark ? 'rgba(45,106,79,0.1)' : '#F0FDF4',
                border: isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)',
              },
              {
                icon: '🧠',
                title: '成长认知',
                desc: '从甘肃深山到职业自由的思考。走过的弯路，踩过的坑，不藏私。',
                color: '#D4A373',
                bg: isDark ? 'rgba(212,163,115,0.1)' : '#FFFBEB',
                border: isDark ? 'rgba(212,163,115,0.2)' : 'rgba(212,163,115,0.1)',
              },
              {
                icon: '🤖',
                title: 'AI工具',
                desc: '用AI放大个人能力的实战。7个Agent 24小时帮我干活，我只管决策。',
                color: '#6366F1',
                bg: isDark ? 'rgba(99,102,241,0.1)' : '#EEF2FF',
                border: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
              },
            ].map(pillar => (
              <div
                key={pillar.title}
                className="rounded-2xl p-8 transition-all hover:shadow-lg"
                style={{ background: pillar.bg, border: `1px solid ${pillar.border}` }}
              >
                <span className="text-4xl block mb-4">{pillar.icon}</span>
                <h3 className="font-semibold text-lg mb-2" style={{ color: pillar.color }}>{pillar.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: muted }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 最新动态 ===== */}
      <section className="py-20 px-6" style={{ background: isDark ? '#161B22' : '#F8F7F4' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-10" style={{ color: text }}>
            最近在做什么
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://40cb5522c78940d6856379baab1876af.prod.enter.pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-6 transition-all hover:shadow-lg group block"
              style={{ background: cardBg, border: `1px solid ${border}` }}
            >
              <span className="text-sm font-medium" style={{ color: '#2D6A4F' }}>🛠️ 工具集</span>
              <h3 className="font-serif text-xl font-bold mt-2 mb-2 group-hover:text-[#2D6A4F] transition-colors" style={{ color: text }}>
                VideoGenerator V2
              </h3>
              <p className="text-sm" style={{ color: muted }}>
                动画视频自动生成引擎，5套风格预设，一键生成抖音口播视频
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm" style={{ color: '#2D6A4F' }}>
                前往使用 <ArrowRight size={14} />
              </span>
            </a>

            <Link
              to="/journey"
              className="rounded-2xl p-6 transition-all hover:shadow-lg group"
              style={{ background: cardBg, border: `1px solid ${border}` }}
            >
              <span className="text-sm font-medium" style={{ color: '#D4A373' }}>📖 心路历程</span>
              <h3 className="font-serif text-xl font-bold mt-2 mb-2 group-hover:text-[#D4A373] transition-colors" style={{ color: text }}>
                一个人的远征
              </h3>
              <p className="text-sm" style={{ color: muted }}>
                读书、锻炼、做自媒体。用真实数据记录从深山到自由的路
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm" style={{ color: '#D4A373' }}>
                走进来看 <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 订阅 ===== */}
      <section className="py-20 px-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: text }}>
            每周一封真实思考
          </h2>
          <p className="text-sm mb-6" style={{ color: muted }}>
            关于赚钱、成长和AI自由实验。不灌鸡汤，只说真话。
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="你的邮箱"
              className="flex-1 px-4 py-3 rounded-xl text-sm border-none outline-none"
              style={{ background: isDark ? '#21262D' : '#F4F2EE', color: text }}
            />
            <button
              className="px-5 py-3 rounded-xl text-sm font-medium"
              style={{ background: '#2D6A4F', color: '#FFFFFF' }}
            >
              订阅
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
