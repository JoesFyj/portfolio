/**
 * 主题配置 - 统一的6套主题配置
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

  // ============================================================
  // 赛博水墨 ⭐NEW
  // ============================================================
  'cyber-ink': {
    id: 'cyber-ink',
    name: '赛博水墨',
    icon: '🔮',
    description: '水墨 × 霓虹 · 数字文人气质',
    bg: ['#0a0a0f', '#12121f', '#1a1a2e'],
    accent: '#00fff7',
    secondary: '#ff2d55',
    gold: '#ffd700',
    cardBg: 'rgba(0,255,247,0.05)',
    cardBorder: 'rgba(0,255,247,0.3)',
    cardText: '#ffffff',
    shapeColor: '#00fff7',
    particleColors: ['#00fff7', '#ff2d55', '#ffd700'],
    effects: ['inkSpread', 'neonSweep', 'holoScan'],
    // 赛博水墨特效
    brushTexture: true,
    scanLines: true,
    hologramScan: true,
  },

  // ============================================================
  // 禅意极简 ⭐NEW
  // ============================================================
  'zen-minimal': {
    id: 'zen-minimal',
    name: '禅意极简',
    icon: '🍃',
    description: '禅宗 × 极简 · 冥想式体验',
    bg: ['#ffffff', '#fafaf8', '#f5f5f0'],
    accent: '#2c2c2c',
    secondary: '#9b9b9b',
    white: '#ffffff',
    cardBg: 'rgba(0,0,0,0.02)',
    cardBorder: 'rgba(44,44,44,0.15)',
    cardText: '#2c2c2c',
    shapeColor: '#2c2c2c',
    particleColors: ['#2c2c2c'],
    effects: ['inkDrop', 'singleLine', 'breathing', 'rippleFade'],
    // 禅意极简特效
    singleLine: true,
    breathingEffect: true,
    largeWhiteSpace: true,
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
