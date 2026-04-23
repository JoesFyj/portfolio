/**
 * CyberInkEngine - 赛博水墨动画引擎
 * 融合东方水墨美学 × 赛博朋克霓虹
 */

import BaseEngine from './BaseEngine'
import { CyberRenderer } from '../renderers/CyberRenderer'
import { easings } from '../config/easings'
import {
  playInkSplash,
  playBrushStroke,
  playNeonPulse,
  playHologramScan,
} from '../../lib/sounds'

export default class CyberInkEngine extends BaseEngine {
  constructor(canvas, data, config = {}) {
    super(canvas, data, { ...config, theme: 'cyber-ink' })

    this.renderer = new CyberRenderer(this.ctx, this.width, this.height)

    // 粒子系统
    this.particles = this.initParticles()
    this.hasPlayedSound = {
      ink: false,
      brush: false,
      neon: false,
      holo: false,
    }
  }

  // ============================================================
  // 初始化
  // ============================================================

  async init() {
    this.particles = this.initParticles()
    this.hasPlayedSound = {
      ink: false,
      brush: false,
      neon: false,
      holo: false,
    }
  }

  initParticles() {
    const particles = []
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
        color: this.theme.particleColors[
          Math.floor(Math.random() * this.theme.particleColors.length)
        ],
        alpha: Math.random() * 0.5 + 0.3,
        life: 0,
      })
    }
    return particles
  }

  // ============================================================
  // 时间轴
  // ============================================================

  calcTimeline() {
    const cardCount = this.data?.points?.length || 0
    return {
      // 标题阶段
      titleIn: 0,
      titleOut: 600,
      inkSpread: 0,        // 墨迹扩散 0-600ms
      // 卡片阶段
      cardsStart: 600,
      cardDuration: 900,   // 每张卡片 900ms
      cardGap: 200,        // 间隔 200ms
      // 内容阶段
      contentStart: 1500,
      contentDuration: 2000,
      // 收尾
      holoStart: 3500,
      holoEnd: 4500,
      totalDuration: 5000,
    }
  }

  // ============================================================
  // 背景绘制
  // ============================================================

  drawBackground(progress) {
    const ctx = this.ctx

    // 深墨色渐变
    const grad = ctx.createLinearGradient(0, 0, this.width, this.height)
    grad.addColorStop(0, '#0a0a0f')
    grad.addColorStop(0.5, '#12121f')
    grad.addColorStop(1, '#1a1a2e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, this.width, this.height)

    // 扫描线效果
    if (progress > 0 && progress < 0.9) {
      const scanY = (progress * this.height * 3) % (this.height * 1.5)
      this.renderer.drawScanLine(scanY, this.width, 0.3, '#00fff7')
      this.renderer.drawScanLine(
        this.height - scanY,
        this.width,
        0.15,
        '#ff2d55'
      )
    }

    // 背景网格（数字经络）
    if (progress > 0.1) {
      ctx.save()
      ctx.globalAlpha = progress * 0.1
      ctx.strokeStyle = '#00fff7'
      ctx.lineWidth = 0.5

      // 横线
      for (let y = 0; y < this.height; y += 80) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(this.width, y)
        ctx.stroke()
      }
      // 纵线
      for (let x = 0; x < this.width; x += 80) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, this.height)
        ctx.stroke()
      }
      ctx.restore()
    }
  }

  // ============================================================
  // 标题绘制 - 水墨晕染效果
  // ============================================================

  drawTitle(progress) {
    const { title } = this.data || {}
    if (!title) return

    const ctx = this.ctx
    const tl = this.timeline

    // 墨迹扩散效果
    const inkProgress = this.easeProgress(tl.inkSpread, tl.titleOut / 1000, progress)
    if (inkProgress > 0) {
      const inkEased = easings.inkSpread(inkProgress)
      const centerX = this.width / 2
      const centerY = this.height * 0.15

      // 水墨晕染
      this.renderer.drawInkSpread(
        centerX,
        centerY,
        this.width * 0.5,
        inkEased,
        '#00fff7'
      )
    }

    // 标题文字
    const titleProgress = this.easeProgress(
      tl.titleIn / 1000,
      tl.titleOut / 1000,
      progress
    )
    if (titleProgress > 0) {
      const fontSize = Math.round(this.width * 0.042)
      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`

      // 霓虹渐变
      const grad = ctx.createLinearGradient(
        this.width * 0.3, 0,
        this.width * 0.7, 0
      )
      grad.addColorStop(0, '#00fff7')
      grad.addColorStop(0.5, '#ffffff')
      grad.addColorStop(1, '#ff2d55')

      ctx.shadowColor = '#00fff7'
      ctx.shadowBlur = 30 * titleProgress
      ctx.fillStyle = grad
      ctx.globalAlpha = Math.min(titleProgress, 1)
      ctx.fillText(title, this.width / 2, this.height * 0.15)

      // 副标题装饰线
      if (this.data?.subtitle) {
        const subFontSize = Math.round(this.width * 0.024)
        ctx.font = `400 ${subFontSize}px "PingFang SC", sans-serif`
        ctx.shadowBlur = 15
        ctx.fillStyle = '#ffd700'
        ctx.fillText(this.data.subtitle, this.width / 2, this.height * 0.22)
      }

      ctx.restore()

      // 播放水墨晕染音效
      if (!this.hasPlayedSound.ink && titleProgress > 0.3) {
        this.hasPlayedSound.ink = true
        playInkSplash?.()
      }
    }
  }

  // ============================================================
  // 卡片绘制 - 毛笔描边效果
  // ============================================================

  drawCards(progress) {
    const points = this.data?.points || []
    const tl = this.timeline

    points.forEach((point, index) => {
      const cardStart = tl.cardsStart / 1000 + index * ((tl.cardDuration + tl.cardGap) / 1000)
      const cardEnd = cardStart + tl.cardDuration / 1000

      const cardProgress = this.easeProgress(cardStart, cardEnd, progress)

      if (cardProgress > 0) {
        // 逐笔勾勒效果
        this.drawCard(index, point, Math.min(cardProgress, 1))
      }
    })
  }

  drawCard(index, point, progress) {
    const ctx = this.ctx
    const cardW = this.width * 0.75
    const cardH = this.height * 0.12
    const startX = (this.width - cardW) / 2
    const startY = this.height * 0.32 + index * (cardH + 20)

    // 缓动效果
    const eased = easings.brushStroke(progress)

    ctx.save()
    ctx.globalAlpha = Math.min(progress * 1.5, 1)

    // 卡片背景（半透明）
    ctx.fillStyle = 'rgba(0,255,247,0.05)'
    this.drawRoundedRect(startX, startY, cardW, cardH, 12)
    ctx.fill()

    // 毛笔描边（逐笔勾勒）
    const borderColor = index % 2 === 0 ? '#00fff7' : '#ff2d55'
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 1.5
    ctx.shadowColor = borderColor
    ctx.shadowBlur = 10 * eased

    // 逐笔绘制边框
    this.drawBrushStroke(startX, startY, cardW, cardH, eased)

    // 标签文字
    if (progress > 0.4) {
      const labelProgress = (progress - 0.4) / 0.6
      const labelAlpha = Math.min(labelProgress * 2, 1)
      const fontSize = Math.round(this.width * 0.022)
      ctx.font = `700 ${fontSize}px "PingFang SC", sans-serif`
      ctx.fillStyle = borderColor
      ctx.shadowColor = borderColor
      ctx.shadowBlur = 15
      ctx.globalAlpha = labelAlpha
      ctx.fillText(point.label, startX + 16, startY + fontSize * 0.8)

      // 描述文字
      if (point.description && progress > 0.6) {
        const descAlpha = (progress - 0.6) / 0.4
        ctx.font = `400 ${Math.round(fontSize * 0.85)}px "PingFang SC", sans-serif`
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.shadowBlur = 5
        ctx.globalAlpha = Math.min(descAlpha, 1)
        ctx.fillText(
          point.description.substring(0, 20),
          startX + 16,
          startY + cardH - fontSize * 0.4
        )
      }
    }

    ctx.restore()

    // 播放毛笔音效
    if (!this.hasPlayedSound.brush && progress > 0.5) {
      this.hasPlayedSound.brush = true
      playBrushStroke?.()
    }
  }

  // 绘制毛笔笔触边框
  drawBrushStroke(x, y, w, h, progress) {
    const ctx = this.ctx
    const corners = [
      { sx: x, sy: y, ex: x + w, ey: y }, // 上边
      { sx: x + w, sy: y, ex: x + w, ey: y + h }, // 右边
      { sx: x + w, sy: y + h, ex: x, ey: y + h }, // 下边
      { sx: x, sy: y + h, ex: x, ey: y }, // 左边
    ]

    let totalLength = 0
    corners.forEach(c => {
      totalLength += Math.abs(c.ex - c.sx) + Math.abs(c.ey - c.sy)
    })

    let drawnLength = totalLength * progress
    let currentLength = 0

    corners.forEach(corner => {
      const segLength = Math.abs(corner.ex - corner.sx) + Math.abs(corner.ey - corner.sy)

      if (currentLength + segLength <= drawnLength) {
        // 完整绘制
        ctx.beginPath()
        ctx.moveTo(corner.sx, corner.sy)
        ctx.lineTo(corner.ex, corner.ey)
        ctx.stroke()
      } else if (currentLength < drawnLength) {
        // 部分绘制
        const remaining = drawnLength - currentLength
        const dx = corner.ex - corner.sx
        const dy = corner.ey - corner.sy
        const ratio = remaining / segLength

        ctx.beginPath()
        ctx.moveTo(corner.sx, corner.sy)
        ctx.lineTo(corner.sx + dx * ratio, corner.sy + dy * ratio)
        ctx.stroke()
      }

      currentLength += segLength
    })
  }

  // ============================================================
  // 粒子特效 - 霓虹粒子飘散
  // ============================================================

  drawEffects(progress) {
    const ctx = this.ctx
    const tl = this.timeline

    // 粒子入场
    if (progress > 0.1 && progress < 0.9) {
      this.updateParticles()

      this.particles.forEach(p => {
        if (p.life > 0) {
          this.renderer.drawNeonParticle(
            p.x,
            p.y,
            p.radius,
            p.color,
            p.alpha
          )
        }
      })
    }

    // 霓虹扫光效果
    if (progress > tl.contentStart / 1000 && progress < tl.holoStart / 1000) {
      const sweepProgress = (progress - tl.contentStart / 1000) / (
        (tl.holoStart - tl.contentStart) / 1000
      )
      const sweepY = this.height * 0.3 + sweepProgress * this.height * 0.5

      ctx.save()
      ctx.globalAlpha = 0.3 * (1 - sweepProgress)
      const grad = ctx.createLinearGradient(0, sweepY - 50, 0, sweepY + 50)
      grad.addColorStop(0, 'transparent')
      grad.addColorStop(0.5, '#00fff7')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, sweepY - 50, this.width, 100)
      ctx.restore()
    }

    // 播放霓虹脉冲音效
    if (!this.hasPlayedSound.neon && progress > tl.contentStart / 1000) {
      this.hasPlayedSound.neon = true
      playNeonPulse?.()
    }
  }

  updateParticles() {
    this.particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.life += 0.01

      // 边界反弹
      if (p.x < 0 || p.x > this.width) p.vx *= -1
      if (p.y < 0 || p.y > this.height) p.vy *= -1

      // 生命周期
      if (p.life > 1) {
        p.life = 0
        p.x = Math.random() * this.width
        p.y = Math.random() * this.height
      }
    })
  }

  // ============================================================
  // 收尾 - 全息水印扫描
  // ============================================================

  drawEnding(progress) {
    const ctx = this.ctx
    const tl = this.timeline

    // 全息扫描线
    if (progress >= tl.holoStart / 1000) {
      const holoProgress = this.easeProgress(
        tl.holoStart / 1000,
        tl.holoEnd / 1000,
        progress
      )

      // 全息边框
      this.renderer.drawHoloBorder(this.width, this.height, holoProgress)

      // 扫描线从下往上
      const scanY = this.height * (1 - holoProgress)
      ctx.save()
      ctx.globalAlpha = 0.5 * holoProgress
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30)
      grad.addColorStop(0, 'transparent')
      grad.addColorStop(0.5, '#00fff7')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, scanY - 30, this.width, 60)
      ctx.restore()

      // 品牌水印
      if (holoProgress > 0.5) {
        const brandAlpha = (holoProgress - 0.5) * 2
        ctx.save()
        ctx.globalAlpha = brandAlpha
        ctx.textAlign = 'center'
        ctx.font = `400 ${Math.round(this.width * 0.018)}px "PingFang SC", sans-serif`
        ctx.fillStyle = '#00fff7'
        ctx.shadowColor = '#00fff7'
        ctx.shadowBlur = 20
        ctx.fillText('@小福AI自由', this.width / 2, this.height - 30)
        ctx.restore()
      }

      // 播放全息扫描音效
      if (!this.hasPlayedSound.holo) {
        this.hasPlayedSound.holo = true
        playHologramScan?.()
      }
    }
  }
}
