
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Users, 
  Award, 
  Leaf, 
  Heart,
  CheckCircle 
} from 'lucide-react';
// import { useTranslation } from 'react-i18next';

const About = () => {
//   const { t } = useTranslation();

  const teamMembers = [
    {
      name: "Андрей Ковач",
      role: "Основатель & Главный садовник",
      experience: "5 лет опыта",
      image: "/api/placeholder/300/300",
      description: "Эксперт по выращиванию хвойных и лиственных пород деревьев"
    },
    {
      name: "Иван Ковач",
      role: "Менеджер по продажам",
      experience: "3 года опыта",
      image: "/api/placeholder/300/300",
      description: "Консультирует клиентов и обеспечивает качественное обслуживание"
    }
  ];

  const services = [
    "Выращивание качественных саженцев деревьев",
    "Консультации по ландшафтному дизайну",
    "Доставка по всей Молдове",
    "Посадка и уход за деревьями",
    "Подбор растений под конкретную почву",
    "Гарантия приживаемости саженцев"
  ];

  const achievements = [
    { number: "500+", label: "Довольных клиентов" },
    { number: "15000+", label: "Посаженных деревьев" },
    { number: "5+", label: "Лет опыта" },
    { number: "50+", label: "Видов растений" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                О нашей семье
              </h1>
              <p className="text-xl text-emerald-100 max-w-2xl">
                Семья Ковач уже более 5 лет занимается выращиванием и продажей качественных саженцев деревьев
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

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <Heart className="h-8 w-8 text-emerald-600 mr-3" />
                  Наша история
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Семья Ковач начала заниматься выращиванием саженцев более 5 лет назад.
                    Это началось как небольшое хобби, но постепенно переросло в семейный бизнес,
                    которым мы гордимся.
                  </p>
                  <p>
                    За годы работы мы накопили богатый опыт в выращивании различных видов деревьев
                    и кустарников, адаптированных к климату Молдовы. Наши саженцы выращиваются с любовью
                    и заботой, что гарантирует их высокое качество и приживаемость.
                  </p>
                  <p>
                    Наша миссия - помочь людям создавать красивые зеленые пространства,
                    которые будут радовать их и их семьи на протяжении многих лет.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/api/placeholder/500/400"
                  alt="Семейный бизнес"
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-emerald-600 bg-opacity-20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                  {achievement.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 flex items-center justify-center">
            <Users className="h-8 w-8 text-emerald-600 mr-3" />
            Наша команда
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    {member.experience}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 flex items-center justify-center">
              <Award className="h-8 w-8 text-emerald-600 mr-3" />
              Наши услуги
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-700">{service}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-16"
        >
          <div className="bg-emerald-600 text-white rounded-lg shadow-md p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
              <Phone className="h-8 w-8 mr-3" />
              Свяжитесь с нами
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="space-y-3"
              >
                <Phone className="h-12 w-12 mx-auto text-emerald-200" />
                <h3 className="text-xl font-semibold">Телефон</h3>
                <div className="space-y-1">
                  <p className="text-emerald-100">+373 79 748 131</p>
                  <p className="text-emerald-100"></p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="space-y-3"
              >
                <Mail className="h-12 w-12 mx-auto text-emerald-200" />
                <h3 className="text-xl font-semibold">Email</h3>
                <div className="space-y-1">
                  <p className="text-emerald-100">info@covacitrees.md</p>
                  <p className="text-emerald-100">vasile@covacitrees.md</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="space-y-3"
              >
                <MapPin className="h-12 w-12 mx-auto text-emerald-200" />
                <h3 className="text-xl font-semibold">Адрес</h3>
                <div className="space-y-1">
                  <p className="text-emerald-100">с. Чалык</p>
                  <p className="text-emerald-100">Тараклийский р-он</p>
                  <p className="text-emerald-100">Молдова</p>
                </div>
              </motion.div>
            </div>
            
            {/* Working Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="mt-12 text-center border-t border-emerald-500 pt-8"
            >
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-semibold">График работы</h3>
              </div>
              <div className="space-y-2 text-emerald-100">
                <p>Понедельник - Пятница: 8:00 - 18:00</p>
                <p>Суббота: 9:00 - 16:00</p>
                <p>Воскресенье: выходной</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-center"
        >
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-emerald-600 mr-2" />
              Готовы создать ваш идеальный сад?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Свяжитесь с нами сегодня для бесплатной консультации. 
              Мы поможем подобрать идеальные растения для вашего участка.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+37379748131"
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <Phone className="h-5 w-5 mr-2" />
                Позвонить
              </a>
              <a
                href="mailto:info@covacitrees.md"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
              >
                <Mail className="h-5 w-5 mr-2" />
                Написать письмо
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
