import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import DynamicBg from './components/DynamicBg'
import AIAssistant from './components/AIAssistant'
import HomeNew from './pages/HomeNew'
import Works from './pages/Works'
import Connect from './pages/Connect'
import Reading from './pages/Reading'
import Exercise from './pages/Exercise'
import AdminDashboardNew from './components/AdminDashboardNew'

// Legacy pages (kept for backward compatibility, accessible via direct URL)
import Journey from './pages/Journey'
import ContentOps from './pages/ContentOps'
import Hub from './pages/Hub'
import HubOps from './pages/HubOps'

export default function App() {
  const [theme, setTheme] = useState('light')
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('site_config_v2') || '{}')
      if (saved._theme) setTheme(saved._theme)
    } catch (e) {}
  }, [])

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
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onAdminClick={() => setShowAdmin(true)}
        />
        <Routes>
          <Route path="/" element={<HomeNew theme={theme} />} />
          <Route path="/works" element={<Works theme={theme} />} />
          <Route path="/connect" element={<Connect theme={theme} />} />
          <Route path="/reading" element={<Reading theme={theme} />} />
          <Route path="/exercise" element={<Exercise theme={theme} />} />
          {/* Legacy routes */}
          <Route path="/journey" element={<Journey theme={theme} />} />
          <Route path="/content-ops" element={<ContentOps theme={theme} />} />
          <Route path="/hub" element={<Hub theme={theme} />} />
          <Route path="/hub/ops" element={<HubOps theme={theme} />} />
        </Routes>
        {showAdmin && (
          <AdminDashboardNew
            onClose={() => setShowAdmin(false)}
          />
        )}
        
        {/* AI 数字分身助手 */}
        <AIAssistant theme={theme} />
      </div>
    </div>
  )
}
