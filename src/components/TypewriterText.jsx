import { useState, useEffect, useRef, useCallback } from 'react'

export default function TypewriterText({
  texts = [],
  fixedText = '我是',
  fixedColor = '#1C1C1E',
  typingColor = '#2D6A4F',
  typingSpeed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  className = '',
}) {
  const [cursorPos, setCursorPos] = useState(0)
  const [phase, setPhase] = useState('typing') // typing | pausing | deleting
  const [textIdx, setTextIdx] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const timerRef = useRef(null)

  const currentFullText = texts[textIdx] || ''

  // cursor blink
  useEffect(() => {
    const blink = setInterval(() => setShowCursor(p => !p), 530)
    return () => clearInterval(blink)
  }, [])

  // main typewriter tick
  const tick = useCallback(() => {
    if (!currentFullText) return
    switch (phase) {
      case 'typing': {
        if (cursorPos < currentFullText.length) {
          setCursorPos(p => p + 1)
        } else {
          setPhase('pausing')
        }
        break
      }
      case 'pausing': {
        setPhase('deleting')
        break
      }
      case 'deleting': {
        if (cursorPos > 0) {
          setCursorPos(p => p - 1)
        } else {
          setPhase('typing')
          setTextIdx(i => (i + 1) % texts.length)
        }
        break
      }
    }
  }, [phase, cursorPos, currentFullText, texts.length])

  useEffect(() => {
    if (!currentFullText) return
    const delay = phase === 'typing' ? typingSpeed
      : phase === 'pausing' ? pauseTime
      : deleteSpeed
    timerRef.current = setTimeout(tick, delay)
    return () => clearTimeout(timerRef.current)
  }, [tick, phase, typingSpeed, pauseTime, deleteSpeed, currentFullText])

  // reset cursor when text changes
  useEffect(() => {
    setCursorPos(0)
    setPhase('typing')
  }, [textIdx])

  if (!texts.length) return null

  const typedText = currentFullText.slice(0, cursorPos)

  return (
    <span className={`typewriter inline-flex items-baseline ${className}`}>
      <span style={{ color: fixedColor }}>{fixedText}</span>
      <span style={{ color: typingColor }}>{typedText}</span>
      <span style={{
        color: typingColor,
        opacity: showCursor ? 1 : 0,
        transition: 'opacity 0.1s',
        fontWeight: 200,
        marginLeft: '0.05em',
      }}>|</span>
    </span>
  )
}
