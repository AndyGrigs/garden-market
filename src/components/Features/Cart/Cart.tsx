import { X, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { CartItem } from "@/types";
import { useLanguage } from "@/hooks/useLanguage";
import { BASE_URL } from "@/config";


interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function Cart({
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [, setIsExiting] = useState(false);
  
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const getTreeTitle = (title: { [key: string]: string }) => {
    return title?.[lang] || title?.en || title?.ru || "Unknown";
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(), 300); // Fallback in case animation doesn't complete
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const isEmpty = items.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-md h-full flex flex-col"
      >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">{t("cart.title")}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {isEmpty ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 text-lg">{t("cart.empty")}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                >
                  <img
                    src={item.imageUrl ? `${BASE_URL}${item.imageUrl}` : "/placeholder.jpg"}
                    alt={getTreeTitle(item.title)}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{getTreeTitle(item.title)}</h3>
                    <p className="text-emerald-600 font-bold">
                      ₴{item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          onUpdateQuantity(item._id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </motion.button>
                      <span className="min-w-[2rem] text-center">{item.quantity}</span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          onUpdateQuantity(item._id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRemoveItem(item._id)}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>{t("cart.total")}:</span>
                  <span>₴{total.toFixed(2)}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onCheckout}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-500 transition-colors"
                >
                  {t("cart.checkout")}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
  );
}