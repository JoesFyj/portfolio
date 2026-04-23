import { useState, useEffect } from 'react'
import { Copy, Check, Eye, Palette } from 'lucide-react'

const THEMES = [
  { key: 'blue-minimal',   name: '蓝色杂志',  titleColor: '#1a6eb5', accentColor: '#1a6eb5', bgColor: '#f0f7ff', quoteBg: '#f0f7ff', quoteBorder: '#1a6eb5' },
  { key: 'warm-literary',  name: '温暖文学',  titleColor: '#b5543c', accentColor: '#b5543c', bgColor: '#fdf8f4', quoteBg: '#fdf8f4', quoteBorder: '#b5543c' },
  { key: 'minimal-bw',     name: '简约黑白',  titleColor: '#333333', accentColor: '#333333', bgColor: '#ffffff', quoteBg: '#f7f7f7', quoteBorder: '#cccccc' },
  { key: 'fresh-green',   name: '清新绿',    titleColor: '#2d7d32', accentColor: '#2d7d32', bgColor: '#f1f8e9', quoteBg: '#f1f8e9', quoteBorder: '#2d7d32' },
  { key: 'grape-purple',  name: '葡萄紫',    titleColor: '#6a1b9a', accentColor: '#6a1b9a', bgColor: '#f5eef8', quoteBg: '#f5eef8', quoteBorder: '#6a1b9a' },
  { key: 'summary-mosaic',name: '总结马赛克', titleColor: '#c2410c', accentColor: '#ea580c', bgColor: '#fff7ed', quoteBg: '#fff7ed', quoteBorder: '#ea580c' },
]

const MOSAIC_COLORS = [
  { accent: '#e63b1a', accentDark: '#c0341a' },
  { accent: '#0070c0', accentDark: '#005a9e' },
  { accent: '#7b2d8b', accentDark: '#5a1f66' },
]

function cleanMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,4}\s?/gm, '')
    .replace(/^---$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.*?)`/g, '$1')
}

function parseSummaryContent(rawText) {
  if (!rawText) return null
  const lines = rawText.split('\n').filter(l => l.trim())
  const title = cleanMarkdown(lines[0] || '')
  if (lines.length < 4) return null
  const sections = []
  let current = null
  for (let i = 1; i < lines.length; i++) {
    const line = cleanMarkdown(lines[i])
    if (!line) continue
    const numMatch = line.match(/^(\d+)[\.、]\s*(.+)/)
    if (numMatch) {
      if (current) sections.push(current)
      current = { num: numMatch[1], title: numMatch[2], sub: '', desc: '' }
    } else if (current) {
      if (!line.endsWith('。') && !line.endsWith('！') && !line.endsWith('？') && line.length < 30) {
        current.sub = current.sub ? current.sub + ' · ' + line : line
      } else {
        current.desc = current.desc ? current.desc + ' ' + line : line
      }
    }
  }
  if (current) sections.push(current)
  return sections.length > 0 ? { title, sections } : null
}

function formatSummaryPlain(title, sections, theme) {
  const T = theme
  let h = ''
  h += '<p style="font-size:12px;color:' + T.accentColor + ';letter-spacing:2px;margin-bottom:10px;">小福 · AI自由实验</p>'
  h += '<p style="font-size:24px;font-weight:bold;color:' + T.titleColor + ';line-height:1.4;margin-bottom:20px;">' + title + '</p>'
  h += '<p style="margin-bottom:20px;"><span style="display:inline-block;width:100%;height:1px;background-color:#e0e0e0;"></span></p>'
  sections.forEach(function(s, i) {
    const c = MOSAIC_COLORS[i % MOSAIC_COLORS.length]
    h += '<p style="font-size:28px;font-weight:bold;color:' + c.accent + ';margin:24px 0 8px;">' + s.num + '.</p>'
    h += '<p style="font-size:18px;font-weight:bold;color:' + c.accentDark + ';margin-bottom:6px;">' + s.title + '</p>'
    if (s.sub) h += '<p style="font-size:15px;font-weight:600;color:' + c.accent + ';margin-bottom:6px;">' + s.sub + '</p>'
    h += '<p style="font-size:14px;color:#555;line-height:1.9;margin-bottom:20px;padding-left:12px;border-left:3px solid ' + c.accent + ';">' + s.desc + '</p>'
  })
  h += '<p style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:13px;color:#999;">— 我是小福，在用AI给自己造一条自由的路 —</p>'
  return h
}

function formatArticle(rawText, theme) {
  if (!rawText) return ''
  if (theme.key === 'summary-mosaic') {
    const parsed = parseSummaryContent(rawText)
    if (parsed) return '__SUMMARY_MOSAIC__' + JSON.stringify(parsed) + '__END__'
  }
  const lines = rawText.split('\n').filter(l => l.trim())
  const title = cleanMarkdown(lines[0] || '')
  const subtitle = cleanMarkdown(lines[1] || '')
  const T = theme
  let h = ''
  h += '<p style="font-size:12px;color:' + T.accentColor + ';letter-spacing:2px;margin-bottom:10px;">小福 · AI自由实验</p>'
  h += '<p style="font-size:22px;font-weight:bold;color:' + T.titleColor + ';line-height:1.4;margin-bottom:12px;">' + title + '</p>'
  if (subtitle && subtitle !== title) {
    h += '<p style="font-size:14px;color:#666;line-height:1.8;margin-bottom:20px;padding:10px 14px;background-color:' + T.quoteBg + ';border-left:4px solid ' + T.quoteBorder + ';">' + subtitle + '</p>'
  }
  h += '<p style="margin-bottom:20px;"><span style="display:inline-block;width:100%;height:1px;background-color:#e0e0e0;"></span></p>'
  lines.slice(2).forEach(function(line) {
    const text = cleanMarkdown(line)
    if (!text) return
    if (text === '***' || text === '---') {
      h += '<p style="text-align:center;margin:20px 0;color:' + T.accentColor + ';">✦</p>'
    } else if (text.length < 50 && !text.endsWith('。') && !text.endsWith('！') && !text.endsWith('？')) {
      h += '<p style="font-size:16px;font-weight:bold;color:' + T.titleColor + ';text-align:center;margin:20px 0;line-height:1.8;">' + text + '</p>'
    } else {
      h += '<p style="font-size:15px;color:#333;line-height:2;text-align:justify;margin-bottom:16px;">' + text + '</p>'
    }
  })
  h += '<p style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:13px;color:#999;">— 我是小福，在用AI给自己造一条自由的路 —</p>'
  return h
}

function SummaryMosaic({ data, theme }) {
  const [visible, setVisible] = useState(false)
  const [shown, setShown] = useState([])
  const themeAccent = theme.accentColor || '#ea580c'

  useEffect(function() {
    setVisible(false)
    setShown([])
    const t = setTimeout(function() { setVisible(true) }, 150)
    data.sections.forEach(function(_, i) {
      setTimeout(function() { setShown(function(prev) { return prev.concat(i) }) }, 400 + i * 280)
    })
    return function() { clearTimeout(t) }
  }, [data])

  return (
    <div style={{ fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif" }}>
      <p style={{ fontSize: '12px', color: themeAccent, letterSpacing: '2px', marginBottom: '10px' }}>小福 · AI自由实验</p>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-12px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        marginBottom: '20px',
      }}>
        <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a', lineHeight: '1.4' }}>{data.title}</p>
      </div>
      <p style={{ marginBottom: '20px' }}>
        <span style={{ display: 'inline-block', width: '100%', height: '1px', backgroundColor: '#e0e0e0' }} />
      </p>
      {data.sections.map(function(s, i) {
        const c = MOSAIC_COLORS[i % MOSAIC_COLORS.length]
        const isIn = shown.includes(i)
        const delay = i * 80
        return (
          <div key={i} style={{
            marginBottom: '28px',
            opacity: isIn ? 1 : 0,
            transform: isIn ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity 0.45s ease ' + delay + 'ms, transform 0.45s ease ' + delay + 'ms',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
              <span style={{
                fontSize: '42px', fontWeight: '900', lineHeight: '1',
                color: c.accent, fontFamily: "'Georgia', serif",
                textShadow: '2px 2px 0 ' + c.accent + '22',
                flexShrink: 0,
              }}>{s.num}</span>
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <p style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '4px', lineHeight: '1.4' }}>{s.title}</p>
                {s.sub ? <p style={{ fontSize: '13px', fontWeight: '600', color: c.accent, marginBottom: '4px', letterSpacing: '0.3px' }}>{s.sub}</p> : null}
              </div>
            </div>
            <div style={{ paddingLeft: '54px', borderLeft: '3px solid ' + c.accent, paddingBottom: '4px' }}>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '2', margin: 0 }}>{s.desc}</p>
            </div>
            {i < data.sections.length - 1 ? (
              <div style={{ paddingLeft: '54px', marginTop: '20px', position: 'relative' }}>
                <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, ' + c.accent + '40, transparent)' }} />
                <div style={{
                  position: 'absolute', right: '0', top: '-4px',
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: c.accent,
                  opacity: isIn ? 0.5 : 0,
                  transition: 'opacity 0.3s ease ' + (delay + 300) + 'ms',
                }} />
              </div>
            ) : null}
          </div>
        )
      })}
      <p style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e0e0e0', fontSize: '13px', color: '#999' }}>
        — 我是小福，在用AI给自己造一条自由的路 —
      </p>
    </div>
  )
}

export default function WechatFormatter({ article }) {
  const [theme, setTheme] = useState(THEMES[0])
  const [tab, setTab] = useState('preview')
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const html = article ? formatArticle(article, theme) : ''

  const isSummaryMosaic = theme.key === 'summary-mosaic' && html.startsWith('__SUMMARY_MOSAIC__')
  let mosaicData = null
  if (isSummaryMosaic) {
    try {
      const jsonStr = html.replace('__SUMMARY_MOSAIC__', '').replace('__END__', '')
      mosaicData = JSON.parse(jsonStr)
    } catch (e) {
      mosaicData = null
    }
  }

  const previewContent = isSummaryMosaic && mosaicData
    ? <SummaryMosaic data={mosaicData} theme={theme} />
    : <div dangerouslySetInnerHTML={{ __html: html }} />

  function doCopy() {
    if (isSummaryMosaic && mosaicData) {
      navigator.clipboard.writeText(formatSummaryPlain(mosaicData.title, mosaicData.sections, theme)).then(function() {
        setCopied(true)
        setTimeout(function() { setCopied(false) }, 2000)
      })
    } else {
      navigator.clipboard.writeText(html).then(function() {
        setCopied(true)
        setTimeout(function() { setCopied(false) }, 2000)
      })
    }
  }

  if (!article) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
        <Palette size={24} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
        <p style={{ margin: 0 }}>先生成文案，这里显示排版预览</p>
      </div>
    )
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', overflow: 'hidden' }}>
      {/* 风格选择 - 2列网格 */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>选择排版风格</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {THEMES.map(function(t) {
            return (
              <button key={t.key} onClick={function() { setTheme(t) }}
                style={{
                  padding: '6px 8px',
                  borderRadius: '10px',
                  border: theme.key === t.key ? '1px solid ' + t.accentColor : '1px solid rgba(255,255,255,0.12)',
                  background: theme.key === t.key ? t.accentColor + '15' : 'transparent',
                  color: theme.key === t.key ? t.accentColor : 'rgba(255,255,255,0.45)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: theme.key === t.key ? '600' : '400',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                {t.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={function() { setTab('preview') }} style={{ flex: 1, padding: '10px', border: 'none', background: 'transparent', color: tab === 'preview' ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: '12px', cursor: 'pointer', borderBottom: tab === 'preview' ? '2px solid ' + theme.accentColor : '2px solid transparent' }}>
          <Eye size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />预览
        </button>
        <button onClick={function() { setTab('copy') }} style={{ flex: 1, padding: '10px', border: 'none', background: 'transparent', color: tab === 'copy' ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: '12px', cursor: 'pointer', borderBottom: tab === 'copy' ? '2px solid ' + theme.accentColor : '2px solid transparent' }}>
          <Copy size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />复制HTML
        </button>
      </div>

      {/* 内容 */}
      {tab === 'preview' ? (
        <div>
          {showPreview ? (
            <div style={{ padding: '20px', background: '#f5f5f5', maxHeight: '400px', overflowY: 'auto' }}>
              <div style={{ maxWidth: '677px', margin: '0 auto', background: '#ffffff', padding: '20px 16px' }}>
                {previewContent}
              </div>
            </div>
          ) : null}
          <button onClick={function() { setShowPreview(function(v) { return !v }) }} style={{ width: '100%', padding: '8px', border: 'none', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.35)', fontSize: '11px', cursor: 'pointer' }}>
            {showPreview ? '收起' : '展开'}
          </button>
        </div>
      ) : (
        <div style={{ padding: '14px 16px' }}>
          <button onClick={doCopy}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: theme.accentColor, color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px ' + theme.accentColor + '40' }}>
            {copied ? <><Check size={18} />已复制！现在去公众号粘贴</> : <><Copy size={18} />一键复制到公众号</>}
          </button>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '8px', textAlign: 'center' }}>
            复制后 → 打开微信公众号后台 → 新建图文 → 粘贴 → 格式不会丢
          </div>
        </div>
      )}
    </div>
  )
}
