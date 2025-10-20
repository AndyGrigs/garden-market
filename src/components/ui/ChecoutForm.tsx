import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { CartItem } from '@/types';
import { RootState } from '@/store/store';
import { useCreateOrderMutation } from '@/store/api/orderApi';
import { useGetSavedAddressQuery } from '@/store/api/authApi';

interface CheckoutFormProps {
  items: CartItem[];
  totalAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutForm({ items, totalAmount, onClose, onSuccess }: CheckoutFormProps) {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { data: savedAddressData } = useGetSavedAddressQuery();

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });

  // Автоматично підтягуємо збережену адресу
  useEffect(() => {
    if (savedAddressData?.savedAddress) {
      setFormData(savedAddressData.savedAddress);
    }
  }, [savedAddressData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error(t('checkout.loginRequired'));
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          productId: item._id,
          productName: item.title?.ru || item.title?.ro || 'Product',
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl
        })),
        totalAmount,
        shippingAddress: formData
      };

      await createOrder(orderData).unwrap();
      toast.success(t('checkout.success'));
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error(t('checkout.error'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{t('checkout.title')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('checkout.street')}
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('checkout.city')}
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('checkout.postalCode')}
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('checkout.country')}
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>{t('cart.total')}:</span>
                <span>{totalAmount.toFixed(2)} MDL</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? t('checkout.processing') : t('checkout.confirmOrder')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}