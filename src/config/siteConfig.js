// ==================== 网站配置中心 ====================
// 所有模块的默认配置，支持 localStorage 覆盖

const DEFAULT_CONFIG = {
  // ===== Hero 区域配置 =====
  hero: {
    enabled: true,
    tag: '从甘肃深山到职业自由的普通人',
    avatar: '🧑‍💻', // 可以是 emoji 或图片 URL
    name: '小福',
    title: '你好，我是小福',
    subtitle: '一个人 + 7个AI Agent = 24小时帮你干活',
    motto: '少工作，多赚钱，以书为粮，以路为行',
    buttons: [
      { label: '自媒体+AI实验', link: '/works', icon: 'Zap', primary: true },
      { label: '读书', link: '#reading', icon: 'BookOpen', primary: false },
      { label: '锻炼', link: '#exercise', icon: 'Activity', primary: false },
    ],
  },

  // ===== 社交媒体配置 =====
  social: {
    enabled: true,
    title: '自媒体+AI实验',
    subtitle: '少工作多赚钱的路径：用AI放大个人产出，一个人干出一个小团队的量',
    platforms: [
      { name: '抖音', icon: '📱', fans: '1200', works: '45', color: '#000000', enabled: true },
      { name: '视频号', icon: '🎬', fans: '800', works: '32', color: '#07C160', enabled: true },
      { name: '快手', icon: '🎯', fans: '600', works: '28', color: '#FF4906', enabled: true },
      { name: '公众号', icon: '📝', fans: '350', works: '15', color: '#2D6A4F', enabled: true },
    ],
  },

  // ===== 作品展示配置 =====
  works: {
    enabled: true,
    title: '作品集',
    subtitle: '用 AI 放大个人产出，一个人干出一个小团队的量',
    showOnHero: true,
    // 项目分类（用于左侧筛选）
    categories: [
      { id: 'all', name: '全部作品', icon: 'grid', enabled: true },
      { id: 'ai-tools', name: 'AI 工具', icon: 'zap', enabled: true },
      { id: 'content', name: '内容创作', icon: 'pen', enabled: true },
      { id: 'automation', name: '自动化', icon: 'settings', enabled: true },
    ],
    // 开放合作区域
    collaboration: {
      enabled: true,
      title: '开放合作中',
      subtitle: '寻求 AI 产品开发与出海合作',
      buttonText: '联系我',
      buttonLink: '/connect',
    },
    items: [
      {
        id: 1,
        name: '多Agent内容创作运营系统',
        desc: '7个AI Agent 24小时自动化运营，选题→文案→发布→复盘全链路',
        icon: '🤖',
        color: '#6366F1',
        url: '/works',
        external: false,
        enabled: true,
        category: 'automation',
        features: ['React', 'Supabase', 'AI评审'],
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
        enabled: true,
        category: 'ai-tools',
        features: ['Next.js', 'FastAPI', 'LangGraph'],
        images: [
          'https://placehold.co/600x340/2D6A4F/ffffff?text=Video+Editor',
          'https://placehold.co/600x340/1B4332/ffffff?text=Style+Presets',
          'https://placehold.co/600x340/40916C/ffffff?text=Export+Panel',
        ],
      },
    ],
  },

  // ===== 读书模块配置 =====
  reading: {
    enabled: true,
    title: '读书 · 以书为粮',
    subtitle: '读有所思，思有所得',
    overview: {
      enabled: true,
      image: 'https://placehold.co/800x400/6366F1/ffffff?text=Reading+Journey+2026',
      target: 24,
      total: 12,
      pages: 3680,
      hours: 156,
      streak: 45,
    },
    current: {
      enabled: true,
      name: '纳瓦尔宝典',
      cover: '📚',
      progress: 68,
      summary: '财富是睡觉时也能赚钱的资产，代码和媒体是普通人的杠杆。',
      articleUrl: '/reading/naval-almanac',
    },
    records: [
      {
        id: 1,
        name: '穷查理宝典',
        cover: '📖',
        summary: '多元思维模型是理解世界的工具箱，掌握80-90个重要模型就能解决大部分问题。',
        note: '逆向思维、复利效应、能力圈边界',
        articleUrl: '/reading/poor-charlies-almanack',
        readAt: '2026-03-15',
        rating: 5,
        pages: 580,
        enabled: true,
        articleTopic: '',
        articleOutline: '',
        articleContent: '',
        articleUpdatedAt: '',
      },
      {
        id: 2,
        name: '原则',
        cover: '📖',
        summary: '极度透明 + 极度求真 = 高效决策。把决策过程系统化，避免重复犯错。',        note: '痛苦+反思=进步，可信度加权决策',
        articleUrl: '/reading/principles',
        readAt: '2026-02-20',
        rating: 5,
        pages: 592,
        enabled: true,
        articleTopic: '',
        articleOutline: '',
        articleContent: '',
        articleUpdatedAt: '',
      },
      {
        id: 3,
        name: '黑天鹅',
        cover: '📖',
        summary: '世界由极端、未知、小概率事件主导。不要预测，要构建抗脆弱性。',
        note: '极端斯坦、非线性、杠铃策略',
        articleUrl: '/reading/black-swan',
        readAt: '2026-01-10',
        rating: 4,
        pages: 450,
        enabled: true,
        articleTopic: '',
        articleOutline: '',
        articleContent: '',
        articleUpdatedAt: '',
      },
    ],
  },

  // ===== 跑步模块配置 =====
  exercise: {
    enabled: true,
    title: '锻炼 · 以路为行',
    motto: '不是自律，是习惯',
    stats: {
      enabled: true,
      streak: 30,
      yearDistance: 200,
      weekDistance: 15,
    },
    trajectory: {
      enabled: true,
      image: 'https://placehold.co/800x400/2D6A4F/ffffff?text=Running+Trajectory+Map',
      title: '跑步轨迹全貌',
      subtitle: '📍 兰州 → 天水 → 西安',
      description: '从甘肃深山出发，一路向东。每一步都是向前的路，每一公里都是自由的积累。',
    },
    records: [
      {
        id: 1,
        date: '2026-05-07',
        distance: 5.2,
        duration: '32:15',
        pace: '6\'12"',
        image: 'https://placehold.co/400x300/40916C/ffffff?text=Morning+Run',
        note: '晨跑，空气很好，听了《纳瓦尔宝典》的有声书。',
        articleUrl: '/exercise/morning-run-0507',
        enabled: true,
      },
      {
        id: 2,
        date: '2026-05-05',
        distance: 8.0,
        duration: '52:30',
        pace: '6\'33"',
        image: 'https://placehold.co/400x300/52B788/ffffff?text=Evening+Run',
        note: '傍晚跑，状态一般，但坚持下来了。跑步就是和自己的对话。',
        articleUrl: '/exercise/evening-run-0505',
        enabled: true,
      },
      {
        id: 3,
        date: '2026-05-02',
        distance: 10.0,
        duration: '65:00',
        pace: '6\'30"',
        image: 'https://placehold.co/400x300/74C69D/ffffff?text=Weekend+Long+Run',
        note: '周末长距离，突破10公里。最后一公里冲刺，感觉还能再跑。',
        articleUrl: '/exercise/weekend-longrun-0502',
        enabled: true,
      },
    ],
  },

  // ===== 关于我配置 =====
  about: {
    enabled: true,
    title: '联系小福',
    subtitle: '选择你喜欢的方式，随时找我聊聊',
    
    // 主视觉背景图
    heroImage: '',
    
    // 二维码（base64 或 URL）
    qrcodes: {
      wechat: '',           // 个人微信二维码
      wechatOfficial: '',   // 公众号二维码
    },
    
    // 快捷链接（底部胶囊按钮）
    quickLinks: [
      { icon: 'feishu', label: '飞书知识库', url: '#' },
      { icon: 'twitter', label: 'X (Twitter)', url: 'https://twitter.com/xiaofu' },
      { icon: 'github', label: 'GitHub', url: 'https://github.com/xiaofu' },
      { icon: 'location', label: '中国 · 甘肃', url: null },
    ],
    
    // 联系方式
    email: 'xiaofu@example.com',
    location: '中国 · 甘肃',
    copyright: '',
    
    // 社交图标（底部圆形图标行）
    contacts: [
      { name: 'GitHub', icon: 'github', url: 'https://github.com/xiaofu', enabled: true },
      { name: '推特', icon: 'twitter', url: 'https://twitter.com/xiaofu', enabled: true },
      { name: '抖音', icon: '📱', url: 'https://douyin.com/user/xiaofu', enabled: true },
      { name: '邮箱', icon: 'mail', url: 'mailto:xiaofu@example.com', enabled: true },
    ],
  },

  // ===== 主题配置 =====
  theme: {
    primaryColor: '#2D6A4F',
    darkMode: 'auto', // 'light' | 'dark' | 'auto'
  },
}

// ==================== 配置管理工具 ====================

const CONFIG_KEY = 'portfolio_config_v1'

export function getConfig() {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  
  try {
    const saved = localStorage.getItem(CONFIG_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // 用户配置优先，直接使用，不合并默认值
      // 这样用户修改后的配置不会被默认值覆盖
      return parsed
    }
  } catch (e) {
    console.error('Failed to load config:', e)
  }
  
  // 首次加载，保存默认配置到 localStorage
  const initial = JSON.parse(JSON.stringify(DEFAULT_CONFIG))
  localStorage.setItem(CONFIG_KEY, JSON.stringify(initial))
  return initial
}

export function saveConfig(config) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    // 通知同标签页的页面更新配置
    window.dispatchEvent(new Event('configUpdated'))
    return true
  } catch (e) {
    console.error('Failed to save config:', e)
    return false
  }
}

export function resetConfig() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CONFIG_KEY)
}

export function exportConfig() {
  const config = getConfig()
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `portfolio-config-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importConfig(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result)
        saveConfig(config)
        resolve(config)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// 深度合并工具
function deepMerge(defaults, overrides) {
  const result = { ...defaults }
  
  for (const key in overrides) {
    if (overrides[key] !== null && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
      result[key] = deepMerge(defaults[key] || {}, overrides[key])
    } else {
      result[key] = overrides[key]
    }
  }
  
  return result
}

// Hook for React
export function useSiteConfig() {
  const [config, setConfigState] = useState(() => getConfig())
  
  const setConfig = (newConfig) => {
    setConfigState(newConfig)
    saveConfig(newConfig)
  }
  
  const updateModule = (moduleName, moduleConfig) => {
    const updated = {
      ...config,
      [moduleName]: { ...config[moduleName], ...moduleConfig },
    }
    setConfig(updated)
  }
  
  return { config, setConfig, updateModule, reset: resetConfig }
}

export default DEFAULT_CONFIG
