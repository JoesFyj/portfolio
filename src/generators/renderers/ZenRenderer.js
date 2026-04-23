/**
 * ZenRenderer - 禅意极简元素绘制器
 * 包含极简禅意线条、印章、水墨纹理等元素
 */

export class ZenRenderer {
  constructor(ctx, width, height) {
    this.ctx = ctx
    this.width = width
    this.height = height
  }

  // ============================================================
  // 极简禅意线条（如意/枯枝/日式庭院）
  // ============================================================
  drawZenLine(x, y, length, angle, progress = 1, color = '#2c2c2c') {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = progress * 0.3
    ctx.strokeStyle = color
    ctx.lineWidth = 0.5
    ctx.setLineDash([3, 6])

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(
      x + Math.cos(angle) * length * progress,
      y + Math.sin(angle) * length * progress
    )
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()
  }

  // ============================================================
  // 单字印章
  // ============================================================
  drawSeal(text, x, y, size, progress = 1, color = '#2c2c2c') {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = progress * 0.6

    // 印章边框
    const sealSize = size * 1.5
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.rect(x - sealSize / 2, y - sealSize / 2, sealSize, sealSize)
    ctx.stroke()

    // 印章文字
    const fontSize = size
    ctx.font = `700 ${fontSize}px "KaiTi", "STKaiti", serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.fillText(text, x, y)

    ctx.restore()
  }

  // ============================================================
  // 水墨纹理（极简）
  // ============================================================
  drawZenInkTexture(x, y, size, progress = 1) {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = progress * 0.15

    // 淡淡的水墨晕染
    const grad = ctx.createRadialGradient(x, y, 0, x, y, size)
    grad.addColorStop(0, '#2c2c2c')
    grad.addColorStop(0.5, '#9b9b9b40')
    grad.addColorStop(1, 'transparent')

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, size * progress, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  // ============================================================
  // 呼吸光环
  // ============================================================
  drawBreathingCircle(x, y, maxRadius, progress = 1, color = '#2c2c2c') {
    const ctx = this.ctx
    // 呼吸效果：sin波动的透明度
    const breathAlpha = 0.3 + 0.3 * Math.sin(progress * Math.PI * 2)
    const breathScale = 0.9 + 0.1 * Math.sin(progress * Math.PI * 2)

    ctx.save()
    ctx.globalAlpha = breathAlpha

    // 外圈
    ctx.strokeStyle = color
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.arc(x, y, maxRadius * breathScale, 0, Math.PI * 2)
    ctx.stroke()

    // 内圈
    ctx.globalAlpha = breathAlpha * 0.5
    ctx.beginPath()
    ctx.arc(x, y, maxRadius * 0.6 * breathScale, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
  }

  // ============================================================
  // 涟漪扩散
  // ============================================================
  drawRipple(x, y, maxRadius, progress = 1, color = '#2c2c2c') {
    const ctx = this.ctx
    // 涟漪淡出
    const rippleAlpha = (1 - progress) * 0.4

    ctx.save()
    ctx.globalAlpha = rippleAlpha
    ctx.strokeStyle = color
    ctx.lineWidth = 0.5

    // 多层涟漪
    for (let i = 0; i < 3; i++) {
      const ringProgress = Math.max(0, progress - i * 0.15)
      const ringRadius = maxRadius * ringProgress
      ctx.beginPath()
      ctx.arc(x, y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.restore()
  }

  // ============================================================
  // 单线卡片装饰
  // ============================================================
  drawSingleLineDecor(x, y, w, h, progress = 1) {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = progress * 0.2
    ctx.strokeStyle = '#2c2c2c'
    ctx.lineWidth = 0.5

    // 极简角落装饰
    const cornerLen = Math.min(w, h) * 0.15

    // 左上角
    ctx.beginPath()
    ctx.moveTo(x, y + cornerLen)
    ctx.lineTo(x, y)
    ctx.lineTo(x + cornerLen, y)
    ctx.stroke()

    // 右下角
    ctx.beginPath()
    ctx.moveTo(x + w - cornerLen, y + h)
    ctx.lineTo(x + w, y + h)
    ctx.lineTo(x + w, y + h - cornerLen)
    ctx.stroke()

    ctx.restore()
  }

  // ============================================================
  // 书写笔触
  // ============================================================
  drawBrushLine(x1, y1, x2, y2, progress = 1, color = '#2c2c2c') {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = progress * 0.6
    ctx.strokeStyle = color
    ctx.lineWidth = 0.8
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(
      x1 + (x2 - x1) * progress,
      y1 + (y2 - y1) * progress
    )
    ctx.stroke()
    ctx.restore()
  }
}
