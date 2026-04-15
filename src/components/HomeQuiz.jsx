import { useState } from 'react'
import { getConfig } from '../lib/siteConfig'
import { ChevronRight, RotateCcw } from 'lucide-react'

const DEFAULT_QUESTIONS = [
  {
    question: '小福老师小时候在哪里长大？',
    options: [
      { label: '西安城里', reveal: '不是哦，是甘肃深山，放牛捡粪烧土豆的那种。' },
      { label: '甘肃深山', reveal: '对！甘肃陇山，外婆陪着他长大，那是世界上最温暖的地方。' },
      { label: '兰州', reveal: '不是兰州，是甘肃更深的山里。' },
      { label: '不知道', reveal: '甘肃深山放牛娃，这是他最真实的起点。' },
    ],
  },
  {
    question: '他靠什么走出了大山？',
    options: [
      { label: '做生意', reveal: '' },
      { label: '读书', reveal: '是的。爷爷挖药供他读书，母亲陪他坐到缝纫机旁点灯看书。这是他唯一的路。' },
      { label: '当兵', reveal: '' },
      { label: '运气好', reveal: '' },
    ],
  },
  {
    question: '他现在主要在做什么？',
    options: [
      { label: '上班打工', reveal: '' },
      { label: 'AI + 自媒体', reveal: '对！提示词工程、智能体搭建、AI自媒体。他不想再把8小时卖给公司了。' },
      { label: '卖课', reveal: '' },
      { label: '写代码', reveal: '' },
    ],
  },
  {
    question: '他最相信的一句话？',
    options: [
      { label: '读书是改变命运的唯一渠道', reveal: '这是他的底层信仰。从深山到硕士，全靠读书。' },
      { label: '人脉决定命运', reveal: '' },
      { label: '风口比努力重要', reveal: '' },
      { label: '选择比努力重要', reveal: '' },
    ],
  },
  {
    question: '他现在最想戒掉什么？',
    options: [
      { label: '懒惰', reveal: '' },
      { label: '较劲', reveal: '「吃饱饭，爱对人，睡好觉，别较劲。」这是他最近悟到的。' },
      { label: '焦虑', reveal: '' },
      { label: '手机', reveal: '' },
    ],
  },
  {
    question: '如果只能选一个，你觉得他更像哪种人？',
    options: [
      { label: '野心家', reveal: '' },
      { label: '理想主义者', reveal: '' },
      { label: '行动派', reveal: '他不算野心家，更像一个愿意把AI用起来的行动派。拍了100条烂视频，才知道哪条有人看。' },
      { label: '悲观者', reveal: '' },
    ],
  },
]

export default function HomeQuiz({ theme }) {
  const isDark = theme === 'dark'
  const cfg = getConfig()
  const q = cfg.homeQuiz || {}
  const title = q.title || '答题了解我'
  const subtitle = q.subtitle || '几道题，读懂一个人'
  const questions = (q.questions && q.questions.length > 0) ? q.questions : DEFAULT_QUESTIONS

  const bg          = isDark ? '#1E1A16' : '#F4F2EE'
  const text        = isDark ? '#F8F4EE' : '#2D2D2D'
  const muted       = isDark ? '#9C8D7E' : '#6B6860'
  const cardBg      = isDark ? '#2A2420' : '#FFFFFF'
  const cardBorder  = isDark ? '#3D352B' : '#E8E5DF'
  const inputBg     = isDark ? '#2A2420' : '#FAFAF6'
  const barBg       = isDark ? '#3D352B' : '#E8E5DF'
  const accent      = '#D97706'

  // 三种状态：intro(引导页) | quiz(答题中) | done(完成)
  const [phase, setPhase] = useState('intro') // 'intro' | 'quiz' | 'done'
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])

  const total = questions.length
  const unlocked = answers.filter(a => a !== undefined).length
  const progress = (current / total) * 100
  const cq = questions[current]

  function start() {
    setPhase('quiz')
  }

  function select(idx) {
    setSelected(idx)
    setAnswers(prev => {
      const next = [...prev]
      next[current] = idx
      return next
    })
  }

  function next() {
    if (selected === null) return
    if (current < total - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
    } else {
      setPhase('done')
    }
  }

  function reset() {
    setPhase('intro')
    setCurrent(0)
    setSelected(null)
    setAnswers([])
  }

  return (
    <section id="quiz" className="py-24 px-6" style={{ background: isDark ? 'rgba(31,31,31,0.15)' : 'rgba(250,249,246,0.15)', position: 'relative', zIndex: 1 }}>
      <div className="max-w-2xl mx-auto">

        {/* 标题 */}
        <div className="mb-16 text-center">
          <span className="section-label">
            <span className="text-2xl font-bold" style={{ color: isDark ? '#8B949E' : '#D4C9B8' }}>03</span>
            Quiz
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: text }}>
            {title}
          </h2>
          <p className="mt-2 text-sm" style={{ color: muted }}>{subtitle}</p>
          <div className="accent-bar mt-4 mx-auto" />
        </div>

        {/* ===== 引导页 ===== */}
        {phase === 'intro' && (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <h3
              className="font-serif text-3xl md:text-4xl font-bold mb-4 leading-snug"
              style={{ color: text }}
            >
              答题解锁<br />我的故事
            </h3>
            <p className="text-sm mb-10 leading-relaxed" style={{ color: muted }}>
              选出你的答案，窥见他的来路
            </p>

            {/* 分隔线 */}
            <div className="h-px mb-8 mx-auto" style={{ background: cardBorder }} />

            {/* 答题按钮 */}
            <button
              onClick={start}
              className="inline-flex items-center gap-2 px-10 py-3.5 rounded-full text-sm font-semibold transition-all"
              style={{ background: accent, color: '#FFFFFF' }}
            >
              开始答题
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ===== 答题中 ===== */}
        {phase === 'quiz' && (
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '1rem', overflow: 'hidden' }}>

            {/* 顶部进度条（内嵌卡片内） */}
            <div
              className="px-8 pt-8 pb-6"
              style={{ borderBottom: `1px solid ${cardBorder}` }}
            >
              <div className="flex justify-between text-xs mb-3" style={{ color: muted }}>
                <span>{current + 1}/{total}</span>
                <span>已解锁 {unlocked}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: barBg }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: `linear-gradient(to right, ${accent}, #F59E0B)` }}
                />
              </div>
            </div>

            {/* 问题 + 选项 */}
            <div className="px-8 pt-7 pb-8">
              <h3 className="text-xl font-semibold mb-6" style={{ color: text }}>
                {cq.question}
              </h3>

              <div className="space-y-3 mb-8">
                {cq.options.map((opt, i) => {
                  const isSelected = selected === i
                  const hasReveal = isSelected && opt.reveal

                  return (
                    <div key={i}>
                      <button
                        onClick={() => select(i)}
                        className="w-full text-left px-5 py-4 rounded-xl border transition-all"
                        style={
                          isSelected
                            ? { background: '#FEF3C7', borderColor: accent, color: '#2D2D2D' }
                            : { background: inputBg, borderColor: cardBorder, color: text }
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                            style={
                              isSelected
                                ? { borderColor: accent, background: accent }
                                : { borderColor: isDark ? '#4B4B47' : '#D4C9B8', background: 'transparent' }
                            }
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full" style={{ background: '#FFFFFF' }} />
                            )}
                          </div>
                          <span className="text-sm font-medium">{opt.label}</span>
                        </div>
                      </button>

                      {/* 展开的隐藏答案 */}
                      {hasReveal && (
                        <div
                          className="mt-2 mx-0 px-5 py-4 rounded-xl border"
                          style={{
                            background: isDark ? '#2D2D2D' : '#FFFBEB',
                            borderColor: '#FDE68A',
                          }}
                        >
                          <p className="text-sm leading-relaxed" style={{ color: isDark ? '#E6EDF3' : '#92400E' }}>
                            {opt.reveal}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* 下一题 */}
              <button
                onClick={next}
                disabled={selected === null}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={
                  selected !== null
                    ? { background: accent, color: '#FFFFFF' }
                    : { background: isDark ? '#30363D' : '#E8E5DF', color: isDark ? '#484F58' : '#A8A29E', cursor: 'not-allowed' }
                }
              >
                {current < total - 1 ? '下一题' : '查看全部答案'}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ===== 完成页 ===== */}
        {phase === 'done' && (
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '1rem', padding: '2rem', textAlign: 'center' }}>
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
              style={{ background: '#FEF3C7' }}
            >
              🦞
            </div>

            <h3 className="text-2xl font-bold font-serif mb-2" style={{ color: text }}>
              你已完成答题
            </h3>
            <p className="text-sm mb-8" style={{ color: muted }}>
              根据你的选择，这是你眼中的「小福老师」
            </p>

            <div className="space-y-4 mb-8 text-left">
              {questions.map((qItem, qi) => {
                const chosen = answers[qi]
                const opt = qItem.options[chosen]
                if (!opt) return null
                return (
                  <div
                    key={qi}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: inputBg }}
                  >
                    <div
                      className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: accent }}
                    >
                      <span className="text-white text-xs font-bold">{qi + 1}</span>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: accent }}>{qItem.question}</div>
                      <div className="text-sm font-semibold mb-1" style={{ color: text }}>{opt.label}</div>
                      {opt.reveal && (
                        <div className="text-xs leading-relaxed" style={{ color: muted }}>{opt.reveal}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={reset}
              className="flex items-center gap-2 mx-auto text-sm px-5 py-2.5 rounded-xl border transition-all"
              style={{ borderColor: cardBorder, color: muted }}
            >
              <RotateCcw size={13} />
              重新答题
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
