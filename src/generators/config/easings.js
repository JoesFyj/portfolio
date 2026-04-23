/**
 * 缓动函数库 - 统一的缓动函数集合
 * 基于 Robert Penner 的缓动函数
 */

export const easings = {
  // 线性
  linear: t => t,

  // 二次方
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // 三次方
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // 四次方
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - (--t) * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

  // 正弦
  easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
  easeOutSine: t => Math.sin(t * Math.PI / 2),
  easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,

  // 指数
  easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: t => {
    if (t === 0) return 0
    if (t === 1) return 1
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2
    return (2 - Math.pow(2, -20 * t + 10)) / 2
  },

  // 回弹
  easeOutBounce: t => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) return n1 * t * t
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
    return n1 * (t -= 2.625 / d1) * t + 0.984375
  },
  easeInBounce: t => 1 - easings.easeOutBounce(1 - t),
  easeInOutBounce: t => t < 0.5
    ? (1 - easings.easeOutBounce(1 - 2 * t)) / 2
    : (1 + easings.easeOutBounce(2 * t - 1)) / 2,

  // 回退
  easeOutBack: t => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
  easeInBack: t => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return c3 * t * t * t - c1 * t * t
  },

  // 水墨晕染（自定义）
  inkSpread: t => t < 0.3
    ? easings.easeOutQuad(t / 0.3) * 0.15
    : t < 0.7
      ? 0.15 + easings.easeOutCubic((t - 0.3) / 0.4) * 0.6
      : 0.75 + easings.easeInOutCubic((t - 0.7) / 0.3) * 0.25,

  // 呼吸效果
  breathing: t => 0.5 + 0.5 * Math.sin(t * Math.PI * 2),

  // 涟漪扩散
  ripple: t => t < 0.5
    ? easings.easeOutQuad(t * 2)
    : easings.easeInQuad(2 - t * 2),

  // 书写感（缓入快出）
  brushStroke: t => t < 0.5
    ? easings.easeInQuad(t * 2) * 0.5
    : 0.5 + easings.easeOutQuad((t - 0.5) * 2) * 0.5,
}

// 常用组合
export const TIMING = {
  fast: 300,
  normal: 600,
  slow: 1200,
  xslow: 2000,
}
