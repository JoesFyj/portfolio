import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

// 最大文件大小：1MB（base64 存储有限制）
const MAX_FILE_SIZE = 1024 * 1024

export default function ImageUploader({ value, onChange, placeholder = '点击或拖拽上传图片', theme }) {
  const isDark = theme === 'dark'
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const border = isDark ? '#30363D' : '#E8E5DF'
  const text = isDark ? '#E6EDF3' : '#1C1C1E'
  const muted = isDark ? '#8B949E' : '#6B6860'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const accent = '#2D6A4F'

  const handleFile = async (file) => {
    setError('')
    
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件')
      return
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setError(`图片太大，请选择小于 1MB 的图片`)
      return
    }
    
    try {
      const base64 = await fileToBase64(file)
      onChange(base64)
    } catch (err) {
      setError('图片处理失败')
    }
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onChange('')
  }

  return (
    <div>
      {/* 预览区域 */}
      {value && (
        <div className="relative mb-3 rounded-lg overflow-hidden" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <img src={value} alt="预览" className="w-full h-40 object-contain" />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 上传区域 */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="relative cursor-pointer rounded-lg border-2 border-dashed transition-all"
        style={{
          borderColor: isDragging ? accent : border,
          background: isDragging 
            ? (isDark ? 'rgba(45,106,79,0.1)' : 'rgba(45,106,79,0.05)') 
            : cardBg,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center py-8 px-4">
          {isDragging ? (
            <>
              <Upload size={24} style={{ color: accent }} className="mb-2" />
              <span className="text-sm font-medium" style={{ color: accent }}>松开以上传</span>
            </>
          ) : value ? (
            <>
              <ImageIcon size={24} style={{ color: muted }} className="mb-2" />
              <span className="text-sm" style={{ color: muted }}>点击更换图片</span>
            </>
          ) : (
            <>
              <Upload size={24} style={{ color: muted }} className="mb-2" />
              <span className="text-sm font-medium mb-1" style={{ color: text }}>{placeholder}</span>
              <span className="text-xs" style={{ color: muted }}>支持 JPG、PNG，最大 1MB</span>
            </>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="mt-2 text-xs" style={{ color: '#EF4444' }}>{error}</p>
      )}
    </div>
  )
}

// 简单版本：用于头像等小图
export function AvatarUploader({ value, onChange, theme }) {
  const isDark = theme === 'dark'
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    
    if (file.size > MAX_FILE_SIZE) {
      alert('图片太大，请选择小于 1MB 的图片')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => onChange(e.target.result)
    reader.readAsDataURL(file)
  }

  const border = isDark ? '#30363D' : '#E8E5DF'
  const cardBg = isDark ? '#161B22' : '#FFFFFF'
  const accent = '#2D6A4F'

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      className="relative cursor-pointer"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0]
          if (file) handleFile(file)
        }}
        className="hidden"
      />
      
      <div 
        className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-4xl transition-all overflow-hidden"
        style={{ 
          background: isDark ? '#21262D' : '#F0EFEA', 
          border: `3px solid ${isDragging ? accent : border}`,
        }}
      >
        {value ? (
          <img src={value} alt="头像" className="w-full h-full object-cover" />
        ) : (
          '📷'
        )}
      </div>
    </div>
  )
}
