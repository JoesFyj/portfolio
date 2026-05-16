import { useState, useRef } from 'react'
import { X, GripVertical } from 'lucide-react'

const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB

export default function MultiImageUploader({ value = [], onChange, label = '上传图片' }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const theme = document.documentElement.getAttribute('data-theme') || 'dark'
  const isDark = theme === 'dark'
  const textColor = isDark ? '#E6EDF3' : '#1C1C1E'
  const mutedColor = isDark ? '#8B949E' : '#6B6860'
  const borderColor = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const inputBg = isDark ? '#0D1117' : '#F6F6F4'

  function validateFile(file) {
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件')
      return false
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(`图片大小不能超过${MAX_FILE_SIZE / 1024 / 1024}MB`)
      return false
    }
    return true
  }

  function processFile(file) {
    if (!validateFile(file)) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result
      onChange && onChange([...value, base64])
      setError('')
    }
    reader.readAsDataURL(file)
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files)
    files.forEach(processFile)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach(processFile)
  }

  function removeImage(index) {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange && onChange(newValue)
  }

  function moveImage(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= value.length) return
    const newValue = [...value]
    const [moved] = newValue.splice(fromIndex, 1)
    newValue.splice(toIndex, 0, moved)
    onChange && onChange(newValue)
  }

  return (
    <div className="mt-2">
      <label className="block text-xs font-medium mb-1" style={{ color: mutedColor }}>
        {label}（支持多图，每张 ≤1MB）
      </label>

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {value.map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border" style={{ borderColor }}>
              <img src={img} alt={`图片${i + 1}`} className="w-full h-20 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  onClick={() => moveImage(i, i - 1)}
                  disabled={i === 0}
                  className="p-1 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  onClick={() => removeImage(i)}
                  className="p-1 rounded bg-red-500/80 hover:bg-red-600"
                >
                  <X size={12} className="text-white" />
                </button>
                <button
                  onClick={() => moveImage(i, i + 1)}
                  disabled={i === value.length - 1}
                  className="p-1 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30"
                >
                  →
                </button>
              </div>
              <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                {i === 0 ? '封面' : i + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${dragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
        style={{ borderColor: dragging ? '#3B82F6' : borderColor, background: inputBg }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="text-sm" style={{ color: mutedColor }}>
          📁 点击或拖拽上传图片（支持多图选择）
        </p>
        <p className="text-xs mt-1" style={{ color: mutedColor }}>
          支持 JPG/PNG/GIF，单张 ≤1MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {error && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{error}</p>}
    </div>
  )
}
