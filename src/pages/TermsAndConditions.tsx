import { motion } from 'framer-motion';
import { AlertCircle} from 'lucide-react';
import TermsContent from '../shared/terms/TermsContent';
import { t } from 'i18next';
import MainPageLink from '../shared/MainPageLink';

const TermsAndConditions = () => {


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
                {t('terms.pageTitle')}
              </h1>
              <p className="text-emerald-100 max-w-2xl">
                {t('terms.pageSubtitle')}
              </p>
            </motion.div>

            <MainPageLink/>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mobile Home Button */}
        <div className="md:hidden mb-8">
          <MainPageLink/>
        </div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
        >
          <p className="text-blue-800 text-sm">
            <strong>{t('terms.lastUpdated')}</strong>{import.meta.env.VITE_UPDATE_DATE}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('terms.importantInfo')}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {t('terms.introText1')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('terms.introText2')}
          </p>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {/* Terms Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <TermsContent compact={false} />
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-emerald-600 text-white rounded-lg shadow-md p-8 mt-12"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
           {t('terms.contactInfo')}
          </h2>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Адрес</h3>
              <p className="text-emerald-100">
                с. Ришканы
                <br />
                Каушанский район
                <br />
                Молдова
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Телефоны</h3>
              <p className="text-emerald-100">
                +373 79 748 131
                <br />
                +373 68 123 456
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="text-emerald-100">
                info@covacitrees.md
                <br />
                vasile@covacitrees.md
              </p>
            </div>
          </div> */}

          <div className="text-center mt-8 pt-6 border-t border-emerald-500">
            <p className="text-emerald-100 text-sm">
              {t('terms.contactText')}
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
                {t('terms.agreementTitle')}
              </h3>
              <p className="text-yellow-700 leading-relaxed">
                {t('terms.agreementText')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
