import { motion } from 'framer-motion';
import { Leaf, Phone, Mail } from 'lucide-react';

export const CtaSection = () => {
  return (
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
          Свяжитесь с нами сегодня для бесплатной консультации. Мы поможем
          подобрать идеальные растения для вашего участка.
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
  );
};
