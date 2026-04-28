/**
 * 视频生成器 v2.0 独立页面
 *
 * 功能：
 * - 内容输入（标题 + 多条列表）
 * - 风格选择（5个预设）
 * - 内容类型切换（标准列表 / 接力问题）
 * - 实时预览
 * - 16:9 横版录制，MP4 导出
 */

import { useState, useCallback } from 'react'
import VideoGeneratorV2 from '../components/VideoGeneratorV2'

export default function VideoGenPage() {
  const [title, setTitle] = useState('')
  const [items, setItems] = useState(['', '', ''])
  const [preset, setPreset] = useState('tech')
  const [contentType, setContentType] = useState('list')
  const [data, setData] = useState(null)

  const updateItem = (idx, val) => {
    const next = [...items]
    next[idx] = val
    setItems(next)
  }

  const addItem = () => setItems([...items, ''])
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx))

  const handlePreview = useCallback(() => {
    const pts = items
      .filter(t => t.trim())
      .map((text, i) => ({ label: text.trim(), kw: text.trim(), desc: '', short: '', idx: i }))
    if (!title.trim() || pts.length === 0) return
    setData({ title: title.trim(), points: pts })
  }, [title, items])

  const handleClear = () => {
    setTitle('')
    setItems(['', '', ''])
    setData(null)
  }

  const PRESET_COLORS = {
    tech: '#00d4ff',
    warm: '#f0c040',
    dark: '#ffffff',
    minimal: '#22c55e',
    mountain: '#86efac',
  }

  const PRESETS = [
    { key: 'tech', icon: '🔬', name: '知识科普' },
    { key: 'warm', icon: '🌅', name: '暖色人文' },
    { key: 'dark', icon: '💀', name: '硬核干货' },
    { key: 'minimal', icon: '🍃', name: '清新简约' },
    { key: 'mountain', icon: '⛰️', name: '山野自然' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-bold text-4xl mb-3" style={{ color: '#ffffff' }}>🎬 视频生成器</h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>
            输入内容 → 选择风格 → 录制 MP4 视频
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ====== 左侧：输入配置 ====== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 标题 */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>标题</div>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="输入视频标题..."
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10,
                  padding: '10px 14px', color: '#fff', fontSize: 16, outline: 'none',
                }}
              />
            </div>

            {/* 内容类型 */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>内容类型</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setContentType('list')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 10,
                    border: `1px solid ${contentType === 'list' ? '#8b5cf6' : 'rgba(255,255,255,0.15)'}`,
                    background: contentType === 'list' ? 'rgba(139,92,246,0.2)' : 'transparent',
                    color: contentType === 'list' ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                    fontSize: 14, cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  📋 标准列表
                </button>
                <button
                  onClick={() => setContentType('relay')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 10,
                    border: `1px solid ${contentType === 'relay' ? '#ef4444' : 'rgba(255,255,255,0.15)'}`,
                    background: contentType === 'relay' ? 'rgba(239,68,68,0.2)' : 'transparent',
                    color: contentType === 'relay' ? '#fca5a5' : 'rgba(255,255,255,0.5)',
                    fontSize: 14, cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  ⚡ 接力问题（无水印）
                </button>
              </div>
              {contentType === 'relay' && (
                <div className="mt-2 text-xs" style={{ color: 'rgba(239,68,68,0.7)' }}>
                  接力问题风格：每行一问一答层层递进，最后一条高亮，适合悬念钩子内容。无水印。
                </div>
              )}
            </div>

            {/* 内容列表 */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.1)', flex: 1 }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>内容列表</div>
                <button
                  onClick={addItem}
                  style={{ fontSize: 12, padding: '4px 12px', borderRadius: 8, background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', cursor: 'pointer' }}
                >
                  + 添加
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto' }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'rgba(139,92,246,0.3)',
                        color: '#a78bfa', fontSize: 12, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: 6,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <input
                      value={item}
                      onChange={e => updateItem(idx, e.target.value)}
                      placeholder={contentType === 'relay'
                        ? `例：卖啥的叫商贩`
                        : `例：靠读书走出大山`}
                      style={{
                        flex: 1, background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10,
                        padding: '8px 12px', color: '#fff', fontSize: 14, outline: 'none',
                      }}
                    />
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        style={{ padding: '6px 8px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: 'rgba(239,68,68,0.6)', border: 'none', cursor: 'pointer', marginTop: 4 }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 风格选择 */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>风格预设</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {PRESETS.map(p => (
                  <button
                    key={p.key}
                    onClick={() => setPreset(p.key)}
                    style={{
                      padding: '10px 4px', borderRadius: 10,
                      border: `2px solid ${preset === p.key ? PRESET_COLORS[p.key] : 'rgba(255,255,255,0.1)'}`,
                      background: preset === p.key ? `${PRESET_COLORS[p.key]}15` : 'transparent',
                      color: preset === p.key ? PRESET_COLORS[p.key] : 'rgba(255,255,255,0.4)',
                      fontSize: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{p.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handlePreview}
                disabled={!title.trim() || items.every(i => !i.trim())}
                style={{
                  flex: 1, padding: '14px', borderRadius: 12, border: 'none',
                  background: title.trim() && items.some(i => i.trim()) ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                  color: title.trim() && items.some(i => i.trim()) ? '#fff' : 'rgba(255,255,255,0.3)',
                  fontSize: 16, fontWeight: 700, cursor: 'pointer',
                  opacity: title.trim() && items.some(i => i.trim()) ? 1 : 0.5,
                }}
              >
                🎬 预览 & 录制
              </button>
              <button
                onClick={handleClear}
                style={{ padding: '14px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 14, cursor: 'pointer' }}
              >
                重置
              </button>
            </div>

            {/* 快捷示例 */}
            {contentType === 'relay' && (
              <div style={{ background: 'rgba(239,68,68,0.05)', borderRadius: 12, padding: 14, border: '1px solid rgba(239,68,68,0.2)' }}>
                <div className="text-xs font-bold mb-2" style={{ color: 'rgba(239,68,68,0.8)' }}>接力问题示例</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
                  <div>卖啥的叫商贩</div>
                  <div>卖啥的叫企业家</div>
                  <div>那"卖认知"的叫什么</div>
                </div>
              </div>
            )}
          </div>

          {/* ====== 右侧：视频预览 ====== */}
          <div>
            {data ? (
              <VideoGeneratorV2
                data={data}
                preset={preset}
                contentType={contentType}
                onClose={() => setData(null)}
              />
            ) : (
              <div
                style={{
                  height: 400, borderRadius: 16,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.25)',
                }}
              >
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
                <p className="text-base">输入内容后点击预览</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>
                  16:9 横版 · MP4 导出 · 画面自动放大
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
