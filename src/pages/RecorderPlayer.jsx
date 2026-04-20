import { useEffect, useRef, useState, useCallback } from 'react'
import { drawCover } from '../lib/shapes'

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

function drawTitle(ctx, text, chars, cw, titleY, progress) {
  const shown = text.slice(0, chars)
  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const fontSize = Math.round(cw * 0.038)
  const x = cw / 2

  const grad = ctx.createLinearGradient(x - cw * 0.2, 0, x + cw * 0.2, 0)
  GRAD.forEach((c, i) => grad.addColorStop(i / (GRAD.length - 1), c))

  ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`
  ctx.fillStyle = grad
  ctx.shadowColor = 'rgba(139,92,246,0.5)'
  ctx.shadowBlur = cw * 0.025
  ctx.fillText(shown, x, titleY)
  ctx.shadowBlur = 0

  if (chars < text.length) {
    const metrics = ctx.measureText(shown)
    const cursorX = x + metrics.width / 2 + cw * 0.004
    const alpha = progress < 0.5 ? 1 : 0
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#D97706'
    ctx.fillRect(cursorX, titleY - fontSize * 0.42, cw * 0.003, fontSize * 0.85)
  }
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
  }

  getTimings() {
    const titleLen = this.data.title.length
    const titleEnd = 50 + titleLen * 100
    const gridAppear = titleEnd + 300
    const cellGap = 2000
    const partGap = 600
    const cells = this.data.points.map((_, i) => ({
      label: gridAppear + i * cellGap,
      short: gridAppear + i * cellGap + partGap,
      desc: gridAppear + cellGap + i * cellGap + partGap * 2,
    }))
    const meltStart = cells[cells.length - 1].desc + 1200
    const expDur = 1200
    const sloganDur = 2500
    const endHold = 2200
    const total = meltStart + expDur + sloganDur + endHold
    return { titleEnd, gridAppear, cells, meltStart, expDur, sloganDur, endHold, total }
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
    const { gridAppear, cells, meltStart, expDur, sloganDur, endHold, total } = this.getTimings()
    const { ctx, cw, ch } = this

    const prog = Math.min(1, t / total)
    this.onProgress(Math.round(prog * 88))

    if (t >= meltStart) {
      const expProg = Math.min(1, (t - meltStart) / expDur)
      const sloganProg = Math.min(1, (t - meltStart - expDur) / sloganDur)

      drawExplosion(ctx, cw, ch, expProg)

      if (sloganProg > 0) {
        ctx.fillStyle = `rgba(10, 10, 20, ${Math.min(0.95, sloganProg * 1.5)})`
        ctx.fillRect(0, 0, cw, ch)
        drawMainText(ctx, cw, ch, sloganProg)
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

    ctx.fillStyle = '#FAFAF6'
    ctx.fillRect(0, 0, cw, ch)

    const glowGrad = ctx.createRadialGradient(cw * 0.5, ch * 0.5, 0, cw * 0.5, ch * 0.5, cw * 0.5)
    glowGrad.addColorStop(0, 'rgba(139,92,246,0.04)')
    glowGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = glowGrad
    ctx.fillRect(0, 0, cw, ch)

    const titleChars = Math.min(this.data.title.length, Math.floor(Math.max(0, t - 50) / 100) + 1)
    this.gridVisible = t >= gridAppear
    drawTitle(ctx, this.data.title, titleChars, cw, this.titleY, (t / 500) % 1)

    if (this.gridVisible) {
      const lineOp = Math.min(1, (t - gridAppear) / 400)
      ctx.save()
      ctx.globalAlpha = lineOp * 0.4
      ctx.strokeStyle = 'rgba(139,92,246,0.3)'
      ctx.lineWidth = 1
      ctx.setLineDash([cw * 0.01, cw * 0.015])
      ctx.beginPath()
      ctx.moveTo(cw * 0.1, this.gridTop - cw * 0.015)
      ctx.lineTo(cw * 0.9, this.gridTop - cw * 0.015)
      ctx.stroke()
      ctx.restore()
    }

    if (this.gridVisible) {
      const gridOp = Math.min(1, (t - gridAppear) / 400)
      drawDashedGrid(ctx, cw, ch, this.cols, this.rows, gridOp)
    }

    this.updateCellStates(now)
    const pad = cw * 0.03
    const gap = cw * 0.015
    const gridW = cw - pad * 2
    const gridH = this.gridBottom - this.gridTop
    const cellW = (gridW - gap * (this.cols - 1)) / this.cols
    const cellH = (gridH - gap * (this.rows - 1)) / this.rows

    this.data.points.forEach((pt, i) => {
      const col = i % this.cols
      const row = Math.floor(i / this.cols)
      const cx2 = pad + col * (cellW + gap)
      const cy2 = this.gridTop + row * (cellH + gap)
      const color = COLORS[i % COLORS.length]

      if (t >= cells[i].label) {
        const entryDur = 400
        const ep = Math.min(1, (t - cells[i].label) / entryDur)
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
export default function RecorderPlayer({ data, onClose, shapeType = -1, styleOpts = {} }) {
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
    const canvas = drawCover(data, shapeType, styleOpts)
    if (coverCanvasRef.current) {
      const previewCtx = coverCanvasRef.current.getContext('2d')
      const scale = Math.min(300 / canvas.width, 500 / canvas.height)
      previewCtx.canvas.width = 300
      previewCtx.canvas.height = Math.round(canvas.height * scale)
      previewCtx.drawImage(canvas, 0, 0, previewCtx.canvas.width, previewCtx.canvas.height)
    }
    return canvas
  }, [data, shapeType, styleOpts])

  const startRecording = useCallback(async () => {
    const canvas = canvasRef.current
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
    const titleEnd = 50 + data.title.length * 100
    const gridAppear = titleEnd + 300
    const cellGap = 2000, partGap = 600
    const cs = data.points.map((_, i) => ({
      label: gridAppear + i * cellGap,
      short: gridAppear + i * cellGap + partGap,
      desc: gridAppear + cellGap + i * cellGap + partGap * 2,
    }))
    const meltStart = cs[cs.length - 1].desc + 1200

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
      onDone: () => {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
          recorderRef.current.stop()
        }
      },
      onProgress: (p) => setProgress(p),
    })
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
    engineRef.current = engine
    engine.start()
  }, [data])

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
      const timer = setTimeout(() => {
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
            }}>9:16 竖屏封面</div>
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
          style={{
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 140px)',
            width: 'auto', height: 'auto',
            borderRadius: '12px',
            boxShadow: '0 20px 80px rgba(0,0,0,0.7)',
            marginTop: '56px',
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
