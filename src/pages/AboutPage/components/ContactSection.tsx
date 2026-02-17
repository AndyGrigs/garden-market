import { motion } from '@/utils/motionComponents'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'

export const ContactSection = () => {
  return (
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
  )
}
