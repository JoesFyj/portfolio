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
