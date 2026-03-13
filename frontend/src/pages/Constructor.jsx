import { useState } from 'react'
import { 
  Code, Megaphone, Cloud, User, Briefcase, 
  ChevronLeft, ChevronRight, FileDown, Check, 
  Hammer, Coins, Loader2, Copy
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const contractTypes = [
  { id: 'dev', icon: Code, label: 'Разработка сайта/ПО', desc: 'Веб-разработка, мобильные приложения, интеграции' },
  { id: 'marketing', icon: Megaphone, label: 'Маркетинговые услуги', desc: 'SMM, SEO, контекстная реклама, PR' },
  { id: 'saas', icon: Cloud, label: 'SaaS / Подписка', desc: 'Доступ к сервису, лицензии, облачные решения' },
  { id: 'freelance', icon: User, label: 'Фриланс / Аутсорс', desc: 'Дизайн, копирайтинг, консалтинг, переводы' },
  { id: 'consulting', icon: Briefcase, label: 'Консалтинг', desc: 'Бизнес-консультации, аудит, стратегия' },
]

const steps = [
  { id: 1, title: 'Тип договора' },
  { id: 2, title: 'Ваша роль' },
  { id: 3, title: 'Условия оплаты' },
  { id: 4, title: 'Интеллектуальные права' },
  { id: 5, title: 'Ответственность' },
  { id: 6, title: 'Дополнительно' },
]

const ipOptions = [
  { value: 'exclusive', label: 'Исключительные права', desc: 'Заказчик становится полноправным владельцем' },
  { value: 'license', label: 'Лицензия', desc: 'Право использования, автор остается владельцем' },
  { value: 'work_for_hire', label: 'Служебное произведение', desc: 'Для трудовых договоров и аутсорса персонала' },
]

export default function Constructor() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContract, setGeneratedContract] = useState(null)
  const [formData, setFormData] = useState({
    template: '',
    userRole: '',
    prepayment: 50,
    hasStages: true,
    totalSum: '',
    ipRights: 'exclusive',
    penaltyRate: 0.5,
    limitLiability: true,
    ndaClause: false,
    nonCompete: false,
    forceMajeure: true,
    arbitration: false,
    contractTerm: '',
  })

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1)
  }

  const generateContract = async () => {
    setIsGenerating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const typeNames = {
      dev: 'разработки программного обеспечения',
      marketing: 'оказания маркетинговых услуг',
      saas: 'предоставления доступа к SaaS',
      freelance: 'выполнения работ по заданию',
      consulting: 'оказания консалтинговых услуг'
    }

    const sum = Number(formData.totalSum) || 100000
    const sumFormatted = sum.toLocaleString('ru-RU')
    const prepaymentAmount = Math.round(sum * formData.prepayment / 100).toLocaleString('ru-RU')

    const content = `ДОГОВОР ПОДРЯДА № ___
на ${typeNames[formData.template] || 'оказание услуг'}

г. Москва                                    «___» __________ 2024 г.

${formData.userRole === 'executor' ? 
`ООО «Заказчик», в лице директора Иванова И.И., действующего на основании Устава, именуемое в дальнейшем «Заказчик», с одной стороны,` : 
`Иванов Иван Иванович, паспорт серия ____ № ______, выдан ______________, именуемый в дальнейшем «Исполнитель», с одной стороны,`} 

и 

${formData.userRole === 'executor' ? 
`Иванов Иван Иванович, паспорт серия ____ № ______, выдан ______________, именуемый в дальнейшем «Исполнитель», с другой стороны,` :
`ООО «Исполнитель», в лице директора Петрова П.П., действующего на основании Устава, именуемое в дальнейшем «Исполнитель», с другой стороны,`}

совместно именуемые «Стороны», заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА

1.1. Исполнитель обязуется выполнить работы по ${typeNames[formData.template] || 'оказанию услуг'} в соответствии с Техническим заданием (Приложение №1), а Заказчик обязуется принять и оплатить результат работ.

1.2. Детальное описание работ, требования к результату и порядок приемки содержатся в Техническом задании, являющемся неотъемлемой частью настоящего договора.

2. СТОИМОСТЬ И ПОРЯДОК РАСЧЕТОВ

2.1. Общая стоимость работ составляет ${sumFormatted} (${numberToWords(sum)}) рублей НДС не облагается (ст. 346.11 НК РФ).

${formData.prepayment > 0 ? `2.2. Предоплата в размере ${formData.prepayment}% (${prepaymentAmount} руб.) от общей стоимости работ уплачивается Заказчиком в течение 3 (трех) банковских дней с момента подписания настоящего договора.` : ''}

2.${formData.prepayment > 0 ? '3' : '2'}. ${formData.hasStages ? 'Оплата производится поэтапно в соответствии с графиком (Приложение №2).' : 'Окончательный расчет производится в течение 5 (пяти) банковских дней после подписания акта сдачи-приемки.'}

2.${formData.prepayment > 0 ? '4' : '3'}. При просрочке оплаты Заказчик уплачивает неустойку в размере 0,1% от суммы задолженности за каждый день просрочки.

3. ИНТЕЛЛЕКТУАЛЬНЫЕ ПРАВА

${getIPClause(formData.ipRights)}

4. СРОКИ ВЫПОЛНЕНИЯ

4.1. Исполнитель приступает к работе в течение 3 (трех) рабочих дней с момента получения предоплаты.

4.2. Общий срок выполнения работ — до «___» __________ 2024 г.

4.3. Заказчик обязуется рассмотреть результат работ в течение 5 (пяти) рабочих дней с момента получения. По истечении указанного срока работа считается принятой, если не заявлены мотивированные возражения.

5. ОТВЕТСТВЕННОСТЬ СТОРОН

5.1. За нарушение сроков выполнения работ Исполнитель уплачивает неустойку в размере ${formData.penaltyRate}% от цены просроченных работ за каждый день просрочки, но не более 10% от общей цены договора.
${formData.limitLiability ? `\n5.2. Ограничение ответственности: Ответственность Исполнителя по настоящему договору ограничена размером оплаты по договору. Исполнитель не несет ответственности за упущенную выгоду и косвенные убытки.` : ''}

${formData.ndaClause ? `\n6. КОНФИДЕНЦИАЛЬНОСТЬ (NDA)\n\n6.1. Стороны обязуются сохранять конфиденциальность информации, полученной в ходе исполнения договора.\n6.2. Обязательства по конфиденциальности действуют в течение 3 лет с момента окончания договора.\n` : ''}

${formData.forceMajeure ? `\n${(formData.ndaClause ? 1 : 0) + 6}. ФОРС-МАЖОР\n\n${(formData.ndaClause ? 1 : 0) + 6}.1. Стороны освобождаются от ответственности за неисполнение обязательств при возникновении обстоятельств непреодолимой силы.\n` : ''}

${(formData.ndaClause ? 1 : 0) + (formData.forceMajeure ? 1 : 0) + 6}. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ

${(formData.ndaClause ? 1 : 0) + (formData.forceMajeure ? 1 : 0) + 6}.1. Изменения и дополнения к настоящему договору действительны только если совершены в письменной форме и подписаны обеими сторонами.

${(formData.ndaClause ? 1 : 0) + (formData.forceMajeure ? 1 : 0) + 6}.2. Настоящий договор составлен в двух экземплярах, имеющих одинаковую юридическую силу.

${formData.contractTerm ? `${(formData.ndaClause ? 1 : 0) + (formData.forceMajeure ? 1 : 0) + 6}.3. Настоящий договор вступает в силу с момента подписания и действует ${formData.contractTerm}.` : ''}

7. АДРЕСА И РЕКВИЗИТЫ СТОРОН

ЗАКАЗЧИК:                                      ИСПОЛНИТЕЛЬ:
_________________________________             _________________________________
(подпись)                                     (подпись)

Дата: _______________                         Дата: _______________
`

    setGeneratedContract(content)
    setIsGenerating(false)
    toast.success('Договор успешно создан')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContract)
    toast.success('Скопировано в буфер обмена')
  }

  const progress = (currentStep / 6) * 100

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Конструктор договоров</h1>
        <p className="text-slate-600">Ответьте на вопросы — получите сбалансированный договор с защитой ваших интересов</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Progress */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Шаг {currentStep} из {steps.length}
            </span>
            <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 min-h-[400px]">
          {/* Step 1: Contract Type */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Выберите тип договора</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {contractTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => updateForm('template', type.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.template === type.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <type.icon className={`w-5 h-5 mr-3 ${
                        formData.template === type.id ? 'text-primary-600' : 'text-slate-400'
                      }`} />
                      <span className="font-bold">{type.label}</span>
                    </div>
                    <p className="text-sm text-slate-600">{type.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Role */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Кто вы по договору?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div
                  onClick={() => updateForm('userRole', 'executor')}
                  className={`border-2 rounded-xl p-6 cursor-pointer text-center transition-all ${
                    formData.userRole === 'executor'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                  }`}
                >
                  <Hammer className={`w-12 h-12 mx-auto mb-4 ${
                    formData.userRole === 'executor' ? 'text-primary-600' : 'text-slate-400'
                  }`} />
                  <h4 className="font-bold text-lg mb-2">Исполнитель</h4>
                  <p className="text-sm text-slate-600">Выполняете работу. Договор защитит вашу оплату и права.</p>
                </div>
                <div
                  onClick={() => updateForm('userRole', 'customer')}
                  className={`border-2 rounded-xl p-6 cursor-pointer text-center transition-all ${
                    formData.userRole === 'customer'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                  }`}
                >
                  <Coins className={`w-12 h-12 mx-auto mb-4 ${
                    formData.userRole === 'customer' ? 'text-primary-600' : 'text-slate-400'
                  }`} />
                  <h4 className="font-bold text-lg mb-2">Заказчик</h4>
                  <p className="text-sm text-slate-600">Оплачиваете работу. Договор защитит от некачественного исполнения.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Условия оплаты</h3>
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="font-medium block">Предоплата</span>
                      <span className="text-sm text-slate-500">Часть суммы до начала работ</span>
                    </div>
                    <select 
                      value={formData.prepayment}
                      onChange={(e) => updateForm('prepayment', Number(e.target.value))}
                      className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value={0}>Нет</option>
                      <option value={30}>30%</option>
                      <option value={50}>50%</option>
                      <option value={100}>100%</option>
                    </select>
                  </label>
                </div>

                <div className="border border-slate-200 rounded-lg p-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="font-medium block">Поэтапная оплата</span>
                      <span className="text-sm text-slate-500">Разбиение проекта на этапы</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={formData.hasStages}
                      onChange={(e) => updateForm('hasStages', e.target.checked)}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>
                </div>

                <div className="border border-slate-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Общая сумма договора (₽)
                  </label>
                  <input
                    type="number"
                    value={formData.totalSum}
                    onChange={(e) => updateForm('totalSum', e.target.value)}
                    placeholder="100000"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: IP Rights */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Интеллектуальные права</h3>
              <div className="space-y-3">
                {ipOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.ipRights === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ipRights"
                      value={option.value}
                      checked={formData.ipRights === option.value}
                      onChange={(e) => updateForm('ipRights', e.target.value)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <span className="block font-medium">{option.label}</span>
                      <span className="text-sm text-slate-500">{option.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Liability */}
          {currentStep === 5 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Ответственность сторон</h3>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-700">
                  Мы автоматически ограничим вашу ответственность разумными пределами согласно ст. 15, 393 ГК РФ
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <label className="flex items-center justify-between">
                    <span className="font-medium">Неустойка за просрочку (в день)</span>
                    <select
                      value={formData.penaltyRate}
                      onChange={(e) => updateForm('penaltyRate', Number(e.target.value))}
                      className="border border-slate-300 rounded-lg px-3 py-1"
                    >
                      <option value={0.1}>0,1%</option>
                      <option value={0.5}>0,5%</option>
                      <option value={1}>1%</option>
                    </select>
                  </label>
                  <p className="text-xs text-slate-500 mt-1">Рекомендуем не более 0,5% для соответствия ст. 333 ГК РФ</p>
                </div>

                <div className="border border-slate-200 rounded-lg p-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.limitLiability}
                      onChange={(e) => updateForm('limitLiability', e.target.checked)}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 mr-3"
                    />
                    <div>
                      <span className="font-medium block">Ограничить ответственность размером договора</span>
                      <span className="text-sm text-slate-500">Защита от неограниченных убытков</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Additional */}
          {currentStep === 6 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Дополнительные условия</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.ndaClause ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.ndaClause}
                    onChange={(e) => updateForm('ndaClause', e.target.checked)}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 mr-3"
                  />
                  <span className="font-medium">NDA (секретность)</span>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.nonCompete ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.nonCompete}
                    onChange={(e) => updateForm('nonCompete', e.target.checked)}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 mr-3"
                  />
                  <span className="font-medium">Неконкуренция</span>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.forceMajeure ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.forceMajeure}
                    onChange={(e) => updateForm('forceMajeure', e.target.checked)}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 mr-3"
                  />
                  <span className="font-medium">Форс-мажор</span>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.arbitration ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.arbitration}
                    onChange={(e) => updateForm('arbitration', e.target.checked)}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 mr-3"
                  />
                  <span className="font-medium">Арбитражный суд</span>
                </label>
              </div>

              <div className="mt-4 border border-slate-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Срок действия договора
                </label>
                <input
                  type="text"
                  value={formData.contractTerm}
                  onChange={(e) => updateForm('contractTerm', e.target.value)}
                  placeholder="До окончания работ и окончательного расчета"
                  className="input-field"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between p-6 border-t border-slate-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Назад
          </button>
          
          {currentStep < 6 ? (
            <button
              onClick={nextStep}
              disabled={(currentStep === 1 && !formData.template) || (currentStep === 2 && !formData.userRole)}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Далее
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={generateContract}
              disabled={isGenerating}
              className="px-6 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg font-medium flex items-center disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Создание...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 mr-2" />
                  Создать договор
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Generated Contract Preview */}
      {generatedContract && (
        <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in">
          <div className="flex justify-between items-center p-6 border-b border-slate-200">
            <h3 className="font-bold text-lg">Предпросмотр договора</h3>
            <div className="space-x-3">
              <button
                onClick={copyToClipboard}
                className="text-slate-600 hover:text-primary-600 text-sm font-medium flex items-center"
              >
                <Copy className="w-4 h-4 mr-1" />
                Копировать
              </button>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                <FileDown className="w-4 h-4 mr-1" />
                Скачать DOCX
              </button>
            </div>
          </div>
          <div className="p-6">
            <pre className="whitespace-pre-wrap font-serif text-sm text-slate-700 leading-relaxed max-h-[600px] overflow-y-auto scrollbar-thin">
              {generatedContract}
            </pre>
          </div>
        </div>
      )}
      
      {/* Disclaimer */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center max-w-4xl mx-auto">
          <strong>Примечание:</strong> Сгенерированный договор носит исключительно ознакомительный характер 
          и не является юридической консультацией. Перед использованием рекомендуется обратиться 
          к квалифицированному юристу для проверки и адаптации под ваши конкретные условия.
        </p>
      </div>
    </div>
  )
}

// Helper functions
function getIPClause(type) {
  const clauses = {
    exclusive: `3.1. Исключительные права на результат работ (включая исходные коды, макеты, тексты) передаются Заказчику после полной оплаты по настоящему договору.\n\n3.2. До момента передачи прав Исполнитель сохраняет все права на созданные материалы.`,
    license: `3.1. На Заказчика передается простая (неисключительная) лицензия на использование результата работ на территории Российской Федерации.\n\n3.2. Авторские права на результат работ остаются у Исполнителя.`,
    work_for_hire: `3.1. Результат работ является служебным произведением (п. 2 ст. 1295 ГК РФ).\n\n3.2. Исключительные права на результат работ принадлежат Заказчику с момента создания.`
  }
  return clauses[type] || clauses.exclusive
}

function numberToWords(num) {
  const number = parseInt(num)
  if (isNaN(number)) return '...'
  if (number === 0) return 'ноль'
  
  const ones = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']
  const teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать']
  const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто']
  const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот']
  
  function convert(n) {
    if (n < 10) return ones[n]
    if (n < 20) return teens[n - 10]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    if (n < 1000) return hundreds[Math.floor(n / 100)] + (n % 100 ? ' ' + convert(n % 100) : '')
    return ''
  }
  
  if (number < 1000) return convert(number)
  if (number < 1000000) {
    const t = Math.floor(number / 1000)
    const r = number % 1000
    let tWord = convert(t)
    if (t === 1) tWord = 'одна тысяча'
    else if (t === 2) tWord = 'две тысячи'
    else if (t >= 3 && t <= 4) tWord += ' тысячи'
    else tWord += ' тысяч'
    return tWord + (r ? ' ' + convert(r) : '')
  }
  return number.toLocaleString('ru-RU')
}
