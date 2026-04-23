/**
 * Video Generator v2.0 - 短视频动画引擎
 * 
 * 设计要点：
 * - 立体空间感背景（粒子+网格+光晕）
 * - 标题打字机 → 上移
 * - 内容卡片：序号(大) + 小标题(中) + 解释(小)，字体递减
 * - 交叉亮色配色
 * - 装饰图形增加动态感
 * - 水印"小福AI自由"
 */

import { useRef, useEffect, useState, useCallback } from 'react'

// ============================================================
// 主题
// ============================================================
const THEMES = {
  'deep-space': {
    name: '深空蓝',
    bg: ['#050510', '#0a1628', '#0f1f3d'],
    accent: '#00d4ff',
    particles: { color: '#00d4ff', count: 60 },
    glow: 'rgba(0,212,255,0.5)',
    watermark: 'rgba(0,212,255,0.25)',
    cardColors: ['#00d4ff', '#f97316', '#10b981', '#ec4899', '#06b6d4'],
  },
  'midnight-gold': {
    name: '暮夜金',
    bg: ['#0f0d1a', '#1a1428', '#2a1a2a'],
    accent: '#f0c040',
    particles: { color: '#f0c040', count: 50 },
    glow: 'rgba(240,192,64,0.4)',
    watermark: 'rgba(240,192,64,0.2)',
    cardColors: ['#f0c040', '#ef4444', '#10b981', '#8b5cf6', '#06b6d4'],
  },
  'aurora': {
    name: '极光紫',
    bg: ['#0a0512', '#1a0a28', '#0f1a2a'],
    accent: '#a855f7',
    particles: { color: '#a855f7', count: 55 },
    glow: 'rgba(168,85,247,0.5)',
    watermark: 'rgba(168,85,247,0.2)',
    cardColors: ['#a855f7', '#ec4899', '#06b6d4', '#f97316', '#10b981'],
  },
  // ============================================================
  // 赛博水墨 ⭐NEW
  // ============================================================
  'cyber-ink': {
    name: '赛博水墨',
    bg: ['#0a0a0f', '#12121f', '#1a1a2e'],
    accent: '#00fff7',
    particles: { color: '#00fff7', count: 40 },
    glow: 'rgba(0,255,247,0.4)',
    watermark: 'rgba(0,255,247,0.25)',
    cardColors: ['#00fff7', '#ff2d55', '#ffd700', '#ff2d55', '#00fff7'],
    // 赛博水墨特效
    style: 'cyber-ink',
    brushTexture: true,
    scanLines: true,
  },
  // ============================================================
  // 禅意极简 ⭐NEW
  // ============================================================
  'zen-minimal': {
    name: '禅意极简',
    bg: ['#ffffff', '#fafaf8', '#f5f5f0'],
    accent: '#2c2c2c',
    particles: { color: '#9b9b9b', count: 20 },
    glow: 'rgba(44,44,44,0.15)',
    watermark: 'rgba(44,44,44,0.2)',
    cardColors: ['#2c2c2c', '#4a4a4a', '#6a6a6a', '#8a8a8a', '#aaaaaa'],
    // 禅意极简特效
    style: 'zen-minimal',
    singleLine: true,
    breathingEffect: true,
  },
}

// ============================================================
// 工具
// ============================================================
function roundedRect(ctx, x, y, w, h, r) {
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

function easeOutBack(x) {
  const c1 = 1.70158, c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3) }

// ============================================================
// 动画引擎
// ============================================================
class Engine {
  constructor(canvas, data, themeKey) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.data = data
    this.theme = THEMES[themeKey] || THEMES['deep-space']
    this.cw = canvas.width
    this.ch = canvas.height
    this.startTime = null
    this.animId = null
    this.onDone = null
    this.onProgress = null

    // 粒子
    this.particles = Array.from({ length: this.theme.particles.count }, () => ({
      x: Math.random() * this.cw,
      y: Math.random() * this.ch,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 0.5 + Math.random() * 2,
      alpha: 0.15 + Math.random() * 0.35,
    }))

    this.calcTimeline()
  }

  calcTimeline() {
    const titleLen = (this.data.title || '').length
    const pts = this.data.points || []
    const t = {
      bgReady: 600,
      titleStart: 600,
      titleEnd: 600 + titleLen * 90,
      titleMoveEnd: 600 + titleLen * 90 + 600,
      contentStart: 600 + titleLen * 90 + 600 + 200,
      itemDur: 2400,
    }
    t.contentEnd = t.contentStart + pts.length * t.itemDur
    t.endStart = t.contentEnd
    t.total = t.contentEnd + 2500
    this.tl = t
  }

  // ---- 背景 ----
  drawBg(t) {
    const { ctx, cw, ch, theme } = this

    // ============================================================
    // 赛博水墨风格
    // ============================================================
    if (theme.style === 'cyber-ink') {
      // 深墨色渐变
      const g = ctx.createLinearGradient(0, 0, 0, ch)
      g.addColorStop(0, '#0a0a0f')
      g.addColorStop(0.5, '#12121f')
      g.addColorStop(1, '#1a1a2e')
      ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch)

      // 扫描线效果
      if (t > 0) {
        const scanY = (t / 2000) % ch
        ctx.save()
        ctx.globalAlpha = 0.3
        const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20)
        scanGrad.addColorStop(0, 'transparent')
        scanGrad.addColorStop(0.5, '#00fff7')
        scanGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = scanGrad
        ctx.fillRect(0, scanY - 20, cw, 40)
        ctx.restore()
      }

      // 背景网格
      ctx.strokeStyle = 'rgba(0,255,247,0.05)'; ctx.lineWidth = 0.5
      for (let y = 0; y < ch; y += 80) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke()
      }
      for (let x = 0; x < cw; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke()
      }

      // 粒子
      this.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = cw; if (p.x > cw) p.x = 0
        if (p.y < 0) p.y = ch; if (p.y > ch) p.y = 0
        ctx.globalAlpha = p.alpha * 0.6
        ctx.fillStyle = theme.particles.color
        ctx.shadowColor = theme.particles.color
        ctx.shadowBlur = 8
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill()
      })
      ctx.globalAlpha = 1; ctx.shadowBlur = 0
      return
    }

    // ============================================================
    // 禅意极简风格
    // ============================================================
    if (theme.style === 'zen-minimal') {
      // 极淡米灰渐变
      const g = ctx.createLinearGradient(0, 0, 0, ch)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(0.3, '#fafaf8')
      g.addColorStop(1, '#f5f5f0')
      ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch)

      // 右上角枯枝装饰
      ctx.save()
      ctx.strokeStyle = 'rgba(44,44,44,0.08)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(cw - 50, 50)
      ctx.quadraticCurveTo(cw - 120, 80, cw - 180, 60)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cw - 120, 80)
      ctx.lineTo(cw - 140, 55)
      ctx.stroke()
      ctx.restore()

      // 极少粒子
      this.particles.forEach(p => {
        p.x += p.vx * 0.3; p.y += p.vy * 0.3
        if (p.x < 0) p.x = cw; if (p.x > cw) p.x = 0
        if (p.y < 0) p.y = ch; if (p.y > ch) p.y = 0
        ctx.globalAlpha = p.alpha * 0.3
        ctx.fillStyle = '#d0d0d0'
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2); ctx.fill()
      })
      ctx.globalAlpha = 1
      return
    }

    // ============================================================
    // 默认风格（深空/暮夜/极光）
    // ============================================================
    const [b1, b2, b3] = theme.bg

    // 渐变
    const g = ctx.createLinearGradient(0, 0, 0, ch)
    g.addColorStop(0, b1); g.addColorStop(0.5, b2); g.addColorStop(1, b3)
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch)

    // 中心光晕
    const rg = ctx.createRadialGradient(cw / 2, ch * 0.35, 0, cw / 2, ch * 0.35, cw * 0.65)
    rg.addColorStop(0, theme.glow); rg.addColorStop(1, 'transparent')
    ctx.fillStyle = rg; ctx.fillRect(0, 0, cw, ch)

    // 粒子
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0) p.x = cw; if (p.x > cw) p.x = 0
      if (p.y < 0) p.y = ch; if (p.y > ch) p.y = 0
      const pulse = 0.5 + 0.5 * Math.sin(t / 1200 + p.x * 0.005)
      ctx.globalAlpha = p.alpha * pulse
      ctx.fillStyle = theme.particles.color
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill()
    })
    ctx.globalAlpha = 1

    // 透视网格
    ctx.strokeStyle = `${theme.accent}08`; ctx.lineWidth = 1
    for (let y = 0; y < ch; y += 100) {
      ctx.globalAlpha = 0.06 * (1 - y / ch)
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke()
    }
    for (let x = 0; x < cw; x += 100) {
      ctx.globalAlpha = 0.04
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  // ---- 水印 ----
  drawWatermark() {
    const { ctx, cw, ch, theme } = this
    ctx.save()

    // 赛博水墨风格 - 霓虹水印
    if (theme.style === 'cyber-ink') {
      ctx.globalAlpha = 0.5
      ctx.fillStyle = '#00fff7'
      ctx.font = '600 20px "PingFang SC", sans-serif'
      ctx.textAlign = 'right'
      ctx.shadowColor = '#00fff7'
      ctx.shadowBlur = 15
      ctx.fillText('@小福AI自由', cw - 28, ch - 24)
      ctx.restore()
      return
    }

    // 禅意极简风格 - 淡雅水印
    if (theme.style === 'zen-minimal') {
      ctx.globalAlpha = 0.25
      ctx.fillStyle = '#2c2c2c'
      ctx.font = '400 16px "PingFang SC", sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('@小福AI自由', cw - 28, ch - 24)
      ctx.restore()
      return
    }

    // 默认风格
    ctx.globalAlpha = 0.35
    ctx.fillStyle = theme.watermark
    ctx.font = '600 20px "PingFang SC", sans-serif'
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'
    ctx.fillText('小福AI自由', cw - 28, ch - 24)
    ctx.restore()
  }

  // ---- 标题 ----
  drawTitle(t) {
    const { ctx, cw, ch, theme, tl, data } = this
    const title = data.title || ''
    if (t < tl.titleStart) return

    ctx.save()

    // ============================================================
    // 赛博水墨风格 - 水墨晕染标题
    // ============================================================
    if (theme.style === 'cyber-ink') {
      const titleProgress = Math.min(1, (t - tl.titleStart) / 800)
      const fontSize = 52

      // 水墨晕染背景
      const inkGrad = ctx.createRadialGradient(cw / 2, ch * 0.12, 0, cw / 2, ch * 0.12, cw * 0.5)
      inkGrad.addColorStop(0, `rgba(0,255,247,${0.15 * titleProgress})`)
      inkGrad.addColorStop(0.5, `rgba(0,255,247,${0.05 * titleProgress})`)
      inkGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = inkGrad
      ctx.fillRect(0, 0, cw, ch)

      // 标题文字（霓虹渐变）
      ctx.globalAlpha = titleProgress
      ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const textGrad = ctx.createLinearGradient(cw * 0.3, 0, cw * 0.7, 0)
      textGrad.addColorStop(0, '#00fff7')
      textGrad.addColorStop(0.5, '#ffffff')
      textGrad.addColorStop(1, '#ff2d55')
      ctx.fillStyle = textGrad
      ctx.shadowColor = '#00fff7'
      ctx.shadowBlur = 30 * titleProgress
      ctx.fillText(title, cw / 2, ch * 0.12)

      // 装饰线
      if (titleProgress > 0.5) {
        ctx.globalAlpha = (titleProgress - 0.5) * 2
        ctx.strokeStyle = '#ffd700'
        ctx.lineWidth = 2
        const lw = Math.min(400, ctx.measureText(title).width + 60)
        ctx.beginPath()
        ctx.moveTo(cw / 2 - lw / 2, ch * 0.17)
        ctx.lineTo(cw / 2 + lw / 2, ch * 0.17)
        ctx.stroke()
      }

      ctx.restore()
      return
    }

    // ============================================================
    // 禅意极简风格 - 墨滴淡入标题
    // ============================================================
    if (theme.style === 'zen-minimal') {
      const titleProgress = Math.min(1, (t - tl.titleStart) / 1200)
      const floatOffset = (1 - titleProgress) * 20
      const fontSize = 44

      // 墨滴晕染
      const inkGrad = ctx.createRadialGradient(cw / 2, ch * 0.1, 0, cw / 2, ch * 0.1, cw * 0.4)
      inkGrad.addColorStop(0, `rgba(44,44,44,${0.08 * titleProgress})`)
      inkGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = inkGrad
      ctx.fillRect(0, 0, cw, ch)

      ctx.globalAlpha = titleProgress
      ctx.font = `300 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#2c2c2c'
      ctx.fillText(title, cw / 2, ch * 0.1 - floatOffset)

      ctx.restore()
      return
    }

    // ============================================================
    // 默认风格
    // ============================================================

    if (t < tl.titleEnd) {
      // === 打字机阶段 ===
      const chars = Math.floor((t - tl.titleStart) / 90)
      const fontSize = 60
      ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'

      // 逐字带弹性
      let totalW = 0
      const charWidths = []
      for (let i = 0; i < title.length; i++) {
        const w = ctx.measureText(title[i]).width
        charWidths.push(w); totalW += w
      }

      let x = cw / 2 - totalW / 2
      for (let i = 0; i < Math.min(chars, title.length); i++) {
        const charProgress = i < chars - 1 ? 1 : Math.min(1, (t - tl.titleStart - i * 90) / 180)
        const scale = i < chars - 1 ? 1 : easeOutBack(charProgress)

        ctx.save()
        ctx.translate(x + charWidths[i] / 2, ch / 2)
        ctx.scale(scale, scale)
        ctx.translate(-(x + charWidths[i] / 2), -(ch / 2))
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = theme.glow; ctx.shadowBlur = 25
        ctx.fillText(title[i], x, ch / 2)
        ctx.restore()
        x += charWidths[i]
      }

      // 光标
      if (Math.floor(t / 400) % 2 === 0 && chars < title.length) {
        ctx.fillStyle = theme.accent
        ctx.fillRect(x + 4, ch / 2 - fontSize / 2 + 5, 3, fontSize - 10)
      }
    }
    else if (t < tl.titleMoveEnd) {
      // === 上移阶段 ===
      const p = easeOutCubic((t - tl.titleEnd) / (tl.titleMoveEnd - tl.titleEnd))
      const y = ch / 2 + (100 - ch / 2) * p
      const fs = 60 + (40 - 60) * p
      ctx.font = `900 ${Math.round(fs)}px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = theme.glow; ctx.shadowBlur = 20
      ctx.fillText(title, cw / 2, y)
    }
    else {
      // === 稳定顶部 ===
      ctx.font = '900 40px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = theme.glow; ctx.shadowBlur = 12
      ctx.fillText(title, cw / 2, 100)
      // 装饰线
      const lw = Math.min(380, ctx.measureText(title).width + 50)
      ctx.strokeStyle = theme.accent; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cw / 2 - lw / 2, 140); ctx.lineTo(cw / 2 + lw / 2, 140); ctx.stroke()
    }

    ctx.shadowBlur = 0; ctx.restore()
  }

  // ---- 内容卡片 ----
  drawCards(t) {
    const { ctx, cw, ch, theme, tl, data } = this
    const pts = data.points || []
    if (t < tl.contentStart) return

    const cardX = 50
    const cardW = cw - 100
    const cardH = 200
    const gap = 30
    const startY = 190
    const colors = theme.cardColors

    // ============================================================
    // 赛博水墨风格
    // ============================================================
    if (theme.style === 'cyber-ink') {
      pts.forEach((pt, i) => {
        const itemStart = tl.contentStart + i * tl.itemDur
        if (t < itemStart) return

        const localT = t - itemStart
        const color = colors[i % colors.length]

        // 入场动画（毛笔描边效果）
        let progress = 1
        if (localT < 600) {
          progress = easeOutCubic(localT / 600)
        }

        const y = startY + i * (cardH + gap)
        ctx.save()
        ctx.globalAlpha = Math.min(progress, 1)

        // 卡片背景
        ctx.fillStyle = 'rgba(0,255,247,0.03)'
        roundedRect(ctx, cardX, y, cardW, cardH, 12)
        ctx.fill()

        // 毛笔描边
        ctx.strokeStyle = color
        ctx.lineWidth = 1.5
        ctx.shadowColor = color
        ctx.shadowBlur = 10 * progress
        // 逐笔勾勒边框
        this._drawBrushStroke(ctx, cardX, y, cardW, cardH, progress)

        // 标签文字
        const kw = pt.label || pt.kw || ''
        if (progress > 0.4) {
          const labelAlpha = (progress - 0.4) / 0.6
          ctx.globalAlpha = labelAlpha
          ctx.font = '700 36px "PingFang SC", sans-serif'
          ctx.textAlign = 'left'
          ctx.fillStyle = color
          ctx.shadowBlur = 15
          ctx.fillText(kw.slice(0, 10), cardX + 30, y + 60)

          // 描述
          const desc = pt.desc || pt.short || ''
          ctx.font = '400 24px "PingFang SC", sans-serif'
          ctx.fillStyle = 'rgba(255,255,255,0.6)'
          ctx.shadowBlur = 5
          this._wrapText(ctx, desc.slice(0, 20), cardX + 30, y + 120, cardW - 60, 32)
        }

        // 霓虹装饰
        if (progress > 0.6) {
          const decoAlpha = (progress - 0.6) / 0.4
          ctx.globalAlpha = decoAlpha * 0.5
          ctx.fillStyle = color
          ctx.shadowBlur = 15
          ctx.beginPath()
          ctx.arc(cardX + cardW - 60, y + cardH / 2, 15, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      })
      return
    }

    // ============================================================
    // 禅意极简风格
    // ============================================================
    if (theme.style === 'zen-minimal') {
      pts.forEach((pt, i) => {
        const itemStart = tl.contentStart + i * tl.itemDur
        if (t < itemStart) return

        const localT = t - itemStart
        const color = colors[i % colors.length]
        const breathe = 0.5 + 0.5 * Math.sin(localT / 800)

        // 极缓入场
        let progress = 1
        if (localT < 800) {
          progress = easeOutCubic(localT / 800)
        }

        const y = startY + i * (cardH + gap)
        ctx.save()
        ctx.globalAlpha = Math.min(progress * 0.9, 1)

        // 单线卡片背景
        ctx.fillStyle = 'rgba(0,0,0,0.02)'
        roundedRect(ctx, cardX, y, cardW, cardH, 4)
        ctx.fill()

        // 单线边框
        ctx.strokeStyle = `rgba(44,44,44,${0.15 * progress})`
        ctx.lineWidth = 0.5
        this._drawBrushStroke(ctx, cardX, y, cardW, cardH, progress)

        // 角落装饰
        const cornerLen = 20
        ctx.strokeStyle = `rgba(44,44,44,${0.2 * progress})`
        ctx.lineWidth = 0.5
        // 左上
        ctx.beginPath()
        ctx.moveTo(cardX, y + cornerLen)
        ctx.lineTo(cardX, y)
        ctx.lineTo(cardX + cornerLen, y)
        ctx.stroke()
        // 右下
        ctx.beginPath()
        ctx.moveTo(cardX + cardW - cornerLen, y + cardH)
        ctx.lineTo(cardX + cardW, y + cardH)
        ctx.lineTo(cardX + cardW, y + cardH - cornerLen)
        ctx.stroke()

        // 标签文字（呼吸感）
        const kw = pt.label || pt.kw || ''
        if (progress > 0.4) {
          const labelAlpha = (progress - 0.4) / 0.6
          ctx.globalAlpha = labelAlpha * (0.7 + breathe * 0.3)
          ctx.font = '500 34px "PingFang SC", sans-serif'
          ctx.textAlign = 'left'
          ctx.fillStyle = color
          ctx.fillText(kw.slice(0, 10), cardX + 25, y + 55)

          // 描述（更淡）
          const desc = pt.desc || pt.short || ''
          ctx.globalAlpha = labelAlpha * (0.4 + breathe * 0.2)
          ctx.font = '300 22px "PingFang SC", sans-serif'
          ctx.fillStyle = '#9b9b9b'
          this._wrapText(ctx, desc.slice(0, 15), cardX + 25, y + 110, cardW - 50, 30)
        }

        ctx.restore()
      })
      return
    }

    // ============================================================
    // 默认风格
    // ============================================================
    pts.forEach((pt, i) => {
      const itemStart = tl.contentStart + i * tl.itemDur
      if (t < itemStart) return

      const localT = t - itemStart
      const color = colors[i % colors.length]

      // 入场动画
      let alpha = 1, yOff = 0, scale = 1
      if (localT < 400) {
        const p = easeOutCubic(localT / 400)
        alpha = p; yOff = (1 - p) * 40; scale = 0.96 + p * 0.04
      }

      const y = startY + i * (cardH + gap) + yOff

      ctx.save(); ctx.globalAlpha = alpha

      // 卡片背景（玻璃态）
      roundedRect(ctx, cardX, y, cardW, cardH, 16)
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fill()
      ctx.strokeStyle = `${color}40`; ctx.lineWidth = 1.5; ctx.stroke()

      // 左侧竖线
      ctx.fillStyle = color
      roundedRect(ctx, cardX, y, 6, cardH, 3); ctx.fill()

      // ---- 序号圆圈（最大，最醒目）----
      const numX = cardX + 65
      const numY = y + 65
      const numR = 40

      ctx.shadowColor = color; ctx.shadowBlur = 20
      ctx.beginPath(); ctx.arc(numX, numY, numR, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
      ctx.shadowBlur = 0

      // 序号文字
      ctx.fillStyle = '#ffffff'
      ctx.font = '900 36px "PingFang SC", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(String(i + 1), numX, numY)

      // ---- 小标题（中等字体，亮色）----
      const kw = pt.label || pt.kw || ''
      const kwX = numX + numR + 30
      const kwY = y + 55

      ctx.fillStyle = color
      ctx.shadowColor = color; ctx.shadowBlur = 8
      ctx.font = '800 38px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      ctx.fillText(kw.slice(0, 10), kwX, kwY)
      ctx.shadowBlur = 0

      // ---- 解释说明（小字体，可读）----
      const desc = pt.desc || pt.short || ''
      const descX = kwX
      const descY = y + 110

      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.font = '400 26px "PingFang SC", sans-serif'
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      // 自动换行
      const maxW = cardW - (kwX - cardX) - 30
      this._wrapText(ctx, desc.slice(0, 40), descX, descY, maxW, 34)

      // ---- 装饰图形 ----
      this._drawDeco(ctx, i, color, alpha, localT, cardX, y, cardW, cardH)

      ctx.restore()
    })
  }

  _wrapText(ctx, text, x, y, maxW, lineH) {
    let line = '', ly = y
    for (const ch of text) {
      const test = line + ch
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, ly); line = ch; ly += lineH
      } else { line = test }
    }
    if (line) ctx.fillText(line, x, ly)
  }

  // 逐笔勾勒边框（用于毛笔/单线效果）
  _drawBrushStroke(ctx, x, y, w, h, progress) {
    const radius = 4
    const perimeter = w * 2 + h * 2
    const drawnLength = perimeter * progress

    const segments = [
      { sx: x + radius, sy: y, ex: x + w - radius, ey: y },           // 上
      { sx: x + w, sy: y + radius, ex: x + w, ey: y + h - radius },   // 右
      { sx: x + w - radius, sy: y + h, ex: x + radius, ey: y + h },   // 下
      { sx: x, sy: y + h - radius, ex: x, ey: y + radius },            // 左
    ]

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

  // 装饰图形
  _drawDeco(ctx, idx, color, alpha, localT, cx, cy, cw, ch) {
    ctx.save()

    // 右侧动态图形
    const rx = cx + cw - 60
    const ry = cy + ch / 2
    const pulse = 0.3 + 0.15 * Math.sin(localT / 500)
    const size = 18 + 6 * Math.sin(localT / 400)

    // 外圈
    ctx.globalAlpha = alpha * pulse * 0.4
    ctx.strokeStyle = color; ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(rx, ry, size + 12, 0, Math.PI * 2); ctx.stroke()

    // 内圈
    ctx.globalAlpha = alpha * pulse
    ctx.fillStyle = color
    ctx.beginPath(); ctx.arc(rx, ry, size, 0, Math.PI * 2); ctx.fill()

    // 旋转三角形
    const angle = localT / 1500
    ctx.globalAlpha = alpha * 0.2
    ctx.strokeStyle = color; ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let j = 0; j < 3; j++) {
      const a = angle + j * Math.PI * 2 / 3
      const px = rx + Math.cos(a) * (size + 25)
      const py = ry + Math.sin(a) * (size + 25)
      j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
    }
    ctx.closePath(); ctx.stroke()

    // 左上角小装饰线
    ctx.globalAlpha = alpha * 0.5
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineCap = 'round'
    const lineLen = Math.min(30, localT / 10)
    ctx.beginPath(); ctx.moveTo(cx + 15, cy + 15); ctx.lineTo(cx + 15 + lineLen, cy + 15); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx + 15, cy + 15); ctx.lineTo(cx + 15, cy + 15 + lineLen); ctx.stroke()

    ctx.restore()
  }

  // ---- 结尾 ----
  drawEnding(t) {
    const { ctx, cw, ch, theme, tl, data } = this
    if (t < tl.endStart) return
    const p = Math.min(1, (t - tl.endStart) / 2000)

    // ============================================================
    // 赛博水墨风格 - 全息扫描收尾
    // ============================================================
    if (theme.style === 'cyber-ink') {
      // 全息扫描线
      const scanY = ch * (1 - p)
      ctx.save()
      ctx.globalAlpha = 0.4
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40)
      scanGrad.addColorStop(0, 'transparent')
      scanGrad.addColorStop(0.5, '#00fff7')
      scanGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = scanGrad
      ctx.fillRect(0, scanY - 40, cw, 80)
      ctx.restore()

      // 全息边框
      ctx.save()
      ctx.globalAlpha = p * 0.5
      ctx.strokeStyle = '#00fff7'
      ctx.lineWidth = 1
      ctx.setLineDash([20, 10])
      ctx.strokeRect(20, 20, cw - 40, ch - 40)
      ctx.setLineDash([])
      ctx.restore()

      // 标题重现
      if (p > 0.2 && p < 0.9) {
        const a = Math.min(1, (p - 0.2) / 0.3) * Math.min(1, (0.9 - p) / 0.2)
        ctx.save()
        ctx.globalAlpha = a
        ctx.font = '900 48px "PingFang SC", "Microsoft YaHei", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const textGrad = ctx.createLinearGradient(cw * 0.3, 0, cw * 0.7, 0)
        textGrad.addColorStop(0, '#00fff7')
        textGrad.addColorStop(0.5, '#ffffff')
        textGrad.addColorStop(1, '#ff2d55')
        ctx.fillStyle = textGrad
        ctx.shadowColor = '#00fff7'
        ctx.shadowBlur = 20
        ctx.fillText(data.title || '', cw / 2, ch / 2 - 30)
        ctx.shadowBlur = 0
        ctx.font = '500 22px "PingFang SC", sans-serif'
        ctx.fillStyle = '#ffd700'
        ctx.fillText('— @小福AI自由 —', cw / 2, ch / 2 + 30)
        ctx.restore()
      }
      return
    }

    // ============================================================
    // 禅意极简风格 - 涟漪消散收尾
    // ============================================================
    if (theme.style === 'zen-minimal') {
      // 涟漪效果
      const rippleRadius = cw * 0.8 * p
      ctx.save()
      for (let i = 0; i < 3; i++) {
        const ringProgress = Math.max(0, p - i * 0.15)
        const ringAlpha = (1 - ringProgress) * 0.3
        const ringRadius = rippleRadius * (0.3 + ringProgress * 0.7)
        ctx.globalAlpha = ringAlpha
        ctx.strokeStyle = '#9b9b9b'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.arc(cw / 2, ch / 2, ringRadius, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()

      // 标题重现（极淡）
      if (p > 0.2 && p < 0.85) {
        const a = Math.min(1, (p - 0.2) / 0.3) * Math.min(1, (0.85 - p) / 0.2)
        ctx.save()
        ctx.globalAlpha = a * 0.7
        ctx.font = '300 40px "PingFang SC", "Microsoft YaHei", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#2c2c2c'
        ctx.fillText(data.title || '', cw / 2, ch / 2 - 20)
        ctx.globalAlpha = a * 0.4
        ctx.font = '300 18px "PingFang SC", sans-serif'
        ctx.fillStyle = '#9b9b9b'
        ctx.fillText('少即是多', cw / 2, ch / 2 + 20)
        ctx.restore()
      }

      // 印章
      if (p > 0.5) {
        const sealAlpha = Math.min(1, (p - 0.5) / 0.3)
        ctx.save()
        ctx.globalAlpha = sealAlpha * 0.5
        const sx = cw - 80
        const sy = ch - 80
        const sealSize = 40
        ctx.strokeStyle = '#2c2c2c'
        ctx.lineWidth = 1
        ctx.strokeRect(sx - sealSize / 2, sy - sealSize / 2, sealSize, sealSize)
        ctx.font = '700 24px "KaiTi", "STKaiti", serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#2c2c2c'
        ctx.fillText('禅', sx, sy)
        ctx.restore()
      }
      return
    }

    // ============================================================
    // 默认风格
    // ============================================================
    // 渐变遮罩
    ctx.save(); ctx.globalAlpha = p * 0.5
    ctx.fillStyle = theme.bg[0]; ctx.fillRect(0, 0, cw, ch)
    ctx.restore()

    // 标题重现
    if (p > 0.15 && p < 0.85) {
      const a = Math.min(1, (p - 0.15) / 0.25) * Math.min(1, (0.85 - p) / 0.2)
      ctx.save(); ctx.globalAlpha = a
      ctx.font = '900 52px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'; ctx.shadowColor = theme.glow; ctx.shadowBlur = 25
      ctx.fillText(data.title || '', cw / 2, ch / 2 - 30)
      ctx.shadowBlur = 0
      ctx.font = '500 24px "PingFang SC", sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.fillText('— 小福AI自由 —', cw / 2, ch / 2 + 30)
      ctx.restore()
    }
  }

  // ---- 主循环 ----
  draw(ts) {
    if (!this.startTime) this.startTime = ts
    const t = ts - this.startTime
    this.ctx.clearRect(0, 0, this.cw, this.ch)

    this.drawBg(t)
    this.drawWatermark()
    this.drawTitle(t)
    this.drawCards(t)
    this.drawEnding(t)

    if (this.onProgress) this.onProgress(Math.min(100, Math.round(t / this.tl.total * 100)))

    if (t >= this.tl.total) { this.onDone?.(); return }
    this.animId = requestAnimationFrame(ts2 => this.draw(ts2))
  }

  start() { this.animId = requestAnimationFrame(ts => this.draw(ts)) }
  stop() { if (this.animId) cancelAnimationFrame(this.animId) }
}

// ============================================================
// 组件
// ============================================================
export default function VideoGenerator({ data, theme = 'deep-space', onClose }) {
  console.log('VideoGenerator渲染, data:', data)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const recorderRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [progress, setProgress] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState(null)

  const currentTheme = THEMES[theme] || THEMES['deep-space']

  const startAnim = useCallback((record = false) => {
    const canvas = canvasRef.current
    if (!canvas || !data) return
    canvas.width = 1080; canvas.height = 1920

    const engine = new Engine(canvas, data, theme)
    engineRef.current = engine

    engine.onProgress = setProgress
    engine.onDone = () => {
      setIsPlaying(false)
      if (record && recorderRef.current?.state !== 'inactive') {
        recorderRef.current.stop()
      }
    }

    if (record) {
      const stream = canvas.captureStream(30)
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm'
      const rec = new MediaRecorder(stream, { mimeType: mime })
      const chunks = []
      rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }
      rec.onstop = () => {
        setRecordedBlob(new Blob(chunks, { type: mime }))
        setIsRecording(false)
      }
      recorderRef.current = rec
      rec.start(100)
      setIsRecording(true)
    }

    engine.start()
    setIsPlaying(true)
  }, [data, theme])

  const stopAnim = useCallback(() => {
    engineRef.current?.stop()
    if (recorderRef.current?.state !== 'inactive') recorderRef.current.stop()
    setIsPlaying(false); setIsRecording(false)
  }, [])

  useEffect(() => () => { engineRef.current?.stop(); if (recorderRef.current?.state !== 'inactive') recorderRef.current.stop() }, [])

  if (!data) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, background: '#0a0a0f', borderRadius: 12, color: 'rgba(255,255,255,0.4)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
      <div>等待内容输入...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, background: '#0a0a0f', padding: 24, borderRadius: 16 }}>
      {/* 风格选择 */}
      <div style={{ display: 'flex', gap: 10 }}>
        {Object.entries(THEMES).map(([key, t]) => (
          <button key={key} onClick={() => { /* 切换需重建引擎 */ }}
            style={{ padding: '8px 18px', borderRadius: 20, border: `1px solid ${t.accent}`, background: theme === key ? `${t.accent}20` : 'transparent', color: t.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {t.name}
          </button>
        ))}
      </div>

      {/* 画布 */}
      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <canvas ref={canvasRef} width={1080} height={1920}
          style={{ display: 'block', width: 340, height: 604, background: '#0a0a0f' }} />
        {(isPlaying || isRecording) && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: currentTheme.accent, transition: 'width 0.1s' }} />
          </div>
        )}
        {isRecording && (
          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
            <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 600 }}>REC</span>
          </div>
        )}
      </div>

      {/* 按钮 */}
      <div style={{ display: 'flex', gap: 12 }}>
        {!recordedBlob ? (
          <>
            <button onClick={() => startAnim(false)} disabled={isPlaying && !isRecording}
              style={{ padding: '12px 28px', borderRadius: 24, border: 'none', background: currentTheme.accent, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 20px ${currentTheme.glow}`, opacity: isPlaying && !isRecording ? 0.6 : 1 }}>
              {isPlaying && !isRecording ? '播放中...' : '预览动画'}
            </button>
            <button onClick={() => startAnim(true)} disabled={isRecording}
              style={{ padding: '12px 28px', borderRadius: 24, border: `1px solid ${currentTheme.accent}`, background: 'transparent', color: currentTheme.accent, fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: isRecording ? 0.5 : 1 }}>
              {isRecording ? '录制中...' : '录制视频'}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => {
              const url = URL.createObjectURL(recordedBlob)
              const a = document.createElement('a')
              a.href = url; a.download = `${(data?.title || '视频').slice(0, 10)}.webm`; a.click()
              URL.revokeObjectURL(url)
            }}
              style={{ padding: '12px 28px', borderRadius: 24, border: 'none', background: '#10b981', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              下载视频
            </button>
            <button onClick={() => { setRecordedBlob(null) }}
              style={{ padding: '12px 20px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer' }}>
              重新录制
            </button>
          </>
        )}
        {onClose && (
          <button onClick={onClose} style={{ padding: '12px 20px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer' }}>
            关闭
          </button>
        )}
      </div>

      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
        1080×1920 · 9:16竖屏 · 抖音/视频号/小红书
      </div>
    </div>
  )
}
