import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Mail, ArrowRight, Loader2, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function LoginModal({ isOpen, onClose }) {
  const [step, setStep] = useState('email') // 'email' | 'code'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { sendOTP, verifyOTP } = useAuthStore()
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!email || !email.includes('@')) {
      setError('Введите корректный email')
      return
    }

    setIsLoading(true)
    const result = await sendOTP(email)
    setIsLoading(false)

    if (result.success) {
      toast.success('Код отправлен на ваш email')
      setStep('code')
    } else {
      setError(result.error || 'Ошибка при отправке кода')
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!code || code.length !== 6) {
      setError('Введите 6-значный код')
      return
    }

    setIsLoading(true)
    const result = await verifyOTP(email, code)
    setIsLoading(false)

    if (result.success) {
      toast.success('Добро пожаловать!')
      setEmail('')
      setCode('')
      setStep('email')
      onClose()
      navigate('/analyzer')
    } else {
      setError(result.error || 'Неверный код подтверждения')
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleBack = () => {
    setStep('email')
    setCode('')
    setError('')
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {step === 'code' && (
                <button
                  onClick={handleBack}
                  className="mr-3 p-1 text-primary-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
              )}
              <div>
                <h2 className="text-xl font-bold text-white">
                  {step === 'email' ? 'Вход в систему' : 'Подтверждение'}
                </h2>
                <p className="text-primary-100 text-sm mt-1">
                  {step === 'email' 
                    ? 'Введите email для получения кода'
                    : `Код отправлен на ${email}`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-primary-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'email' ? (
            /* Email Step */
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email адрес
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-danger-600 flex items-center">
                    <span className="mr-1">•</span> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    Получить код
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Code Step */
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <p className="text-sm text-slate-600">
                  Введите код подтверждения, отправленный на ваш email
                </p>
              </div>

              <div>
                <label 
                  htmlFor="code" 
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Код подтверждения
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="0000000000"
                  maxLength={10}
                  className="block w-full px-4 py-3 text-center text-2xl tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  disabled={isLoading}
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-danger-600 flex items-center justify-center">
                    <span className="mr-1">•</span> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || code.length < 6}
                className="w-full flex items-center justify-center px-4 py-3 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Проверка...
                  </>
                ) : (
                  'Войти'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  disabled={isLoading}
                  className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
                >
                  Отправить код повторно
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              {step === 'email' 
                ? 'Демо-режим позволяет протестировать функционал без регистрации.'
                : 'Код действителен в течение 1 часа. Проверьте папку Спам.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
