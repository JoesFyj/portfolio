/**
 * CyberRenderer - 赛博水墨元素绘制器
 * 包含霓虹灯笼、电子水墨纹理、数字经络线条等元素
 */

export class CyberRenderer {
  constructor(ctx, width, height) {
    this.ctx = ctx
    this.width = width
    this.height = height
  }

  // ============================================================
  // 赛博灯笼
  // ============================================================
  drawNeonLantern(x, y, size, progress = 1, glowColor = '#00fff7') {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = progress

    // 发光效果
    ctx.shadowColor = glowColor
    ctx.shadowBlur = size * 0.5 * progress

    // 灯笼主体（霓虹矩形）
    const lanternW = size * 0.8
    const lanternH = size * 1.2
    ctx.strokeStyle = glowColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(x - lanternW / 2, y - lanternH / 2, lanternW, lanternH, size * 0.1)
    ctx.stroke()

    // 内部横线（模拟灯笼骨架）
    ctx.lineWidth = 1
    for (let i = 1; i < 4; i++) {
      const lineY = y - lanternH / 2 + (lanternH * i) / 4
      ctx.beginPath()
      ctx.moveTo(x - lanternW / 2 + 4, lineY)
      ctx.lineTo(x + lanternW / 2 - 4, lineY)
      ctx.stroke()
    }

    // 顶部装饰
    ctx.beginPath()
    ctx.moveTo(x - size * 0.15, y - lanternH / 2)
    ctx.lineTo(x, y - lanternH / 2 - size * 0.3)
    ctx.lineTo(x + size * 0.15, y - lanternH / 2)
    ctx.stroke()

    // 底部流苏（霓虹线条）
    ctx.beginPath()
    ctx.moveTo(x, y + lanternH / 2)
    ctx.lineTo(x, y + lanternH / 2 + size * 0.3)
    ctx.stroke()

    ctx.restore()
  }

  // ============================================================
  // 电子水墨纹理
  // ============================================================
  drawElectronicInk(x, y, size, progress = 1) {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = progress * 0.6

    // 生成随机墨迹点
    const points = []
    for (let i = 0; i < 20; i++) {
      points.push({
        x: x + (Math.random() - 0.5) * size,
        y: y + (Math.random() - 0.5) * size,
        r: Math.random() * size * 0.15 + size * 0.05,
      })
    }

    // 绘制墨点
    points.forEach((p, i) => {
      const alpha = progress * (0.3 + Math.random() * 0.4)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * progress, 0, Math.PI * 2)
      ctx.fillStyle = i % 3 === 0 ? '#00fff7' : i % 3 === 1 ? '#ff2d55' : '#ffd700'
      ctx.globalAlpha = alpha
      ctx.fill()
    })

    ctx.restore()
  }

  // ============================================================
  // 数字经络线条
  // ============================================================
  drawDigitalMeridian(x, y, length, angle, progress = 1, color = '#00fff7') {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = progress * 0.5

    // 主线条
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(
      x + Math.cos(angle) * length * progress,
      y + Math.sin(angle) * length * progress
    )
    ctx.stroke()
    ctx.setLineDash([])

    // 节点
    const nodeCount = 3
    for (let i = 0; i < nodeCount; i++) {
      const nodeProgress = Math.max(0, progress - i * 0.2)
      if (nodeProgress > 0) {
        const nx = x + (Math.cos(angle) * length * (i + 1)) / (nodeCount + 1)
        const ny = y + (Math.sin(angle) * length * (i + 1)) / (nodeCount + 1)
        ctx.beginPath()
        ctx.arc(nx, ny, 3 * nodeProgress, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = progress * 0.8
        ctx.fill()
      }
    }

    ctx.restore()
  }

  // ============================================================
  // 扫描线
  // ============================================================
  drawScanLine(y, width, progress = 1, color = '#00fff7') {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = progress * 0.8

    // 扫描线渐变
    const grad = ctx.createLinearGradient(0, 0, width, 0)
    grad.addColorStop(0, 'transparent')
    grad.addColorStop(0.2, color)
    grad.addColorStop(0.5, color)
    grad.addColorStop(0.8, color)
    grad.addColorStop(1, 'transparent')

    ctx.fillStyle = grad
    ctx.fillRect(0, y - 1, width, 2)

    ctx.restore()
  }

  // ============================================================
  // 霓虹粒子
  // ============================================================
  drawNeonParticle(x, y, radius, color, progress = 1) {
    const ctx = this.ctx
    ctx.save()

    // 外发光
    ctx.shadowColor = color
    ctx.shadowBlur = radius * 2 * progress
    ctx.beginPath()
    ctx.arc(x, y, radius * progress, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.globalAlpha = progress * 0.8
    ctx.fill()

    // 核心亮点
    ctx.beginPath()
    ctx.arc(x, y, radius * 0.4 * progress, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.globalAlpha = progress
    ctx.fill()

    ctx.restore()
  }

  // ============================================================
  // 全息扫描边框
  // ============================================================
  drawHoloBorder(width, height, progress = 1) {
    const ctx = this.ctx
    ctx.save()

    const margin = 20
    const dashLen = 30
    const gapLen = 15

    ctx.strokeStyle = '#00fff7'
    ctx.lineWidth = 1
    ctx.globalAlpha = progress * 0.6
    ctx.setLineDash([dashLen, gapLen])

    // 移动的扫描线效果
    const offset = (Date.now() / 50) % (dashLen + gapLen)

    // 边框
    ctx.beginPath()
    ctx.rect(margin, margin, width - margin * 2, height - margin * 2)
    ctx.stroke()

    // 四角装饰
    const cornerSize = 30
    ctx.setLineDash([])
    ctx.lineWidth = 2
    ctx.globalAlpha = progress

    // 左上角
    ctx.beginPath()
    ctx.moveTo(margin, margin + cornerSize)
    ctx.lineTo(margin, margin)
    ctx.lineTo(margin + cornerSize, margin)
    ctx.stroke()

    // 右上角
    ctx.beginPath()
    ctx.moveTo(width - margin - cornerSize, margin)
    ctx.lineTo(width - margin, margin)
    ctx.lineTo(width - margin, margin + cornerSize)
    ctx.stroke()

    // 左下角
    ctx.beginPath()
    ctx.moveTo(margin, height - margin - cornerSize)
    ctx.lineTo(margin, height - margin)
    ctx.lineTo(margin + cornerSize, height - margin)
    ctx.stroke()

    // 右下角
    ctx.beginPath()
    ctx.moveTo(width - margin - cornerSize, height - margin)
    ctx.lineTo(width - margin, height - margin)
    ctx.lineTo(width - margin, height - margin - cornerSize)
    ctx.stroke()

    ctx.restore()
  }

  // ============================================================
  // 水墨晕染效果
  // ============================================================
  drawInkSpread(x, y, maxRadius, progress = 1, color = '#00fff7') {
    const ctx = this.ctx
    ctx.save()

    const radius = maxRadius * progress

    // 外圈晕染
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
    grad.addColorStop(0, color)
    grad.addColorStop(0.5, color + '80')
    grad.addColorStop(1, 'transparent')

    ctx.fillStyle = grad
    ctx.globalAlpha = progress * 0.6
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }
}
