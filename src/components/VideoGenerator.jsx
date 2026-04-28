/**
 * Video Generator v3.0 - 短视频动画引擎
 *
 * 三套主题：
 * 1. 立体空间（深空蓝/暮夜金/极光紫） - 原有卡片列表式
 * 2. AI科技风格 - 多边形边+虚线指向内容，依次出现
 */

import { useRef, useEffect, useState, useCallback } from 'react'

// ============================================================
// 工具函数
// ============================================================
function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3) }
function easeOutBack(x) {
  const c1 = 1.70158, c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}
function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2 }

// ============================================================
// 主题配置
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
}

// ============================================================
// Engine v2.5: 网格布局（中国风）
// ============================================================
class GridEngine {
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

    this.particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * this.cw,
      y: Math.random() * this.ch,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 0.5 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.3,
    }))

    this.calcTimeline()
    this.buildGrid()
  }

  calcTimeline() {
    const titleLen = (this.data.title || '').length
    const pts = this.data.points || []
    const n = pts.length
    const t = {
      titleStart: 500,
      titleEnd: 500 + titleLen * 60,
      gridStart: 500 + titleLen * 60 + 300,
      cellDur: 200,
      cellGap: 80,
    }
    t.gridEnd = t.gridStart + n * (t.cellGap + t.cellDur)
    t.endStart = t.gridEnd + 1500
    t.total = t.endStart + 2000
    this.tl = t
    this.n = n
  }

  buildGrid() {
    const { cw, ch } = this
    const pts = this.data.points || []
    const n = pts.length
    if (n === 0) return

    // 4列网格，计算行数
    const cols = 4
    const rows = Math.ceil(n / cols)

    // 边距和间距
    const marginX = 40
    const marginY = 140  // 顶部留空间给标题
    const gapX = 20
    const gapY = 20

    // 每个格子大小
    const cellW = (cw - marginX * 2 - gapX * (cols - 1)) / cols
    const cellH = (ch - marginY - 40 - gapY * (rows - 1)) / rows

    this.cells = pts.map((pt, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = marginX + col * (cellW + gapX)
      const y = marginY + row * (cellH + gapY)
      return { x, y, w: cellW, h: cellH, pt, idx: i }
    })
  }

  drawBg(t) {
    const { ctx, cw, ch, theme } = this
    const [b1, b2, b3] = theme.bg

    const g = ctx.createLinearGradient(0, 0, 0, ch)
    g.addColorStop(0, b1); g.addColorStop(0.5, b2); g.addColorStop(1, b3)
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch)

    const rg = ctx.createRadialGradient(cw / 2, ch * 0.3, 0, cw / 2, ch * 0.3, cw * 0.6)
    rg.addColorStop(0, theme.glow); rg.addColorStop(1, 'transparent')
    ctx.fillStyle = rg; ctx.fillRect(0, 0, cw, ch)

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
  }

  drawWatermark() {
    const { ctx, cw, ch, theme } = this
    ctx.save(); ctx.globalAlpha = 0.3
    ctx.fillStyle = theme.watermark
    ctx.font = '600 20px "PingFang SC", sans-serif'
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'
    ctx.fillText('小福AI自由', cw - 28, ch - 24)
    ctx.restore()
  }

  drawTitle(t) {
    const { ctx, cw, theme, tl, data } = this
    const title = data.title || ''
    if (t < tl.titleStart) return

    ctx.save()
    if (t < tl.titleEnd) {
      const chars = Math.floor((t - tl.titleStart) / 60)
      ctx.font = '900 52px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'

      let totalW = 0, charWidths = []
      for (const ch of title) {
        const w = ctx.measureText(ch).width
        charWidths.push(w); totalW += w
      }

      let x = cw / 2 - totalW / 2
      for (let i = 0; i < Math.min(chars, title.length); i++) {
        const charProgress = i < chars - 1 ? 1 : Math.min(1, (t - tl.titleStart - i * 60) / 120)
        const scale = i < chars - 1 ? 1 : easeOutBack(charProgress)
        ctx.save()
        ctx.translate(x + charWidths[i] / 2, 80)
        ctx.scale(scale, scale)
        ctx.translate(-(x + charWidths[i] / 2), -80)
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = theme.glow; ctx.shadowBlur = 20
        ctx.fillText(title[i], x, 80)
        ctx.restore()
        x += charWidths[i]
      }
    } else {
      ctx.font = '900 40px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = theme.glow; ctx.shadowBlur = 15
      ctx.fillText(title, cw / 2, 80)
      ctx.shadowBlur = 0
      ctx.strokeStyle = theme.accent; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cw / 2 - 180, 115); ctx.lineTo(cw / 2 + 180, 115); ctx.stroke()
    }
    ctx.restore()
  }

  // 自适应字体大小
  fitText(ctx, text, maxW, maxH, maxFontSize = 32, minFontSize = 16) {
    for (let fs = maxFontSize; fs >= minFontSize; fs -= 2) {
      ctx.font = `700 ${fs}px "PingFang SC", sans-serif`
      const lines = this.wrapTextLines(ctx, text, maxW)
      const lineH = fs * 1.3
      const totalH = lines.length * lineH
      if (totalH <= maxH) {
        return { fontSize: fs, lines, lineH }
      }
    }
    // 最小字号也放不下，截断
    ctx.font = `700 ${minFontSize}px "PingFang SC", sans-serif`
    return { fontSize: minFontSize, lines: this.wrapTextLines(ctx, text, maxW), lineH: minFontSize * 1.3 }
  }

  wrapTextLines(ctx, text, maxW) {
    const lines = []
    let line = ''
    for (const ch of text) {
      const test = line + ch
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line); line = ch
      } else { line = test }
    }
    if (line) lines.push(line)
    return lines
  }

  drawCells(t) {
    const { ctx, theme, tl, cells } = this
    if (!cells || t < tl.gridStart) return

    for (let i = 0; i < cells.length; i++) {
      const cellStart = tl.gridStart + i * (tl.cellGap + tl.cellDur)
      if (t < cellStart) continue

      const prog = Math.min(1, (t - cellStart) / tl.cellDur)
      const eased = easeOutCubic(prog)

      const cell = cells[i]
      const color = theme.cardColors[i % theme.cardColors.length]

      ctx.save()

      // 入场动画
      const scale = 0.9 + eased * 0.1
      const alpha = eased
      const cx = cell.x + cell.w / 2
      const cy = cell.y + cell.h / 2

      ctx.globalAlpha = alpha
      ctx.translate(cx, cy)
      ctx.scale(scale, scale)
      ctx.translate(-cx, -cy)

      // 背景框
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      this._rrect(ctx, cell.x, cell.y, cell.w, cell.h, 12)
      ctx.fill(); ctx.stroke()

      // 序号 - 缩小到18px，放左上角
      const numSize = 18
      const numX = cell.x + 15
      const numY = cell.y + 22
      ctx.fillStyle = color
      ctx.font = `800 ${numSize}px "PingFang SC", sans-serif`
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      ctx.fillText(String(i + 1).padStart(2, '0'), numX, numY)

      // 标题 - 自适应大小，居中
      const title = cell.pt.label || cell.pt.kw || ''
      const titleMaxW = cell.w - 20
      const titleMaxH = cell.h * 0.35
      const titleFit = this.fitText(ctx, title, titleMaxW, titleMaxH, 28, 16)

      const titleY = cell.y + cell.h * 0.45  // 垂直偏上一点
      ctx.fillStyle = '#ffffff'
      ctx.font = `700 ${titleFit.fontSize}px "PingFang SC", sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'

      const titleTotalH = titleFit.lines.length * titleFit.lineH
      let ty = titleY - titleTotalH / 2 + titleFit.lineH / 2
      for (const line of titleFit.lines) {
        ctx.fillText(line, cx, ty)
        ty += titleFit.lineH
      }

      // 描述 - 更小的字，在标题下方
      const desc = cell.pt.desc || cell.pt.short || ''
      if (desc) {
        const descMaxW = cell.w - 24
        const descMaxH = cell.h * 0.35
        const descFit = this.fitText(ctx, desc, descMaxW, descMaxH, 20, 12)

        const descY = cell.y + cell.h * 0.78
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = `400 ${descFit.fontSize}px "PingFang SC", sans-serif`

        const descTotalH = descFit.lines.length * descFit.lineH
        let dy = descY - descTotalH / 2 + descFit.lineH / 2
        for (const line of descFit.lines) {
          ctx.fillText(line, cx, dy)
          dy += descFit.lineH
        }
      }

      // 右上角对勾
      const checkX = cell.x + cell.w - 20
      const checkY = cell.y + 20
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(checkX - 6, checkY)
      ctx.lineTo(checkX - 2, checkY + 4)
      ctx.lineTo(checkX + 6, checkY - 6)
      ctx.stroke()

      ctx.restore()
    }
  }

  _rrect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  drawEnding(t) {
    const { ctx, cw, ch, theme, tl, data } = this
    if (t < tl.endStart) return
    const p = Math.min(1, (t - tl.endStart) / 2000)

    ctx.save(); ctx.globalAlpha = p * 0.5
    ctx.fillStyle = theme.bg[0]; ctx.fillRect(0, 0, cw, ch)
    ctx.restore()

    if (p > 0.2 && p < 0.85) {
      const a = Math.min(1, (p - 0.2) / 0.3) * Math.min(1, (0.85 - p) / 0.2)
      ctx.save(); ctx.globalAlpha = a
      ctx.font = '900 48px "PingFang SC", sans-serif'
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

  draw(ts) {
    if (!this.startTime) this.startTime = ts
    const t = ts - this.startTime
    this.ctx.clearRect(0, 0, this.cw, this.ch)

    this.drawBg(t)
    this.drawWatermark()
    this.drawTitle(t)
    this.drawCells(t)
    this.drawEnding(t)

    if (this.onProgress) this.onProgress(Math.min(100, Math.round(t / this.tl.total * 100)))

    if (t >= this.tl.total) { this.onDone?.(); return }
    this.animId = requestAnimationFrame(ts2 => this.draw(ts2))
  }

  start() { this.animId = requestAnimationFrame(ts => this.draw(ts)) }
  stop() { if (this.animId) cancelAnimationFrame(this.animId) }
}

// ============================================================
// Engine v3: AI科技多边形动画
// ============================================================
class TechEngine {
  constructor(canvas, data, themeKey) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.data = data
    this.theme = THEMES[themeKey] || THEMES['aurora']
    this.cw = canvas.width
    this.ch = canvas.height
    this.startTime = null
    this.animId = null
    this.onDone = null
    this.onProgress = null

    // 粒子背景
    this.particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * this.cw,
      y: Math.random() * this.ch,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 0.5 + Math.random() * 2.5,
      alpha: 0.1 + Math.random() * 0.4,
    }))

    this.calcTimeline()
    this.buildPolygon()
  }

  calcTimeline() {
    const pts = this.data.points || []
    const titleLen = (this.data.title || '').length
    const n = pts.length
    const t = {
      titleStart: 600,
      titleEnd: 600 + titleLen * 80,
      polyStart: 600 + titleLen * 80 + 400,
      edgeDur: 600,
      dashDelay: 300,
      dashDur: 500,
      cardDelay: 200,
      cardDur: 400,
      edgeGap: 200,
    }
    t.polyEnd = t.polyStart + n * (t.edgeGap + t.edgeDur)
    t.endStart = t.polyEnd + 2000
    t.total = t.endStart + 2500
    this.tl = t
    this.n = n
  }

  buildPolygon() {
    const { cw, ch } = this
    const pts = this.data.points || []
    const n = pts.length
    if (n === 0) return

    // 多边形中心在画面上半部，Y约占40%高度
    const cx = cw / 2
    const cy = ch * 0.3
    const rx = Math.min(cw * 0.38, 350)
    const ry = rx * 0.7

    this.vertices = []
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2
      this.vertices.push({
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
      })
    }

    // 内容卡片定位：每个顶点旁边
    this.cards = pts.map((pt, i) => {
      const v = this.vertices[i]
      // 卡片放在多边形外侧，优先左/右对齐
      const cardW = 300, cardH = 160
      const side = i < n / 2 ? -1 : 1  // 左半圆放左侧，右半圆放右侧
      const cardX = side === -1
        ? Math.max(20, v.x - cardW - 60)
        : Math.min(cw - cardW - 20, v.x + 60)
      const cardY = Math.max(20, Math.min(ch - cardH - 20, v.y - cardH / 2))
      return { x: cardX, y: cardY, w: cardW, h: cardH, pt }
    })

    // 预计算每条边长度
    this.edges = []
    for (let i = 0; i < n; i++) {
      const a = this.vertices[i]
      const b = this.vertices[(i + 1) % n]
      const len = Math.hypot(b.x - a.x, b.y - a.y)
      this.edges.push({ a, b, len })
    }
  }

  // ---- 背景 ----
  drawBg(t) {
    const { ctx, cw, ch, theme } = this
    const [b1, b2, b3] = theme.bg

    // 渐变背景
    const g = ctx.createLinearGradient(0, 0, 0, ch)
    g.addColorStop(0, b1); g.addColorStop(0.5, b2); g.addColorStop(1, b3)
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch)

    // 中心光晕
    const rg = ctx.createRadialGradient(cw / 2, ch * 0.3, 0, cw / 2, ch * 0.3, cw * 0.6)
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

    // 网格
    ctx.strokeStyle = `${theme.accent}06`; ctx.lineWidth = 1
    for (let y = 0; y < ch; y += 80) {
      ctx.globalAlpha = 0.05 * (1 - y / ch)
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke()
    }
    for (let x = 0; x < cw; x += 80) {
      ctx.globalAlpha = 0.04
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  // ---- 水印 ----
  drawWatermark() {
    const { ctx, cw, ch, theme } = this
    ctx.save(); ctx.globalAlpha = 0.3
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
    if (t < tl.titleEnd) {
      const chars = Math.floor((t - tl.titleStart) / 80)
      ctx.font = `900 60px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'

      // 测量总宽度
      let totalW = 0, charWidths = []
      for (const ch of title) {
        const w = ctx.measureText(ch).width
        charWidths.push(w); totalW += w
      }

      let x = cw / 2 - totalW / 2
      for (let i = 0; i < Math.min(chars, title.length); i++) {
        const charProgress = i < chars - 1 ? 1 : Math.min(1, (t - tl.titleStart - i * 80) / 160)
        const scale = i < chars - 1 ? 1 : easeOutBack(charProgress)

        ctx.save()
        ctx.translate(x + charWidths[i] / 2, this.ch / 2)
        ctx.scale(scale, scale)
        ctx.translate(-(x + charWidths[i] / 2), -(this.ch / 2))
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = theme.glow; ctx.shadowBlur = 20
        ctx.fillText(title[i], x, this.ch / 2)
        ctx.restore()
        x += charWidths[i]
      }

      // 光标
      if (Math.floor(t / 350) % 2 === 0 && chars < title.length) {
        ctx.fillStyle = theme.accent
        ctx.fillRect(x + 4, ch * 0.3 - 30 + 5, 3, 50)
      }
    } else {
      // 稳定在顶部
      ctx.font = '900 36px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = theme.glow; ctx.shadowBlur = 15
      ctx.fillText(title, cw / 2, 80)
      ctx.shadowBlur = 0
      // 装饰线
      ctx.strokeStyle = theme.accent; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cw / 2 - 200, 115); ctx.lineTo(cw / 2 + 200, 115); ctx.stroke()
    }
    ctx.restore()
  }

  // ---- 多边形边 ----
  drawPolygon(t) {
    const { ctx, cw, ch, theme, tl, vertices, edges } = this
    if (!vertices || t < tl.polyStart) return

    const n = edges.length
    for (let i = 0; i < n; i++) {
      const edgeStart = tl.polyStart + i * (this.tl.edgeGap + this.tl.edgeDur)
      if (t < edgeStart) break

      const edgeEnd = edgeStart + this.tl.edgeDur
      const progress = Math.min(1, (t - edgeStart) / (edgeEnd - edgeStart))
      const eased = easeOutCubic(progress)

      const { a, b } = edges[i]
      const color = theme.cardColors[i % theme.cardColors.length]

      // 当前边的已绘制部分
      const ex = a.x + (b.x - a.x) * eased
      const ey = a.y + (b.y - a.y) * eased

      // 完整多边形边框（已完成的边 + 当前边的已绘制部分）
      ctx.save()

      // 已完成的边
      if (i > 0) {
        ctx.strokeStyle = `${theme.accent}30`; ctx.lineWidth = 1.5; ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(vertices[0].x, vertices[0].y)
        for (let k = 1; k <= i; k++) {
          ctx.lineTo(vertices[k].x, vertices[k].y)
        }
        if (i < n) ctx.lineTo(ex, ey)
        ctx.stroke()
      }

      // 当前边的绘制动画
      const glowPulse = 0.6 + 0.4 * Math.sin(t / 300)
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.shadowColor = color
      ctx.shadowBlur = 15 * glowPulse
      ctx.globalAlpha = 0.6 + 0.4 * glowPulse
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(ex, ey)
      ctx.stroke()

      // 边端点发光圆
      ctx.shadowBlur = 20
      ctx.globalAlpha = 1
      ctx.fillStyle = color
      ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill()

      ctx.restore()

      // 顶点圆圈（已完成 + 当前活跃）
      for (let k = 0; k <= i; k++) {
        const v = vertices[k]
        const isActive = k === i
        ctx.save()
        ctx.fillStyle = isActive ? color : `${theme.accent}50`
        ctx.shadowColor = color; ctx.shadowBlur = isActive ? 15 : 5
        ctx.beginPath(); ctx.arc(v.x, v.y, isActive ? 6 : 4, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      }
    }
  }

  // ---- 虚线指向内容卡片 ----
  drawDashes(t) {
    const { ctx, cw, ch, theme, tl, vertices, cards } = this
    const n = vertices.length

    for (let i = 0; i < n; i++) {
      const dashStart = tl.polyStart + i * (this.tl.edgeGap + this.tl.edgeDur) + this.tl.dashDelay
      if (t < dashStart) continue

      const dashEnd = dashStart + this.tl.dashDur
      const dashProg = Math.min(1, (t - dashStart) / (this.tl.dashDur))
      const eased = easeOutCubic(dashProg)

      const card = cards[i]
      const v = vertices[i]

      // 卡片中心
      const cx = card.x + card.w / 2
      const cy = card.y + card.h / 2

      // 线端点：顶点指向卡片中心
      const angle = Math.atan2(cy - v.y, cx - v.x)
      const startAngle = angle + 0.3  // 向外偏移一点点
      const ex = v.x + Math.cos(startAngle) * 20
      const ey = v.y + Math.sin(startAngle) * 20

      const dashLen = Math.hypot(cx - ex, cy - ey)
      const drawnLen = dashLen * eased

      const color = theme.cardColors[i % theme.cardColors.length]

      ctx.save()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.setLineDash([8, 6])
      ctx.lineCap = 'round'
      ctx.shadowColor = color; ctx.shadowBlur = 8
      ctx.globalAlpha = 0.5 + 0.5 * eased

      // 绘制虚线
      ctx.beginPath()
      ctx.moveTo(ex, ey)
      ctx.lineTo(ex + Math.cos(angle) * drawnLen, ey + Math.sin(angle) * drawnLen)
      ctx.stroke()

      // 箭头
      if (dashProg > 0.5) {
        const arrowProg = (dashProg - 0.5) * 2
        const ax = ex + Math.cos(angle) * drawnLen
        const ay = ey + Math.sin(angle) * drawnLen
        const aSize = 8 * easeOutCubic(arrowProg)
        ctx.setLineDash([])
        ctx.globalAlpha = arrowProg
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(ax - Math.cos(angle - 0.4) * aSize, ay - Math.sin(angle - 0.4) * aSize)
        ctx.moveTo(ax, ay)
        ctx.lineTo(ax - Math.cos(angle + 0.4) * aSize, ay - Math.sin(angle + 0.4) * aSize)
        ctx.stroke()
      }

      ctx.restore()
    }
  }

  // ---- 内容卡片 ----
  drawCards(t) {
    const { ctx, cw, ch, theme, tl, cards } = this

    for (let i = 0; i < cards.length; i++) {
      const cardStart = tl.polyStart + i * (this.tl.edgeGap + this.tl.edgeDur) + this.tl.dashDelay + this.tl.cardDelay
      if (t < cardStart) continue

      const cardEnd = cardStart + this.tl.cardDur
      const localT = t - cardStart
      const prog = Math.min(1, (t - cardStart) / (this.tl.cardDur))
      const eased = easeOutCubic(prog)

      const card = cards[i]
      const color = theme.cardColors[i % theme.cardColors.length]

      ctx.save()

      // 卡片入场：从0.9缩放+透明过渡到正常
      const scale = 0.85 + eased * 0.15
      const alpha = eased
      const cardCX = card.x + card.w / 2
      const cardCY = card.y + card.h / 2

      ctx.globalAlpha = alpha
      ctx.translate(cardCX, cardCY)
      ctx.scale(scale, scale)
      ctx.translate(-cardCX, -cardCY)

      // 背景
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      ctx.strokeStyle = `${color}50`
      ctx.lineWidth = 1.5
      this._rrect(ctx, card.x, card.y, card.w, card.h, 12)
      ctx.fill(); ctx.stroke()

      // 左侧彩色条
      ctx.fillStyle = color
      this._rrect(ctx, card.x, card.y, 5, card.h, 3)
      ctx.fill()

      // 序号
      const numY = card.y + 35
      ctx.fillStyle = color
      ctx.shadowColor = color; ctx.shadowBlur = 12
      ctx.font = '800 28px "PingFang SC", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(String(i + 1), card.x + 40, numY)
      ctx.shadowBlur = 0

      // 小标题
      const label = card.pt.label || card.pt.kw || ''
      ctx.fillStyle = '#ffffff'
      ctx.font = '700 26px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      ctx.fillText(label.slice(0, 8), card.x + 65, numY)

      // 分隔线
      ctx.strokeStyle = `${color}30`; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(card.x + 15, card.y + 60); ctx.lineTo(card.x + card.w - 15, card.y + 60); ctx.stroke()

      // 描述文字
      const desc = card.pt.desc || card.pt.short || ''
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.font = '400 22px "PingFang SC", sans-serif'
      ctx.textAlign = 'left'; ctx.textBaseline = 'top'
      this._wrapText(ctx, desc.slice(0, 30), card.x + 15, card.y + 72, card.w - 30, 30)

      // 右上角装饰圆
      const pulse = 0.4 + 0.3 * Math.sin(t / 400 + i)
      ctx.globalAlpha = pulse * 0.3
      ctx.strokeStyle = color; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(card.x + card.w - 20, card.y + 20, 10, 0, Math.PI * 2); ctx.stroke()
      ctx.globalAlpha = alpha

      ctx.restore()
    }
  }

  _rrect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
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

  // ---- 结尾 ----
  drawEnding(t) {
    const { ctx, cw, ch, theme, tl, data } = this
    if (t < tl.endStart) return
    const p = Math.min(1, (t - tl.endStart) / 2000)

    ctx.save(); ctx.globalAlpha = p * 0.5
    ctx.fillStyle = theme.bg[0]; ctx.fillRect(0, 0, cw, ch)
    ctx.restore()

    if (p > 0.2 && p < 0.85) {
      const a = Math.min(1, (p - 0.2) / 0.3) * Math.min(1, (0.85 - p) / 0.2)
      ctx.save(); ctx.globalAlpha = a
      ctx.font = '900 48px "PingFang SC", sans-serif'
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
    this.drawPolygon(t)
    this.drawDashes(t)
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
// 原 Engine（卡片列表式）- 保持兼容
// ============================================================
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

class ClassicEngine {
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

  drawBg(t) {
    const { ctx, cw, ch, theme } = this
    const [b1, b2, b3] = theme.bg
    const g = ctx.createLinearGradient(0, 0, 0, ch)
    g.addColorStop(0, b1); g.addColorStop(0.5, b2); g.addColorStop(1, b3)
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch)

    const rg = ctx.createRadialGradient(cw / 2, ch * 0.35, 0, cw / 2, ch * 0.35, cw * 0.65)
    rg.addColorStop(0, theme.glow); rg.addColorStop(1, 'transparent')
    ctx.fillStyle = rg; ctx.fillRect(0, 0, cw, ch)

    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0) p.x = cw; if (p.x > cw) p.x = 0
      if (p.y < 0) p.y = ch; if (p.y > ch) p.y = ch
      const pulse = 0.5 + 0.5 * Math.sin(t / 1200 + p.x * 0.005)
      ctx.globalAlpha = p.alpha * pulse
      ctx.fillStyle = theme.particles.color
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill()
    })
    ctx.globalAlpha = 1

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

  drawWatermark() {
    const { ctx, cw, ch, theme } = this
    ctx.save(); ctx.globalAlpha = 0.35
    ctx.fillStyle = theme.watermark
    ctx.font = '600 20px "PingFang SC", sans-serif'
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'
    ctx.fillText('小福AI自由', cw - 28, ch - 24)
    ctx.restore()
  }

  drawTitle(t) {
    const { ctx, cw, ch, theme, tl, data } = this
    const title = data.title || ''
    if (t < tl.titleStart) return

    ctx.save()
    if (t < tl.titleEnd) {
      const chars = Math.floor((t - tl.titleStart) / 90)
      ctx.font = `900 60px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'

      let totalW = 0, charWidths = []
      for (const ch of title) {
        const w = ctx.measureText(ch).width
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
      if (Math.floor(t / 400) % 2 === 0 && chars < title.length) {
        ctx.fillStyle = theme.accent
        ctx.fillRect(x + 4, ch / 2 - 30 + 5, 3, 50)
      }
    } else if (t < tl.titleMoveEnd) {
      const p = easeOutCubic((t - tl.titleEnd) / (tl.titleMoveEnd - tl.titleEnd))
      const y = ch / 2 + (100 - ch / 2) * p
      const fs = 60 + (40 - 60) * p
      ctx.font = `900 ${Math.round(fs)}px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = theme.glow; ctx.shadowBlur = 20
      ctx.fillText(title, cw / 2, y)
    } else {
      ctx.font = '900 40px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = theme.glow; ctx.shadowBlur = 12
      ctx.fillText(title, cw / 2, 100)
      ctx.strokeStyle = theme.accent; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cw / 2 - 190, 140); ctx.lineTo(cw / 2 + 190, 140); ctx.stroke()
    }
    ctx.shadowBlur = 0; ctx.restore()
  }

  drawCards(t) {
    const { ctx, cw, ch, theme, tl, data } = this
    const pts = data.points || []
    if (t < tl.contentStart) return

    const cardX = 50, cardW = cw - 100, cardH = 200, gap = 30, startY = 190

    pts.forEach((pt, i) => {
      const itemStart = tl.contentStart + i * tl.itemDur
      if (t < itemStart) return

      const localT = t - itemStart
      const color = theme.cardColors[i % theme.cardColors.length]

      let alpha = 1, yOff = 0, scale = 1
      if (localT < 400) {
        const p = easeOutCubic(localT / 400)
        alpha = p; yOff = (1 - p) * 40; scale = 0.96 + p * 0.04
      }

      const y = startY + i * (cardH + gap) + yOff
      ctx.save(); ctx.globalAlpha = alpha

      roundedRect(ctx, cardX, y, cardW, cardH, 16)
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fill()
      ctx.strokeStyle = `${color}40`; ctx.lineWidth = 1.5; ctx.stroke()

      ctx.fillStyle = color
      roundedRect(ctx, cardX, y, 6, cardH, 3); ctx.fill()

      const numX = cardX + 65, numY = y + 65, numR = 40
      ctx.shadowColor = color; ctx.shadowBlur = 20
      ctx.beginPath(); ctx.arc(numX, numY, numR, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
      ctx.shadowBlur = 0

      ctx.fillStyle = '#ffffff'
      ctx.font = '900 36px "PingFang SC", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(String(i + 1), numX, numY)

      const kw = pt.label || pt.kw || ''
      ctx.fillStyle = color
      ctx.shadowColor = color; ctx.shadowBlur = 8
      ctx.font = '800 38px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      ctx.fillText(kw.slice(0, 10), numX + numR + 30, y + 55)
      ctx.shadowBlur = 0

      const desc = pt.desc || pt.short || ''
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.font = '400 26px "PingFang SC", sans-serif'
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      this._wrapText(ctx, desc.slice(0, 40), numX + numR + 30, y + 110, cardW - (numX + numR + 30 - cardX) - 30, 34)

      // 装饰
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

  _drawDeco(ctx, idx, color, alpha, localT, cx, cy, cw, ch) {
    ctx.save()
    const rx = cx + cw - 60, ry = cy + ch / 2
    const pulse = 0.3 + 0.15 * Math.sin(localT / 500)
    const size = 18 + 6 * Math.sin(localT / 400)
    ctx.globalAlpha = alpha * pulse * 0.4
    ctx.strokeStyle = color; ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(rx, ry, size + 12, 0, Math.PI * 2); ctx.stroke()
    ctx.globalAlpha = alpha * pulse
    ctx.fillStyle = color
    ctx.beginPath(); ctx.arc(rx, ry, size, 0, Math.PI * 2); ctx.fill()
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
    ctx.globalAlpha = alpha * 0.5
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineCap = 'round'
    const lineLen = Math.min(30, localT / 10)
    ctx.beginPath(); ctx.moveTo(cx + 15, cy + 15); ctx.lineTo(cx + 15 + lineLen, cy + 15); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx + 15, cy + 15); ctx.lineTo(cx + 15, cy + 15 + lineLen); ctx.stroke()
    ctx.restore()
  }

  drawEnding(t) {
    const { ctx, cw, ch, theme, tl, data } = this
    if (t < tl.endStart) return
    const p = Math.min(1, (t - tl.endStart) / 2000)
    ctx.save(); ctx.globalAlpha = p * 0.5
    ctx.fillStyle = theme.bg[0]; ctx.fillRect(0, 0, cw, ch)
    ctx.restore()
    if (p > 0.15 && p < 0.85) {
      const a = Math.min(1, (p - 0.15) / 0.25) * Math.min(1, (0.85 - p) / 0.2)
      ctx.save(); ctx.globalAlpha = a
      ctx.font = '900 52px "PingFang SC", sans-serif'
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

  draw(ts) {
    if (!this.startTime) this.startTime = ts
    const t = ts - this.startTime
    this.ctx.clearRect(0, 0, this.cw, this.ch)
    this.drawBg(t); this.drawWatermark(); this.drawTitle(t)
    this.drawCards(t); this.drawEnding(t)
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
export default function VideoGenerator({ data, theme: propTheme = 'deep-space', onClose }) {
  console.log('VideoGenerator渲染, data:', data)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const recorderRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [progress, setProgress] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState(null)
  const [activeTheme, setActiveTheme] = useState(propTheme)

  const currentTheme = THEMES[activeTheme] || THEMES['deep-space']

  useEffect(() => {
    if (!data) return
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 1080; canvas.height = 1920

    engineRef.current?.stop()
    let EngineClass = ClassicEngine
    if (activeTheme === 'tech') EngineClass = TechEngine
    else if (activeTheme === 'grid') EngineClass = GridEngine
    const engine = new EngineClass(canvas, data, activeTheme === 'grid' ? 'deep-space' : activeTheme)
    engineRef.current = engine
    engine.onProgress = setProgress
    engine.onDone = () => {
      setIsPlaying(false)
      if (recorderRef.current?.state !== 'inactive') recorderRef.current?.stop()
    }
    engine.start()
    setIsPlaying(true)
    setProgress(0)
  }, [data, activeTheme])

  const startAnim = useCallback((record = false) => {
    const canvas = canvasRef.current
    if (!canvas || !data) return
    canvas.width = 1080; canvas.height = 1920

    engineRef.current?.stop()
    let EngineClass = ClassicEngine
    if (activeTheme === 'tech') EngineClass = TechEngine
    else if (activeTheme === 'grid') EngineClass = GridEngine
    const engine = new EngineClass(canvas, data, activeTheme === 'grid' ? 'deep-space' : activeTheme)
    engineRef.current = engine

    engine.onProgress = setProgress
    engine.onDone = () => {
      setIsPlaying(false)
      if (record && recorderRef.current?.state !== 'inactive') recorderRef.current.stop()
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
  }, [data, activeTheme])

  const stopAnim = useCallback(() => {
    engineRef.current?.stop()
    if (recorderRef.current?.state !== 'inactive') recorderRef.current.stop()
    setIsPlaying(false); setIsRecording(false)
  }, [])

  useEffect(() => () => {
    engineRef.current?.stop()
    if (recorderRef.current?.state !== 'inactive') recorderRef.current.stop()
  }, [])

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
          <button key={key} onClick={() => { engineRef.current?.stop(); setActiveTheme(key) }}
            style={{ padding: '8px 18px', borderRadius: 20, border: `1px solid ${t.accent}`, background: activeTheme === key ? `${t.accent}20` : 'transparent', color: t.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {t.name}
          </button>
        ))}
        <button onClick={() => { engineRef.current?.stop(); setActiveTheme('tech') }}
          style={{ padding: '8px 18px', borderRadius: 20, border: `1px solid #a855f7`, background: activeTheme === 'tech' ? '#a855f720' : 'transparent', color: '#a855f7', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          AI科技多边形
        </button>
        <button onClick={() => { engineRef.current?.stop(); setActiveTheme('grid') }}
          style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid #10b981', background: activeTheme === 'grid' ? '#10b98120' : 'transparent', color: '#10b981', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          网格布局
        </button>
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