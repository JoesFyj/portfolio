// 最简化测试：直接在PageGenerator里渲染canvas

import { useRef, useState, useEffect } from 'react'

export default function TestVideo({ data, onClose }) {
  const canvasRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!data || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // 简单动画测试
    let frame = 0
    const animate = () => {
      frame++
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, 1080, 1920)
      
      // 标题
      ctx.fillStyle = '#00d4ff'
      ctx.font = '900 48px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(data.title || '标题', 540, 200)
      
      // 内容
      ctx.fillStyle = '#fff'
      ctx.font = '400 32px sans-serif'
      data.points?.forEach((p, i) => {
        ctx.fillText(`${i+1}. ${p.label}`, 540, 400 + i * 150)
      })
      
      // 进度条
      ctx.fillStyle = '#00d4ff'
      ctx.fillRect(0, 1880, (frame % 100) * 10.8, 40)
      
      if (playing) requestAnimationFrame(animate)
    }
    
    setPlaying(true)
    animate()
  }, [data, playing])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0a0f', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: 360, height: 640, background: '#000' }} />
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => setPlaying(!playing)} style={{ padding: '12px 24px', background: '#00d4ff', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          {playing ? '暂停' : '播放'}
        </button>
        <button onClick={onClose} style={{ padding: '12px 24px', background: '#333', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          关闭
        </button>
      </div>
    </div>
  )
}
