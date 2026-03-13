import { useState } from 'react'
import { 
  MessageCircle, Send, AlertTriangle, AlertCircle, 
  CheckCircle, Users, DollarSign, MessageSquare, 
  Shield, FileText, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

const demoMessages = [
  { id: 1, sender: 'other', text: 'Привет! Готовы начать проект по разработке сайта?', time: '10:05' },
  { id: 2, sender: 'me', text: 'Да, готов. Стоимость 150 000 ₽, срок 3 недели', time: '10:07' },
  { id: 3, sender: 'other', text: 'Отлично, договорились. Давай без договора, по-честному', time: '10:08', significant: true },
  { id: 4, sender: 'me', text: 'Хорошо, но предоплату 50% нужно', time: '10:10' },
  { id: 5, sender: 'other', text: 'Ок, перевожу. Только сделай еще логотип в подарок', time: '10:12', significant: true },
  { id: 6, sender: 'me', text: 'Договорились, логотип бонусом', time: '10:15' },
  { id: 7, sender: 'other', text: 'И еще нужно подключить оплату на сайте, это ведь входит?', time: '10:20', significant: true },
  { id: 8, sender: 'me', text: 'Это отдельно 20 000 ₽', time: '10:25' },
  { id: 9, sender: 'other', text: 'Но ты же сказал "полный сайт под ключ"', time: '10:26' },
  { id: 10, sender: 'me', text: 'Под ключ - это дизайн и верстка. Интеграции отдельно', time: '10:30' },
  { id: 11, sender: 'other', text: 'Давай так, ты делаешь оплату, а я тебе отличный отзыв напишу', time: '10:32' },
  { id: 12, sender: 'me', text: 'Ладно, только чтобы больше ничего не добавлялось', time: '10:35' },
]

const demoFindings = [
  {
    id: 1,
    type: 'risk',
    level: 'high',
    icon: AlertTriangle,
    title: 'Отсутствие письменного договора',
    description: '"Давай без договора, по-честному" — признание устной формы договора.',
    law: 'Ст. 161 ГК РФ: сделки на сумму > 10 000 ₽ должны быть письменными',
    messageIds: [3]
  },
  {
    id: 2,
    type: 'scope_change',
    level: 'medium',
    icon: Users,
    title: 'Изменение предмета договора (scope creep)',
    description: 'Добавление логотипа и интеграции оплаты выходит за рамки первоначальной договоренности (150 000 ₽ за сайт).',
    recommendation: 'Фиксировать объем работ в ТЗ до начала работ',
    messageIds: [5, 7]
  },
  {
    id: 3,
    type: 'payment',
    level: 'low',
    icon: DollarSign,
    title: 'Подтверждение предоплаты',
    description: 'Согласие на предоплату 50% зафиксировано. Если перевод подтвержден, это доказывает заключение договора.',
    recommendation: 'Сохранить подтверждения перевода',
    messageIds: [4, 5]
  },
  {
    id: 4,
    type: 'agreement',
    level: 'low',
    icon: MessageSquare,
    title: 'Устные договоренности о сроках',
    description: '"Срок 3 недели" — это существенное условие договора, зафиксированное в переписке.',
    messageIds: [2]
  }
]

const sources = [
  { id: 'telegram', name: 'Telegram', icon: MessageCircle, color: 'blue' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'green' },
  { id: 'email', name: 'Email', icon: FileText, color: 'slate' },
]

export default function Chat() {
  const [selectedSource, setSelectedSource] = useState(null)
  const [messages, setMessages] = useState([])
  const [findings, setFindings] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [highlightedMessage, setHighlightedMessage] = useState(null)

  const loadDemo = async () => {
    setIsAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setMessages(demoMessages)
    setFindings(demoFindings)
    setIsAnalyzing(false)
    toast.success('Демо-переписка загружена')
  }

  const handleSourceSelect = (sourceId) => {
    setSelectedSource(sourceId)
    toast.info(`Выбран источник: ${sources.find(s => s.id === sourceId)?.name}. Загрузите переписку.`)
  }

  const scrollToMessage = (messageId) => {
    setHighlightedMessage(messageId)
    setTimeout(() => setHighlightedMessage(null), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Анализ переписки</h1>
        <p className="text-slate-600">Загрузите переписку из мессенджеров. Найдем согласованные условия и изменения ТЗ.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8" style={{ height: 'calc(100vh - 250px)' }}>
        {/* Left Panel - Upload & Settings */}
        <div className="space-y-6 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Источник</h3>
            <div className="space-y-3">
              {sources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleSourceSelect(source.id)}
                  className={`w-full flex items-center p-3 border rounded-lg transition-all ${
                    selectedSource === source.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                  }`}
                >
                  <source.icon className={`w-5 h-5 mr-3 ${
                    selectedSource === source.id ? 'text-primary-600' : 'text-slate-400'
                  }`} />
                  <div className="text-left">
                    <div className="font-medium">{source.name}</div>
                    <div className="text-xs text-slate-500">Экспорт из чата</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={loadDemo}
                disabled={isAnalyzing}
                className="w-full py-2 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <MessageCircle className="w-4 h-4 mr-2" />
                )}
                Загрузить демо-переписку
              </button>
            </div>
          </div>

          <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
            <h4 className="font-semibold text-primary-700 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Что ищем:
            </h4>
            <ul className="text-sm text-slate-700 space-y-2">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                Устное согласование условий
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                Изменения ТЗ и сроков
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                Признание объема работ
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                Факт акцепта результата
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                Ссылки на оплату
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Chat & Analysis */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-6 h-full">
          {/* Chat View */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <span className="font-medium text-sm">Предпросмотр переписки</span>
              <span className="text-xs text-slate-500">{messages.length} сообщений</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 py-12">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>Загрузите переписку для анализа</p>
                  <p className="text-xs mt-1">Или нажмите "Загрузить демо-переписку"</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'me'
                        ? 'bg-primary-100 ml-auto rounded-br-sm'
                        : 'bg-white rounded-bl-sm shadow-sm'
                    } ${
                      highlightedMessage === msg.id ? 'ring-2 ring-warning-400 animate-pulse' : ''
                    } ${msg.significant ? 'border-l-4 border-warning-400' : ''}`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 text-right ${
                      msg.sender === 'me' ? 'text-primary-600' : 'text-slate-400'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <button className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">Юридически значимые моменты</h3>
            
            {findings.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <Shield className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Анализ не проведен</p>
                <p className="text-xs mt-1">Загрузите демо-переписку для примера</p>
              </div>
            ) : (
              <div className="space-y-3">
                {findings.map((finding) => (
                  <div
                    key={finding.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      finding.level === 'high' 
                        ? 'bg-danger-50 border-danger-500' 
                        : finding.level === 'medium'
                        ? 'bg-warning-50 border-warning-500'
                        : 'bg-primary-50 border-primary-500'
                    }`}
                  >
                    <div className="flex items-start">
                      <finding.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        finding.level === 'high' 
                          ? 'text-danger-500' 
                          : finding.level === 'medium'
                          ? 'text-warning-500'
                          : 'text-primary-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">{finding.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{finding.description}</p>
                        
                        {finding.law && (
                          <p className="text-xs text-slate-500 mt-2">{finding.law}</p>
                        )}
                        
                        {finding.recommendation && (
                          <div className="mt-2 p-2 bg-white/50 rounded text-sm text-slate-700">
                            <strong>Рекомендация:</strong> {finding.recommendation}
                          </div>
                        )}
                        
                        <div className="mt-2 flex gap-2">
                          {finding.messageIds.map((msgId) => (
                            <button
                              key={msgId}
                              onClick={() => scrollToMessage(msgId)}
                              className="text-xs px-2 py-1 bg-white border border-slate-200 rounded hover:border-primary-400 transition-colors"
                            >
                              Сообщение #{msgId}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Summary Recommendation */}
                <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-success-500 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-success-800">Общая рекомендация</h4>
                      <ul className="text-sm text-slate-700 mt-2 space-y-1">
                        <li>• Немедленно оформить письменный договор или акт сдачи-приемки</li>
                        <li>• Фиксировать объем работ в ТЗ до начала работ</li>
                        <li>• Не добавлять новые функции без дополнительного соглашения</li>
                        <li>• Сохранять подтверждения перевода предоплаты</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center max-w-4xl mx-auto">
          <strong>Примечание:</strong> Результаты анализа переписки носят исключительно ознакомительный характер 
          и не являются юридической консультацией. Выявленные факты не могут рассматриваться как 
          официальные доказательства без надлежащего нотариального заверения.
        </p>
      </div>
    </div>
  )
}
