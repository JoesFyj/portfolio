/**
 * VideoGenerator v2.0 - 短视频动画引擎
 *
 * 架构：内容层 → 布局算法 → 渲染引擎 → 录制导出
 *
 * 支持：
 * - 16:9 横版（1920×1080）
 * - 5大配置模块 + 预设风格库
 * - 布局引擎（按条数自适应1-20条）
 * - 接力问题风格（无水印）
 * - 录制时画面自动放大铺满
 * - MP4导出（FFmpeg.wasm）
 */

import { useRef, useEffect, useState, useCallback } from 'react'

// ============================================================
// 工具函数
// ============================================================
export function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3) }
export function easeOutBack(x) {
  const c1 = 1.70158, c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}
export function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2 }

// ============================================================
// 布局引擎 - 根据条数选择布局
// ============================================================
export function getLayout(n) {
  if (n <= 1) return { type: 'single', cols: 1, rows: 1 }
  if (n <= 3) return { type: 'centered', cols: 1, rows: n }
  if (n <= 6) return { type: 'dual', cols: 2, rows: Math.ceil(n / 2) }
  if (n <= 9) return { type: 'grid3x', cols: 3, rows: Math.ceil(n / 3) }
  if (n <= 12) return { type: 'grid4x', cols: 4, rows: Math.ceil(n / 4) }
  return { type: 'grid4x', cols: 4, rows: Math.ceil(n / 4) }
}

// ============================================================
// 预设风格库
// ============================================================
export const PRESETS = {
  tech: {
    name: '知识科普',
    icon: '🔬',
    bg: ['#040812', '#0a1628', '#0f2040'],
    accent: '#00d4ff',
    glow: 'rgba(0,212,255,0.35)',
    text: '#ffffff',
    watermark: 'rgba(0,212,255,0.3)',
    particleColor: '#00d4ff',
    cardBg: 'rgba(0,212,255,0.08)',
    cardBorder: 'rgba(0,212,255,0.4)',
    cardColors: ['#00d4ff', '#f97316', '#10b981', '#ec4899', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'],
  },
  warm: {
    name: '暖色人文',
    icon: '🌅',
    bg: ['#1a0f05', '#2d1810', '#3d2010'],
    accent: '#f0c040',
    glow: 'rgba(240,192,64,0.3)',
    text: '#ffffff',
    watermark: 'rgba(240,192,64,0.3)',
    particleColor: '#f0c040',
    cardBg: 'rgba(240,192,64,0.08)',
    cardBorder: 'rgba(240,192,64,0.4)',
    cardColors: ['#f0c040', '#ef4444', '#f97316', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#fb923c'],
  },
  dark: {
    name: '硬核干货',
    icon: '💀',
    bg: ['#0a0a0a', '#111111', '#1a1a1a'],
    accent: '#ffffff',
    glow: 'rgba(255,255,255,0.2)',
    text: '#ffffff',
    watermark: 'rgba(255,255,255,0.25)',
    particleColor: '#ffffff',
    cardBg: 'rgba(255,255,255,0.05)',
    cardBorder: 'rgba(255,255,255,0.3)',
    cardColors: ['#ffffff', '#ef4444', '#f97316', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#fb923c'],
  },
  minimal: {
    name: '清新简约',
    icon: '🍃',
    bg: ['#f8f8f8', '#f0f0f0', '#e8e8e8'],
    accent: '#22c55e',
    glow: 'rgba(34,197,94,0.2)',
    text: '#1a1a1a',
    watermark: 'rgba(34,197,94,0.3)',
    particleColor: '#22c55e',
    cardBg: 'rgba(34,197,94,0.05)',
    cardBorder: 'rgba(34,197,94,0.3)',
    cardColors: ['#22c55e', '#16a34a', '#0d9488', '#0891b2', '#7c3aed', '#db2777'],
  },
  mountain: {
    name: '山野自然',
    icon: '⛰️',
    bg: ['#0a1a0a', '#0f2d1a', '#1a4020'],
    accent: '#86efac',
    glow: 'rgba(134,239,172,0.25)',
    text: '#ffffff',
    watermark: 'rgba(134,239,172,0.3)',
    particleColor: '#86efac',
    cardBg: 'rgba(134,239,172,0.07)',
    cardBorder: 'rgba(134,239,172,0.35)',
    cardColors: ['#86efac', '#4ade80', '#22d3ee', '#a78bfa', '#fb923c', '#f472b6', '#fbbf24', '#34d399'],
  },
}

// ============================================================
// 通用渲染引擎（标准列表风格）
// ============================================================
class ListEngine {
  constructor(canvas, data, presetKey) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.data = data
    this.preset = PRESETS[presetKey] || PRESETS.tech
    this.cw = 1920
    this.ch = 1080
    this.startTime = null
    this.animId = null
    this.onDone = null
    this.onProgress = null
    this.showWatermark = true

    this.particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * this.cw,
      y: Math.random() * this.ch,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: 0.5 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.3,
    }))

    this.calcTimeline()
    this.buildLayout()
  }

  calcTimeline() {
    const pts = this.data?.points || []
    const n = pts.length
    const titleLen = (this.data?.title || '').length
    const t = {
      titleStart: 500,
      titleEnd: 500 + titleLen * 80,
      itemStart: 500 + titleLen * 80 + 400,
      itemDur: 350,
      itemGap: 80,
    }
    t.itemsEnd = t.itemStart + n * (t.itemDur + t.itemGap)
    t.endStart = t.itemsEnd + 1500,
    t.total = t.endStart + 2500
    this.tl = t
    this.n = n
  }

  buildLayout() {
    const { cw, ch } = this
    const pts = this.data?.points || []
    const n = pts.length
    const layout = getLayout(n)
    this.layout = layout

    const marginTop = 160  // 标题区域
    const marginX = 80
    const marginY = 40
    const gapX = 24
    const gapY = 24

    if (layout.type === 'single') {
      // 1条：全屏大字居中
      this.cells = [{
        x: marginX,
        y: ch * 0.2,
        w: cw - marginX * 2,
        h: ch * 0.6,
        pt: pts[0],
        idx: 0,
      }]
    } else if (layout.type === 'centered') {
      // 2-3条：垂直居中排列
      const cellH = (ch - marginTop - marginY * 2 - gapY * (n - 1)) / n
      this.cells = pts.map((pt, i) => ({
        x: cw * 0.2,
        y: marginTop + i * (cellH + gapY),
        w: cw * 0.6,
        h: cellH,
        pt,
        idx: i,
      }))
    } else if (layout.type === 'dual') {
      const cols = 2
      const rows = Math.ceil(n / cols)
      const cellW = (cw - marginX * 2 - gapX * (cols - 1)) / cols
      const cellH = (ch - marginTop - marginY - gapY * (rows - 1)) / rows
      this.cells = pts.map((pt, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        return {
          x: marginX + col * (cellW + gapX),
          y: marginTop + row * (cellH + gapY),
          w: cellW,
          h: cellH,
          pt,
          idx: i,
        }
      })
    } else {
      // grid3x / grid4x
      const cols = layout.cols
      const rows = Math.ceil(n / cols)
      const cellW = (cw - marginX * 2 - gapX * (cols - 1)) / cols
      const cellH = (ch - marginTop - marginY - gapY * (rows - 1)) / rows
      this.cells = pts.map((pt, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        return {
          x: marginX + col * (cellW + gapX),
          y: marginTop + row * (cellH + gapY),
          w: cellW,
          h: cellH,
          pt,
          idx: i,
        }
      })
    }
  }

  drawBg(t) {
    const { ctx, cw, ch, preset } = this
    const [b1, b2, b3] = preset.bg

    const g = ctx.createLinearGradient(0, 0, 0, ch)
    g.addColorStop(0, b1); g.addColorStop(0.5, b2); g.addColorStop(1, b3)
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch)

    // 中心光晕
    const rg = ctx.createRadialGradient(cw / 2, ch * 0.35, 0, cw / 2, ch * 0.35, cw * 0.55)
    rg.addColorStop(0, preset.glow); rg.addColorStop(1, 'transparent')
    ctx.fillStyle = rg; ctx.fillRect(0, 0, cw, ch)

    // 粒子
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0) p.x = cw; if (p.x > cw) p.x = 0
      if (p.y < 0) p.y = ch; if (p.y > ch) p.y = ch
      const pulse = 0.5 + 0.5 * Math.sin(t / 1200 + p.x * 0.003)
      ctx.globalAlpha = p.alpha * pulse
      ctx.fillStyle = preset.particleColor
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill()
    })
    ctx.globalAlpha = 1

    // 网格线
    ctx.strokeStyle = `${preset.accent}07`; ctx.lineWidth = 1
    for (let y = 0; y < ch; y += 80) {
      ctx.globalAlpha = 0.04
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke()
    }
    for (let x = 0; x < cw; x += 80) {
      ctx.globalAlpha = 0.03
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  drawWatermark(t) {
    const { ctx, cw, ch, preset, tl } = this
    if (!this.showWatermark) return
    // 标题出现后淡入水印
    if (t < tl.titleEnd + 300) return
    const fadeStart = tl.titleEnd + 300
    const alpha = Math.min(1, (t - fadeStart) / 500) * 0.35
    ctx.save(); ctx.globalAlpha = alpha
    ctx.fillStyle = preset.watermark
    ctx.font = '600 22px "PingFang SC", "Microsoft YaHei", sans-serif'
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'
    ctx.fillText('小福分享舍', cw - 36, ch - 28)
    ctx.restore()
  }

  drawTitle(t) {
    const { ctx, cw, ch, preset, tl, data } = this
    const title = data?.title || ''
    if (t < tl.titleStart) return

    ctx.save()
    if (t < tl.titleEnd) {
      const chars = Math.floor((t - tl.titleStart) / 80)
      ctx.font = `900 72px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'

      let totalW = 0, charWidths = []
      for (const c of title) {
        const w = ctx.measureText(c).width
        charWidths.push(w); totalW += w
      }

      let x = cw / 2 - totalW / 2
      for (let i = 0; i < Math.min(chars, title.length); i++) {
        const charProgress = i < chars - 1 ? 1 : Math.min(1, (t - tl.titleStart - i * 80) / 160)
        const scale = i < chars - 1 ? 1 : easeOutBack(charProgress)
        ctx.save()
        ctx.translate(x + charWidths[i] / 2, 90)
        ctx.scale(scale, scale)
        ctx.translate(-(x + charWidths[i] / 2), -90)
        ctx.fillStyle = preset.text
        ctx.shadowColor = preset.glow; ctx.shadowBlur = 20
        ctx.fillText(title[i], x, 90)
        ctx.restore()
        x += charWidths[i]
      }
    } else {
      ctx.font = '900 48px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = preset.text
      ctx.shadowColor = preset.glow; ctx.shadowBlur = 12
      ctx.fillText(title, cw / 2, 90)
      ctx.shadowBlur = 0
      ctx.strokeStyle = preset.accent; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cw / 2 - 220, 130); ctx.lineTo(cw / 2 + 220, 130); ctx.stroke()
    }
    ctx.restore()
  }

  fitText(ctx, text, maxW, maxH, maxFS = 36, minFS = 18) {
    for (let fs = maxFS; fs >= minFS; fs -= 2) {
      ctx.font = `700 ${fs}px "PingFang SC", sans-serif`
      const lines = this.wrapLines(ctx, text, maxW)
      const totalH = lines.length * fs * 1.35
      if (totalH <= maxH) return { fontSize: fs, lines, lineH: fs * 1.35 }
    }
    ctx.font = `700 ${minFS}px "PingFang SC", sans-serif`
    return { fontSize: minFS, lines: this.wrapLines(ctx, text, maxW), lineH: minFS * 1.35 }
  }

  wrapLines(ctx, text, maxW) {
    const lines = []; let line = ''
    for (const c of text) {
      const test = line + c
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = c }
      else { line = test }
    }
    if (line) lines.push(line)
    return lines
  }

  drawCells(t) {
    const { ctx, preset, tl, cells } = this
    if (!cells || t < tl.itemStart) return

    for (let i = 0; i < cells.length; i++) {
      const itemStart = tl.itemStart + i * (tl.itemDur + tl.itemGap)
      if (t < itemStart) continue

      const prog = Math.min(1, (t - itemStart) / tl.itemDur)
      const eased = easeOutCubic(prog)
      const cell = cells[i]
      const color = preset.cardColors[i % preset.cardColors.length]
      const cx = cell.x + cell.w / 2

      ctx.save()
      ctx.globalAlpha = eased

      // 入场：从上方滑入+轻微缩放
      const yOff = (1 - eased) * 30
      const scale = 0.95 + eased * 0.05
      ctx.translate(cx, cell.y + cell.h / 2 + yOff)
      ctx.scale(scale, scale)
      ctx.translate(-cx, -(cell.y + cell.h / 2))

      // 卡片背景
      ctx.fillStyle = preset.cardBg
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      this._rrect(ctx, cell.x, cell.y, cell.w, cell.h, 16)
      ctx.fill(); ctx.stroke()

      // 左侧色条
      ctx.fillStyle = color
      this._rrect(ctx, cell.x, cell.y, 5, cell.h, 3)
      ctx.fill()

      // 序号
      const numY = cell.y + cell.h / 2
      ctx.fillStyle = color
      ctx.shadowColor = color; ctx.shadowBlur = 12
      ctx.font = '900 36px "PingFang SC", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(String(i + 1), cell.x + 50, numY)
      ctx.shadowBlur = 0

      // 标题文字
      const label = cell.pt?.label || cell.pt?.kw || ''
      const labelFit = this.fitText(ctx, label, cell.w - 110, cell.h * 0.5, 34, 20)

      const labelX = cell.x + 80
      const labelY = cell.y + cell.h * 0.35
      ctx.fillStyle = preset.text
      ctx.font = `700 ${labelFit.fontSize}px "PingFang SC", sans-serif`
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      const labelTotalH = labelFit.lines.length * labelFit.lineH
      let ly = labelY - labelTotalH / 2 + labelFit.lineH / 2
      for (const line of labelFit.lines) {
        ctx.fillText(line, labelX, ly); ly += labelFit.lineH
      }

      // 描述文字
      const desc = cell.pt?.desc || cell.pt?.short || ''
      if (desc) {
        const descFit = this.fitText(ctx, desc, cell.w - 100, cell.h * 0.4, 22, 14)
        const descY = cell.y + cell.h * 0.7
        ctx.fillStyle = preset.text === '#ffffff' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'
        ctx.font = `400 ${descFit.fontSize}px "PingFang SC", sans-serif`
        const descTotalH = descFit.lines.length * descFit.lineH
        let dy = descY - descTotalH / 2 + descFit.lineH / 2
        for (const line of descFit.lines) {
          ctx.fillText(line, labelX, dy); dy += descFit.lineH
        }
      }

      // 右上角装饰
      const pulse = 0.4 + 0.3 * Math.sin(t / 500 + i)
      ctx.globalAlpha = eased * pulse * 0.3
      ctx.strokeStyle = color; ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(cell.x + cell.w - 28, cell.y + 28, 12, 0, Math.PI * 2)
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
    const { ctx, cw, ch, preset, tl, data } = this
    if (t < tl.endStart) return
    const p = Math.min(1, (t - tl.endStart) / 2000)

    ctx.save(); ctx.globalAlpha = p * 0.6
    ctx.fillStyle = preset.bg[0]; ctx.fillRect(0, 0, cw, ch)
    ctx.restore()

    if (p > 0.2 && p < 0.85) {
      const a = Math.min(1, (p - 0.2) / 0.3) * Math.min(1, (0.85 - p) / 0.2)
      ctx.save(); ctx.globalAlpha = a
      ctx.font = '900 56px "PingFang SC", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = preset.text
      ctx.shadowColor = preset.glow; ctx.shadowBlur = 25
      ctx.fillText(data?.title || '', cw / 2, ch / 2 - 25)
      ctx.shadowBlur = 0
      ctx.font = '500 26px "PingFang SC", sans-serif'
      ctx.fillStyle = preset.text === '#ffffff' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'
      ctx.fillText('— 小福分享舍 —', cw / 2, ch / 2 + 35)
      ctx.restore()
    }
  }

  draw(ts) {
    if (!this.startTime) this.startTime = ts
    const t = ts - this.startTime
    this.ctx.clearRect(0, 0, this.cw, this.ch)

    this.drawBg(t)
    this.drawTitle(t)
    this.drawCells(t)
    this.drawWatermark(t)
    this.drawEnding(t)

    if (this.onProgress) this.onProgress(Math.min(100, Math.round(t / this.tl.total * 100)))

    if (t >= this.tl.total) { this.onDone?.(); return }
    this.animId = requestAnimationFrame(ts2 => this.draw(ts2))
  }

  start() { this.animId = requestAnimationFrame(ts => this.draw(ts)) }
  stop() { if (this.animId) cancelAnimationFrame(this.animId) }
}

// ============================================================
// 接力问题引擎
// ============================================================
class RelayEngine {
  constructor(canvas, data, presetKey) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.data = data
    this.preset = PRESETS[presetKey] || PRESETS.dark
    this.cw = 1920
    this.ch = 1080
    this.startTime = null
    this.animId = null
    this.onDone = null
    this.onProgress = null
    this.showWatermark = false  // 接力问题无水印

    this.calcTimeline()
  }

  calcTimeline() {
    const pts = this.data?.points || []
    const n = pts.length
    const t = {
      lineStart: 600,
      lineDur: 600,
      lineGap: 200,
      holdTime: 3000,  // 最后一条停留更久
    }
    t.total = t.lineStart + n * (t.lineDur + t.lineGap) + t.holdTime
    this.tl = t
    this.n = n
  }

  drawBg(t) {
    const { ctx, cw, ch, preset } = this
    const [b1, b2] = preset.bg

    const g = ctx.createLinearGradient(0, 0, 0, ch)
    g.addColorStop(0, b1); g.addColorStop(1, b2)
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch)

    // 高对比光晕
    const rg = ctx.createRadialGradient(cw / 2, ch * 0.5, 0, cw / 2, ch * 0.5, cw * 0.4)
    rg.addColorStop(0, preset.glow); rg.addColorStop(1, 'transparent')
    ctx.fillStyle = rg; ctx.fillRect(0, 0, cw, ch)
  }

  drawLines(t) {
    const { ctx, cw, ch, preset, tl, data } = this
    const pts = data?.points || []
    if (t < tl.lineStart) return

    for (let i = 0; i < pts.length; i++) {
      const lineStart = tl.lineStart + i * (tl.lineDur + tl.lineGap)
      const lineEnd = lineStart + tl.lineDur
      if (t < lineStart) break

      const prog = Math.min(1, (t - lineStart) / tl.lineDur)
      const eased = easeOutCubic(prog)

      const isLast = i === pts.length - 1
      const holdStart = tl.lineStart + pts.length * (tl.lineDur + tl.lineGap)
      let alpha = eased

      // 最后一条之后持续显示
      if (isLast && t > lineEnd) {
        alpha = Math.min(1, (t - lineEnd) / 300)
        // 最后一条停留期间微微呼吸
        if (t > holdStart - tl.lineGap && t < holdStart + tl.holdTime) {
          const breath = Math.sin((t - (holdStart - tl.lineGap)) / 400)
          alpha = 0.85 + breath * 0.15
        }
      }

      const line = pts[i]?.label || pts[i]?.kw || ''

      ctx.save()
      ctx.globalAlpha = alpha

      // 每行垂直位置：居中偏上，分散排列
      const totalH = pts.length * 90
      const startY = ch / 2 - totalH / 2 + 45
      const y = startY + i * 90

      // 高亮最后一行
      const isActive = isLast && t > lineStart
      const textColor = isActive ? preset.accent : preset.text
      const fontSize = isActive ? 80 : 56
      const fontWeight = isActive ? '900' : '700'

      ctx.font = `${fontWeight} ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'

      // 文字入场：左右扩展
      const chars = Math.min(Math.ceil(prog * line.length), line.length)
      const displayText = line.slice(0, chars)

      // 左对齐测量
      ctx.fillStyle = textColor
      ctx.shadowColor = isActive ? preset.glow : 'transparent'
      ctx.shadowBlur = isActive ? 30 : 0
      ctx.fillText(displayText, cw / 2, y)

      // 最后一行的光效
      if (isActive && t > lineEnd) {
        const pulse = 0.6 + 0.4 * Math.sin(t / 200)
        ctx.save()
        ctx.globalAlpha = pulse * 0.15
        ctx.fillStyle = preset.accent
        ctx.fillRect(0, y - fontSize, cw, fontSize * 1.8)
        ctx.restore()
      }

      ctx.restore()
    }

    // 底部提示（仅最后一条出现后）
    const holdStart = tl.lineStart + pts.length * (tl.lineDur + tl.lineGap)
    if (t > holdStart) {
      const fadeIn = Math.min(1, (t - holdStart) / 500)
      ctx.save(); ctx.globalAlpha = fadeIn * 0.5
      ctx.font = '500 28px "PingFang SC", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = preset.text
      ctx.fillText('在线等，超着急', cw / 2, ch - 100)
      ctx.restore()
    }
  }

  draw(ts) {
    if (!this.startTime) this.startTime = ts
    const t = ts - this.startTime
    this.ctx.clearRect(0, 0, this.cw, this.ch)

    this.drawBg(t)
    this.drawLines(t)

    if (this.onProgress) this.onProgress(Math.min(100, Math.round(t / this.tl.total * 100)))

    if (t >= this.tl.total) { this.onDone?.(); return }
    this.animId = requestAnimationFrame(ts2 => this.draw(ts2))
  }

  start() { this.animId = requestAnimationFrame(ts => this.draw(ts)) }
  stop() { if (this.animId) cancelAnimationFrame(this.animId) }
}

// ============================================================
// FFmpeg.wasm MP4 转换
// ============================================================
let ffmpegInstance = null
let ffmpegLoaded = false

async function loadFFmpeg() {
  if (ffmpegLoaded) return ffmpegInstance
  try {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { fetchFile } = await import('@ffmpeg/util')
    const ffmpeg = new FFmpeg()
    await ffmpeg.load()
    ffmpegInstance = { ffmpeg, fetchFile }
    ffmpegLoaded = true
    return ffmpegInstance
  } catch (e) {
    console.warn('FFmpeg load failed, falling back to WebM:', e)
    return null
  }
}

async function convertWebMToMP4(webmBlob) {
  const loader = await loadFFmpeg()
  if (!loader) return webmBlob  // fallback

  const { ffmpeg, fetchFile } = loader
  const inputData = await fetchFile(webmBlob)
  await ffmpeg.writeFile('input.webm', inputData)
  await ffmpeg.exec([
    '-i', 'input.webm',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-preset', 'ultrafast',
    '-crf', '23',
    'output.mp4',
  ])
  const data = await ffmpeg.readFile('output.mp4')
  return new Blob([data.buffer], { type: 'video/mp4' })
}

// ============================================================
// 主组件
// ============================================================
export default function VideoGenerator({ data, preset: propPreset = 'tech', contentType = 'list', onClose }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const engineRef = useRef(null)
  const recorderRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [progress, setProgress] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState(null)
  const [activePreset, setActivePreset] = useState(propPreset)
  const [activeContentType, setActiveContentType] = useState(contentType)
  const [isConverting, setIsConverting] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)

  const currentPreset = PRESETS[activePreset] || PRESETS.tech

  // 根据内容类型选择引擎
  const getEngineClass = useCallback(() => {
    if (activeContentType === 'relay') return RelayEngine
    return ListEngine
  }, [activeContentType])

  // 初始化/重置引擎
  const initEngine = useCallback((record = false) => {
    const canvas = canvasRef.current
    if (!canvas || !data) return

    canvas.width = 1920
    canvas.height = 1080

    engineRef.current?.stop()
    const EngineClass = getEngineClass()
    const engine = new EngineClass(canvas, data, activePreset)
    engineRef.current = engine

    engine.onProgress = setProgress
    engine.onDone = () => {
      setIsPlaying(false)
      if (record && recorderRef.current?.state === 'recording') {
        recorderRef.current.stop()
      }
    }

    if (record) {
      // 画面自动放大：先触发全屏容器显示
      setShowFullscreen(true)

      // 等 DOM 更新后获取 stream
      setTimeout(() => {
        const stream = canvas.captureStream(30)
        const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
        const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8000000 })
        const chunks = []
        rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }
        rec.onstop = async () => {
          const webmBlob = new Blob(chunks, { type: mime })
          setIsConverting(true)
          try {
            const mp4Blob = await convertWebMToMP4(webmBlob)
            setRecordedBlob(mp4Blob)
          } catch {
            setRecordedBlob(webmBlob) // fallback
          }
          setIsConverting(false)
          setShowFullscreen(false)
        }
        recorderRef.current = rec
        rec.start(100)
        setIsRecording(true)
      }, 100)
    }

    engine.start()
    setIsPlaying(true)
    setProgress(0)
  }, [data, activePreset, activeContentType, getEngineClass])

  const stopAnim = useCallback(() => {
    engineRef.current?.stop()
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    setIsPlaying(false)
    setIsRecording(false)
    setShowFullscreen(false)
  }, [])

  // 下载
  const handleDownload = useCallback(() => {
    if (!recordedBlob) return
    const ext = recordedBlob.type === 'video/mp4' ? 'mp4' : 'webm'
    const url = URL.createObjectURL(recordedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(data?.title || '视频').slice(0, 10)}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }, [recordedBlob, data])

  // 清理
  useEffect(() => {
    return () => {
      engineRef.current?.stop()
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    }
  }, [])

  // 切换预设时重新渲染
  useEffect(() => {
    if (data) initEngine(false)
  }, [activePreset, activeContentType])

  if (!data) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, background: '#0a0a0f', borderRadius: 12, color: 'rgba(255,255,255,0.4)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
      <div>等待内容输入...</div>
    </div>
  )

  return (
    <>
      {/* 全屏录制层 */}
      {showFullscreen && (
        <div
          ref={containerRef}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999, background: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            style={{
              width: '100vw', height: '100vh',
              objectFit: 'contain',
              background: '#000',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, background: '#0a0a0f', padding: 24, borderRadius: 16 }}>
        {/* 预设风格选择 */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setActivePreset(key)}
              style={{
                padding: '8px 16px', borderRadius: 20,
                border: `1px solid ${p.accent}`,
                background: activePreset === key ? `${p.accent}20` : 'transparent',
                color: p.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {p.icon} {p.name}
            </button>
          ))}
        </div>

        {/* 内容类型选择 */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveContentType('list')}
            style={{
              padding: '6px 16px', borderRadius: 16,
              border: `1px solid ${activeContentType === 'list' ? '#8b5cf6' : 'rgba(255,255,255,0.2)'}`,
              background: activeContentType === 'list' ? 'rgba(139,92,246,0.2)' : 'transparent',
              color: activeContentType === 'list' ? '#a78bfa' : 'rgba(255,255,255,0.5)',
              fontSize: 13, cursor: 'pointer',
            }}
          >
            标准列表
          </button>
          <button
            onClick={() => setActiveContentType('relay')}
            style={{
              padding: '6px 16px', borderRadius: 16,
              border: `1px solid ${activeContentType === 'relay' ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
              background: activeContentType === 'relay' ? 'rgba(239,68,68,0.2)' : 'transparent',
              color: activeContentType === 'relay' ? '#fca5a5' : 'rgba(255,255,255,0.5)',
              fontSize: 13, cursor: 'pointer',
            }}
          >
            接力问题 ⚡无水印
          </button>
        </div>

        {/* Canvas预览（按16:9比例缩放） */}
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            style={{
              display: 'block',
              width: 'min(640px, 100%)',
              height: 'auto',
              aspectRatio: '16/9',
              background: '#0a0a0f',
            }}
          />

          {/* 进度条 */}
          {(isPlaying || isRecording) && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.1)' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: currentPreset.accent, transition: 'width 0.1s' }} />
            </div>
          )}

          {/* 录制指示 */}
          {isRecording && (
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
              <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 600 }}>REC</span>
            </div>
          )}

          {/* 转换中 */}
          {isConverting && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 16 }}>
              正在转换MP4...
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {!recordedBlob ? (
            <>
              <button
                onClick={() => { stopAnim(); initEngine(false) }}
                disabled={isRecording}
                style={{
                  padding: '12px 28px', borderRadius: 24, border: 'none',
                  background: currentPreset.accent, color: '#fff', fontSize: 15, fontWeight: 600,
                  cursor: isRecording ? 'not-allowed' : 'pointer',
                  opacity: isRecording ? 0.6 : 1,
                  boxShadow: `0 4px 20px ${currentPreset.glow}`,
                }}
              >
                {isPlaying && !isRecording ? '播放中...' : '🔍 预览动画'}
              </button>
              <button
                onClick={() => { stopAnim(); initEngine(true) }}
                disabled={isRecording}
                style={{
                  padding: '12px 28px', borderRadius: 24,
                  border: `1px solid ${currentPreset.accent}`,
                  background: 'transparent', color: currentPreset.accent, fontSize: 15, fontWeight: 600,
                  cursor: isRecording ? 'not-allowed' : 'pointer',
                  opacity: isRecording ? 0.5 : 1,
                }}
              >
                {isRecording ? '录制中...' : '🎬 录制视频'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDownload}
                style={{
                  padding: '12px 28px', borderRadius: 24, border: 'none',
                  background: '#10b981', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                }}
              >
                ⬇️ 下载 {recordedBlob.type === 'video/mp4' ? 'MP4' : 'WebM'}
              </button>
              <button
                onClick={() => { setRecordedBlob(null); stopAnim() }}
                style={{
                  padding: '12px 20px', borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer',
                }}
              >
                重新录制
              </button>
            </>
          )}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: '12px 20px', borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer',
              }}
            >
              关闭
            </button>
          )}
        </div>

        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
          1920×1080 · 16:9横版 · MP4格式 · 画面自动放大
        </div>
      </div>
    </>
  )
}
