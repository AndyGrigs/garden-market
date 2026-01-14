import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { AnimatePresence, motion } from '@/utils/motionComponents';

import { useLanguage } from "@/hooks/useLanguage";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { useGetTreesQuery } from "@/store/api/treesApi";
import { Tree } from "@/types/ITree";
import toast, { Toaster } from "react-hot-toast";
import { IContactForm } from "@/types/IContactForm";
import i18n from "@/i18n";
import CategorySidebar from "../ui/CategorySidebar";
import TreeCard from "../ui/TreeCard";
import ReviewsSection from "../Features/Reviews/ReviewsSection";
import { CheckCircle, MessageCircle, Star, X } from "lucide-react";
import Footer from "../Footer";
import ContactForm from "../Features/Contact/ContactForm";
import ReviewForm from "../Features/Reviews/ReviewForm";
import Hero from '@/components/Hero';
import { useAppDispatch } from '@/store/store';
import { addToCart as addToCartAction } from '@/store/slices/cartSlice';


interface OutletContext {
  isCategoryFilterOpen: boolean;
  setIsCategoryFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MainContent() {
  const { data: trees, isLoading, error } = useGetTreesQuery();
  const {data: categories}= useGetCategoriesQuery();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  });
  const { t } = useTranslation();
  const lang = useLanguage();
  const dispatch = useAppDispatch();

  // Get context from Layout
  const { isCategoryFilterOpen, setIsCategoryFilterOpen } = useOutletContext<OutletContext>();

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const getTreeTitle = (title: { [key: string]: string }) => {
    return title?.[lang] || title?.en || title?.ru || "Unknown";
  };

  const addToCart = (tree: Tree) => {
    showNotification(t('cart.notifications.added', { name: getTreeTitle(tree.title) }));
    dispatch(addToCartAction({ ...tree, quantity: 1 }));
  };

  const handleContactSubmit = (form: IContactForm) => {
    console.log('Contact form submitted:', form);
    toast.success(t('contact.success'));
    setIsContactOpen(false);
  };

  // Filter trees by selected category
  const filteredTrees = selectedCategoryId
    ? trees?.filter(tree => {
        if (typeof tree.category === 'object' && tree.category !== null) {
          return tree.category._id === selectedCategoryId;
        }
        return tree.category === selectedCategoryId;
      })
    : trees;

    
const getSelectedCategoryName = () => {
  if (!selectedCategoryId || !categories) return t('collection.title');
  
  const category = categories.find(cat => cat._id === selectedCategoryId);
  if (!category) return t('collection.title');
  
 
  return category.name[i18n.language as keyof typeof category.name] || 
         category.name.ru ||
         category.name.ro ||
         'Категория';
};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        {/* {Hero section} */}
        <Hero/>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Category Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <CategorySidebar
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={setSelectedCategoryId}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <section id="products" className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                  {selectedCategoryId 
                    ? getSelectedCategoryName()
                    : t('collection.title') || "Collection"
                  }
                </h2>
                {isLoading ? (
                  <div className="flex justify-center items-center min-h-[400px]">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="rounded-full h-12 w-12 border-b-2 border-emerald-600"
                    />
                  </div>
                ) : error ? (
                  <div className="text-center text-red-600">
                    {t('collection.error') || "Error loading collection"}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {Array.isArray(filteredTrees) ? (
                      filteredTrees.map((tree, index) => (
                        <motion.div
                          key={tree._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <TreeCard
                            tree={tree}
                            onAddToCart={addToCart}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-600 py-12">
                        <p>No trees available at the moment.</p>
                        {trees && !Array.isArray(trees) && (
                          <p className="text-sm mt-2">
                            Data format issue: Expected array but got {typeof trees}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection />
      </motion.main>

      {/* Mobile Category Menu */}
      <CategorySidebar
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={setSelectedCategoryId}
        isMobile={true}
        isOpen={isCategoryFilterOpen}
        onClose={() => setIsCategoryFilterOpen(false)}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsReviewFormOpen(true)}
          className="bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center"
          aria-label="Write Review"
        >
          <Star className="h-6 w-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsContactOpen(true)}
          className="bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-500 transition-colors duration-200 flex items-center justify-center"
          aria-label={t('contact.title')}
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      </div>

      <Footer />

      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span>{notification.message}</span>
          </motion.div>
        )}

        {isContactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsContactOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsContactOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
              <div className="p-6">
                <ContactForm onSubmit={handleContactSubmit} />
              </div>
            </motion.div>
          </motion.div>
        )}

        {isReviewFormOpen && (
          <ReviewForm onClose={() => setIsReviewFormOpen(false)} />
        )}
      </AnimatePresence>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: 'black',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: 'black',
              },
            },
          }}
        />

    </div>
  );
}
