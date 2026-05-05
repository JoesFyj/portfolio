import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import DynamicBg from './components/DynamicBg'
import HomeNew from './pages/HomeNew'
import Works from './pages/Works'
import Journey from './pages/Journey'
import PageGenerator from './pages/PageGenerator'
import VideoGenPage from './pages/VideoGenPage'
import AdminDashboardNew from './components/AdminDashboardNew'

// Legacy pages (kept for backward compatibility, accessible via direct URL)
import Hub from './pages/Hub'
import HubOps from './pages/HubOps'

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

  const bg = theme === 'dark' ? '#0D1117' : '#FAF9F6'

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <DynamicBg theme={theme} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav
          lang={lang}
          theme={theme}
          onLangToggle={handleLangToggle}
          onThemeToggle={handleThemeToggle}
          onAdminClick={() => setShowAdmin(true)}
        />
        <Routes>
          <Route path="/" element={<HomeNew lang={lang} theme={theme} />} />
          <Route path="/works" element={<Works lang={lang} theme={theme} />} />
          <Route path="/journey" element={<Journey lang={lang} theme={theme} />} />
          {/* Tools - keep existing */}
          <Route path="/gen" element={<PageGenerator />} />
          <Route path="/vgen" element={<VideoGenPage />} />
          {/* Legacy routes */}
          <Route path="/hub" element={<Hub lang={lang} theme={theme} />} />
          <Route path="/hub/ops" element={<HubOps lang={lang} theme={theme} />} />
        </Routes>
        {showAdmin && (
          <AdminDashboardNew
            onClose={() => setShowAdmin(false)}
          />
        )}
      </div>
    </div>
  )
}
