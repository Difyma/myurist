import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Scale, Menu, X, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import LoginModal from './LoginModal'

const navLinks = [
  { path: '/analyzer', label: 'Анализ договоров' },
  { path: '/constructor', label: 'Конструктор' },
  { path: '/chat', label: 'Проверка переписки' },
  { path: '/risks', label: 'Оценка рисков' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleDemoLoginClick = () => {
    setLoginModalOpen(true)
  }

  const handleModalClose = () => {
    setLoginModalOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">LegalFlow</span>
              <span className="ml-2 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">2.0</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-600">{user?.email?.split('@')[0]}</span>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-700 to-primary-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user?.email?.[0]?.toUpperCase()}
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                    title="Выйти"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDemoLoginClick}
                    className="btn-primary text-sm"
                  >
                    Демо вход
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    handleDemoLoginClick()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50 rounded-lg"
                >
                  Демо вход
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={handleModalClose} 
      />
    </>
  )
}
