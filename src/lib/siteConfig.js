import { DEFAULT_CONFIG } from './defaultConfig'

const STORAGE_KEY = 'site_config_v2'

// 从 localStorage 读取（优先，用于即时响应）
function getLocal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  return null
}

// 保存到 localStorage（立即生效）
function saveLocal(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
  } catch (e) {}
}

// 全局配置缓存，避免每次都请求
let cachedConfig = null
let fetchPromise = null

// 从服务器获取配置（首次异步加载）
async function fetchServerConfig() {
  try {
    const res = await fetch('/config.json', { cache: 'no-store' })
    if (res.ok) {
      const server = await res.json()
      return server
    }
  } catch (e) {}
  return null
}

// 合并配置：服务器配置 > 默认配置，然后 localStorage 覆盖
async function loadConfig() {
  if (cachedConfig) return cachedConfig
  if (fetchPromise) return fetchPromise

  fetchPromise = (async () => {
    const [serverCfg, localCfg] = await Promise.all([
      fetchServerConfig(),
      Promise.resolve(getLocal()),
    ])

    // 优先：localStorage（用户自定义）
    // 其次：服务器配置（持久化） > 默认
    let merged = { ...DEFAULT_CONFIG }
    if (serverCfg) merged = deepMerge(merged, serverCfg)
    if (localCfg) merged = deepMerge(merged, localCfg)

    cachedConfig = merged
    fetchPromise = null
    return merged
  })()

  return fetchPromise
}

// 同步获取（使用缓存，不等待网络）
export function getConfig() {
  if (cachedConfig) return cachedConfig
  // 先读取 localStorage
  const raw = getLocal()
  // 如果有旧的不完整缓存，清除它
  if (raw && (!raw.site || !raw.site.title)) {
    localStorage.removeItem(STORAGE_KEY)
    cachedConfig = { ...DEFAULT_CONFIG }
  } else if (raw && raw.site && raw.site.title) {
    // 完整的 localStorage 数据，和默认配置合并
    cachedConfig = deepMerge({ ...DEFAULT_CONFIG }, raw)
  } else {
    // 没有 localStorage，直接用默认
    cachedConfig = { ...DEFAULT_CONFIG }
  }
  return cachedConfig
}

// 保存配置：写入 localStorage + 服务器文件
export async function saveConfig(partial) {
  const current = getConfig()
  const updated = deepMerge(current, partial)
  cachedConfig = updated

  // 立即保存 localStorage
  saveLocal(updated)

  // 异步保存到服务器文件（不阻塞）
  try {
    await fetch('/api/saveConfig', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  } catch (e) {
    console.warn('Server config save failed:', e)
  }

  return updated
}

export function resetConfig() {
  cachedConfig = null
  localStorage.removeItem(STORAGE_KEY)
}

function deepMerge(target, source) {
  if (!source) return target
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      target[key] = deepMerge(target[key] || {}, source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}
