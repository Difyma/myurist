import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Home from './pages/Home'
import Analyzer from './pages/Analyzer'
import Constructor from './pages/Constructor'
import Chat from './pages/Chat'
import Risks from './pages/Risks'
import PrivacyPolicy from './pages/PrivacyPolicy'

function App() {
  const { initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="analyzer" element={<Analyzer />} />
        <Route path="constructor" element={<Constructor />} />
        <Route path="chat" element={<Chat />} />
        <Route path="risks" element={<Risks />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
