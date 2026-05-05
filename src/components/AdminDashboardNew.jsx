import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Edit3, Save, GitBranch, FileText } from 'lucide-react'
import { getProjects, createProject, updateProject, deleteProject, isSupabaseConfigured } from '../lib/supabase'

const CATEGORIES = ['AI工具', '自媒体运营', '内容创作', '开源项目', '其他']
const STATUSES = [
  { value: 'live', label: '已上线' },
  { value: 'beta', label: '测试中' },
  { value: 'wip', label: '开发中' },
  { value: 'archived', label: '已归档' },
]

export default function AdminDashboardNew({ onClose }) {
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null)  // null = 列表, 'new' = 新建, id = 编辑
  const [form, setForm] = useState(getEmptyForm())
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('works')  // works | journey | config

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const inputBg = isDark ? '#21262D' : '#F4F2EE'

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const data = await getProjects()
    setProjects(data || [])
  }

  function getEmptyForm() {
    return {
      name: '',
      slug: '',
      cover: '',
      description: '',
      full_description: '',
      category: 'AI工具',
      tags: [],
      tagsInput: '',
      demo_url: '',
      github_url: '',
      article_url: '',
      video_url: '',
      status: 'wip',
      featured: false,
      sort_order: 0,
    }
  }

  function startNew() {
    setForm(getEmptyForm())
    setEditing('new')
  }

  function startEdit(project) {
    setForm({
      ...project,
      tagsInput: (project.tags || []).join(', '),
    })
    setEditing(project.id)
  }

  function handleFormChange(key, value) {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      // 自动生成 slug
      if (key === 'name' && !prev.slug) {
        next.slug = value.toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
          .replace(/^-|-$/g, '')
      }
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        ...form,
        tags: form.tagsInput ? form.tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [],
      }
      delete payload.tagsInput

      if (editing === 'new') {
        await createProject(payload)
      } else {
        await updateProject(editing, payload)
      }
      await loadProjects()
      setEditing(null)
    } catch (e) {
      alert('保存失败: ' + e.message)
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('确定删除此作品？')) return
    try {
      await deleteProject(id)
      await loadProjects()
      if (editing === id) setEditing(null)
    } catch (e) {
      alert('删除失败: ' + e.message)
    }
  }

  // ====== 编辑表单 ======
  if (editing) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <div className="max-w-2xl mx-auto my-8 rounded-2xl p-6" style={{ background: cardBg }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold" style={{ color: text }}>
              {editing === 'new' ? '新建作品' : '编辑作品'}
            </h2>
            <button onClick={() => setEditing(null)} style={{ color: muted }}>
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* 基础信息 */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="作品名称 *" value={form.name} onChange={v => handleFormChange('name', v)} inputBg={inputBg} text={text} muted={muted} />
              <Field label="Slug *" value={form.slug} onChange={v => handleFormChange('slug', v)} inputBg={inputBg} text={text} muted={muted} />
            </div>

            <Field label="一句话介绍 *" value={form.description} onChange={v => handleFormChange('description', v)} inputBg={inputBg} text={text} muted={muted} placeholder="50字以内" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: muted }}>分类</label>
                <select
                  value={form.category}
                  onChange={e => handleFormChange('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm border-none outline-none"
                  style={{ background: inputBg, color: text }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: muted }}>状态</label>
                <select
                  value={form.status}
                  onChange={e => handleFormChange('status', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm border-none outline-none"
                  style={{ background: inputBg, color: text }}
                >
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <Field label="封面图URL" value={form.cover} onChange={v => handleFormChange('cover', v)} inputBg={inputBg} text={text} muted={muted} placeholder="https://..." />
            <Field label="标签 (逗号分隔)" value={form.tagsInput} onChange={v => handleFormChange('tagsInput', v)} inputBg={inputBg} text={text} muted={muted} placeholder="React, AI, Python" />
            <Field label="完整介绍" value={form.full_description} onChange={v => handleFormChange('full_description', v)} inputBg={inputBg} text={text} muted={muted} multiline placeholder="200字以内" />
            
            <Field label="演示链接" value={form.demo_url} onChange={v => handleFormChange('demo_url', v)} inputBg={inputBg} text={text} muted={muted} placeholder="https://..." />
            <Field label="GitHub链接" value={form.github_url} onChange={v => handleFormChange('github_url', v)} inputBg={inputBg} text={text} muted={muted} placeholder="https://..." />
            <Field label="文章链接" value={form.article_url} onChange={v => handleFormChange('article_url', v)} inputBg={inputBg} text={text} muted={muted} placeholder="https://..." />
            <Field label="视频链接" value={form.video_url} onChange={v => handleFormChange('video_url', v)} inputBg={inputBg} text={text} muted={muted} placeholder="https://..." />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: muted }}>排序权重</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => handleFormChange('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg text-sm border-none outline-none"
                  style={{ background: inputBg, color: text }}
                />
              </div>
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => handleFormChange('featured', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm" style={{ color: text }}>精选作品</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4" style={{ borderTop: `1px solid ${border}` }}>
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ color: muted, border: `1px solid ${border}` }}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#2D6A4F', color: '#FFFFFF', opacity: saving ? 0.7 : 1 }}
            >
              <Save size={14} /> {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ====== 列表视图 ======
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="max-w-3xl mx-auto my-8 rounded-2xl p-6" style={{ background: cardBg }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold" style={{ color: text }}>后台管理</h2>
          <button onClick={onClose} style={{ color: muted }}><X size={20} /></button>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'works', label: '🎨 作品管理' },
            { key: 'journey', label: '🛤️ 心路历程' },
            { key: 'config', label: '⚙️ 站点配置' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === t.key ? '#2D6A4F' : 'transparent',
                color: tab === t.key ? '#FFFFFF' : muted,
                border: tab === t.key ? 'none' : `1px solid ${border}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Supabase 状态 */}
        {!isSupabaseConfigured() && (
          <div className="rounded-lg p-3 mb-4 text-xs" style={{ background: '#FEF3C7', color: '#92400E' }}>
            ⚠️ Supabase 未配置，数据仅保存在本地浏览器。配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 后可持久化。
          </div>
        )}

        {tab === 'works' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm" style={{ color: muted }}>共 {projects.length} 个作品</span>
              <button
                onClick={startNew}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: '#2D6A4F', color: '#FFFFFF' }}
              >
                <Plus size={14} /> 新建作品
              </button>
            </div>

            <div className="space-y-2">
              {projects.map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3 rounded-lg"
                  style={{ background: inputBg, border: `1px solid ${border}` }}
                >
                  {/* 缩略图 */}
                  <div className="w-12 h-8 rounded overflow-hidden shrink-0" style={{ background: isDark ? '#30363D' : '#E8E5DF' }}>
                    {p.cover ? <img src={p.cover} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs opacity-30">📦</div>}
                  </div>
                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate" style={{ color: text }}>{p.name}</span>
                      {p.featured && <span className="text-xs">⭐</span>}
                    </div>
                    <span className="text-xs" style={{ color: muted }}>{p.category} · {STATUSES.find(s => s.value === p.status)?.label}</span>
                  </div>
                  {/* 操作 */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors" style={{ color: muted }}>
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-100/20 transition-colors" style={{ color: '#EF4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-3xl block mb-3">🎨</span>
                  <p className="text-sm" style={{ color: muted }}>还没有作品，点击上方"新建作品"开始</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'journey' && (
          <div className="text-center py-12">
            <span className="text-3xl block mb-3">🛤️</span>
            <p className="text-sm" style={{ color: muted }}>心路历程管理（开发中）</p>
            <p className="text-xs mt-1" style={{ color: muted }}>将支持添加读书、锻炼、里程碑数据</p>
          </div>
        )}

        {tab === 'config' && (
          <div className="text-center py-12">
            <span className="text-3xl block mb-3">⚙️</span>
            <p className="text-sm" style={{ color: muted }}>站点配置（开发中）</p>
            <p className="text-xs mt-1" style={{ color: muted }}>将支持修改首页文案、头像、目标等</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, inputBg, text, muted, placeholder, multiline }) {
  const Component = multiline ? 'textarea' : 'input'
  return (
    <div>
      <label className="block text-xs mb-1 font-medium" style={{ color: muted }}>{label}</label>
      <Component
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? 3 : undefined}
        className="w-full px-3 py-2 rounded-lg text-sm border-none outline-none"
        style={{ background: inputBg, color: text, resize: multiline ? 'vertical' : 'none' }}
      />
    </div>
  )
}
