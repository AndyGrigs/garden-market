import { motion } from 'framer-motion';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Умови використання сайту
          </h2>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4 text-gray-700">
            <h3 className="text-lg font-semibold">1. Загальні положення</h3>
            <p>
              Ласкаво просимо на наш сайт з продажу рослин. Використовуючи наш сайт, 
              ви погоджуєтесь з цими умовами використання.
            </p>
            
            <h3 className="text-lg font-semibold">2. Реєстрація</h3>
            <p>
              Для здійснення покупок необхідно зареєструватися. Ви зобов'язані 
              надати точну інформацію про себе.
            </p>
            
            <h3 className="text-lg font-semibold">3. Конфіденційність</h3>
            <p>
              Ми зобов'язуємось захищати вашу особисту інформацію відповідно до 
              нашої політики конфіденційності.
            </p>
            
            <h3 className="text-lg font-semibold">4. Правила продажу</h3>
            <p>
              Продавці зобов'язані надавати достовірну інформацію про рослини та 
              дотримуватись якості товарів.
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Закрити
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
          >
            Прийняти
          </button>
        </div>
      </motion.div>
    </div>
  );
}