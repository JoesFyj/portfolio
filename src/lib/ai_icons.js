// ============================================================
// AI 图标选项数据
// ============================================================
export const AI_ICON_OPTIONS = [
  { id: 0, group: '大模型', label: 'ChatGPT', desc: '对话AI', accent: '#10a300', accent2: '#7ecf35' },
  { id: 1, group: '大模型', label: 'Claude', desc: 'Anthropic', accent: '#c4722a', accent2: '#f0a050' },
  { id: 2, group: '大模型', label: 'Gemini', desc: 'Google', accent: '#4e9af1', accent2: '#93c5fd' },
  { id: 3, group: '大模型', label: 'DeepSeek', desc: '深度求索', accent: '#1e90ff', accent2: '#00b4d8' },
  { id: 4, group: 'AI工具', label: 'Midjourney', desc: 'AI绘画', accent: '#a855f7', accent2: '#d946ef' },
  { id: 5, group: 'AI工具', label: 'StableDiff', desc: '开源绘图', accent: '#ef4444', accent2: '#f97316' },
  { id: 6, group: 'AI工具', label: 'DALL·E', desc: 'OpenAI绘画', accent: '#ec4899', accent2: '#f472b6' },
  { id: 7, group: 'AI工具', label: 'Sora', desc: '视频生成', accent: '#f43f5e', accent2: '#fb7185' },
  { id: 8, group: '搜索代码', label: 'Perplexity', desc: 'AI搜索', accent: '#f59e0b', accent2: '#fbbf24' },
  { id: 9, group: '搜索代码', label: 'Cursor', desc: 'AI编程', accent: '#22c55e', accent2: '#86efac' },
  { id: 10, group: '搜索代码', label: 'Copilot', desc: '代码助手', accent: '#8b5cf6', accent2: '#a78bfa' },
  { id: 11, group: '搜索代码', label: 'Grok', desc: 'xAI', accent: '#f59e0b', accent2: '#fcd34d' },
  { id: 12, group: '开源模型', label: 'LLaMA', desc: 'Meta开源', accent: '#f97316', accent2: '#fdba74' },
  { id: 13, group: '开源模型', label: 'Gemma', desc: 'Google开源', accent: '#3b82f6', accent2: '#60a5fa' },
  { id: 14, group: '开源模型', label: 'Mistral', desc: '欧洲模型', accent: '#f97316', accent2: '#fb923c' },
  { id: 15, group: '开源模型', label: 'Qwen', desc: '通义千问', accent: '#f59e0b', accent2: '#fcd34d' },
  { id: 16, group: '中国AI', label: 'Kimi', desc: '月之暗面', accent: '#6366f1', accent2: '#818cf8' },
  { id: 17, group: '中国AI', label: '豆包', desc: '字节AI', accent: '#ef4444', accent2: '#f87171' },
  { id: 18, group: '中国AI', label: '文心一言', desc: '百度', accent: '#22c55e', accent2: '#4ade80' },
  { id: 19, group: '中国AI', label: '通义千问', desc: '阿里', accent: '#f59e0b', accent2: '#fcd34d' },
  { id: 20, group: '中国AI', label: '讯飞星火', desc: '科大讯飞', accent: '#f97316', accent2: '#fb923c' },
  { id: 21, group: '科技公司', label: 'NVIDIA', desc: '英伟达', accent: '#22c55e', accent2: '#4ade80' },
  { id: 22, group: '科技公司', label: 'Tesla', desc: '特斯拉', accent: '#ef4444', accent2: '#f87171' },
  { id: 23, group: '科技公司', label: 'Apple', desc: '苹果', accent: '#f5f5f7', accent2: '#d1d5db' },
]

// ============================================================
// AI 图标剪影绘制（供封面/缩略图复用）
// ============================================================
function drawAISilhouette(ctx, id, x, y, w, h, color, accent) {
  ctx.save()
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const cx2 = x + w / 2

  switch (id) {
    // 0: ChatGPT - 对话气泡+闪电
    case 0: {
      const bx = x + w * 0.15, by = y + h * 0.1, bw = w * 0.7, bh = h * 0.75
      const cx3 = bx + bw / 2
      // 气泡
      ctx.beginPath(); ctx.roundRect(bx, by, bw, bh * 0.75, w * 0.08); ctx.fill()
      // 气泡尾巴
      ctx.beginPath(); ctx.moveTo(cx3 - w * 0.06, by + bh * 0.75); ctx.lineTo(cx3 - w * 0.12, by + bh * 0.88); ctx.lineTo(cx3 + w * 0.02, by + bh * 0.75); ctx.fill()
      // GPT文字（横线表示）
      ctx.fillStyle = accent; ctx.globalAlpha = 0.9
      ctx.fillRect(bx + bw * 0.15, by + bh * 0.2, bw * 0.7, w * 0.025)
      ctx.fillRect(bx + bw * 0.15, by + bh * 0.35, bw * 0.5, w * 0.025)
      ctx.fillRect(bx + bw * 0.15, by + bh * 0.5, bw * 0.65, w * 0.025)
      ctx.globalAlpha = 1
      // 闪电
      ctx.fillStyle = accent
      ctx.beginPath(); ctx.moveTo(cx3 + w * 0.15, by - h * 0.08); ctx.lineTo(cx3 + w * 0.08, by + h * 0.02); ctx.lineTo(cx3 + w * 0.12, by + h * 0.02); ctx.lineTo(cx3 + w * 0.05, by + h * 0.12); ctx.closePath(); ctx.fill()
      break
    }
    // 1: Claude - A字母（古典衬线体风格）
    case 1: {
      const ax = cx2, ay = y + h * 0.15, ah = h * 0.75, aw = w * 0.55
      ctx.fillStyle = color
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - aw, ay + ah); ctx.lineTo(ax + aw, ay + ah); ctx.closePath(); ctx.fill()
      ctx.fillStyle = accent; ctx.globalAlpha = 0.85
      ctx.beginPath(); ctx.moveTo(ax, ay + ah * 0.18); ctx.lineTo(ax - aw * 0.5, ay + ah); ctx.lineTo(ax + aw * 0.5, ay + ah); ctx.closePath(); ctx.fill()
      ctx.globalAlpha = 1
      // 横杠
      ctx.fillStyle = color
      ctx.fillRect(ax - aw * 0.42, ay + ah * 0.42, aw * 0.84, ah * 0.06)
      break
    }
    // 2: Gemini - 双星轨道
    case 2: {
      // 外圈
      ctx.save()
      ctx.beginPath(); ctx.ellipse(cx2, y + h * 0.5, w * 0.38, h * 0.28, 0, 0, Math.PI * 2)
      ctx.strokeStyle = color; ctx.lineWidth = w * 0.04; ctx.globalAlpha = 0.6; ctx.stroke(); ctx.globalAlpha = 1
      ctx.restore()
      // 轨道2（倾斜）
      ctx.save()
      ctx.translate(cx2, y + h * 0.5); ctx.rotate(0.6)
      ctx.beginPath(); ctx.ellipse(0, 0, w * 0.25, h * 0.18, 0, 0, Math.PI * 2)
      ctx.strokeStyle = accent; ctx.lineWidth = w * 0.025; ctx.globalAlpha = 0.7; ctx.stroke(); ctx.globalAlpha = 1
      ctx.restore()
      // 核心圆
      ctx.fillStyle = accent
      ctx.beginPath(); ctx.arc(cx2, y + h * 0.5, w * 0.1, 0, Math.PI * 2); ctx.fill()
      // 节点
      ctx.fillStyle = color
      ctx.beginPath(); ctx.arc(cx2 + w * 0.35, y + h * 0.38, w * 0.055, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(cx2 - w * 0.2, y + h * 0.65, w * 0.04, 0, Math.PI * 2); ctx.fill()
      break
    }
    // 3: DeepSeek - 放大镜+大脑网络
    case 3: {
      const dx = cx2 - w * 0.1, dy = y + h * 0.35, dr = w * 0.28
      // 镜框
      ctx.beginPath(); ctx.arc(dx, dy, dr, 0, Math.PI * 2)
      ctx.strokeStyle = color; ctx.lineWidth = w * 0.06; ctx.stroke()
      // 镜柄
      ctx.strokeStyle = color; ctx.lineWidth = w * 0.06
      ctx.beginPath(); ctx.moveTo(dx + dr * 0.7, dy + dr * 0.7); ctx.lineTo(dx + dr * 1.3, dy + dr * 1.3); ctx.stroke()
      // 镜面高光
      ctx.fillStyle = accent; ctx.globalAlpha = 0.3
      ctx.beginPath(); ctx.arc(dx - dr * 0.2, dy - dr * 0.2, dr * 0.35, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      // 镜内大脑（点线网络）
      const nodes = [[0,0],[0.4,-0.3],[-0.35,-0.25],[0.3,0.3],[-0.2,0.4],[0,-0.1]]
      const nx2 = nodes.map(n => dx + n[0] * dr); const ny2 = nodes.map(n => dy + n[1] * dr)
      ctx.strokeStyle = accent; ctx.lineWidth = w * 0.018
      [[0,1],[0,2],[0,5],[1,5],[2,5],[3,4],[3,5],[1,3],[2,4]].forEach(([a,b]) => { ctx.beginPath(); ctx.moveTo(nx2[a],ny2[a]); ctx.lineTo(nx2[b],ny2[b]); ctx.stroke() })
      ctx.fillStyle = accent
      nodes.forEach(([n0,n1]) => { ctx.beginPath(); ctx.arc(dx+n0*dr, dy+n1*dr, w*0.028, 0, Math.PI*2); ctx.fill() })
      break
    }
    // 4: Midjourney - 山峰调色板
    case 4: {
      const mx = cx2, mw = w * 0.75, mby = y + h * 0.72, mbh = h * 0.55
      // 调色板椭圆
      ctx.fillStyle = color; ctx.globalAlpha = 0.85
      ctx.beginPath(); ctx.ellipse(mx, mby - mbh * 0.1, mw * 0.5, mbh * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      // 椭圆高光
      ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.15
      ctx.beginPath(); ctx.ellipse(mx - mw * 0.1, mby - mbh * 0.3, mw * 0.3, mbh * 0.2, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
      // 三座山峰
      ctx.fillStyle = accent
      ctx.beginPath(); ctx.moveTo(mx - mw * 0.3, mby - mbh * 0.05); ctx.lineTo(mx - mw * 0.1, mby - mbh * 0.9); ctx.lineTo(mx + mw * 0.1, mby - mbh * 0.05); ctx.closePath(); ctx.fill()
      ctx.globalAlpha = 0.7; ctx.fillStyle = color
      ctx.beginPath(); ctx.moveTo(mx + mw * 0.05, mby - mbh * 0.05); ctx.lineTo(mx + mw * 0.25, mby - mbh * 0.55); ctx.lineTo(mx + mw * 0.45, mby - mbh * 0.05); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      // 画笔
      ctx.strokeStyle = accent; ctx.lineWidth = w * 0.04
      ctx.beginPath(); ctx.moveTo(mx + mw * 0.4, mby - mbh * 0.3); ctx.lineTo(mx + mw * 0.55, mby - mbh * 0.7); ctx.stroke()
      break
    }
    // 5: Stable Diffusion - 无限环+星点
    case 5: {
      const sx = cx2, sy = y + h * 0.5
      // 无限环
      ctx.strokeStyle = color; ctx.lineWidth = w * 0.05
      ctx.beginPath(); ctx.moveTo(sx - w * 0.32, sy); ctx.bezierCurveTo(sx - w * 0.32, sy - h * 0.28, sx - w * 0.08, sy - h * 0.28, sx, sy); ctx.bezierCurveTo(sx + w * 0.08, sy + h * 0.28, sx + w * 0.32, sy + h * 0.28, sx + w * 0.32, sy); ctx.bezierCurveTo(sx + w * 0.32, sy - h * 0.28, sx + w * 0.08, sy - h * 0.28, sx, sy); ctx.bezierCurveTo(sx - w * 0.08, sy + h * 0.28, sx - w * 0.32, sy + h * 0.28, sx - w * 0.32, sy); ctx.stroke()
      // 星点
      ctx.fillStyle = accent
      ;[[-0.28,-0.18],[0.28,0.18],[-0.1,0.18],[0.1,-0.18],[0,0]].forEach(([dx2,dy2]) => {
        ctx.beginPath(); ctx.arc(sx+dx2*w, sy+dy2*h, w*(dx2===0&&dy2===0?0.05:0.025), 0, Math.PI*2); ctx.fill()
      })
      break
    }
    // 6: DALL·E - 调色盘+眼睛
    case 6: {
      const px = cx2, py = y + h * 0.5, pr = w * 0.38
      ctx.fillStyle = color
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill()
      // 盘面色块
      ;[0,60,120,180,240,300].forEach((deg, i) => {
        const a = deg * Math.PI / 180
        ctx.fillStyle = [accent,'#f97316','#ec4899','#22c55e','#3b82f6','#f59e0b'][i]
        ctx.globalAlpha = 0.85
        ctx.beginPath(); ctx.arc(px + Math.cos(a)*pr*0.5, py + Math.sin(a)*pr*0.5, pr*0.22, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1
      })
      // 盘面中心（眼睛）
      ctx.fillStyle = '#ffffff'
      ctx.beginPath(); ctx.arc(px, py, pr*0.18, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#0a0e1a'
      ctx.beginPath(); ctx.arc(px, py, pr*0.09, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.6
      ctx.beginPath(); ctx.arc(px-pr*0.03, py-pr*0.03, pr*0.04, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1
      break
    }
    // 7: Sora - 视频帧堆叠
    case 7: {
      for (let f = 0; f < 4; f++) {
        const fy = y + h * (0.15 + f * 0.2), fh = h * 0.2, fx = x + w * (0.08 + f * 0.04)
        const fw = w * (0.84 - f * 0.08)
        ctx.fillStyle = color; ctx.globalAlpha = 0.7 - f * 0.12
        ctx.beginPath(); ctx.roundRect(fx, fy, fw, fh, w*0.02); ctx.fill(); ctx.globalAlpha = 1
        // 帧内内容
        if (f < 3) {
          ctx.fillStyle = accent; ctx.globalAlpha = 0.5 + f * 0.1
          ctx.beginPath(); ctx.roundRect(fx+w*0.05, fy+fh*0.2, fw-w*0.1, fh*0.6, w*0.015); ctx.fill(); ctx.globalAlpha = 1
        }
      }
      break
    }
    // 8: Perplexity - 罗盘+射线
    case 8: {
      const pcx = cx2, pcy = y + h * 0.52
      // 外圈
      ctx.beginPath(); ctx.arc(pcx, pcy, w*0.4, 0, Math.PI*2); ctx.strokeStyle = color; ctx.lineWidth = w*0.04; ctx.stroke()
      // 刻度
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6
        const len = i % 3 === 0 ? w*0.06 : w*0.035
        ctx.strokeStyle = accent; ctx.lineWidth = w*0.015; ctx.globalAlpha = i%3===0 ? 0.9 : 0.5
        ctx.beginPath(); ctx.moveTo(pcx+Math.cos(a)*(w*0.4-len), pcy+Math.sin(a)*(w*0.4-len)); ctx.lineTo(pcx+Math.cos(a)*w*0.4, pcy+Math.sin(a)*w*0.4); ctx.stroke(); ctx.globalAlpha = 1
      }
      // 指针
      ctx.fillStyle = accent
      ctx.beginPath(); ctx.moveTo(pcx, pcy-h*0.28); ctx.lineTo(pcx-w*0.03, pcy); ctx.lineTo(pcx+w*0.03, pcy); ctx.closePath(); ctx.fill()
      ctx.globalAlpha = 0.7; ctx.fillStyle = color
      ctx.beginPath(); ctx.moveTo(pcx, pcy+h*0.18); ctx.lineTo(pcx-w*0.025, pcy); ctx.lineTo(pcx+w*0.025, pcy); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
      // 中心点
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(pcx, pcy, w*0.035, 0, Math.PI*2); ctx.fill()
      break
    }
    // 9: Cursor - 代码括号 < />
    case 9: {
      const cy2 = y + h * 0.5
      ctx.lineWidth = w * 0.07; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      ctx.strokeStyle = color
      // < 符号
      ctx.beginPath(); ctx.moveTo(cx2 - w*0.28, cy2 - h*0.28); ctx.lineTo(cx2 - w*0.1, cy2); ctx.lineTo(cx2 - w*0.28, cy2 + h*0.28); ctx.stroke()
      // > 符号
      ctx.beginPath(); ctx.moveTo(cx2 + w*0.28, cy2 - h*0.28); ctx.lineTo(cx2 + w*0.1, cy2); ctx.lineTo(cx2 + w*0.28, cy2 + h*0.28); ctx.stroke()
      // / 符号（斜杠）
      ctx.strokeStyle = accent; ctx.lineWidth = w * 0.05
      ctx.beginPath(); ctx.moveTo(cx2 + w*0.15, cy2 - h*0.25); ctx.lineTo(cx2 - w*0.15, cy2 + h*0.25); ctx.stroke()
      break
    }
    // 10: Copilot - GitHub贡献图+机器人
    case 10: {
      const gridX = cx2 - w*0.3, gridY = y + h*0.15, cellW = w*0.12, cellH = h*0.16
      // 贡献格子（3×4）
      for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
        const alpha = 0.15 + (r*5+c)%5*0.15
        ctx.fillStyle = (r+c)%3===0 ? accent : color; ctx.globalAlpha = alpha
        ctx.beginPath(); ctx.roundRect(gridX+c*cellW, gridY+r*cellH, cellW*0.8, cellH*0.8, w*0.01); ctx.fill(); ctx.globalAlpha = 1
      }
      // 机器人脸
      const rfX = cx2 + w*0.15, rfY = y + h*0.58, rfR = w*0.12
      ctx.fillStyle = accent
      ctx.beginPath(); ctx.arc(rfX, rfY, rfR, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#0a0e1a'
      ctx.beginPath(); ctx.arc(rfX-rfR*0.28, rfY-rfR*0.15, rfR*0.18, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(rfX+rfR*0.28, rfY-rfR*0.15, rfR*0.18, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(rfX, rfY+rfR*0.15, rfR*0.25, 0, Math.PI); ctx.fill()
      break
    }
    // 11: Grok - 机器人脸+射线
    case 11: {
      const gx = cx2, gy = y + h*0.48, gr = w*0.28
      // 脸
      ctx.fillStyle = color
      ctx.beginPath(); ctx.roundRect(gx-gr, gy-gr, gr*2, gr*1.6, w*0.06); ctx.fill()
      // 眼睛（扫描线效果）
      ctx.fillStyle = accent
      ctx.beginPath(); ctx.roundRect(gx-gr*0.7, gy-gr*0.25, gr*0.5, gr*0.35, w*0.015); ctx.fill()
      ctx.beginPath(); ctx.roundRect(gx+gr*0.2, gy-gr*0.25, gr*0.5, gr*0.35, w*0.015); ctx.fill()
      // 嘴
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.9
      ctx.beginPath(); ctx.roundRect(gx-gr*0.5, gy+gr*0.1, gr, gr*0.25, w*0.015); ctx.fill(); ctx.globalAlpha = 1
      // 天线
      ctx.strokeStyle = accent; ctx.lineWidth = w*0.04
      ctx.beginPath(); ctx.moveTo(gx, gy-gr); ctx.lineTo(gx, gy-gr-h*0.18); ctx.stroke()
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(gx, gy-gr-h*0.18, w*0.035, 0, Math.PI*2); ctx.fill()
      // 射线
      for (let r = 0; r < 6; r++) {
        const a = r * Math.PI / 3
        ctx.strokeStyle = accent; ctx.lineWidth = w*0.015; ctx.globalAlpha = 0.5
        ctx.beginPath(); ctx.moveTo(gx+Math.cos(a)*gr*1.2, gy+Math.sin(a)*gr*1.2); ctx.lineTo(gx+Math.cos(a)*gr*1.6, gy+Math.sin(a)*gr*1.6); ctx.stroke(); ctx.globalAlpha = 1
      }
      break
    }
    // 12: LLaMA - 羊驼剪影
    case 12: {
      const lx = cx2, ly = y + h*0.6, ls = h*0.3
      ctx.fillStyle = color
      // 头
      ctx.beginPath(); ctx.ellipse(lx, ly-ls*0.4, ls*0.45, ls*0.55, 0, 0, Math.PI*2); ctx.fill()
      // 脖子
      ctx.fillRect(lx-ls*0.12, ly, ls*0.24, ls*0.7)
      // 耳朵
      ctx.beginPath(); ctx.ellipse(lx-ls*0.3, ly-ls*0.75, ls*0.12, ls*0.25, -0.4, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(lx+ls*0.3, ly-ls*0.75, ls*0.12, ls*0.25, 0.4, 0, Math.PI*2); ctx.fill()
      // 身体
      ctx.beginPath(); ctx.ellipse(lx, ly+ls*0.5, ls*0.55, ls*0.42, 0, 0, Math.PI*2); ctx.fill()
      // 腿
      ctx.fillRect(lx-ls*0.35, ly+ls*0.75, ls*0.15, ls*0.4)
      ctx.fillRect(lx-ls*0.02, ly+ls*0.75, ls*0.15, ls*0.4)
      ctx.fillRect(lx+ls*0.2, ly+ls*0.75, ls*0.15, ls*0.4)
      // 眼睛
      ctx.fillStyle = accent; ctx.globalAlpha = 0.9
      ctx.beginPath(); ctx.arc(lx-ls*0.18, ly-ls*0.45, ls*0.08, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(lx+ls*0.18, ly-ls*0.45, ls*0.08, 0, Math.PI*2); ctx.fill()
      ctx.globalAlpha = 1
      break
    }
    // 13: Gemma - 宝石晶体
    case 13: {
      const gmx = cx2, gmy = y + h*0.45
      ctx.fillStyle = color
      // 主晶体
      ctx.beginPath(); ctx.moveTo(gmx, gmy-h*0.42); ctx.lineTo(gmx+w*0.2, gmy-h*0.1); ctx.lineTo(gmx+w*0.15, gmy+h*0.25); ctx.lineTo(gmx-w*0.15, gmy+h*0.25); ctx.lineTo(gmx-w*0.2, gmy-h*0.1); ctx.closePath(); ctx.fill()
      // 左翼
      ctx.globalAlpha = 0.7
      ctx.beginPath(); ctx.moveTo(gmx-w*0.2, gmy-h*0.1); ctx.lineTo(gmx-w*0.38, gmy+h*0.05); ctx.lineTo(gmx-w*0.15, gmy+h*0.25); ctx.closePath(); ctx.fill()
      ctx.globalAlpha = 1
      // 内部高光面
      ctx.fillStyle = accent; ctx.globalAlpha = 0.45
      ctx.beginPath(); ctx.moveTo(gmx, gmy-h*0.42); ctx.lineTo(gmx+w*0.2, gmy-h*0.1); ctx.lineTo(gmx, gmy+h*0.1); ctx.closePath(); ctx.fill()
      ctx.globalAlpha = 1
      // 底座
      ctx.fillStyle = color; ctx.globalAlpha = 0.6
      ctx.fillRect(gmx-w*0.22, gmy+h*0.25, w*0.44, h*0.08); ctx.globalAlpha = 1
      break
    }
    // 14: Mistral - 迷雾流风
    case 14: {
      const msy = y + h*0.5
      ctx.strokeStyle = color; ctx.lineCap = 'round'
      // 3条流风曲线
      for (let i = 0; i < 3; i++) {
        const yo = (i-1)*h*0.18
        ctx.lineWidth = w*(0.06 - i*0.01)
        ctx.globalAlpha = 0.7 + i*0.1
        ctx.beginPath()
        ctx.moveTo(x+w*0.1, msy+yo)
        ctx.bezierCurveTo(x+w*0.3, msy+yo-h*0.22, x+w*0.55, msy+yo+h*0.18, x+w*0.8, msy+yo-h*0.08)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      // 速度粒子
      ctx.fillStyle = accent
      ;[[0.15,0.1],[0.45,-0.15],[0.7,0.2]].forEach(([px2,py2]) => {
        ctx.beginPath(); ctx.arc(x+px2*w, msy+py2*h, w*0.025, 0, Math.PI*2); ctx.fill()
      })
      break
    }
    // 15: Qwen - Q字符+波浪光芒
    case 15: {
      const qx = cx2, qy = y + h*0.48
      ctx.font = `bold ${Math.round(w*0.7)}px Arial, sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = color; ctx.fillText('Q', qx, qy)
      // 波浪光芒（Q尾）
      ctx.strokeStyle = accent; ctx.lineWidth = w*0.05; ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(qx+w*0.22, qy+w*0.25); ctx.bezierCurveTo(qx+w*0.35, qy+w*0.15, qx+w*0.3, qy+w*0.05, qx+w*0.38, qy-w*0.02); ctx.stroke()
      // Q中心（留空）
      ctx.fillStyle = '#0a0e1a'; ctx.beginPath(); ctx.arc(qx, qy, w*0.22, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = accent; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(qx, qy, w*0.12, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1
      break
    }
    // 16: Kimi - 月牙+星星
    case 16: {
      const kx = cx2, ky = y + h*0.48, kr = w*0.32
      // 月牙（大圆-小圆遮挡）
      ctx.fillStyle = color; ctx.globalAlpha = 0.9
      ctx.beginPath(); ctx.arc(kx, ky, kr, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 1
      ctx.beginPath(); ctx.arc(kx+kr*0.35, ky-kr*0.2, kr*0.78, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = color
      ctx.beginPath(); ctx.arc(kx, ky, kr, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#0a0e1a'
      ctx.beginPath(); ctx.arc(kx+kr*0.35, ky-kr*0.2, kr*0.78, 0, Math.PI*2); ctx.fill()
      // 周围星星
      ctx.fillStyle = accent
      for (let s = 0; s < 5; s++) {
        const sa = s * 1.2566 + 0.5, sr = kr + w*0.12
        const sx2 = kx + Math.cos(sa)*sr, sy2 = ky + Math.sin(sa)*sr
        ctx.beginPath(); ctx.arc(sx2, sy2, w*(0.015+s%2*0.015), 0, Math.PI*2); ctx.fill()
      }
      break
    }
    // 17: 豆包 - 可爱熊头+火焰
    case 17: {
      const bx2 = cx2, by2 = y + h*0.52, br = w*0.28
      ctx.fillStyle = color
      // 熊脸
      ctx.beginPath(); ctx.arc(bx2, by2, br, 0, Math.PI*2); ctx.fill()
      // 耳朵
      ctx.beginPath(); ctx.arc(bx2-br*0.7, by2-br*0.7, br*0.38, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(bx2+br*0.7, by2-br*0.7, br*0.38, 0, Math.PI*2); ctx.fill()
      // 耳朵内
      ctx.fillStyle = accent; ctx.globalAlpha = 0.7
      ctx.beginPath(); ctx.arc(bx2-br*0.7, by2-br*0.7, br*0.22, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(bx2+br*0.7, by2-br*0.7, br*0.22, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1
      // 眼睛
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.9
      ctx.beginPath(); ctx.arc(bx2-br*0.28, by2-br*0.1, br*0.12, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(bx2+br*0.28, by2-br*0.1, br*0.12, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1
      // 鼻子
      ctx.fillStyle = accent; ctx.globalAlpha = 0.9
      ctx.beginPath(); ctx.ellipse(bx2, by2+br*0.15, br*0.1, br*0.07, 0, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1
      // 火焰（头顶）
      ctx.fillStyle = accent
      ctx.beginPath(); ctx.moveTo(bx2, by2-br*1.05); ctx.quadraticCurveTo(bx2+w*0.08, by2-br*0.8, bx2+w*0.05, by2-br*0.65); ctx.quadraticCurveTo(bx2, by2-br*0.75, bx2-w*0.05, by2-br*0.65); ctx.quadraticCurveTo(bx2-w*0.08, by2-br*0.8, bx2, by2-br*1.05); ctx.fill()
      break
    }
    // 18: 文心一言 - 古扇/文胆
    case 18: {
      const ex = cx2, ey = y + h*0.52, er = w*0.35
      ctx.fillStyle = color
      // 扇面（半圆+直线底部）
      ctx.beginPath(); ctx.arc(ex, ey, er, Math.PI, 0); ctx.lineTo(ex+er, ey+er*0.6); ctx.lineTo(ex-er, ey+er*0.6); ctx.closePath(); ctx.fill()
      // 扇骨
      ctx.strokeStyle = '#0a0e1a'; ctx.globalAlpha = 0.4; ctx.lineWidth = w*0.012
      for (let b = 0; b < 7; b++) {
        const ba = Math.PI + b * Math.PI / 6
        ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex+Math.cos(ba)*er, ey+Math.sin(ba)*er); ctx.stroke()
      }
      ctx.globalAlpha = 1
      // 扇柄
      ctx.fillStyle = accent; ctx.globalAlpha = 0.8
      ctx.fillRect(ex-w*0.02, ey, w*0.04, h*0.28); ctx.globalAlpha = 1
      // 扇坠
      ctx.beginPath(); ctx.arc(ex, ey+h*0.28, w*0.04, 0, Math.PI*2); ctx.fill()
      break
    }
    // 19: 通义千问 - Q流光（复用Qwen风格但不同颜色）
    case 19: {
      const tqx = cx2, tqy = y + h*0.48
      ctx.font = `bold ${Math.round(w*0.7)}px Arial, sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = color; ctx.fillText('Q', tqx, tqy)
      ctx.strokeStyle = accent; ctx.lineWidth = w*0.05; ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(tqx+w*0.22, tqy+w*0.25); ctx.bezierCurveTo(tqx+w*0.35, tqy+w*0.15, tqx+w*0.3, tqy+w*0.05, tqx+w*0.38, tqy-w*0.02); ctx.stroke()
      ctx.fillStyle = '#0a0e1a'; ctx.beginPath(); ctx.arc(tqx, tqy, w*0.22, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = accent; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(tqx, tqy, w*0.12, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1
      break
    }
    // 20: 讯飞星火 - 火焰+星星
    case 20: {
      const fx = cx2, fy = y + h*0.5
      // 火焰（多层椭圆叠加）
      ctx.fillStyle = accent
      ctx.beginPath(); ctx.ellipse(fx, fy+h*0.1, w*0.18, h*0.28, 0, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = color; ctx.globalAlpha = 0.8
      ctx.beginPath(); ctx.ellipse(fx-w*0.06, fy, w*0.12, h*0.22, -0.2, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(fx+w*0.06, fy, w*0.12, h*0.22, 0.2, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1
      // 火焰尖端
      ctx.fillStyle = accent
      ctx.beginPath(); ctx.moveTo(fx-w*0.08, fy+h*0.1); ctx.quadraticCurveTo(fx, fy-h*0.45, fx+w*0.08, fy+h*0.1); ctx.closePath(); ctx.fill()
      // 周围星点
      ctx.fillStyle = '#fcd34d'
      ;[[-0.35,-0.35],[0.35,-0.3],[-0.25,0.35],[0.3,0.3]].forEach(([dx2,dy2]) => {
        ctx.beginPath(); ctx.arc(fx+dx2*w, fy+dy2*h, w*0.02, 0, Math.PI*2); ctx.fill()
      })
      break
    }
    // 21: NVIDIA - GPU芯片绿眼
    case 21: {
      const nx = cx2, ny = y + h*0.5
      // 芯片主体
      ctx.fillStyle = color
      ctx.beginPath(); ctx.roundRect(nx-w*0.38, ny-h*0.28, w*0.76, h*0.56, w*0.04); ctx.fill()
      // 核（绿色发光）
      ctx.fillStyle = accent; ctx.globalAlpha = 0.9
      ctx.beginPath(); ctx.roundRect(nx-w*0.2, ny-h*0.12, w*0.4, h*0.24, w*0.02); ctx.fill(); ctx.globalAlpha = 1
      // 引脚
      ctx.strokeStyle = color; ctx.lineWidth = w*0.025; ctx.globalAlpha = 0.8
      for (let i = 0; i < 6; i++) {
        const ix = nx-w*0.35+i*w*0.14
        ctx.beginPath(); ctx.moveTo(ix, ny-h*0.28); ctx.lineTo(ix, ny-h*0.4); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(ix, ny+h*0.28); ctx.lineTo(ix, ny+h*0.4); ctx.stroke()
      }
      ctx.globalAlpha = 1
      break
    }
    // 22: Tesla - T字母+闪电
    case 22: {
      const tx2 = cx2, ty2 = y + h*0.5
      ctx.fillStyle = color
      // T横杠
      ctx.fillRect(tx2-w*0.38, ty2-h*0.08, w*0.76, h*0.14)
      // T竖线
      ctx.fillRect(tx2-w*0.08, ty2-h*0.08, w*0.16, h*0.48)
      // 闪电
      ctx.fillStyle = accent
      ctx.beginPath(); ctx.moveTo(tx2+w*0.12, ty2-h*0.3); ctx.lineTo(tx2-w*0.02, ty2-h*0.02); ctx.lineTo(tx2+w*0.05, ty2-h*0.02); ctx.lineTo(tx2-w*0.05, ty2+h*0.25); ctx.lineTo(tx2+w*0.06, ty2-h*0.02); ctx.lineTo(tx2-w*0.02, ty2-h*0.02); ctx.closePath(); ctx.fill()
      break
    }
    // 23: Apple - 缺口苹果
    case 23: {
      const ax2 = cx2, ay2 = y + h*0.52
      ctx.fillStyle = color
      // 苹果主体
      ctx.beginPath(); ctx.arc(ax2-w*0.15, ay2-h*0.08, w*0.22, Math.PI*0.55, Math.PI*1.45); ctx.fill()
      ctx.beginPath(); ctx.arc(ax2+w*0.15, ay2-h*0.08, w*0.22, Math.PI*0.55, Math.PI*1.45); ctx.fill()
      ctx.fillRect(ax2-w*0.22, ay2-h*0.08, w*0.44, h*0.3)
      // 缺口（底部）
      ctx.fillStyle = '#0a0e1a'; ctx.globalAlpha = 0.9
      ctx.beginPath(); ctx.arc(ax2, ay2+h*0.08, w*0.1, 0, Math.PI); ctx.fill(); ctx.globalAlpha = 1
      // 梗
      ctx.strokeStyle = accent; ctx.lineWidth = w*0.04
      ctx.beginPath(); ctx.moveTo(ax2, ay2-h*0.28); ctx.quadraticCurveTo(ax2+w*0.08, ay2-h*0.38, ax2+w*0.12, ay2-h*0.32); ctx.stroke()
      // 叶
      ctx.fillStyle = accent; ctx.globalAlpha = 0.8
      ctx.beginPath(); ctx.ellipse(ax2+w*0.08, ay2-h*0.36, w*0.08, w*0.035, 0.5, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1
      break
    }
  }

  ctx.restore()
}

// ============================================================
// AI 图标缩略图绘制（64×64）
// ============================================================
export function drawAIThumb(iconId, styleOpts = {}) {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')
  const info = AI_ICON_OPTIONS[iconId] || AI_ICON_OPTIONS[0]

  // 深空背景
  ctx.fillStyle = '#080c14'; ctx.fillRect(0, 0, size, size)

  // 粒子星空
  for (let i = 0; i < 12; i++) {
    const sx = (i * 41 + 11) % size, sy = (i * 29 + 5) % (size * 0.55)
    ctx.globalAlpha = 0.15 + (i % 4) * 0.06
    ctx.fillStyle = '#ffffff'
    ctx.beginPath(); ctx.arc(sx, sy, 0.4 + (i % 2) * 0.4, 0, Math.PI * 2); ctx.fill()
  }
  ctx.globalAlpha = 1

  // 霓虹发光框
  const boxSize = size * 0.78
  const boxX = (size - boxSize) / 2
  const boxY = size * 0.1

  const glowGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxSize, boxY + boxSize)
  glowGrad.addColorStop(0, '#06b6d4')
  glowGrad.addColorStop(0.5, '#a855f7')
  glowGrad.addColorStop(1, '#ec4899')

  ctx.save()
  ctx.shadowColor = '#a855f7'
  ctx.shadowBlur = 8
  ctx.beginPath(); ctx.roundRect(boxX, boxY, boxSize, boxSize, size * 0.06)
  ctx.strokeStyle = glowGrad
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.restore()

  // 图标
  const pad = boxSize * 0.14
  drawAISilhouette(ctx, info.id, boxX + pad, boxY + pad, boxSize - pad * 2, boxSize - pad * 2, info.accent, info.accent2)

  return canvas
}

// ============================================================
// AI 图标封面绘制（1080×1920）
// ============================================================
export function drawAICover(data, iconId, styleOpts = {}) {
  const w = 1080, h = 1920
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  const cx = w / 2

  // 深空黑背景
  ctx.fillStyle = '#080c14'; ctx.fillRect(0, 0, w, h)

  // 粒子星空
  for (let i = 0; i < 80; i++) {
    const sx = (i * 137 + 23) % w, sy = (i * 97 + 11) % h
    const size = 0.5 + (i % 3) * 0.8
    const alpha = 0.08 + (i % 5) * 0.04
    ctx.globalAlpha = alpha
    ctx.fillStyle = i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#a855f7' : '#ffffff'
    ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI * 2); ctx.fill()
  }
  ctx.globalAlpha = 1

  const boxSize = h * 0.4
  const boxX = cx - boxSize / 2
  const boxY = h * 0.38

  // 霓虹发光边框
  const glowGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxSize, boxY + boxSize)
  glowGrad.addColorStop(0, '#06b6d4')
  glowGrad.addColorStop(0.4, '#a855f7')
  glowGrad.addColorStop(1, '#ec4899')

  ctx.save()
  ctx.shadowColor = '#a855f7'
  ctx.shadowBlur = 30
  ctx.beginPath(); ctx.roundRect(boxX, boxY, boxSize, boxSize, boxSize * 0.08)
  ctx.strokeStyle = glowGrad
  ctx.lineWidth = 10
  ctx.stroke()
  ctx.restore()

  // 内层发光
  ctx.save()
  ctx.beginPath(); ctx.roundRect(boxX + 4, boxY + 4, boxSize - 8, boxSize - 8, boxSize * 0.08 - 4)
  ctx.strokeStyle = 'rgba(6,182,212,0.35)'
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.restore()

  // 图标
  const info = AI_ICON_OPTIONS[iconId] || AI_ICON_OPTIONS[0]
  const iconPad = boxSize * 0.14
  drawAISilhouette(ctx, info.id, boxX + iconPad, boxY + iconPad, boxSize - iconPad * 2, boxSize - iconPad * 2, info.accent, info.accent2)

  // 底部水印
  ctx.save()
  ctx.globalAlpha = 0.7
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  ctx.font = '600 32px "PingFang SC", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('@小福AI自由', cx, h - 60)
  ctx.restore()

  return canvas
}
