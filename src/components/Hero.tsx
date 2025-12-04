import { motion } from '@/utils/motionComponents';
import { ArrowDown} from 'lucide-react';
import { useTranslation } from 'react-i18next';
const Hero = () => {
    const {t} = useTranslation()
  return (
    <section className="relative bg-gradient-to-br from-emerald-500 to-emerald-700 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/magicstudio-art.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-emerald-500/50 to-emerald-300/60"></div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            {t('hero.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-emerald-50"
          >
            {t('hero.subtitle', { 
              defaultValue: 'Premium quality trees and plants for your garden. Sustainable, healthy, and delivered to your door.' 
            })}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Scroll to products section
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-2 hover:bg-emerald-50 transition-colors shadow-lg"
          >
            <span>{t('hero.cta')}</span>
            <ArrowDown className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
