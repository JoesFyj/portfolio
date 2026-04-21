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
    const cxCloud = x + (0.15 + ci * 0.35) * w, cyCloud = y + h * (0.2 + ci * 0.1)
    ctx.globalAlpha = 0.2 + ci * 0.05
    for (let b = 0; b < 3; b++) {
      ctx.beginPath(); ctx.ellipse(cxCloud + b * w * 0.05, cyCloud, w * (0.06 - b * 0.01), h * 0.025, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'; ctx.fill()
    }
    ctx.globalAlpha = 1
  }
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
// 城市地标选项配置（24个 · 中国城市地标主题）
// ============================================================
export const LANDMARK_GROUPS = ['华北东北', '华东', '华中华南', '西南西北']

export const LANDMARK_OPTIONS = [
  { id: 0,  group: '华北东北', label: '北京', province: '首都', landmark: '天安门' },
  { id: 1,  group: '华北东北', label: '天津', province: '直辖市', landmark: '天津之眼' },
  { id: 2,  group: '华北东北', label: '沈阳', province: '辽宁省', landmark: '故宫大政殿' },
  { id: 3,  group: '华北东北', label: '长春', province: '吉林省', landmark: '伪满皇宫' },
  { id: 4,  group: '华北东北', label: '哈尔滨', province: '黑龙江省', landmark: '索菲亚教堂' },
  { id: 5,  group: '华北东北', label: '石家庄', province: '河北省', landmark: '赵州桥' },
  { id: 6,  group: '华东', label: '上海', province: '直辖市', landmark: '东方明珠' },
  { id: 7,  group: '华东', label: '南京', province: '江苏省', landmark: '夫子庙' },
  { id: 8,  group: '华东', label: '杭州', province: '浙江省', landmark: '雷峰塔' },
  { id: 9,  group: '华东', label: '苏州', province: '江苏省', landmark: '拙政园' },
  { id: 10, group: '华东', label: '济南', province: '山东省', landmark: '大明湖' },
  { id: 11, group: '华东', label: '青岛', province: '山东省', landmark: '栈桥' },
  { id: 12, group: '华中华南', label: '广州', province: '广东省', landmark: '广州塔' },
  { id: 13, group: '华中华南', label: '深圳', province: '广东省', landmark: '平安大厦' },
  { id: 14, group: '华中华南', label: '武汉', province: '湖北省', landmark: '黄鹤楼' },
  { id: 15, group: '华中华南', label: '长沙', province: '湖南省', landmark: '岳麓书院' },
  { id: 16, group: '华中华南', label: '厦门', province: '福建省', landmark: '鼓浪屿' },
  { id: 17, group: '华中华南', label: '郑州', province: '河南省', landmark: '二七塔' },
  { id: 18, group: '西南西北', label: '重庆', province: '直辖市', landmark: '洪崖洞' },
  { id: 19, group: '西南西北', label: '成都', province: '四川省', landmark: '大熊猫' },
  { id: 20, group: '西南西北', label: '西安', province: '陕西省', landmark: '钟楼' },
  { id: 21, group: '西南西北', label: '昆明', province: '云南省', landmark: '石林' },
  { id: 22, group: '西南西北', label: '拉萨', province: '西藏', landmark: '布达拉宫' },
  { id: 23, group: '西南西北', label: '乌鲁木齐', province: '新疆', landmark: '国际大巴扎' },
]

// ============================================================
// 城市地标封面缩略图绘制（64×64）
// ============================================================
export function drawLandmarkThumb(landmarkId, styleOpts = {}) {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')
  const info = LANDMARK_OPTIONS[landmarkId] || LANDMARK_OPTIONS[0]

  // 深色背景
  ctx.fillStyle = '#0a0e1a'; ctx.fillRect(0, 0, size, size)

  // 星星
  ctx.save()
  for (let i = 0; i < 15; i++) {
    const sx = (i * 37 + 7) % size, sy = (i * 23 + 3) % (size * 0.5)
    ctx.globalAlpha = 0.2 + (i % 4) * 0.08
    ctx.fillStyle = '#ffffff'
    ctx.beginPath(); ctx.arc(sx, sy, 0.5 + (i % 2) * 0.5, 0, Math.PI * 2); ctx.fill()
  }
  ctx.restore()

  // 正方形白框
  const boxSize = size * 0.78
  const boxX = (size - boxSize) / 2
  const boxY = size * 0.1

  ctx.save()
  ctx.beginPath(); ctx.roundRect(boxX, boxY, boxSize, boxSize, size * 0.06)
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.restore()

  // 图标
  const pad = boxSize * 0.12
  const iconColors = [
    ['#00d4ff', '#0099cc'], ['#ffb300', '#ff6d00'], ['#ffe066', '#ff9900'],
    ['#b39ddb', '#7e57c2'], ['#80deea', '#26c6da'], ['#ffcc80', '#ffa726'],
    ['#ff80ab', '#e91e63'], ['#ffcc02', '#ff9100'], ['#ffd740', '#ffab00'],
    ['#ce93d8', '#ab47bc'], ['#a5d6a7', '#66bb6a'], ['#4fc3f7', '#0288d1'],
    ['#ef9a9a', '#e53935'], ['#80cbc4', '#00897b'], ['#fff59d', '#fdd835'],
    ['#f48fb1', '#d81b60'], ['#80cbc4', '#00897b'], ['#ffab91', '#ff5722'],
    ['#ff7043', '#bf360c'], ['#a3e635', '#65a30d'], ['#fbbf24', '#d97706'],
    ['#a5d6a7', '#4caf50'], ['#fca5a5', '#dc2626'], ['#fcd34d', '#f59e0b'],
  ]
  const [c1] = iconColors[info.id] || ['#d4a017']
  drawLandmarkSilhouette(ctx, info.id, boxX + pad, boxY + pad, boxSize - pad * 2, boxSize - pad * 2, c1)

  return canvas
}

// ============================================================
// 城市地标封面绘制（1080×1920）
// ============================================================
export function drawLandmarkCover(data, landmarkId, styleOpts = {}) {
  const w = 1080, h = 1920
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  const cx = w / 2

  // 深色背景
  ctx.fillStyle = '#0a0e1a'; ctx.fillRect(0, 0, w, h)

  // 星空
  ctx.save()
  for (let i = 0; i < 80; i++) {
    const sx = (i * 137 + 29) % w
    const sy = (i * 83 + 7) % (h * 0.6)
    const sr = 0.5 + (i % 3) * 0.5
    ctx.globalAlpha = 0.15 + (i % 6) * 0.07
    ctx.fillStyle = '#ffffff'
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill()
  }
  ctx.restore()

  // 底部圆形光晕
  const glow = ctx.createRadialGradient(cx, h * 0.85, 0, cx, h * 0.85, h * 0.6)
  glow.addColorStop(0, 'rgba(30,40,80,0.8)')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h)

  // ===== 正方形白框 + 图标 =====
  const boxSize = h * 0.4
  const boxX = cx - boxSize / 2
  const boxY = h * 0.55  // 抬高约2cm

  const info = LANDMARK_OPTIONS[landmarkId] || LANDMARK_OPTIONS[0]

  // 正方形白框（外圈）
  ctx.save()
  ctx.beginPath(); ctx.roundRect(boxX, boxY, boxSize, boxSize, boxSize * 0.08)
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'
  ctx.lineWidth = 8
  ctx.stroke()
  ctx.restore()

  // 图标区域（正方形内边距）
  const iconPad = boxSize * 0.12
  const iconX = boxX + iconPad
  const iconY = boxY + iconPad
  const iconW = boxSize - iconPad * 2
  const iconH = boxSize - iconPad * 2

  // 城市专属亮色
  const iconColors = [
    ['#00d4ff', '#0099cc'],  // 0 北京
    ['#ffb300', '#ff6d00'],  // 1 天津
    ['#ffe066', '#ff9900'],  // 2 沈阳
    ['#b39ddb', '#7e57c2'],  // 3 长春
    ['#80deea', '#26c6da'],  // 4 哈尔滨
    ['#ffcc80', '#ffa726'],  // 5 石家庄
    ['#ff80ab', '#e91e63'],  // 6 上海
    ['#ffcc02', '#ff9100'],  // 7 南京
    ['#ffd740', '#ffab00'],  // 8 杭州
    ['#ce93d8', '#ab47bc'],  // 9 苏州
    ['#a5d6a7', '#66bb6a'],  // 10 济南
    ['#4fc3f7', '#0288d1'],  // 11 青岛
    ['#ef9a9a', '#e53935'],  // 12 广州
    ['#80cbc4', '#00897b'],  // 13 深圳
    ['#fff59d', '#fdd835'],  // 14 武汉
    ['#f48fb1', '#d81b60'],  // 15 长沙
    ['#80cbc4', '#00897b'],  // 16 厦门
    ['#ffab91', '#ff5722'],  // 17 郑州
    ['#ff7043', '#bf360c'],  // 18 重庆
    ['#a3e635', '#65a30d'],  // 19 成都
    ['#fbbf24', '#d97706'],  // 20 西安
    ['#a5d6a7', '#4caf50'],  // 21 昆明
    ['#fca5a5', '#dc2626'],  // 22 拉萨
    ['#fcd34d', '#f59e0b'],  // 23 乌鲁木齐
  ]
  const [c1, c2] = iconColors[info.id] || ['#d4a017', '#f59e0b']

  // 绘制地标剪影
  drawLandmarkSilhouette(ctx, info.id, iconX, iconY, iconW, iconH, c1)

  // 内层发光效果
  ctx.save()
  ctx.beginPath(); ctx.roundRect(boxX + 2, boxY + 2, boxSize - 4, boxSize - 4, boxSize * 0.08 - 2)
  ctx.strokeStyle = c1 + '40'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.restore()

  return canvas
}

// ============================================================
// 地标剪影绘制函数
// ============================================================
function drawLandmarkSilhouette(ctx, id, x, y, w, h, color) {

  ctx.save()
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(1.5, w * 0.004)
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'

  // 城市专属辅色
  const subColors = {
    0: '#ffe066',  // 北京-金黄
    1: '#ff8fab',  // 天津-粉
    2: '#ffcc80',  // 沈阳-橙黄
    3: '#b39ddb',  // 长春-紫
    4: '#80deea',  // 哈尔滨-冰蓝
    5: '#ffcc80',  // 石家庄-橙黄
    6: '#f48fb1',  // 上海-粉
    7: '#ffe082',  // 南京-淡黄
    8: '#ffd54f',  // 杭州-金黄
    9: '#e1bee7',  // 苏州-淡紫
    10: '#c8e6c9', // 济南-淡绿
    11: '#4fc3f7', // 青岛-天蓝
    12: '#ffab91', // 广州-珊瑚橙
    13: '#80cbc4', // 深圳-青绿
    14: '#fff176', // 武汉-亮黄
    15: '#f48fb1', // 长沙-粉
    16: '#80cbc4', // 厦门-青绿
    17: '#ffab91', // 郑州-珊瑚橙
    18: '#ff7043', // 重庆-橙红
    19: '#a5d6a7', // 成都-草绿
    20: '#ffcc02', // 西安-明黄
    21: '#c8e6c9', // 昆明-淡绿
    22: '#ef9a9a', // 拉萨-桃红
    23: '#ffe082', // 乌鲁木齐-淡黄
  }
  const sub = subColors[id] || color

  const cx2 = x + w / 2
  const bh2 = h * 0.12

  switch (id) {
    case 0: {
      // 北京-天安门（红色城楼+金色琉璃瓦+5个门洞）
      const bw = w * 0.88, bx = x + w * 0.06, by = y + h * 0.52, bh = h * 0.38
      const cx3 = bx + bw / 2
      // 城墙底座
      ctx.fillStyle = sub; ctx.globalAlpha = 0.6; ctx.fillRect(bx, by + bh * 0.82, bw, bh * 0.18); ctx.globalAlpha = 1
      // 5个门洞
      for (let d = 0; d < 5; d++) {
        ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.9
        ctx.beginPath(); ctx.arc(bx + bw * (0.1 + d * 0.2), by + bh * 0.62, w * 0.035, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      }
      // 城楼主体（3层）
      for (let s = 0; s < 3; s++) {
        const sh = bh * 0.28, sy = by + bh * 0.54 - s * sh
        ctx.fillStyle = s === 1 ? sub : color
        ctx.fillRect(bx + bw * 0.05, sy, bw * 0.9, sh * 0.85)
        ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.85
        ctx.beginPath(); ctx.arc(bx + bw * 0.5, sy + sh * 0.1, w * 0.055, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1
        // 飞檐
        ctx.fillStyle = color; ctx.globalAlpha = 0.6
        ctx.beginPath(); ctx.moveTo(bx + bw * 0.05, sy); ctx.quadraticCurveTo(bx + bw * 0.5, sy - sh * 0.4, bx + bw * 0.95, sy); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      }
      // 金色琉璃瓦顶
      ctx.fillStyle = sub
      ctx.beginPath(); ctx.moveTo(bx + bw * 0.2, by + bh * 0.28); ctx.lineTo(bx + bw * 0.5, by + bh * 0.08); ctx.lineTo(bx + bw * 0.8, by + bh * 0.28); ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.7
      ctx.beginPath(); ctx.arc(bx + bw * 0.5, by + bh * 0.14, w * 0.025, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      // 旗杆
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.006
      ctx.beginPath(); ctx.moveTo(bx + bw * 0.5, by + bh * 0.08); ctx.lineTo(bx + bw * 0.5, by - h * 0.05); ctx.stroke()
      ctx.fillStyle = sub; ctx.beginPath(); ctx.moveTo(bx + bw * 0.5, by - h * 0.05); ctx.lineTo(bx + bw * 0.5 + w * 0.05, by + h * 0.01); ctx.lineTo(bx + bw * 0.5, by + h * 0.03); ctx.closePath(); ctx.fill()
      break
    }
    case 1: {
      // 天津-津塔（津门+津塔+海河）
      const bw = w * 0.7, bx = x + w * 0.15, by = y + h * 0.55, bh = h * 0.4
      // 海河
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.5; ctx.fillRect(x, by + bh * 0.8, w, bh * 0.2); ctx.globalAlpha = 1
      // 津门牌坊
      ctx.fillStyle = color; ctx.fillRect(bx, by + bh * 0.1, bw, bh * 0.7)
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(bx + bw / 2, by + bh * 0.3, bw * 0.22, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1
      // 飞檐
      ctx.fillStyle = sub; ctx.globalAlpha = 0.7
      ctx.beginPath(); ctx.moveTo(bx - w * 0.02, by + bh * 0.1); ctx.quadraticCurveTo(bx + bw / 2, by - bh * 0.15, bx + bw + w * 0.02, by + bh * 0.1); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      // 津塔（现代摩天楼）
      const tx = bx + bw * 1.1, ty = by + bh * 0.2, th = h * 0.55
      const grad = ctx.createLinearGradient(tx - w * 0.05, ty, tx + w * 0.05, ty)
      grad.addColorStop(0, color); grad.addColorStop(0.5, sub); grad.addColorStop(1, color)
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.moveTo(tx - w * 0.05, ty); ctx.lineTo(tx + w * 0.05, ty); ctx.lineTo(tx + w * 0.015, ty - th); ctx.lineTo(tx - w * 0.015, ty - th); ctx.closePath(); ctx.fill()
      // 塔尖装饰
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.008
      ctx.beginPath(); ctx.moveTo(tx, ty - th); ctx.lineTo(tx, ty - th - h * 0.06); ctx.stroke()
      ctx.fillStyle = sub; ctx.beginPath(); ctx.arc(tx, ty - th - h * 0.06, w * 0.015, 0, Math.PI * 2); ctx.fill()
      break
    }
    case 2: {
      // 沈阳-故宫（大政殿+十王亭+红墙）
      const bw = w * 0.8, bx = x + w * 0.1, by = y + h * 0.5, bh = h * 0.45
      const cx3 = bx + bw / 2
      // 红墙
      ctx.fillStyle = color; ctx.globalAlpha = 0.5; ctx.fillRect(bx, by + bh * 0.7, bw, bh * 0.3); ctx.globalAlpha = 1
      // 十王亭（两侧各4个小亭子）
      for (let s = -1; s <= 1; s += 2) {
        for (let t = 0; t < 4; t++) {
          const tx2 = cx3 + s * bw * 0.2 + s * t * bw * 0.1, ty2 = by + bh * 0.3 + t * bh * 0.12
          const tw = w * 0.08, th2 = bh * 0.15
          ctx.fillStyle = color; ctx.fillRect(tx2 - tw / 2, ty2 - th2 * 0.6, tw, th2 * 0.6)
          ctx.fillStyle = sub; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.moveTo(tx2 - tw * 0.6, ty2 - th2 * 0.6); ctx.quadraticCurveTo(tx2, ty2 - th2 * 1.2, tx2 + tw * 0.6, ty2 - th2 * 0.6); ctx.fill(); ctx.globalAlpha = 1
        }
      }
      // 大政殿（中心大殿）
      ctx.fillStyle = sub
      ctx.fillRect(cx3 - w * 0.1, by - bh * 0.05, w * 0.2, bh * 0.5)
      // 三层飞檐顶
      for (let r = 0; r < 3; r++) {
        const rw = w * (0.15 - r * 0.025), ry = by - bh * 0.05 - r * bh * 0.12
        ctx.fillStyle = color; ctx.globalAlpha = 0.8
        ctx.beginPath(); ctx.moveTo(cx3 - rw, ry); ctx.quadraticCurveTo(cx3, ry - bh * 0.1, cx3 + rw, ry); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      }
      // 殿顶宝顶
      ctx.fillStyle = sub; ctx.beginPath(); ctx.arc(cx3, by - bh * 0.35, w * 0.02, 0, Math.PI * 2); ctx.fill()
      break
    }
    case 3: {
      // 长春-伪满皇宫（宫殿+龙柱+城墙）
      const bw = w * 0.8, bx = x + w * 0.1, by = y + h * 0.52, bh = h * 0.42
      const cx3 = bx + bw / 2
      // 城墙
      ctx.fillStyle = color; ctx.globalAlpha = 0.6; ctx.fillRect(bx, by + bh * 0.85, bw, bh * 0.15); ctx.globalAlpha = 1
      // 主殿
      ctx.fillStyle = sub
      ctx.fillRect(cx3 - bw * 0.18, by - bh * 0.1, bw * 0.36, bh * 0.75)
      // 龙柱
      for (let d = -1; d <= 1; d += 2) {
        ctx.fillStyle = sub; ctx.globalAlpha = 0.8
        ctx.fillRect(cx3 + d * bw * 0.12 - w * 0.012, by - bh * 0.05, w * 0.024, bh * 0.65)
        ctx.globalAlpha = 1
        // 龙纹螺旋
        ctx.strokeStyle = color; ctx.lineWidth = w * 0.006
        for (let s = 0; s < 6; s++) {
          ctx.beginPath(); ctx.arc(cx3 + d * bw * 0.12, by + s * bh * 0.1, w * 0.02, 0, Math.PI * 1.5); ctx.stroke()
        }
      }
      // 歇山顶
      ctx.fillStyle = color; ctx.globalAlpha = 0.75
      ctx.beginPath(); ctx.moveTo(cx3 - bw * 0.2, by - bh * 0.1); ctx.quadraticCurveTo(cx3 - bw * 0.1, by - bh * 0.4, cx3, by - bh * 0.28); ctx.quadraticCurveTo(cx3 + bw * 0.1, by - bh * 0.4, cx3 + bw * 0.2, by - bh * 0.1); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      break
    }
    case 4: {
      // 哈尔滨-圣索菲亚教堂（洋葱头穹顶+金色十字+红砖墙）
      const bw = w * 0.7, bx = x + w * 0.15, by = y + h * 0.45, bh = h * 0.5
      const cx3 = bx + bw / 2
      // 红砖墙
      ctx.fillStyle = color; ctx.fillRect(bx, by + bh * 0.3, bw, bh * 0.7)
      // 砖纹
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 7; c++) {
          ctx.strokeStyle = '#0a0e1a'; ctx.globalAlpha = 0.3; ctx.lineWidth = w * 0.004
          ctx.strokeRect(bx + c * bw / 7 + (r % 2) * bw / 14, by + bh * 0.3 + r * bh * 0.14, bw / 7, bh * 0.14); ctx.globalAlpha = 1
        }
      }
      // 券拱门廊
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.9
      for (let a = 0; a < 3; a++) {
        ctx.beginPath(); ctx.arc(bx + bw * (0.2 + a * 0.3), by + bh * 0.65, w * 0.055, Math.PI, 0); ctx.fill()
      }
      ctx.globalAlpha = 1
      // 中央穹顶
      ctx.fillStyle = sub
      ctx.beginPath(); ctx.arc(cx3, by, w * 0.18, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.85
      ctx.beginPath(); ctx.arc(cx3, by, w * 0.13, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      // 洋葱头顶
      ctx.fillStyle = color
      ctx.beginPath(); ctx.moveTo(cx3 - w * 0.12, by - bh * 0.05); ctx.quadraticCurveTo(cx3, by - bh * 0.45, cx3, by - bh * 0.5); ctx.quadraticCurveTo(cx3, by - bh * 0.45, cx3 + w * 0.12, by - bh * 0.05); ctx.closePath(); ctx.fill()
      // 金色十字
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.016
      ctx.beginPath(); ctx.moveTo(cx3, by - bh * 0.5); ctx.lineTo(cx3, by - bh * 0.65); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx3 - w * 0.05, by - bh * 0.58); ctx.lineTo(cx3 + w * 0.05, by - bh * 0.58); ctx.stroke()
      break
    }
    case 5: {
      // 石家庄-电视塔（混凝土塔身+发射塔+观景台）
      const tx = cx2, ty = y + h * 0.75, th = h * 0.68
      // 塔身渐变
      const tg = ctx.createLinearGradient(tx - w * 0.08, ty, tx + w * 0.08, ty)
      tg.addColorStop(0, color); tg.addColorStop(0.4, sub); tg.addColorStop(1, color)
      ctx.fillStyle = tg
      ctx.beginPath(); ctx.moveTo(tx - w * 0.06, ty); ctx.lineTo(tx + w * 0.06, ty); ctx.lineTo(tx + w * 0.012, ty - th); ctx.lineTo(tx - w * 0.012, ty - th); ctx.closePath(); ctx.fill()
      // 横撑
      for (let c = 0; c < 4; c++) {
        const cy = ty - c * th * 0.22
        ctx.strokeStyle = sub; ctx.lineWidth = w * 0.01; ctx.globalAlpha = 0.7
        ctx.beginPath(); ctx.moveTo(tx - w * 0.08, cy); ctx.lineTo(tx + w * 0.08, cy); ctx.stroke(); ctx.globalAlpha = 1
      }
      // 观景台
      ctx.fillStyle = sub; ctx.globalAlpha = 0.85
      ctx.beginPath(); ctx.arc(tx, ty - th * 0.72, w * 0.09, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(tx, ty - th * 0.72, w * 0.06, 0, Math.PI * 2); ctx.fill()
      // 塔尖
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.012
      ctx.beginPath(); ctx.moveTo(tx, ty - th); ctx.lineTo(tx, ty - th - h * 0.08); ctx.stroke()
      ctx.fillStyle = sub; ctx.beginPath(); ctx.arc(tx, ty - th - h * 0.08, w * 0.02, 0, Math.PI * 2); ctx.fill()
      break
    }
    case 6: {
      // 上海-东方明珠（球体+塔身+太空舱）
      const tx = cx2, ty = y + h * 0.78, th = h * 0.72
      // 塔身
      const sg = ctx.createLinearGradient(tx - w * 0.04, ty, tx + w * 0.04, ty)
      sg.addColorStop(0, color); sg.addColorStop(0.5, sub); sg.addColorStop(1, color)
      ctx.fillStyle = sg; ctx.fillRect(tx - w * 0.035, ty - th, w * 0.07, th)
      // 横撑
      for (let s = 0; s < 5; s++) {
        ctx.strokeStyle = color; ctx.lineWidth = w * 0.008; ctx.globalAlpha = 0.6
        ctx.beginPath(); ctx.moveTo(tx - w * 0.1, ty - s * th * 0.18); ctx.lineTo(tx + w * 0.1, ty - s * th * 0.18); ctx.stroke(); ctx.globalAlpha = 1
      }
      // 三球
      const balls = [{ r: 0.35, c: sub }, { r: 0.52, c: color }, { r: 0.7, c: sub }]
      balls.forEach(b => {
        const gy = ty - th * b.r
        const bg = ctx.createRadialGradient(tx - w * 0.04, gy - w * 0.04, 0, tx, gy, w * 0.08)
        bg.addColorStop(0, b.c); bg.addColorStop(1, color)
        ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(tx, gy, w * 0.08, 0, Math.PI * 2); ctx.fill()
        // 高光
        ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.35
        ctx.beginPath(); ctx.ellipse(tx - w * 0.02, gy - w * 0.025, w * 0.025, w * 0.015, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      })
      // 塔尖
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.012
      ctx.beginPath(); ctx.moveTo(tx, ty - th); ctx.lineTo(tx, ty - th - h * 0.08); ctx.stroke()
      ctx.fillStyle = sub; ctx.beginPath(); ctx.arc(tx, ty - th - h * 0.08, w * 0.018, 0, Math.PI * 2); ctx.fill()
      break
    }
    case 7: {
      // 南京-中山陵（蓝色琉璃+牌坊+陵门+祭堂）
      const bw = w * 0.75, bx = x + w * 0.125, by = y + h * 0.48, bh = h * 0.48
      const cx3 = bx + bw / 2
      // 陵门（3拱门）
      ctx.fillStyle = color; ctx.fillRect(cx3 - bw * 0.35, by - bh * 0.15, bw * 0.7, bh * 0.6)
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.85
      for (let m = 0; m < 3; m++) {
        ctx.beginPath(); ctx.arc(cx3 - bw * 0.2 + m * bw * 0.2, by + bh * 0.1, bw * 0.1, Math.PI, 0); ctx.fill()
      }
      ctx.globalAlpha = 1
      // 蓝色琉璃瓦顶
      ctx.fillStyle = sub; ctx.globalAlpha = 0.85
      ctx.beginPath(); ctx.moveTo(cx3 - bw * 0.4, by - bh * 0.15); ctx.quadraticCurveTo(cx3, by - bh * 0.4, cx3 + bw * 0.4, by - bh * 0.15); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      // 祭堂（上方）
      ctx.fillStyle = sub
      ctx.fillRect(cx3 - bw * 0.25, by - bh * 0.45, bw * 0.5, bh * 0.28)
      ctx.fillStyle = color; ctx.globalAlpha = 0.8
      ctx.beginPath(); ctx.moveTo(cx3 - bw * 0.3, by - bh * 0.45); ctx.quadraticCurveTo(cx3, by - bh * 0.75, cx3 + bw * 0.3, by - bh * 0.45); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      // 台阶
      for (let s = 0; s < 8; s++) {
        ctx.fillStyle = s % 2 === 0 ? color : sub; ctx.globalAlpha = 0.6
        ctx.fillRect(cx3 - bw * 0.3 + s * bw * 0.075, by + bh * 0.25, bw * 0.075, bh * 0.06); ctx.globalAlpha = 1
      }
      break
    }
    case 8: {
      // 杭州-雷峰塔（5层楼阁+黄色塔刹+西湖波光）
      const tx = cx2, ty = y + h * 0.82, th = h * 0.72
      // 西湖波光
      for (let w2 = 0; w2 < 5; w2++) {
        ctx.fillStyle = '#4fc3f7'; ctx.globalAlpha = 0.06 + w2 * 0.03
        ctx.beginPath(); ctx.moveTo(x, y + h * 0.85)
        for (let p = 0; p <= 12; p++) {
          ctx.lineTo(x + p * w / 12, y + h * 0.85 + Math.sin(p * 0.8 + w2 * 1.2) * h * 0.025)
        }
        ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      }
      // 5层塔身
      for (let p = 0; p < 5; p++) {
        const pw = w * (0.38 - p * 0.045), px = tx - pw / 2, py = ty - p * th * 0.16
        ctx.fillStyle = p % 2 === 0 ? color : sub; ctx.globalAlpha = 0.85
        ctx.fillRect(px, py, pw, th * 0.14)
        // 飞檐
        ctx.fillStyle = sub; ctx.globalAlpha = 0.75
        ctx.beginPath(); ctx.moveTo(px - w * 0.015, py); ctx.quadraticCurveTo(px - w * 0.03, py - th * 0.05, px, py - th * 0.06); ctx.quadraticCurveTo(px + pw + w * 0.03, py - th * 0.05, px + pw + w * 0.015, py); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      }
      // 攒尖顶+塔刹
      ctx.fillStyle = sub
      ctx.beginPath(); ctx.moveTo(tx - w * 0.06, ty - th + th * 0.16); ctx.lineTo(tx, ty - th - th * 0.12); ctx.lineTo(tx + w * 0.06, ty - th + th * 0.16); ctx.closePath(); ctx.fill()
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.012
      ctx.beginPath(); ctx.moveTo(tx, ty - th - th * 0.12); ctx.lineTo(tx, ty - th - th * 0.26); ctx.stroke()
      ctx.fillStyle = sub; ctx.beginPath(); ctx.arc(tx, ty - th - th * 0.26, w * 0.025, 0, Math.PI * 2); ctx.fill()
      break
    }
    case 9: {
      // 苏州-拙政园（亭台楼阁+曲桥+假山+漏窗）
      const bw = w * 0.8, bx = x + w * 0.1, by = y + h * 0.52, bh = h * 0.4
      const cx3 = bx + bw / 2
      // 水面
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.55; ctx.fillRect(bx, by + bh * 0.75, bw, bh * 0.25); ctx.globalAlpha = 1
      // 曲桥
      ctx.strokeStyle = color; ctx.lineWidth = w * 0.018; ctx.globalAlpha = 0.7
      ctx.beginPath(); ctx.moveTo(bx + bw * 0.2, by + bh * 0.85); ctx.quadraticCurveTo(cx3, by + bh * 0.65, bx + bw * 0.8, by + bh * 0.85); ctx.stroke(); ctx.globalAlpha = 1
      // 假山
      ctx.fillStyle = sub; ctx.globalAlpha = 0.65
      ctx.beginPath(); ctx.moveTo(bx + bw * 0.05, by + bh * 0.75); ctx.quadraticCurveTo(bx + bw * 0.2, by + bh * 0.3, bx + bw * 0.35, by + bh * 0.75); ctx.closePath(); ctx.fill()
      ctx.globalAlpha = 1
      // 主亭
      ctx.fillStyle = color
      ctx.fillRect(cx3 - w * 0.12, by - bh * 0.1, w * 0.24, bh * 0.65)
      ctx.fillStyle = sub; ctx.globalAlpha = 0.8
      ctx.beginPath(); ctx.moveTo(cx3 - w * 0.18, by - bh * 0.1); ctx.quadraticCurveTo(cx3, by - bh * 0.45, cx3 + w * 0.18, by - bh * 0.1); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      // 左右小亭
      for (let s = -1; s <= 1; s += 2) {
        const sx = cx3 + s * bw * 0.3
        ctx.fillStyle = color; ctx.fillRect(sx - w * 0.07, by + bh * 0.1, w * 0.14, bh * 0.45)
        ctx.fillStyle = sub; ctx.globalAlpha = 0.7
        ctx.beginPath(); ctx.arc(sx, by + bh * 0.05, w * 0.09, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1
      }
      break
    }
    case 10: {
      // 济南-大明湖（超然楼+杨柳岸+湖面+荷花）
      const bw = w * 0.8, bx = x + w * 0.1, by = y + h * 0.5, bh = h * 0.45
      const cx3 = bx + bw / 2
      // 湖面
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.6; ctx.fillRect(bx, by + bh * 0.7, bw, bh * 0.3); ctx.globalAlpha = 1
      // 杨柳
      for (let n = 0; n < 4; n++) {
        const nx = bx + n * bw / 3.5
        ctx.strokeStyle = sub; ctx.lineWidth = w * 0.006
        ctx.beginPath(); ctx.moveTo(nx, by + bh * 0.7); ctx.quadraticCurveTo(nx + w * 0.03, by + bh * 0.3, nx - w * 0.02, by + bh * 0.05); ctx.stroke()
        ctx.fillStyle = color; ctx.globalAlpha = 0.35
        ctx.beginPath(); ctx.ellipse(nx - w * 0.01, by + bh * 0.2, w * 0.025, w * 0.012, -0.3, 0, Math.PI * 2); ctx.fill()
        ctx.globalAlpha = 1
      }
      // 超然楼
      ctx.fillStyle = color; ctx.fillRect(cx3 - w * 0.12, by - bh * 0.05, w * 0.24, bh * 0.7)
      // 多层飞檐
      for (let r = 0; r < 3; r++) {
        ctx.fillStyle = sub; ctx.globalAlpha = 0.8
        ctx.beginPath(); ctx.moveTo(cx3 - w * 0.15 + r * w * 0.01, by - bh * 0.05 - r * bh * 0.15); ctx.quadraticCurveTo(cx3, by - bh * 0.05 - r * bh * 0.15 - bh * 0.1, cx3 + w * 0.15 - r * w * 0.01, by - bh * 0.05 - r * bh * 0.15); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      }
      // 荷花
      for (let f = 0; f < 3; f++) {
        const fx = bx + bw * (0.25 + f * 0.25)
        ctx.fillStyle = sub; ctx.globalAlpha = 0.7
        ctx.beginPath(); ctx.ellipse(fx, by + bh * 0.82, w * 0.04, w * 0.02, 0, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = color; ctx.globalAlpha = 0.6
        ctx.beginPath(); ctx.ellipse(fx, by + bh * 0.8, w * 0.02, w * 0.012, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      }
      break
    }
    case 11: {
      // 青岛-栈桥+回澜阁（长堤+回澜阁+浪花）
      const bw = w * 0.85, bx = x + w * 0.075, by = y + h * 0.65, bh = h * 0.3
      // 浪花
      for (let wave = 0; wave < 4; wave++) {
        ctx.fillStyle = '#4fc3f7'; ctx.globalAlpha = 0.05 + wave * 0.04
        ctx.beginPath(); ctx.moveTo(x, by + bh * 0.5)
        for (let p = 0; p <= 12; p++) {
          ctx.lineTo(x + p * w / 12, by + bh * 0.5 + Math.sin(p * 0.7 + wave * 1.5) * bh * 0.22)
        }
        ctx.lineTo(x + w, by + bh); ctx.lineTo(x, by + bh); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      }
      // 栈桥堤
      ctx.fillStyle = color; ctx.globalAlpha = 0.8
      ctx.fillRect(bx + bw * 0.15, by - bh * 0.1, bw * 0.7, bh * 0.35)
      ctx.globalAlpha = 1
      // 回澜阁
      const hx = bx + bw * 0.85, hy = by - bh * 0.1, hh = bh * 0.7
      ctx.fillStyle = sub
      ctx.fillRect(hx - w * 0.08, hy - hh * 0.5, w * 0.16, hh * 0.5)
      ctx.fillStyle = color; ctx.globalAlpha = 0.8
      ctx.beginPath(); ctx.moveTo(hx - w * 0.1, hy - hh * 0.5); ctx.quadraticCurveTo(hx, hy - hh * 0.85, hx + w * 0.1, hy - hh * 0.5); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      // 阁顶尖
      ctx.fillStyle = sub
      ctx.beginPath(); ctx.moveTo(hx - w * 0.06, hy - hh * 0.5); ctx.lineTo(hx, hy - hh * 0.72); ctx.lineTo(hx + w * 0.06, hy - hh * 0.5); ctx.closePath(); ctx.fill()
      break
    }
    case 12: {
      // 广州-广州塔（小蛮腰+斜撑+天线）
      const tx = cx2, ty = y + h * 0.78, th = h * 0.72
      // 塔身（椭圆渐变）
      const tg = ctx.createLinearGradient(tx - w * 0.1, ty, tx + w * 0.1, ty)
      tg.addColorStop(0, color); tg.addColorStop(0.3, sub); tg.addColorStop(0.7, color); tg.addColorStop(1, sub)
      ctx.fillStyle = tg
      ctx.beginPath(); ctx.moveTo(tx - w * 0.07, ty); ctx.quadraticCurveTo(tx - w * 0.025, ty - th * 0.5, tx - w * 0.06, ty - th); ctx.lineTo(tx + w * 0.06, ty - th); ctx.quadraticCurveTo(tx + w * 0.025, ty - th * 0.5, tx + w * 0.07, ty); ctx.closePath(); ctx.fill()
      // 斜撑
      for (let s = 0; s < 3; s++) {
        const sy = ty - s * th * 0.25, sy2 = ty - (s + 1) * th * 0.25
        ctx.strokeStyle = color; ctx.lineWidth = w * 0.012; ctx.globalAlpha = 0.7
        ctx.beginPath(); ctx.moveTo(tx - w * 0.1, sy); ctx.lineTo(tx + w * 0.1, sy2); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(tx + w * 0.1, sy); ctx.lineTo(tx - w * 0.1, sy2); ctx.stroke(); ctx.globalAlpha = 1
      }
      // 天线
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.015
      ctx.beginPath(); ctx.moveTo(tx, ty - th); ctx.lineTo(tx, ty - th - h * 0.1); ctx.stroke()
      ctx.fillStyle = sub; ctx.beginPath(); ctx.arc(tx, ty - th - h * 0.1, w * 0.025, 0, Math.PI * 2); ctx.fill()
      break
    }
    case 13: {
      // 深圳-平安金融中心（玻璃幕墙+钢结构+光带）
      const tx = cx2, ty = y + h * 0.78, th = h * 0.72
      // 塔身
      const tg = ctx.createLinearGradient(tx - w * 0.08, ty, tx + w * 0.08, ty)
      tg.addColorStop(0, color); tg.addColorStop(0.5, sub); tg.addColorStop(1, color)
      ctx.fillStyle = tg
      ctx.beginPath(); ctx.moveTo(tx - w * 0.06, ty); ctx.lineTo(tx + w * 0.06, ty); ctx.lineTo(tx + w * 0.012, ty - th); ctx.lineTo(tx - w * 0.012, ty - th); ctx.closePath(); ctx.fill()
      // 玻璃幕墙横纹
      for (let g = 0; g < 8; g++) {
        ctx.strokeStyle = color; ctx.globalAlpha = 0.25; ctx.lineWidth = w * 0.005
        ctx.beginPath(); ctx.moveTo(tx - w * 0.058, ty - g * th * 0.1); ctx.lineTo(tx + w * 0.058, ty - g * th * 0.1); ctx.stroke(); ctx.globalAlpha = 1
      }
      // 光带
      for (let l = 0; l < 3; l++) {
        const ly = ty - th * (0.3 + l * 0.2)
        ctx.fillStyle = sub; ctx.globalAlpha = 0.5 + l * 0.15
        ctx.fillRect(tx - w * 0.05, ly - w * 0.006, w * 0.1, w * 0.012); ctx.globalAlpha = 1
      }
      // 塔尖
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.012
      ctx.beginPath(); ctx.moveTo(tx, ty - th); ctx.lineTo(tx, ty - th - h * 0.1); ctx.stroke()
      ctx.fillStyle = sub; ctx.beginPath(); ctx.arc(tx, ty - th - h * 0.1, w * 0.02, 0, Math.PI * 2); ctx.fill()
      break
    }
    case 14: {
      // 武汉-黄鹤楼（5层攒尖顶+琉璃瓦+飞檐）
      const tx = cx2, ty = y + h * 0.86, th = h * 0.72
      ctx.fillStyle = sub
      for (let p = 0; p < 5; p++) {
        const pw = w * (0.42 - p * 0.06), ph = th * 0.16
        const px = tx - pw / 2, py = ty - p * th * 0.16
        ctx.fillRect(px, py, pw, ph)
        ctx.fillStyle = p % 2 === 0 ? color : sub; ctx.globalAlpha = 0.7
        ctx.beginPath(); ctx.moveTo(px - w * 0.015, py); ctx.quadraticCurveTo(px - w * 0.03, py - ph * 0.3, px, py - ph * 0.4); ctx.quadraticCurveTo(px + pw + w * 0.03, py - ph * 0.3, px + pw + w * 0.015, py); ctx.lineTo(px + pw + w * 0.015, py + ph * 0.06); ctx.lineTo(px - w * 0.015, py + ph * 0.06); ctx.closePath(); ctx.fill()
        ctx.globalAlpha = 1; ctx.fillStyle = sub
      }
      ctx.beginPath(); ctx.moveTo(tx - w * 0.06, ty - th + th * 0.16); ctx.lineTo(tx, ty - th - th * 0.12); ctx.lineTo(tx + w * 0.06, ty - th + th * 0.16); ctx.closePath(); ctx.fill()
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.012
      ctx.beginPath(); ctx.moveTo(tx, ty - th - th * 0.12); ctx.lineTo(tx, ty - th - th * 0.26); ctx.stroke()
      ctx.fillStyle = sub; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(tx, ty - th - th * 0.26, w * 0.025, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      break
    }
    case 15: {
      // 长沙-岳麓书院（牌坊+厢房+飞檐+灯笼）
      const bw = w * 0.84, bx = x + w * 0.08, by = y + h * 0.58, bh = h * 0.38
      const cx3 = bx + bw / 2
      ctx.fillStyle = sub; ctx.globalAlpha = 0.5; ctx.fillRect(bx, by + bh * 0.85, bw, bh * 0.15); ctx.globalAlpha = 1
      ctx.fillStyle = color; ctx.fillRect(bx, by + bh * 0.2, bw * 0.28, bh * 0.65); ctx.fillRect(bx + bw * 0.72, by + bh * 0.2, bw * 0.28, bh * 0.65)
      ctx.fillStyle = sub; ctx.fillRect(cx3 - bw * 0.14, by - bh * 0.15, bw * 0.28, bh * 0.75)
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(cx3, by - bh * 0.15, bw * 0.1, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1
      ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(cx3 - bw * 0.18, by - bh * 0.15); ctx.quadraticCurveTo(cx3 - bw * 0.24, by - bh * 0.42, cx3 - bw * 0.14, by - bh * 0.3); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx3 + bw * 0.18, by - bh * 0.15); ctx.quadraticCurveTo(cx3 + bw * 0.24, by - bh * 0.42, cx3 + bw * 0.14, by - bh * 0.3); ctx.closePath(); ctx.fill()
      for (let e = -1; e <= 1; e += 2) {
        ctx.fillStyle = '#ff5722'; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(cx3 + e * bw * 0.16, by - bh * 0.1, w * 0.02, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      }
      break
    }
    case 16: {
      // 厦门-鼓浪屿（日光岩+波浪+郑成功雕像）
      const bw = w, bx = x, by = y + h * 0.72, bh = h * 0.22
      for (let wave = 0; wave < 4; wave++) {
        ctx.save(); ctx.globalAlpha = 0.08 + wave * 0.04; ctx.fillStyle = '#4fc3f7'
        ctx.beginPath(); ctx.moveTo(bx, by + bh * 0.6)
        for (let wi = 0; wi <= 16; wi++) {
          ctx.lineTo(bx + wi * bw / 16, by + bh * 0.6 + Math.sin(wi * 0.7 + wave * 1.3) * bh * 0.25)
        }
        ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx, by + bh); ctx.closePath(); ctx.fill(); ctx.restore()
      }
      ctx.fillStyle = color
      ctx.beginPath(); ctx.moveTo(bx + bw * 0.2, by - bh * 0.05); ctx.lineTo(bx + bw * 0.38, by - bh * 0.95); ctx.lineTo(bx + bw * 0.58, by - bh * 0.05); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(bx + bw * 0.1, by - bh * 0.05); ctx.lineTo(bx + bw * 0.2, by - bh * 0.6); ctx.lineTo(bx + bw * 0.3, by - bh * 0.05); ctx.closePath(); ctx.fill()
      ctx.fillStyle = sub; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(cx2 + bw * 0.18, by - bh * 1.35, w * 0.04, 0, Math.PI * 2); ctx.fill()
      ctx.fillRect(cx2 + bw * 0.16, by - bh * 1.32, w * 0.04, bh * 0.32)
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.01
      ctx.beginPath(); ctx.moveTo(cx2 + bw * 0.18, by - bh * 1.2); ctx.lineTo(cx2 + bw * 0.28, by - bh * 1.5); ctx.stroke()
      ctx.globalAlpha = 1
      break
    }
    case 17: {
      // 郑州-二七纪念塔（双塔并立+层层出檐+尖顶）
      const ty2 = y + h * 0.88, th2 = h * 0.75
      for (let s = -1; s <= 1; s += 2) {
        const ox = cx2 + s * w * 0.12
        for (let p = 0; p < 12; p++) {
          const pw = w * ((p < 6 ? p + 1 : 13 - p) * 0.012 + 0.04)
          const ph = th2 * 0.08
          ctx.fillStyle = p % 2 === 0 ? sub : color
          ctx.fillRect(ox - pw / 2, ty2 - p * th2 * 0.08, pw, ph)
        }
        ctx.fillStyle = sub
        ctx.beginPath(); ctx.moveTo(ox - w * 0.03, ty2 - th2); ctx.lineTo(ox, ty2 - th2 - w * 0.06); ctx.lineTo(ox + w * 0.03, ty2 - th2); ctx.closePath(); ctx.fill()
        ctx.strokeStyle = color; ctx.lineWidth = w * 0.006
        ctx.beginPath(); ctx.moveTo(ox, ty2 - th2 - w * 0.06); ctx.lineTo(ox, ty2 - th2 - w * 0.14); ctx.stroke()
      }
      break
    }
    case 18: {
      // 重庆-洪崖洞（吊脚楼×9层+万家灯火）
      const bw2 = w, bx2 = x, by2 = y + h * 0.58, bh2 = h * 0.38
      ctx.fillStyle = color
      for (let p = 0; p < 9; p++) {
        const ph = bh2 * 0.11, py = by2 + p * ph
        const xOff = p % 2 === 0 ? 0 : bw2 * 0.04
        const pw = bw2 * (p % 2 === 0 ? 0.88 : 0.92)
        ctx.fillRect(bx2 + xOff, py, pw, ph * 0.88)
        for (let wi = 0; wi < 5; wi++) {
          const wx2 = bx2 + xOff + wi * pw * 0.18 + pw * 0.06
          const wy = py + ph * 0.22
          ctx.save(); ctx.globalAlpha = 0.5 + (p % 3) * 0.15
          ctx.fillStyle = (wi + p) % 3 === 0 ? '#ffe066' : (wi + p) % 3 === 1 ? '#ff8a65' : '#ffcc02'
          ctx.beginPath(); ctx.rect(wx2, wy, pw * 0.1, ph * 0.42); ctx.fill(); ctx.restore()
        }
      }
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.008
      ctx.beginPath(); ctx.moveTo(bx2, by2); ctx.quadraticCurveTo(bx2 - bw2 * 0.04, by2 - bh2 * 0.08, bx2 + bw2 * 0.06, by2 - bh2 * 0.04); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(bx2 + bw2, by2); ctx.quadraticCurveTo(bx2 + bw2 * 1.04, by2 - bh2 * 0.08, bx2 + bw2 * 0.94, by2 - bh2 * 0.04); ctx.stroke()
      break
    }
    case 19: {
      // 成都-大熊猫（国宝+竹子+竹林）
      const px = cx2, py = y + h * 0.52, ps = h * 0.25
      ctx.strokeStyle = color; ctx.globalAlpha = 0.35; ctx.lineWidth = w * 0.008
      for (let b = 0; b < 5; b++) {
        const bx3 = x + w * (0.12 + b * 0.2)
        ctx.beginPath(); ctx.moveTo(bx3, y + h * 0.85); ctx.quadraticCurveTo(bx3 + w * 0.04, y + h * 0.45, bx3 - w * 0.02, y + h * 0.1); ctx.stroke()
        ctx.fillStyle = color; ctx.globalAlpha = 0.35
        ctx.beginPath(); ctx.ellipse(bx3 - w * 0.015, y + h * 0.22, w * 0.035, w * 0.018, -0.4, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(bx3 + w * 0.025, y + h * 0.35, w * 0.03, w * 0.015, 0.3, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = '#f5f5f5'; ctx.beginPath(); ctx.ellipse(px, py, ps * 0.55, ps * 0.38, 0, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(px, py - ps * 0.45, ps * 0.42, ps * 0.38, 0, 0, Math.PI * 2); ctx.fill()
      for (let s = -1; s <= 1; s += 2) {
        ctx.beginPath(); ctx.arc(px + s * ps * 0.28, py - ps * 0.55, ps * 0.18, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#222222'; ctx.beginPath(); ctx.arc(px + s * ps * 0.3, py - ps * 0.58, ps * 0.055, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#f5f5f5'; ctx.beginPath(); ctx.arc(px + s * ps * 0.25, py - ps * 0.62, ps * 0.035, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(px + s * ps * 0.3, py - ps * 0.62, ps * 0.055, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#222222'; ctx.beginPath(); ctx.arc(px + s * ps * 0.3, py - ps * 0.58, ps * 0.028, 0, Math.PI * 2); ctx.fill()
      }
      ctx.fillStyle = '#222222'; ctx.beginPath(); ctx.ellipse(px, py - ps * 0.38, ps * 0.05, ps * 0.035, 0, 0, Math.PI * 2); ctx.fill()
      for (let b2 = 0; b2 < 2; b2++) {
        const bx4 = x + w * (0.2 + b2 * 0.6)
        ctx.beginPath(); ctx.moveTo(bx4, py + ps * 0.8); ctx.quadraticCurveTo(bx4 + w * 0.05, py + ps * 0.2, bx4 - w * 0.02, y + h * 0.08); ctx.stroke()
        ctx.fillStyle = sub
        for (let n = 0; n < 4; n++) {
          const ny = py + ps * 0.7 - n * ps * 0.22
          ctx.beginPath(); ctx.ellipse(bx4, ny, w * 0.038, w * 0.016, -0.5 + n * 0.2, 0, Math.PI * 2); ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      break
    }
    case 20: {
      // 西安-钟楼（重檐方亭+攒尖顶+飞檐翘角）
      const tx = cx2, tw = w * 0.52, ty2 = y + h * 0.65, th2 = h * 0.32
      for (let s = 0; s < 3; s++) {
        ctx.fillStyle = s === 1 ? sub : color; ctx.globalAlpha = s === 1 ? 0.8 : 1
        ctx.fillRect(tx - tw / 2 - s * w * 0.012, ty2 + bh2 * 0.6 - s * bh2 * 0.18, tw + s * w * 0.024, bh2 * 0.18); ctx.globalAlpha = 1
      }
      ctx.fillStyle = sub
      ctx.fillRect(tx - tw / 2, ty2, tw, bh2 * 0.55)
      ctx.fillStyle = color; ctx.globalAlpha = 0.8
      ctx.beginPath(); ctx.moveTo(tx - tw / 2 - w * 0.02, ty2); ctx.quadraticCurveTo(tx, ty2 - bh2 * 0.4, tx + tw / 2 + w * 0.02, ty2); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      // 攒尖顶
      ctx.fillStyle = sub
      ctx.beginPath(); ctx.moveTo(tx - tw / 2, ty2 - bh2 * 0.1); ctx.lineTo(tx, ty2 - bh2 * 0.5); ctx.lineTo(tx + tw / 2, ty2 - bh2 * 0.1); ctx.closePath(); ctx.fill()
      ctx.strokeStyle = color; ctx.lineWidth = w * 0.012
      ctx.beginPath(); ctx.moveTo(tx, ty2 - bh2 * 0.5); ctx.lineTo(tx, ty2 - bh2 * 0.65); ctx.stroke()
      ctx.fillStyle = sub; ctx.beginPath(); ctx.arc(tx, ty2 - bh2 * 0.65, w * 0.02, 0, Math.PI * 2); ctx.fill()
      break
    }
    case 21: {
      // 昆明-石林（石峰群+纹理+天空）
      const bw2 = w * 0.85, bx2 = x + w * 0.075, by2 = y + h * 0.72, bh2 = h * 0.25
      // 天空渐变
      const kg = ctx.createLinearGradient(x, y, x, by2)
      kg.addColorStop(0, '#0a0e1a'); kg.addColorStop(1, color)
      ctx.fillStyle = kg; ctx.globalAlpha = 0.5; ctx.fillRect(x, y, w, by2); ctx.globalAlpha = 1
      // 石峰
      for (let p = 0; p < 7; p++) {
        const px = bx2 + p * bw2 / 6, ph = bh2 * (0.5 + (p % 3) * 0.25 + (p % 2) * 0.15)
        ctx.fillStyle = p % 3 === 0 ? sub : color
        ctx.beginPath(); ctx.moveTo(px - bw2 * 0.08, by2); ctx.quadraticCurveTo(px - bw2 * 0.03, by2 - ph, px, by2 - ph - bh2 * 0.08); ctx.quadraticCurveTo(px + bw2 * 0.03, by2 - ph, px + bw2 * 0.08, by2); ctx.closePath(); ctx.fill()
        // 纹理线
        ctx.strokeStyle = sub; ctx.globalAlpha = 0.4; ctx.lineWidth = w * 0.005
        for (let t = 0; t < 3; t++) {
          ctx.beginPath(); ctx.moveTo(px - bw2 * 0.05 + t * bw2 * 0.025, by2); ctx.lineTo(px - bw2 * 0.02 + t * bw2 * 0.01, by2 - ph * 0.7); ctx.stroke()
        }
        ctx.globalAlpha = 1
      }
      break
    }
    case 22: {
      // 拉萨-布达拉宫（红白宫墙+金顶+台阶）
      const bw2 = w * 0.7, bx2 = x + w * 0.15, by2 = y + h * 0.42, bh2 = h * 0.55
      const cx3 = bx2 + bw2 / 2
      // 白宫
      ctx.fillStyle = '#f5f5f5'; ctx.fillRect(bx2, by2 + bh2 * 0.45, bw2, bh2 * 0.55)
      // 红宫
      ctx.fillStyle = color; ctx.fillRect(bx2 + bw2 * 0.1, by2, bw2 * 0.8, bh2 * 0.5)
      // 台阶
      for (let s = 0; s < 6; s++) {
        ctx.fillStyle = '#d4c5a9'; ctx.globalAlpha = 0.7
        ctx.fillRect(cx3 - bw2 * 0.25 + s * bw2 * 0.08, by2 + bh2 * 0.85, bw2 * 0.08, bh2 * 0.15); ctx.globalAlpha = 1
      }
      // 金顶群
      for (let g = 0; g < 3; g++) {
        const gx = bx2 + bw2 * (0.2 + g * 0.3), gy = by2 + g * bh2 * 0.08
        ctx.fillStyle = sub; ctx.globalAlpha = 0.9
        ctx.beginPath(); ctx.moveTo(gx - w * 0.06, gy); ctx.quadraticCurveTo(gx, gy - bh2 * 0.12, gx + w * 0.06, gy); ctx.closePath(); ctx.fill()
        ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.7
        ctx.beginPath(); ctx.arc(gx, gy - bh2 * 0.04, w * 0.02, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      }
      // 金顶主塔
      ctx.fillStyle = sub; ctx.beginPath(); ctx.moveTo(cx3 - w * 0.08, by2); ctx.quadraticCurveTo(cx3, by2 - bh2 * 0.18, cx3 + w * 0.08, by2); ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(cx3, by2 - bh2 * 0.06, w * 0.025, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      break
    }
    case 23: {
      // 乌鲁木齐-国际大巴扎（圆顶+尖塔+集市）
      const bw2 = w * 0.75, bx2 = x + w * 0.125, by2 = y + h * 0.48, bh2 = h * 0.48
      const cx3 = bx2 + bw2 / 2
      // 底座
      ctx.fillStyle = color; ctx.globalAlpha = 0.6; ctx.fillRect(bx2, by2 + bh2 * 0.75, bw2, bh2 * 0.25); ctx.globalAlpha = 1
      // 集市拱廊
      for (let a = 0; a < 5; a++) {
        const ax = bx2 + a * bw2 / 4
        ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.85
        ctx.beginPath(); ctx.arc(ax + bw2 / 8, by2 + bh2 * 0.82, w * 0.05, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1
      }
      // 中央圆顶
      ctx.fillStyle = sub; ctx.globalAlpha = 0.9
      ctx.beginPath(); ctx.arc(cx3, by2 + bh2 * 0.3, w * 0.14, Math.PI, 0); ctx.fill()
      ctx.fillStyle = color; ctx.globalAlpha = 0.8
      ctx.beginPath(); ctx.arc(cx3, by2 + bh2 * 0.3, w * 0.09, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      // 圆顶尖
      ctx.fillStyle = sub; ctx.beginPath(); ctx.arc(cx3, by2 + bh2 * 0.1, w * 0.04, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = sub; ctx.lineWidth = w * 0.015
      ctx.beginPath(); ctx.moveTo(cx3, by2 + bh2 * 0.1); ctx.lineTo(cx3, by2 - bh2 * 0.15); ctx.stroke()
      // 左右尖塔
      for (let s = -1; s <= 1; s += 2) {
        const sx = cx3 + s * bw2 * 0.35
        ctx.fillStyle = color; ctx.fillRect(sx - w * 0.015, by2, w * 0.03, bh2 * 0.65)
        ctx.fillStyle = sub; ctx.globalAlpha = 0.85
        ctx.beginPath(); ctx.moveTo(sx - w * 0.03, by2); ctx.quadraticCurveTo(sx, by2 - bh2 * 0.3, sx + w * 0.03, by2); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
        ctx.strokeStyle = sub; ctx.lineWidth = w * 0.012
        ctx.beginPath(); ctx.moveTo(sx, by2 - bh2 * 0.2); ctx.lineTo(sx, by2 - bh2 * 0.38); ctx.stroke()
      }
      break
    }
    default: {
      // 默认：城市天际线
      for (let b = 0; b < 9; b++) {
        const bx2 = x + b * w / 9
        const bh3 = h * (0.12 + (b % 4) * 0.1)
        ctx.fillStyle = b % 2 === 0 ? color : sub
        ctx.globalAlpha = 0.7 + (b % 3) * 0.1
        ctx.fillRect(bx2 + 2, y + h - bh3, w / 9 - 4, bh3)
        ctx.globalAlpha = 1
      }
      break
    }
  }
  ctx.restore()
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
