import { useState } from 'react'
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

function formatArticle(rawText, theme) {
  if (!rawText) return ''
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

export default function WechatFormatter({ article }) {
  const [theme, setTheme] = useState(THEMES[0])
  const [tab, setTab] = useState('preview')
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const html = article ? formatArticle(article, theme) : ''

  function copy() {
    if (!html) return
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
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
              <div style={{ maxWidth: '677px', margin: '0 auto', background: '#ffffff', padding: '20px 16px' }}
                dangerouslySetInnerHTML={{ __html: html }} />
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
