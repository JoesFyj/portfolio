import { useState, useEffect } from 'react'
import { 
  Save, RotateCcw, Download, Upload, Eye, EyeOff, 
  Plus, Trash2, GripVertical, ChevronDown, ChevronRight,
  User, BookOpen, Activity, Briefcase, Share2, Settings, Palette
} from 'lucide-react'
import { getConfig, saveConfig, resetConfig, exportConfig, importConfig } from '../config/siteConfig'

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
                <input
                  type="text"
                  value={config.hero.avatar}
                  onChange={(e) => updateField('hero', 'avatar', e.target.value)}
                  placeholder="emoji 或图片 URL"
                  className="w-full px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: border, background: cardBg, color: text }}
                />
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
                <div className="grid grid-cols-2 gap-4">
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
                <FormGroup label="书名">
                  <input
                    type="text"
                    value={config.reading.current.name}
                    onChange={(e) => updateNestedField('reading', 'current.name', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: border, background: cardBg, color: text }}
                  />
                </FormGroup>
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
            </ModuleSection>
          )}

          {/* 跑步模块配置 */}
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
