import { useState, useEffect } from 'react'
import { 
  Save, RotateCcw, Download, Upload, Eye, EyeOff, 
  Plus, Trash2, GripVertical, ChevronDown, ChevronRight,
  User, BookOpen, Activity, Briefcase, Share2, Settings, Palette
} from 'lucide-react'
import { getConfig, saveConfig, resetConfig, exportConfig, importConfig } from '../config/siteConfig'
import ImageUploader, { AvatarUploader } from '../components/ImageUploader'
import MultiImageUploader from '../components/MultiImageUploader'
import AIWriter from '../components/AIWriter'

// 模块图标映射
const MODULE_ICONS = {
  hero: User,
  social: Share2,
  works: Briefcase,
  reading: BookOpen,
  exercise: Activity,
  about: User,
  theme: Palette,
}

// 模块标题映射
const MODULE_TITLES = {
  hero: 'Hero 区域',
  social: '社交媒体',
  works: '作品展示',
  reading: '读书模块',
  exercise: '跑步模块',
  about: '关于我',
  theme: '主题设置',
}

export default function Admin({ theme }) {
  const isDark = theme === 'dark'
  const [config, setConfig] = useState(() => getConfig())
  const [activeModule, setActiveModule] = useState('hero')
  const [expandedModules, setExpandedModules] = useState(['hero'])
  const [saveStatus, setSaveStatus] = useState('')
  const [previewMode, setPreviewMode] = useState(false)

  const bg = isDark ? '#0D1117' : '#FAF9F6'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const accent = '#2D6A4F'

  // 保存配置（自动同步到 localStorage + 通知同标签页更新）
  const handleSave = () => {
    saveConfig(config)
    setSaveStatus('已保存')
    setTimeout(() => setSaveStatus(''), 2000)
  }

  // 重置配置
  const handleReset = () => {
    if (confirm('确定要重置所有配置吗？此操作不可恢复。')) {
      resetConfig()
      setConfig(getConfig())
      setSaveStatus('已重置')
      setTimeout(() => setSaveStatus(''), 2000)
    }
  }

  // 导出配置
  const handleExport = () => {
    exportConfig()
  }

  // 导入配置
  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) {
      importConfig(file)
        .then((newConfig) => {
          setConfig(newConfig)
          setSaveStatus('导入成功')
          setTimeout(() => setSaveStatus(''), 2000)
        })
        .catch(() => {
          setSaveStatus('导入失败')
          setTimeout(() => setSaveStatus(''), 2000)
        })
    }
  }

  // 更新模块启用状态
  const toggleModule = (moduleName) => {
    setConfig(prev => ({
      ...prev,
      [moduleName]: { ...prev[moduleName], enabled: !prev[moduleName].enabled }
    }))
  }

  // 更新字段
  const updateField = (moduleName, field, value) => {
    setConfig(prev => ({
      ...prev,
      [moduleName]: { ...prev[moduleName], [field]: value }
    }))
  }

  // 更新嵌套字段
  const updateNestedField = (moduleName, path, value) => {
    setConfig(prev => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let target = newConfig[moduleName]
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]]
      }
      target[keys[keys.length - 1]] = value
      return newConfig
    })
  }

  // 切换模块展开
  const toggleExpand = (moduleName) => {
    setExpandedModules(prev => 
      prev.includes(moduleName) 
        ? prev.filter(m => m !== moduleName)
        : [...prev, moduleName]
    )
  }

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      {/* 顶部导航 */}
      <header 
        className="sticky top-0 z-50 px-6 py-4 border-b"
        style={{ background: cardBg, borderColor: border }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Settings size={24} style={{ color: accent }} />
            <h1 className="text-xl font-bold" style={{ color: text }}>网站配置后台</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 保存状态 */}
            {saveStatus && (
              <span className="text-sm px-3 py-1 rounded-full" style={{ 
                background: isDark ? 'rgba(45,106,79,0.2)' : 'rgba(45,106,79,0.1)',
                color: accent 
              }}>
                {saveStatus}
              </span>
            )}
            
            {/* 导出/导入 */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all hover:shadow-md"
              style={{ borderColor: border, color: muted }}
            >
              <Download size={16} /> 导出
            </button>
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all hover:shadow-md cursor-pointer"
              style={{ borderColor: border, color: muted }}
            >
              <Upload size={16} /> 导入
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            
            {/* 重置 */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all hover:shadow-md"
              style={{ borderColor: border, color: muted }}
            >
              <RotateCcw size={16} /> 重置
            </button>
            
            {/* 保存 */}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg"
              style={{ background: accent, color: '#fff' }}
            >
              <Save size={16} /> 保存
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* 左侧模块导航 */}
        <aside className="w-64 min-h-[calc(100vh-80px)] border-r p-4" style={{ borderColor: border }}>
          <div className="space-y-2">
            {Object.keys(MODULE_TITLES).map(moduleName => {
              const Icon = MODULE_ICONS[moduleName]
              const isEnabled = config[moduleName]?.enabled
              const isExpanded = expandedModules.includes(moduleName)
              
              return (
                <div key={moduleName}>
                  <button
                    onClick={() => {
                      setActiveModule(moduleName)
                      toggleExpand(moduleName)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                    style={{ 
                      background: activeModule === moduleName ? (isDark ? 'rgba(45,106,79,0.15)' : 'rgba(45,106,79,0.08)') : 'transparent',
                    }}
                  >
                    <Icon size={18} style={{ color: isEnabled ? accent : muted }} />
                    <span className="flex-1 text-left text-sm font-medium" style={{ color: isEnabled ? text : muted }}>
                      {MODULE_TITLES[moduleName]}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleModule(moduleName)
                      }}
                      className="p-1 rounded transition-colors"
                      style={{ color: isEnabled ? accent : muted }}
                    >
                      {isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    {isExpanded ? <ChevronDown size={16} style={{ color: muted }} /> : <ChevronRight size={16} style={{ color: muted }} />}
                  </button>
                </div>
              )
            })}
          </div>
        </aside>

        {/* 右侧配置区域 */}
        <main className="flex-1 p-8">
          {/* Hero 配置 */}
          {activeModule === 'hero' && (
            <ModuleSection title="Hero 区域配置" description="首页顶部展示区域">
              <FormGroup label="启用模块">
                <Toggle 
                  checked={config.hero.enabled} 
                  onChange={() => toggleModule('hero')}
                />
              </FormGroup>
              
              <FormGroup label="标签文字">
                <input
                  type="text"
                  value={config.hero.tag}
                  onChange={(e) => updateField('hero', 'tag', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="头像">
                <div className="flex items-center gap-4">
                  <AvatarUploader 
                    value={config.hero.avatar} 
                    onChange={(val) => updateField('hero', 'avatar', val)} 
                    theme={theme} 
                  />
                  <div className="flex-1">
                    <p className="text-xs mb-2" style={{ color: muted }}>支持本地上传或输入 emoji/图片 URL</p>
                    <input
                      type="text"
                      value={config.hero.avatar}
                      onChange={(e) => updateField('hero', 'avatar', e.target.value)}
                      placeholder="输入 emoji 或图片 URL"
                      className="w-full px-4 py-2 rounded-lg border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                  </div>
                </div>
              </FormGroup>
              
              <FormGroup label="名字">
                <input
                  type="text"
                  value={config.hero.name}
                  onChange={(e) => updateField('hero', 'name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="标题">
                <input
                  type="text"
                  value={config.hero.title}
                  onChange={(e) => updateField('hero', 'title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="副标题">
                <input
                  type="text"
                  value={config.hero.subtitle}
                  onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="座右铭">
                <input
                  type="text"
                  value={config.hero.motto}
                  onChange={(e) => updateField('hero', 'motto', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
            </ModuleSection>
          )}

          {/* 社交媒体配置 */}
          {activeModule === 'social' && (
            <ModuleSection title="社交媒体配置" description="平台数据展示">
              <FormGroup label="启用模块">
                <Toggle 
                  checked={config.social.enabled} 
                  onChange={() => toggleModule('social')}
                />
              </FormGroup>
              
              <FormGroup label="标题">
                <input
                  type="text"
                  value={config.social.title}
                  onChange={(e) => updateField('social', 'title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="副标题">
                <textarea
                  value={config.social.subtitle}
                  onChange={(e) => updateField('social', 'subtitle', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-4" style={{ color: text }}>平台列表</h4>
                {config.social.platforms.map((platform, index) => (
                  <div 
                    key={platform.name}
                    className="flex items-center gap-4 p-4 rounded-lg mb-3"
                    style={{ background: isDark ? '#0D1117' : '#F8F7F4' }}
                  >
                    <GripVertical size={16} style={{ color: muted }} />
                    <input
                      type="text"
                      value={platform.name}
                      onChange={(e) => {
                        const newPlatforms = [...config.social.platforms]
                        newPlatforms[index].name = e.target.value
                        updateField('social', 'platforms', newPlatforms)
                      }}
                      placeholder="平台名称"
                      className="flex-1 px-3 py-2 rounded border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                    <input
                      type="text"
                      value={platform.fans}
                      onChange={(e) => {
                        const newPlatforms = [...config.social.platforms]
                        newPlatforms[index].fans = e.target.value
                        updateField('social', 'platforms', newPlatforms)
                      }}
                      placeholder="粉丝数"
                      className="w-24 px-3 py-2 rounded border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                    <button
                      onClick={() => {
                        const newPlatforms = [...config.social.platforms]
                        newPlatforms[index].enabled = !newPlatforms[index].enabled
                        updateField('social', 'platforms', newPlatforms)
                      }}
                      className="p-2 rounded"
                      style={{ color: platform.enabled ? accent : muted }}
                    >
                      {platform.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            </ModuleSection>
          )}

          {/* 作品模块配置 */}
          {activeModule === 'works' && (
            <ModuleSection title="作品展示配置" description="作品列表与封面">
              <FormGroup label="启用模块">
                <Toggle 
                  checked={config.works?.enabled !== false} 
                  onChange={() => updateField('works', 'enabled', !config.works?.enabled)}
                />
              </FormGroup>
              
              <FormGroup label="副标题">
                <input
                  type="text"
                  value={config.works?.subtitle || ''}
                  onChange={(e) => updateField('works', 'subtitle', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                  placeholder="用 AI 放大个人产出..."
                />
              </FormGroup>
              
              <FormGroup label="显示在首页轮播">
                <Toggle 
                  checked={config.works?.showOnHero !== false} 
                  onChange={() => updateField('works', 'showOnHero', !config.works?.showOnHero)}
                />
              </FormGroup>
              
              {/* 分类管理 */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium" style={{ color: text }}>项目分类</h4>
                  <button
                    onClick={() => {
                      const newCategories = [...(config.works?.categories || [])]
                      newCategories.push({
                        id: `cat-${Date.now()}`,
                        name: '新分类',
                        icon: 'folder',
                        enabled: true,
                      })
                      updateField('works', 'categories', newCategories)
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-all"
                    style={{ borderColor: border, color: muted }}
                  >
                    <Plus size={14} /> 添加分类
                  </button>
                </div>
                
                {(config.works?.categories || []).map((cat, index) => (
                  <div key={cat.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => {
                        const newCategories = [...(config.works?.categories || [])]
                        newCategories[index].name = e.target.value
                        updateField('works', 'categories', newCategories)
                      }}
                      placeholder="分类名称"
                      className="flex-1 px-3 py-2 rounded border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                    <button
                      onClick={() => {
                        const newCategories = (config.works?.categories || []).filter((_, i) => i !== index)
                        updateField('works', 'categories', newCategories)
                      }}
                      className="p-2 rounded hover:bg-red-500/10"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* 合作区域 */}
              <div className="mt-6 p-4 rounded-lg" style={{ background: isDark ? '#0D1117' : '#F8F7F4' }}>
                <h4 className="text-sm font-medium mb-4" style={{ color: text }}>开放合作区域</h4>
                <FormGroup label="启用">
                  <Toggle 
                    checked={config.works?.collaboration?.enabled !== false} 
                    onChange={() => updateNestedField('works', 'collaboration.enabled', !config.works?.collaboration?.enabled)}
                  />
                </FormGroup>
                <FormGroup label="标题">
                  <input
                    type="text"
                    value={config.works?.collaboration?.title || ''}
                    onChange={(e) => updateNestedField('works', 'collaboration.title', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: border, background: cardBg, color: text }}
                  />
                </FormGroup>
                <FormGroup label="副标题">
                  <input
                    type="text"
                    value={config.works?.collaboration?.subtitle || ''}
                    onChange={(e) => updateNestedField('works', 'collaboration.subtitle', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: border, background: cardBg, color: text }}
                  />
                </FormGroup>
                <FormGroup label="按钮文字">
                  <input
                    type="text"
                    value={config.works?.collaboration?.buttonText || ''}
                    onChange={(e) => updateNestedField('works', 'collaboration.buttonText', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: border, background: cardBg, color: text }}
                  />
                </FormGroup>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium" style={{ color: text }}>作品列表</h4>
                  <button
                    onClick={() => {
                      const newItems = [...(config.works?.items || [])]
                      const defaultCategory = config.works?.categories?.[0]?.id || 'all'
                      newItems.push({
                        id: Date.now(),
                        name: '新作品',
                        desc: '作品描述',
                        icon: '📦',
                        color: '#2D6A4F',
                        url: '/works',
                        images: [],
                        enabled: true,
                        category: defaultCategory,
                        features: [],
                      })
                      updateField('works', 'items', newItems)
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-all"
                    style={{ borderColor: border, color: muted }}
                  >
                    <Plus size={14} /> 添加作品
                  </button>
                </div>
                
                {(config.works?.items || []).map((work, index) => (
                  <div key={work.id} className="p-4 rounded-lg mb-4" style={{ background: isDark ? '#0D1117' : '#F8F7F4' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <GripVertical size={16} style={{ color: muted }} />
                      <span className="text-sm font-medium flex-1" style={{ color: text }}>作品 {index + 1}</span>
                      <button
                        onClick={() => {
                          const newItems = (config.works?.items || []).filter((_, i) => i !== index)
                          updateField('works', 'items', newItems)
                        }}
                        className="p-1.5 rounded hover:bg-red-500/10"
                        style={{ color: '#EF4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <FormGroup label="作品名称">
                      <input
                        type="text"
                        value={work.name}
                        onChange={(e) => {
                          const newItems = [...(config.works?.items || [])]
                          newItems[index].name = e.target.value
                          updateField('works', 'items', newItems)
                        }}
                        className="w-full px-4 py-2 rounded-lg border text-sm"
                        style={{ borderColor: border, background: cardBg, color: text }}
                      />
                    </FormGroup>
                    
                    <FormGroup label="描述">
                      <input
                        type="text"
                        value={work.desc}
                        onChange={(e) => {
                          const newItems = [...(config.works?.items || [])]
                          newItems[index].desc = e.target.value
                          updateField('works', 'items', newItems)
                        }}
                        className="w-full px-4 py-2 rounded-lg border text-sm"
                        style={{ borderColor: border, background: cardBg, color: text }}
                      />
                    </FormGroup>
                    
                    <FormGroup label="分类">
                      <select
                        value={work.category || 'all'}
                        onChange={(e) => {
                          const newItems = [...(config.works?.items || [])]
                          newItems[index].category = e.target.value
                          updateField('works', 'items', newItems)
                        }}
                        className="w-full px-4 py-2 rounded-lg border text-sm"
                        style={{ borderColor: border, background: cardBg, color: text }}
                      >
                        {(config.works?.categories || []).map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </FormGroup>
                    
                    <FormGroup label="技术标签（逗号分隔）">
                      <input
                        type="text"
                        value={(work.features || []).join(', ')}
                        onChange={(e) => {
                          const newItems = [...(config.works?.items || [])]
                          newItems[index].features = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          updateField('works', 'items', newItems)
                        }}
                        placeholder="React, Supabase, AI评审"
                        className="w-full px-4 py-2 rounded-lg border text-sm"
                        style={{ borderColor: border, background: cardBg, color: text }}
                      />
                    </FormGroup>
                    
                    <FormGroup label="封面图片（支持多图）">
                      <MultiImageUploader
                        value={work.images || []}
                        onChange={(val) => {
                          const newItems = [...(config.works?.items || [])]
                          newItems[index].images = val
                          updateField('works', 'items', newItems)
                        }}
                        label="作品封面（第一张为封面）"
                      />
                    </FormGroup>
                    
                    <FormGroup label="链接">
                      <input
                        type="text"
                        value={work.url}
                        onChange={(e) => {
                          const newItems = [...(config.works?.items || [])]
                          newItems[index].url = e.target.value
                          updateField('works', 'items', newItems)
                        }}
                        className="w-full px-4 py-2 rounded-lg border text-sm"
                        style={{ borderColor: border, background: cardBg, color: text }}
                      />
                    </FormGroup>
                  </div>
                ))}
              </div>
            </ModuleSection>
          )}


          {/* 读书模块配置 */}
          {activeModule === 'reading' && (
            <ModuleSection title="读书模块配置" description="阅读数据与记录">
              <FormGroup label="启用模块">
                <Toggle 
                  checked={config.reading.enabled} 
                  onChange={() => toggleModule('reading')}
                />
              </FormGroup>
              
              <FormGroup label="标题">
                <input
                  type="text"
                  value={config.reading.title}
                  onChange={(e) => updateField('reading', 'title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <div className="mt-6 p-4 rounded-lg" style={{ background: isDark ? '#0D1117' : '#F8F7F4' }}>
                <h4 className="text-sm font-medium mb-4" style={{ color: text }}>阅读全貌</h4>
                <FormGroup label="封面图">
                  <ImageUploader 
                    value={config.reading.overview.image} 
                    onChange={(val) => updateNestedField('reading', 'overview.image', val)} 
                    theme={theme}
                  />
                </FormGroup>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormGroup label="年度目标">
                    <input
                      type="number"
                      value={config.reading.overview.target}
                      onChange={(e) => updateNestedField('reading', 'overview.target', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                  </FormGroup>
                  <FormGroup label="已读书籍">
                    <input
                      type="number"
                      value={config.reading.overview.total}
                      onChange={(e) => updateNestedField('reading', 'overview.total', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                  </FormGroup>
                  <FormGroup label="累计页数">
                    <input
                      type="number"
                      value={config.reading.overview.pages}
                      onChange={(e) => updateNestedField('reading', 'overview.pages', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                  </FormGroup>
                  <FormGroup label="阅读时长(小时)">
                    <input
                      type="number"
                      value={config.reading.overview.hours}
                      onChange={(e) => updateNestedField('reading', 'overview.hours', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                  </FormGroup>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg" style={{ background: isDark ? '#0D1117' : '#F8F7F4' }}>
                <h4 className="text-sm font-medium mb-4" style={{ color: text }}>当前在读</h4>
                <div className="flex gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <ImageUploader
                      value={config.reading.current.cover}
                      onChange={(val) => updateNestedField('reading', 'current.cover', val)}
                      placeholder="封面"
                      theme={theme}
                    />
                  </div>
                  <div className="flex-1">
                    <FormGroup label="书名">
                      <input
                        type="text"
                        value={config.reading.current.name}
                        onChange={(e) => updateNestedField('reading', 'current.name', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border text-sm"
                        style={{ borderColor: border, background: cardBg, color: text }}
                      />
                    </FormGroup>
                  </div>
                </div>
                <FormGroup label="阅读进度 (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.reading.current.progress}
                    onChange={(e) => updateNestedField('reading', 'current.progress', parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: border, background: cardBg, color: text }}
                  />
                </FormGroup>
                <FormGroup label="心得摘要">
                  <textarea
                    value={config.reading.current.summary}
                    onChange={(e) => updateNestedField('reading', 'current.summary', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: border, background: cardBg, color: text }}
                  />
                </FormGroup>
              </div>

              {/* 阅读记录管理 */}
              <div className="mt-6 p-4 rounded-lg" style={{ background: isDark ? '#0D1117' : '#F8F7F4' }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium" style={{ color: text }}>阅读记录 ({(config.reading.records || []).length})</h4>
                  <button
                    onClick={() => {
                      const newRecord = {
                        id: Date.now(),
                        name: '新书名',
                        cover: '📖',
                        summary: '',
                        note: '',
                        readAt: new Date().toISOString().slice(0, 10),
                        rating: 0,
                        pages: 0,
                        enabled: true,
                        articleUrl: '',
                        articleTopic: '',
                        articleOutline: '',
                        articleContent: '',
                        articleUpdatedAt: '',
                      }
                      const newConfig = { ...config }
                      newConfig.reading = { ...newConfig.reading, records: [...(newConfig.reading.records || []), newRecord] }
                      setConfig(newConfig)
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={{ background: accent, color: '#fff' }}
                  >
                    + 新增记录
                  </button>
                </div>
                <div className="space-y-3">
                  {(config.reading.records || []).map((book, idx) => (
                    <div key={book.id} className="p-3 rounded-lg" style={{ background: cardBg, border: `1px solid ${border}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={book.name}
                          onChange={(e) => {
                            const newConfig = { ...config }
                            newConfig.reading.records[idx] = { ...newConfig.reading.records[idx], name: e.target.value }
                            setConfig(newConfig)
                          }}
                          className="font-medium text-sm flex-1 mr-2 px-2 py-1 rounded border"
                          style={{ borderColor: border, background: isDark ? '#0D1117' : '#FAF9F6', color: text }}
                          placeholder="书名"
                        />
                        <button
                          onClick={() => {
                            const newConfig = { ...config }
                            newConfig.reading.records = newConfig.reading.records.filter((_, i) => i !== idx)
                            setConfig(newConfig)
                          }}
                          className="flex-shrink-0 p-1.5 rounded text-xs transition-all hover:bg-red-500/10"
                          style={{ color: '#EF4444' }}
                          title="删除"
                        >
                          ✕ 删除
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <input type="text" value={book.readAt || ''} onChange={(e) => { const nc = { ...config }; nc.reading.records[idx] = { ...nc.reading.records[idx], readAt: e.target.value }; setConfig(nc); }} placeholder="日期" className="px-2 py-1 rounded border text-xs" style={{ borderColor: border, background: isDark ? '#0D1117' : '#FAF9F6', color: text }} />
                        <input type="number" value={book.pages || ''} onChange={(e) => { const nc = { ...config }; nc.reading.records[idx] = { ...nc.reading.records[idx], pages: parseInt(e.target.value) }; setConfig(nc); }} placeholder="页数" className="px-2 py-1 rounded border text-xs" style={{ borderColor: border, background: isDark ? '#0D1117' : '#FAF9F6', color: text }} />
                        <input type="number" min="0" max="5" value={book.rating || ''} onChange={(e) => { const nc = { ...config }; nc.reading.records[idx] = { ...nc.reading.records[idx], rating: parseInt(e.target.value) }; setConfig(nc); }} placeholder="评分1-5" className="px-2 py-1 rounded border text-xs" style={{ borderColor: border, background: isDark ? '#0D1117' : '#FAF9F6', color: text }} />
                      </div>
                      <textarea value={book.summary || ''} onChange={(e) => { const nc = { ...config }; nc.reading.records[idx] = { ...nc.reading.records[idx], summary: e.target.value }; setConfig(nc); }} placeholder="摘要..." rows={2} className="w-full px-2 py-1 rounded border text-xs" style={{ borderColor: border, background: isDark ? '#0D1117' : '#FAF9F6', color: text }} />
                      <input type="text" value={book.note || ''} onChange={(e) => { const nc = { ...config }; nc.reading.records[idx] = { ...nc.reading.records[idx], note: e.target.value }; setConfig(nc); }} placeholder="标签（逗号分隔）" className="w-full mt-1 px-2 py-1 rounded border text-xs" style={{ borderColor: border, background: isDark ? '#0D1117' : '#FAF9F6', color: text }} />
                    </div>
                  ))}
                </div>
              </div>
            </ModuleSection>
          )}{/* 跑步模块配置 */}
          {activeModule === 'exercise' && (
            <ModuleSection title="跑步模块配置" description="运动数据与记录">
              <FormGroup label="启用模块">
                <Toggle 
                  checked={config.exercise.enabled} 
                  onChange={() => toggleModule('exercise')}
                />
              </FormGroup>
              
              <FormGroup label="标题">
                <input
                  type="text"
                  value={config.exercise.title}
                  onChange={(e) => updateField('exercise', 'title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="座右铭">
                <input
                  type="text"
                  value={config.exercise.motto}
                  onChange={(e) => updateField('exercise', 'motto', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <div className="mt-6 p-4 rounded-lg" style={{ background: isDark ? '#0D1117' : '#F8F7F4' }}>
                <h4 className="text-sm font-medium mb-4" style={{ color: text }}>跑步轨迹</h4>
                <FormGroup label="轨迹封面图">
                  <ImageUploader
                    value={config.exercise.trajectory?.image}
                    onChange={(val) => updateNestedField('exercise', 'trajectory.image', val)}
                    theme={theme}
                  />
                </FormGroup>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ background: isDark ? '#0D1117' : '#F8F7F4' }}>
                <h4 className="text-sm font-medium mb-4" style={{ color: text }}>核心数据</h4>
                <div className="grid grid-cols-3 gap-4">
                  <FormGroup label="连续打卡(天)">
                    <input
                      type="number"
                      value={config.exercise.stats.streak}
                      onChange={(e) => updateNestedField('exercise', 'stats.streak', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                  </FormGroup>
                  <FormGroup label="今年跑量(km)">
                    <input
                      type="number"
                      value={config.exercise.stats.yearDistance}
                      onChange={(e) => updateNestedField('exercise', 'stats.yearDistance', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                  </FormGroup>
                  <FormGroup label="本周跑量(km)">
                    <input
                      type="number"
                      value={config.exercise.stats.weekDistance}
                      onChange={(e) => updateNestedField('exercise', 'stats.weekDistance', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                  </FormGroup>
                </div>
              </div>

              {/* 跑步记录管理 */}
              <div className="mt-6 p-4 rounded-lg" style={{ background: isDark ? '#0D1117' : '#F8F7F4' }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium" style={{ color: text }}>跑步记录 ({(config.exercise.records || []).length})</h4>
                  <button
                    onClick={() => {
                      const newRecord = {
                        id: Date.now(),
                        title: '新跑步记录',
                        date: new Date().toISOString().slice(0, 10),
                        distance: 0,
                        duration: '',
                        pace: '',
                        image: '',
                        note: '',
                        articleUrl: '',
                        enabled: true,
                        articleTopic: '',
                        articleOutline: '',
                        articleContent: '',
                        articleUpdatedAt: '',
                      }
                      const newConfig = { ...config }
                      newConfig.exercise = { ...newConfig.exercise, records: [...(newConfig.exercise.records || []), newRecord] }
                      setConfig(newConfig)
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={{ background: accent, color: '#fff' }}
                  >
                    + 新增记录
                  </button>
                </div>
                <div className="space-y-3">
                  {(config.exercise.records || []).map((rec, idx) => (
                    <div key={rec.id} className="p-3 rounded-lg" style={{ background: cardBg, border: `1px solid ${border}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={rec.title}
                          onChange={(e) => {
                            const nc = { ...config }
                            nc.exercise.records[idx] = { ...nc.exercise.records[idx], title: e.target.value }
                            setConfig(nc)
                          }}
                          className="font-medium text-sm flex-1 mr-2 px-2 py-1 rounded border"
                          style={{ borderColor: border, background: isDark ? '#0D1117' : '#FAF9F6', color: text }}
                          placeholder="标题"
                        />
                        <button
                          onClick={() => {
                            const nc = { ...config }
                            nc.exercise.records = nc.exercise.records.filter((_, i) => i !== idx)
                            setConfig(nc)
                          }}
                          className="flex-shrink-0 p-1.5 rounded text-xs transition-all hover:bg-red-500/10"
                          style={{ color: '#EF4444' }}
                          title="删除"
                        >
                          ✕ 删除
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <input type="text" value={rec.date || ''} onChange={(e) => { const nc = { ...config }; nc.exercise.records[idx] = { ...nc.exercise.records[idx], date: e.target.value }; setConfig(nc); }} placeholder="日期" className="px-2 py-1 rounded border text-xs" style={{ borderColor: border, background: isDark ? '#0D1117' : '#FAF9F6', color: text }} />
                        <input type="number" value={rec.distance || ''} onChange={(e) => { const nc = { ...config }; nc.exercise.records[idx] = { ...nc.exercise.records[idx], distance: parseFloat(e.target.value) }; setConfig(nc); }} placeholder="距离km" className="px-2 py-1 rounded border text-xs" style={{ borderColor: border, background: isDark ? '#0D1117' : '#FAF9F6', color: text }} />
                        <input type="text" value={rec.duration || ''} onChange={(e) => { const nc = { ...config }; nc.exercise.records[idx] = { ...nc.exercise.records[idx], duration: e.target.value }; setConfig(nc); }} placeholder="时长" className="px-2 py-1 rounded border text-xs" style={{ borderColor: border, background: isDark ? '#0D1117' : '#FAF9F6', color: text }} />
                      </div>
                      <textarea value={rec.note || ''} onChange={(e) => { const nc = { ...config }; nc.exercise.records[idx] = { ...nc.exercise.records[idx], note: e.target.value }; setConfig(nc); }} placeholder="心得..." rows={2} className="w-full px-2 py-1 rounded border text-xs" style={{ borderColor: border, background: isDark ? '#0D1117' : '#FAF9F6', color: text }} />
                    </div>
                  ))}
                </div>
              </div>
            </ModuleSection>
          )}{/* 关于模块配置 */}
          {activeModule === 'about' && (
            <ModuleSection title="联系页面配置" description="主视觉卡片与快捷链接">
              <FormGroup label="启用模块">
                <Toggle 
                  checked={config.about?.enabled !== false} 
                  onChange={() => updateField('about', 'enabled', !config.about?.enabled)}
                />
              </FormGroup>
              
              <FormGroup label="页面标题">
                <input
                  type="text"
                  value={config.about?.title || '联系小福'}
                  onChange={(e) => updateField('about', 'title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="副标题">
                <input
                  type="text"
                  value={config.about?.subtitle || ''}
                  onChange={(e) => updateField('about', 'subtitle', e.target.value)}
                  placeholder="选择你喜欢的方式，随时找我聊聊"
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="主视觉背景图">
                <input
                  type="text"
                  value={config.about?.heroImage || ''}
                  onChange={(e) => updateField('about', 'heroImage', e.target.value)}
                  placeholder="图片 URL 或 base64"
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="公众号二维码">
                <input
                  type="text"
                  value={config.about?.qrcodes?.wechatOfficial || ''}
                  onChange={(e) => updateNestedField('about', 'qrcodes.wechatOfficial', e.target.value)}
                  placeholder="图片 URL 或 base64"
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="个人微信二维码">
                <input
                  type="text"
                  value={config.about?.qrcodes?.wechat || ''}
                  onChange={(e) => updateNestedField('about', 'qrcodes.wechat', e.target.value)}
                  placeholder="图片 URL 或 base64"
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="邮箱">
                <input
                  type="email"
                  value={config.about?.email || ''}
                  onChange={(e) => updateField('about', 'email', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="位置">
                <input
                  type="text"
                  value={config.about?.location || ''}
                  onChange={(e) => updateField('about', 'location', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              <FormGroup label="版权信息">
                <input
                  type="text"
                  value={config.about?.copyright || ''}
                  onChange={(e) => updateField('about', 'copyright', e.target.value)}
                  placeholder={`© ${new Date().getFullYear()} 小福. All rights reserved.`}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
              </FormGroup>
              
              {/* 快捷链接配置 */}
              <div className="mt-6 p-4 rounded-lg" style={{ background: isDark ? '#0D1117' : '#F8F7F4' }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium" style={{ color: text }}>快捷链接</h4>
                  <button
                    onClick={() => {
                      const newLinks = [...(config.about?.quickLinks || [])]
                      newLinks.push({ icon: 'external', label: '新链接', url: '#' })
                      updateField('about', 'quickLinks', newLinks)
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-all"
                    style={{ borderColor: border, color: muted }}
                  >
                    <Plus size={14} /> 添加
                  </button>
                </div>
                
                {(config.about?.quickLinks || []).map((link, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <select
                      value={link.icon}
                      onChange={(e) => {
                        const newLinks = [...(config.about?.quickLinks || [])]
                        newLinks[index].icon = e.target.value
                        updateField('about', 'quickLinks', newLinks)
                      }}
                      className="w-24 px-2 py-2 rounded border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    >
                      <option value="feishu">飞书</option>
                      <option value="twitter">Twitter</option>
                      <option value="github">GitHub</option>
                      <option value="mail">邮箱</option>
                      <option value="send">发送</option>
                      <option value="message">消息</option>
                      <option value="book">书本</option>
                      <option value="location">位置</option>
                      <option value="external">链接</option>
                    </select>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...(config.about?.quickLinks || [])]
                        newLinks[index].label = e.target.value
                        updateField('about', 'quickLinks', newLinks)
                      }}
                      placeholder="标签"
                      className="flex-1 px-3 py-2 rounded border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                    <input
                      type="text"
                      value={link.url || ''}
                      onChange={(e) => {
                        const newLinks = [...(config.about?.quickLinks || [])]
                        newLinks[index].url = e.target.value || null
                        updateField('about', 'quickLinks', newLinks)
                      }}
                      placeholder="链接（空则纯展示）"
                      className="flex-1 px-3 py-2 rounded border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                    <button
                      onClick={() => {
                        const newLinks = (config.about?.quickLinks || []).filter((_, i) => i !== index)
                        updateField('about', 'quickLinks', newLinks)
                      }}
                      className="p-2 rounded hover:bg-red-500/10"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* 社交图标配置 */}
              <div className="mt-6 p-4 rounded-lg" style={{ background: isDark ? '#0D1117' : '#F8F7F4' }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium" style={{ color: text }}>底部社交图标</h4>
                  <button
                    onClick={() => {
                      const newContacts = [...(config.about?.contacts || [])]
                      newContacts.push({ name: '新平台', icon: 'external', url: '', enabled: true })
                      updateField('about', 'contacts', newContacts)
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-all"
                    style={{ borderColor: border, color: muted }}
                  >
                    <Plus size={14} /> 添加
                  </button>
                </div>
                
                {(config.about?.contacts || []).map((contact, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <select
                      value={contact.icon}
                      onChange={(e) => {
                        const newContacts = [...(config.about?.contacts || [])]
                        newContacts[index].icon = e.target.value
                        updateField('about', 'contacts', newContacts)
                      }}
                      className="w-24 px-2 py-2 rounded border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    >
                      <option value="feishu">飞书</option>
                      <option value="twitter">Twitter</option>
                      <option value="github">GitHub</option>
                      <option value="mail">邮箱</option>
                      <option value="send">发送</option>
                      <option value="message">消息</option>
                      <option value="book">书本</option>
                      <option value="location">位置</option>
                      <option value="external">链接</option>
                    </select>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => {
                        const newContacts = [...(config.about?.contacts || [])]
                        newContacts[index].name = e.target.value
                        updateField('about', 'contacts', newContacts)
                      }}
                      placeholder="名称"
                      className="flex-1 px-3 py-2 rounded border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                    <input
                      type="text"
                      value={contact.url || ''}
                      onChange={(e) => {
                        const newContacts = [...(config.about?.contacts || [])]
                        newContacts[index].url = e.target.value || null
                        updateField('about', 'contacts', newContacts)
                      }}
                      placeholder="链接"
                      className="flex-1 px-3 py-2 rounded border text-sm"
                      style={{ borderColor: border, background: cardBg, color: text }}
                    />
                    <button
                      onClick={() => {
                        const newContacts = [...(config.about?.contacts || [])]
                        newContacts[index].enabled = !newContacts[index].enabled
                        updateField('about', 'contacts', newContacts)
                      }}
                      className="p-2 rounded"
                      style={{ color: contact.enabled !== false ? accent : muted }}
                    >
                      {contact.enabled !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => {
                        const newContacts = (config.about?.contacts || []).filter((_, i) => i !== index)
                        updateField('about', 'contacts', newContacts)
                      }}
                      className="p-2 rounded hover:bg-red-500/10"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </ModuleSection>
          )}

          {/* 主题配置 */}
          {activeModule === 'theme' && (
            <ModuleSection title="主题设置" description="外观与配色">
              <FormGroup label="主题色">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.theme.primaryColor}
                    onChange={(e) => updateField('theme', 'primaryColor', e.target.value)}
                    className="w-12 h-10 rounded border cursor-pointer"
                    style={{ borderColor: border }}
                  />
                  <input
                    type="text"
                    value={config.theme.primaryColor}
                    onChange={(e) => updateField('theme', 'primaryColor', e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: border, background: cardBg, color: text }}
                  />
                </div>
              </FormGroup>
              
              <FormGroup label="默认主题模式">
                <select
                  value={config.theme.darkMode}
                  onChange={(e) => updateField('theme', 'darkMode', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                >
                  <option value="auto">跟随系统</option>
                  <option value="light">浅色模式</option>
                  <option value="dark">深色模式</option>
                </select>
              </FormGroup>
            </ModuleSection>
          )}
        </main>
      </div>
    </div>
  )
}

// 模块区块组件
function ModuleSection({ title, description, children }) {
  const isDark = document.documentElement.classList.contains('dark')
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: text }}>{title}</h2>
        <p className="text-sm" style={{ color: muted }}>{description}</p>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

// 表单组组件
function FormGroup({ label, children }) {
  const isDark = document.documentElement.classList.contains('dark')
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: text }}>{label}</label>
      {children}
    </div>
  )
}

// 开关组件
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className="relative w-12 h-6 rounded-full transition-colors"
      style={{ background: checked ? '#2D6A4F' : '#6B6860' }}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
        style={{ transform: checked ? 'translateX(26px)' : 'translateX(4px)' }}
      />
    </button>
  )
}
