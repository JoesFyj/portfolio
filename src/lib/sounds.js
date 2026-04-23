/**
 * 音效模块 - 使用 Web Audio API 程序化生成
 */

let audioCtx = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function play({ type, freq = 440, duration = 0.15, volume = 0.15, delay = 0 }) {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(volume, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
    osc.start(t)
    osc.stop(t + duration + 0.05)
  } catch (e) {}
}

// 主标题打字机逐字音效：慢速打字"哒"
export function playTypeChar() {
  play({ type: 'square', freq: 600, duration: 0.08, volume: 0.1 })
}

// 副标题滑入音效：柔和"嗖"
export function playSubtitleSound() {
  play({ type: 'triangle', freq: 660, duration: 0.3, volume: 0.12 })
}

// 图形出现：科技"嗖"
export function playGraphicSound() {
  const ctx = getCtx()
  try {
    const bufferSize = ctx.sampleRate * 0.3
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.3
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(2000, ctx.currentTime)
    filter.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3)
    filter.Q.value = 1
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  } catch (e) {}
}

// 标签逐个出现：清脆"叮"
export function playLabelSound() {
  play({ type: 'sine', freq: 880, duration: 0.15, volume: 0.14 })
  play({ type: 'sine', freq: 1320, duration: 0.12, volume: 0.09, delay: 0.05 })
}

// 短描述紧跟标签出现：叮
export function playShortSound() {
  play({ type: 'sine', freq: 1046, duration: 0.18, volume: 0.12 })
}

// 完整描述梆梆出现：低音"梆"
export function playDescSound() {
  play({ type: 'sine', freq: 200, duration: 0.2, volume: 0.18 })
  play({ type: 'sine', freq: 300, duration: 0.15, volume: 0.1, delay: 0.04 })
}

// 全部完成：成功"啦啦啦"
export function playCompleteSound() {
  play({ type: 'sine', freq: 523, duration: 0.2, volume: 0.15 })
  play({ type: 'sine', freq: 659, duration: 0.2, volume: 0.15, delay: 0.15 })
  play({ type: 'sine', freq: 784, duration: 0.2, volume: 0.15, delay: 0.3 })
  play({ type: 'sine', freq: 1046, duration: 0.35, volume: 0.18, delay: 0.45 })
}

// 最终收尾哗哗消失：噪声消散音效
export function playWhooshSound() {
  const ctx = getCtx()
  try {
    const bufferSize = ctx.sampleRate * 0.5
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.4
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(800, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  } catch (e) {}
}

// ============================================================
// 赛博水墨音效
// ============================================================

// 水墨晕染 - 低沉嗡鸣 + 水墨晕染
export function playInkSplash() {
  const ctx = getCtx()
  try {
    // 低频嗡鸣
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(80, ctx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.8)
    gain1.gain.setValueAtTime(0, ctx.currentTime)
    gain1.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.85)

    // 水墨扩散噪声
    const bufferSize = ctx.sampleRate * 0.6
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.15
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(400, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.6)
    const gain2 = ctx.createGain()
    gain2.gain.setValueAtTime(0.2, ctx.currentTime)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    source.connect(filter)
    filter.connect(gain2)
    gain2.connect(ctx.destination)
    source.start(ctx.currentTime)
  } catch (e) {}
}

// 毛笔落纸 - 沙沙声
export function playBrushStroke() {
  const ctx = getCtx()
  try {
    const bufferSize = ctx.sampleRate * 0.25
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.25
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(800, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25)
    filter.Q.value = 0.8
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.18, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start(ctx.currentTime)
  } catch (e) {}
}

// 霓虹电子脉冲
export function playNeonPulse() {
  const ctx = getCtx()
  try {
    // 电子脉冲序列
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(200 + i * 150, ctx.currentTime + i * 0.08)
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08)
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.08 + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.1)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.08)
      osc.stop(ctx.currentTime + i * 0.08 + 0.15)
    }

    // 高频泛音
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sawtooth'
    osc2.frequency.setValueAtTime(1200, ctx.currentTime)
    osc2.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.4)
    gain2.gain.setValueAtTime(0, ctx.currentTime)
    gain2.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(ctx.currentTime)
    osc2.stop(ctx.currentTime + 0.45)
  } catch (e) {}
}

// 全息扫描
export function playHologramScan() {
  const ctx = getCtx()
  try {
    const bufferSize = ctx.sampleRate * 0.8
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i / bufferSize * Math.PI) * 0.2
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(2000, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(8000, ctx.currentTime + 0.3)
    filter.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.8)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start(ctx.currentTime)
  } catch (e) {}
}

// ============================================================
// 禅意极简音效
// ============================================================

// 极轻水滴叮
export function playZenDrop() {
  const ctx = getCtx()
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.45)

    // 泛音
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(2400, ctx.currentTime + 0.02)
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.02)
    gain2.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.03)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(ctx.currentTime + 0.02)
    osc2.stop(ctx.currentTime + 0.35)
  } catch (e) {}
}

// 毛笔极轻落纸
export function playZenBrush() {
  const ctx = getCtx()
  try {
    const bufferSize = ctx.sampleRate * 0.15
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(300, ctx.currentTime)
    filter.Q.value = 0.5
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start(ctx.currentTime)
  } catch (e) {}
}

// 极低频呼吸脉冲
export function playZenBreath() {
  const ctx = getCtx()
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    // 缓慢的呼吸频率
    osc.frequency.setValueAtTime(60, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 1.5)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.1, ctx.currentTime + 1.2)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 1.6)
  } catch (e) {}
}

// 涟漪扩散消散
export function playZenRipple() {
  const ctx = getCtx()
  try {
    // 多个同心涟漪扩散
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      const startFreq = 800 - i * 200
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime + i * 0.15)
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + i * 0.15 + 0.8)
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15)
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.15 + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.8)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.15)
      osc.stop(ctx.currentTime + i * 0.15 + 0.85)
    }
  } catch (e) {}
}
