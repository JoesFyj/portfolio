import { useState, useEffect, useRef } from 'react'
import { Copy, Check, Eye, Palette } from 'lucide-react'

// 微信公众号只支持这些CSS属性，其他全部过滤
// font-size, color, font-weight, font-style, text-decoration
// text-align, background-color, padding, margin, border
// line-height, letter-spacing, word-break
// 不支持: box-shadow, border-radius, text-shadow, gradient, flex, display

const THEMES = [
  {
    key: 'blue-minimal', name: '蓝色杂志',
    titleColor: '#1a6eb5', accentColor: '#1a6eb5', bgColor: '#f0f7ff',
    quoteBg: '#f0f7ff', quoteBorder: '#1a6eb5',
  },
  {
    key: 'warm-literary', name: '温暖文学',
    titleColor: '#b5543c', accentColor: '#b5543c', bgColor: '#fdf8f4',
    quoteBg: '#fdf8f4', quoteBorder: '#b5543c',
  },
  {
    key: 'minimal-bw', name: '简约黑白',
    titleColor: '#333333', accentColor: '#333333', bgColor: '#ffffff',
    quoteBg: '#f7f7f7', quoteBorder: '#cccccc',
  },
  {
    key: 'fresh-green', name: '清新绿',
    titleColor: '#2d7d32', accentColor: '#2d7d32', bgColor: '#f1f8e9',
    quoteBg: '#f1f8e9', quoteBorder: '#2d7d32',
  },
  {
    key: 'grape-purple', name: '葡萄紫',
    titleColor: '#6a1b9a', accentColor: '#6a1b9a', bgColor: '#f5eef8',
    quoteBg: '#f5eef8', quoteBorder: '#6a1b9a',
  },
  {
    key: 'summary-mosaic', name: '总结马赛克',
    titleColor: '#c2410c', accentColor: '#ea580c', bgColor: '#fff7ed',
    quoteBg: '#fff7ed', quoteBorder: '#ea580c',
  },
]

// 亮色交替配色方案（每节交叉）
const MOSAIC_COLORS = [
  { accent: '#e63b1a', bg: '#fff2f0', accentDark: '#c0341a' },  // 珊瑚红
  { accent: '#0070c0', bg: '#f0f7ff', accentDark: '#005a9e' },  // 蓝
  { accent: '#7b2d8b', bg: '#f8f0fa', accentDark: '#5a1f66' },  // 紫
]

// 解析总结格式文本，提取标题和小节
function parseSummaryContent(rawText) {
  if (!rawText) return null
  const lines = rawText.split('\n').filter(l => l.trim())
  const title = cleanMarkdown(lines[0] || '')
  if (lines.length < 3) return null

  const sections = []
  let current = null
  for (let i = 1; i < lines.length; i++) {
    const line = cleanMarkdown(lines[i])
    if (!line) continue
    // 匹配数字序号开头，如 "1. 实力无需卖弄"
    const numMatch = line.match(/^(\d+)[\.、]\s*(.+)/)
    if (numMatch) {
      if (current) sections.push(current)
      current = { num: numMatch[1], title: numMatch[2], sub: '', desc: '' }
    } else if (current) {
      // 小标题（无句末标点，短）
      if (!line.endsWith('。') && !line.endsWith('！') && !line.endsWith('？') && line.length < 30) {
        current.sub = current.sub ? current.sub + ' · ' + line : line
      } else {
        current.desc = current.desc ? current.desc + ' ' + line : line
      }
    }
  }
  if (current) sections.push(current)
  return { title, sections }
}

// 复制用：生成简化HTML（无动画，纯文本）
function formatSummaryPlain(title, sections, theme) {
  const T = theme
  let h = ''
  h += `<p style="font-size:12px;color:${T.accentColor};letter-spacing:2px;margin-bottom:10px;">小福 · AI自由实验</p>`
  h += `<p style="font-size:24px;font-weight:bold;color:${T.titleColor};line-height:1.4;margin-bottom:20px;">${title}</p>`
  h += `<p style="margin-bottom:20px;"><span style="display:inline-block;width:100%;height:1px;background-color:#e0e0e0;"></span></p>`
  sections.forEach((s, i) => {
    const c = MOSAIC_COLORS[i % MOSAIC_COLORS.length]
    h += `<p style="font-size:28px;font-weight:bold;color:${c.accent};margin:24px 0 8px;">${s.num}.</p>`
    h += `<p style="font-size:18px;font-weight:bold;color:${c.accentDark};margin-bottom:6px;">${s.title}</p>`
    if (s.sub) h += `<p style="font-size:15px;font-weight:600;color:${c.accent};margin-bottom:6px;">${s.sub}</p>`
    h += `<p style="font-size:14px;color:#555;line-height:1.9;margin-bottom:20px;padding-left:12px;border-left:3px solid ${c.accent};">${s.desc}</p>`
  })
  h += `<p style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:13px;color:#999;">— 我是小福，在用AI给自己造一条自由的路 —</p>`
  return h
}

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

function formatArticle(rawText, theme) {
  if (!rawText) return ''

  // 总结马赛克风格：预览用 React 组件，复制用纯文本
  if (theme.key === 'summary-mosaic') {
    const parsed = parseSummaryContent(rawText)
    if (parsed) return `__SUMMARY_MOSAIC__${JSON.stringify(parsed)}__END__`
    // 回退：如果不是总结格式，走普通流程
  }

  const lines = rawText.split('\n').filter(l => l.trim())
  const title = cleanMarkdown(lines[0] || '')
  const subtitle = cleanMarkdown(lines[1] || '')

  const T = theme
  let h = ''

  // 签名
  h += `<p style="font-size:12px;color:${T.accentColor};letter-spacing:2px;margin-bottom:10px;">小福 · AI自由实验</p>`

  // 标题
  h += `<p style="font-size:22px;font-weight:bold;color:${T.titleColor};line-height:1.4;margin-bottom:12px;">${title}</p>`

  // 引言/副标题
  if (subtitle && subtitle !== title) {
    h += `<p style="font-size:14px;color:#666;line-height:1.8;margin-bottom:20px;padding:10px 14px;background-color:${T.quoteBg};border-left:4px solid ${T.quoteBorder};">${subtitle}</p>`
  }

  // 分割线
  h += `<p style="margin-bottom:20px;"><span style="display:inline-block;width:100%;height:1px;background-color:#e0e0e0;"></span></p>`

  // 正文
  lines.slice(2).forEach(line => {
    const text = cleanMarkdown(line)
    if (!text) return

    if (text === '***' || text === '---') {
      h += `<p style="text-align:center;margin:20px 0;color:${T.accentColor};">✦</p>`
    } else if (text.length < 50 && !text.endsWith('。') && !text.endsWith('！') && !text.endsWith('？')) {
      // 金句居中加粗
      h += `<p style="font-size:16px;font-weight:bold;color:${T.titleColor};text-align:center;margin:20px 0;line-height:1.8;">${text}</p>`
    } else {
      // 正文段落
      h += `<p style="font-size:15px;color:#333;line-height:2;text-align:justify;margin-bottom:16px;">${text}</p>`
    }
  })

  // 结尾
  h += `<p style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:13px;color:#999;">— 我是小福，在用AI给自己造一条自由的路 —</p>`

  return h
}

// SummaryMosaic 动画组件
function SummaryMosaic({ title, sections, theme }) {
  const [visible, setVisible] = useState(false)
  const [mountedSections, setMountedSections] = useState([])
  const themeAccent = theme.accentColor || '#ea580c'

  useEffect(() => {
    setVisible(false)
    setMountedSections([])
    const t1 = setTimeout(() => setVisible(true), 150)
    sections.forEach((_, i) => {
      setTimeout(() => {
        setMountedSections(prev => [...prev, i])
      }, 400 + i * 280)
    })
    return () => clearTimeout(t1)
  }, [sections.length])

  function getCopyHtml() {
    return formatSummaryPlain(title, sections, theme)
  }

  useEffect(() => {
    window.__summaryMosaicCopy = getCopyHtml
  })

  return (
    <div style={{ fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif" }}>
      <p style={{ fontSize: '12px', color: themeAccent, letterSpacing: '2px', marginBottom: '10px' }}>小福 · AI自由实验</p>

      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-12px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        marginBottom: '20px',
      }}>
        <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a', lineHeight: '1.4' }}>{title}</p>
      </div>

      <p style={{ marginBottom: '20px' }}>
        <span style={{ display: 'inline-block', width: '100%', height: '1px', backgroundColor: '#e0e0e0' }} />
      </p>

      {sections.map((s, i) => {
        const c = MOSAIC_COLORS[i % MOSAIC_COLORS.length]
        const isIn = mountedSections.includes(i)
        const delay = i * 80

        return (
          <div key={i} style={{
            marginBottom: '28px',
            opacity: isIn ? 1 : 0,
            transform: isIn ? 'translateX(0)' : 'translateX(-20px)',
            transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
          }}>
            {/* 序号 + 标题 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
              <span style={{
                fontSize: '42px', fontWeight: '900', lineHeight: '1',
                color: c.accent, fontFamily: "'Georgia', serif",
                textShadow: `2px 2px 0 ${c.accent}22`,
                flexShrink: 0,
              }}>
                {s.num}
              </span>
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <p style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '4px', lineHeight: '1.4' }}>
                  {s.title}
                </p>
                {s.sub && (
                  <p style={{ fontSize: '13px', fontWeight: '600', color: c.accent, marginBottom: '4px', letterSpacing: '0.3px' }}>
                    {s.sub}
                  </p>
                )}
              </div>
            </div>

            {/* 解释文字 */}
            <div style={{ paddingLeft: '54px', borderLeft: `3px solid ${c.accent}`, paddingBottom: '4px' }}>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '2', margin: 0 }}>{s.desc}</p>
            </div>

            {/* 分隔装饰 */}
            {i < sections.length - 1 && (
              <div style={{ paddingLeft: '54px', marginTop: '20px', marginBottom: '4px', position: 'relative' }}>
                <div style={{
                  width: '100%', height: '1px',
                  background: `linear-gradient(to right, ${c.accent}40, transparent)`
                }} />
                <div style={{
                  position: 'absolute', right: '0', top: '-4px',
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: c.accent,
                  opacity: isIn ? 0.5 : 0,
                  transition: `opacity 0.3s ease ${delay + 300}ms`,
                }} />
              </div>
            )}
          </div>
        )
      })}

      <p style={{
        textAlign: 'center', marginTop: '24px', paddingTop: '16px',
        borderTop: '1px solid #e0e0e0', fontSize: '13px', color: '#999'
      }}>
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
  const parsedData = isSummaryMosaic
    ? JSON.parse(html.replace('__SUMMARY_MOSAIC__', '').replace('__END__', ''))
    : null

  const previewContent = isSummaryMosaic && parsedData
    ? <SummaryMosaic title={parsedData.title} sections={parsedData.sections} theme={theme} />
    : <div dangerouslySetInnerHTML={{ __html: html }} />

  function copy() {
    if (isSummaryMosaic) {
      navigator.clipboard.writeText(window.__summaryMosaicCopy ? window.__summaryMosaicCopy() : '').then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } else {
      navigator.clipboard.writeText(html).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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

      {/* 风格 */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>选择排版风格</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {THEMES.map(t => (
            <button key={t.key} onClick={() => setTheme(t)}
              style={{ padding: '5px 12px', borderRadius: '16px', border: theme.key === t.key ? `1px solid ${t.accentColor}` : '1px solid rgba(255,255,255,0.12)', background: theme.key === t.key ? `${t.accentColor}15` : 'transparent', color: theme.key === t.key ? t.accentColor : 'rgba(255,255,255,0.45)', fontSize: '12px', cursor: 'pointer', fontWeight: theme.key === t.key ? '600' : '400' }}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => setTab('preview')} style={{ flex: 1, padding: '10px', border: 'none', background: 'transparent', color: tab === 'preview' ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: '12px', cursor: 'pointer', borderBottom: tab === 'preview' ? `2px solid ${theme.accentColor}` : '2px solid transparent' }}>
          <Eye size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />预览
        </button>
        <button onClick={() => setTab('copy')} style={{ flex: 1, padding: '10px', border: 'none', background: 'transparent', color: tab === 'copy' ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: '12px', cursor: 'pointer', borderBottom: tab === 'copy' ? `2px solid ${theme.accentColor}` : '2px solid transparent' }}>
          <Copy size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />复制HTML
        </button>
      </div>

      {/* 内容 */}
      {tab === 'preview' ? (
        <div>
          {showPreview && (
            <div style={{ padding: '20px', background: '#f5f5f5', maxHeight: '400px', overflowY: 'auto' }}>
              <div style={{ maxWidth: '677px', margin: '0 auto', background: '#ffffff', padding: '20px 16px' }}>
                {previewContent}
              </div>
            </div>
          )}
          <button onClick={() => setShowPreview(v => !v)} style={{ width: '100%', padding: '8px', border: 'none', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.35)', fontSize: '11px', cursor: 'pointer' }}>
            {showPreview ? '收起' : '展开'}
          </button>
        </div>
      ) : (
        <div style={{ padding: '14px 16px' }}>
          <button onClick={copy}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: theme.accentColor, color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: `0 4px 12px ${theme.accentColor}40` }}>
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
