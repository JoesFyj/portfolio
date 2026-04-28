/**
 * 主题配置 - 统一的3套主题配置
 */

export const THEMES = {
  // ============================================================
  // 中国风
  // ============================================================
  chinese: {
    id: 'chinese',
    name: '中国风',
    icon: '🏮',
    description: '传统文化风格 · 网格卡片依次出现',
    bg: ['#0a0a14', '#12121f', '#1a1a2e'],
    accent: '#e74c3c',
    secondary: '#f5d87a',
    cardBg: 'rgba(255,255,255,0.08)',
    cardBorder: 'rgba(245,216,122,0.3)',
    cardText: '#ffffff',
    shapeColor: '#f5d87a',
    particleColors: ['#f5d87a', '#e74c3c', '#ffffff'],
    effects: ['gridReveal', 'titleSlide', 'cardFade'],
  },

  // ============================================================
  // 城市地标
  // ============================================================
  city: {
    id: 'city',
    name: '城市地标',
    icon: '🌆',
    description: '省会城市天际线剪影 · 深色夜景简约风格',
    bg: ['#0d1b2a', '#1a2a4a', '#0f1c30'],
    accent: '#f5d87a',
    secondary: '#d4a017',
    cardBg: 'rgba(255,255,255,0.05)',
    cardBorder: 'rgba(245,216,122,0.25)',
    cardText: '#ffffff',
    shapeColor: '#f5d87a',
    particleColors: ['#f5d87a', '#ffffff', '#ffd700'],
    effects: ['gridReveal', 'titleSlide', 'cardFade'],
  },

  // ============================================================
  // AI科技
  // ============================================================
  ai: {
    id: 'ai',
    name: 'AI 科技',
    icon: '🤖',
    description: 'AI工具/模型/公司logo · 波浪式动感动画',
    bg: ['#080c14', '#0f172a', '#1e1b4b'],
    accent: '#a855f7',
    secondary: '#06b6d4',
    cardBg: 'rgba(168,85,247,0.08)',
    cardBorder: 'rgba(168,85,247,0.25)',
    cardText: '#ffffff',
    shapeColor: '#a855f7',
    particleColors: ['#a855f7', '#06b6d4', '#ffffff'],
    effects: ['waveReveal', 'titleSlide', 'cardFade'],
  },
}

// 获取主题配置
export function getTheme(id) {
  return THEMES[id] || THEMES.chinese
}

// 获取所有主题列表
export function getAllThemes() {
  return Object.values(THEMES)
}
