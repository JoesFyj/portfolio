/**
 * ZenMinimalEngine - 禅意极简动画引擎
 * 东方禅宗美学 × 极简主义，冥想式体验
 */

import BaseEngine from './BaseEngine'
import { ZenRenderer } from '../renderers/ZenRenderer'
import { easings } from '../config/easings'
import {
  playZenDrop,
  playZenBrush,
  playZenBreath,
  playZenRipple,
} from '../../lib/sounds'

export default class ZenMinimalEngine extends BaseEngine {
  constructor(canvas, data, config = {}) {
    super(canvas, data, { ...config, theme: 'zen-minimal' })

    this.renderer = new ZenRenderer(this.ctx, this.width, this.height)

    // 涟漪系统
    this.ripples = []

    // 音效标记
    this.hasPlayedSound = {
      drop: false,
      brush: false,
      breath: false,
      ripple: false,
    }

    // 呼吸效果相位
    this.breathPhase = 0
  }

  // ============================================================
  // 初始化
  // ============================================================

  async init() {
    this.ripples = []
    this.hasPlayedSound = {
      drop: false,
      brush: false,
      breath: false,
      ripple: false,
    }
  }

  // ============================================================
  // 时间轴（极缓节奏）
  // ============================================================

  calcTimeline() {
    const cardCount = this.data?.points?.length || 0
    return {
      // 墨滴淡入（极缓）
      inkDrop: 0,
      inkDropEnd: 800,
      // 单线描绘（书写感）
      lineStart: 800,
      cardDuration: 1600,   // 每张卡片 1600ms（慢）
      cardGap: 400,         // 间隔 400ms（宽裕）
      // 呼吸呈现
      breathStart: 2000,
      breathDuration: 2000,
      // 涟漪消散
      rippleStart: 4000,
      rippleEnd: 5000,
      totalDuration: 5500,
    }
  }

  // ============================================================
  // 背景绘制 - 极淡米灰，留白 > 70%
  // ============================================================

  drawBackground(progress) {
    const ctx = this.ctx

    // 极淡米灰渐变
    const grad = ctx.createLinearGradient(0, 0, 0, this.height)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(0.3, '#fafaf8')
    grad.addColorStop(1, '#f5f5f0')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, this.width, this.height)

    // 禅意装饰线条（极淡）
    if (progress > 0.1) {
      const decorAlpha = Math.min((progress - 0.1) * 2, 1) * 0.1

      // 右上角枯枝
      ctx.save()
      ctx.globalAlpha = decorAlpha
      ctx.strokeStyle = '#2c2c2c'
      ctx.lineWidth = 0.5

      ctx.beginPath()
      ctx.moveTo(this.width - 50, 50)
      ctx.quadraticCurveTo(
        this.width - 120, 80,
        this.width - 180, 60
      )
      ctx.stroke()

      // 小枝桠
      ctx.beginPath()
      ctx.moveTo(this.width - 120, 80)
      ctx.lineTo(this.width - 140, 55)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(this.width - 150, 65)
      ctx.lineTo(this.width - 160, 45)
      ctx.stroke()

      ctx.restore()

      // 左下角日式庭院线条
      ctx.save()
      ctx.globalAlpha = decorAlpha * 0.8
      ctx.strokeStyle = '#9b9b9b'
      ctx.lineWidth = 0.3

      // 石灯笼轮廓
      const lx = 60
      const ly = this.height - 80
      ctx.beginPath()
      ctx.moveTo(lx - 15, ly + 20)
      ctx.lineTo(lx + 15, ly + 20)
      ctx.lineTo(lx + 12, ly - 10)
      ctx.lineTo(lx - 12, ly - 10)
      ctx.closePath()
      ctx.stroke()

      ctx.restore()
    }

    // 更新呼吸相位
    if (progress > 0.3) {
      this.breathPhase = (this.breathPhase + 0.02) % 1
    }
  }

  // ============================================================
  // 标题绘制 - 墨滴淡入，如墨入水
  // ============================================================

  drawTitle(progress) {
    const { title } = this.data || {}
    if (!title) return

    const ctx = this.ctx
    const tl = this.timeline

    // 墨滴淡入（极缓）
    const dropProgress = this.easeProgress(
      tl.inkDrop / 1000,
      tl.inkDropEnd / 1000,
      progress
    )
    if (dropProgress > 0) {
      const eased = easings.easeOutSine(dropProgress)
      const centerX = this.width / 2
      const centerY = this.height * 0.12

      // 墨滴入水的晕染效果
      this.renderer.drawZenInkTexture(
        centerX,
        centerY,
        this.width * 0.3,
        eased
      )
    }

    // 标题淡入 + 缓慢上浮
    const titleProgress = this.easeProgress(
      tl.inkDrop / 1000,
      (tl.inkDropEnd + 400) / 1000,
      progress
    )
    if (titleProgress > 0) {
      const fontSize = Math.round(this.width * 0.038)
      ctx.save()

      // 极缓上浮效果
      const floatOffset = (1 - Math.min(titleProgress, 1)) * 10
      const titleY = this.height * 0.12 - floatOffset

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `300 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.fillStyle = '#2c2c2c'
      ctx.globalAlpha = Math.min(titleProgress * 1.5, 1)

      ctx.fillText(title, this.width / 2, titleY)

      // 副标题
      if (this.data?.subtitle) {
        const subProgress = this.easeProgress(
          (tl.inkDropEnd + 200) / 1000,
          (tl.inkDropEnd + 600) / 1000,
          progress
        )
        if (subProgress > 0) {
          const subFontSize = Math.round(this.width * 0.02)
          ctx.font = `300 ${subFontSize}px "PingFang SC", sans-serif`
          ctx.fillStyle = '#9b9b9b'
          ctx.globalAlpha = subProgress * 0.8
          ctx.fillText(this.data.subtitle, this.width / 2, this.height * 0.19)
        }
      }

      ctx.restore()

      // 播放水滴音效
      if (!this.hasPlayedSound.drop && titleProgress > 0.5) {
        this.hasPlayedSound.drop = true
        playZenDrop?.()
      }
    }
  }

  // ============================================================
  // 卡片绘制 - 单线书写感
  // ============================================================

  drawCards(progress) {
    const points = this.data?.points || []
    const tl = this.timeline

    points.forEach((point, index) => {
      const cardStart = tl.lineStart / 1000 + index * ((tl.cardDuration + tl.cardGap) / 1000)
      const cardEnd = cardStart + tl.cardDuration / 1000

      const cardProgress = this.easeProgress(cardStart, cardEnd, progress)

      if (cardProgress > 0) {
        this.drawCard(index, point, Math.min(cardProgress, 1))
      }
    })
  }

  drawCard(index, point, progress) {
    const ctx = this.ctx
    const cardW = this.width * 0.8
    const cardH = this.height * 0.1
    const startX = (this.width - cardW) / 2
    const startY = this.height * 0.3 + index * (cardH + 30)

    // 极缓书写效果
    const eased = easings.easeInOutSine(progress)

    ctx.save()
    ctx.globalAlpha = Math.min(progress * 1.2, 1)

    // 单线边框（书写感）
    ctx.strokeStyle = '#2c2c2c'
    ctx.lineWidth = 0.5
    ctx.shadowColor = '#2c2c2c'
    ctx.shadowBlur = 2

    // 逐笔绘制边框
    this.drawSingleLineCard(startX, startY, cardW, cardH, eased)

    // 角落装饰
    this.renderer.drawSingleLineDecor(startX, startY, cardW, cardH, eased)

    // 标签文字（若隐若现）
    if (progress > 0.3) {
      const labelProgress = (progress - 0.3) / 0.7
      const fontSize = Math.round(this.width * 0.02)

      ctx.font = `500 ${fontSize}px "PingFang SC", sans-serif`
      ctx.fillStyle = '#2c2c2c'
      ctx.globalAlpha = labelProgress * 0.85
      ctx.textAlign = 'left'
      ctx.fillText(point.label, startX + 20, startY + fontSize * 0.9)

      // 描述文字（呼吸感脉动）
      if (point.description && progress > 0.5) {
        const descProgress = (progress - 0.5) / 0.5
        // 呼吸透明度
        const breathAlpha = 0.4 + 0.3 * Math.sin(this.breathPhase * Math.PI * 2)

        ctx.font = `300 ${Math.round(fontSize * 0.8)}px "PingFang SC", sans-serif`
        ctx.fillStyle = '#9b9b9b'
        ctx.globalAlpha = descProgress * breathAlpha
        ctx.fillText(
          point.description.substring(0, 15),
          startX + 20,
          startY + cardH - fontSize * 0.5
        )
      }
    }

    // 呼吸光环（内容区）
    if (progress > 0.6) {
      const cardCenterX = startX + cardW / 2
      const cardCenterY = startY + cardH / 2
      const heartProgress = (progress - 0.6) / 0.4
      this.renderer.drawBreathingCircle(
        cardCenterX,
        cardCenterY,
        cardW * 0.3,
        this.breathPhase,
        '#9b9b9b'
      )
    }

    ctx.restore()

    // 播放毛笔音效
    if (!this.hasPlayedSound.brush && progress > 0.3) {
      this.hasPlayedSound.brush = true
      playZenBrush?.()
    }
  }

  // 绘制单线卡片边框
  drawSingleLineCard(x, y, w, h, progress) {
    const ctx = this.ctx
    const radius = 4

    // 边框总长度
    const perimeter = (w + h) * 2

    // 逐笔绘制（顺时针）
    const segments = [
      { sx: x + radius, sy: y, ex: x + w - radius, ey: y },         // 上
      { sx: x + w, sy: y + radius, ex: x + w, ey: y + h - radius }, // 右
      { sx: x + w - radius, sy: y + h, ex: x + radius, ey: y + h }, // 下
      { sx: x, sy: y + h - radius, ex: x, ey: y + radius },         // 左
    ]

    let drawnLength = perimeter * progress
    let currentLength = 0

    segments.forEach(seg => {
      const segLen = Math.abs(seg.ex - seg.sx) + Math.abs(seg.ey - seg.sy)

      if (currentLength + segLen <= drawnLength) {
        ctx.beginPath()
        ctx.moveTo(seg.sx, seg.sy)
        ctx.lineTo(seg.ex, seg.ey)
        ctx.stroke()
      } else if (currentLength < drawnLength) {
        const remaining = drawnLength - currentLength
        const ratio = remaining / segLen
        ctx.beginPath()
        ctx.moveTo(seg.sx, seg.sy)
        ctx.lineTo(seg.sx + (seg.ex - seg.sx) * ratio, seg.sy + (seg.ey - seg.sy) * ratio)
        ctx.stroke()
      }

      currentLength += segLen
    })
  }

  // ============================================================
  // 特效 - 呼吸感脉动
  // ============================================================

  drawEffects(progress) {
    const ctx = this.ctx
    const tl = this.timeline

    // 呼吸呈现阶段
    if (progress > tl.breathStart / 1000) {
      const breathProgress = this.easeProgress(
        tl.breathStart / 1000,
        (tl.breathStart + tl.breathDuration) / 1000,
        progress
      )

      // 全局呼吸光晕
      const centerX = this.width / 2
      const centerY = this.height * 0.55
      this.renderer.drawBreathingCircle(
        centerX,
        centerY,
        this.width * 0.4,
        this.breathPhase,
        '#d0d0d0'
      )
    }

    // 播放呼吸音效
    if (!this.hasPlayedSound.breath && progress > tl.breathStart / 1000) {
      this.hasPlayedSound.breath = true
      playZenBreath?.()
    }
  }

  // ============================================================
  // 收尾 - 涟漪消散
  // ============================================================

  drawEnding(progress) {
    const ctx = this.ctx
    const tl = this.timeline

    if (progress >= tl.rippleStart / 1000) {
      const rippleProgress = this.easeProgress(
        tl.rippleStart / 1000,
        tl.rippleEnd / 1000,
        progress
      )

      // 添加涟漪
      if (this.ripples.length < 5 && Math.random() < 0.1) {
        this.ripples.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          maxRadius: Math.random() * 100 + 50,
          startTime: Date.now(),
        })
      }

      // 绘制涟漪
      const now = Date.now()
      this.ripples = this.ripples.filter(r => {
        const age = (now - r.startTime) / (tl.rippleEnd - tl.rippleStart)
        if (age > 1) return false
        this.renderer.drawRipple(r.x, r.y, r.maxRadius, age, '#9b9b9b')
        return true
      })

      // 全局涟漪
      this.renderer.drawRipple(
        this.width / 2,
        this.height / 2,
        this.width * 0.6,
        rippleProgress,
        '#2c2c2c'
      )

      // 文字淡出
      if (rippleProgress > 0.3) {
        const fadeProgress = (rippleProgress - 0.3) / 0.7
        ctx.save()
        ctx.globalAlpha = 1 - fadeProgress
        ctx.textAlign = 'center'
        ctx.font = `300 ${Math.round(this.width * 0.016)}px "PingFang SC", sans-serif`
        ctx.fillStyle = '#9b9b9b'
        ctx.fillText('少即是多', this.width / 2, this.height - 40)
        ctx.restore()
      }

      // 印章
      if (rippleProgress > 0.5) {
        const sealProgress = (rippleProgress - 0.5) / 0.5
        this.renderer.drawSeal(
          '禅',
          this.width - 60,
          this.height - 60,
          20,
          sealProgress,
          '#2c2c2c'
        )
      }

      // 播放涟漪音效
      if (!this.hasPlayedSound.ripple) {
        this.hasPlayedSound.ripple = true
        playZenRipple?.()
      }
    }
  }
}
