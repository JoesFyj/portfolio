import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Hub from './pages/Hub'
import HubOps from './pages/HubOps'
import AdminDashboard from './components/AdminDashboard'

export default function App() {
  const [lang, setLang] = useState('zh')
  const [theme, setTheme] = useState('light')
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('site_config_v2') || '{}')
      if (saved._lang) setLang(saved._lang)
      if (saved._theme) setTheme(saved._theme)
    } catch (e) {}
  }, [])

  function handleLangToggle() {
    const next = lang === 'zh' ? 'en' : 'zh'
    setLang(next)
    try {
      const saved = JSON.parse(localStorage.getItem('site_config_v2') || '{}')
      saved._lang = next
      localStorage.setItem('site_config_v2', JSON.stringify(saved))
    } catch (e) {}
  }

  function handleThemeToggle() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try {
      const saved = JSON.parse(localStorage.getItem('site_config_v2') || '{}')
      saved._theme = next
      localStorage.setItem('site_config_v2', JSON.stringify(saved))
    } catch (e) {}
  }

  const bg = theme === 'dark' ? '#111110' : '#FAF9F6'

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <Nav
        lang={lang}
        theme={theme}
        onLangToggle={handleLangToggle}
        onThemeToggle={handleThemeToggle}
        onAdminClick={() => setShowAdmin(true)}
      />
      <Routes>
        <Route path="/" element={<Home lang={lang} theme={theme} />} />
        <Route path="/hub" element={<Hub lang={lang} theme={theme} />} />
        <Route path="/hub/ops" element={<HubOps lang={lang} theme={theme} />} />
      </Routes>
      {showAdmin && (
        <AdminDashboard
          lang={lang}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  )
}
