import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTopicsFromFeishu, fetchHotTopics, runFullPipeline } from '../lib/contentOpsApi'

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#2D6A4F"/>
    <path d="M8 16h16M16 8v16" stroke="#E9C46A" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

const AgentCard = ({ agent, status = 'idle' }) => {
  const c = {
    idle: 'border-gray-700 bg-gray-800/30',
    running: 'border-blue-500 bg-blue-500/10 animate-pulse',
    success: 'border-green-500 bg-green-500/10',
    error: 'border-red-500 bg-red-500/10',
  }[status]
  const s = { idle: '待命', running: '运行中', success: '完成', error: '失败' }[status]
  const sc = {
    idle: 'bg-gray-700 text-gray-400',
    running: 'bg-blue-500/20 text-blue-400',
    success: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400',
  }[status]
  return (
    <div className={`card border ${c}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{agent.icon}</span>
        <h3 className="font-semibold text-sm">{agent.name}</h3>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded ${sc}`}>{s}</span>
      </div>
      <p className="text-xs text-gray-400">{agent.desc}</p>
    </div>
  )
}

const TopicCard = ({ topic, onSelect }) => (
  <div className="card border border-gray-700 hover:border-green-500/50 transition-all">
    <div className="flex items-start justify-between mb-2">
      <h4 className="font-medium text-sm flex-1">{topic.title}</h4>
      <span className={`text-xs px-2 py-0.5 rounded ml-2 ${
        topic.priority === 'P0' ? 'bg-red-500/20 text-red-400' :
        topic.priority === 'P1' ? 'bg-orange-500/20 text-orange-400' :
        'bg-gray-700 text-gray-400'
      }`}>{topic.priority || 'P2'}</span>
    </div>
    <div className="flex gap-3 text-xs text-gray-500">
      <span>{topic.category}</span><span>·</span><span>{topic.source || '手动'}</span><span>·</span><span>{topic.status || '待创作'}</span>
    </div>
    <button onClick={() => onSelect(topic)} className="mt-3 w-full btn-primary text-sm py-1.5">使用此选题创作</button>
  </div>
)

const HotCard = ({ topic, onSelect }) => (
  <div className="card border border-gray-700 hover:border-yellow-500/50 cursor-pointer transition-all" onClick={() => onSelect(topic.title)}>
    <div className="flex gap-2 mb-2">
      <span className="text-xs text-yellow-400">🔥 {topic.heat}</span>
      <span className="text-xs text-gray-500">来自 {topic.source}</span>
    </div>
    <p className="text-sm">{topic.title}</p>
  </div>
)

const LogEntry = ({ log }) => (
  <div className={`flex gap-2 text-xs ${
    log.type === 'error' ? 'text-red-400' :
    log.type === 'success' ? 'text-green-400' :
    log.type === 'warning' ? 'text-yellow-400' :
    log.type === 'process' ? 'text-blue-400' : 'text-gray-400'
  }`}>
    <span className="text-gray-600">[{log.time}]</span>
    <span>{log.msg}</span>
  </div>
)

export default function ContentOps() {
  const [tab, setTab] = useState('topics')
  const [topics, setTopics] = useState([])
  const [hotTopics, setHotTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [hotLoading, setHotLoading] = useState(false)
  const [pipeline, setPipeline] = useState({ running: false, logs: [], result: null })
  const [customTopic, setCustomTopic] = useState('')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [agentStates, setAgentStates] = useState({
    topic: 'idle', content: 'idle', review: 'idle', visual: 'idle', publish: 'idle', ops: 'idle',
  })

  const loadTopics = async () => {
    setLoading(true)
    try {
      const data = await getTopicsFromFeishu()
      setTopics(data.length > 0 ? data : [
        { id: '1', title: '为什么越努力越穷？穷人思维的本质', category: '财富逻辑', priority: 'P0', source: '知乎', status: '待创作' },
        { id: '2', title: '年轻人到底要不要买房？2026最新数据', category: '财富逻辑', priority: 'P1', source: '微博', status: '待创作' },
      ])
    } catch (e) { setTopics([{ id: '1', title: '为什么存不下钱？体面消费的陷阱', category: '财富逻辑', priority: 'P0', source: '手动', status: '待创作' }]) }
    setLoading(false)
  }

  const loadHot = async () => {
    setHotLoading(true)
    try {
      const data = await fetchHotTopics()
      setHotTopics(data)
    } catch (e) {}
    setHotLoading(false)
  }

  useEffect(() => { loadTopics(); loadHot() }, [])

  const runPipeline = async (topicTitle) => {
    setPipeline({ running: true, logs: [], result: null })
    setSelectedTopic(topicTitle)
    setTab('pipeline')
    setAgentStates({ topic: 'success', content: 'running', review: 'idle', visual: 'idle', publish: 'idle', ops: 'idle' })
    const result = await runFullPipeline(topicTitle)
    if (result.success) {
      setAgentStates({ topic: 'success', content: 'success', review: 'success', visual: 'success', publish: 'success', ops: 'running' })
      setTimeout(() => setAgentStates(s => ({ ...s, ops: 'success' })), 1000)
    } else {
      setAgentStates(s => ({ ...s, content: result.error ? 'error' : s.content }))
    }
    setPipeline({ running: false, logs: result.logs || [], result })
  }

  const handleSelect = (topic) => {
    const t = topic.title || topic
    setSelectedTopic(t)
    setCustomTopic(t)
  }

  const agents = [
    { id: 'topic', name: '选题Agent', icon: '✦', desc: '热点抓取、选题入库' },
    { id: 'content', name: '内容Agent', icon: '✎', desc: 'DeepSeek生成高质量文案' },
    { id: 'review', name: '评审Agent', icon: '◈', desc: '5维度：钩子/结构/数据/废话/留存' },
    { id: 'visual', name: '视觉Agent', icon: '◉', desc: '封面图、字幕模板、视觉风格' },
    { id: 'publish', name: '发布Agent', icon: '→', desc: '多平台分发：抖音/公众号/小红书' },
    { id: 'ops', name: '运营Agent', icon: '▤', desc: '数据复盘，优化下一轮创作' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <div><h1 className="font-bold text-lg">内容运营系统</h1><p className="text-xs text-gray-500">多Agent协作 · 数据自动化</p></div>
          </div>
          <nav className="flex gap-1">
            <Link to="/" className="nav-link">首页</Link>
            <Link to="/about" className="nav-link">关于</Link>
          </nav>
        </div>
      </header>

      <div className="border-b border-gray-800 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-green-900/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {['SOP', 'SKILL', 'AGENT', '飞书数据中枢'].map((tag, i) => (
              <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${
                i === 0 ? 'bg-purple-500/30 text-purple-300' :
                i === 1 ? 'bg-blue-500/30 text-blue-300' :
                i === 2 ? 'bg-green-500/30 text-green-300' : 'bg-orange-500/30 text-orange-300'
              }`}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-400 mb-4">核心链路 SOP</h2>
          <div className="flex flex-wrap gap-2">
            {[{ step: 1, name: '热点抓取' }, { step: 2, name: '选题入库' }, { step: 3, name: '文案创作' },
              { step: 4, name: 'AI评审' }, { step: 5, name: '视觉制作' }, { step: 6, name: '多平台发布' }, { step: 7, name: '数据复盘' }].map(item => (
              <div key={item.step} className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center justify-center font-medium">{item.step}</span>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-1 mb-6 border-b border-gray-800">
          {[{ id: 'topics', label: '📋 选题库' }, { id: 'hot', label: '🔥 热点' }, { id: 'pipeline', label: '⚡ 流水线' }, { id: 'scripts', label: '📝 文案库' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm border-b-2 -mb-px transition-all ${
                tab === t.id ? 'border-green-500 text-green-400' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}>{t.label}</button>
          ))}
        </div>

        {tab === 'topics' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400">飞书选题库</h3>
                <button onClick={loadTopics} disabled={loading} className="text-xs text-gray-500 hover:text-gray-300">{loading ? '加载中...' : '↻ 刷新'}</button>
              </div>
              <div className="space-y-3">
                {topics.map(t => <TopicCard key={t.id} topic={t} onSelect={handleSelect} />)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-4">快速创作</h3>
              <div className="card border border-gray-700">
                <textarea value={customTopic} onChange={e => setCustomTopic(e.target.value)}
                  placeholder="输入选题，例如：为什么存不下钱" rows={4}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-green-500" />
                <button onClick={() => customTopic.trim() && runPipeline(customTopic.trim())} disabled={!customTopic.trim() || pipeline.running}
                  className="mt-3 w-full btn-primary disabled:opacity-50">
                  {pipeline.running ? '创作中...' : '⚡ 启动流水线'}
                </button>
                {selectedTopic && <p className="mt-2 text-xs text-gray-500">已选择：{selectedTopic}</p>}
              </div>
              <div className="mt-6">
                <div className="flex justify-between mb-4">
                  <h4 className="text-xs font-medium text-gray-500">实时热点</h4>
                  <button onClick={loadHot} disabled={hotLoading} className="text-xs text-gray-600 hover:text-gray-400">{hotLoading ? '加载中...' : '↻'}</button>
                </div>
                <div className="space-y-2">
                  {hotTopics.slice(0, 6).map((t, i) => <HotCard key={i} topic={t} onSelect={handleSelect} />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'hot' && (
          <div>
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">全网热点</h3>
              <button onClick={loadHot} disabled={hotLoading} className="text-xs text-gray-500">{hotLoading ? '加载中...' : '↻ 刷新热点'}</button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotTopics.map((t, i) => <HotCard key={i} topic={t} onSelect={title => { handleSelect({ title }); setTab('topics') }} />)}
            </div>
          </div>
        )}

        {tab === 'pipeline' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-4">Agent 状态</h3>
              <div className="grid grid-cols-2 gap-3">
                {agents.map(a => <AgentCard key={a.id} agent={a} status={agentStates[a.id]} />)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-4">实时日志</h3>
              <div className="card border border-gray-800 h-[400px] overflow-y-auto bg-black/50">
                <div className="space-y-1 p-3">
                  {pipeline.logs.length === 0 ? (
                    <p className="text-xs text-gray-600 text-center py-4">选择选题后开始执行...</p>
                  ) : pipeline.logs.map((l, i) => <LogEntry key={i} log={l} />)}
                  {pipeline.running && <div className="flex gap-2 text-xs text-blue-400 mt-2"><span className="animate-pulse">◐</span><span>执行中...</span></div>}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-4">创作结果</h3>
              <div className="card border border-gray-800">
                {pipeline.result ? pipeline.result.success ? (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
                      <div><p className="text-sm font-medium text-green-400">创作完成</p><p className="text-xs text-gray-500">评分 {pipeline.result.score}/10</p></div>
                    </div>
                    <h4 className="font-medium text-sm mb-2">{pipeline.result.title}</h4>
                    <div className="bg-gray-900 rounded-lg p-3 max-h-[300px] overflow-y-auto">
                      <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">{pipeline.result.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4"><p className="text-red-400 text-sm mb-2">创作失败</p><p className="text-xs text-gray-500">{pipeline.result.error}</p></div>
                ) : (
                  <div className="text-center py-8"><p className="text-gray-500 text-sm">暂无结果</p><p className="text-gray-600 text-xs mt-1">选择选题开始创作</p></div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'scripts' && (
          <div className="card border border-gray-800 text-center py-12">
            <p className="text-gray-400 mb-2">文案库</p>
            <p className="text-gray-600 text-sm">从飞书文案库读取已发布的文案</p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 bg-black/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between text-xs text-gray-600">
          <div className="flex gap-4"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>飞书连接正常</span><span>DeepSeek: 就绪</span></div>
          <span>Powered by 多Agent协作</span>
        </div>
      </footer>
    </div>
  )
}
