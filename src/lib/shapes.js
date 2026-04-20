// ============================================================
// 形状选项配置（24种 · 中国传统文化主题）
// ============================================================

export const SHAPE_GROUPS = ['自然', '纹样', '瑞兽', '器物', '几何']

export const SHAPE_OPTIONS = [
  // --- 自然组 ---
  { id: 0,  group: '自然', label: '水墨山水' },
  { id: 1,  group: '自然', label: '锦鲤波浪' },
  { id: 2,  group: '自然', label: '竹石图'   },
  { id: 3,  group: '自然', label: '仙鹤云纹' },
  { id: 4,  group: '自然', label: '荷花蜻蜓' },
  // --- 纹样组 ---
  { id: 5,  group: '纹样', label: '祥云瑞气' },
  { id: 6,  group: '纹样', label: '太极八卦' },
  { id: 7,  group: '纹样', label: '万字纹'   },
  { id: 8,  group: '纹样', label: '回纹边框' },
  { id: 9,  group: '纹样', label: '冰裂纹'   },
  { id: 10, group: '纹样', label: '盘长结'   },
  // --- 瑞兽组 ---
  { id: 11, group: '瑞兽', label: '龙纹'     },
  { id: 12, group: '瑞兽', label: '京剧脸谱' },
  { id: 13, group: '瑞兽', label: '金蟾'     },
  { id: 14, group: '瑞兽', label: '喜鹊登梅' },
  // --- 器物组 ---
  { id: 15, group: '器物', label: '古琴'     },
  { id: 16, group: '器物', label: '瓦当纹'   },
  { id: 17, group: '器物', label: '灯笼纹'   },
  { id: 18, group: '器物', label: '玉如意'   },
  // --- 几何组 ---
  { id: 19, group: '几何', label: '铜钱纹'   },
  { id: 20, group: '几何', label: '窗花剪纸' },
  { id: 21, group: '几何', label: '玉佩纹'   },
  { id: 22, group: '几何', label: '天圆地方' },
  { id: 23, group: '几何', label: '八卦阵'   },
]

// 配色方案
export const COLOR_SCHEMES = [
  { id: 'ink',      label: '水墨',      colors: ['#4a4a4a', '#8b8b8b', '#c0c0c0'] },
  { id: 'cinnabar', label: '朱砂',      colors: ['#c0392b', '#e74c3c', '#f39c12'] },
  { id: 'jade',     label: '玉色',      colors: ['#16a085', '#1abc9c', '#27ae60'] },
  { id: 'gold',     label: '鎏金',      colors: ['#d4a017', '#f0c040', '#8b6914'] },
  { id: 'porcelain',label: '青花',      colors: ['#2c3e50', '#2980b9', '#ecf0f1'] },
]

export const BORDER_WIDTHS = [
  { id: 1, label: '1px' },
  { id: 2, label: '2px' },
  { id: 3, label: '3px' },
  { id: 4, label: '4px' },
]

export const LINE_WIDTHS = [
  { id: 1, label: '细' },
  { id: 2, label: '中' },
  { id: 3, label: '粗' },
  { id: 4, label: '特粗' },
]

export const DEFAULT_STYLE = {
  borderWidth: 4,
  lineWidth: 3,
  colorScheme: 'cinnabar',
}

export function getColors(scheme) {
  return COLOR_SCHEMES.find(s => s.id === scheme)?.colors ?? ['#c0392b', '#e74c3c', '#f39c12']
}

// ============================================================
// 24种形状绘制函数
// ============================================================

// --- 自然组 ---

// 0 水墨山水
function drawInkMountains(ctx, x, y, w, h, lw, colors) {
  const [c1, c2, c3] = colors
  // 三层山
  const mountains = [
    { pts: [[0.1,1],[0.3,0.2],[0.5,0.55],[0.7,0.15],[0.9,1]], alpha: 0.9, color: c1 },
    { pts: [[0,1],[0.15,0.5],[0.35,0.7],[0.55,0.35],[0.75,0.6],[1,1]], alpha: 0.7, color: c2 },
    { pts: [[0,1],[0.2,0.6],[0.4,0.75],[0.6,0.55],[0.8,0.7],[1,1]], alpha: 0.5, color: c3 },
  ]
  mountains.forEach(({ pts, alpha, color }) => {
    ctx.globalAlpha = alpha
    const mapped = pts.map(([px, py]) => [x + px * w, y + py * h])
    ctx.beginPath()
    ctx.moveTo(mapped[0][0], mapped[0][1])
    for (let i = 1; i < mapped.length - 1; i++) {
      const mx = (mapped[i][0] + mapped[i + 1][0]) / 2
      const my = (mapped[i][1] + mapped[i + 1][1]) / 2
      ctx.quadraticCurveTo(mapped[i][0], mapped[i][1], mx, my)
    }
    ctx.lineTo(mapped[mapped.length - 1][0], mapped[mapped.length - 1][1])
    ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath()
    ctx.fillStyle = color + '30'; ctx.fill()
    ctx.strokeStyle = color; ctx.lineWidth = lw * 1.2; ctx.stroke()
  })
  // 云雾
  for (let i = 0; i < 3; i++) {
    const cx2 = x + (0.3 + i * 0.2) * w, cy2 = y + (0.55 + i * 0.05) * h
    const rx = w * 0.08, ry = h * 0.025
    ctx.globalAlpha = 0.25
    ctx.beginPath(); ctx.ellipse(cx2, cy2, rx, ry, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'; ctx.fill()
  }
  ctx.globalAlpha = 1
}

// 1 锦鲤波浪
function drawKoiFish(ctx, x, y, w, h, lw, colors) {
  const [c1, c2, c3] = colors
  // 水波
  for (let b = 0; b < 5; b++) {
    const yOff = y + h * (0.5 + b * 0.1)
    const amp = h * (0.03 + b * 0.01)
    const freq = 2 + b * 0.3
    ctx.globalAlpha = 0.3 - b * 0.04
    ctx.beginPath(); ctx.moveTo(x, yOff)
    for (let i = 1; i <= 40; i++) {
      const px = x + (i / 40) * w
      const py = yOff - Math.sin((i / 40) * freq * Math.PI) * amp
      ctx.lineTo(px, py)
    }
    ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.7; ctx.stroke()
  }
  ctx.globalAlpha = 1
  // 锦鲤1
  const fishY = y + h * 0.38, fishX = x + w * 0.32
  const fishLen = w * 0.28, fishH2 = h * 0.09
  ctx.beginPath(); ctx.moveTo(fishX - fishLen * 0.5, fishY)
  ctx.quadraticCurveTo(fishX, fishY - fishH2, fishX + fishLen * 0.5, fishY)
  ctx.quadraticCurveTo(fishX, fishY + fishH2, fishX - fishLen * 0.5, fishY)
  const fg = ctx.createLinearGradient(fishX - fishLen, fishY - fishH2, fishX - fishLen, fishY + fishH2)
  fg.addColorStop(0, c1); fg.addColorStop(0.5, c2); fg.addColorStop(1, c3)
  ctx.fillStyle = fg; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1
  ctx.strokeStyle = c1; ctx.lineWidth = lw; ctx.stroke()
  // 鱼尾
  ctx.beginPath(); ctx.moveTo(fishX - fishLen * 0.5, fishY)
  ctx.quadraticCurveTo(fishX - fishLen * 0.8, fishY - fishH2 * 0.8, fishX - fishLen * 0.85, fishY - fishH2 * 0.3)
  ctx.quadraticCurveTo(fishX - fishLen * 0.7, fishY, fishX - fishLen * 0.85, fishY + fishH2 * 0.3)
  ctx.quadraticCurveTo(fishX - fishLen * 0.8, fishY + fishH2 * 0.8, fishX - fishLen * 0.5, fishY)
  ctx.fillStyle = c3; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1
  // 锦鲤2
  const fish2Y = y + h * 0.6, fish2X = x + w * 0.6
  ctx.beginPath(); ctx.moveTo(fish2X - fishLen * 0.4, fish2Y)
  ctx.quadraticCurveTo(fish2X, fish2Y - fishH2 * 0.9, fish2X + fishLen * 0.4, fish2Y)
  ctx.quadraticCurveTo(fish2X, fish2Y + fishH2 * 0.9, fish2X - fishLen * 0.4, fish2Y)
  const fg2 = ctx.createLinearGradient(fish2X, fish2Y - fishH2, fish2X, fish2Y + fishH2)
  fg2.addColorStop(0, c3); fg2.addColorStop(1, c1)
  ctx.fillStyle = fg2; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1
  ctx.strokeStyle = c3; ctx.lineWidth = lw; ctx.stroke()
}

// 2 竹石图
function drawBambooRock(ctx, x, y, w, h, lw, colors) {
  const [c1, c2, c3] = colors
  // 石头
  ctx.beginPath()
  ctx.moveTo(x + w * 0.55, y + h)
  ctx.quadraticCurveTo(x + w * 0.9, y + h * 0.55, x + w * 0.65, y + h * 0.32)
  ctx.quadraticCurveTo(x + w * 0.42, y + h * 0.22, x + w * 0.28, y + h * 0.45)
  ctx.quadraticCurveTo(x + w * 0.15, y + h * 0.7, x + w * 0.35, y + h)
  ctx.closePath()
  ctx.fillStyle = c2 + '40'; ctx.fill()
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 竹竿
  const joints = 5
  const offsets = [0, -w * 0.1, w * 0.08]
  offsets.forEach((ox, si) => {
    const bx = x + w * (0.28 + si * 0.12)
    const topY = y + h * 0.1, botY = y + h * 0.92
    ctx.beginPath(); ctx.moveTo(bx, topY); ctx.lineTo(bx, botY)
    ctx.strokeStyle = c1; ctx.lineWidth = lw * (si === 1 ? 1.5 : 1.2); ctx.stroke()
    for (let j = 1; j < joints; j++) {
      const jy = topY + (botY - topY) * (j / joints)
      ctx.beginPath(); ctx.moveTo(bx - w * 0.025, jy); ctx.lineTo(bx + w * 0.025, jy)
      ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.7; ctx.stroke()
    }
    // 竹叶
    const leafY = topY + (botY - topY) * (0.3 + si * 0.15)
    const leafDir = si === 1 ? -1 : 1
    for (let l = 0; l < 3; l++) {
      const angle = leafDir * (0.3 + l * 0.4) * Math.PI
      const lx = bx + Math.cos(angle) * w * (0.06 + l * 0.03)
      const ly = leafY + Math.sin(angle) * h * 0.04
      ctx.beginPath(); ctx.moveTo(bx, leafY)
      ctx.quadraticCurveTo((bx + lx) / 2, leafY - h * 0.04, lx, ly)
      ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.8; ctx.stroke()
    }
  })
}

// 3 仙鹤云纹
function drawCraneCloud(ctx, x, y, w, h, lw, colors) {
  const [c1, c2, c3] = colors
  // 云
  for (let ci = 0; ci < 3; ci++) {
    const cx2 = x + (0.15 + ci * 0.35) * w, cy2 = y + h * (0.2 + ci * 0.1)
    ctx.globalAlpha = 0.2 + ci * 0.05
    for (let b = 0; b < 3; b++) {
      ctx.beginPath(); ctx.ellipse(cx2 + b * w * 0.05, cy2, w * (0.06 - b * 0.01), h * 0.025, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'; ctx.fill()
    }
  }
  ctx.globalAlpha = 1
  // 鹤
  const cx2 = x + w * 0.5, cy2 = y + h * 0.45
  const s = Math.min(w, h) * 0.32
  // 鹤身
  ctx.beginPath(); ctx.ellipse(cx2, cy2, s * 0.5, s * 0.22, -0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw; ctx.stroke()
  // 长脖子
  ctx.beginPath(); ctx.moveTo(cx2 + s * 0.3, cy2 - s * 0.1)
  ctx.quadraticCurveTo(cx2 + s * 0.5, cy2 - s * 0.35, cx2 + s * 0.45, cy2 - s * 0.55)
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 头
  ctx.beginPath(); ctx.arc(cx2 + s * 0.45, cy2 - s * 0.58, s * 0.06, 0, Math.PI * 2)
  ctx.fillStyle = '#c0392b'; ctx.fill()
  // 腿
  ctx.beginPath(); ctx.moveTo(cx2 + s * 0.1, cy2 + s * 0.2); ctx.lineTo(cx2 + s * 0.05, cy2 + s * 0.55)
  ctx.moveTo(cx2 + s * 0.2, cy2 + s * 0.2); ctx.lineTo(cx2 + s * 0.18, cy2 + s * 0.55)
  ctx.strokeStyle = c1; ctx.lineWidth = lw; ctx.stroke()
  // 翅膀
  ctx.beginPath(); ctx.moveTo(cx2 - s * 0.1, cy2)
  ctx.quadraticCurveTo(cx2 - s * 0.5, cy2 - s * 0.15, cx2 - s * 0.55, cy2 + s * 0.05)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.2; ctx.stroke()
}

// 4 荷花蜻蜓
function drawLotusDragonfly(ctx, x, y, w, h, lw, colors) {
  const [c1, c2, c3] = colors
  const cx2 = x + w / 2, cy2 = y + h * 0.55, cw2 = w * 0.4, ch2 = h * 0.38
  // 水面
  ctx.globalAlpha = 0.2; ctx.fillStyle = c1; ctx.fillRect(x, cy2 + ch2 * 0.3, w, h * 0.15); ctx.globalAlpha = 1
  // 外层花瓣
  for (let p = 0; p < 6; p++) {
    const angle = (p / 6) * Math.PI * 2
    const px = cx2 + Math.cos(angle) * cw2 * 0.6, py = cy2 + Math.sin(angle) * ch2 * 0.6
    ctx.beginPath()
    ctx.ellipse(px, py, cw2 * 0.3, ch2 * 0.15, angle, 0, Math.PI * 2)
    ctx.fillStyle = c1 + 'aa'; ctx.fill()
    ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.7; ctx.stroke()
  }
  // 内层花瓣
  for (let p = 0; p < 5; p++) {
    const angle = (p / 5) * Math.PI * 2 + Math.PI / 5
    const px = cx2 + Math.cos(angle) * cw2 * 0.3, py = cy2 + Math.sin(angle) * ch2 * 0.3
    ctx.beginPath()
    ctx.ellipse(px, py, cw2 * 0.2, ch2 * 0.1, angle, 0, Math.PI * 2)
    ctx.fillStyle = c2 + 'cc'; ctx.fill()
    ctx.strokeStyle = c2; ctx.lineWidth = lw * 0.5; ctx.stroke()
  }
  // 莲蓬
  ctx.beginPath(); ctx.arc(cx2, cy2, cw2 * 0.12, 0, Math.PI * 2)
  ctx.fillStyle = c3; ctx.fill(); ctx.strokeStyle = c2; ctx.lineWidth = lw; ctx.stroke()
  // 茎
  ctx.beginPath(); ctx.moveTo(cx2, cy2 + ch2 * 0.35); ctx.quadraticCurveTo(cx2 + w * 0.05, cy2 + ch2 * 0.7, cx2 - w * 0.05, y + h * 0.95)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.2; ctx.stroke()
  // 蜻蜓
  const dx = x + w * 0.72, dy = y + h * 0.3
  ctx.beginPath(); ctx.ellipse(dx, dy, w * 0.025, h * 0.07, 0, 0, Math.PI * 2)
  ctx.fillStyle = c1; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.5; ctx.stroke()
  ;[-1, 1].forEach(side => {
    ctx.beginPath(); ctx.ellipse(dx, dy, w * 0.09, h * 0.025, side * 0.3, 0, Math.PI * 2)
    ctx.fillStyle = c2 + '60'; ctx.fill(); ctx.strokeStyle = c2; ctx.lineWidth = lw * 0.4; ctx.stroke()
  })
}

// --- 纹样组 ---

// 5 祥云瑞气
function drawAuspiciousCloud(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const drawCloud = (cx2, cy2, rx, ry) => {
    ctx.beginPath(); ctx.ellipse(cx2, cy2, rx, ry * 0.8, 0, 0, Math.PI * 2)
    ctx.beginPath(); ctx.ellipse(cx2 - rx * 0.5, cy2 + ry * 0.1, rx * 0.6, ry * 0.6, 0, 0, Math.PI * 2)
    ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.ellipse(cx2 + rx * 0.5, cy2 + ry * 0.1, rx * 0.6, ry * 0.6, 0, 0, Math.PI * 2)
    ctx.fill(); ctx.stroke()
  }
  const clouds = [
    { cx: x + w * 0.5, cy: y + h * 0.25, rx: w * 0.18, ry: h * 0.08, col: c1 },
    { cx: x + w * 0.25, cy: y + h * 0.52, rx: w * 0.13, ry: h * 0.055, col: c2 },
    { cx: x + w * 0.75, cy: y + h * 0.52, rx: w * 0.13, ry: h * 0.055, col: c2 },
    { cx: x + w * 0.5, cy: y + h * 0.75, rx: w * 0.16, ry: h * 0.065, col: c1 },
  ]
  clouds.forEach(({ cx2, cy2, rx, ry, col }) => {
    ctx.save()
    ctx.fillStyle = col + '40'; ctx.strokeStyle = col; ctx.lineWidth = lw
    drawCloud(cx2, cy2, rx, ry)
    ctx.restore()
  })
}

// 6 太极八卦
function drawTaijiBagua(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2, r = Math.min(w, h) * 0.36
  // 半圆
  ctx.beginPath(); ctx.arc(cx2, cy2, r, -Math.PI / 2, Math.PI / 2)
  ctx.fillStyle = c1; ctx.fill()
  ctx.beginPath(); ctx.arc(cx2, cy2, r, Math.PI / 2, -Math.PI / 2)
  ctx.fillStyle = c2; ctx.fill()
  ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 阴阳鱼眼
  ctx.beginPath(); ctx.arc(cx2, cy2 - r * 0.5, r * 0.12, 0, Math.PI * 2)
  ctx.fillStyle = c1; ctx.fill()
  ctx.beginPath(); ctx.arc(cx2, cy2 + r * 0.5, r * 0.12, 0, Math.PI * 2)
  ctx.fillStyle = c2; ctx.fill()
  // 八卦线（外围8条）
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2
    const ox = Math.cos(a) * r * 1.18, oy = Math.sin(a) * r * 1.18
    const isYang = [0, 2, 5, 7].includes(i)
    ctx.save(); ctx.translate(cx2 + ox, cy2 + oy); ctx.rotate(a + Math.PI / 2)
    ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.7
    ctx.beginPath(); ctx.moveTo(-r * 0.1, -r * 0.12); ctx.lineTo(-r * 0.1, r * 0.12); ctx.stroke()
    if (isYang) {
      ctx.beginPath(); ctx.moveTo(r * 0.1, -r * 0.12); ctx.lineTo(r * 0.1, r * 0.12); ctx.stroke()
    } else {
      ctx.beginPath(); ctx.moveTo(r * 0.1, -r * 0.12); ctx.lineTo(r * 0.1, 0); ctx.moveTo(r * 0.1, 0); ctx.lineTo(r * 0.1, r * 0.12); ctx.stroke()
    }
    ctx.restore()
  }
  // 外圈
  ctx.beginPath(); ctx.arc(cx2, cy2, r * 1.3, 0, Math.PI * 2)
  ctx.strokeStyle = c1; ctx.lineWidth = lw; ctx.stroke()
}

// 7 万字纹
function drawSwastika(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2, s = Math.min(w, h) * 0.32
  const thick = s * 0.22
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  // 中心到右上
  ctx.beginPath(); ctx.moveTo(cx2 - s, cy2 - s); ctx.lineTo(cx2 + s, cy2 - s)
  ctx.lineTo(cx2 + s, cy2 - s + thick)
  ctx.moveTo(cx2 + s, cy2 + s); ctx.lineTo(cx2 - s, cy2 + s)
  ctx.lineTo(cx2 - s, cy2 + s - thick)
  // 中心到左下
  ctx.moveTo(cx2 - s, cy2 - s); ctx.lineTo(cx2 - s, cy2 + s)
  ctx.lineTo(cx2 - s + thick, cy2 + s)
  ctx.moveTo(cx2 + s, cy2 - s); ctx.lineTo(cx2 + s, cy2 + s)
  ctx.lineTo(cx2 + s - thick, cy2 + s)
  ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 四个端点L
  ;[[cx2 + s, cy2 - s], [cx2 + s, cy2 + s], [cx2 - s, cy2 + s], [cx2 - s, cy2 - s]].forEach(([px, py]) => {
    const dx = px > cx2 ? 1 : -1, dy = py > cy2 ? 1 : -1
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + dx * thick, py)
    ctx.moveTo(px, py); ctx.lineTo(px, py + dy * thick)
    ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.5; ctx.stroke()
  })
  // 中心
  ctx.beginPath(); ctx.arc(cx2, cy2, thick * 0.5, 0, Math.PI * 2)
  ctx.fillStyle = c1; ctx.fill()
}

// 8 回纹边框
function drawKeyFret(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const cw2 = w * 0.22, ch2 = h * 0.22, thick = Math.min(w, h) * 0.05
  // 横向
  for (let row = 0; row < 2; row++) {
    const yOff = y + h * (0.35 + row * 0.28)
    for (let col = 0; col < 3; col++) {
      const xOff = x + w * (0.15 + col * 0.28)
      ctx.beginPath(); ctx.moveTo(xOff - cw2, yOff - thick); ctx.lineTo(xOff + cw2, yOff - thick)
      ctx.lineTo(xOff + cw2, yOff); ctx.lineTo(xOff - cw2, yOff); ctx.closePath()
      ctx.fillStyle = c1 + '60'; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.6; ctx.stroke()
      ctx.beginPath(); ctx.moveTo(xOff - cw2, yOff); ctx.lineTo(xOff + cw2, yOff)
      ctx.lineTo(xOff + cw2, yOff + thick); ctx.lineTo(xOff - cw2, yOff + thick); ctx.closePath()
      ctx.fillStyle = c2 + '60'; ctx.fill(); ctx.strokeStyle = c2; ctx.lineWidth = lw * 0.6; ctx.stroke()
    }
  }
}

// 9 冰裂纹
function drawIceCrack(ctx, x, y, w, h, lw, colors) {
  const [c1] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2
  const branches = [
    [[cx2, cy2], [cx2 - w * 0.35, cy2 - h * 0.35], [x + w * 0.1, y + h * 0.1]],
    [[cx2, cy2], [cx2 + w * 0.38, cy2 - h * 0.3], [x + w * 0.92, y + h * 0.15]],
    [[cx2, cy2], [cx2 - w * 0.3, cy2 + h * 0.38], [x + w * 0.12, y + h * 0.88]],
    [[cx2, cy2], [cx2 + w * 0.32, cy2 + h * 0.35], [x + w * 0.9, y + h * 0.85]],
    [[cx2, cy2], [cx2, cy2 - h * 0.42], [cx2, y + h * 0.08]],
    [[cx2, cy2], [cx2 - w * 0.42, cy2], [x + w * 0.08, cy2]],
  ]
  branches.forEach(branch => {
    ctx.beginPath(); ctx.moveTo(branch[0][0], branch[0][1])
    for (let i = 1; i < branch.length; i++) {
      const mx = (branch[i - 1][0] + branch[i][0]) / 2
      const my = (branch[i - 1][1] + branch[i][1]) / 2
      ctx.quadraticCurveTo(branch[i - 1][0], branch[i - 1][1], mx, my)
    }
    ctx.quadraticCurveTo(branch[branch.length - 1][0], branch[branch.length - 1][1], branch[branch.length - 1][0], branch[branch.length - 1][1])
    ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.8; ctx.globalAlpha = 0.6; ctx.stroke(); ctx.globalAlpha = 1
  })
  ctx.beginPath(); ctx.arc(cx2, cy2, lw * 2, 0, Math.PI * 2)
  ctx.fillStyle = c1; ctx.fill()
}

// 10 盘长结
function drawEndlessKnot(ctx, x, y, w, h, lw, colors) {
  const [c1, c2, c3] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2, s = Math.min(w, h) * 0.3
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  // 横向8
  ctx.beginPath(); ctx.moveTo(cx2 - s, cy2); ctx.lineTo(cx2 - s * 0.4, cy2)
  ctx.arc(cx2 - s * 0.2, cy2, s * 0.2, Math.PI, 0)
  ctx.arc(cx2 + s * 0.2, cy2, s * 0.2, Math.PI, 0, true)
  ctx.moveTo(cx2 + s * 0.4, cy2); ctx.lineTo(cx2 + s, cy2)
  ctx.strokeStyle = c1; ctx.lineWidth = lw * 2; ctx.stroke()
  // 竖向8
  ctx.beginPath(); ctx.moveTo(cx2, cy2 - s); ctx.lineTo(cx2, cy2 - s * 0.4)
  ctx.arc(cx2, cy2 - s * 0.2, s * 0.2, Math.PI * 0.5, Math.PI * 1.5)
  ctx.arc(cx2, cy2 + s * 0.2, s * 0.2, Math.PI * 1.5, Math.PI * 0.5, true)
  ctx.moveTo(cx2, cy2 + s * 0.4); ctx.lineTo(cx2, cy2 + s)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 2; ctx.stroke()
  // 交叉菱形
  ctx.beginPath()
  ctx.moveTo(cx2 - s * 0.28, cy2 - s * 0.28); ctx.lineTo(cx2 + s * 0.28, cy2 + s * 0.28)
  ctx.moveTo(cx2 + s * 0.28, cy2 - s * 0.28); ctx.lineTo(cx2 - s * 0.28, cy2 + s * 0.28)
  ctx.strokeStyle = c3; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 四角圆点
  ;[[cx2 - s, cy2], [cx2 + s, cy2], [cx2, cy2 - s], [cx2, cy2 + s]].forEach(([px, py]) => {
    ctx.beginPath(); ctx.arc(px, py, lw * 2.5, 0, Math.PI * 2)
    ctx.fillStyle = c1; ctx.fill()
  })
}

// --- 瑞兽组 ---

// 11 龙纹
function drawDragon(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2, s = Math.min(w, h) * 0.32
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  // 龙身（S形曲线）
  ctx.beginPath()
  ctx.moveTo(x + w * 0.8, cy2 + s * 0.2)
  ctx.quadraticCurveTo(x + w * 0.6, cy2 - s * 0.5, cx2, cy2 - s * 0.3)
  ctx.quadraticCurveTo(x + w * 0.35, cy2 - s * 0.1, cx2 - s * 0.2, cy2 + s * 0.4)
  ctx.quadraticCurveTo(x + w * 0.15, cy2 + s * 0.7, x + w * 0.05, cy2 + s * 0.3)
  ctx.strokeStyle = c1; ctx.lineWidth = lw * 2.5; ctx.stroke()
  // 龙鳞（小弧线沿着曲线）
  for (let i = 0; i < 6; i++) {
    const t = i / 5
    const bx = x + w * 0.8 - t * w * 0.7
    const by = cy2 + Math.sin(t * Math.PI * 2) * s * 0.3
    ctx.beginPath(); ctx.arc(bx, by, lw * 2, 0, Math.PI * 2)
    ctx.fillStyle = c2 + '80'; ctx.fill()
  }
  // 龙角
  ctx.beginPath(); ctx.moveTo(cx2 + s * 0.05, cy2 - s * 0.25); ctx.lineTo(cx2 + s * 0.15, cy2 - s * 0.55)
  ctx.moveTo(cx2 - s * 0.1, cy2 - s * 0.22); ctx.lineTo(cx2 - s * 0.2, cy2 - s * 0.5)
  ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 龙须
  ctx.beginPath(); ctx.moveTo(x + w * 0.8, cy2 + s * 0.15); ctx.quadraticCurveTo(x + w * 0.9, cy2, x + w * 0.95, cy2 + s * 0.3)
  ctx.strokeStyle = c2; ctx.lineWidth = lw; ctx.stroke()
}

// 12 京剧脸谱
function drawPekingOpera(ctx, x, y, w, h, lw, colors) {
  const [c1, c2, c3] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2, r = Math.min(w, h) * 0.3
  // 脸
  ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI * 2)
  ctx.fillStyle = c1; ctx.fill(); ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 眉
  ctx.beginPath(); ctx.moveTo(cx2 - r * 0.45, cy2 - r * 0.3)
  ctx.quadraticCurveTo(cx2 - r * 0.2, cy2 - r * 0.65, cx2 + r * 0.1, cy2 - r * 0.25)
  ctx.moveTo(cx2 + r * 0.45, cy2 - r * 0.3)
  ctx.quadraticCurveTo(cx2 + r * 0.2, cy2 - r * 0.65, cx2 - r * 0.1, cy2 - r * 0.25)
  ctx.strokeStyle = c3; ctx.lineWidth = lw * 2; ctx.stroke()
  // 眼
  ctx.beginPath(); ctx.ellipse(cx2 - r * 0.28, cy2 - r * 0.05, r * 0.15, r * 0.1, -0.2, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.strokeStyle = c3; ctx.lineWidth = lw * 0.7; ctx.stroke()
  ctx.beginPath(); ctx.ellipse(cx2 + r * 0.28, cy2 - r * 0.05, r * 0.15, r * 0.1, 0.2, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.strokeStyle = c3; ctx.lineWidth = lw * 0.7; ctx.stroke()
  // 眼珠
  ;[-1, 1].forEach(side => {
    ctx.beginPath(); ctx.arc(cx2 + side * r * 0.28, cy2 - r * 0.05, r * 0.04, 0, Math.PI * 2)
    ctx.fillStyle = '#1a1a1a'; ctx.fill()
  })
  // 鼻
  ctx.beginPath(); ctx.moveTo(cx2, cy2 + r * 0.05); ctx.quadraticCurveTo(cx2 + r * 0.15, cy2 + r * 0.25, cx2, cy2 + r * 0.35)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 嘴
  ctx.beginPath(); ctx.arc(cx2, cy2 + r * 0.45, r * 0.18, 0.2, Math.PI - 0.2)
  ctx.strokeStyle = c3; ctx.lineWidth = lw * 1.2; ctx.stroke()
  // 额纹
  ctx.beginPath(); ctx.moveTo(cx2, cy2 - r * 0.65); ctx.quadraticCurveTo(cx2 + r * 0.15, cy2 - r * 0.5, cx2 + r * 0.3, cy2 - r * 0.6)
  ctx.moveTo(cx2, cy2 - r * 0.65); ctx.quadraticCurveTo(cx2 - r * 0.15, cy2 - r * 0.5, cx2 - r * 0.3, cy2 - r * 0.6)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 0.8; ctx.stroke()
}

// 13 金蟾
function drawGoldenFrog(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2, r = Math.min(w, h) * 0.28
  // 身体（圆）
  ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI * 2)
  const fg = ctx.createRadialGradient(cx2 - r * 0.2, cy2 - r * 0.2, 0, cx2, cy2, r)
  fg.addColorStop(0, c1); fg.addColorStop(1, c2)
  ctx.fillStyle = fg; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 眼睛（大而突出）
  ;[-1, 1].forEach(side => {
    ctx.beginPath(); ctx.arc(cx2 + side * r * 0.5, cy2 - r * 0.55, r * 0.22, 0, Math.PI * 2)
    ctx.fillStyle = c1; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw; ctx.stroke()
    ctx.beginPath(); ctx.arc(cx2 + side * r * 0.5, cy2 - r * 0.55, r * 0.08, 0, Math.PI * 2)
    ctx.fillStyle = '#1a1a1a'; ctx.fill()
  })
  // 嘴巴（笑弧）
  ctx.beginPath(); ctx.arc(cx2, cy2 + r * 0.1, r * 0.35, 0.15, Math.PI - 0.15)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.2; ctx.stroke()
  // 前腿
  ;[-1, 1].forEach(side => {
    ctx.beginPath(); ctx.moveTo(cx2 + side * r * 0.65, cy2 + r * 0.2)
    ctx.quadraticCurveTo(cx2 + side * r * 0.9, cy2 + r * 0.5, cx2 + side * r * 0.75, cy2 + r * 0.8)
    ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.5; ctx.stroke()
  })
  // 铜钱纹（背上）
  ctx.beginPath(); ctx.arc(cx2, cy2 + r * 0.1, r * 0.25, 0, Math.PI * 2)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 0.7; ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx2 - r * 0.25, cy2 + r * 0.1); ctx.lineTo(cx2 + r * 0.25, cy2 + r * 0.1)
  ctx.moveTo(cx2, cy2 - r * 0.25); ctx.lineTo(cx2, cy2 + r * 0.25)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 0.5; ctx.stroke()
}

// 14 喜鹊登梅
function drawMagpiePlum(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  // 梅枝
  ctx.beginPath(); ctx.moveTo(x + w * 0.2, y + h * 0.85)
  ctx.quadraticCurveTo(x + w * 0.4, y + h * 0.55, x + w * 0.65, y + h * 0.3)
  ctx.quadraticCurveTo(x + w * 0.8, y + h * 0.2, x + w * 0.88, y + h * 0.15)
  ctx.strokeStyle = c1; ctx.lineWidth = lw * 2; ctx.stroke()
  // 分枝
  ctx.beginPath(); ctx.moveTo(x + w * 0.5, y + h * 0.5); ctx.quadraticCurveTo(x + w * 0.35, y + h * 0.35, x + w * 0.25, y + h * 0.28)
  ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.2; ctx.stroke()
  // 梅花5瓣
  const flowers = [[x + w * 0.65, y + h * 0.3], [x + w * 0.75, y + h * 0.42], [x + w * 0.55, y + h * 0.38], [x + w * 0.4, y + h * 0.48], [x + w * 0.3, y + h * 0.32]]
  flowers.forEach(([fx, fy]) => {
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2
      const px = fx + Math.cos(a) * w * 0.04, py = fy + Math.sin(a) * h * 0.04
      ctx.beginPath(); ctx.ellipse(px, py, w * 0.025, h * 0.012, a, 0, Math.PI * 2)
      ctx.fillStyle = c1; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1
    }
    ctx.beginPath(); ctx.arc(fx, fy, w * 0.012, 0, Math.PI * 2)
    ctx.fillStyle = c2; ctx.fill()
  })
  // 喜鹊
  const bx = x + w * 0.18, by = y + h * 0.6
  ctx.beginPath(); ctx.ellipse(bx, by, w * 0.07, h * 0.045, -0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1a1a'; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.5; ctx.stroke()
  // 喜鹊头
  ctx.beginPath(); ctx.arc(bx + w * 0.055, by - h * 0.02, h * 0.025, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1a1a'; ctx.fill()
  // 嘴
  ctx.beginPath(); ctx.moveTo(bx + w * 0.08, by - h * 0.02); ctx.lineTo(bx + w * 0.12, by - h * 0.015)
  ctx.lineTo(bx + w * 0.08, by)
  ctx.fillStyle = c1; ctx.fill()
  // 尾巴
  ctx.beginPath(); ctx.moveTo(bx - w * 0.06, by); ctx.quadraticCurveTo(bx - w * 0.15, by - h * 0.03, bx - w * 0.18, by + h * 0.06)
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = lw * 1.5; ctx.stroke()
}

// --- 器物组 ---

// 15 古琴
function drawGuqin(ctx, x, y, w, h, lw, colors) {
  const [c1, c2, c3] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2, lw2 = w * 0.75, lh2 = h * 0.18
  // 琴身
  ctx.beginPath()
  ctx.moveTo(cx2 - lw2 * 0.5, cy2 + lh2 * 0.3)
  ctx.quadraticCurveTo(cx2 - lw2 * 0.55, cy2, cx2 - lw2 * 0.5, cy2 - lh2 * 0.4)
  ctx.quadraticCurveTo(cx2, cy2 - lh2 * 0.55, cx2 + lw2 * 0.5, cy2 - lh2 * 0.35)
  ctx.quadraticCurveTo(cx2 + lw2 * 0.6, cy2, cx2 + lw2 * 0.5, cy2 + lh2 * 0.3)
  ctx.quadraticCurveTo(cx2, cy2 + lh2 * 0.45, cx2 - lw2 * 0.5, cy2 + lh2 * 0.3)
  ctx.closePath()
  ctx.fillStyle = c1 + '30'; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 琴弦（7根）
  for (let s = 0; s < 7; s++) {
    const sx = cx2 - lw2 * 0.35 + s * lw2 * 0.1
    ctx.beginPath(); ctx.moveTo(sx, cy2 - lh2 * 0.35); ctx.lineTo(sx, cy2 + lh2 * 0.28)
    ctx.strokeStyle = c2; ctx.lineWidth = lw * (s < 4 ? 0.6 : 0.4); ctx.globalAlpha = 0.7; ctx.stroke(); ctx.globalAlpha = 1
  }
  // 琴徽（13个点）
  for (let m = 0; m < 13; m++) {
    const mx = cx2 - lw2 * 0.35 + m * lw2 * (0.7 / 12)
    const my = cy2
    ctx.beginPath(); ctx.arc(mx, my, lw * 1.2, 0, Math.PI * 2)
    ctx.fillStyle = c3; ctx.fill()
  }
  // 琴首
  ctx.beginPath(); ctx.roundRect(cx2 - lw2 * 0.12, cy2 - lh2 * 0.5, lw2 * 0.22, lh2 * 1.0, 4)
  ctx.fillStyle = c1 + '50'; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.8; ctx.stroke()
}

// 16 瓦当纹
function drawTilePattern(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2, r = Math.min(w, h) * 0.36
  // 外圆
  ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI * 2)
  ctx.fillStyle = c1 + '20'; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 中心菱形（四渎纹）
  ctx.beginPath()
  ctx.moveTo(cx2, cy2 - r * 0.6); ctx.lineTo(cx2 + r * 0.35, cy2)
  ctx.lineTo(cx2, cy2 + r * 0.6); ctx.lineTo(cx2 - r * 0.35, cy2)
  ctx.closePath()
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.2; ctx.stroke()
  // 对角线
  ;[[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
    ctx.beginPath(); ctx.moveTo(cx2, cy2)
    ctx.lineTo(cx2 + sx * r * 0.6, cy2 + sy * r * 0.6)
    ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.6; ctx.globalAlpha = 0.4; ctx.stroke(); ctx.globalAlpha = 1
  })
  // 四角小菱形
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    const lx = cx2 + Math.cos(a) * r * 0.8, ly = cy2 + Math.sin(a) * r * 0.8
    ctx.beginPath(); ctx.moveTo(lx, ly - h * 0.04); ctx.lineTo(lx + w * 0.03, ly)
    ctx.lineTo(lx, ly + h * 0.04); ctx.lineTo(lx - w * 0.03, ly); ctx.closePath()
    ctx.fillStyle = c1; ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1
  }
}

// 17 灯笼纹
function drawLantern(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const cx2 = x + w / 2, cy2 = y + h * 0.52, rw2 = w * 0.28, rh2 = h * 0.28
  // 灯笼主体
  ctx.beginPath(); ctx.ellipse(cx2, cy2, rw2, rh2, 0, 0, Math.PI * 2)
  ctx.fillStyle = c1 + '30'; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 横向纹路
  for (let i = -3; i <= 3; i++) {
    const ry2 = cy2 + i * rh2 * 0.22
    const rx2 = rw2 * Math.sqrt(Math.max(0, 1 - (i * 0.22) ** 2 * 1.2))
    ctx.beginPath(); ctx.ellipse(cx2, ry2, rx2, rh2 * 0.08, 0, 0, Math.PI * 2)
    ctx.strokeStyle = c2; ctx.lineWidth = lw * 0.6; ctx.globalAlpha = 0.5; ctx.stroke(); ctx.globalAlpha = 1
  }
  // 纵向条纹
  for (let i = -3; i <= 3; i++) {
    const rx2 = i * rw2 * 0.25
    ctx.beginPath(); ctx.ellipse(cx2 + rx2, cy2, rw2 * 0.05, rh2 * 0.85, 0, 0, Math.PI * 2)
    ctx.strokeStyle = c2; ctx.lineWidth = lw * 0.4; ctx.globalAlpha = 0.3; ctx.stroke(); ctx.globalAlpha = 1
  }
  // 顶盖
  ctx.beginPath(); ctx.roundRect(cx2 - w * 0.08, cy2 - rh2 - h * 0.04, w * 0.16, h * 0.06, 2)
  ctx.fillStyle = c2; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.8; ctx.stroke()
  // 挂绳
  ctx.beginPath(); ctx.moveTo(cx2, cy2 - rh2 - h * 0.04); ctx.lineTo(cx2, cy2 - rh2 - h * 0.1)
  ctx.strokeStyle = c2; ctx.lineWidth = lw; ctx.stroke()
  // 底穗
  ctx.beginPath(); ctx.moveTo(cx2, cy2 + rh2); ctx.lineTo(cx2, cy2 + rh2 + h * 0.08)
  ctx.strokeStyle = c1; ctx.lineWidth = lw; ctx.stroke()
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.moveTo(cx2, cy2 + rh2 + h * 0.02)
    ctx.quadraticCurveTo(cx2 + i * w * 0.015, cy2 + rh2 + h * 0.05, cx2 + i * w * 0.02, cy2 + rh2 + h * 0.08)
    ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.6; ctx.stroke()
  }
}

// 18 玉如意
function drawRuyi(ctx, x, y, w, h, lw, colors) {
  const [c1, c2, c3] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2, lw2 = w * 0.65, lh2 = h * 0.12
  // 柄
  ctx.beginPath(); ctx.roundRect(cx2 - lw2 * 0.5, cy2 - lh2 * 0.35, lw2, lh2 * 0.7, 6)
  ctx.fillStyle = c1 + '40'; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.2; ctx.stroke()
  // 头部（云纹如意）
  ctx.beginPath()
  ctx.moveTo(cx2 + lw2 * 0.35, cy2 - lh2 * 0.5)
  ctx.quadraticCurveTo(cx2 + lw2 * 0.6, cy2 - lh2 * 0.8, cx2 + lw2 * 0.4, cy2 - lh2 * 1.2)
  ctx.quadraticCurveTo(cx2 + lw2 * 0.15, cy2 - lh2 * 1.5, cx2, cy2 - lh2 * 1.2)
  ctx.quadraticCurveTo(cx2 - lw2 * 0.1, cy2 - lh2 * 1.4, cx2 - lw2 * 0.2, cy2 - lh2 * 0.9)
  ctx.quadraticCurveTo(cx2 - lw2 * 0.3, cy2 - lh2 * 0.6, cx2 + lw2 * 0.35, cy2 - lh2 * 0.5)
  ctx.closePath()
  ctx.fillStyle = c2 + '50'; ctx.fill(); ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 头部装饰
  ctx.beginPath(); ctx.arc(cx2 + lw2 * 0.1, cy2 - lh2 * 1.0, lw * 0.04, 0, Math.PI * 2)
  ctx.fillStyle = c3; ctx.fill()
  ctx.beginPath(); ctx.arc(cx2 - lw2 * 0.05, cy2 - lh2 * 1.05, lw * 0.025, 0, Math.PI * 2)
  ctx.fillStyle = c1; ctx.fill()
  // 柄身纹路
  ctx.beginPath(); ctx.moveTo(cx2 - lw2 * 0.3, cy2 - lh2 * 0.1); ctx.lineTo(cx2 - lw2 * 0.3, cy2 + lh2 * 0.1)
  ctx.moveTo(cx2 - lw2 * 0.1, cy2 - lh2 * 0.15); ctx.lineTo(cx2 - lw2 * 0.1, cy2 + lh2 * 0.15)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 0.6; ctx.globalAlpha = 0.5; ctx.stroke(); ctx.globalAlpha = 1
}

// --- 几何组 ---

// 19 铜钱纹
function drawCoinPattern(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2
  for (let ring = 3; ring >= 1; ring--) {
    const r = Math.min(w, h) * 0.12 * ring
    ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI * 2)
    ctx.strokeStyle = ring === 2 ? c1 : c2; ctx.lineWidth = lw * (ring === 2 ? 1.5 : 0.7)
    ctx.globalAlpha = 0.5 + (3 - ring) * 0.2; ctx.stroke(); ctx.globalAlpha = 1
  }
  // 方孔
  const hs = Math.min(w, h) * 0.08
  ctx.beginPath(); ctx.roundRect(cx2 - hs / 2, cy2 - hs / 2, hs, hs, 2)
  ctx.strokeStyle = c1; ctx.lineWidth = lw; ctx.stroke()
  // 边缘小圆点
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const r = Math.min(w, h) * 0.35
    ctx.beginPath(); ctx.arc(cx2 + Math.cos(a) * r, cy2 + Math.sin(a) * r, lw * 1.5, 0, Math.PI * 2)
    ctx.fillStyle = c1 + '80'; ctx.fill()
  }
}

// 20 窗花剪纸
function drawPaperCut(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2
  ctx.save()
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip()
  // 对角线剪纸（4个三角）
  ctx.globalAlpha = 0.7
  ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(x, y); ctx.lineTo(cx2, y); ctx.closePath()
  ctx.fillStyle = c1; ctx.fill()
  ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(x, y); ctx.lineTo(x, cy2); ctx.closePath()
  ctx.fillStyle = c2; ctx.fill()
  ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(x + w, y); ctx.lineTo(cx2, y); ctx.closePath()
  ctx.fillStyle = c2; ctx.fill()
  ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(x + w, y); ctx.lineTo(x + w, cy2); ctx.closePath()
  ctx.fillStyle = c1; ctx.fill()
  ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, cy2); ctx.closePath()
  ctx.fillStyle = c1; ctx.fill()
  ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(x + w, y + h); ctx.lineTo(cx2, y + h); ctx.closePath()
  ctx.fillStyle = c2; ctx.fill()
  ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(x, y + h); ctx.lineTo(cx2, y + h); ctx.closePath()
  ctx.fillStyle = c2; ctx.fill()
  ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(x, y + h); ctx.lineTo(x, cy2); ctx.closePath()
  ctx.fillStyle = c1; ctx.fill()
  ctx.globalAlpha = 1
  // 中心花样
  ctx.beginPath(); ctx.arc(cx2, cy2, w * 0.08, 0, Math.PI * 2)
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = lw * 0.8; ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx2, cy2 - w * 0.08); ctx.lineTo(cx2, cy2 + w * 0.08)
  ctx.moveTo(cx2 - w * 0.08, cy2); ctx.lineTo(cx2 + w * 0.08, cy2)
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = lw * 0.6; ctx.stroke()
  ctx.restore()
}

// 21 玉佩纹
function drawJadePendant(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2
  const rw2 = w * 0.3, rh2 = h * 0.38
  // 玉璧外形（圆角方形+圆）
  ctx.beginPath(); ctx.roundRect(cx2 - rw2, cy2 - rh2, rw2 * 2, rh2 * 2, Math.min(rw2, rh2) * 0.4)
  ctx.fillStyle = c1 + '20'; ctx.fill(); ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 中心圆孔
  ctx.beginPath(); ctx.arc(cx2, cy2, rw2 * 0.5, 0, Math.PI * 2)
  ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.2; ctx.stroke()
  // 龙纹（S形）
  ctx.beginPath()
  ctx.moveTo(cx2 - rw2 * 0.4, cy2 - rh2 * 0.2)
  ctx.quadraticCurveTo(cx2, cy2 - rh2 * 0.5, cx2 + rw2 * 0.4, cy2 - rh2 * 0.15)
  ctx.quadraticCurveTo(cx2 + rw2 * 0.6, cy2 + rh2 * 0.1, cx2 + rw2 * 0.3, cy2 + rh2 * 0.3)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.2; ctx.stroke()
  // 穿孔
  ctx.beginPath(); ctx.arc(cx2, cy2 - rh2 - h * 0.04, h * 0.025, 0, Math.PI * 2)
  ctx.strokeStyle = c1; ctx.lineWidth = lw; ctx.stroke()
  // 流苏
  ctx.beginPath(); ctx.moveTo(cx2, cy2 + rh2)
  ctx.lineTo(cx2, cy2 + rh2 + h * 0.1)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 0.8; ctx.stroke()
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.moveTo(cx2, cy2 + rh2 + h * 0.03)
    ctx.quadraticCurveTo(cx2 + i * w * 0.02, cy2 + rh2 + h * 0.07, cx2 + i * w * 0.025, cy2 + rh2 + h * 0.1)
    ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.5; ctx.stroke()
  }
}

// 22 天圆地方
function drawTianYuanDiFang(ctx, x, y, w, h, lw, colors) {
  const [c1, c2, c3] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2, s = Math.min(w, h) * 0.32
  // 方形（地方）
  ctx.beginPath(); ctx.roundRect(cx2 - s * 1.1, cy2 - s * 1.1, s * 2.2, s * 2.2, 8)
  ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 圆（天圆）
  ctx.beginPath(); ctx.arc(cx2, cy2, s, 0, Math.PI * 2)
  ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.5; ctx.stroke()
  // 中心太极
  ctx.beginPath(); ctx.arc(cx2, cy2, s * 0.35, -Math.PI / 2, Math.PI / 2)
  ctx.fillStyle = c1; ctx.fill()
  ctx.beginPath(); ctx.arc(cx2, cy2, s * 0.35, Math.PI / 2, -Math.PI / 2)
  ctx.fillStyle = c2; ctx.fill()
  ctx.beginPath(); ctx.arc(cx2, cy2 - s * 0.175, s * 0.1, 0, Math.PI * 2)
  ctx.fillStyle = c2; ctx.fill()
  ctx.beginPath(); ctx.arc(cx2, cy2 + s * 0.175, s * 0.1, 0, Math.PI * 2)
  ctx.fillStyle = c1; ctx.fill()
  // 四角纹
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    const lx = cx2 + Math.cos(a) * s * 1.55, ly = cy2 + Math.sin(a) * s * 1.55
    ctx.beginPath(); ctx.arc(lx, ly, lw * 2, 0, Math.PI * 2)
    ctx.fillStyle = c3; ctx.fill()
  }
}

// 23 八卦阵
function drawBaguaArray(ctx, x, y, w, h, lw, colors) {
  const [c1, c2] = colors
  const cx2 = x + w / 2, cy2 = y + h / 2, r = Math.min(w, h) * 0.38
  // 中心太极
  ctx.beginPath(); ctx.arc(cx2, cy2, r * 0.28, -Math.PI / 2, Math.PI / 2)
  ctx.fillStyle = c1; ctx.fill()
  ctx.beginPath(); ctx.arc(cx2, cy2, r * 0.28, Math.PI / 2, -Math.PI / 2)
  ctx.fillStyle = c2; ctx.fill()
  ctx.beginPath(); ctx.arc(cx2, cy2 - r * 0.14, r * 0.07, 0, Math.PI * 2)
  ctx.fillStyle = c2; ctx.fill()
  ctx.beginPath(); ctx.arc(cx2, cy2 + r * 0.14, r * 0.07, 0, Math.PI * 2)
  ctx.fillStyle = c1; ctx.fill()
  // 外圈8宫格
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2
    const r2 = r * 0.65
    const px = cx2 + Math.cos(a) * r2, py = cy2 + Math.sin(a) * r2
    ctx.beginPath(); ctx.arc(px, py, r * 0.15, 0, Math.PI * 2)
    ctx.fillStyle = i % 2 === 0 ? c1 + '60' : c2 + '60'; ctx.fill()
    ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.5; ctx.stroke()
  }
  // 外圆环
  ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI * 2)
  ctx.strokeStyle = c1; ctx.lineWidth = lw * 1.2; ctx.stroke()
  ctx.beginPath(); ctx.arc(cx2, cy2, r * 1.25, 0, Math.PI * 2)
  ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.6; ctx.globalAlpha = 0.4; ctx.stroke(); ctx.globalAlpha = 1
  // 方位线
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2
    ctx.beginPath(); ctx.moveTo(cx2 + Math.cos(a) * r * 1.02, cy2 + Math.sin(a) * r * 1.02)
    ctx.lineTo(cx2 + Math.cos(a) * r * 1.22, cy2 + Math.sin(a) * r * 1.22)
    ctx.strokeStyle = c1; ctx.lineWidth = lw * 0.6; ctx.globalAlpha = 0.5; ctx.stroke(); ctx.globalAlpha = 1
  }
}

// ============================================================
// 形状绘制调度表
// ============================================================
const SHAPE_DRAWERS = [
  drawInkMountains, drawKoiFish, drawBambooRock, drawCraneCloud, drawLotusDragonfly,
  drawAuspiciousCloud, drawTaijiBagua, drawSwastika, drawKeyFret, drawIceCrack, drawEndlessKnot,
  drawDragon, drawPekingOpera, drawGoldenFrog, drawMagpiePlum,
  drawGuqin, drawTilePattern, drawLantern, drawRuyi,
  drawCoinPattern, drawPaperCut, drawJadePendant, drawTianYuanDiFang, drawBaguaArray,
]

// ============================================================
// 封面图绘制（1080×1920）
// ============================================================
export function drawCover(data, shapeType, styleOpts = {}) {
  const { borderWidth = 4, lineWidth = 2, colorScheme = 'cinnabar' } = styleOpts
  const colors = getColors(colorScheme)
  const w = 1080, h = 1920
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  const cx = w / 2

  ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, w, h)

  const boxW = h * 0.42, boxH = h * 0.42
  const boxX = cx - boxW / 2, boxY = h * 0.38

  ctx.save()
  ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 40); ctx.clip()
  const padX = boxW * 0.08, padY = boxH * 0.08
  const shape = shapeType < 0 ? Math.floor(Math.random() * 24) : shapeType
  const drawFn = SHAPE_DRAWERS[shape] ?? SHAPE_DRAWERS[0]
  drawFn(ctx, boxX + padX, boxY + padY, boxW - padX * 2, boxH - padY * 2, lineWidth, colors)
  ctx.restore()

  ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 40)
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = borderWidth; ctx.stroke()

  const brandY = h * 0.92
  ctx.font = `700 ${Math.round(w * 0.026)}px "PingFang SC", sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('@小福AI自由', cx, brandY)

  return canvas
}

// ============================================================
// 形状缩略图绘制（64×64）
// ============================================================
export function drawShapeThumb(shapeId, styleOpts = {}) {
  const { lineWidth = 2, colorScheme = 'cinnabar' } = styleOpts
  const colors = getColors(colorScheme)
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, size, size)
  const drawFn = SHAPE_DRAWERS[shapeId] ?? SHAPE_DRAWERS[0]
  drawFn(ctx, 4, 4, size - 8, size - 8, Math.max(1, lineWidth - 1), colors)
  return canvas
}
