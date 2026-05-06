import { useState, useEffect } from 'react'
import { 
  Bot, Sparkles, FileText, Eye, Send, BarChart3, RotateCcw, 
  CheckCircle2, XCircle, Clock, ArrowRight, Database, Zap,
  Target, Users, Layout, Cpu, MessageSquare, TrendingUp,
  Plus, Play, Pause, Trash2, Edit3, ExternalLink, RefreshCw
} from 'lucide-react'
import { 
  getTopics, createTopic, getScripts, createScript, updateScript,
  getPublications, runTopicAgent, runContentAgent, runReviewAgent,
  runPublishAgent, runFullPipeline, fetchHotTopics
} from '../lib/contentOpsApi'

// 品牌色
const BRAND = {
  green: '#2D6A4F',
  gold: '#E9C46A',
  earth: '#D4A373',
  cream: '#FAF9F6',
}

// 6个Agent配置
const AGENTS = [
  {
    id: 'topic',
    name: '选题Agent',
    code: 'SC-01',
    role: '情报员',
    icon: Target,
    color: '#3B82F6',
    desc: '全网热点采集、竞品爆款追踪、关键词情报',
    inputs: ['热点数据源', '历史爆款库', '账号定位'],
    outputs: ['候选选题列表', '角度建议', '优先级排序'],
  },
  {
    id: 'content',
    name: '内容Agent',
    code: 'CC-01',
    role: '创作者',
    icon: FileText,
    color: '#8B5CF6',
    desc: '爆款结构写作、人设风格锁定、多版本生成',
    inputs: ['选题', '风格档案', '对标案例'],
    outputs: ['文案初稿', '备选标题', '关键词标签'],
  },
  {
    id: 'review',
    name: '评审Agent',
    code: 'SE-01',
    role: '分析师',
    icon: Eye,
    color: '#F59E0B',
    desc: '六维量化评分、优先级排序、创作角度建议',
    inputs: ['文案初稿', '评分维度'],
    outputs: ['综合评分', '通过/打回', '改进建议'],
  },
  {
    id: 'visual',
    name: '视觉Agent',
    code: 'IG-01',
    role: '设计师',
    icon: Layout,
    color: '#EC4899',
    desc: '封面+内图生成、卡通/专业双风格',
    inputs: ['文案主题', '品牌风格'],
    outputs: ['封面图', '配图素材', '排版方案'],
  },
  {
    id: 'publish',
    name: '运营执行Agent',
    code: 'PU-01',
    role: '执行者',
    icon: Send,
    color: '#10B981',
    desc: '浏览器自动化发布、敏感词检测、发布状态回写',
    inputs: ['终稿文案', '视觉素材', '发布平台'],
    outputs: ['发布链接', '状态报告', '错误日志'],
  },
  {
    id: 'analyze',
    name: '数据复盘Agent',
    code: 'AN-01',
    role: '策略师',
    icon: BarChart3,
    color: '#06B6D4',
    desc: '互动数据采集、多维分析、策略反哺闭环',
    inputs: ['发布记录', '平台数据API'],
    outputs: ['数据报告', '复盘建议', '下次计划'],
  },
]

// SOP流程步骤
const SOP_STEPS = [
  { id: 'collect', name: '选题采集', icon: Target },
  { id: 'evaluate', name: '选题评估', icon: Eye },
  { id: 'create', name: '内容创作', icon: FileText },
  { id: 'design', name: '视觉设计', icon: Layout },
  { id: 'execute', name: '运营执行', icon: Send },
  { id: 'review_data', name: '数据复盘', icon: BarChart3 },
  { id: 'feedback', name: '反哺闭环', icon: RotateCcw },
]

export default function ContentOps({ theme = 'light' }) {
  const isDark = theme === 'dark'
  const [activeTab, setActiveTab] = useState('overview')
  const [running, setRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [logs, setLogs] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  
  // 数据状态
  const [topics, setTopics] = useState([])
  const [scripts, setScripts] = useState([])
  const [publications, setPublications] = useState([])
  const [hotTopics, setHotTopics] = useState([])
  const [loading, setLoading] = useState(false)

  const bg = isDark ? '#0D1117' : BRAND.cream
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [t, s, p] = await Promise.all([
      getTopics(),
      getScripts(),
      getPublications()
    ])
    if (t.data) setTopics(t.data)
    if (s.data) setScripts(s.data)
    if (p.data) setPublications(p.data)
  }

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }])
  }

  // 运行完整流水线
  const runPipeline = async () => {
    setRunning(true)
    setLogs([])
    
    const result = await runFullPipeline(null, ['wechat'])
    
    setLogs(result.logs)
    setRunning(false)
    
    if (result.success) {
      await loadData() // 刷新数据
    }
  }

  // 抓取热点
  const fetchHot = async () => {
    setLoading(true)
    addLog('【选题Agent】正在抓取全网热点...', 'process')
    const hot = await fetchHotTopics()
    setHotTopics(hot)
    addLog(`【选题Agent】抓取完成，发现 ${hot.length} 条热点`, 'success')
    setLoading(false)
  }

  // 创建选题
  const handleCreateTopic = async (topicData) => {
    const { data, error } = await createTopic(topicData)
    if (data) {
      setTopics(prev => [data, ...prev])
      addLog(`【选题Agent】新选题已入库: ${topicData.title}`, 'success')
    }
    return { data, error }
  }

  // 渲染内容根据tab
  const renderContent = () => {
    switch (activeTab) {
      case 'topics':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold" style={{ color: text }}>选题库 ({topics.length})</h3>
              <button
                onClick={fetchHot}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: BRAND.green, color: '#FFFFFF' }}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                抓取热点
              </button>
            </div>
            
            {/* 热点推荐 */}
            {hotTopics.length > 0 && (
              <div className="rounded-xl p-4 mb-4" style={{ background: isDark ? '#0D1117' : '#F3F4F6' }}>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: muted }}>热点推荐</h4>
                <div className="space-y-2">
                  {hotTopics.map((hot, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:opacity-80"
                      style={{ background: cardBg, border: `1px solid ${border}` }}
                      onClick={() => handleCreateTopic({
                        title: hot.title,
                        source: hot.source,
                        heat: hot.heat,
                        priority: hot.heat > 8000 ? 'high' : 'medium'
                      })}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: BRAND.green + '20', color: BRAND.green }}>
                          {hot.source}
                        </span>
                        <span className="text-sm" style={{ color: text }}>{hot.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} style={{ color: hot.heat > 8000 ? '#EF4444' : muted }} />
                        <span className="text-xs" style={{ color: muted }}>{hot.heat}</span>
                        <Plus size={14} style={{ color: BRAND.green }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 选题列表 */}
            <div className="space-y-2">
              {topics.map(topic => (
                <div 
                  key={topic.id}
                  className="p-4 rounded-xl flex items-center justify-between"
                  style={{ background: cardBg, border: `1px solid ${border}` }}
                >
                  <div>
                    <div className="font-medium mb-1" style={{ color: text }}>{topic.title}</div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: muted }}>
                      <span>{topic.source || '手动创建'}</span>
                      <span>·</span>
                      <span style={{ 
                        color: topic.priority === 'high' ? '#EF4444' : 
                               topic.priority === 'medium' ? '#F59E0B' : '#6B7280'
                      }}>
                        {topic.priority === 'high' ? '高优先级' : 
                         topic.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => runContentAgent(topic)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: BRAND.green, color: '#FFFFFF' }}
                  >
                    创作
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'scripts':
        return (
          <div className="space-y-4">
            <h3 className="font-bold" style={{ color: text }}>文案库 ({scripts.length})</h3>
            <div className="space-y-3">
              {scripts.map(script => (
                <div 
                  key={script.id}
                  className="p-4 rounded-xl"
                  style={{ background: cardBg, border: `1px solid ${border}` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium" style={{ color: text }}>{script.title}</div>
                    <div className="flex items-center gap-2">
                      {script.score && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ 
                            background: script.score >= 8 ? '#10B98120' : '#F59E0B20',
                            color: script.score >= 8 ? '#10B981' : '#F59E0B'
                          }}
                        >
                          {script.score}分
                        </span>
                      )}
                      <span 
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ 
                          background: script.status === 'approved' ? '#10B98120' : 
                                     script.status === 'published' ? '#3B82F620' : '#6B728020',
                          color: script.status === 'approved' ? '#10B981' : 
                                script.status === 'published' ? '#3B82F6' : '#6B7280'
                        }}
                      >
                        {script.status === 'approved' ? '已通过' : 
                         script.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm line-clamp-3 mb-3" style={{ color: muted }}>
                    {script.content}
                  </p>
                  <div className="flex items-center gap-2">
                    {script.status === 'approved' && (
                      <button
                        onClick={() => runPublishAgent(script.content, ['wechat'])}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: BRAND.green, color: '#FFFFFF' }}
                      >
                        <Send size={12} />
                        发布
                      </button>
                    )}
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
                      style={{ background: isDark ? '#30363D' : '#E5E7EB', color: text }}
                    >
                      <Edit3 size={12} />
                      编辑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'publications':
        return (
          <div className="space-y-4">
            <h3 className="font-bold" style={{ color: text }}>发布记录 ({publications.length})</h3>
            <div className="space-y-2">
              {publications.map(pub => (
                <div 
                  key={pub.id}
                  className="p-4 rounded-xl flex items-center justify-between"
                  style={{ background: cardBg, border: `1px solid ${border}` }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ 
                          background: pub.platform === 'wechat' ? '#10B98120' : 
                                     pub.platform === 'douyin' ? '#00000020' : '#FF244220',
                          color: pub.platform === 'wechat' ? '#10B981' : 
                                pub.platform === 'douyin' ? '#000000' : '#FF2442'
                        }}
                      >
                        {pub.platform === 'wechat' ? '公众号' : 
                         pub.platform === 'douyin' ? '抖音' : '小红书'}
                      </span>
                      <span className="text-xs" style={{ color: muted }}>
                        {new Date(pub.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: text }}>{pub.url}</div>
                  </div>
                  <a 
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg"
                    style={{ background: isDark ? '#0D1117' : '#F3F4F6' }}
                  >
                    <ExternalLink size={14} style={{ color: muted }} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: bg }}>
      {/* Hero Section - 全局架构图 */}
      <section className="pt-12 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* 标题区 */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3" style={{ color: text }}>
              小福内容运营系统 · 全链路架构
            </h1>
            <p className="text-sm mb-4" style={{ color: muted }}>
              Multi-Agent Autonomous Content Operations Platform
            </p>
            {/* 紫色渐变标签条 */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
              style={{ 
                background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%)',
                color: '#FFFFFF'
              }}
            >
              <span>SOP</span>
              <ArrowRight size={12} />
              <span>SKILL</span>
              <ArrowRight size={12} />
              <span>AGENT</span>
              <ArrowRight size={12} />
              <span>飞书数据中枢驱动</span>
            </div>
          </div>

          {/* 核心链路 SOP */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: muted }}>
              <Zap size={14} />
              核心链路 SOP
            </h3>
            <div 
              className="rounded-2xl p-6"
              style={{ background: cardBg, border: `1px solid ${border}` }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                {SOP_STEPS.map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-2 md:gap-4">
                    <div 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: idx <= currentStep && running 
                          ? 'rgba(139, 92, 246, 0.15)' 
                          : idx < currentStep 
                            ? 'rgba(45, 106, 79, 0.1)'
                            : 'rgba(107, 104, 96, 0.05)',
                        color: idx <= currentStep && running 
                          ? '#8B5CF6' 
                          : idx < currentStep 
                            ? BRAND.green 
                            : muted,
                        border: `1px solid ${idx <= currentStep ? (idx === currentStep && running ? '#8B5CF6' : BRAND.green) : border}`,
                      }}
                    >
                      <step.icon size={14} />
                      <span className="hidden md:inline">{step.name}</span>
                    </div>
                    {idx < SOP_STEPS.length - 1 && (
                      <ArrowRight size={14} style={{ color: muted }} />
                    )}
                  </div>
                ))}
              </div>

              {/* 运行控制 */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={runPipeline}
                  disabled={running}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                  style={{ 
                    background: BRAND.green, 
                    color: '#FFFFFF',
                    boxShadow: running ? 'none' : '0 4px 14px rgba(45, 106, 79, 0.3)'
                  }}
                >
                  {running ? <Clock size={16} className="animate-spin" /> : <Zap size={16} />}
                  {running ? '执行中...' : '启动创作流水线'}
                </button>
                {running && (
                  <button
                    onClick={() => setRunning(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium"
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
                  >
                    停止
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Agent 层架构 */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: muted }}>
              <Cpu size={14} />
              Agent 层 · 智能体层 · OPENCLAW RUNTIME
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className="rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ 
                    background: cardBg, 
                    border: `1px solid ${selectedAgent?.id === agent.id ? agent.color : border}`,
                    boxShadow: selectedAgent?.id === agent.id ? `0 0 0 2px ${agent.color}20` : 'none'
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${agent.color}15` }}
                    >
                      <agent.icon size={20} style={{ color: agent.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm" style={{ color: text }}>{agent.name}</span>
                        <span 
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ background: `${agent.color}15`, color: agent.color }}
                        >
                          {agent.code}
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: muted }}>{agent.role}</span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: muted }}>
                    {agent.desc}
                  </p>
                  <div className="flex items-center gap-4 text-[10px]" style={{ color: muted }}>
                    <span className="flex items-center gap-1">
                      <Database size={10} />
                      {agent.inputs.length} 输入
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={10} />
                      {agent.outputs.length} 输出
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 数据工作区 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Tab 切换 */}
            <div className="lg:col-span-1">
              <div 
                className="rounded-2xl p-4 sticky top-24"
                style={{ background: cardBg, border: `1px solid ${border}` }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: muted }}>
                  数据工作区
                </h3>
                <div className="space-y-1">
                  {[
                    { id: 'topics', label: '选题库', count: topics.length, icon: Target },
                    { id: 'scripts', label: '文案库', count: scripts.length, icon: FileText },
                    { id: 'publications', label: '发布记录', count: publications.length, icon: Send },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all"
                      style={{
                        background: activeTab === tab.id ? BRAND.green : 'transparent',
                        color: activeTab === tab.id ? '#FFFFFF' : text,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <tab.icon size={16} />
                        {tab.label}
                      </div>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : isDark ? '#0D1117' : '#F3F4F6',
                          color: activeTab === tab.id ? '#FFFFFF' : muted
                        }}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 内容区 */}
            <div className="lg:col-span-2">
              <div 
                className="rounded-2xl p-6 min-h-[400px]"
                style={{ background: cardBg, border: `1px solid ${border}` }}
              >
                {renderContent()}
              </div>
            </div>
          </div>

          {/* 数据中枢状态 */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: muted }}>
              <Database size={14} />
              数据中枢 · 飞书多维表
            </h3>
            <div 
              className="rounded-2xl p-6"
              style={{ background: cardBg, border: `1px solid ${border}` }}
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: '选题库', status: 'connected', records: topics.length },
                  { name: '文案库', status: 'connected', records: scripts.length },
                  { name: '素材库', status: 'connected', records: 0 },
                  { name: '发布记录', status: 'connected', records: publications.length },
                  { name: '运营复盘', status: 'syncing', records: 0 },
                ].map((db) => (
                  <div 
                    key={db.name}
                    className="text-center p-4 rounded-xl"
                    style={{ background: isDark ? '#0D1117' : '#FAF9F6' }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mx-auto mb-2"
                      style={{ 
                        background: db.status === 'connected' ? '#10B981' : '#F59E0B',
                        boxShadow: db.status === 'connected' 
                          ? '0 0 8px #10B981' 
                          : '0 0 8px #F59E0B'
                      }}
                    />
                    <div className="text-sm font-medium mb-1" style={{ color: text }}>{db.name}</div>
                    <div className="text-xs" style={{ color: muted }}>{db.records} 条记录</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 运行日志 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: muted }}>
              <MessageSquare size={14} />
              实时日志
            </h3>
            <div 
              className="rounded-2xl p-4 font-mono text-xs h-64 overflow-y-auto"
              style={{ background: isDark ? '#0D1117' : '#1C1C1E', color: '#E6EDF3' }}
            >
              {logs.length === 0 ? (
                <span style={{ color: '#6B7280' }}>// 点击"启动创作流水线"开始运行...</span>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="mb-1">
                    <span style={{ color: '#6B7280' }}>[{log.time}]</span>{' '}
                    <span style={{ 
                      color: log.type === 'success' ? '#10B981' : 
                             log.type === 'warning' ? '#F59E0B' : 
                             log.type === 'process' ? '#8B5CF6' : 
                             log.type === 'error' ? '#EF4444' : '#E6EDF3'
                    }}>
                      {log.msg}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Agent 详情弹窗 */}
      {selectedAgent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedAgent(null)}
        >
          <div 
            className="rounded-2xl p-6 max-w-lg w-full"
            style={{ background: cardBg, border: `1px solid ${border}` }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${selectedAgent.color}15` }}
              >
                <selectedAgent.icon size={24} style={{ color: selectedAgent.color }} />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: text }}>{selectedAgent.name}</h3>
                <span className="text-sm" style={{ color: muted }}>{selectedAgent.code} · {selectedAgent.role}</span>
              </div>
            </div>
            
            <p className="text-sm mb-6" style={{ color: text }}>{selectedAgent.desc}</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: muted }}>输入</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.inputs.map((input) => (
                    <span 
                      key={input}
                      className="px-2 py-1 rounded text-xs"
                      style={{ background: isDark ? '#0D1117' : '#F3F4F6', color: muted }}
                    >
                      {input}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: muted }}>输出</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.outputs.map((output) => (
                    <span 
                      key={output}
                      className="px-2 py-1 rounded text-xs"
                      style={{ background: `${selectedAgent.color}15`, color: selectedAgent.color }}
                    >
                      {output}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedAgent(null)}
              className="mt-6 w-full py-2 rounded-lg text-sm font-medium"
              style={{ background: isDark ? '#30363D' : '#E5E7EB', color: text }}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
