import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Shield, FileSignature, MessagesSquare, Calculator, 
  CheckCircle, Lock, Server, UserCheck, ArrowRight, 
  PlayCircle, Scale
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import LoginModal from '../components/LoginModal'

const features = [
  {
    icon: Shield,
    title: 'Анализ договоров',
    description: 'Загрузите PDF или Word. Система найдет риски, перекосы и опасные формулировки.',
    color: 'blue',
    path: '/analyzer'
  },
  {
    icon: FileSignature,
    title: 'Конструктор',
    description: 'Ответьте на вопросы. Получите сбалансированный договор с учетом вашей роли.',
    color: 'green',
    path: '/constructor'
  },
  {
    icon: MessagesSquare,
    title: 'Анализ переписки',
    description: 'Проверьте Telegram и Email. Найдите согласованные условия и изменения ТЗ.',
    color: 'amber',
    path: '/chat'
  },
  {
    icon: Calculator,
    title: 'Финансовые риски',
    description: 'Рассчитайте максимальную ответственность и проверьте неустойку на соразмерность.',
    color: 'red',
    path: '/risks'
  }
]

const steps = [
  {
    number: '1',
    title: 'Загрузите документ',
    description: 'PDF, Word или скриншоты переписки. Поддерживаем все популярные форматы.'
  },
  {
    number: '2',
    title: 'AI проводит анализ',
    description: 'Нейросеть проверяет риски по 8 категориям: ответственность, сроки, неустойка, ИП и др.'
  },
  {
    number: '3',
    title: 'Получите решение',
    description: 'Цветовая разметка, ссылки на законы и готовые формулировки для исправления.'
  }
]

const pricing = [
  {
    name: 'Разовый аудит',
    price: '3 990 ₽',
    description: 'Один договор полный анализ',
    features: ['Анализ 1 договора', 'Проверка на 8 рисков', 'Рекомендации по правкам'],
    cta: 'Выбрать',
    popular: false
  },
  {
    name: 'Professional',
    price: '2 990 ₽',
    period: '/мес',
    description: 'Для фрилансера',
    features: ['Проверка 3 договоров', 'Генерация 2 договоров', 'Анализ переписки', 'Оценка финрисков'],
    cta: 'Подключить',
    popular: true
  },
  {
    name: 'Business',
    price: '9 990 ₽',
    period: '/мес',
    description: 'Для компаний и агентств',
    features: ['Неограниченная проверка', '5 пользователей', 'API интеграция', 'Приоритетная поддержка'],
    cta: 'Подключить',
    popular: false
  }
]

export default function Home() {
  const navigate = useNavigate()
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const handleDemo = () => {
    setLoginModalOpen(true)
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-slate-50 opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-sm mb-6 border border-primary-100">
                <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2 animate-pulse" />
                Новое: Анализ переписки из Telegram
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Юридическая защита{' '}
                <span className="gradient-text">за 3 минуты</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed">
                Проверьте договор до подписания. Найдите риски, которые могут стоить вам 500 000 ₽ в суде.
                AI-анализ + нормы права РФ.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/analyzer')}
                  className="btn-primary text-lg flex items-center justify-center"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Проверить договор
                </button>
                <button 
                  onClick={() => navigate('/constructor')}
                  className="btn-secondary text-lg flex items-center justify-center"
                >
                  <FileSignature className="w-5 h-5 mr-2" />
                  Составить договор
                </button>
              </div>
              
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                  152-ФЗ compliant
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                  Данные в РФ
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                  Шифрование
                </div>
              </div>
            </div>

            {/* Right Column - Demo Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-700 rounded-3xl blur-3xl opacity-20 transform rotate-3" />
              
              <div className="relative glass-panel rounded-2xl p-6 lg:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800">Пример анализа риска</h3>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-danger-100 text-danger-700 border border-danger-200">
                    Высокий риск
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-danger-50 border-l-4 border-danger-500 p-4 rounded-r-lg">
                    <p className="text-sm text-slate-700 font-medium mb-1">
                      «Заказчик вправе в одностороннем порядке изменить объем работ»
                    </p>
                    <p className="text-xs text-slate-500">Пункт 4.2 договора подряда</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start text-sm">
                      <Shield className="w-4 h-4 text-danger-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-slate-700">Риск одностороннего изменения обязательства</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <div className="w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        <span className="text-primary-700 text-xs font-bold">§</span>
                      </div>
                      <span className="text-slate-600 text-xs">Ст. 310 ГК РФ — изменение договора возможно только по соглашению сторон</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-800 mb-2">Рекомендация:</p>
                    <p className="text-sm text-slate-600">
                      Добавить: «Изменения возможны только при согласовании стороной дополнительного соглашения»
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Все инструменты для защиты бизнеса</h2>
            <p className="text-lg text-slate-600">От проверки договора до подготовки иска. Полный цикл правовой защиты.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.path}
                onClick={() => navigate(feature.path)}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 card-hover cursor-pointer group"
              >
                <div className={`w-12 h-12 ${
                  feature.color === 'blue' ? 'bg-primary-100 text-primary-600' :
                  feature.color === 'green' ? 'bg-success-100 text-success-600' :
                  feature.color === 'amber' ? 'bg-warning-100 text-warning-600' :
                  'bg-danger-100 text-danger-600'
                } rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Как это работает</h2>
              <div className="space-y-8">
                {steps.map((step) => (
                  <div key={step.number} className="flex">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                      <p className="text-slate-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Почему это безопасно</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Lock className="w-5 h-5 text-success-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <strong className="block mb-1">Шифрование</strong>
                    <span className="text-slate-400 text-sm">Все документы шифруются по стандарту AES-256</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Server className="w-5 h-5 text-success-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <strong className="block mb-1">Серверы в РФ</strong>
                    <span className="text-slate-400 text-sm">Данные хранятся в дата-центрах Yandex Cloud (152-ФЗ)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <UserCheck className="w-5 h-5 text-success-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <strong className="block mb-1">Нет утечек</strong>
                    <span className="text-slate-400 text-sm">Автоматическое удаление через 30 дней</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Тарифы</h2>
            <p className="text-lg text-slate-600">Выберите подходящий план. Всегда можно начать с разового аудита.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-8 border-2 ${
                  plan.popular ? 'border-primary-500 shadow-xl' : 'border-slate-200'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Для фрилансера
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  {plan.period && <span className="text-slate-500 ml-1">{plan.period}</span>}
                </div>
                <p className="text-sm text-slate-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={handleDemo}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-primary-700 hover:bg-primary-800 text-white'
                      : 'border-2 border-primary-700 text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Начните защищать свой бизнес сегодня
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Попробуйте демо-версию без регистрации. Проверьте договор прямо сейчас.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDemo}
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Попробовать демо
            </button>
            <button
              onClick={() => navigate('/analyzer')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Проверить договор
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center mr-3">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">LegalFlow</span>
              </div>
              <p className="text-sm">Цифровой юрист для бизнеса. Проверка договоров, оценка рисков, защита интересов.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Инструменты</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/analyzer')} className="hover:text-white transition">Анализ договоров</button></li>
                <li><button onClick={() => navigate('/constructor')} className="hover:text-white transition">Конструктор</button></li>
                <li><button onClick={() => navigate('/chat')} className="hover:text-white transition">Анализ переписки</button></li>
                <li><button onClick={() => navigate('/risks')} className="hover:text-white transition">Калькулятор рисков</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Компания</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">О нас</a></li>
                <li><a href="#" className="hover:text-white transition">Блог</a></li>
                <li><a href="#" className="hover:text-white transition">Карьера</a></li>
                <li><a href="#" className="hover:text-white transition">Контакты</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Помощь</a></li>
                <li><a href="#" className="hover:text-white transition">API документация</a></li>
                <li><a href="#" className="hover:text-white transition">Политика конфиденциальности</a></li>
                <li><a href="#" className="hover:text-white transition">152-ФЗ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            <p>&copy; 2024 LegalFlow 2.0. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </div>
  )
}
