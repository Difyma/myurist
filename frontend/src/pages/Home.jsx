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
                  AI + эксперты
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                  Ссылки на ГК РФ
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                  Шифрование данных
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
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-6">
              Наши возможности
            </span>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Все инструменты для защиты бизнеса</h2>
            <p className="text-xl text-slate-600">От проверки договора до подготовки иска. Полный цикл правовой защиты.</p>
          </div>
          
          {/* Feature 1: Анализ договоров */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Анализ договоров</h3>
              <p className="text-lg text-slate-600 mb-6">
                Загрузите PDF или Word. AI найдет риски, перекосы и опасные формулировки. 
                Проверка на соответствие ГК РФ.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  Проверка 8 типов рисков
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  Цветовая разметка опасных пунктов
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  Ссылки на статьи ГК РФ
                </li>
              </ul>
              <button 
                onClick={() => navigate('/analyzer')}
                className="btn-primary flex items-center"
              >
                Проверить договор
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-slate-800">Результат анализа</span>
                  <span className="px-3 py-1 rounded-full bg-danger-100 text-danger-700 text-sm font-medium">
                    3 критических риска
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="bg-danger-50 border-l-4 border-danger-500 p-4 rounded-r-lg">
                    <p className="text-sm font-medium text-danger-800 mb-1">Одностороннее изменение ТЗ</p>
                    <p className="text-xs text-slate-600">Пункт 4.2 • Ст. 310 ГК РФ</p>
                  </div>
                  <div className="bg-danger-50 border-l-4 border-danger-500 p-4 rounded-r-lg">
                    <p className="text-sm font-medium text-danger-800 mb-1">Неограниченная ответственность</p>
                    <p className="text-xs text-slate-600">Пункт 8.1 • Ст. 393 ГК РФ</p>
                  </div>
                  <div className="bg-warning-50 border-l-4 border-warning-500 p-4 rounded-r-lg">
                    <p className="text-sm font-medium text-warning-800 mb-1">Несоразмерная неустойка</p>
                    <p className="text-xs text-slate-600">Пункт 6.1 • Ст. 333 ГК РФ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Конструктор */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-slate-800">Новый договор</span>
                  <span className="text-xs text-slate-500">Шаг 3 из 6</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Ваша роль</label>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 px-4 bg-primary-50 border-2 border-primary-500 text-primary-700 rounded-lg text-sm font-medium">
                        Исполнитель
                      </button>
                      <button className="flex-1 py-2 px-4 border border-slate-300 text-slate-600 rounded-lg text-sm">
                        Заказчик
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Размер предоплаты</label>
                    <div className="flex items-center gap-4">
                      <input type="range" className="flex-1" defaultValue="50" />
                      <span className="text-sm font-medium text-slate-700 w-12">50%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <CheckCircle className="w-4 h-4 text-success-500" />
                    <span className="text-sm text-slate-600">Автоматический расчет неустойки</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-2xl mb-6">
                <FileSignature className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Конструктор договоров</h3>
              <p className="text-lg text-slate-600 mb-6">
                Ответьте на 6 простых вопросов. Получите сбалансированный договор 
                с учетом вашей роли — исполнитель или заказчик.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  6 шагов визарда
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  Шаблоны для разных типов работ
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  Баланс интересов обеих сторон
                </li>
              </ul>
              <button 
                onClick={() => navigate('/constructor')}
                className="btn-secondary flex items-center"
              >
                Создать договор
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          {/* Feature 3: Проверка переписки */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-warning-100 rounded-2xl mb-6">
                <MessagesSquare className="w-8 h-8 text-warning-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Анализ переписки</h3>
              <p className="text-lg text-slate-600 mb-6">
                Проверьте Telegram, WhatsApp, Email. Найдите юридически значимые моменты, 
                согласованные условия и изменения ТЗ.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  Импорт из мессенджеров
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  Выявление изменения объема работ
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  Доказательства для суда
                </li>
              </ul>
              <button 
                onClick={() => navigate('/chat')}
                className="btn-primary flex items-center"
              >
                Проверить переписку
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full" />
                  <div>
                    <p className="font-medium text-slate-800">Заказчик</p>
                    <p className="text-xs text-slate-500">Telegram • 10:42</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-100 p-3 rounded-lg rounded-tl-none max-w-[85%]">
                    <p className="text-sm text-slate-700">Можете еще и логотип сделать? Это ведь входит в работу?</p>
                  </div>
                  <div className="bg-primary-50 p-3 rounded-lg rounded-tr-none ml-auto max-w-[85%]">
                    <p className="text-sm text-slate-700">Договорились, логотип бонусом</p>
                  </div>
                  <div className="bg-warning-50 border border-warning-200 p-3 rounded-lg">
                    <p className="text-xs font-medium text-warning-800 mb-1">⚠️ Юридически значимый момент</p>
                    <p className="text-xs text-warning-700">Дополнительная работа без уточнения стоимости</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Оценка рисков */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-4">Калькулятор финансовых рисков</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Сумма договора</label>
                    <p className="text-xl font-bold text-slate-900">150 000 ₽</p>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Неустойка за день</label>
                    <p className="text-xl font-bold text-danger-600">1% (1 500 ₽)</p>
                  </div>
                  <div className="bg-danger-50 p-4 rounded-lg border border-danger-200">
                    <p className="text-sm font-medium text-danger-800 mb-1">⚠️ Высокий риск!</p>
                    <p className="text-xs text-danger-700">365% годовых. Суд снизит по ст. 333 ГК РФ.</p>
                    <p className="text-xs text-slate-600 mt-2">Рекомендуем: 0.1% (150 ₽/день)</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-danger-100 rounded-2xl mb-6">
                <Calculator className="w-8 h-8 text-danger-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Оценка финансовых рисков</h3>
              <p className="text-lg text-slate-600 mb-6">
                Рассчитайте максимальную ответственность. Проверьте неустойку на 
                соразмерность по ст. 333 ГК РФ.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  Расчет максимальной ответственности
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  Проверка соразмерности неустойки
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  Анализ годовой ставки
                </li>
              </ul>
              <button 
                onClick={() => navigate('/risks')}
                className="btn-primary flex items-center"
              >
                Рассчитать риски
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
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
                    <strong className="block mb-1">Безопасное хранение</strong>
                    <span className="text-slate-400 text-sm">Данные хранятся в защищенных дата-центрах</span>
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
              </ul>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="border-t border-slate-800 pt-6 pb-4">
            <p className="text-xs text-slate-500 text-center max-w-4xl mx-auto">
              <strong>Юридическая оговорка:</strong> Сервис LegalFlow предоставляет информацию 
              исключительно в ознакомительных целях и не является юридической консультацией. 
              Результаты анализа не могут рассматриваться как официальные рекомендации или 
              руководство к действию. Перед принятием юридически значимых решений рекомендуется 
              обратиться к квалифицированному юристу. Мы не несем ответственности за последствия 
              использования информации, полученной через сервис.
            </p>
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
