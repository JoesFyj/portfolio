import { useState, useEffect, useRef } from 'react'
import { X, Plus, Trash2, Edit3, Save, Upload, Image as ImageIcon } from 'lucide-react'
import {
  getProjects, createProject, updateProject, deleteProject,
  isSupabaseConfigured
} from '../lib/supabase'
import {
  getJourneyRecords, createRecord, updateRecord,
  deleteRecord, uploadJourneyImage
} from '../lib/journeyApi'

const CATEGORIES = ['AI工具', '自媒体运营', '内容创作', '开源项目', '其他']
const STATUSES = [
  { value: 'live', label: '已上线' },
  { value: 'beta', label: '测试中' },
  { value: 'wip', label: '开发中' },
  { value: 'archived', label: '已归档' },
]
const MODULES = [
  { value: 'exercise', label: '🏃 跑步', color: '#D97706' },
  { value: 'reading', label: '📖 读书', color: '#059669' },
  { value: 'social', label: '📱 自媒体', color: '#7C3AED' },
]

// ============ 主组件 ============

export default function AdminDashboardNew({ onClose }) {
  const [projects, setProjects] = useState([])
  const [projectEditing, setProjectEditing] = useState(null)
  const [projectForm, setProjectForm] = useState(getEmptyProjectForm())
  const [projectSaving, setProjectSaving] = useState(false)

  // Journey state
  const [journeyTab, setJourneyTab] = useState('exercise')
  const [journeyRecords, setJourneyRecords] = useState([])
  const [journeyPage, setJourneyPage] = useState(1)
  const [journeyTotal, setJourneyTotal] = useState(0)
  const [journeyLoading, setJourneyLoading] = useState(true)
  const [journeyEditing, setJourneyEditing] = useState(null)
  const [journeyForm, setJourneyForm] = useState(getEmptyJourneyForm())
  const [journeySaving, setJourneySaving] = useState(false)

  const [tab, setTab] = useState('works')

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const inputBg = isDark ? '#21262D' : '#F4F2EE'

  useEffect(() => { loadProjects() }, [])
  useEffect(() => { loadJourneyRecords(journeyTab, 1) }, [journeyTab])

  async function loadProjects() {
    const data = await getProjects()
    setProjects(data || [])
  }

  async function loadJourneyRecords(module, page = 1) {
    setJourneyLoading(true)
    const result = await getJourneyRecords(module, page, 20)
    setJourneyRecords(result.records || [])
    setJourneyTotal(result.total || 0)
    setJourneyPage(page)
    setJourneyLoading(false)
  }

  // ========== 作品 CRUD ==========

  function getEmptyProjectForm() {
    return {
      name: '', slug: '', cover: '', description: '', full_description: '',
      category: 'AI工具', tags: [], tagsInput: '',
      demo_url: '', github_url: '', article_url: '', video_url: '',
      status: 'wip', featured: false, sort_order: 0,
    }
  }

  function setProjectFormChange(key, value) {
    setProjectForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'name' && !prev.slug) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '')
      }
      return next
    })
  }

  async function handleProjectSave() {
    setProjectSaving(true)
    try {
      const payload = {
        ...projectForm,
        tags: projectForm.tagsInput
          ? projectForm.tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [],
      }
      delete payload.tagsInput
      if (projectEditing === 'new') await createProject(payload)
      else await updateProject(projectEditing, payload)
      await loadProjects()
      setProjectEditing(null)
    } catch (e) { alert('保存失败: ' + e.message) }
    setProjectSaving(false)
  }

  async function handleProjectDelete(id) {
    if (!confirm('确定删除此作品？')) return
    await deleteProject(id)
    await loadProjects()
    if (projectEditing === id) setProjectEditing(null)
  }

  // ========== 心路历程 CRUD ==========

  function getEmptyJourneyForm() {
    return {
      module: journeyTab,
      title: '',
      cover_images: [],
      content: '',
      record_date: new Date().toISOString().split('T')[0],
      sort_order: 0,
    }
  }

  async function loadJourneyRecordsForModule(module) {
    setJourneyTab(module)
    setJourneyEditing(null)
    setJourneyForm({ ...getEmptyJourneyForm(), module })
    await loadJourneyRecords(module, 1)
  }

  function startNewJourney() {
    setJourneyForm({ ...getEmptyJourneyForm(), module: journeyTab })
    setJourneyEditing('new')
  }

  function startEditJourney(rec) {
    setJourneyForm({
      module: rec.module,
      title: rec.title,
      cover_images: rec.cover_images || [],
      content: rec.content,
      record_date: rec.record_date || '',
      sort_order: rec.sort_order || 0,
    })
    setJourneyEditing(rec.id)
  }

  async function handleJourneySave() {
    if (!journeyForm.title.trim()) { alert('请填写标题'); return }
    if (!journeyForm.content.trim()) { alert('请填写正文'); return }

    setJourneySaving(true)
    try {
      const payload = { ...journeyForm }
      if (journeyEditing === 'new') await createRecord(payload)
      else await updateRecord(journeyEditing, payload)
      await loadJourneyRecords(journeyTab, 1)
      setJourneyEditing(null)
    } catch (e) { alert('保存失败: ' + e.message) }
    setJourneySaving(false)
  }

  async function handleJourneyDelete(id) {
    if (!confirm('确定删除此记录？')) return
    await deleteRecord(id)
    await loadJourneyRecords(journeyTab, 1)
    if (journeyEditing === id) setJourneyEditing(null)
  }

  async function handleImageUpload(e, index) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const url = await uploadJourneyImage(file, journeyTab)
      setJourneyForm(prev => {
        const images = [...(prev.cover_images || [])]
        if (index !== undefined) images[index] = url
        else images.push(url)
        return { ...prev, cover_images: images }
      })
    } catch (err) {
      alert('图片上传失败: ' + err.message)
    }
  }

  function removeImage(index) {
    setJourneyForm(prev => ({
      ...prev,
      cover_images: prev.cover_images.filter((_, i) => i !== index),
    }))
  }

  // ========== 渲染 ==========

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="max-w-3xl mx-auto my-8 rounded-2xl p-6" style={{ background: cardBg, maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-6 sticky top-0 z-10 pb-4" style={{ background: cardBg }}>
          <h2 className="font-serif text-xl font-bold" style={{ color: text }}>后台管理</h2>
          <button onClick={onClose} style={{ color: muted }}><X size={20} /></button>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'works', label: '🎨 作品管理' },
            { key: 'journey', label: '🛤️ 心路历程' },
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

        {!isSupabaseConfigured() && (
          <div className="rounded-lg p-3 mb-4 text-xs" style={{ background: '#FEF3C7', color: '#92400E' }}>
            ⚠️ Supabase 未配置，数据仅保存在浏览器本地（图片会自动压缩至150KB以内）。建议配置环境变量以支持原图存储。
          </div>
        )}

        {tab === 'works' && (
          projectEditing
            ? <ProjectEditForm
              form={projectForm} saving={projectSaving}
              onChange={setProjectFormChange}
              onSave={handleProjectSave}
              onCancel={() => setProjectEditing(null)}
              onDelete={projectEditing !== 'new' ? () => handleProjectDelete(projectEditing) : null}
              isNew={projectEditing === 'new'}
              text={text} muted={muted} border={border} inputBg={inputBg} cardBg={cardBg}
            />
            : <ProjectList
              projects={projects} onNew={() => { setProjectForm(getEmptyProjectForm()); setProjectEditing('new') }}
              onEdit={(p) => { setProjectForm({ ...p, tagsInput: (p.tags || []).join(', ') }); setProjectEditing(p.id) }}
              onDelete={handleProjectDelete}
              text={text} muted={muted} border={border} inputBg={inputBg} cardBg={cardBg}
            />
        )}

        {tab === 'journey' && (
          journeyEditing
            ? <JourneyEditForm
              form={journeyForm} saving={journeySaving} isNew={journeyEditing === 'new'}
              onChange={(k, v) => setJourneyForm(prev => ({ ...prev, [k]: v }))}
              onModuleChange={(m) => setJourneyForm(prev => ({ ...prev, module: m }))}
              onSave={handleJourneySave}
              onCancel={() => setJourneyEditing(null)}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
              text={text} muted={muted} border={border} inputBg={inputBg} cardBg={cardBg}
            />
            : <JourneyList
              activeModule={journeyTab} records={journeyRecords} total={journeyTotal}
              loading={journeyLoading}
              onModuleChange={loadJourneyRecordsForModule}
              onNew={startNewJourney}
              onEdit={startEditJourney}
              onDelete={handleJourneyDelete}
              text={text} muted={muted} border={border} inputBg={inputBg} cardBg={cardBg}
            />
        )}
      </div>
    </div>
  )
}

// ============ 作品列表 ============

function ProjectList({ projects, onNew, onEdit, onDelete, text, muted, border, inputBg, cardBg }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm" style={{ color: muted }}>共 {projects.length} 个作品</span>
        <button onClick={onNew} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#2D6A4F', color: '#FFFFFF' }}>
          <Plus size={14} /> 新建作品
        </button>
      </div>
      <div className="space-y-2">
        {projects.map(p => (
          <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: inputBg, border: `1px solid ${border}` }}>
            <div className="w-12 h-8 rounded overflow-hidden shrink-0" style={{ background: cardBg }}>
              {p.cover ? <img src={p.cover} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs opacity-30">📦</div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate" style={{ color: text }}>{p.name}</span>
                {p.featured && <span className="text-xs">⭐</span>}
              </div>
              <span className="text-xs" style={{ color: muted }}>{p.category} · {STATUSES.find(s => s.value === p.status)?.label}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => onEdit(p)} className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors" style={{ color: muted }}><Edit3 size={14} /></button>
              <button onClick={() => onDelete(p.id)} className="p-2 rounded-lg hover:bg-red-100/20 transition-colors" style={{ color: '#EF4444' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <span className="text-3xl block mb-3">🎨</span>
            <p className="text-sm" style={{ color: muted }}>还没有作品</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ 作品编辑表单 ============

function ProjectEditForm({ form, saving, onChange, onSave, onCancel, onDelete, isNew, text, muted, border, inputBg, cardBg }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-lg font-bold" style={{ color: text }}>
          {isNew ? '新建作品' : '编辑作品'}
        </h3>
        <button onClick={onCancel} style={{ color: muted }}><X size={18} /></button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="作品名称 *" value={form.name} onChange={v => onChange('name', v)} inputBg={inputBg} text={text} muted={muted} />
          <Field label="Slug *" value={form.slug} onChange={v => onChange('slug', v)} inputBg={inputBg} text={text} muted={muted} />
        </div>
        <Field label="一句话介绍 *" value={form.description} onChange={v => onChange('description', v)} inputBg={inputBg} text={text} muted={muted} placeholder="50字以内" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1 font-medium" style={{ color: muted }}>分类</label>
            <select value={form.category} onChange={e => onChange('category', e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm border-none outline-none" style={{ background: inputBg, color: text }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1 font-medium" style={{ color: muted }}>状态</label>
            <select value={form.status} onChange={e => onChange('status', e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm border-none outline-none" style={{ background: inputBg, color: text }}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <Field label="封面图URL" value={form.cover} onChange={v => onChange('cover', v)} inputBg={inputBg} text={text} muted={muted} placeholder="https://..." />
        <Field label="标签 (逗号分隔)" value={form.tagsInput} onChange={v => onChange('tagsInput', v)} inputBg={inputBg} text={text} muted={muted} placeholder="React, AI, Python" />
        <Field label="完整介绍" value={form.full_description} onChange={v => onChange('full_description', v)} inputBg={inputBg} text={text} muted={muted} multiline placeholder="200字以内" />
        <Field label="演示链接" value={form.demo_url} onChange={v => onChange('demo_url', v)} inputBg={inputBg} text={text} muted={muted} placeholder="https://..." />
        <Field label="GitHub链接" value={form.github_url} onChange={v => onChange('github_url', v)} inputBg={inputBg} text={text} muted={muted} placeholder="https://..." />
        <Field label="文章链接" value={form.article_url} onChange={v => onChange('article_url', v)} inputBg={inputBg} text={text} muted={muted} placeholder="https://..." />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => onChange('featured', e.target.checked)} className="w-4 h-4" />
            <span className="text-sm" style={{ color: text }}>精选作品</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4" style={{ borderTop: `1px solid ${border}` }}>
        {!isNew && <button onClick={onDelete} className="px-4 py-2 rounded-lg text-sm mr-auto" style={{ color: '#EF4444', border: `1px solid #EF444440` }}>删除</button>}
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm" style={{ color: muted }}>取消</button>
        <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium" style={{ background: '#2D6A4F', color: '#FFFFFF', opacity: saving ? 0.7 : 1 }}>
          <Save size={14} /> {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  )
}

// ============ 心路历程列表 ============

function JourneyList({ activeModule, records, total, loading, onModuleChange, onNew, onEdit, onDelete, text, muted, border, inputBg, cardBg }) {
  const currentModule = MODULES.find(m => m.value === activeModule)

  return (
    <div>
      {/* 模块切换 */}
      <div className="flex gap-2 mb-4">
        {MODULES.map(m => (
          <button
            key={m.value}
            onClick={() => onModuleChange(m.value)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: activeModule === m.value ? `${m.color}18` : inputBg,
              color: activeModule === m.value ? m.color : muted,
              border: `1px solid ${activeModule === m.value ? m.color + '40' : border}`,
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 操作栏 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm" style={{ color: muted }}>
          {loading ? '加载中...' : `共 ${total} 条记录`}
        </span>
        <button onClick={onNew} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: currentModule.color, color: '#FFFFFF' }}>
          <Plus size={14} /> 新增
        </button>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: currentModule.color, borderTopColor: 'transparent' }} />
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ background: inputBg }}>
          <span className="text-3xl block mb-3 opacity-40">{currentModule.label.split(' ')[1]}</span>
          <p className="text-sm" style={{ color: muted }}>还没有记录，点击上方"新增"开始</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map(rec => (
            <div key={rec.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: inputBg, border: `1px solid ${border}` }}>
              {/* 封面缩略 */}
              <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center" style={{ background: cardBg }}>
                {(rec.cover_images || []).length > 0 ? (
                  <img src={rec.cover_images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span style={{ color: muted, opacity: 0.3 }}><ImageIcon size={16} /></span>
                )}
              </div>
              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium truncate" style={{ color: text }}>{rec.title}</span>
                </div>
                <span className="text-xs" style={{ color: muted }}>
                  {formatDate(rec.record_date)} · {truncate(rec.content, 40)}
                </span>
              </div>
              {/* 操作 */}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => onEdit(rec)} className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors" style={{ color: muted }}><Edit3 size={14} /></button>
                <button onClick={() => onDelete(rec.id)} className="p-2 rounded-lg hover:bg-red-100/20 transition-colors" style={{ color: '#EF4444' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============ 心路历程编辑表单 ============

function JourneyEditForm({ form, saving, isNew, onChange, onModuleChange, onSave, onCancel, onImageUpload, onRemoveImage, text, muted, border, inputBg, cardBg }) {
  const currentModule = MODULES.find(m => m.value === form.module)
  const maxImages = 10

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-lg font-bold" style={{ color: text }}>
          {isNew ? '新增记录' : '编辑记录'}
        </h3>
        <button onClick={onCancel} style={{ color: muted }}><X size={18} /></button>
      </div>

      <div className="space-y-4">
        {/* 模块选择 */}
        <div>
          <label className="block text-xs mb-1.5 font-medium" style={{ color: muted }}>记录类型</label>
          <div className="flex gap-2">
            {MODULES.map(m => (
              <button
                key={m.value}
                onClick={() => onModuleChange(m.value)}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: form.module === m.value ? `${m.color}18` : inputBg,
                  color: form.module === m.value ? m.color : muted,
                  border: `1px solid ${form.module === m.value ? m.color + '40' : border}`,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 日期 */}
        <div>
          <label className="block text-xs mb-1 font-medium" style={{ color: muted }}>记录日期</label>
          <input
            type="date"
            value={form.record_date}
            onChange={e => onChange('record_date', e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm border-none outline-none"
            style={{ background: inputBg, color: text }}
          />
        </div>

        {/* 标题 */}
        <Field label={form.module === 'exercise' ? '跑步主题 *' : form.module === 'reading' ? '书名 *' : '复盘标题 *'} value={form.title} onChange={v => onChange('title', v)} inputBg={inputBg} text={text} muted={muted} placeholder={
          form.module === 'exercise' ? '例如：第42次慢跑，跑了多少' :
          form.module === 'reading' ? '例如：《纳瓦尔宝典》' : '例如：4月运营复盘'
        } />

        {/* 封面图片 */}
        <div>
          <label className="block text-xs mb-1 font-medium" style={{ color: muted }}>
            封面图片（支持2-10张，跑步建议多张）
          </label>
          <div className="flex flex-wrap gap-3">
            {(form.cover_images || []).map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => onRemoveImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
                >
                  ×
                </button>
              </div>
            ))}
            {(form.cover_images || []).length < maxImages && (
              <label className="w-24 h-24 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors" style={{ background: inputBg, border: `1px dashed ${border}` }}>
                <Upload size={18} style={{ color: muted, opacity: 0.5 }} />
                <span className="text-xs mt-1" style={{ color: muted, opacity: 0.5 }}>上传</span>
                <input type="file" accept="image/*" onChange={e => onImageUpload(e, (form.cover_images || []).length)} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs mt-1.5" style={{ color: muted, opacity: 0.7 }}>
            {form.module === 'exercise' ? '建议上传多张跑步照片（2-10张）' : '上传书影或场景照'}
          </p>
        </div>

        {/* 正文 */}
        <div>
          <label className="block text-xs mb-1 font-medium" style={{ color: muted }}>
            {form.module === 'exercise' ? '跑步感受 *' : form.module === 'reading' ? '读后感 *' : '复盘内容 *'}
          </label>
          <textarea
            value={form.content}
            onChange={e => onChange('content', e.target.value)}
            rows={8}
            placeholder={
              form.module === 'exercise' ? '写写这次跑步的感受，路上的风景，脑子里在想什么...' :
              form.module === 'reading' ? '这本书讲了什么，对你有什么影响，最触动你的是哪一点...' :
              '这次探索做了什么，结果如何，有什么新发现...'
            }
            className="w-full px-3 py-2 rounded-lg text-sm border-none outline-none"
            style={{ background: inputBg, color: text, resize: 'vertical' }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4" style={{ borderTop: `1px solid ${border}` }}>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm" style={{ color: muted }}>取消</button>
        <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium" style={{ background: currentModule.color, color: '#FFFFFF', opacity: saving ? 0.7 : 1 }}>
          <Save size={14} /> {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  )
}

// ============ Field 组件 ============

function Field({ label, value, onChange, inputBg, text, muted, placeholder, multiline }) {
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div>
      <label className="block text-xs mb-1 font-medium" style={{ color: muted }}>{label}</label>
      <Tag
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? 4 : undefined}
        className="w-full px-3 py-2 rounded-lg text-sm border-none outline-none"
        style={{ background: inputBg, color: text, resize: multiline ? 'vertical' : 'none' }}
      />
    </div>
  )
}

// ============ 工具函数 ============

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

function truncate(str, max) {
  if (!str || str.length <= max) return str
  return str.slice(0, max) + '...'
}
