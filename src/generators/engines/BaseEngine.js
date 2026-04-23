/**
 * BaseEngine - 所有动画引擎的基类
 * 提供公共方法，子类继承实现具体风格
 */

import { getTheme } from '../config/themes'
import { easings } from '../config/easings'

export default class BaseEngine {
  constructor(canvas, data, config = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.data = data
    this.config = config

    // 主题配置
    this.theme = getTheme(config.theme || 'chinese')

    // 画布尺寸
    this.width = canvas.width
    this.height = canvas.height

    // 动画状态
    this.isPlaying = false
    this.currentTime = 0
    this.animationId = null
    this.startTime = null

    // 时间轴
    this.timeline = this.calcTimeline()

    // 回调
    this.onProgress = config.onProgress || (() => {})
    this.onComplete = config.onComplete || (() => {})
  }

  // ============================================================
  // 公共方法
  // ============================================================

  async init() {
    // 初始化（子类可覆盖）
  }

  // 计算时间轴 - 子类可覆盖
  calcTimeline() {
    const points = this.data?.points || []
    const cardCount = points.length

    // 基础时间轴（毫秒）
    return {
      titleIn: 0,
      titleOut: 800,
      cardsStart: 600,
      cardDuration: 1200,
      cardGap: 200,
      cardsEnd: 600 + cardCount * (1200 + 200),
      contentStart: 600,
      contentDuration: 2500,
      fadeStart: 4000,
      fadeEnd: 4500,
      totalDuration: 5000,
    }
  }

  // 开始播放
  async play() {
    if (this.isPlaying) return
    this.isPlaying = true
    this.startTime = performance.now()

    await this.init()
    this.animate()
  }

  // 停止动画
  stop() {
    this.isPlaying = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  // 截取当前帧
  captureFrame() {
    return this.canvas.toDataURL('image/png')
  }

  // ============================================================
  // 动画循环
  // ============================================================

  animate() {
    if (!this.isPlaying) return

    const now = performance.now()
    this.currentTime = now - this.startTime
    const duration = this.timeline.totalDuration

    // 计算进度 (0-1)
    const progress = Math.min(this.currentTime / duration, 1)

    // 清空画布
    this.clear()

    // 绘制背景
    this.drawBackground(progress)

    // 绘制标题
    if (this.currentTime >= 0) {
      this.drawTitle(progress)
    }

    // 绘制卡片
    this.drawCards(progress)

    // 绘制特效
    this.drawEffects(progress)

    // 绘制收尾
    if (progress > 0.8) {
      this.drawEnding(progress)
    }

    // 回调进度
    this.onProgress(progress)

    // 判断完成
    if (this.currentTime >= duration) {
      this.stop()
      this.onComplete()
      return
    }

    this.animationId = requestAnimationFrame(() => this.animate())
  }

  // ============================================================
  // 可被子类覆盖的绘制方法
  // ============================================================

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  drawBackground(progress) {
    // 子类实现
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height)
    const colors = this.theme.bg
    colors.forEach((c, i) => {
      grad.addColorStop(i / (colors.length - 1), c)
    })
    this.ctx.fillStyle = grad
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  drawTitle(progress) {
    // 子类实现
    const { title } = this.data || {}
    if (!title) return

    const titleProgress = this.easeProgress(0, 800, progress)
    if (titleProgress <= 0) return

    const fontSize = Math.round(this.width * 0.048)
    this.ctx.save()
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`

    const centerX = this.width / 2
    const centerY = this.height * 0.15

    // 渐变
    const grad = this.ctx.createLinearGradient(
      this.width * 0.3, 0, this.width * 0.7, 0
    )
    grad.addColorStop(0, this.theme.accent)
    grad.addColorStop(1, this.theme.secondary || this.theme.accent)

    this.ctx.globalAlpha = Math.min(titleProgress, 1)
    this.ctx.fillStyle = grad
    this.ctx.fillText(title, centerX, centerY)
    this.ctx.restore()
  }

  drawCards(progress) {
    // 子类实现
    const points = this.data?.points || []
    const tl = this.timeline

    points.forEach((point, index) => {
      const cardStart = tl.cardsStart + index * (tl.cardDuration + tl.cardGap) / 1000
      const cardProgress = this.easeProgress(
        cardStart,
        cardStart + tl.cardDuration / 1000,
        progress
      )
      if (cardProgress > 0) {
        this.drawCard(index, point, Math.min(cardProgress, 1))
      }
    })
  }

  drawCard(index, point, progress) {
    // 子类实现
  }

  drawEffects(progress) {
    // 子类实现（粒子等）
  }

  drawEnding(progress) {
    // 子类实现
  }

  // ============================================================
  // 工具方法
  // ============================================================

  // 计算进度 (0-1)
  easeProgress(start, end, current) {
    if (current < start) return 0
    if (current > end) return 1
    return (current - start) / (end - start)
  }

  // 获取缓动后的进度
  ease(easingName, progress) {
    const fn = easings[easingName] || easings.linear
    return fn(progress)
  }

  // 绘制圆角矩形
  drawRoundedRect(x, y, w, h, r) {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  // 绘制渐变文字
  drawGradientText(text, x, y, colors, font, shadowColor, shadowBlur) {
    const ctx = this.ctx
    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = font
    if (shadowColor) {
      ctx.shadowColor = shadowColor
      ctx.shadowBlur = shadowBlur || 20
    }

    const grad = ctx.createLinearGradient(x - 100, 0, x + 100, 0)
    colors.forEach((c, i) => {
      grad.addColorStop(i / (colors.length - 1), c)
    })
    ctx.fillStyle = grad
    ctx.fillText(text, x, y)
    ctx.restore()
  }
}
