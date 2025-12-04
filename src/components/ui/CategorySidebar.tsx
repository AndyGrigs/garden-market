import { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from '@/utils/motionComponents';
import { useTranslation } from 'react-i18next';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { BASE_URL } from '@/config';
import { getCategoryName } from '@/shared/helpers/getCategoryName';

interface CategorySidebarProps {
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CategorySidebar({ 
  selectedCategoryId, 
  onCategorySelect, 
  isMobile = false,
  isOpen = true,
  onClose 
}: CategorySidebarProps) {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const { t, i18n } = useTranslation();

 ;

  if (isLoading) {
    return (
      <div className={`${isMobile ? 'p-4' : 'p-6'} bg-white rounded-lg shadow-md`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const content = (
    <div className={`bg-white rounded-lg shadow-md ${isMobile ? 'h-full' : ''}`}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            {t('categories.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className={isMobile ? 'p-4' : 'p-6'}>
        {!isMobile && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full mb-4 text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
          >
            <span className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              {t('categories.title')}
            </span>
            <ChevronDown 
              className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </button>
        )}

        <AnimatePresence>
          {(isExpanded || isMobile) && (
            <motion.div
              initial={!isMobile ? { opacity: 0, height: 0 } : false}
              animate={!isMobile ? { opacity: 1, height: 'auto' } : false}
              exit={!isMobile ? { opacity: 0, height: 0 } : undefined}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onCategorySelect(null);
                  if (isMobile && onClose) onClose();
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedCategoryId === null
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {t('categories.all')}
              </motion.button>

              {Array.isArray(categories) && categories.length > 0 ? (
                categories?.map((category) => (
                <motion.button
                  key={category._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onCategorySelect(category._id);
                    if (isMobile && onClose) onClose();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    selectedCategoryId === category._id
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {category.imageUrl && (
                    <img
                      src={`${BASE_URL}${category.imageUrl}`}
                      alt={getCategoryName(category, i18n.language)}
                      className="w-8 h-8 object-cover rounded-md"
                    />
                  )}
                  <span className="font-medium">
                    {getCategoryName(category, i18n.language)}
                  </span>
                </motion.button>
              ))
              ): (
                <div className="text-gray-500 px-4 py-3">
                  {t('categories.noCategories')}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[80vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return content;
}