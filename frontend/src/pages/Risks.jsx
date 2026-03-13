import { useState, useEffect } from 'react'
import { 
  Calculator, AlertTriangle, CheckCircle, BookOpen, 
  Info, TrendingUp, Shield
} from 'lucide-react'
import toast from 'react-hot-toast'

const riskLevels = [
  { rate: 0.1, label: 'Безопасно', color: 'success', desc: 'До 0,1% (~36.5% годовых)' },
  { rate: 0.5, label: 'Умеренно', color: 'warning', desc: '0,1% - 0,5% (~182% годовых)' },
  { rate: 1, label: 'Высокий риск', color: 'danger', desc: '> 0,5% (риск ст. 333)' },
]

const articles = [
  { number: '330', title: 'Понятие неустойки' },
  { number: '333', title: 'Снижение размера неустойки' },
  { number: '15', title: 'Реальные убытки' },
  { number: '393', title: 'Возмещение убытков' },
  { number: '310', title: 'Односторонний отказ' },
]

export default function Risks() {
  const [amount, setAmount] = useState('')
  const [penaltyRate, setPenaltyRate] = useState(0.5)
  const [days, setDays] = useState(30)
  const [fine, setFine] = useState('')
  const [unilateral, setUnilateral] = useState(false)
  const [result, setResult] = useState(null)

  const calculate = () => {
    const amountNum = parseFloat(amount) || 0
    const fineNum = parseFloat(fine) || 0
    
    const penaltySum = amountNum * (penaltyRate / 100) * days
    const damages = unilateral ? amountNum * 0.5 : 0
    const total = Math.min(penaltySum + fineNum + damages, amountNum * 3)
    const annualRate = penaltyRate * 365

    const recommendations = []
    if (annualRate > 50) {
      recommendations.push('Неустойка может быть снижена судом по ст. 333 ГК РФ как несоразмерная')
    }
    if (penaltySum > amountNum) {
      recommendations.push('Неустойка превышает сумму договора — высокий риск снижения')
    }
    if (penaltyRate > 1) {
      recommendations.push('Рекомендуем снизить до 0,1-0,5% в день')
    }
    if (unilateral && !recommendations.includes('Добавьте конкретный перечень убытков')) {
      recommendations.push('Добавьте конкретный перечень убытков подлежащих возмещению')
    }
    if (recommendations.length === 0) {
      recommendations.push('Укажите конкретную сумму штрафов вместо процентов')
      recommendations.push('Ограничьте ответственность пределом договора')
    }

    setResult({
      penaltySum,
      fine: fineNum,
      damages,
      total,
      annualRate,
      article333Risk: annualRate > 50,
      recommendations
    })

    toast.success('Расчет выполнен')
  }

  const getRiskLevel = () => {
    const annualRate = penaltyRate * 365
    if (annualRate <= 36.5) return 'success'
    if (annualRate <= 182) return 'warning'
    return 'danger'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Оценка финансовых рисков</h1>
        <p className="text-slate-600">Рассчитайте максимальную ответственность по договору и проверьте соразмерность неустойки</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calculator */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-bold text-lg">Калькулятор ответственности</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Сумма договора (₽)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100000"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Неустойка (% в день)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={penaltyRate}
                  onChange={(e) => setPenaltyRate(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  min="0"
                  className="input-field"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
              </div>
              <div className={`mt-1 text-xs ${
                getRiskLevel() === 'success' ? 'text-success-600' :
                getRiskLevel() === 'warning' ? 'text-warning-600' : 'text-danger-600'
              }`}>
                ~{(penaltyRate * 365).toFixed(0)}% годовых
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Макс. просрочка (дней)
              </label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 0)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Штрафы за нарушение (₽)
            </label>
            <input
              type="number"
              value={fine}
              onChange={(e) => setFine(e.target.value)}
              placeholder="50000"
              className="input-field"
            />
          </div>

          <div className="flex items-center p-3 bg-slate-50 rounded-lg">
            <input
              type="checkbox"
              id="unilateral"
              checked={unilateral}
              onChange={(e) => setUnilateral(e.target.checked)}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 mr-3"
            />
            <label htmlFor="unilateral" className="text-sm text-slate-700 cursor-pointer">
              Есть пункт о одностороннем отказе с возмещением убытков
            </label>
          </div>

          <button
            onClick={calculate}
            disabled={!amount}
            className="w-full btn-primary disabled:opacity-50 flex items-center justify-center"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Рассчитать риски
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
              <h3 className="font-bold text-lg mb-4">Результат анализа</h3>
              
              <div className={`p-4 rounded-lg border mb-4 ${
                result.article333Risk 
                  ? 'bg-danger-50 border-danger-200' 
                  : 'bg-success-50 border-success-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">Максимальная ответственность:</span>
                  <span className={`text-2xl font-bold ${
                    result.article333Risk ? 'text-danger-600' : 'text-success-600'
                  }`}>
                    {result.total.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Сумма неустойки:</span>
                  <span className="font-medium">{result.penaltySum.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Штрафы:</span>
                  <span className="font-medium">{result.fine.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Убытки (при отказе):</span>
                  <span className="font-medium">{result.damages.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              {result.article333Risk && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Риск применения ст. 333 ГК РФ</p>
                      <p className="text-sm text-slate-600 mt-1">
                        Неустойка может быть снижена судом как несоразмерная. 
                        Рекомендуем не более 0,1% в день.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
                <h4 className="font-medium text-primary-700 mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Рекомендации:
                </h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-center py-8 text-slate-400">
                <Calculator className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Введите данные для расчета</p>
              </div>
            </div>
          )}

          {/* Legal Articles */}
          <div className="bg-slate-900 text-white p-6 rounded-xl">
            <h4 className="font-bold mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Полезные статьи ГК РФ
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {articles.map((article) => (
                <li key={article.number} className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <div>
                    <strong className="text-white">Ст. {article.number}</strong>
                    {' '}— {article.title}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Levels Info */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-slate-600" />
              Уровни риска неустойки
            </h4>
            <div className="space-y-3">
              {riskLevels.map((level) => (
                <div 
                  key={level.rate}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    level.color === 'success' ? 'bg-success-50' :
                    level.color === 'warning' ? 'bg-warning-50' : 'bg-danger-50'
                  }`}
                >
                  <span className="text-sm flex items-center">
                    <CheckCircle className={`w-4 h-4 mr-2 ${
                      level.color === 'success' ? 'text-success-500' :
                      level.color === 'warning' ? 'text-warning-500' : 'text-danger-500'
                    }`} />
                    {level.label}
                  </span>
                  <span className="text-xs text-slate-500">{level.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-700">
                <p className="font-medium mb-1">Как работает калькулятор?</p>
                <p className="text-slate-600">
                  Мы рассчитываем максимальную возможную ответственность исходя из 
                  указанной неустойки, сроков просрочки и дополнительных штрафов. 
                  Система предупреждает о рисках снижения неустойки судом (ст. 333 ГК РФ).
                </p>
              </div>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              <strong>Примечание:</strong> Результаты расчета носят исключительно ознакомительный характер 
              и не являются юридической консультацией. Фактический размер ответственности может отличаться 
              и определяется судом в каждом конкретном случае.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
