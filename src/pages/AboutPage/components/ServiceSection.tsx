import { services } from '../data/aboutData';
import { motion } from '@/utils/motionComponents';
import { Award, CheckCircle } from 'lucide-react';

export const ServiceSection = () => {
  return (
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
  );
};
