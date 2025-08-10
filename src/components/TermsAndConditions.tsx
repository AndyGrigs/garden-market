import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Shield, 
  Truck, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard
} from 'lucide-react';
// import { useTranslation } from 'react-i18next';

const TermsAndConditions = () => {
//   const { t } = useTranslation();

  const sections = [
    {
      id: "general",
      title: "1. Общие положения",
      icon: <FileText className="h-6 w-6" />,
      content: [
        "Настоящие Условия регулируют отношения между семейным предприятием «Коваци Деревья» (далее «Продавец») и покупателем (далее «Клиент»).",
        "Оформляя заказ, Клиент подтверждает свое согласие с данными Условиями.",
        "Продавец оставляет за собой право изменять Условия без предварительного уведомления.",
        "Актуальная версия Условий всегда доступна на нашем сайте."
      ]
    },
    {
      id: "products",
      title: "2. Товары и услуги",
      icon: <CheckCircle className="h-6 w-6" />,
      content: [
        "Мы предлагаем качественные саженцы деревьев, выращенные в наших питомниках.",
        "Все растения проходят тщательный отбор и контроль качества перед продажей.",
        "Возраст и размер саженцев могут незначительно отличаться от указанных на сайте.",
        "Мы предоставляем консультации по посадке и уходу за растениями.",
        "Доступны услуги по ландшафтному дизайну и профессиональной посадке."
      ]
    },
    {
      id: "ordering",
      title: "3. Оформление заказа",
      icon: <CreditCard className="h-6 w-6" />,
      content: [
        "Заказы принимаются через сайт, по телефону или при личном визите.",
        "Все цены указаны в молдавских леях (MDL) и включают НДС.",
        "Минимальная сумма заказа составляет 200 MDL.",
        "Крупные заказы (свыше 5000 MDL) требуют предварительной оплаты 50%.",
        "Мы принимаем оплату наличными, картой и банковским переводом."
      ]
    },
    {
      id: "delivery",
      title: "4. Доставка",
      icon: <Truck className="h-6 w-6" />,
      content: [
        "Доставка осуществляется по всей территории Молдовы.",
        "Стоимость доставки рассчитывается индивидуально в зависимости от расстояния.",
        "Бесплатная доставка при заказе от 3000 MDL в радиусе 50 км от нашего питомника.",
        "Сроки доставки: 1-3 рабочих дня для готовых к отгрузке товаров.",
        "Саженцы доставляются в специальной упаковке для сохранения корневой системы.",
        "Клиент обязан присутствовать при доставке для приемки товара."
      ]
    },
    {
      id: "warranty",
      title: "5. Гарантии качества",
      icon: <Shield className="h-6 w-6" />,
      content: [
        "Мы гарантируем качество всех поставляемых саженцев.",
        "Гарантия приживания составляет 6 месяцев при соблюдении условий посадки и ухода.",
        "Гарантия не распространяется на растения, поврежденные вредителями или болезнями после посадки.",
        "При гибели саженца в гарантийный период мы бесплатно заменим его на аналогичный.",
        "Для получения гарантийного обслуживания необходимо сохранить чек и фото посадки."
      ]
    },
    {
      id: "returns",
      title: "6. Возврат товара",
      icon: <RefreshCw className="h-6 w-6" />,
      content: [
        "Возврат живых растений возможен только в случае производственного брака.",
        "Претензии по качеству принимаются в течение 24 часов с момента получения товара.",
        "Возврат денежных средств осуществляется в течение 7 рабочих дней.",
        "Транспортные расходы по возврату бракованного товара берет на себя Продавец.",
        "Саженцы должны быть возвращены в первоначальном состоянии с сохранением упаковки."
      ]
    },
    {
      id: "responsibilities",
      title: "7. Ответственность сторон",
      icon: <AlertCircle className="h-6 w-6" />,
      content: [
        "Продавец не несет ответственности за неправильную посадку или уход за растениями.",
        "Клиент обязан обеспечить соответствующие условия для роста растений.",
        "Продавец не несет ответственности за ущерб, вызванный форс-мажорными обстоятельствами.",
        "Ответственность Продавца ограничивается стоимостью поставленного товара.",
        "Все споры решаются путем переговоров, при необходимости - в судебном порядке."
      ]
    },
    {
      id: "seasonal",
      title: "8. Сезонные особенности",
      icon: <Clock className="h-6 w-6" />,
      content: [
        "Оптимальное время для посадки: весна (март-май) и осень (сентябрь-ноябрь).",
        "В зимний период доступны только саженцы в контейнерах.",
        "Летняя посадка требует дополнительного ухода и частого полива.",
        "График работы питомника может изменяться в зависимости от сезона.",
        "Весной возможны задержки в обработке заказов из-за высокого спроса."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-emerald-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Условия предоставления услуг
              </h1>
              <p className="text-emerald-100 max-w-2xl">
                Ознакомьтесь с условиями покупки саженцев и услуг семейного предприятия «Коваци Деревья»
              </p>
            </motion.div>
            
            <Link
              to="/"
              className="hidden md:flex items-center space-x-2 bg-white text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
            >
              <Home className="h-5 w-5" />
              <span>На главную</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mobile Home Button */}
        <div className="md:hidden mb-8">
          <Link
            to="/"
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors w-fit"
          >
            <Home className="h-5 w-5" />
            <span>На главную</span>
          </Link>
        </div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
        >
          <p className="text-blue-800 text-sm">
            <strong>Последнее обновление:</strong> 10 августа 2025 года
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Важная информация</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Семейное предприятие «Коваци Деревья» с 1998 года занимается выращиванием и продажей 
            качественных саженцев деревьев. Мы ценим каждого клиента и стремимся обеспечить 
            максимально прозрачные и справедливые условия сотрудничества.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Настоящие Условия являются публичной офертой и вступают в силу с момента размещения 
            заказа или подписания договора на оказание услуг.
          </p>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-emerald-600 mr-3">
                    {section.icon}
                  </span>
                  {section.title}
                </h3>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-emerald-600 text-white rounded-lg shadow-md p-8 mt-12"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Контактная информация
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Адрес</h3>
              <p className="text-emerald-100">
                с. Ришканы<br />
                Каушанский район<br />
                Молдова
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Телефоны</h3>
              <p className="text-emerald-100">
                +373 79 748 131<br />
                +373 68 123 456
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="text-emerald-100">
                info@covacitrees.md<br />
                vasile@covacitrees.md
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-6 border-t border-emerald-500">
            <p className="text-emerald-100 text-sm">
              По всем вопросам, касающимся данных Условий, обращайтесь к нам любым удобным способом.
              Мы всегда готовы предоставить разъяснения и помочь в решении спорных ситуаций.
            </p>
          </div>
        </motion.div>

        {/* Agreement Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Согласие с условиями
              </h3>
              <p className="text-yellow-700 leading-relaxed">
                Размещая заказ на нашем сайте, по телефону или при личном визите, 
                вы автоматически соглашаетесь с данными Условиями. Если у вас есть 
                вопросы или возражения по любому пункту, пожалуйста, свяжитесь с нами 
                перед оформлением заказа.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;