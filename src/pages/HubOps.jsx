import Operations from '../components/Operations'

export default function HubOps({ lang, theme }) {
  const bg = theme === 'dark' ? '#111110' : '#FAF9F6'
  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <Operations theme={theme} />
    </div>
  )
}
