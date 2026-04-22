import { useState } from 'react'
import { Copy, Check, Eye, Download, Palette } from 'lucide-react'

// 5种排版风格配置
const THEMES = [
  {
    key: 'blue-minimal',
    name: '蓝色杂志',
    bg: '#f8f9fa',
    contentBg: '#ffffff',
    accent: '#0066FF',
    text: '#1a1a1a',
    secondary: '#666666',
    desc: '白底蓝字，衬线字体，文学感'
  },
  {
    key: 'dark-tech',
    name: '暗黑科技',
    bg: '#0d0d0d',
    contentBg: '#1a1a1a',
    accent: '#FF6B35',
    text: '#f0f0f0',
    secondary: '#888888',
    desc: '黑底橙红，科技感强'
  },
  {
    key: 'warm-literary',
    name: '温暖文学',
    bg: '#faf8f5',
    contentBg: '#ffffff',
    accent: '#C75B39',
    text: '#2c2c2c',
    secondary: '#777777',
    desc: '暖白底红字，书卷气'
  },
  {
    key: 'minimal-bw',
    name: '简约黑白',
    bg: '#fafafa',
    contentBg: '#ffffff',
    accent: '#1a1a1a',
    text: '#1a1a1a',
    secondary: '#666666',
    desc: '纯黑白，最干净'
  },
  {
    key: 'fresh-green',
    name: '清新绿',
    bg: '#f5faf7',
    contentBg: '#ffffff',
    accent: '#2E7D32',
    text: '#1a1a1a',
    secondary: '#666666',
    desc: '绿白配色，清爽自然'
  }
]

// 清理markdown符号
function cleanMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')  // ***粗斜体***
    .replace(/\*\*(.*?)\*\*/g, '$1')      // **粗体**
    .replace(/\*(.*?)\*/g, '$1')          // *斜体*
    .replace(/##\s?/g, '')                 // ## 标题
    .replace(/###\s?/g, '')                // ### 标题
    .replace(/####\s?/g, '')               // #### 标题
    .replace(/---/g, '')                   // --- 分割线
    .replace(/\*\*\*/g, '')                // *** 单独的星号
    .replace(/```[\s\S]*?```/g, '')        // 代码块
    .replace(/`(.*?)`/g, '$1')             // 行内代码
}

// 判断是否是金句/重要句子（短句，可能需要强调）
function isKeySentence(text) {
  const cleaned = text.trim()
  return cleaned.length > 10 && cleaned.length < 60 && !cleaned.endsWith('。')
}

// 排版函数
function formatArticle(rawText, theme) {
  if (!rawText) return ''

  const lines = rawText.split('\n').filter(l => l.trim())
  const title = cleanMarkdown(lines[0] || '')
  const subtitle = cleanMarkdown(lines[1] || '')

  let html = ''
  const font = theme.key === 'blue-minimal' || theme.key === 'warm-literary'
    ? "font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', serif;"
    : "font-family: 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei', sans-serif;"

  // ========== 蓝色杂志风格 ==========
  if (theme.key === 'blue-minimal') {
    html += `<section style="padding: 20px 16px; ${font}">`

    // 标题区
    html += `<p style="margin: 0 0 8px; font-size: 12px; color: ${theme.accent}; font-weight: 600; letter-spacing: 2px;">小福 · AI自由实验</p>`
    html += `<h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: ${theme.text}; line-height: 1.4;">${title}</h1>`

    if (subtitle && subtitle !== title) {
      html += `<p style="margin: 0 0 24px; padding-left: 12px; border-left: 3px solid ${theme.accent}; font-size: 14px; color: ${theme.secondary}; line-height: 1.7;">${subtitle}</p>`
    }

    html += `<p style="margin: 0 0 24px; height: 1px; background: #e8e8e8;"></p>`

    // 正文
    lines.slice(2).forEach((line, i) => {
      const text = cleanMarkdown(line)
      if (!text) return

      if (text === '***' || text === '---') {
        html += `<p style="text-align: center; margin: 28px 0; font-size: 16px; color: ${theme.accent};">✦</p>`
      } else if (isKeySentence(text)) {
        html += `<p style="margin: 24px 0; padding: 16px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; font-size: 16px; color: ${theme.accent}; line-height: 1.8; text-align: center;">${text}</p>`
      } else {
        html += `<p style="margin: 0 0 18px; font-size: 15px; color: ${theme.text}; line-height: 2;">${text}</p>`
      }
    })

    // 结尾
    html += `<p style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 13px; color: ${theme.secondary};">— 我是小福，在用AI给自己造一条自由的路 —</p>`
    html += `</section>`
  }

  // ========== 暗黑科技风格 ==========
  else if (theme.key === 'dark-tech') {
    html += `<section style="padding: 24px 16px; background: #1a1a1a; ${font}">`

    html += `<p style="margin: 0 0 6px; font-size: 11px; color: ${theme.accent}; letter-spacing: 3px;">▶ AI自由实验</p>`
    html += `<h1 style="margin: 0 0 8px; font-size: 26px; font-weight: 700; color: ${theme.text}; line-height: 1.3;">${title}</h1>`

    if (subtitle && subtitle !== title) {
      html += `<p style="margin: 0 0 24px; font-size: 13px; color: ${theme.secondary};">${subtitle}</p>`
    }

    html += `<p style="margin: 0 0 20px; height: 1px; background: #333;"></p>`

    lines.slice(2).forEach((line, i) => {
      const text = cleanMarkdown(line)
      if (!text) return

      if (text === '***' || text === '---') {
        html += `<p style="text-align: center; margin: 24px 0; font-size: 14px; color: ${theme.accent};">◆</p>`
      } else if (isKeySentence(text)) {
        html += `<p style="margin: 20px 0; padding: 14px; background: #252525; border-radius: 6px; font-size: 15px; color: ${theme.text}; line-height: 1.8; text-align: center;">${text}</p>`
      } else {
        html += `<p style="margin: 0 0 16px; font-size: 14px; color: ${theme.text}; line-height: 2; opacity: 0.95;">${text}</p>`
      }
    })

    html += `<p style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #333; text-align: center; font-size: 12px; color: ${theme.secondary};">— 小福 · AI自由实验 —</p>`
    html += `</section>`
  }

  // ========== 温暖文学风格 ==========
  else if (theme.key === 'warm-literary') {
    html += `<section style="padding: 20px 16px; ${font}">`

    html += `<p style="margin: 0 0 6px; font-size: 11px; color: ${theme.accent}; letter-spacing: 2px; text-align: center;">AI自由实验</p>`
    html += `<h1 style="margin: 0 0 20px; font-size: 26px; font-weight: 700; color: ${theme.accent}; line-height: 1.4; text-align: center;">${title}</h1>`

    if (subtitle && subtitle !== title) {
      html += `<blockquote style="margin: 0 0 24px; padding: 14px 16px; background: #faf7f4; border-left: 3px solid ${theme.accent}; font-size: 14px; color: ${theme.secondary}; line-height: 1.8;">${subtitle}</blockquote>`
    }

    lines.slice(2).forEach((line, i) => {
      const text = cleanMarkdown(line)
      if (!text) return

      if (text === '***' || text === '---') {
        html += `<p style="text-align: center; margin: 24px 0; font-size: 14px; color: ${theme.accent};">· · ·</p>`
      } else if (isKeySentence(text)) {
        html += `<p style="margin: 24px 0; font-size: 16px; color: ${theme.accent}; line-height: 2; text-align: center; font-weight: 500;">"${text}"</p>`
      } else {
        html += `<p style="margin: 0 0 18px; font-size: 15px; color: ${theme.text}; line-height: 2.1;">${text}</p>`
      }
    })

    html += `<p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e8ddd5; text-align: center; font-size: 13px; color: ${theme.secondary};">— 我是小福 —</p>`
    html += `</section>`
  }

  // ========== 简约黑白风格 ==========
  else if (theme.key === 'minimal-bw') {
    html += `<section style="padding: 20px 16px; ${font}">`

    html += `<p style="margin: 0 0 4px; font-size: 11px; color: ${theme.secondary}; letter-spacing: 1px;">小福 · AI自由实验</p>`
    html += `<h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: ${theme.text}; line-height: 1.4;">${title}</h1>`

    if (subtitle && subtitle !== title) {
      html += `<p style="margin: 0 0 24px; font-size: 14px; color: ${theme.secondary}; line-height: 1.7;">${subtitle}</p>`
    }

    lines.slice(2).forEach((line, i) => {
      const text = cleanMarkdown(line)
      if (!text) return

      if (text === '***' || text === '---') {
        html += `<p style="text-align: center; margin: 24px 0; color: #ccc;">- - -</p>`
      } else if (isKeySentence(text)) {
        html += `<p style="margin: 24px 0; font-size: 16px; color: ${theme.text}; line-height: 1.8; text-align: center; font-weight: 600;">${text}</p>`
      } else {
        html += `<p style="margin: 0 0 16px; font-size: 15px; color: ${theme.text}; line-height: 2;">${text}</p>`
      }
    })

    html += `<p style="margin-top: 28px; padding-top: 14px; border-top: 1px solid #e5e5e5; text-align: center; font-size: 12px; color: ${theme.secondary};">小福 · AI自由实验</p>`
    html += `</section>`
  }

  // ========== 清新绿风格 ==========
  else if (theme.key === 'fresh-green') {
    html += `<section style="padding: 20px 16px; ${font}">`

    html += `<p style="margin: 0 0 6px; font-size: 12px; color: ${theme.accent}; font-weight: 600;">🌿 AI自由实验 · 小福</p>`
    html += `<h1 style="margin: 0 0 12px; font-size: 24px; font-weight: 700; color: ${theme.text}; line-height: 1.4;">${title}</h1>`

    if (subtitle && subtitle !== title) {
      html += `<p style="margin: 0 0 24px; font-size: 14px; color: ${theme.secondary};">${subtitle}</p>`
    }

    lines.slice(2).forEach((line, i) => {
      const text = cleanMarkdown(line)
      if (!text) return

      if (text === '***' || text === '---') {
        html += `<p style="text-align: center; margin: 24px 0; font-size: 16px; color: ${theme.accent};">🌿</p>`
      } else if (isKeySentence(text)) {
        html += `<p style="margin: 24px 0; padding: 14px; background: #f1f8e9; border-radius: 6px; font-size: 15px; color: ${theme.accent}; line-height: 1.8; text-align: center; font-weight: 500;">${text}</p>`
      } else {
        html += `<p style="margin: 0 0 16px; font-size: 15px; color: ${theme.text}; line-height: 2;">${text}</p>`
      }
    })

    html += `<p style="margin-top: 28px; padding: 14px; background: #f5f9f5; border-radius: 6px; text-align: center; font-size: 13px; color: ${theme.accent};">🌿 小福 · 在用AI给自己造一条自由的路</p>`
    html += `</section>`
  }

  return html
}

// 完整HTML外壳
function wrapHtml(html, theme) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>公众号排版预览</title>
</head>
<body style="margin:0;padding:40px 20px;background:${theme.bg};font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;">
<div style="max-width:677px;margin:0 auto;background:${theme.contentBg};box-shadow:0 2px 20px rgba(0,0,0,0.08);border-radius:8px;">
${html}
</div>
</body>
</html>`
}

export default function WechatFormatter({ article }) {
  const [theme, setTheme] = useState(THEMES[0])
  const [tab, setTab] = useState('preview')
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const html = article ? formatArticle(article, theme) : ''
  const fullHtml = article ? wrapHtml(html, theme) : ''

  function copy() {
    if (!html) return
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function download() {
    if (!fullHtml) return
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `公众号排版-${theme.name}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!article) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.35)',
        fontSize: '14px',
      }}>
        <Palette size={24} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
        <p style={{ margin: 0 }}>先生成文案，这里会显示排版预览</p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '1rem',
      overflow: 'hidden',
    }}>

      {/* 风格选择器 */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
          选择排版风格
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {THEMES.map(t => (
            <button key={t.key} onClick={() => setTheme(t)}
              style={{
                padding: '5px 12px', borderRadius: '16px',
                border: theme.key === t.key ? `1px solid ${t.accent}` : '1px solid rgba(255,255,255,0.12)',
                background: theme.key === t.key ? `${t.accent}15` : 'transparent',
                color: theme.key === t.key ? t.accent : 'rgba(255,255,255,0.45)',
                fontSize: '12px', cursor: 'pointer', fontWeight: theme.key === t.key ? '600' : '400',
                transition: 'all 0.15s',
              }}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* 操作栏 */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => setTab('preview')}
          style={{
            flex: 1, padding: '10px', border: 'none', background: 'transparent',
            color: tab === 'preview' ? '#fff' : 'rgba(255,255,255,0.35)',
            fontSize: '12px', cursor: 'pointer',
            borderBottom: tab === 'preview' ? `2px solid ${theme.accent}` : '2px solid transparent',
          }}>
          <Eye size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          预览
        </button>
        <button onClick={() => setTab('copy')}
          style={{
            flex: 1, padding: '10px', border: 'none', background: 'transparent',
            color: tab === 'copy' ? '#fff' : 'rgba(255,255,255,0.35)',
            fontSize: '12px', cursor: 'pointer',
            borderBottom: tab === 'copy' ? `2px solid ${theme.accent}` : '2px solid transparent',
          }}>
          <Copy size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          复制HTML
        </button>
        <button onClick={download}
          style={{
            padding: '10px 14px', border: 'none', background: 'transparent',
            color: 'rgba(255,255,255,0.35)', fontSize: '12px', cursor: 'pointer',
          }}>
          <Download size={12} />
        </button>
      </div>

      {/* 内容区 */}
      {tab === 'preview' ? (
        <div>
          {showPreview && (
            <div style={{
              padding: '20px',
              background: theme.bg,
              maxHeight: '400px',
              overflowY: 'auto',
            }}>
              <div
                style={{
                  maxWidth: '677px',
                  margin: '0 auto',
                  background: theme.contentBg,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                  borderRadius: '6px',
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          )}
          <button onClick={() => setShowPreview(v => !v)}
            style={{
              width: '100%', padding: '8px', border: 'none', background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.35)', fontSize: '11px', cursor: 'pointer',
            }}>
            {showPreview ? '收起' : '展开'}
          </button>
        </div>
      ) : (
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
            复制下方代码，粘贴到公众号编辑器（支持Markdown的编辑器）
          </div>
          <textarea readOnly value={html} rows={8}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '10px',
              color: 'rgba(255,255,255,0.65)',
              fontSize: '11px',
              fontFamily: 'monospace',
              resize: 'none',
              lineHeight: '1.6',
              boxSizing: 'border-box',
            }}
          />
          <button onClick={copy}
            style={{
              width: '100%', marginTop: '10px', padding: '12px', borderRadius: '8px', border: 'none',
              background: theme.accent, color: '#fff', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
            {copied ? <><Check size={14} />已复制</> : <><Copy size={14} />复制HTML代码</>}
          </button>
        </div>
      )}
    </div>
  )
}
