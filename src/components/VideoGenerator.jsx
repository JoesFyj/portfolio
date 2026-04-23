/**
 * Video Generator - 短视频动画生成引擎 v2.0
 * 
 * 设计理念：
 * 1. 背景要有立体空间感（多层次、粒子、光影）
 * 2. 标题打字机效果 → 快速移到顶部
 * 3. 内容分组：序号 + 核心观点 + 简短解释
 * 4. 3种专业风格，可扩展
 * 5. 账号水印"小福AI自由"在角落
 */

import { useRef, useEffect, useState, useCallback } from 'react'

// ============================================================
// 主题配置
// ============================================================
const THEMES = {
  // 深空蓝 - 科技感
  'deep-space': {
    name: '深空蓝',
    background: ['#050510', '#0a1628', '#0f1f3d'],
    particles: { color: '#00d4ff', count: 60, speed: 0.3 },
    accent: '#00d4ff',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.7)',
    cardBg: 'rgba(255,255,255,0.08)',
    cardBorder: 'rgba(0,212,255,0.3)',
    glowColor: 'rgba(0,212,255,0.5)',
    watermark: 'rgba(0,212,255,0.25)',
  },
  
  // 暮夜金 - 高端感
  'midnight-gold': {
    name: '暮夜金',
    background: ['#0f0d1a', '#1a1428', '#2a1a2a'],
    particles: { color: '#f0c040', count: 50, speed: 0.25 },
    accent: '#f0c040',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.75)',
    cardBg: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(240,192,64,0.25)',
    glowColor: 'rgba(240,192,64,0.4)',
    watermark: 'rgba(240,192,64,0.2)',
  },
  
  // 极光紫 - 梦幻感
  'aurora': {
    name: '极光紫',
    background: ['#0a0512', '#1a0a28', '#0f1a2a'],
    particles: { color: '#a855f7', count: 55, speed: 0.28 },
    accent: '#a855f7',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.7)',
    cardBg: 'rgba(168,85,247,0.1)',
    cardBorder: 'rgba(168,85,247,0.3)',
    glowColor: 'rgba(168,85,247,0.5)',
    watermark: 'rgba(168,85,247,0.2)',
  },
}

// ============================================================
// 绘图工具函数
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

// 缓动函数
function easeOutBack(x) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

// ============================================================
// 动画引擎
// ============================================================
class AnimationEngine {
  constructor(canvas, data, themeKey = 'deep-space') {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.data = data
    this.theme = THEMES[themeKey]
    this.cw = canvas.width
    this.ch = canvas.height
    
    this.startTime = null
    this.animId = null
    this.onDone = null
    this.onProgress = null
    
    // 初始化粒子
    this.particles = []
    for (let i = 0; i < this.theme.particles.count; i++) {
      this.particles.push({
        x: Math.random() * this.cw,
        y: Math.random() * this.ch,
        vx: (Math.random() - 0.5) * this.theme.particles.speed,
        vy: (Math.random() - 0.5) * this.theme.particles.speed,
        size: 0.5 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.4,
      })
    }
    
    // 计算时间线
    this.calculateTimeline()
  }
  
  calculateTimeline() {
    // 时间线设计（毫秒）
    // 0-800: 背景建立
    // 800-3500: 标题打字机
    // 3500-4200: 标题上移
    // 4200-18000: 内容展示（每条约2秒）
    // 18000-20000: 收尾
    
    const titleLen = (this.data.title || '').length
    const points = this.data.points || []
    
    this.timeline = {
      bgEstablish: 800,
      titleStart: 800,
      titleEnd: 800 + titleLen * 80, // 每字80ms
      titleMoveEnd: 800 + titleLen * 80 + 700,
      contentStart: 800 + titleLen * 80 + 700 + 200,
      contentItemDuration: 2200, // 每条内容展示时间
      contentEnd: 800 + titleLen * 80 + 700 + 200 + points.length * 2200,
      settleEnd: 800 + titleLen * 80 + 700 + 200 + points.length * 2200 + 2000,
    }
    
    this.timeline.total = this.timeline.settleEnd
  }
  
  // ============================================================
  // 绘制背景
  // ============================================================
  drawBackground(t) {
    const { ctx, cw, ch, theme } = this
    const [bg1, bg2, bg3] = theme.background
    
    // 多层渐变背景（模拟深度）
    const grad1 = ctx.createLinearGradient(0, 0, 0, ch)
    grad1.addColorStop(0, bg1)
    grad1.addColorStop(0.5, bg2)
    grad1.addColorStop(1, bg3)
    ctx.fillStyle = grad1
    ctx.fillRect(0, 0, cw, ch)
    
    // 径向光晕（中心亮）
    const glowGrad = ctx.createRadialGradient(cw/2, ch*0.4, 0, cw/2, ch*0.4, cw*0.7)
    glowGrad.addColorStop(0, theme.glowColor)
    glowGrad.addColorStop(0.5, 'rgba(0,0,0,0)')
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = glowGrad
    ctx.fillRect(0, 0, cw, ch)
    
    // 粒子动画
    this.particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = cw
      if (p.x > cw) p.x = 0
      if (p.y < 0) p.y = ch
      if (p.y > ch) p.y = 0
      
      // 脉冲效果
      const pulse = 0.5 + 0.5 * Math.sin(t / 1000 + p.x * 0.01)
      
      ctx.globalAlpha = p.alpha * pulse
      ctx.fillStyle = theme.particles.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1
    
    // 深度网格线（远处淡化）
    ctx.strokeStyle = `${theme.accent}10`
    ctx.lineWidth = 1
    const gridSize = 80
    const offsetY = (t * 0.02) % gridSize
    
    for (let y = -gridSize + offsetY; y < ch + gridSize; y += gridSize) {
      ctx.globalAlpha = 0.08 * (1 - y / ch)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(cw, y)
      ctx.stroke()
    }
    
    for (let x = 0; x < cw; x += gridSize) {
      ctx.globalAlpha = 0.05
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, ch)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }
  
  // ============================================================
  // 绘制水印
  // ============================================================
  drawWatermark() {
    const { ctx, cw, ch, theme } = this
    
    ctx.save()
    ctx.globalAlpha = 0.4
    ctx.fillStyle = theme.watermark
    ctx.font = '600 18px "PingFang SC", sans-serif'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText('小福AI自由', cw - 24, ch - 20)
    ctx.restore()
  }
  
  // ============================================================
  // 绘制标题
  // ============================================================
  drawTitle(t) {
    const { ctx, cw, ch, theme, timeline, data } = this
    const title = data.title || ''
    
    if (t < timeline.titleStart) return
    
    // 打字机阶段
    if (t < timeline.titleEnd) {
      const chars = Math.floor((t - timeline.titleStart) / 80)
      const displayText = title.slice(0, chars)
      const currentChar = title[chars]
      
      // 在正中央绘制
      const fontSize = 64
      ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 主文字
      ctx.fillStyle = theme.textPrimary
      ctx.shadowColor = theme.glowColor
      ctx.shadowBlur = 30
      
      // 逐字绘制，带缩放效果
      let x = cw / 2 - ctx.measureText(displayText).width / 2
      for (let i = 0; i < displayText.length; i++) {
        const char = displayText[i]
        const charProgress = Math.min(1, (t - timeline.titleStart - i * 80) / 150)
        const scale = easeOutBack(charProgress)
        
        ctx.save()
        ctx.translate(x + ctx.measureText(char).width / 2, ch / 2)
        ctx.scale(scale, scale)
        ctx.translate(-(x + ctx.measureText(char).width / 2), -(ch / 2))
        ctx.fillText(char, x, ch / 2)
        ctx.restore()
        
        x += ctx.measureText(char).width
      }
      
      // 光标闪烁
      if (Math.floor(t / 400) % 2 === 0) {
        const cursorX = x + 5
        ctx.fillStyle = theme.accent
        ctx.fillRect(cursorX, ch / 2 - fontSize / 2, 3, fontSize)
      }
      
      ctx.shadowBlur = 0
    }
    
    // 移动到顶部阶段
    else if (t < timeline.titleMoveEnd) {
      const moveProgress = easeOutCubic((t - timeline.titleEnd) / (timeline.titleMoveEnd - timeline.titleEnd))
      
      const startY = ch / 2
      const endY = 90
      const currentY = startY + (endY - startY) * moveProgress
      
      const startFontSize = 64
      const endFontSize = 42
      const currentFontSize = startFontSize + (endFontSize - startFontSize) * moveProgress
      
      ctx.font = `900 ${Math.round(currentFontSize)}px "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = theme.textPrimary
      ctx.shadowColor = theme.glowColor
      ctx.shadowBlur = 20
      ctx.fillText(title, cw / 2, currentY)
      ctx.shadowBlur = 0
    }
    
    // 稳定在顶部
    else {
      ctx.font = '900 42px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = theme.textPrimary
      ctx.shadowColor = theme.glowColor
      ctx.shadowBlur = 15
      ctx.fillText(title, cw / 2, 90)
      ctx.shadowBlur = 0
      
      // 标题下装饰线
      const lineWidth = Math.min(400, ctx.measureText(title).width + 60)
      ctx.strokeStyle = theme.accent
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cw / 2 - lineWidth / 2, 130)
      ctx.lineTo(cw / 2 + lineWidth / 2, 130)
      ctx.stroke()
    }
  }
  
  // ============================================================
  // 绘制内容卡片
  // ============================================================
  drawContent(t) {
    const { ctx, cw, ch, theme, timeline, data } = this
    const points = data.points || []
    
    if (t < timeline.contentStart) return
    
    const itemWidth = cw - 80
    const itemHeight = 140
    const itemGap = 20
    const startY = 180
    
    points.forEach((point, index) => {
      const itemStart = timeline.contentStart + index * timeline.contentItemDuration
      const itemEnd = itemStart + timeline.contentItemDuration
      
      if (t < itemStart) return
      
      // 入场动画
      let alpha = 1
      let offsetY = 0
      let scale = 1
      
      if (t < itemStart + 400) {
        // 入场：从下往上滑入
        const progress = easeOutCubic((t - itemStart) / 400)
        offsetY = (1 - progress) * 50
        alpha = progress
        scale = 0.95 + progress * 0.05
      }
      
      const y = startY + index * (itemHeight + itemGap) + offsetY
      
      ctx.save()
      ctx.globalAlpha = alpha
      
      // 卡片背景（玻璃态）
      const cardX = 40
      roundedRect(ctx, cardX, y, itemWidth, itemHeight, 12)
      ctx.fillStyle = theme.cardBg
      ctx.fill()
      ctx.strokeStyle = theme.cardBorder
      ctx.lineWidth = 1
      ctx.stroke()
      
      // 序号圆圈
      const numX = cardX + 45
      const numY = y + itemHeight / 2
      const numR = 28
      
      ctx.beginPath()
      ctx.arc(numX, numY, numR, 0, Math.PI * 2)
      ctx.fillStyle = theme.accent
      ctx.shadowColor = theme.glowColor
      ctx.shadowBlur = 15
      ctx.fill()
      ctx.shadowBlur = 0
      
      // 序号数字
      ctx.fillStyle = '#ffffff'
      ctx.font = '900 28px "PingFang SC", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(index + 1), numX, numY)
      
      // 核心观点（大字）
      const insight = point.label || point.kw || ''
      ctx.fillStyle = theme.textPrimary
      ctx.font = '800 32px "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(insight.slice(0, 12), cardX + 90, y + 45)
      
      // 解释说明（小字）
      const desc = point.desc || point.short || ''
      ctx.fillStyle = theme.textSecondary
      ctx.font = '400 24px "PingFang SC", sans-serif'
      ctx.fillText(desc.slice(0, 35), cardX + 90, y + 95)
      
      ctx.restore()
    })
  }
  
  // ============================================================
  // 绘制结束画面
  // ============================================================
  drawEnding(t) {
    const { ctx, cw, ch, theme, timeline } = this
    
    if (t < timeline.contentEnd) return
    
    const settleProgress = Math.min(1, (t - timeline.contentEnd) / 2000)
    
    // 淡出效果
    ctx.save()
    ctx.globalAlpha = settleProgress * 0.3
    ctx.fillStyle = theme.background[0]
    ctx.fillRect(0, 0, cw, ch)
    ctx.restore()
  }
  
  // ============================================================
  // 主绘制循环
  // ============================================================
  draw(timestamp) {
    if (!this.startTime) this.startTime = timestamp
    const t = timestamp - this.startTime
    
    const { ctx, cw, ch, timeline } = this
    
    // 清空画布
    ctx.clearRect(0, 0, cw, ch)
    
    // 按顺序绘制
    this.drawBackground(t)
    this.drawWatermark()
    this.drawTitle(t)
    this.drawContent(t)
    this.drawEnding(t)
    
    // 进度回调
    const progress = Math.min(100, Math.round(t / timeline.total * 100))
    if (this.onProgress) this.onProgress(progress)
    
    // 检查是否结束
    if (t >= timeline.total) {
      if (this.onDone) this.onDone()
      return
    }
    
    // 继续动画
    this.animId = requestAnimationFrame(ts => this.draw(ts))
  }
  
  start() {
    this.animId = requestAnimationFrame(ts => this.draw(ts))
  }
  
  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId)
    }
  }
}

// ============================================================
// 主组件
// ============================================================
export default function VideoGenerator({ data, theme = 'deep-space', onClose, onProgress, onDone }) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const recorderRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [progress, setProgress] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState(null)
  const [mp4Blob, setMp4Blob] = useState(null)
  const [converting, setConverting] = useState(false)
  
  const currentTheme = THEMES[theme] || THEMES['deep-space']
  
  const startAnimation = useCallback((record = false) => {
    const canvas = canvasRef.current
    if (!canvas || !data) return
    
    // 设置画布尺寸（9:16竖屏）
    canvas.width = 1080
    canvas.height = 1920
    
    const engine = new AnimationEngine(canvas, data, theme)
    engineRef.current = engine
    
    engine.onProgress = (p) => {
      setProgress(p)
      if (onProgress) onProgress(p)
    }
    
    engine.onDone = () => {
      setIsPlaying(false)
      if (record && recorderRef.current) {
        recorderRef.current.stop()
      } else {
        if (onDone) onDone()
      }
    }
    
    // 开始录制（如果需要）
    if (record) {
      const stream = canvas.captureStream(30)
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? 'video/webm;codecs=vp9' 
        : 'video/webm'
      const recorder = new MediaRecorder(stream, { mimeType })
      const chunks = []
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: mimeType })
        setRecordedBlob(blob)
        setIsRecording(false)
        if (onDone) onDone()
      }
      
      recorderRef.current = recorder
      recorder.start(100)
      setIsRecording(true)
    }
    
    engine.start()
    setIsPlaying(true)
  }, [data, theme, onProgress, onDone])
  
  const stopAnimation = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop()
    }
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    setIsPlaying(false)
    setIsRecording(false)
  }, [])
  
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.stop()
      }
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop()
      }
    }
  }, [])
  
  if (!data) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 400,
        background: '#0a0a0f',
        borderRadius: 12,
        color: 'rgba(255,255,255,0.4)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
        <div>等待内容输入...</div>
      </div>
    )
  }
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
    }}>
      {/* 主题选择 */}
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 10,
      }}>
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => {
              if (engineRef.current) {
                engineRef.current.theme = t
              }
            }}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: `1px solid ${t.accent}`,
              background: theme === key ? `${t.accent}20` : 'transparent',
              color: t.accent,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t.name}
          </button>
        ))}
      </div>
      
      {/* 画布 */}
      <div style={{
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      }}>
        <canvas
          ref={canvasRef}
          width={1080}
          height={1920}
          style={{
            display: 'block',
            width: 360,
            height: 640,
            background: '#0a0a0f',
          }}
        />
        
        {/* 进度条 */}
        {isPlaying && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'rgba(255,255,255,0.1)',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: currentTheme.accent,
              transition: 'width 0.1s',
            }} />
          </div>
        )}
      </div>
      
      {/* 控制按钮 */}
      <div style={{ display: 'flex', gap: 12 }}>
        {!recordedBlob ? (
          <>
            <button
              onClick={() => startAnimation(false)}
              style={{
                padding: '12px 32px',
                borderRadius: 24,
                border: 'none',
                background: currentTheme.accent,
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                cursor: isPlaying && !isRecording ? 'default' : 'pointer',
                boxShadow: `0 4px 20px ${currentTheme.glowColor}`,
              }}
            >
              {isPlaying ? '播放中...' : '预览动画'}
            </button>
            <button
              onClick={() => startAnimation(true)}
              disabled={isRecording}
              style={{
                padding: '12px 32px',
                borderRadius: 24,
                border: `1px solid ${currentTheme.accent}`,
                background: 'transparent',
                color: currentTheme.accent,
                fontSize: 15,
                fontWeight: 600,
                cursor: isRecording ? 'not-allowed' : 'pointer',
                opacity: isRecording ? 0.5 : 1,
              }}
            >
              {isRecording ? '录制中...' : '录制视频'}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                const url = URL.createObjectURL(mp4Blob || recordedBlob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${(data?.title || '视频').slice(0, 10)}_视频.mp4`
                a.click()
                URL.revokeObjectURL(url)
              }}
              style={{
                padding: '12px 32px',
                borderRadius: 24,
                border: 'none',
                background: '#10b981',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
              }}
            >
              下载视频
            </button>
            <button
              onClick={() => {
                setRecordedBlob(null)
                setMp4Blob(null)
              }}
              style={{
                padding: '12px 24px',
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 15,
                cursor: 'pointer',
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
              padding: '12px 24px',
              borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            关闭
          </button>
        )}
      </div>
      
      {/* 说明 */}
      <div style={{
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
      }}>
        1080×1920 · 9:16竖屏 · 适用于抖音/视频号/小红书
      </div>
    </div>
  )
}
