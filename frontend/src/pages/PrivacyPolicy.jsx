import { Link } from 'react-router-dom'
import { ArrowLeft, Scale } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-slate-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            На главную
          </Link>
          
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center mr-3">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Политика конфиденциальности</h1>
          </div>
          
          <p className="text-slate-600">
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Общие положения</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Настоящая Политика конфиденциальности персональных данных (далее — Политика) 
              действует в отношении всей информации, которую сервис LegalFlow (далее — Сервис) 
              может получить о пользователе во время использования сайта и приложения.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Использование Сервиса означает безоговорочное согласие пользователя с настоящей 
              Политикой и указанными в ней условиями обработки его персональных данных. 
              В случае несогласия с этими условиями пользователь должен воздержаться от 
              использования Сервиса.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Персональные данные пользователей</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Сервис собирает и обрабатывает следующие персональные данные:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Адрес электронной почты (email)</li>
              <li>Имя и фамилия (при их указании)</li>
              <li>Информация о компании (при её указании)</li>
              <li>История использования сервиса</li>
              <li>Загруженные документы (договоры, переписка)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. Цели обработки персональных данных</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Персональные данные пользователей обрабатываются в следующих целях:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Идентификация пользователя при авторизации</li>
              <li>Предоставление доступа к функционалу Сервиса</li>
              <li>Анализ загруженных документов по запросу пользователя</li>
              <li>Улучшение качества работы Сервиса</li>
              <li>Коммуникация с пользователем (ответы на обращения в поддержку)</li>
              <li>Отправка информационных материалов (с согласия пользователя)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Обработка загруженных документов</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              При использовании функций анализа договоров и переписки пользователи загружают 
              документы на серверы Сервиса. К ним относятся:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Тексты договоров (PDF, DOC, DOCX)</li>
              <li>Файлы переписки (скриншоты, экспорты)</li>
              <li>Сгенерированные договоры</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              Загруженные документы используются исключительно для предоставления услуг анализа 
              и генерации. Сервис не передаёт содержимое документов третьим лицам, за исключением 
              случаев, предусмотренных законодательством.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Хранение и защита данных</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Сервис принимает необходимые и достаточные организационные и технические меры для 
              защиты персональных данных пользователей от неправомерного или случайного доступа, 
              уничтожения, изменения, блокирования, копирования, распространения, а также от 
              иных неправомерных действий.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Данные хранятся в защищённых дата-центрах с использованием шифрования. 
              Доступ к данным имеют только уполномоченные сотрудники, осуществляющие 
              техническую поддержку Сервиса.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">6. Срок хранения данных</h2>
            <p className="text-slate-700 leading-relaxed">
              Персональные данные и загруженные документы хранятся в течение срока действия 
              учётной записи пользователя. По истечении 30 дней после удаления аккаунта 
              все данные безвозвратно удаляются из системы. Пользователь может самостоятельно 
              удалить свои документы в любой момент через личный кабинет.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">7. Передача данных третьим лицам</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Сервис не передаёт персональные данные пользователей третьим лицам, за 
              исключением следующих случаев:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Для анализа документов с использованием внешних AI-сервисов (без сохранения контекста)</li>
              <li>По требованию уполномоченных органов государственной власти РФ</li>
              <li>В случае необходимости защиты прав и законных интересов Сервиса</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">8. Права пользователя</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Пользователь имеет право:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Получить информацию об обрабатываемых персональных данных</li>
              <li>Требовать уточнения, блокирования или уничтожения своих персональных данных</li>
              <li>Отозвать согласие на обработку персональных данных</li>
              <li>Удалить свой аккаунт и все связанные данные</li>
              <li>Обжаловать действия или бездействие Сервиса в уполномоченный орган</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">9. Использование cookies</h2>
            <p className="text-slate-700 leading-relaxed">
              Сервис использует файлы cookies для обеспечения работы сайта, сохранения 
              настроек пользователя и анализа использования сервиса. Продолжая использовать 
              сайт, пользователь соглашается с использованием cookies. Пользователь может 
              отключить cookies в настройках браузера, однако это может повлиять на 
              функциональность Сервиса.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">10. Изменения политики конфиденциальности</h2>
            <p className="text-slate-700 leading-relaxed">
              Сервис оставляет за собой право вносить изменения в настоящую Политику 
              конфиденциальности. При внесении изменений обновлённая версия будет 
              опубликована на этой странице с указанием даты последнего обновления. 
              Рекомендуем периодически проверять эту страницу на предмет изменений.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">11. Контакты</h2>
            <p className="text-slate-700 leading-relaxed">
              По всем вопросам, связанным с обработкой персональных данных и настоящей 
              Политикой конфиденциальности, пожалуйста, обращайтесь через форму обратной 
              связи на сайте.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              © {new Date().getFullYear()} LegalFlow. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
