import { useTranslation } from 'react-i18next';
import { motion } from '@/utils/motionComponents';
import TermsContent from '@/shared/terms/TermsContent';


interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('terms.modalTitle')}
          </h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <TermsContent compact={true} />
        </div>
        
        <div className="p-6 border-t flex justify-end space-x-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {t('terms.close')}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="px-6 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
          >
            {t('terms.accept')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}