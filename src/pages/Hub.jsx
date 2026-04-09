import SelfMedia from '../components/SelfMedia'

export default function Hub({ lang, theme }) {
  const bg = theme === 'dark' ? '#111110' : '#FAF9F6'
  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <SelfMedia lang={lang} theme={theme} />
    </div>
  )
}
