import { supabase, isSupabaseConfigured } from './supabase'

const LOCAL_KEY = 'xiaofu_journey_data'

// ============ Journey Records API ============

export async function getJourneyRecords(module = null, page = 1, pageSize = 5) {
  if (!supabase) return getLocalJourneyRecords(module, page, pageSize)

  let query = supabase
    .from('journey_records')
    .select('*', { count: 'exact' })
    .order('record_date', { ascending: false })

  if (module && module !== 'all') {
    query = query.eq('module', module)
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, error, count } = await query
  if (error) {
    console.error('Failed to fetch journey records:', error)
    return getLocalJourneyRecords(module, page, pageSize)
  }
  return { records: data || [], total: count || 0 }
}

export async function getRecordById(id) {
  if (!supabase) {
    const data = getLocalData()
    return (data.records || []).find(r => r.id === id) || null
  }
  const { data, error } = await supabase
    .from('journey_records')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function createRecord(record) {
  if (!supabase) return createLocalRecord(record)

  const { data, error } = await supabase
    .from('journey_records')
    .insert(record)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRecord(id, updates) {
  if (!supabase) return updateLocalRecord(id, updates)

  const { data, error } = await supabase
    .from('journey_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRecord(id) {
  if (!supabase) return deleteLocalRecord(id)

  const { error } = await supabase
    .from('journey_records')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// 压缩图片到指定最大尺寸和KB
function compressImage(file, maxWidth = 1200, maxHeight = 1200, maxKB = 150) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = e => {
      img.src = e.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        // 从0.9质量开始递减，直到小于maxKB
        let quality = 0.9
        const tryCompress = () => {
          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          const sizeKB = (dataUrl.length * 0.75) / 1024
          if (sizeKB <= maxKB || quality <= 0.3) {
            resolve(dataUrl)
          } else {
            quality -= 0.1
            tryCompress()
          }
        }
        tryCompress()
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function uploadJourneyImage(file, module) {
  if (!supabase) {
    // localStorage fallback: 先压缩再返回 data URL
    return compressImage(file, 1200, 1200, 150)
  }

  const ext = file.name.split('.').pop()
  const path = `${module}/${Date.now()}.${ext}`
  const { data, error } = await supabase.storage
    .from('journey-images')
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from('journey-images')
    .getPublicUrl(data.Key || path)

  return urlData.publicUrl
}

// ============ Local Fallback ============

function getLocalData() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{"records":[]}')
  } catch { return { records: [] } }
}

function saveLocalData(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

function getLocalJourneyRecords(module, page, pageSize) {
  const data = getLocalData()
  let records = data.records || []

  if (module && module !== 'all') {
    records = records.filter(r => r.module === module)
  }

  records.sort((a, b) => new Date(b.record_date) - new Date(a.record_date))

  const start = (page - 1) * pageSize
  const paged = records.slice(start, start + pageSize)
  return { records: paged, total: records.length }
}

function createLocalRecord(record) {
  const data = getLocalData()
  const newRecord = {
    ...record,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  data.records.unshift(newRecord)
  saveLocalData(data)
  return newRecord
}

function updateLocalRecord(id, updates) {
  const data = getLocalData()
  const idx = data.records.findIndex(r => r.id === id)
  if (idx === -1) return null
  data.records[idx] = { ...data.records[idx], ...updates, updated_at: new Date().toISOString() }
  saveLocalData(data)
  return data.records[idx]
}

function deleteLocalRecord(id) {
  const data = getLocalData()
  data.records = data.records.filter(r => r.id !== id)
  saveLocalData(data)
}
