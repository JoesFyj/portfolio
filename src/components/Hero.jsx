import { useState, useEffect, useRef } from 'react'
import { getConfig } from '../lib/siteConfig'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

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

  return <span>{displayText}<span className="animate-pulse" style={{ color: '#D97706' }}>|</span></span>
}

export default function Hero({ theme, lang }) {
  const isDark = theme === 'dark'
  const bg       = isDark ? '#1F1F1F' : '#FAF9F6'
  const text     = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted    = isDark ? '#8B949E' : '#6B6860'
  const border   = isDark ? '#30363D' : '#E8E5DF'
  const cardBg   = isDark ? '#2D2D2D' : '#FFFFFF'
  const btnBg    = isDark ? '#58A6FF' : '#2D2D2D'
  const btnText  = isDark ? '#1F1F1F' : '#FFFFFF'

  const cfg = getConfig()
  const hero = cfg.hero || {}
  const typing = cfg.heroTyping || {}
  const site = cfg.site || {}
  const avatarUrl = hero.avatarBase64 || hero.avatar || ''

  const phrases = (lang === 'en' ? typing.en : typing.zh) || [
    '少工作，多赚钱，以书为粮，以路为行',
    '从甘肃深山到西安城，用AI把自己变成一家公司',
    '提示词工程 · 智能体搭建 · AI自媒体',
  ]

  return (
    <div className="relative">
      {/* 半透明遮罩：让内容清晰 + 透出动态背景 */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'rgba(31,31,31,0.80)'
            : 'rgba(250,249,246,0.80)',
          zIndex: 0,
        }}
      />
      <section
        className="relative flex items-center"
        style={{ minHeight: '100dvh', paddingTop: '5rem', paddingBottom: '2rem', zIndex: 1 }}
      >
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6">
        {/* 顶部提示条 */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-10"
          style={{
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
          }}
        >
          <span
            style={{
              color: '#D97706',
              fontSize: '0.9rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            🔥 未来10年只研究
          </span>
          <span
            style={{
              color: '#D97706',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            1人+n个AI赚钱方法
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 lg:gap-16 items-center">

          {/* 左侧：头像 + 名字 + 小字 */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="头像"
                className="w-44 h-44 lg:w-52 lg:h-52 rounded-full object-cover"
                style={{ border: '3px solid #D97706', boxShadow: '0 0 0 6px #FEF3C7' }}
              />
            ) : (
              <div
                className="w-44 h-44 lg:w-52 lg:h-52 rounded-full flex items-center justify-center text-6xl"
                style={{ background: '#FEF3C7', border: '3px solid #D97706' }}
              >
                🦞
              </div>
            )}

            <div className="text-center w-full">
              <h2
                className="font-serif text-3xl lg:text-4xl font-bold"
                style={{ color: text }}
              >
                {site.title || '小福老师'}
              </h2>
              <p className="text-sm mt-1" style={{ color: muted }}>
                {site.subtitle || hero.sub?.split('。')[0] || 'AI探索者 · 西安工业大学硕士'}
              </p>
            </div>
          </div>

          {/* 右侧：大标题 + 介绍框 */}
          <div className="space-y-6">
            <div className="min-h-[5rem]">
              <h1
                className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{ color: text }}
              >
                <TypewriterText phrases={phrases} />
              </h1>
            </div>

            <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '1rem', padding: '1.5rem' }}>
              <p className="text-base leading-relaxed" style={{ color: muted }}>
                {hero.sub || '从甘肃深山到西安城，用AI把自己变成一家公司。提示词工程、智能体搭建、AI+自媒体——让机器打工，你当老板。'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/hub"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: btnBg, color: btnText }}
              >
                <ArrowRight size={15} />
                了解我在做的事
              </Link>
              <Link
                to="/hub/ops"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all"
                style={{ borderColor: border, color: muted }}
              >
                龙虾运营中心
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}
