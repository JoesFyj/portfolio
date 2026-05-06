/**
 * 内容运营系统 API
 * 连接6个Agent实现自动化内容创作流水线
 */

import { supabase, isSupabaseConfigured } from './supabase'

// ========== 数据模型 ==========

// 选题
export async function getTopics(filters = {}) {
  if (!isSupabaseConfigured()) {
    // localStorage fallback
    const data = JSON.parse(localStorage.getItem('contentops_topics') || '[]')
    return { data, error: null }
  }
  
  let query = supabase.from('topics').select('*').order('created_at', { ascending: false })
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.priority) query = query.eq('priority', filters.priority)
  
  return await query
}

export async function createTopic(topic) {
  const record = {
    ...topic,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    status: 'pending'
  }
  
  if (!isSupabaseConfigured()) {
    const existing = JSON.parse(localStorage.getItem('contentops_topics') || '[]')
    localStorage.setItem('contentops_topics', JSON.stringify([record, ...existing]))
    return { data: record, error: null }
  }
  
  return await supabase.from('topics').insert(record).select().single()
}

// 文案
export async function getScripts(filters = {}) {
  if (!isSupabaseConfigured()) {
    const data = JSON.parse(localStorage.getItem('contentops_scripts') || '[]')
    return { data, error: null }
  }
  
  let query = supabase.from('scripts').select('*').order('created_at', { ascending: false })
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.topic_id) query = query.eq('topic_id', filters.topic_id)
  
  return await query
}

export async function createScript(script) {
  const record = {
    ...script,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    status: 'draft',
    score: null
  }
  
  if (!isSupabaseConfigured()) {
    const existing = JSON.parse(localStorage.getItem('contentops_scripts') || '[]')
    localStorage.setItem('contentops_scripts', JSON.stringify([record, ...existing]))
    return { data: record, error: null }
  }
  
  return await supabase.from('scripts').insert(record).select().single()
}

export async function updateScript(id, updates) {
  if (!isSupabaseConfigured()) {
    const existing = JSON.parse(localStorage.getItem('contentops_scripts') || '[]')
    const updated = existing.map(s => s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s)
    localStorage.setItem('contentops_scripts', JSON.stringify(updated))
    return { data: updated.find(s => s.id === id), error: null }
  }
  
  return await supabase.from('scripts').update(updates).eq('id', id).select().single()
}

// 发布记录
export async function getPublications() {
  if (!isSupabaseConfigured()) {
    const data = JSON.parse(localStorage.getItem('contentops_publications') || '[]')
    return { data, error: null }
  }
  
  return await supabase.from('publications').select('*').order('published_at', { ascending: false })
}

export async function createPublication(pub) {
  const record = {
    ...pub,
    id: crypto.randomUUID(),
    published_at: new Date().toISOString(),
    stats: {}
  }
  
  if (!isSupabaseConfigured()) {
    const existing = JSON.parse(localStorage.getItem('contentops_publications') || '[]')
    localStorage.setItem('contentops_publications', JSON.stringify([record, ...existing]))
    return { data: record, error: null }
  }
  
  return await supabase.from('publications').insert(record).select().single()
}

// ========== Agent 模拟执行 ==========

// 模拟选题Agent
export async function runTopicAgent() {
  // 实际应该调用 sessions_spawn 启动 subagent
  // 这里先模拟返回
  await new Promise(r => setTimeout(r, 2000))
  
  const mockTopics = [
    {
      title: '体面消费：你买的不是东西，是身份幻觉',
      angle: '从五一假期消费现象切入，拆解"体面税"本质',
      priority: 'high',
      reason: '热点+反常识，符合账号定位'
    },
    {
      title: 'AI三年：被控住的人，和找到出路的人',
      angle: '个人经历+行业观察，真实有共鸣',
      priority: 'high',
      reason: '个人故事+干货，完播率高'
    },
    {
      title: '为什么你越努力越穷？',
      angle: '时间换钱的陷阱，财富逻辑类',
      priority: 'medium',
      reason: '经典选题，但需要新角度'
    }
  ]
  
  return { success: true, topics: mockTopics }
}

// 模拟内容Agent
export async function runContentAgent(topic) {
  await new Promise(r => setTimeout(r, 3000))
  
  const mockScript = `五一你花了3000块。

其中至少1000块，是白给的。

不是被偷了，是你主动交的"体面税"。

酒店涨三倍，你知道是割韭菜，但还是订了。
网红餐厅排队两小时，你知道不好吃，但还是去了。

为什么？

因为你怕在朋友圈丢脸。

我们这一代人，正在被"体面"绑架。

买贵的不买对的，不是因为傻，是因为焦虑。

但真相是：

真正的体面，不是花给别人看的。

是你银行卡里的数字，是你随时可以说不的自由。

下次购物前，问自己三个问题：

1. 没有它，我会死吗？
2. 买它是为了用，还是为了晒？
3. 这笔钱如果存下来，一年后值多少？

体面消费买的不是东西，是你放弃的选择权。`
  
  return { success: true, script: mockScript, title: topic.title }
}

// 模拟评审Agent
export async function runReviewAgent(script) {
  await new Promise(r => setTimeout(r, 1500))
  
  // 模拟评分
  const scores = {
    hook: Math.floor(Math.random() * 3) + 7,      // 7-10
    structure: Math.floor(Math.random() * 3) + 7,
    data: Math.floor(Math.random() * 4) + 6,      // 6-10
    fluff: Math.floor(Math.random() * 3) + 7,
    retention: Math.floor(Math.random() * 3) + 7
  }
  
  const total = Math.round((scores.hook + scores.structure + scores.data + scores.fluff + scores.retention) / 5)
  
  return {
    success: true,
    passed: total >= 8,
    score: total,
    details: scores,
    feedback: total >= 8 
      ? '文案通过，可以发布'
      : '开头钩子需要加强，建议重写'
  }
}

// 模拟发布Agent
export async function runPublishAgent(script, platforms) {
  await new Promise(r => setTimeout(r, 2000))
  
  const results = platforms.map(platform => ({
    platform,
    success: true,
    url: platform === 'wechat' 
      ? 'https://mp.weixin.qq.com/...'
      : platform === 'douyin'
        ? 'https://douyin.com/...'
        : 'https://xiaohongshu.com/...',
    status: 'published'
  }))
  
  return { success: true, results }
}

// ========== 完整流水线 ==========

export async function runFullPipeline(topicId, platforms = ['wechat']) {
  const logs = []
  const addLog = (msg, type = 'info') => logs.push({ time: new Date().toLocaleTimeString(), msg, type })
  
  try {
    // 1. 获取选题
    addLog('【统筹Agent】启动完整流水线...', 'info')
    
    // 2. 内容创作
    addLog('【内容Agent】开始创作...', 'process')
    const { script, title } = await runContentAgent({ title: '自动选题' })
    addLog('【内容Agent】初稿完成', 'success')
    
    // 3. 评审
    addLog('【评审Agent】开始评分...', 'process')
    const review = await runReviewAgent(script)
    addLog(`【评审Agent】评分 ${review.score}/10，${review.passed ? '通过' : '打回'}`, review.passed ? 'success' : 'warning')
    
    if (!review.passed) {
      addLog('【统筹Agent】文案被打回，进入重写循环...', 'warning')
      // 实际应该循环最多3次
    }
    
    // 4. 保存文案
    const { data: scriptRecord } = await createScript({
      title,
      content: script,
      score: review.score,
      status: review.passed ? 'approved' : 'rejected'
    })
    
    // 5. 发布
    if (review.passed) {
      addLog('【发布Agent】开始分发...', 'process')
      const pub = await runPublishAgent(script, platforms)
      addLog('【发布Agent】发布完成', 'success')
      
      // 6. 保存发布记录
      for (const result of pub.results) {
        await createPublication({
          script_id: scriptRecord.id,
          platform: result.platform,
          url: result.url,
          status: 'published'
        })
      }
    }
    
    addLog('【统筹Agent】流水线执行完毕', 'success')
    
    return { success: true, logs, scriptId: scriptRecord?.id }
    
  } catch (err) {
    addLog(`【错误】${err.message}`, 'error')
    return { success: false, logs, error: err.message }
  }
}

// ========== 热点抓取 ==========

export async function fetchHotTopics() {
  // 实际应该调用 hot/hot-topics skill
  // 这里返回模拟数据
  await new Promise(r => setTimeout(r, 1000))
  
  return [
    { source: '知乎', title: '为什么年轻人不愿意结婚了？', heat: 9823 },
    { source: '微博', title: '五一假期消费数据出炉', heat: 8756 },
    { source: '即刻', title: 'AI工具对自媒体的影响', heat: 6543 },
    { source: '小红书', title: '体制内副业攻略', heat: 5432 },
    { source: 'B站', title: '普通人如何逆袭', heat: 4321 },
  ]
}
