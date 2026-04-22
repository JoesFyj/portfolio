import { useEffect, useRef, useState, useCallback } from 'react'
import { drawCover, drawLandmarkCover } from '../lib/shapes'
import { drawAICover, AI_ICON_OPTIONS } from '../lib/ai_icons'

// 颜色配置
const COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#14b8a6']
const GRAD = ['#06b6d4', '#8b5cf6', '#ec4899']

// ============================================================
// Canvas 绘制工具
// ============================================================
function drawRoundedRect(ctx, x, y, w, h, r) {
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

function drawTitle(ctx, text, chars, cw, centerY, topY, slideProg) {
  if (!text || chars <= 0) return
  ctx.save()

  const y = centerY + (topY - centerY) * slideProg

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const fontSize = Math.round(cw * 0.048)

  const grad = ctx.createLinearGradient(cw * 0.3, 0, cw * 0.7, 0)
  grad.addColorStop(0, '#06b6d4')
  grad.addColorStop(0.5, '#8b5cf6')
  grad.addColorStop(1, '#ec4899')

  ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`

  const fullW = ctx.measureText(text).width
  const startX = cw / 2 - fullW / 2

  ctx.shadowColor = 'rgba(139,92,246,0.55)'
  ctx.shadowBlur = cw * 0.032
  ctx.fillStyle = grad

  const doneChars = Math.min(text.length, Math.max(0, chars - 1))
  if (doneChars > 0) {
    ctx.fillText(text.slice(0, doneChars), cw / 2, y)
  }

  // 当前字：强力弹性弹出
  if (chars <= text.length) {
    const lastChar = text[chars - 1]
    const prevText = text.slice(0, doneChars)
    const prevW = doneChars > 0 ? ctx.measureText(prevText).width : 0
    const lastW = ctx.measureText(lastChar).width
    const lastX = startX + prevW + lastW / 2

    // 弹出进度：每个字出现后弹 300ms
    const charProg = 1 // 每字180ms，刚出现时直接画
    const scale = 1.5 - charProg * 0.5 // 刚出现时1.5倍，逐渐回到1倍

    ctx.save()
    ctx.translate(lastX, y)
    ctx.scale(scale, scale)
    ctx.translate(-lastX, -y)
    ctx.fillText(lastChar, startX + prevW, y)
    ctx.restore()

    // 闪光
    ctx.globalAlpha = 0.35
    ctx.fillStyle = '#ffffff'
    ctx.shadowBlur = 0
    ctx.beginPath()
    ctx.arc(lastX, y, fontSize * 0.55, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.shadowBlur = 0
  ctx.restore()
}

function drawDashedGrid(ctx, cw, ch, cols, rows, opacity) {
  const pad = cw * 0.03
  const gridW = cw - pad * 2
  const gridH = ch - pad * 2

  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = 'rgba(139,92,246,0.22)'
  ctx.lineWidth = 1
  ctx.setLineDash([cw * 0.007, cw * 0.009])

  for (let c = 0; c <= cols; c++) {
    const x = pad + gridW * (c / cols)
    ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, pad + gridH); ctx.stroke()
  }
  for (let r = 0; r <= rows; r++) {
    const y = pad + gridH * (r / rows)
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad + gridW, y); ctx.stroke()
  }

  ctx.setLineDash([])
  for (let c = 0; c <= cols; c++) {
    for (let r = 0; r <= rows; r++) {
      const nx = pad + gridW * (c / cols)
      const ny = pad + gridH * (r / rows)
      const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 400 + c * r * 0.8)
      ctx.globalAlpha = opacity * pulse
      ctx.fillStyle = '#a855f7'
      ctx.beginPath()
      ctx.arc(nx, ny, cw * 0.0045, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}

function drawCell(ctx, pt, index, x, y, w, h, state, color, cw) {
  const r = cw * 0.013
  ctx.save()
  if (state <= 0) { ctx.restore(); return }

  ctx.globalAlpha = 1
  ctx.fillStyle = state >= 3 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.75)'
  drawRoundedRect(ctx, x, y, w, h, r)
  ctx.fill()

  const hex = color.replace('#', '')
  const alpha = state >= 3 ? 0.6 : 0.45
  ctx.strokeStyle = `rgba(${parseInt(hex.slice(0,2),16)},${parseInt(hex.slice(2,4),16)},${parseInt(hex.slice(4,6),16)},${alpha})`
  ctx.lineWidth = cw * 0.003
  drawRoundedRect(ctx, x, y, w, h, r)
  ctx.stroke()

  const grad = ctx.createLinearGradient(x + w, y, x + w, y + h)
  grad.addColorStop(0, `${color}20`)
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  drawRoundedRect(ctx, x, y, w, h, r)
  ctx.fill()

  const px = cw * 0.022
  const py = cw * 0.015
  let cy = y + py

  if (state >= 1) {
    const numSize = Math.round(cw * 0.052)
    ctx.font = `900 ${numSize}px "PingFang SC", sans-serif`
    ctx.fillStyle = color
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.shadowColor = `${color}90`
    ctx.shadowBlur = cw * 0.015
    ctx.fillText(String(index + 1).padStart(2, '0'), x + px, cy)
    ctx.shadowBlur = 0
    cy += numSize + cw * 0.013
  }

  if (state >= 2) {
    const labelSize = Math.round(cw * 0.028)
    ctx.font = `800 ${labelSize}px "PingFang SC", sans-serif`
    ctx.fillStyle = color
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    const maxLW = w - px * 2
    let label = pt.label
    while (ctx.measureText(label).width > maxLW && label.length > 1) label = label.slice(0, -1)
    ctx.fillText(label, x + px, cy, maxLW)
    cy += labelSize + cw * 0.012
  }

  if (state >= 3) {
    const descSize = Math.round(cw * 0.021)
    ctx.font = `${descSize}px "PingFang SC", sans-serif`
    ctx.fillStyle = '#4B5563'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    const desc = pt.desc || pt.short || ''
    const maxDW = w - px * 2
    const lineH = descSize * 1.55
    const maxLines = 3
    let line = ''
    const lines = []
    for (const ch of desc) {
      const test = line + ch
      if (ctx.measureText(test).width > maxDW && line) { lines.push(line); line = ch }
      else { line = test }
    }
    if (line) lines.push(line)
    for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
      ctx.fillText(lines[i], x + px, cy + i * lineH, maxDW)
    }

    const ckX = x + w - cw * 0.07
    const ckY = y + cw * 0.018
    const ckR = cw * 0.023
    ctx.fillStyle = '#10B981'
    ctx.shadowColor = 'rgba(16,185,129,0.6)'
    ctx.shadowBlur = cw * 0.012
    ctx.beginPath(); ctx.arc(ckX, ckY, ckR, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0
    ctx.strokeStyle = 'white'; ctx.lineWidth = cw * 0.0035
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(ckX - ckR * 0.35, ckY)
    ctx.lineTo(ckX - ckR * 0.05, ckY + ckR * 0.35)
    ctx.lineTo(ckX + ckR * 0.4, ckY - ckR * 0.3)
    ctx.stroke()
  }

  ctx.restore()
}

// ============================================================
// AI科技风格辅助函数
// ============================================================
function easeOutBack(x) {
  const c1 = 1.70158, c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function drawTechParticles(ctx, cw, ch, t) {
  ctx.save()
  for (let i = 0; i < 60; i++) {
    const sx = ((i * 137 + 23) % cw + t * 0.008 * (i % 5 + 1)) % cw
    const sy = ((i * 97 + 11) % ch + Math.sin(t / 2000 + i * 1.3) * 8) % ch
    const size = 0.5 + (i % 3) * 0.5
    const alpha = 0.06 + (i % 5) * 0.025
    ctx.globalAlpha = alpha
    ctx.fillStyle = i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#a855f7' : '#ffffff'
    ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI * 2); ctx.fill()
  }
  ctx.globalAlpha = 1
  ctx.restore()
}

function drawTechTitle(ctx, text, chars, cw, x, y, scale, alpha, t) {
  if (!text || chars <= 0) return
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.textBaseline = 'middle'

  const fontSize = Math.round(cw * 0.048 * scale)
  const doneChars = Math.min(text.length, Math.max(0, chars - 1))

  const grad = ctx.createLinearGradient(x - cw * 0.25, 0, x + cw * 0.25, 0)
  grad.addColorStop(0, '#06b6d4')
  grad.addColorStop(0.5, '#a855f7')
  grad.addColorStop(1, '#ec4899')

  ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`
  ctx.textAlign = 'left'
  ctx.shadowColor = 'rgba(168,85,247,0.7)'
  ctx.shadowBlur = cw * 0.025
  ctx.fillStyle = grad

  if (doneChars > 0) {
    ctx.fillText(text.slice(0, doneChars), x, y)
  }

  if (chars <= text.length) {
    const lastChar = text[chars - 1]
    const prevText = text.slice(0, doneChars)
    const prevW = doneChars > 0 ? ctx.measureText(prevText).width : 0
    const lastW = ctx.measureText(lastChar).width
    const lastX = x + prevW + lastW / 2
    const sc = 1.4
    ctx.save()
    ctx.translate(lastX, y); ctx.scale(sc, sc); ctx.translate(-lastX, -y)
    ctx.fillText(lastChar, x + prevW, y)
    ctx.restore()
    // 脉冲光点
    ctx.globalAlpha = alpha * 0.35
    ctx.fillStyle = '#ffffff'
    ctx.shadowBlur = 0
    ctx.beginPath(); ctx.arc(lastX, y, fontSize * 0.55, 0, Math.PI * 2); ctx.fill()
  }

  ctx.restore()
}

function drawTechCard(ctx, pt, index, x, y, w, h, t) {
  const r = 8
  // 背景
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill()
  // 边框发光
  ctx.strokeStyle = index % 2 === 0 ? 'rgba(6,182,212,0.3)' : 'rgba(168,85,247,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke()

  // 左侧竖线
  const lineGrad = ctx.createLinearGradient(x, y, x, y + h)
  lineGrad.addColorStop(0, '#06b6d4')
  lineGrad.addColorStop(1, '#a855f7')
  ctx.strokeStyle = lineGrad
  ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(x + 6, y + 8); ctx.lineTo(x + 6, y + h - 8); ctx.stroke()

  // 标题文字
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 18px "PingFang SC", sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(pt.label, x + 20, y + 10)

  // 内容文字
  const descText = pt.desc || pt.short || ''
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.font = '400 13px "PingFang SC", sans-serif'
  ctx.fillText(descText.slice(0, 50), x + 20, y + 36)
}

// ============================================================
// 音符跳动卡片（入场 / 退场）
// direction: 0=左下→右上, 1=右下→左上, 2=左→右, 3=上→下
// ============================================================
function drawTechCardBounce(ctx, pt, index, cardIndex, x, y, w, h, progress, direction) {
  const text = pt.label || ''
  const desc = (pt.desc || pt.short || '').slice(0, 50)
  if (!text) return

  // 每字随机的上下偏移（音符跳动感）
  const charOffsets = []
  for (let ci = 0; ci < text.length; ci++) {
    charOffsets.push((Math.sin(ci * 1.7 + index * 0.9) * 0.5 + 0.5) * 10 - 5)
  }

  // 方向向量
  const dirs = [
    { dx: 1, dy: -1 },  // 左下→右上
    { dx: -1, dy: -1 }, // 右下→左上
    { dx: 1, dy: 0 },   // 左→右
    { dx: 0, dy: 1 },   // 上→下
  ]
  const dir = dirs[direction % dirs.length]
  const offsetDist = 180

  const neonColor = index % 2 === 0 ? '#06b6d4' : '#a855f7'
  const fontSize = Math.round(h * 0.4)
  const descSize = Math.round(h * 0.22)

  ctx.save()
  ctx.font = `700 ${fontSize}px "PingFang SC", sans-serif`

  // 计算每字宽度用于居中
  let totalW = 0
  const charWidths = []
  for (let ci = 0; ci < text.length; ci++) {
    const cw2 = ctx.measureText(text[ci]).width
    charWidths.push(cw2)
    totalW += cw2
  }

  // 入场：音符跳动
  if (progress < 0.5) {
    const p = progress / 0.5
    const ep = easeOutBack(Math.min(1, p * 1.2))
    // 每字错开时间，首字立刻以半透明出现
    const staggerTotal = Math.min(0.4 + p * 1.8, 1)
    for (let ci = 0; ci < text.length; ci++) {
      const stagger = ci * 0.07
      const cp = Math.min(1, Math.max(0, staggerTotal - stagger + 0.05))
      const bounce = Math.sin(cp * Math.PI) * (1 - cp)

      const cx3 = x + w / 2 - totalW / 2 + (ci > 0 ? charWidths.slice(0, ci).reduce((a, b) => a + b, 0) + ci * 3 : 0)
      const cy3 = y + h * 0.3 + charOffsets[ci] - bounce * 20

      // 从方向反方向来的起始位置
      const startX = cx3 + dir.dx * offsetDist * (1 - ep)
      const startY = cy3 + dir.dy * offsetDist * (1 - ep)

      ctx.save()
      ctx.globalAlpha = cp
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = neonColor
      ctx.shadowBlur = cp * 14
      ctx.font = `700 ${fontSize}px "PingFang SC", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text[ci], startX, startY)
      ctx.restore()
    }

    // 描述文字（入场后半段淡入）
    if (p > 0.5) {
      const dp = (p - 0.5) / 0.5
      ctx.save()
      ctx.globalAlpha = dp * 0.7
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.font = `400 ${descSize}px "PingFang SC", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(desc, x + w / 2, y + h * 0.68)
      ctx.restore()
    }
  }
  // 退场：跳动着飞向目标方向
  else {
    const p = (progress - 0.5) / 0.5
    const ep = easeOutBack(p)

    for (let ci = 0; ci < text.length; ci++) {
      const cx3 = x + w / 2 - totalW / 2 + (ci > 0 ? charWidths.slice(0, ci).reduce((a, b) => a + b, 0) + ci * 3 : 0)
      const cy3 = y + h * 0.3 + charOffsets[ci]
      const bounce = Math.sin(p * Math.PI) * (1 - p)

      const endX = cx3 + dir.dx * offsetDist
      const endY = cy3 + dir.dy * offsetDist

      const cx4 = cx3 + (endX - cx3) * ep
      const cy4 = cy3 + (endY - cy3) * ep - bounce * 15

      ctx.save()
      ctx.globalAlpha = 1 - p * 0.5
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = neonColor
      ctx.shadowBlur = (1 - p) * 12
      ctx.font = `700 ${fontSize}px "PingFang SC", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text[ci], cx4, cy4)
      ctx.restore()
    }
  }
  ctx.restore()
}

// ============================================================
// 全展示瀑布流卡片
// ============================================================
function drawTechCardFull(ctx, pt, index, x, y, w, h, t, isNew) {
  const r = 12
  const neonColor = index % 2 === 0 ? '#06b6d4' : '#a855f7'
  const accentColor = index % 3 === 0 ? '#22d3ee' : index % 3 === 1 ? '#818cf8' : '#c084fc'

  // 背景
  ctx.fillStyle = isNew ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.04)'
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill()

  // 边框发光
  ctx.strokeStyle = neonColor; ctx.lineWidth = 1.5
  ctx.shadowColor = neonColor; ctx.shadowBlur = isNew ? 16 : 8
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke()
  ctx.shadowBlur = 0

  // 左上角装饰
  ctx.fillStyle = accentColor
  ctx.beginPath()
  ctx.moveTo(x + 10, y + 10); ctx.lineTo(x + 36, y + 10); ctx.lineTo(x + 10, y + 36)
  ctx.closePath(); ctx.fill()

  // 序号
  ctx.fillStyle = accentColor
  ctx.font = '700 11px "PingFang SC", sans-serif'
  ctx.textAlign = 'left'; ctx.textBaseline = 'top'
  ctx.fillText(`#${index + 1}`, x + 16, y + 44)

  // 标题
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 16px "PingFang SC", sans-serif'
  ctx.fillText(pt.label, x + 16, y + 62)

  // 内容描述（根据卡片高度决定行数）
  const descText = pt.desc || pt.short || ''
  ctx.fillStyle = 'rgba(255,255,255,0.65)'
  ctx.font = '400 12px "PingFang SC", sans-serif'
  ctx.fillText(descText.slice(0, 40), x + 16, y + 86)

  // 全展示时的脉冲动画
  const pulse = (Math.sin(t * 0.002 + index * 0.5) + 1) / 2
  ctx.globalAlpha = pulse * 0.15
  ctx.fillStyle = accentColor
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill()
  ctx.globalAlpha = 1
}

// ============================================================
// 爆炸效果
// ============================================================
function drawExplosion(ctx, cw, ch, prog) {
  ctx.save()
  const scale = 1 + prog * 1.8
  const alpha = 1 - prog
  const cx = cw / 2, cy = ch / 2

  ctx.globalAlpha = alpha * 0.8
  ctx.fillStyle = '#FAFAF6'
  ctx.fillRect(0, 0, cw, ch)

  ctx.globalAlpha = alpha * 0.6
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2
    const innerR = cw * 0.1 * scale
    const outerR = cw * (0.3 + prog * 0.4) * scale
    ctx.strokeStyle = `hsl(${270 + i * 7.5}, 80%, ${70 - prog * 30}%)`
    ctx.lineWidth = cw * 0.006 * (1 - prog)
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR)
    ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR)
    ctx.stroke()
  }

  ctx.globalAlpha = alpha
  const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cw * 0.4 * scale)
  flashGrad.addColorStop(0, `rgba(255,255,255,${alpha})`)
  flashGrad.addColorStop(0.3, `rgba(139,92,246,${alpha * 0.5})`)
  flashGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = flashGrad
  ctx.fillRect(0, 0, cw, ch)

  ctx.restore()
}

// ============================================================
// 飞入文字
// ============================================================
function drawMainText(ctx, cw, ch, prog) {
  const text = '少工作，多赚钱'
  const sub1 = '以书为粮，以路为行'
  const sub2 = '小福AI自由（AIfman）'

  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const cx = cw / 2
  const baseY = ch * 0.4

  const bounceT = Math.min(1, prog / 0.5)
  const overshoot = bounceT < 1 ? bounceT * 1.25 : 1 - Math.sin((bounceT - 0.5) / 0.5 * Math.PI) * 0.2
  const scale = overshoot
  const alpha = Math.min(1, prog * 2.5)

  ctx.globalAlpha = alpha

  const mainSize = Math.round(cw * 0.1)
  ctx.font = `900 ${mainSize}px "PingFang SC", "Microsoft YaHei", sans-serif`

  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = cw * 0.005
  ctx.translate(cx, baseY)
  ctx.scale(scale, scale)
  ctx.translate(-cx, -baseY)
  ctx.strokeText(text, cx, baseY)

  ctx.shadowColor = 'rgba(139,92,246,0.9)'
  ctx.shadowBlur = cw * 0.06

  const grad = ctx.createLinearGradient(cx - cw * 0.3, 0, cx + cw * 0.3, 0)
  grad.addColorStop(0, '#06b6d4')
  grad.addColorStop(0.35, '#8b5cf6')
  grad.addColorStop(0.65, '#ec4899')
  grad.addColorStop(1, '#f59e0b')
  ctx.fillStyle = grad
  ctx.fillText(text, cx, baseY)
  ctx.shadowBlur = 0

  ctx.globalAlpha = alpha * 0.9
  const subSize = Math.round(cw * 0.034)
  ctx.font = `700 ${subSize}px "PingFang SC", sans-serif`
  ctx.fillStyle = '#e2e8f0'
  ctx.shadowColor = 'rgba(139,92,246,0.5)'
  ctx.shadowBlur = cw * 0.025
  ctx.fillText(sub1, cx, baseY + mainSize * 1.3)
  ctx.shadowBlur = 0

  ctx.globalAlpha = alpha * 0.7
  const sub2Size = Math.round(cw * 0.026)
  ctx.font = `600 ${sub2Size}px "PingFang SC", sans-serif`
  ctx.fillStyle = 'rgba(139,92,246,0.85)'
  ctx.fillText(sub2, cx, baseY + mainSize * 1.3 + subSize * 1.8)

  ctx.globalAlpha = alpha * 0.4
  const lineY = baseY + mainSize * 1.3 + subSize * 1.8 + sub2Size * 1.8
  const lineGrad = ctx.createLinearGradient(cx - cw * 0.2, 0, cx + cw * 0.2, 0)
  lineGrad.addColorStop(0, 'transparent')
  lineGrad.addColorStop(0.5, '#8b5cf6')
  lineGrad.addColorStop(1, 'transparent')
  ctx.strokeStyle = lineGrad
  ctx.lineWidth = cw * 0.003
  ctx.beginPath()
  ctx.moveTo(cx - cw * 0.2, lineY)
  ctx.lineTo(cx + cw * 0.2, lineY)
  ctx.stroke()

  ctx.restore()
}

// ============================================================
// 动画引擎
// ============================================================
class AnimEngine {
  constructor(canvas, data, opts) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.data = data
    this.style = opts.animationStyle || 'chinese'
    this.onDone = opts.onDone
    this.onProgress = opts.onProgress
    this.startTime = null
    this.animId = null
    this.done = false
    this.cw = canvas.width
    this.ch = canvas.height

    this.titleY = this.ch * 0.065
    this.gridTop = this.ch * 0.13
    this.gridBottom = this.ch * 0.97

    const n = data.points.length
    this.cellStates = new Array(n).fill(0)
    this.cols = n <= 4 ? 2 : n <= 6 ? 3 : 4
    this.rows = Math.ceil(n / this.cols)
    this.coverCanvas = null
    this.shapeType = opts.shapeType ?? -1
  }

  setCover(canvas) { this.coverCanvas = canvas }

  getTimings() {
    const titleLen = this.data.title.length
    const titleEnd = 50 + titleLen * 180

    // 风格三（AI科技）：标题打字 → 音符飘浮 → 静态全展示 → 砰展开 → 爆炸Slogan
    if (this.style === 'tech') {
      // 把标题和所有要点拆成「音符短语」（每组3-4字）
      const titleText = this.data.title || ''
      const phrases = []
      // 标题每3字一组
      for (let i = 0; i < titleText.length; i += 3) {
        const chunk = titleText.slice(i, i + 3)
        if (chunk) phrases.push({ text: chunk, isTitle: true, index: phrases.length })
      }
      // 要点每3字一组
      this.data.points.forEach((pt, pi) => {
        const label = pt.label || ''
        for (let i = 0; i < label.length; i += 3) {
          const chunk = label.slice(i, i + 3)
          if (chunk) phrases.push({ text: chunk, isTitle: false, index: phrases.length, pointIndex: pi })
        }
      })

      const n = phrases.length
      const phraseDur = 2200       // 每个短语完整周期
      const phraseGap = 700       // 相邻短语开始时间差
      const titleTypingDur = 50 + titleText.length * 120
      const dancingStart = titleTypingDur + 300  // 打字结束后等0.3s开始飘浮
      const lastPhraseExit = dancingStart + (n - 1) * phraseGap + phraseDur
      const staticStart = lastPhraseExit + 1200  // 静默1.2秒
      const staticDur = 1800                     // 静态展示
      const boomStart = staticStart + staticDur
      const boomDur = 800
      const expDur = 1000
      const sloganDur = 2500
      const endHold = 2200
      const total = boomStart + boomDur + expDur + sloganDur + endHold

      // 每条短语的飘浮轨迹方向（循环）
      const dirs = [
        { x: -1, y: -1 }, // 左上
        { x: 1, y: -1 },  // 右上
        { x: -1, y: 1 }, // 左下
        { x: 1, y: 1 },  // 右下
        { x: 0, y: -1 },  // 上
        { x: 0, y: 1 },  // 下
        { x: -1, y: 0 }, // 左
        { x: 1, y: 0 },   // 右
      ]

      return {
        titleTypingDur, dancingStart, phrases, n, phraseDur, phraseGap, dirs,
        lastPhraseExit, staticStart, staticDur,
        boomStart, boomDur,
        expDur, sloganDur, endHold, total,
      }
    }

    if (this.style === 'minimal') {
      // 风格二：标题 → 左上角 → 依次单独展示卡片
      const slideEnd = titleEnd + 500
      const cardDur = 1800 // 每个卡片展示时间
      const cardFadeIn = 350
      const cells = this.data.points.map((_, i) => ({
        appear: slideEnd + 200 + i * cardDur,
        fadeOut: slideEnd + 200 + i * cardDur + cardDur - cardFadeIn,
      }))
      const lastCardEnd = cells[cells.length - 1].fadeOut + 300
      const expDur = 1200
      const sloganDur = 2500
      const endHold = 2200
      const total = lastCardEnd + expDur + sloganDur + endHold
      return { titleEnd, slideEnd, cells, meltStart: lastCardEnd, expDur, sloganDur, endHold, total, cardDur, cardFadeIn }
    }

    // 风格一（中国风）：标题 → 顶部 → 网格卡片依次出现
    const slideStart = titleEnd
    const slideEnd = titleEnd + 600
    const gridAppear = slideEnd + 100
    const partGap = 600
    const cellGap = partGap * 2 + 400
    const cells = this.data.points.map((_, i) => ({
      label: gridAppear + i * cellGap,
      short: gridAppear + i * cellGap + partGap,
      desc:  gridAppear + i * cellGap + partGap * 2,
    }))
    const meltStart = cells[cells.length - 1].desc + 1200
    const expDur = 1200
    const sloganDur = 2500
    const endHold = 2200
    const total = meltStart + expDur + sloganDur + endHold
    return { titleEnd, slideStart, slideEnd, gridAppear, cells, meltStart, expDur, sloganDur, endHold, total }
  }

  updateCellStates(now) {
    const t = now - this.startTime
    const { cells } = this.getTimings()
    this.data.points.forEach((_, i) => {
      if (t >= cells[i].desc) this.cellStates[i] = 3
      else if (t >= cells[i].short) this.cellStates[i] = 2
      else if (t >= cells[i].label) this.cellStates[i] = 1
      else this.cellStates[i] = 0
    })
  }

  draw(now) {
    if (this.done) return
    if (!this.startTime) this.startTime = now
    const t = now - this.startTime
    if (t < 100) console.log('[draw] style=', this.style, 't=', Math.round(t), 'ctx=', !!this.ctx)
    const { titleEnd, slideEnd, cells, meltStart, expDur, sloganDur, endHold, total, cardDur, cardFadeIn } = this.getTimings()
    const { ctx, cw, ch } = this

    const prog = Math.min(1, t / total)
    this.onProgress(Math.round(prog * 88))

    // ===== 风格三（AI科技）=====
    if (this.style === 'tech') {
      const { titleTypingDur, dancingStart, phrases, n, phraseDur, phraseGap, dirs,
        staticStart, staticDur, boomStart, boomDur,
        expDur, sloganDur, endHold, total } = this.getTimings()

      // === 背景 ===
      ctx.fillStyle = '#080c14'; ctx.fillRect(0, 0, cw, ch)
      drawTechParticles(ctx, cw, ch, t)

      // === 标题打字机 ===
      const titleChars = Math.min(
        this.data.title.length,
        Math.max(0, Math.floor((t - 50) / 120))
      )
      if (titleChars > 0) {
        const titleText = this.data.title.slice(0, titleChars)
        ctx.save()
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#a855f7'
        ctx.shadowBlur = 20
        ctx.font = `900 ${Math.round(cw * 0.04)}px "PingFang SC", sans-serif`
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.fillText(titleText, cw * 0.06, ch * 0.08)
        ctx.restore()
      }

      // === 音符舞动短语 ===
      for (let pi = 0; pi < n; pi++) {
        const phrase = phrases[pi]
        const phraseStart = dancingStart + pi * phraseGap
        if (t < phraseStart) continue
        if (t > phraseStart + phraseDur) continue

        const prog = (t - phraseStart) / phraseDur
        const dir = dirs[pi % dirs.length]
        const neonColor = pi % 2 === 0 ? '#06b6d4' : '#a855f7'

        if (prog < 0.5) {
          // 入场：从反方向弹入
          const p = prog / 0.5
          const ep = easeOutBack(Math.min(1, p * 1.2))
          const offsetDist = cw * 0.28
          const bounceAmt = Math.sin(p * Math.PI) * (1 - p) * ch * 0.06

          const fontSize = Math.round(cw * 0.038)
          ctx.save()
          ctx.font = `900 ${fontSize}px "PingFang SC", sans-serif`
          const phraseW = ctx.measureText(phrase.text).width

          // 短语排列：4字一行，多行则换行
          const charsPerRow = 4
          const charH = fontSize * 1.2
          const rows = Math.ceil(phrase.text.length / charsPerRow)
          const totalH = rows * charH
          const startX = cw * 0.06
          const baseY = ch * 0.2 + pi * ch * 0.05  // 错开高度

          for (let ci = 0; ci < phrase.text.length; ci++) {
            const row = Math.floor(ci / charsPerRow)
            const col = ci % charsPerRow
            const char = phrase.text[ci]
            const charW = ctx.measureText(char).width

            const stagger = ci * 0.06
            const cp = Math.min(1, Math.max(0, p * 1.5 - stagger))
            const charBounce = Math.sin(cp * Math.PI) * (1 - cp) * ch * 0.04

            const targetX = startX + col * (charW + 8)
            const targetY = baseY + row * charH

            const startX2 = targetX + dir.x * offsetDist
            const startY2 = targetY + dir.y * offsetDist

            ctx.save()
            ctx.globalAlpha = cp * Math.min(1, p * 1.4)
            ctx.fillStyle = '#ffffff'
            ctx.shadowColor = neonColor
            ctx.shadowBlur = cp * 16
            ctx.font = `900 ${fontSize}px "PingFang SC", sans-serif`
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            const cx2 = targetX + (startX2 - targetX) * (1 - ep)
            const cy2 = targetY + (startY2 - targetY) * (1 - ep) - charBounce
            ctx.fillText(char, cx2, cy2)
            ctx.restore()
          }
          ctx.restore()
        } else {
          // 退场：跳动着飞向方向
          const p = (prog - 0.5) / 0.5
          const ep = easeOutBack(p)
          const offsetDist = cw * 0.28
          const bounceAmt = Math.sin(p * Math.PI) * (1 - p) * ch * 0.04

          const fontSize = Math.round(cw * 0.038)
          ctx.save()
          ctx.font = `900 ${fontSize}px "PingFang SC", sans-serif`

          const startX = cw * 0.06
          const baseY = ch * 0.2 + pi * ch * 0.05
          const charsPerRow = 4
          const charH = fontSize * 1.2

          for (let ci = 0; ci < phrase.text.length; ci++) {
            const row = Math.floor(ci / charsPerRow)
            const col = ci % charsPerRow
            const char = phrase.text[ci]
            const charW = ctx.measureText(char).width

            const charBounce = Math.sin(p * Math.PI) * (1 - p) * ch * 0.03

            const targetX = startX + col * (charW + 8)
            const targetY = baseY + row * charH
            const endX = targetX + dir.x * offsetDist
            const endY = targetY + dir.y * offsetDist

            ctx.save()
            ctx.globalAlpha = (1 - p * 0.5)
            ctx.fillStyle = '#ffffff'
            ctx.shadowColor = neonColor
            ctx.shadowBlur = (1 - p) * 14
            ctx.font = `900 ${fontSize}px "PingFang SC", sans-serif`
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            const cx2 = targetX + (endX - targetX) * ep
            const cy2 = targetY + (endY - targetY) * ep - charBounce
            ctx.fillText(char, cx2, cy2)
            ctx.restore()
          }
          ctx.restore()
        }
      }

      // === 静态全展示：标题居中 + 短语网格 ===
      if (t >= staticStart && t < boomStart) {
        ctx.fillStyle = '#080c14'; ctx.fillRect(0, 0, cw, ch)
        drawTechParticles(ctx, cw, ch, t)

        // 大标题居中
        ctx.save()
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#a855f7'
        ctx.shadowBlur = 25
        ctx.font = `900 ${Math.round(cw * 0.05)}px "PingFang SC", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(this.data.title, cw / 2, ch * 0.1)
        ctx.restore()

        // 装饰线
        ctx.save(); ctx.globalAlpha = 0.5
        const lg = ctx.createLinearGradient(cw * 0.1, 0, cw * 0.9, 0)
        lg.addColorStop(0, 'transparent'); lg.addColorStop(0.2, '#06b6d4')
        lg.addColorStop(0.8, '#a855f7'); lg.addColorStop(1, 'transparent')
        ctx.strokeStyle = lg; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(cw * 0.1, ch * 0.18); ctx.lineTo(cw * 0.9, ch * 0.18); ctx.stroke(); ctx.restore()

        // 短语网格布局
        const phraseFontSize = Math.round(cw * 0.025)
        const phraseH = phraseFontSize * 1.4
        const cols = 5
        const gridW = cw * 0.88
        const cellW = gridW / cols
        const startX2 = (cw - gridW) / 2
        const phraseStartY = ch * 0.22

        for (let pi = 0; pi < n; pi++) {
          const col = pi % cols
          const row = Math.floor(pi / cols)
          const px2 = startX2 + col * cellW
          const py2 = phraseStartY + row * phraseH
          const neonColor = pi % 2 === 0 ? '#06b6d4' : '#a855f7'

          ctx.save()
          ctx.fillStyle = '#ffffff'
          ctx.shadowColor = neonColor
          ctx.shadowBlur = 10
          ctx.font = `700 ${phraseFontSize}px "PingFang SC", sans-serif`
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
          ctx.fillText(phrases[pi].text, px2, py2)
          ctx.restore()
        }
      }

      // === 砰展开 + 爆炸 + Slogan ===
      if (t >= boomStart) {
        const boomProg = Math.min(1, (t - boomStart) / boomDur)

        // 白闪
        ctx.fillStyle = '#ffffff'; ctx.globalAlpha = boomProg * 0.2; ctx.fillRect(0, 0, cw, ch); ctx.globalAlpha = 1
        ctx.fillStyle = '#080c14'; ctx.fillRect(0, 0, cw, ch)
        drawTechParticles(ctx, cw, ch, t)

        // 标题居中浮现
        ctx.save()
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#a855f7'
        ctx.shadowBlur = 25 * boomProg
        ctx.globalAlpha = boomProg
        ctx.font = `900 ${Math.round(cw * 0.05)}px "PingFang SC", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(this.data.title, cw / 2, ch * 0.1)
        ctx.restore()

        // 装饰线
        if (boomProg > 0.3) {
          const lineProg = Math.min(1, (boomProg - 0.3) / 0.4)
          ctx.save(); ctx.globalAlpha = lineProg * 0.5
          const lg3 = ctx.createLinearGradient(cw * 0.1, 0, cw * 0.9, 0)
          lg3.addColorStop(0, 'transparent'); lg3.addColorStop(0.2, '#06b6d4')
          lg3.addColorStop(0.8, '#a855f7'); lg3.addColorStop(1, 'transparent')
          ctx.strokeStyle = lg3; ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(cw * 0.1, ch * 0.18); ctx.lineTo(cw * 0.9, ch * 0.18); ctx.stroke(); ctx.restore()
        }

        // 短语网格依次展开
        const phraseFontSize2 = Math.round(cw * 0.025)
        const phraseH2 = phraseFontSize2 * 1.4
        const cols2 = 5
        const gridW2 = cw * 0.88
        const cellW2 = gridW2 / cols2
        const startX3 = (cw - gridW2) / 2
        const phraseStartY2 = ch * 0.22

        for (let pi = 0; pi < n; pi++) {
          const delay = pi * 0.06
          const ip = Math.min(1, Math.max(0, (boomProg - delay) / (1 - delay)))
          const ep2 = easeOutBack(ip)

          const col = pi % cols2
          const row = Math.floor(pi / cols2)
          const px3 = startX3 + col * cellW2
          const py3 = phraseStartY2 + row * phraseH2
          const neonColor = pi % 2 === 0 ? '#06b6d4' : '#a855f7'

          ctx.save()
          ctx.globalAlpha = ip
          ctx.translate(px3 + cellW2 / 2, py3 + phraseH2 / 2)
          ctx.scale(ep2, ep2)
          ctx.translate(-(px3 + cellW2 / 2), -(py3 + phraseH2 / 2))
          ctx.fillStyle = '#ffffff'
          ctx.shadowColor = neonColor
          ctx.shadowBlur = 10
          ctx.font = `700 ${phraseFontSize2}px "PingFang SC", sans-serif`
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
          ctx.fillText(phrases[pi].text, px3, py3)
          ctx.restore()
        }
      }

      // === 爆炸 + Slogan ===
      if (t >= boomStart + boomDur) {
        const expProg = Math.min(1, (t - boomStart - boomDur) / expDur)
        const sloganProg = Math.min(1, (t - boomStart - boomDur - expDur) / sloganDur)
        drawExplosion(ctx, cw, ch, expProg)
        if (sloganProg > 0) {
          ctx.fillStyle = `rgba(8, 12, 20, ${Math.min(0.95, sloganProg * 1.5)})`
          ctx.fillRect(0, 0, cw, ch)
          drawMainTextStyle2(ctx, cw, ch, sloganProg)
        }
        if (t >= boomStart + boomDur + expDur + sloganDur + endHold) {
          this.done = true; cancelAnimationFrame(this.animId); this.onDone(); return
        }
        this.animId = requestAnimationFrame(ts => this.draw(ts)); return
      }

      this.animId = requestAnimationFrame(ts => this.draw(ts)); return
    }

    const centerY = ch * 0.38
    const topY = ch * 0.065
    const leftX = cw * 0.06

    if (t >= meltStart) {
      const expProg = Math.min(1, (t - meltStart) / expDur)
      const sloganProg = Math.min(1, (t - meltStart - expDur) / sloganDur)

      drawExplosion(ctx, cw, ch, expProg)

      if (sloganProg > 0) {
        ctx.fillStyle = `rgba(10, 10, 20, ${Math.min(0.95, sloganProg * 1.5)})`
        ctx.fillRect(0, 0, cw, ch)
        if (this.style === 'minimal') {
          drawMainTextStyle2(ctx, cw, ch, sloganProg)
        } else {
          drawMainText(ctx, cw, ch, sloganProg)
        }
      }

      if (t >= meltStart + expDur + sloganDur + endHold) {
        this.done = true
        cancelAnimationFrame(this.animId)
        this.onDone()
        return
      }

      this.animId = requestAnimationFrame(ts => this.draw(ts))
      return
    }

    // ===== 风格二（简约图文） =====
    if (this.style === 'minimal') {
      // 背景
      ctx.fillStyle = '#f5f5f7'
      ctx.fillRect(0, 0, cw, ch)

      // 装饰线
      ctx.save()
      ctx.globalAlpha = 0.15
      ctx.strokeStyle = '#8b5cf6'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cw * 0.05, ch * 0.05)
      ctx.lineTo(cw * 0.95, ch * 0.05)
      ctx.stroke()
      ctx.restore()

      const titleChars = Math.min(this.data.title.length + 1, Math.floor(Math.max(0, t - 50) / 180) + 1)

      // 标题滑动
      let slideProg = 0
      if (t > slideEnd) slideProg = 1
      else if (t > titleEnd) {
        const sp = (t - titleEnd) / (slideEnd - titleEnd)
        slideProg = 1 - Math.pow(1 - sp, 3)
      }

      drawTitleStyle2(ctx, this.data.title, titleChars, cw, centerY, topY, leftX, slideProg)

      // 确定当前显示的卡片索引
      const n = this.data.points.length
      let curCard = -1
      for (let i = 0; i < n; i++) {
        if (t >= cells[i].appear) curCard = i
      }

      // 绘制当前卡片
      if (curCard >= 0) {
        const cell = cells[curCard]
        // 入场进度
        let entryProg = Math.min(1, (t - cell.appear) / cardFadeIn)
        // 退出进度（下一个卡片入场时当前退出）
        let exitAlpha = 1
        if (curCard < n - 1 && t >= cells[curCard + 1].appear - cardFadeIn) {
          exitAlpha = Math.max(0, 1 - (t - (cells[curCard + 1].appear - cardFadeIn)) / cardFadeIn)
        }

        ctx.save()
        ctx.globalAlpha = exitAlpha
        drawCardStyle2(ctx, this.data.points[curCard], curCard, cw, ch, 1, entryProg)
        ctx.restore()
      }

      // 底部页码指示
      if (curCard >= 0) {
        const dotY = ch * 0.88
        const dotR = cw * 0.008
        const dotGap = cw * 0.025
        const totalDotsW = (n - 1) * dotGap
        const dotsStartX = cw / 2 - totalDotsW / 2
        ctx.save()
        for (let i = 0; i < n; i++) {
          ctx.beginPath()
          ctx.arc(dotsStartX + i * dotGap, dotY, dotR, 0, Math.PI * 2)
          ctx.fillStyle = i === curCard ? '#8b5cf6' : 'rgba(139,92,246,0.25)'
          ctx.fill()
        }
        ctx.restore()
      }

      this.animId = requestAnimationFrame(ts => this.draw(ts))
      return
    }

    // ===== 风格一（中国风） =====
    const { slideStart, gridAppear, cells: chCells } = this.getTimings()

    ctx.fillStyle = '#FAFAF6'
    ctx.fillRect(0, 0, cw, ch)

    const glowGrad = ctx.createRadialGradient(cw * 0.5, ch * 0.5, 0, cw * 0.5, ch * 0.5, cw * 0.5)
    glowGrad.addColorStop(0, 'rgba(139,92,246,0.04)')
    glowGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = glowGrad
    ctx.fillRect(0, 0, cw, ch)

    const titleChars = Math.min(this.data.title.length + 1, Math.floor(Math.max(0, t - 50) / 180) + 1)

    let slideProg = 0
    if (t > slideEnd) slideProg = 1
    else if (t > slideStart) {
      const sp = (t - slideStart) / (slideEnd - slideStart)
      slideProg = 1 - Math.pow(1 - sp, 3)
    }

    drawTitle(ctx, this.data.title, titleChars, cw, centerY, topY, slideProg)

    const gridVisible = t >= gridAppear
    if (gridVisible) {
      const lineOp = Math.min(1, (t - gridAppear) / 400)
      ctx.save()
      ctx.globalAlpha = lineOp * 0.4
      ctx.strokeStyle = 'rgba(139,92,246,0.3)'
      ctx.lineWidth = 1
      ctx.setLineDash([cw * 0.01, cw * 0.015])
      ctx.beginPath()
      ctx.moveTo(cw * 0.1, topY + cw * 0.06)
      ctx.lineTo(cw * 0.9, topY + cw * 0.06)
      ctx.stroke()
      ctx.restore()
    }

    if (gridVisible) {
      const gridOp = Math.min(1, (t - gridAppear) / 400)
      drawDashedGrid(ctx, cw, ch, this.cols, this.rows, gridOp)
    }

    this.updateCellStates(now)
    const pad = cw * 0.03
    const gap = cw * 0.015
    const gridTop = topY + cw * 0.085
    const gridW = cw - pad * 2
    const gridH = ch * 0.97 - gridTop
    const cellW = (gridW - gap * (this.cols - 1)) / this.cols
    const cellH = (gridH - gap * (this.rows - 1)) / this.rows

    this.data.points.forEach((pt, i) => {
      const col = i % this.cols
      const row = Math.floor(i / this.cols)
      const cx2 = pad + col * (cellW + gap)
      const cy2 = gridTop + row * (cellH + gap)
      const color = COLORS[i % COLORS.length]

      if (t >= chCells[i].label) {
        const entryDur = 400
        const ep = Math.min(1, (t - chCells[i].label) / entryDur)
        const ease = 1 - Math.pow(1 - ep, 3)
        ctx.save()
        ctx.globalAlpha = ease
        ctx.translate(0, (1 - ease) * cellH * 0.12)
        drawCell(ctx, pt, i, cx2, cy2, cellW, cellH, this.cellStates[i], color, cw)
        ctx.restore()
      }
    })

    this.animId = requestAnimationFrame(ts => this.draw(ts))
  }

  start() { this.animId = requestAnimationFrame(ts => this.draw(ts)) }
  stop() { if (this.animId) cancelAnimationFrame(this.animId) }
}

// ============================================================
// 风格二：简约图文封面（9:16）
// ============================================================
function drawCoverStyle2(cw, ch, title) {
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')

  const bg = ctx.createLinearGradient(0, 0, cw, ch)
  bg.addColorStop(0, '#0f0f1a')
  bg.addColorStop(0.5, '#1a1040')
  bg.addColorStop(1, '#0a0a14')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, cw, ch)

  ctx.save()
  ctx.globalAlpha = 0.12
  const rg = ctx.createRadialGradient(cw * 0.85, ch * 0.2, 0, cw * 0.85, ch * 0.2, cw * 0.5)
  rg.addColorStop(0, '#8b5cf6')
  rg.addColorStop(1, 'transparent')
  ctx.fillStyle = rg
  ctx.fillRect(0, 0, cw, ch)
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.08
  const rg2 = ctx.createRadialGradient(cw * 0.1, ch * 0.9, 0, cw * 0.1, ch * 0.9, cw * 0.4)
  rg2.addColorStop(0, '#06b6d4')
  rg2.addColorStop(1, 'transparent')
  ctx.fillStyle = rg2
  ctx.fillRect(0, 0, cw, ch)
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.3
  ctx.strokeStyle = '#8b5cf6'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cw * 0.08, ch * 0.12)
  ctx.lineTo(cw * 0.92, ch * 0.12)
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = `600 ${Math.round(cw * 0.028)}px "PingFang SC", sans-serif`
  ctx.fillStyle = '#8b5cf6'
  ctx.fillText('SUMMARY', cw / 2, ch * 0.22)
  ctx.restore()

  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const titleSize = Math.round(cw * 0.09)
  ctx.font = `900 ${titleSize}px "PingFang SC", sans-serif`
  ctx.shadowColor = 'rgba(139,92,246,0.6)'
  ctx.shadowBlur = cw * 0.04
  const grad = ctx.createLinearGradient(cw * 0.2, 0, cw * 0.8, 0)
  grad.addColorStop(0, '#f5f5f5')
  grad.addColorStop(0.5, '#ffffff')
  grad.addColorStop(1, '#e0e0e0')
  ctx.fillStyle = grad
  ctx.fillText(title, cw / 2, ch * 0.42)
  ctx.shadowBlur = 0
  ctx.restore()

  ctx.save()
  ctx.strokeStyle = 'rgba(139,92,246,0.4)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cw * 0.3, ch * 0.54)
  ctx.lineTo(cw * 0.7, ch * 0.54)
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = `500 ${Math.round(cw * 0.035)}px "PingFang SC", sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('少工作，多赚钱', cw / 2, ch * 0.62)
  ctx.font = `400 ${Math.round(cw * 0.028)}px "PingFang SC", sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.fillText('小福AI自由', cw / 2, ch * 0.68)
  ctx.restore()

  return canvas
}

// ============================================================
// 风格二：标题（中央打字 → 左上角）
// ============================================================
function drawTitleStyle2(ctx, text, chars, cw, centerY, topY, leftX, slideProg) {
  if (!text || chars <= 0) return
  ctx.save()

  const x = leftX + (cw / 2 - leftX) * (1 - slideProg)
  const y = topY + (centerY - topY) * (1 - slideProg)
  const titleSize = Math.round(cw * (slideProg > 0.5 ? 0.055 : 0.065))

  if (slideProg < 0.3) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const grad = ctx.createLinearGradient(cw * 0.2, 0, cw * 0.8, 0)
    grad.addColorStop(0, '#06b6d4')
    grad.addColorStop(0.5, '#8b5cf6')
    grad.addColorStop(1, '#ec4899')
    ctx.font = `900 ${titleSize}px "PingFang SC", sans-serif`
    ctx.shadowColor = 'rgba(139,92,246,0.5)'
    ctx.shadowBlur = cw * 0.03
    ctx.fillStyle = grad
    ctx.fillText(text.slice(0, chars), cw / 2, centerY)
  } else {
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${titleSize}px "PingFang SC", sans-serif`
    ctx.shadowColor = 'rgba(139,92,246,0.5)'
    ctx.shadowBlur = cw * 0.025
    ctx.fillStyle = '#ffffff'
    ctx.fillText(text, leftX, y)
  }

  ctx.shadowBlur = 0
  ctx.restore()
}

// ============================================================
// 风格二：单个卡片（左侧文字，右侧图标）
// ============================================================
function drawCardStyle2(ctx, pt, index, cw, ch, alpha, entryProg) {
  ctx.save()
  ctx.globalAlpha = alpha

  const padX = cw * 0.06
  const cardTop = ch * 0.24
  const cardH = ch * 0.54
  const cardW = cw - padX * 2
  const corner = cw * 0.025

  const ease = 1 - Math.pow(1 - Math.min(1, entryProg), 3)
  ctx.translate(0, (1 - ease) * cardH * 0.15)

  const accentColors = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#14b8a6']
  const accent = accentColors[index % accentColors.length]

  // 卡片背景 + 阴影
  ctx.save()
  drawRoundedRect(ctx, padX, cardTop, cardW, cardH, corner)
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(0,0,0,0.1)'
  ctx.shadowBlur = cw * 0.025
  ctx.shadowOffsetY = cw * 0.008
  ctx.fill()
  ctx.shadowBlur = 0

  // 左侧彩色边条
  drawRoundedRect(ctx, padX, cardTop, cw * 0.012, cardH, corner)
  ctx.fillStyle = accent
  ctx.fill()
  ctx.restore()

  // 序号圆
  const numX = padX + cw * 0.05
  const numY = cardTop + cardH * 0.14
  const numR = cw * 0.038
  ctx.beginPath()
  ctx.arc(numX + numR, numY, numR, 0, Math.PI * 2)
  ctx.fillStyle = accent
  ctx.shadowColor = accent
  ctx.shadowBlur = cw * 0.015
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.fillStyle = '#ffffff'
  ctx.font = `700 ${Math.round(cw * 0.032)}px "PingFang SC", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(index + 1), numX + numR, numY)

  // 关键词大字
  const kwX = numX + numR * 2 + cw * 0.025
  const kwY = numY - cw * 0.005
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.font = `800 ${Math.round(cw * 0.052)}px "PingFang SC", sans-serif`
  ctx.fillStyle = '#1a1a2e'
  ctx.shadowColor = 'rgba(0,0,0,0.08)'
  ctx.shadowBlur = cw * 0.006
  ctx.fillText(pt.label, kwX, kwY)
  ctx.shadowBlur = 0

  // 短说明
  const shortY = kwY + cw * 0.068
  ctx.font = `600 ${Math.round(cw * 0.03)}px "PingFang SC", sans-serif`
  ctx.fillStyle = accent
  ctx.fillText(pt.short, kwX, shortY)

  // 长解释（换行）
  const descY = shortY + cw * 0.062
  ctx.font = `400 ${Math.round(cw * 0.027)}px "PingFang SC", sans-serif`
  ctx.fillStyle = '#6B6860'
  const maxW = cardW - cw * 0.06 - cw * 0.36
  const descLines = wrapText(ctx, pt.desc, maxW)
  descLines.slice(0, 4).forEach((line, li) => {
    ctx.fillText(line, kwX, descY + li * cw * 0.036)
  })

  // 右侧图标
  const iconX = cw - padX - cw * 0.22
  const iconY = cardTop + cardH * 0.38
  const iconR = cw * 0.1

  ctx.beginPath()
  ctx.arc(iconX + iconR, iconY, iconR, 0, Math.PI * 2)
  const iconGrad = ctx.createRadialGradient(iconX + iconR, iconY - iconR * 0.3, 0, iconX + iconR, iconY, iconR)
  iconGrad.addColorStop(0, accent + 'cc')
  iconGrad.addColorStop(1, accent + '44')
  ctx.fillStyle = iconGrad
  ctx.shadowColor = accent
  ctx.shadowBlur = cw * 0.02
  ctx.fill()
  ctx.shadowBlur = 0

  drawIconSymbol(ctx, index, iconX + iconR, iconY, iconR * 0.5, accent)

  ctx.restore()
}

function drawIconSymbol(ctx, index, cx, cy, r, color) {
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.lineWidth = Math.max(1.5, r * 0.15)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const t = index % 8
  if (t === 0) {
    ctx.beginPath(); ctx.moveTo(cx - r * 0.35, cy); ctx.lineTo(cx - r * 0.05, cy + r * 0.35); ctx.lineTo(cx + r * 0.4, cy - r * 0.3); ctx.stroke()
  } else if (t === 1) {
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const oa = (i * 72 - 90) * Math.PI / 180
      const ia = ((i * 72) + 36 - 90) * Math.PI / 180
      ctx.lineTo(cx + Math.cos(oa) * r, cy + Math.sin(oa) * r)
      ctx.lineTo(cx + Math.cos(ia) * r * 0.4, cy + Math.sin(ia) * r * 0.4)
    }
    ctx.closePath(); ctx.fillStyle = color; ctx.fill()
  } else if (t === 2) {
    ctx.beginPath(); ctx.moveTo(cx - r * 0.3, cy); ctx.lineTo(cx + r * 0.25, cy); ctx.moveTo(cx + r * 0.1, cy - r * 0.3); ctx.lineTo(cx + r * 0.3, cy); ctx.lineTo(cx + r * 0.1, cy + r * 0.3); ctx.stroke()
  } else if (t === 3) {
    ctx.beginPath(); ctx.moveTo(cx + r * 0.15, cy - r * 0.4); ctx.lineTo(cx - r * 0.15, cy + r * 0.1); ctx.lineTo(cx + r * 0.05, cy + r * 0.1); ctx.lineTo(cx - r * 0.15, cy + r * 0.4); ctx.lineTo(cx + r * 0.25, cy - r * 0.05); ctx.lineTo(cx - r * 0.05, cy - r * 0.05); ctx.closePath(); ctx.fillStyle = color; ctx.fill()
  } else if (t === 4) {
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2); ctx.fill()
  } else if (t === 5) {
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.4); ctx.lineTo(cx + r * 0.3, cy); ctx.lineTo(cx + r * 0.1, cy); ctx.lineTo(cx + r * 0.1, cy + r * 0.4); ctx.lineTo(cx - r * 0.1, cy + r * 0.4); ctx.lineTo(cx - r * 0.1, cy); ctx.lineTo(cx - r * 0.3, cy); ctx.closePath(); ctx.fillStyle = color; ctx.fill()
  } else if (t === 6) {
    ctx.beginPath(); ctx.moveTo(cx, cy + r * 0.35); ctx.bezierCurveTo(cx - r * 0.6, cy, cx - r * 0.5, cy - r * 0.5, cx, cy - r * 0.2); ctx.bezierCurveTo(cx + r * 0.5, cy - r * 0.5, cx + r * 0.6, cy, cx, cy + r * 0.35); ctx.fillStyle = color; ctx.fill()
  } else {
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.4); ctx.lineTo(cx, cy + r * 0.4); ctx.moveTo(cx - r * 0.4, cy); ctx.lineTo(cx + r * 0.4, cy); ctx.stroke()
  }
  ctx.restore()
}

function wrapText(ctx, text, maxWidth) {
  const lines = []
  let current = ''
  for (const char of text) {
    const test = current + char
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current); current = char
    } else { current = test }
  }
  if (current) lines.push(current)
  return lines
}

// ============================================================
// 风格二：Slogan 页面
// ============================================================
function drawMainTextStyle2(ctx, cw, ch, prog) {
  const text = '少工作，多赚钱'
  const sub1 = '以书为粮，以路为行'
  const sub2 = '小福AI自由'

  ctx.save()
  const alpha = Math.min(1, prog * 2.5)
  ctx.globalAlpha = alpha

  const bounceT = Math.min(1, prog / 0.5)
  const overshoot = bounceT < 1 ? bounceT * 1.2 : 1 - Math.sin((bounceT - 0.5) / 0.5 * Math.PI) * 0.15
  const cx = cw / 2, cy = ch * 0.45

  ctx.translate(cx, cy)
  ctx.scale(overshoot, overshoot)
  ctx.translate(-cx, -cy)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const mainSize = Math.round(cw * 0.1)
  ctx.font = `900 ${mainSize}px "PingFang SC", sans-serif`
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = cw * 0.004
  ctx.shadowColor = 'rgba(139,92,246,0.9)'
  ctx.shadowBlur = cw * 0.06
  const grad = ctx.createLinearGradient(cx - cw * 0.3, 0, cx + cw * 0.3, 0)
  grad.addColorStop(0, '#06b6d4')
  grad.addColorStop(0.5, '#8b5cf6')
  grad.addColorStop(1, '#ec4899')
  ctx.fillStyle = grad
  ctx.strokeText(text, cx, cy)
  ctx.fillText(text, cx, cy)
  ctx.shadowBlur = 0

  ctx.globalAlpha = alpha * 0.9
  const subSize = Math.round(cw * 0.036)
  ctx.font = `700 ${subSize}px "PingFang SC", sans-serif`
  ctx.fillStyle = '#e2e8f0'
  ctx.shadowColor = 'rgba(139,92,246,0.5)'
  ctx.shadowBlur = cw * 0.025
  ctx.fillText(sub1, cx, cy + mainSize * 1.3)
  ctx.shadowBlur = 0

  ctx.globalAlpha = alpha * 0.7
  ctx.font = `600 ${Math.round(cw * 0.028)}px "PingFang SC", sans-serif`
  ctx.fillStyle = 'rgba(139,92,246,0.85)'
  ctx.fillText(sub2, cx, cy + mainSize * 1.3 + subSize * 1.8)

  ctx.restore()
}

// ============================================================
// 音效
// ============================================================
function playSound(freq, type = 'square', vol = 0.07, dur = 0.1) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.connect(g); g.connect(ctx.destination)
    osc.type = type; osc.frequency.value = freq
    g.gain.setValueAtTime(0, ctx.currentTime)
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur + 0.05)
  } catch (_) {}
}

function playDone() {
  playSound(523, 'sine', 0.12, 0.2)
  setTimeout(() => playSound(659, 'sine', 0.12, 0.2), 100)
  setTimeout(() => playSound(784, 'sine', 0.12, 0.25), 200)
  setTimeout(() => playSound(1047, 'sine', 0.12, 0.3), 300)
}

function playExplosion() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.5
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'; f.frequency.value = 300
    src.connect(f); f.connect(g); g.connect(ctx.destination)
    g.gain.setValueAtTime(0.4, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
    src.start()
  } catch (_) {}
}

// ============================================================
// FFmpeg
// ============================================================
let ffmpegInstance = null

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms)
    promise.then(v => { clearTimeout(timer); resolve(v) }).catch(e => { clearTimeout(timer); reject(e) })
  })
}

async function loadFFmpeg() {
  if (ffmpegInstance) return ffmpegInstance
  try {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { fetchFile } = await import('@ffmpeg/util')
    const ffmpeg = new FFmpeg()
    ffmpeg.on('log', ({ message }) => console.log('ffmpeg:', message))
    await withTimeout(ffmpeg.load(), 90000)
    ffmpegInstance = { ffmpeg, fetchFile }
    return ffmpegInstance
  } catch (e) {
    console.error('ffmpeg load failed:', e)
    return null
  }
}

async function convertWebMToMP4(webmBlob) {
  const lib = await loadFFmpeg()
  if (!lib) return null
  const { ffmpeg, fetchFile } = lib
  try {
    const webmData = await fetchFile(webmBlob)
    await ffmpeg.writeFile('input.webm', webmData)
    await ffmpeg.exec(['-i', 'input.webm', '-c:v', 'libx264', '-c:a', 'aac', '-y', 'output.mp4'])
    const data = await ffmpeg.readFile('output.mp4')
    await ffmpeg.deleteFile('input.webm')
    await ffmpeg.deleteFile('output.mp4')
    return new Blob([data.buffer], { type: 'video/mp4' })
  } catch (e) {
    console.error('Conversion failed:', e)
    return null
  }
}

// ============================================================
// 主组件
// ============================================================
export default function RecorderPlayer({ data, onClose, shapeType = -1, styleOpts = {}, animationStyle = 'chinese', mainStyle = 'chinese' }) {
  const canvasRef = useRef(null)
  const coverCanvasRef = useRef(null)
  const recorderRef = useRef(null)
  const engineRef = useRef(null)
  const [status, setStatus] = useState('cover') // cover / idle / recording / converting / done
  const [progress, setProgress] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState(null)
  const [mp4Blob, setMp4Blob] = useState(null)
  const meltSoundPlayed = useRef(false)

  // 生成封面（9:16 竖屏）
  const generateCover = useCallback(() => {
    let canvas
    if (mainStyle === 'city') {
      canvas = drawLandmarkCover(data, shapeType, styleOpts)
    } else if (animationStyle === 'minimal') {
      canvas = drawCoverStyle2(1080, 1920, data.title)
    } else {
      canvas = drawCover(data, shapeType, styleOpts)
    }
    if (coverCanvasRef.current) {
      const previewCtx = coverCanvasRef.current.getContext('2d')
      const scale = Math.min(300 / canvas.width, 500 / canvas.height)
      previewCtx.canvas.width = 300
      previewCtx.canvas.height = Math.round(canvas.height * scale)
      previewCtx.drawImage(canvas, 0, 0, previewCtx.canvas.width, previewCtx.canvas.height)
    }
    return canvas
  }, [data, shapeType, styleOpts, animationStyle, mainStyle])

  const startRecording = useCallback(async () => {
    const canvas = canvasRef.current
    console.log('[startRecording] canvas element:', !!canvas, 'width:', canvas?.width, 'height:', canvas?.height)
    if (!canvas) return

    let mimeType = 'video/webm;codecs=vp9'
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm'

    const stream = canvas.captureStream(30)
    let recorder
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
    } catch (e) {
      console.error('Recorder init failed:', e)
      setStatus('idle')
      return
    }

    const chunks = []
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }
    recorder.onstop = async () => {
      const webmBlob = new Blob(chunks, { type: mimeType || 'video/webm' })
      setRecordedBlob(webmBlob)
      setStatus('converting')
      setProgress(0)

      try {
        const mp4 = await withTimeout(convertWebMToMP4(webmBlob), 60000)
        setMp4Blob(mp4)
      } catch (e) {
        console.warn('MP4 转换失败，回退 WebM:', e.message)
        setMp4Blob(null)
      }

      setProgress(100)
      setStatus('done')
      playDone()
    }
    recorder.onerror = e => console.error('Recorder error:', e)

    recorderRef.current = recorder
    recorder.start(100)
    setStatus('recording')

    const n = data.points.length
    const titleEnd = 50 + data.title.length * 180

    let meltStart
    if (animationStyle === 'minimal') {
      const slideEnd2 = titleEnd + 500
      const cardDur = 1800
      const lastCardAppear = slideEnd2 + 200 + (n - 1) * cardDur
      meltStart = lastCardAppear + 300
    } else if (animationStyle === 'tech') {
      // tech: boomStart = dancingStart + (n-1)*phraseGap + phraseDur + staticDur
      const titleText = data.title || ''
      const phrases = []
      for (let i = 0; i < titleText.length; i += 3) {
        const chunk = titleText.slice(i, i + 3)
        if (chunk) phrases.push({ text: chunk })
      }
      data.points.forEach(pt => {
        const label = pt.label || ''
        for (let i = 0; i < label.length; i += 3) {
          const chunk = label.slice(i, i + 3)
          if (chunk) phrases.push({ text: chunk })
        }
      })
      const phraseDur = 2200
      const phraseGap = 700
      const titleTypingDur = 50 + titleText.length * 120
      const dancingStart = titleTypingDur + 300
      const lastPhraseExit = dancingStart + (phrases.length - 1) * phraseGap + phraseDur
      const staticStart = lastPhraseExit + 1200
      const boomStart = staticStart + 1800
      meltStart = boomStart
    } else {
      const slideEnd2 = titleEnd + 600
      const gridAppear2 = slideEnd2 + 100
      const cellGap = 1600, partGap = 600
      const cs = data.points.map((_, i) => ({
        label: gridAppear2 + i * cellGap,
        short: gridAppear2 + i * cellGap + partGap,
        desc:  gridAppear2 + i * cellGap + partGap * 2,
      }))
      meltStart = cs[cs.length - 1].desc + 1200
    }

    setTimeout(() => {
      if (!meltSoundPlayed.current) {
        meltSoundPlayed.current = true
        playExplosion()
      }
    }, meltStart)

    let prevStates = {}
    const checkSounds = (engine) => {
      data.points.forEach((_, i) => {
        const st = engine.cellStates[i]
        if (st > 0 && prevStates[i] !== st) {
          if (st === 1) playSound(580 + i * 20, 'square', 0.07, 0.1)
          if (st === 2) playSound(800 + i * 50, 'sine', 0.06, 0.12)
          if (st === 3) playSound(600 + i * 80, 'triangle', 0.08, 0.18)
        }
        prevStates[i] = st
      })
      prevStates = { ...engine.cellStates }
    }

    const engine = new AnimEngine(canvas, data, {
      animationStyle,
      shapeType,
      onDone: () => {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
          recorderRef.current.stop()
        }
      },
      onProgress: (p) => setProgress(p),
    })
    if (animationStyle !== 'minimal' && animationStyle !== 'tech') {
      engine.updateCellStates = (now) => {
        const t2 = now - engine.startTime
        const cs2 = engine.getTimings().cells
        engine.data.points.forEach((_, i) => {
          if (t2 >= cs2[i].desc) engine.cellStates[i] = 3
          else if (t2 >= cs2[i].short) engine.cellStates[i] = 2
          else if (t2 >= cs2[i].label) engine.cellStates[i] = 1
          else engine.cellStates[i] = 0
        })
        if (engine.startTime) checkSounds(engine)
      }
    } else if (animationStyle === 'tech') {
      // tech 风格暂不需要 cellStates 更新
      engine.updateCellStates = () => {}
    } else {
      // 风格二：每个卡片出现时播放音效
      let prevCard = -1
      engine.updateCellStates = () => {}
    }
    engineRef.current = engine
    engine.start()
  }, [data, animationStyle])

  const handleDownloadVideo = () => {
    const blob = mp4Blob || recordedBlob
    if (!blob) return
    const ext = mp4Blob ? 'mp4' : 'webm'
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${data.title}_视频_${Date.now()}.${ext}`; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }

  const handleDownloadCover = () => {
    const canvas = drawCover(data, shapeType, styleOpts)
    canvas.toBlob(blob => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `${data.title}_封面_${Date.now()}.png`; a.click()
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    }, 'image/png')
  }

  useEffect(() => {
    generateCover()
    return () => {
      if (engineRef.current) engineRef.current.stop()
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        try { recorderRef.current.stop() } catch (_) {}
      }
    }
  }, [generateCover])

  const statusLabel = { idle: '准备中…', recording: '录制中…', converting: '转换中…', done: '录制完成' }[status] || ''

  // 封面状态点击"开始录制"：先切换到idle（渲染画布），再触发录制
  const handleStartFromCover = () => {
    setStatus('idle')
  }

  // idle 时自动开始录制
  const hasAutoStarted = useRef(false)
  useEffect(() => {
    if (status === 'idle' && !hasAutoStarted.current) {
      hasAutoStarted.current = true
      console.log('[useEffect idle] scheduling startRecording')
      const timer = setTimeout(() => {
        console.log('[timer] calling startRecording now')
        startRecording()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [status])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(10,10,20,0.97)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '0',
    }}>
      {/* 顶部栏 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid rgba(139,92,246,0.2)',
        background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(10px)',
        zIndex: 10,
      }}>
        {status === 'cover' && (
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>封面预览 · 确认后开始录制</span>
        )}
        {status === 'idle' && (
          <button onClick={startRecording}
            style={{ padding: '8px 24px', borderRadius: '999px', background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: 'white', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
            开始录制视频
          </button>
        )}
        {(status === 'recording' || status === 'converting') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {status === 'recording' && (
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite', boxShadow: '0 0 8px #ef444480' }} />
            )}
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: '600' }}>{statusLabel}</span>
            <div style={{ width: '160px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '2px', background: 'linear-gradient(90deg,#06b6d4,#8b5cf6,#ec4899)', width: `${progress}%`, transition: 'width 0.15s linear' }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px' }}>{progress}%</span>
          </div>
        )}
        {status === 'done' && (
          <span style={{ color: '#10B981', fontSize: '13px', fontWeight: '700' }}>✓ 录制完成</span>
        )}
      </div>

      {/* 主内容区 */}
      {status === 'cover' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          marginTop: '70px', gap: '20px',
        }}>
          {/* 封面预览 */}
          <div style={{ position: 'relative' }}>
            <canvas ref={coverCanvasRef}
              style={{
                borderRadius: '12px',
                boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
                border: '1px solid rgba(139,92,246,0.3)',
              }}
            />
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              padding: '4px 12px', borderRadius: '999px',
              background: 'rgba(139,92,246,0.2)',
              border: '1px solid rgba(139,92,246,0.4)',
              color: 'rgba(168,85,247,0.9)', fontSize: '11px', fontWeight: '700',
              backdropFilter: 'blur(8px)',
            }}>9:16 {mainStyle === 'city' ? '城市地标' : (animationStyle === 'minimal' ? '简约' : '中国风')} 封面</div>
          </div>

          {/* 操作按钮 */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <button onClick={handleDownloadCover}
              style={{ padding: '12px 28px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(139,92,246,0.4)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = 'rgba(139,92,246,0.2)'; e.target.style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.07)'; e.target.style.transform = 'scale(1)' }}>
              下载封面 PNG
            </button>
            <button onClick={handleStartFromCover}
              style={{ padding: '12px 36px', borderRadius: '999px', background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: 'white', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 4px 24px rgba(139,92,246,0.45)', letterSpacing: '0.05em', transition: 'transform 0.15s' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
              开始录制视频 →
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '4px' }}>1080×1920 PNG · 9:16 竖屏</p>
        </div>
      )}

      {/* 录制画面（隐藏直到开始录制） */}
      {status !== 'cover' && (
        <canvas ref={canvasRef} width={1280} height={720}
          id="animCanvas"
          style={{
            display: 'block',
            width: '1280px',
            height: '720px',
            borderRadius: '12px',
            boxShadow: '0 20px 80px rgba(0,0,0,0.7)',
            marginTop: '56px',
            background: '#000',
          }}
        />
      )}

      {/* 完成下载 */}
      {status === 'done' && (
        <div style={{ marginTop: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <button onClick={handleDownloadVideo}
            style={{ padding: '13px 36px', borderRadius: '999px', background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: 'white', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 4px 24px rgba(139,92,246,0.45)', transition: 'transform 0.15s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
            {mp4Blob ? '下载 MP4' : '下载 WebM'}
          </button>
          <button onClick={handleDownloadCover}
            style={{ padding: '13px 36px', borderRadius: '999px', background: 'rgba(139,92,246,0.15)', color: '#a855f7', fontSize: '14px', fontWeight: '700', border: '1px solid rgba(139,92,246,0.4)', cursor: 'pointer', transition: 'transform 0.15s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
            下载封面 PNG
          </button>
          <button onClick={onClose}
            style={{ padding: '13px 32px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>
            关闭
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        @keyframes popIn { from { opacity:0; transform:scale(0.8) translateY(10px) } to { opacity:1; transform:none } }
      `}</style>
    </div>
  )
}
