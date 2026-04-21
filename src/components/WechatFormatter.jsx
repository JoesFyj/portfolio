import { useState } from 'react'
import { Copy, Check, Eye, Download } from 'lucide-react'

const THEMES = [
  { key: 'blue-minimal',   name: '蓝色杂志', bg: '#f5f5f5', contentBg: '#ffffff', accent: '#0044FF', text: '#1A1A1A', desc: '白底蓝字，衬线字体，文学感' },
  { key: 'dark-tech',      name: '暗黑科技', bg: '#111110', contentBg: '#1a1a1a', accent: '#FF4500', text: '#F0EFEB', desc: '黑底橙红，科技感强' },
  { key: 'warm-literary',   name: '温暖文学', bg: '#faf6f1', contentBg: '#fffef9', accent: '#c0392b', text: '#2c2c2c', desc: '暖白底红字，书卷气' },
  { key: 'minimal-bw',     name: '简约黑白', bg: '#fafafa', contentBg: '#ffffff', accent: '#1a1a1a', text: '#1a1a1a', desc: '纯黑白，最干净' },
  { key: 'fresh-green',    name: '清新绿',   bg: '#f0f9f4', contentBg: '#ffffff', accent: '#27ae60', text: '#2c3e50', desc: '绿白配色，清爽自然' },
]

function format(text, theme) {
  if (!text) return ''
  const lines = text.split('\n').filter(l => l.trim())
  const title = lines[0] || ''
  const body = lines.slice(1).join('\n\n')
  const paragraphs = body.split('\n\n')

  let html = ''

  if (theme.key === 'blue-minimal') {
    html += `<p style="margin:0 0 8px 0;font-size:13px;color:${theme.accent};font-weight:700;letter-spacing:2px;">AI自由实验 · 小福</p>`
    html += `<p style="margin:0 0 12px 0;"><span style="font-size:26px;font-weight:900;color:#000;line-height:1.3;">${title}</span></p>`
    if (lines[1]) html += `<p style="margin:0 0 28px 0;padding-left:16px;border-left:4px solid ${theme.accent};font-size:13px;color:#666;line-height:1.7;">${lines[1]}</p>`
    html += `<hr style="border:none;border-top:1px solid #eee;margin:0 0 28px 0;">`
    paragraphs.forEach(p => {
      const t = p.trim()
      if (!t) return
      if (t === '***') { html += `<p style="text-align:center;color:${theme.accent};font-size:18px;margin:24px 0;">✦</p>`; return }
      html += `<p style="margin:0 0 18px 0;font-size:15px;color:${theme.text};line-height:1.9;">${t}</p>`
    })
    html += `<p style="text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #eee;color:#999;font-size:12px;">— 我是小福，我在用AI给自己造一条自由的路 —</p>`
  }

  else if (theme.key === 'dark-tech') {
    html += `<p style="margin:0 0 6px 0;font-size:11px;color:${theme.accent};letter-spacing:3px;">&#9658; AI自由实验 · 小福</p>`
    html += `<p style="margin:0 0 4px 0;font-size:30px;font-weight:900;color:${theme.text};letter-spacing:1px;">${title}</p>`
    if (lines[1]) html += `<p style="margin:0 0 28px 0;font-size:13px;color:rgba(240,239,235,0.5);">${lines[1]}</p>`
    html += `<p style="margin:0 0 20px 0;border-top:1px solid #333;padding-top:20px;">`
    paragraphs.forEach((p, i) => {
      const t = p.trim()
      if (!t) return
      if (i > 0 && i % 3 === 0) html += `</p><p style="margin:24px 0 8px 0;font-size:11px;color:${theme.accent};letter-spacing:2px;">&#9670; 续</p><p style="margin:0 0 20px 0;">`
      html += `<span style="display:block;font-size:14px;color:rgba(240,239,235,0.88);line-height:1.9;margin-bottom:12px;">${t}</span>`
    })
    html += `</p><p style="margin-top:32px;padding-top:16px;border-top:1px solid #333;color:rgba(240,239,235,0.35);font-size:12px;text-align:center;">— 小福 · AI自由实验 —</p>`
  }

  else if (theme.key === 'warm-literary') {
    html += `<div style="text-align:center;padding:28px 0 20px 0;">`
    html += `<p style="margin:0 0 6px 0;font-size:11px;color:${theme.accent};letter-spacing:3px;">AI自由实验</p>`
    html += `<p style="margin:0;font-size:28px;font-weight:900;color:${theme.accent};line-height:1.3;">${title}</p></div>`
    if (lines[1]) html += `<blockquote style="margin:0 0 28px 0;padding:14px 20px;border-left:4px solid ${theme.accent};background:#fdf9f6;font-size:13px;color:#666;line-height:1.8;">${lines[1]}</blockquote>`
    paragraphs.forEach(p => {
      const t = p.trim()
      if (!t) return
      html += `<p style="margin:0 0 18px 0;font-size:15px;color:${theme.text};line-height:2;text-indent:2em;">${t}</p>`
    })
    html += `<div style="text-align:center;margin-top:36px;padding-top:20px;border-top:1px solid #e8d5c4;color:#999;font-size:13px;">— 我是小福 —</div>`
  }

  else if (theme.key === 'minimal-bw') {
    html += `<p style="margin:0 0 4px 0;font-size:11px;color:#999;letter-spacing:2px;">小福 · AI自由实验</p>`
    html += `<h1 style="margin:0 0 8px 0;font-size:24px;font-weight:900;color:#000;line-height:1.3;">${title}</h1>`
    if (lines[1]) html += `<p style="margin:0 0 24px 0;font-size:13px;color:#666;line-height:1.6;">${lines[1]}</p>`
    paragraphs.forEach((p, i) => {
      const t = p.trim()
      if (!t) return
      if (i > 0 && i % 3 === 0) html += `<div style="height:1px;background:#e5e5e5;margin:20px 0;"></div>`
      html += `<p style="margin:0 0 14px 0;font-size:14px;color:#1a1a1a;line-height:1.9;">${t}</p>`
    })
    html += `<p style="margin-top:28px;font-size:12px;color:#ccc;text-align:center;">— 小福 · AI自由实验 —</p>`
  }

  else if (theme.key === 'fresh-green') {
    html += `<p style="margin:0 0 6px 0;font-size:12px;color:${theme.accent};font-weight:700;">🌿 AI自由实验 · 小福</p>`
    html += `<p style="margin:0 0 8px 0;"><span style="font-size:25px;font-weight:900;color:${theme.text};line-height:1.3;">${title}</span></p>`
    if (lines[1]) html += `<p style="margin:0 0 24px 0;font-size:13px;color:#888;">${lines[1]}</p>`
    paragraphs.forEach((p, i) => {
      const t = p.trim()
      if (!t) return
      if (i > 0 && i % 3 === 0) html += `<p style="text-align:center;color:${theme.accent};margin:20px 0;font-size:16px;">✦</p>`
      html += `<p style="margin:0 0 16px 0;font-size:14px;color:${theme.text};line-height:1.9;">${t}</p>`
    })
    html += `<p style="margin-top:32px;padding:14px 18px;background:#f0f9f4;border-radius:8px;font-size:13px;color:#27ae60;text-align:center;">🌿 小福 · 在用AI给自己造一条自由的路</p>`
  }

  return html
}

export default function WechatFormatter({ article }) {
  const [theme, setTheme] = useState(THEMES[0])
  const [tab, setTab] = useState('preview')
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const html = article ? format(article, theme) : ''

  function copy() {
    if (!html) return
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function download() {
    if (!html) return
    const shell = `<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<title>公众号排版预览</title>\n<style>body{margin:0;padding:40px;background:${theme.bg};}\n.wrapper{max-width:677px;margin:0 auto;background:${theme.contentBg};padding:32px 24px;box-shadow:0 2px 20px rgba(0,0,0,0.08);}\n.tip{max-width:677px;margin:0 auto 16px;background:#fff3cd;padding:10px 16px;border-radius:6px;font-size:13px;color:#856404;}</style>\n</head>\n<body>\n<div class="tip">👆 选中上方内容 → 复制 → 粘贴到公众号编辑器</div>\n<div class="wrapper">\n${html}\n</div>\n</body>\n</html>`
    const b = new Blob([shell], { type: 'text/html' })
    const u = URL.createObjectURL(b)
    const a = document.createElement('a')
    a.href = u; a.download = `小福AI自由-公众号排版.html`; a.click()
    URL.revokeObjectURL(u)
  }

  if (!article) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
        先在上方生成文案，这里显示排版预览
      </div>
    )
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', overflow: 'hidden' }}>

      {/* 风格选择 */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '10px' }}>
          排版风格
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {THEMES.map(t => (
            <button key={t.key} onClick={() => setTheme(t)}
              style={{
                padding: '6px 14px', borderRadius: '20px',
                border: theme.key === t.key ? `1px solid ${t.accent}` : '1px solid rgba(255,255,255,0.12)',
                background: theme.key === t.key ? `${t.accent}18` : 'transparent',
                color: theme.key === t.key ? t.accent : 'rgba(255,255,255,0.45)',
                fontSize: '13px', cursor: 'pointer', fontWeight: theme.key === t.key ? '600' : '400',
              }}>
              {t.name}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginTop: '8px' }}>
          {theme.desc}
        </div>
      </div>

      {/* 操作区 */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['preview', 'copy'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '12px', border: 'none', background: 'transparent',
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.35)',
              fontSize: '13px', cursor: 'pointer',
              borderBottom: tab === t ? `2px solid ${theme.accent}` : '2px solid transparent',
            }}>
            {t === 'preview' ? <><Eye size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />预览</> : <><Copy size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />复制HTML</>}
          </button>
        ))}
        <button onClick={download}
          style={{
            padding: '12px 16px', border: 'none', background: 'transparent',
            color: 'rgba(255,255,255,0.35)', fontSize: '13px', cursor: 'pointer',
          }}>
          <Download size={13} />
        </button>
      </div>

      {/* 预览 */}
      {tab === 'preview' ? (
        <div>
          {showPreview && (
            <div style={{ padding: '24px', background: theme.bg, maxHeight: '440px', overflowY: 'auto' }}>
              <div style={{ maxWidth: '677px', margin: '0 auto', background: theme.contentBg, padding: '28px 20px', boxShadow: '0 2px 16px rgba(0,0,0,0.1)', fontFamily: 'system-ui, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          )}
          <button onClick={() => setShowPreview(v => !v)}
            style={{ width: '100%', padding: '10px', border: 'none', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.35)', fontSize: '12px', cursor: 'pointer' }}>
            {showPreview ? '收起预览' : '展开预览'}
          </button>
        </div>
      ) : (
        <div style={{ padding: '16px 20px' }}>
          <textarea readOnly value={html} rows={10}
            style={{ width: '100%', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontFamily: 'monospace', resize: 'none', lineHeight: '1.7', boxSizing: 'border-box' }} />
          <button onClick={copy}
            style={{
              width: '100%', marginTop: '12px', padding: '13px', borderRadius: '10px', border: 'none',
              background: theme.accent, color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
            {copied ? <><Check size={14} />已复制</> : <><Copy size={14} />复制HTML源代码</>}
          </button>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '8px' }}>
            复制后粘贴到公众号编辑器
          </p>
        </div>
      )}
    </div>
  )
}
