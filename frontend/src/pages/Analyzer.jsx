import { useState, useCallback, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, FileText, AlertTriangle, AlertCircle, CheckCircle, 
  Gavel, Download, ChevronDown, ChevronUp, Loader2
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../services/api'

const riskConfig = {
  high: { 
    color: 'danger', 
    label: 'Высокий риск', 
    icon: AlertTriangle,
    bgColor: 'bg-danger-50',
    borderColor: 'border-danger-500',
    textColor: 'text-danger-700'
  },
  medium: { 
    color: 'warning', 
    label: 'Средний риск', 
    icon: AlertCircle,
    bgColor: 'bg-warning-50',
    borderColor: 'border-warning-500',
    textColor: 'text-warning-700'
  },
  low: { 
    color: 'success', 
    label: 'Замечание', 
    icon: CheckCircle,
    bgColor: 'bg-success-50',
    borderColor: 'border-success-500',
    textColor: 'text-success-700'
  }
}

const contractTypes = [
  { value: 'podryad', label: 'Договор подряда' },
  { value: 'services', label: 'Оказания услуг' },
  { value: 'supply', label: 'Поставки' },
  { value: 'nda', label: 'NDA' },
  { value: 'agency', label: 'Агентский' },
  { value: 'oferta', label: 'Оферта' },
]

export default function Analyzer() {
  const [file, setFile] = useState(null)
  const [contractType, setContractType] = useState('podryad')
  const [userRole, setUserRole] = useState('executor')
  const [analysis, setAnalysis] = useState(null)
  const [expandedRisk, setExpandedRisk] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentContractId, setCurrentContractId] = useState(null)
  const pollingRef = useRef(null)

  const queryClient = useQueryClient()

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setAnalysis(null) // Clear previous analysis
      setCurrentContractId(null)
      toast.success(`Файл ${acceptedFiles[0].name} загружен`)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  })

  // Poll for analysis status
  const startPolling = (contractId) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
    }

    pollingRef.current = setInterval(async () => {
      try {
        const response = await api.get(`/contracts/${contractId}/status`)
        const { status, analysis: analysisData } = response.data

        if (status === 'completed' && analysisData) {
          setAnalysis(analysisData)
          setIsAnalyzing(false)
          clearInterval(pollingRef.current)
          pollingRef.current = null
          toast.success('Анализ завершен')
          queryClient.invalidateQueries(['contracts'])
        } else if (status === 'failed') {
          setIsAnalyzing(false)
          clearInterval(pollingRef.current)
          pollingRef.current = null
          toast.error('Анализ не удался')
        }
        // Continue polling if status is 'pending' or 'analyzing'
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 2000) // Poll every 2 seconds
  }

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Пожалуйста, загрузите файл')
      return
    }

    setIsAnalyzing(true)
    
    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('contractType', contractType)
      formData.append('userRole', userRole)

      // Upload and start analysis
      const response = await api.post('/contracts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const { contract } = response.data
      setCurrentContractId(contract.id)
      
      toast.success('Анализ начат...')
      
      // Start polling for results
      startPolling(contract.id)
      
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Ошибка загрузки файла')
      setIsAnalyzing(false)
    }
  }

  const loadDemo = () => {
    setContractType('podryad')
    setUserRole('executor')
    setFile({ name: 'dogovor-podryada-demo.pdf', size: 125000 })
    
    // Demo analysis data
    setAnalysis({
      risks: [
        {
          level: 'high',
          title: 'Одностороннее изменение объема работ',
          clause: '4.2',
          text: '«Заказчик вправе в одностороннем порядке изменить объем работ»',
          article: 'Ст. 310 ГК РФ',
          description: 'Изменение договора возможно только по соглашению сторон. Данная формулировка дает заказчику неограниченное право менять ТЗ.',
          recommendation: 'Заменить на: «Изменения возможны только при согласовании сторон дополнительным соглашением с корректировкой стоимости и сроков»'
        },
        {
          level: 'high',
          title: 'Неограниченная ответственность исполнителя',
          clause: '8.1',
          text: '«Исполнитель несет ответственность за все убытки Заказчика»',
          article: 'Ст. 15, 393 ГК РФ',
          description: 'Отсутствие ограничения ответственности может привести к требованиям о возмещении недополученной прибыли, косвенных убытков.',
          recommendation: 'Добавить: «Ответственность Исполнителя ограничена размером оплаты по настоящему договору»'
        },
        {
          level: 'medium',
          title: 'Несоразмерная неустойка',
          clause: '6.1',
          text: '«Неустойка 1% за каждый день просрочки»',
          article: 'Ст. 333 ГК РФ',
          description: '365% годовых значительно превышает ключевую ставку ЦБ. Суд снизит неустойку, но процесс займет время.',
          recommendation: 'Установить 0,1% (36,5% годовых) или фиксированную сумму за день просрочки'
        },
        {
          level: 'medium',
          title: 'Передача ИС без поэтапной оплаты',
          clause: '7.3',
          text: '«Исключительные права передаются после полной оплаты»',
          article: 'Ст. 1234 ГК РФ',
          description: 'Риск неполучения оплаты после передачи прав. При банкротстве заказчика права попадут в конкурсную массу.',
          recommendation: 'Разбить оплату на этапы: 50% предоплата, 50% до передачи исходников'
        },
        {
          level: 'low',
          title: 'Отсутствие срока рассмотрения результата',
          clause: '5.2',
          text: '«Заказчик обязуется рассмотреть результат работ»',
          article: 'Ст. 720 ГК РФ',
          description: 'Без конкретного срока заказчик может затягивать приемку работ бесконечно.',
          recommendation: 'Добавить: «В течение 5 рабочих дней с момента получения. По истечении — работа считается принятой»'
        }
      ],
      summary: {
        highRisks: 2,
        mediumRisks: 2,
        lowRisks: 1,
        totalScore: 35
      },
      recommendations: [
        'Внесите правки в пункты 4.2 и 8.1',
        'Снизьте неустойку до 0,1%',
        'Добавьте срок рассмотрения результата'
      ]
    })
    
    toast.success('Демо-данные загружены')
  }

  const downloadReport = async () => {
    if (!analysis || !currentContractId) {
      toast.error('Анализ не завершен или ID контракта неизвестен')
      return
    }
    
    try {
      toast.loading('Формирование отчета...', { id: 'download' })
      
      const response = await api.get(`/contracts/${currentContractId}/report`, {
        responseType: 'blob'
      })
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition']
      let filename = 'analysis_report.docx'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      
      // Create blob and download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Отчет сохранен', { id: 'download' })
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Ошибка при скачивании отчета', { id: 'download' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Анализ договора</h1>
        <p className="text-slate-600">Загрузите документ для проверки на риски и перекосы в пользу другой стороны</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Загрузка документа</h3>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-primary-500' : 'text-slate-400'}`} />
              <p className="text-sm text-slate-600 mb-2">
                {isDragActive ? 'Отпустите файл здесь' : 'Перетащите файл или нажмите для загрузки'}
              </p>
              <p className="text-xs text-slate-400">PDF, DOC, DOCX до 10 МБ</p>
            </div>

            {file && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg flex items-center">
                <FileText className="w-5 h-5 text-primary-600 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button 
                  onClick={() => {
                    setFile(null)
                    setAnalysis(null)
                    if (pollingRef.current) {
                      clearInterval(pollingRef.current)
                      pollingRef.current = null
                    }
                  }}
                  className="text-slate-400 hover:text-danger-500"
                >
                  ×
                </button>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <label className="block text-sm font-medium text-slate-700">Тип договора</label>
              <select 
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="input-field"
              >
                {contractTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="mt-6 space-y-3">
              <label className="block text-sm font-medium text-slate-700">Ваша роль</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setUserRole('executor')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    userRole === 'executor'
                      ? 'bg-primary-50 border-2 border-primary-500 text-primary-700'
                      : 'border border-slate-300 text-slate-600 hover:border-primary-300'
                  }`}
                >
                  Исполнитель
                </button>
                <button
                  onClick={() => setUserRole('customer')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    userRole === 'customer'
                      ? 'bg-primary-50 border-2 border-primary-500 text-primary-700'
                      : 'border border-slate-300 text-slate-600 hover:border-primary-300'
                  }`}
                >
                  Заказчик
                </button>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Анализ...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Начать анализ
                </>
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <button 
                onClick={loadDemo}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Загрузить демо-пример
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {!analysis ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
              <FileText className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                {isAnalyzing ? 'Анализируем документ...' : 'Загрузите договор для начала анализа'}
              </h3>
              <p className="text-slate-500 text-sm max-w-md">
                {isAnalyzing 
                  ? 'ИИ изучает документ и выявляет риски. Это займет 10-30 секунд.'
                  : 'Система проверит документ на риски, перекосы в пользу другой стороны и даст рекомендации по исправлению'}
              </p>
              {isAnalyzing && (
                <div className="mt-6 flex items-center text-primary-600">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="text-sm">Обработка...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Результаты анализа</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysis.summary.highRisks > 0 
                        ? 'bg-danger-100 text-danger-700 border border-danger-200' 
                        : 'bg-warning-100 text-warning-700 border border-warning-200'
                    }`}>
                      {analysis.summary.highRisks > 0 ? 'Высокий риск' : 'Требует внимания'}
                    </span>
                    <button 
                      onClick={downloadReport}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Скачать отчет"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-danger-50 rounded-lg border border-danger-100">
                    <div className="text-2xl font-bold text-danger-600">{analysis.summary.highRisks}</div>
                    <div className="text-xs text-slate-600 mt-1">Критических</div>
                  </div>
                  <div className="text-center p-4 bg-warning-50 rounded-lg border border-warning-100">
                    <div className="text-2xl font-bold text-warning-600">{analysis.summary.mediumRisks}</div>
                    <div className="text-xs text-slate-600 mt-1">Средних</div>
                  </div>
                  <div className="text-center p-4 bg-success-50 rounded-lg border border-success-100">
                    <div className="text-2xl font-bold text-success-600">{analysis.summary.lowRisks}</div>
                    <div className="text-xs text-slate-600 mt-1">Замечаний</div>
                  </div>
                </div>

                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <h4 className="font-medium text-primary-900 mb-2">Общие рекомендации:</h4>
                    <ul className="space-y-1">
                      {analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-primary-800 flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Risks List */}
              <div className="space-y-4">
                {analysis.risks.map((risk, index) => {
                  const config = riskConfig[risk.level]
                  const isExpanded = expandedRisk === index
                  
                  return (
                    <div
                      key={index}
                      className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden ${config.bgColor}`}
                    >
                      <div 
                        className={`p-5 cursor-pointer ${config.borderColor} border-l-4`}
                        onClick={() => setExpandedRisk(isExpanded ? null : index)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                              {config.label}
                            </span>
                            <h4 className="font-bold text-slate-900">{risk.title}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            {risk.clause && (
                              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                Пункт {risk.clause}
                              </span>
                            )}
                            {risk.article && (
                              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                {risk.article}
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </div>
                        
                        {!isExpanded && risk.text && (
                          <p className="mt-2 text-sm text-slate-600 line-clamp-1">{risk.text}</p>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="px-5 pb-5">
                          {risk.clause && (
                            <div className="mb-3">
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Пункт договора:</span>
                              <span className="ml-2 text-sm font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                                {risk.clause}
                              </span>
                            </div>
                          )}
                          
                          {risk.text && (
                            <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-400 mb-3">
                              <p className="text-sm text-slate-700 italic">"{risk.text}"</p>
                            </div>
                          )}
                          
                          {risk.description && (
                            <p className="text-sm text-slate-600 mb-3">{risk.description}</p>
                          )}
                          
                          {risk.recommendation && (
                            <div className="bg-success-50 border border-success-200 rounded-lg p-3">
                              <div className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-success-500 mt-1 mr-2 flex-shrink-0" />
                                <div>
                                  <span className="text-xs font-semibold text-slate-700 block mb-1">Рекомендация:</span>
                                  <p className="text-sm text-slate-700">{risk.recommendation}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
