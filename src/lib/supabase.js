import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not configured. Using localStorage fallback.')
}

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

export const isSupabaseConfigured = () => !!supabase

// ============ Projects API ============

export async function getProjects(category = null) {
  if (!supabase) return getLocalProjects(category)
  
  let query = supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false })
  
  if (category && category !== '全部') {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  if (error) {
    console.error('Failed to fetch projects:', error)
    return getLocalProjects(category)
  }
  return data
}

export async function getProjectBySlug(slug) {
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Failed to fetch project:', error)
    return null
  }
  return data
}

export async function createProject(project) {
  if (!supabase) return saveLocalProject(project)
  
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateProject(id, updates) {
  if (!supabase) return updateLocalProject(id, updates)
  
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  if (!supabase) return deleteLocalProject(id)
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getProjectCategories() {
  if (!supabase) {
    const projects = getLocalProjects()
    return ['全部', ...new Set(projects.map(p => p.category))]
  }
  
  const { data, error } = await supabase
    .from('projects')
    .select('category')
    .order('category')
  
  if (error) {
    console.error('Failed to fetch categories:', error)
    return ['全部']
  }
  return ['全部', ...new Set(data.map(p => p.category))]
}

// ============ Journey API ============

export async function getReadingBooks(status = null) {
  if (!supabase) return getLocalReading(status)
  
  let query = supabase
    .from('journey_reading')
    .select('*')
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false })
  
  if (status) query = query.eq('status', status)
  
  const { data, error } = await query
  if (error) {
    console.error('Failed to fetch reading:', error)
    return []
  }
  return data
}

export async function getFitnessRecords(days = 30) {
  if (!supabase) return getLocalFitness(days)
  
  const since = new Date()
  since.setDate(since.getDate() - days)
  
  const { data, error } = await supabase
    .from('journey_fitness')
    .select('*')
    .gte('date', since.toISOString().split('T')[0])
    .order('date', { ascending: false })
  
  if (error) {
    console.error('Failed to fetch fitness:', error)
    return []
  }
  return data
}

export async function getMilestones(category = null) {
  if (!supabase) return getLocalMilestones(category)
  
  let query = supabase
    .from('journey_milestones')
    .select('*')
    .order('date', { ascending: false })
  
  if (category) query = query.eq('category', category)
  
  const { data, error } = await query
  if (error) {
    console.error('Failed to fetch milestones:', error)
    return []
  }
  return data
}

export async function getMediaStats() {
  if (!supabase) return getLocalMediaStats()
  
  const { data, error } = await supabase
    .from('journey_media')
    .select('*')
    .order('recorded_at', { ascending: false })
  
  if (error) {
    console.error('Failed to fetch media stats:', error)
    return []
  }
  return data
}

export async function getSiteConfig() {
  if (!supabase) return getLocalSiteConfig()
  
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .eq('id', 1)
    .single()
  
  if (error) {
    console.error('Failed to fetch site config:', error)
    return getLocalSiteConfig()
  }
  return data
}

// ============ Local Fallback (when Supabase not configured) ============

const LOCAL_KEY = 'xiaofu_site_data'

function getLocalData() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}')
  } catch { return {} }
}

function saveLocalData(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

function getLocalProjects(category) {
  const data = getLocalData()
  let projects = data.projects || getDefaultProjects()
  if (category && category !== '全部') {
    projects = projects.filter(p => p.category === category)
  }
  return projects
}

function saveLocalProject(project) {
  const data = getLocalData()
  if (!data.projects) data.projects = getDefaultProjects()
  const p = { ...project, id: crypto.randomUUID(), created_at: new Date().toISOString() }
  data.projects.push(p)
  saveLocalData(data)
  return p
}

function updateLocalProject(id, updates) {
  const data = getLocalData()
  if (!data.projects) return null
  const idx = data.projects.findIndex(p => p.id === id)
  if (idx === -1) return null
  data.projects[idx] = { ...data.projects[idx], ...updates, updated_at: new Date().toISOString() }
  saveLocalData(data)
  return data.projects[idx]
}

function deleteLocalProject(id) {
  const data = getLocalData()
  if (!data.projects) return
  data.projects = data.projects.filter(p => p.id !== id)
  saveLocalData(data)
}

function getLocalReading(status) {
  const data = getLocalData()
  let books = data.reading || []
  if (status) books = books.filter(b => b.status === status)
  return books
}

function getLocalFitness(days) {
  const data = getLocalData()
  return data.fitness || []
}

function getLocalMilestones(category) {
  const data = getLocalData()
  let ms = data.milestones || getDefaultMilestones()
  if (category) ms = ms.filter(m => m.category === category)
  return ms
}

function getLocalMediaStats() {
  const data = getLocalData()
  return data.media || []
}

function getLocalSiteConfig() {
  const data = getLocalData()
  return data.config || {
    hero_title: '山里人的财商课',
    hero_subtitle: '用AI给自己造一条自由的路',
    hero_slogan: '少工作，多赚钱，以书为粮，以路为行',
  }
}

function getDefaultProjects() {
  return [
    {
      id: '1',
      name: 'VideoGenerator V2',
      slug: 'video-generator-v2',
      cover: '',
      description: '动画视频自动生成引擎，5套风格预设，支持列表和接力问题两种模式',
      full_description: '基于React Canvas的动画视频生成工具，支持5种风格预设（知识科普/暖色人文/硬核干货/清新简约/山野自然），自动布局引擎根据条目数量自适应排列，一键导出MP4。',
      category: 'AI工具',
      tags: ['React', 'Canvas', 'Animation', 'FFmpeg'],
      demo_url: '/vgen',
      status: 'beta',
      featured: true,
      sort_order: 100,
    },
    {
      id: '2',
      name: 'WechatFormatter',
      slug: 'wechat-formatter',
      cover: '',
      description: '微信公众号排版工具，6种风格一键复制，告别135编辑器',
      full_description: '微信公众号文章排版美化工具，支持6种预设风格（蓝色杂志/温暖文学/简约黑白/清新绿/葡萄紫/总结马赛克），Markdown导入，一键复制HTML到公众号后台。',
      category: 'AI工具',
      tags: ['React', 'Markdown', 'CSS'],
      demo_url: '/gen',
      status: 'live',
      featured: true,
      sort_order: 90,
    },
    {
      id: '3',
      name: '多Agent内容创作系统',
      slug: 'multi-agent-content',
      cover: '',
      description: '7个AI Agent协作的内容生产线，从选题到发布全自动',
      full_description: '基于OpenClaw Subagent的多Agent内容创作系统。选题Agent抓热点、写作Agent写初稿、评审Agent打分把关、格式适配Agent分平台优化。飞书多维表作为数据中枢，形成选题-创作-发布-复盘闭环。',
      category: 'AI工具',
      tags: ['OpenClaw', 'Agent', 'Automation'],
      demo_url: '',
      status: 'wip',
      featured: true,
      sort_order: 80,
    },
    {
      id: '4',
      name: '抖音数据分析系统',
      slug: 'douyin-analytics',
      cover: '',
      description: '抖音账号数据追踪+对标账号分析+飞书多维表管理',
      full_description: '抖音自媒体运营数据系统。视频数据追踪、5个对标账号爆款拆解、飞书多维表（选题库/文案库/数据复盘）联动。支持抖音链接解析入库，自动分析数据给推荐理由。',
      category: '自媒体运营',
      tags: ['Python', '飞书API', '数据分析'],
      demo_url: '',
      status: 'live',
      featured: false,
      sort_order: 70,
    },
  ]
}

function getDefaultMilestones() {
  return [
    { id: '1', title: '从甘肃深山到西安', description: '靠读书走出大山，考上大学', category: '人生', date: '2015-09-01', icon: '🏔️' },
    { id: '2', title: '开始做自媒体', description: '公众号「小福AI自由」上线', category: '自媒体', date: '2025-10-01', icon: '✍️' },
    { id: '3', title: '抖音账号启动', description: '「小福分享舍」正式运营', category: '自媒体', date: '2026-03-01', icon: '🎬' },
    { id: '4', title: '完成第一个视频生成器', description: 'VideoGenerator V2上线', category: '自媒体', date: '2026-04-15', icon: '🛠️' },
  ]
}
