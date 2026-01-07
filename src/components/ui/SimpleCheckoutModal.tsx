import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartItem } from '../../types';
import { useAppSelector } from '../../store/store';
import toast from 'react-hot-toast';
import { useCreateOrderMutation } from '@/store/api/orderApi';
import { Loader2, Mail, X } from 'lucide-react';
import { motion } from 'framer-motion';
interface SimpleCheckoutModalProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}
const SimpleCheckoutModal = ({
  items,
  total,
  onClose,
  onSuccess,
}: SimpleCheckoutModalProps) => {
  const { t, i18n } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const [createOrder, {isLoading}] = useCreateOrderMutation();
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'Moldova',
    postalCode: '',
  });

  const [customerNotes, setCustomerNotes] = useState('');

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (
      !shippingInfo.name ||
      !shippingInfo.email ||
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.city
    ) {
      toast.error(
        t('checkout.fillAllFields', {
          defaultValue: 'Заполните все обязательные поля',
        })
      );
      return false;
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error(
        t('checkout.invalidEmail', { defaultValue: 'Неверный email' })
      );
      return false;
    }

    return false;
  };

  const handleSubmit = async () => {
    if (!validateForm) return;
    try {
      const orderData = {
        userId: user?._id,
        items: items.map((item) => ({
          treeId: item._id,
          title:
            item.title[i18n.language as keyof typeof item.title] ||
            item.title.ru,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
        shippingAddress: shippingInfo,
        customerNotes,
        language: i18n.language,
      };

      const result = await createOrder(orderData).unwrap();

      if (result.success) {
        toast.success(
          result.message ||
            t('checkout.success', {
              defaultValue: 'Заказ создан! Проверьте email.',
            })
        );
        onSuccess();
        onClose();
      }
    } catch (error: unknown) {
      console.error('Order creation error:', error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        t('checkout.orderError', {
          defaultValue: 'Ошибка создания заказа',
        });
      toast.error(errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/*Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">
            {t('checkout.title', { defaultValue: 'Оформление заказа' })}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {/*Content*/}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
            <h3 className="font-semibold mb-3 text-emerald-800">
              {t('checkout.orderSummary', { defaultValue: 'Ваш заказ' })}
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.title[i18n.language as 'ru' | 'ro'] || item.title.ru}{' '}
                    × {item.quantity}
                  </span>
                  <span className="font-medium text-emerald-700">
                    {(item.price * item.quantity).toFixed(2)} MDL
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-emerald-300 mt-3 pt-3 flex justify-between">
              <span className="font-bold text-emerald-900">
                {t('cart.total')}:
              </span>
              <span className="font-bold text-xl text-emerald-700">
                {total.toFixed(2)} MDL
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('checkout.shippingInfo', {
                defaultValue: 'Информация о доставке',
              })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={
                  t('checkout.name', { defaultValue: "Имя" }) + ' *'
                }
                value={shippingInfo.name}
                onChange={(e) => handleShippingChange('name', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
              <input
                type="email"
                placeholder={
                  t('checkout.email', { defaultValue: 'Email' }) + ' *'
                }
                value={shippingInfo.email}
                onChange={(e) => handleShippingChange('email', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
              <input
                type="tel"
                placeholder={
                  t('checkout.phone', { defaultValue: 'Телефон' }) + ' *'
                }
                value={shippingInfo.phone}
                onChange={(e) => handleShippingChange('phone', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
              <input
                type="text"
                placeholder={
                  t('checkout.city', { defaultValue: 'Город' }) + ' *'
                }
                value={shippingInfo.city}
                onChange={(e) => handleShippingChange('city', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
              <input
                type="text"
                placeholder={
                  t('checkout.address', { defaultValue: 'Адрес' }) + ' *'
                }
                value={shippingInfo.address}
                onChange={(e) =>
                  handleShippingChange('address', e.target.value)
                }
                className="col-span-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Customer Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('checkout.notes', { defaultValue: 'Комментарий к заказу' })}
            </label>
            <textarea
              placeholder={t('checkout.notesPlaceholder', {
                defaultValue: 'Дополнительные пожелания...',
              })}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          {/* Payment Info Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  {t('checkout.paymentNoticeTitle', {
                    defaultValue: '📧 Счет на email',
                  })}
                </h4>
                <p className="text-sm text-blue-800">
                  {t('checkout.paymentNotice', {
                    defaultValue:
                      'После оформления заказа, на вашу почту будет отправлен счет для оплаты со всеми реквизитами.',
                  })}
                </p>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-3 hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>
                  {t('checkout.processing', { defaultValue: 'Обраблотка...' })}
                </span>
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                <span>
                  {t('checkout.placeOrder', {
                    defaultValue: 'Оформить заказ',
                  })}
                </span>
              </>
            )}
          </motion.button>
          <p className="text-xs text-gray-500 text-center">
            {t('checkout.agreement', {
              defaultValue:
                'Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных',
            })}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SimpleCheckoutModal;
