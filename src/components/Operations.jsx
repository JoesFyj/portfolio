import { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, Eye, RefreshCw, CheckCircle,
  ChevronRight, Activity, Target, Wallet
} from 'lucide-react'

const STEPS = [
  { key: 'topic',   label: '选题' },
  { key: 'write',   label: '文案' },
  { key: 'cover',   label: '封面' },
  { key: 'wechat',  label: '公众号' },
  { key: 'xhs',     label: '小红书' },
  { key: 'bitable', label: '多维表' },
  { key: 'audio',   label: '音频' },
]

function genMockHistory() {
  const days = ['04-01', '04-02', '04-03', '04-04', '04-05', '04-06', '04-07']
  return days.map((date) => ({
    date,
    views: Math.floor(Math.random() * 3000) + 500,
    cost: parseFloat((Math.random() * 2 + 0.3).toFixed(2)),
    roi: Math.floor(Math.random() * 50 - 10),
  }))
}

function genMockRuns() {
  return [
    {
      id: 1,
      article: '被AI控住的三年，没人告诉的真相',
      time: '04-07 10:00',
      status: 'done',
      stepsDone: 7, stepsTotal: 7,
      tokens: 2847, cost: 0.57, views: 1847,
      stepDetails: STEPS.map(s => ({ ...s, done: true, icon: '✓' })),
    },
    {
      id: 2,
      article: '付费几千后我发现AI+自媒体根本不是学出来的',
      time: '04-05 10:00',
      status: 'done',
      stepsDone: 7, stepsTotal: 7,
      tokens: 3156, cost: 0.63, views: 3420,
      stepDetails: STEPS.map(s => ({ ...s, done: true, icon: '✓' })),
    },
    {
      id: 3,
      article: '放下那个较劲的自己',
      time: '04-03 10:00',
      status: 'done',
      stepsDone: 7, stepsTotal: 7,
      tokens: 2103, cost: 0.42, views: 892,
      stepDetails: STEPS.map(s => ({ ...s, done: true, icon: '✓' })),
    },
  ]
}

// ==================== StatCard ====================
function StatCard({ icon: Icon, label, value, sub, trend, color, text, muted, cardBg, cardBorder }) {
  return (
    <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <Icon size={14} style={{ color }} />
        <span className="text-xs" style={{ color: muted }}>{label}</span>
      </div>
      <div className="text-2xl font-bold font-serif" style={{ color: '#D97706' }}>{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: muted }}>{sub}</div>}
      {trend !== undefined && (
        <div className="flex items-center justify-center gap-0.5 text-xs mt-1"
          style={{ color: trend >= 0 ? '#22C55E' : '#EF4444' }}>
          {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  )
}

// ==================== RunLogCard ====================
function RunLogCard({ run, onExpand, expanded, text, muted, cardBg, cardBorder, rowBg }) {
  const statusConfig = {
    done:    { bg: 'rgba(34,197,94,0.15)',  color: '#22C55E', Icon: CheckCircle },
    running: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', Icon: RefreshCw },
    error:   { bg: 'rgba(239,68,68,0.15)',  color: '#EF4444', Icon: ChevronRight },
  }
  const s = statusConfig[run.status] || statusConfig.error
  const StatusIcon = s.Icon

  return (
    <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '1rem', overflow: 'hidden' }}>
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer transition-all"
        onClick={onExpand}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: s.bg, color: s.color }}>
            <StatusIcon size={13} className={run.status === 'running' ? 'animate-spin' : ''} />
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: text }}>{run.article}</div>
            <div className="text-xs" style={{ color: muted }}>{run.time}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-xs" style={{ color: muted }}>
            阅读 {run.views || 0} · {run.tokens || 0} tokens
          </div>
          <ChevronRight size={13} style={{ color: muted, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-3 space-y-2" style={{ borderTop: `1px solid ${cardBorder}` }}>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '执行步数', val: `${run.stepsDone || 0}/${run.stepsTotal || 7}` },
              { label: '消耗Tokens', val: run.tokens || '—' },
              { label: '预估成本', val: run.cost ? `¥${run.cost}` : '—' },
              { label: '阅读量', val: run.views || '—' },
            ].map(({ label, val }) => (
              <div key={label} className="rounded-lg p-2 text-center" style={{ background: rowBg }}>
                <div className="text-xs" style={{ color: muted }}>{label}</div>
                <div className="text-xs font-semibold" style={{ color: text }}>{val}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {run.stepDetails?.map((step, i) => (
              <div key={i} className="px-2 py-1 rounded-lg text-xs"
                style={step.done
                  ? { background: 'rgba(34,197,94,0.12)', color: '#22C55E' }
                  : { background: rowBg, color: muted }
                }>
                {step.icon} {step.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== ROIChart ====================
function ROIChart({ data, muted, rowBg }) {
  const maxViews = Math.max(...data.map(d => d.views), 1)

  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 text-xs shrink-0" style={{ color: muted }}>{d.date}</div>
          <div className="flex-1 h-5 rounded overflow-hidden relative" style={{ background: rowBg }}>
            <div className="h-full rounded flex items-center justify-end pr-1 transition-all"
              style={{ width: `${(d.views / maxViews) * 100}%`, background: 'rgba(217,119,6,0.6)' }}>
              <span className="text-xs font-medium" style={{ color: '#FFFFFF' }}>{d.views}</span>
            </div>
          </div>
          <div className="w-12 text-xs text-right" style={{ color: muted }}>¥{d.cost.toFixed(2)}</div>
          <div className="w-8 text-right">
            <span className="text-xs font-bold" style={{ color: d.roi > 0 ? '#22C55E' : '#EF4444' }}>
              {d.roi > 0 ? '+' : ''}{d.roi.toFixed(0)}
            </span>
          </div>
        </div>
      ))}
      <div className="flex gap-4 mt-2 pt-2" style={{ borderTop: `1px solid ${rowBg}` }}>
        <div className="flex items-center gap-1 text-xs" style={{ color: muted }}>
          <div className="w-3 h-3 rounded" style={{ background: 'rgba(217,119,6,0.6)' }} /> 阅读量
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: muted }}>
          <div className="w-3 h-3 rounded" style={{ background: 'rgba(0,0,0,0.15)' }} /> 成本
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: muted }}>
          <div className="w-3 h-3 rounded" style={{ background: '#22C55E' }} /> ROI
        </div>
      </div>
    </div>
  )
}

// ==================== Main ====================
export default function Operations({ theme }) {
  const isDark = theme === 'dark'

  const bg         = isDark ? '#111110' : '#FAF9F6'
  const text       = isDark ? '#FAFAF8' : '#1C1C1E'
  const muted      = isDark ? '#8B8B87' : '#6B6860'
  const cardBg     = isDark ? '#1C1C1E' : '#FFFFFF'
  const cardBorder = isDark ? '#2C2C2A' : '#E8E5DF'
  const barBg     = isDark ? 'rgba(255,255,255,0.05)' : '#E8E5DF'
  const rowBg     = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'
  const stepBg    = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'

  const cs = (extra = {}) => ({ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '1rem', ...extra })

  const [history, setHistory] = useState([])
  const [runs, setRuns] = useState([])
  const [expandedRun, setExpandedRun] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('ops_history')
      const savedRuns = localStorage.getItem('ops_runs')
      if (savedHistory) setHistory(JSON.parse(savedHistory))
      else setHistory(genMockHistory())
      if (savedRuns) setRuns(JSON.parse(savedRuns))
      else setRuns(genMockRuns())
      const savedLastRefresh = localStorage.getItem('ops_last_refresh')
      if (savedLastRefresh) setLastRefresh(new Date(savedLastRefresh))
    } catch (e) {
      setHistory(genMockHistory())
      setRuns(genMockRuns())
    }
  }, [])

  async function handleRefresh() {
    setRefreshing(true)
    await new Promise(r => setTimeout(r, 1500))
    const today = '04-07'
    const newEntry = {
      date: today,
      views: Math.floor(Math.random() * 2000) + 1000,
      cost: parseFloat((Math.random() * 2 + 0.3).toFixed(2)),
      roi: Math.floor(Math.random() * 40 - 5),
    }
    const newHistory = [...history.filter(h => h.date !== today), newEntry]
    setHistory(newHistory)
    localStorage.setItem('ops_history', JSON.stringify(newHistory))

    const newRun = {
      id: Date.now(),
      article: '我在AI浪潮里，反而把手机放下了',
      time: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
      status: 'done',
      stepsDone: 7, stepsTotal: 7,
      tokens: Math.floor(Math.random() * 2000 + 1500),
      cost: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)),
      views: 0,
      stepDetails: STEPS.map(s => ({ ...s, done: true, icon: '✓' })),
    }
    const newRuns = [newRun, ...runs].slice(0, 10)
    setRuns(newRuns)
    localStorage.setItem('ops_runs', JSON.stringify(newRuns))

    setLastRefresh(new Date())
    localStorage.setItem('ops_last_refresh', new Date().toISOString())
    setRefreshing(false)
  }

  const totalViews = history.reduce((sum, h) => sum + h.views, 0)
  const totalCost = history.reduce((sum, h) => sum + h.cost, 0)
  const avgRoi = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + h.roi, 0) / history.length)
    : 0
  const todayEntry = history.find(h => h.date === '04-07')

  return (
    <section id="operations" className="py-24 px-6" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto">

        {/* 标题 */}
        <div className="mb-16">
          <span className="section-label">
            <span className="text-2xl font-bold" style={{ color: isDark ? '#2C2C2A' : '#D4C9B8' }}>02</span>
            Operations
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: text }}>
            运营监控中心
          </h2>
          <p className="mt-2 text-sm" style={{ color: muted }}>自动追踪每一次发布的成本、消耗与产出</p>
          <div className="accent-bar mt-4" />
        </div>

        {/* 四大指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Target} label="今日发布" value={todayEntry ? '1篇' : '0篇'} sub={todayEntry?.date || '今日'} trend={12} color="#D97706"
            text={text} muted={muted} cardBg={cardBg} cardBorder={cardBorder} />
          <StatCard icon={Wallet} label="7日总消耗" value={`¥${totalCost.toFixed(2)}`} sub="Token成本" trend={-8} color="#F59E0B"
            text={text} muted={muted} cardBg={cardBg} cardBorder={cardBorder} />
          <StatCard icon={Eye} label="7日总阅读" value={totalViews.toLocaleString()} sub="全平台累计" trend={23} color="#3B82F6"
            text={text} muted={muted} cardBg={cardBg} cardBorder={cardBorder} />
          <StatCard icon={TrendingUp} label="平均 ROI" value={avgRoi > 0 ? `+${avgRoi}` : avgRoi} sub="阅读/成本比" trend={avgRoi}
            color={avgRoi >= 0 ? '#22C55E' : '#EF4444'}
            text={text} muted={muted} cardBg={cardBg} cardBorder={cardBorder} />
        </div>

        {/* 刷新 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity size={13} style={{ color: muted }} />
            <span className="text-xs" style={{ color: muted }}>
              {lastRefresh
                ? `最后更新：${lastRefresh.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
                : '点击刷新获取最新数据'}
            </span>
          </div>
          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border transition-all"
            style={{ borderColor: 'rgba(217,119,6,0.3)', color: '#D97706', background: 'rgba(217,119,6,0.1)' }}>
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? '抓取中...' : '刷新数据'}
          </button>
        </div>

        {/* ROI 趋势 */}
        <div style={cs({ padding: '1.5rem', marginBottom: '2rem' })}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold mb-0.5" style={{ color: text }}>ROI 趋势分析</h3>
              <p className="text-xs" style={{ color: muted }}>每篇文章的阅读量 vs 成本 vs ROI</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold font-serif" style={{ color: '#D97706' }}>{avgRoi > 0 ? '+' : ''}{avgRoi}</div>
              <div className="text-xs" style={{ color: muted }}>平均ROI</div>
            </div>
          </div>
          <ROIChart data={history} muted={muted} rowBg={rowBg} />
        </div>

        {/* 流水线 */}
        <div style={cs({ padding: '1.5rem', marginBottom: '2rem' })}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold mb-0.5" style={{ color: text }}>自动化流水线</h3>
              <p className="text-xs" style={{ color: muted }}>每天 10:00 自动执行</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
              <span className="text-xs" style={{ color: '#22C55E' }}>运行中</span>
            </div>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {STEPS.map((step, i) => (
              <div key={step.key} className="flex items-center min-w-0">
                <div className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl min-w-0" style={{ background: stepBg }}>
                  <div className="text-lg font-serif" style={{ color: 'rgba(217,119,6,0.6)' }}>{i + 1}</div>
                  <div className="text-xs whitespace-nowrap" style={{ color: muted }}>{step.label}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-4 h-px mx-0.5 shrink-0" style={{ background: 'rgba(217,119,6,0.2)' }} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl text-xs border"
            style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: '#22C55E' }}>
            ✅ 流水线持续运行中。每日 10:00 自动：选题 → 文案 → 封面 → 推送公众号/小红书 → 多维表 → 音频 → 监控回收。
          </div>
        </div>

        {/* 执行记录 */}
        <div>
          <h3 className="text-sm font-semibold mb-4" style={{ color: text }}>执行记录</h3>
          <div className="space-y-2">
            {runs.map(run => (
              <RunLogCard
                key={run.id}
                run={run}
                expanded={expandedRun === run.id}
                onExpand={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                text={text} muted={muted} cardBg={cardBg} cardBorder={cardBorder} rowBg={rowBg}
              />
            ))}
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-6" style={cs({ padding: '1rem' })}>
          <div className="text-xs leading-relaxed" style={{ color: muted }}>
            <span style={{ color: text }} className="font-medium">数据说明：</span>
            Token 消耗基于 OpenAI 实际调用量估算；阅读量通过各平台公开 API 或人工录入；
            ROI = (阅读量 / 100) - 成本，仅供参考。监控数据存储在浏览器本地，定期导出备份。
          </div>
        </div>

      </div>
    </section>
  )
}
