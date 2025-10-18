import { CartItem } from '@/types';
import { useCreateOrderMutation } from '../../store/api/orderApi';
import {
  useCapturePayPalPaymentMutation,
  useCreatePayPalOrderMutation,
} from '../../store/api/paymentsApi';
import toast from 'react-hot-toast';
import { CreditCard, Wallet, X } from 'lucide-react';
import { motion} from 'framer-motion';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';


interface CheckoutModalProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PAYPAL_CLIENT_ID =
  import.meta.env.VITE_PAYPAL_CLIENT_ID || 'your-paypal-client-id';

const CheckoutModal = ({
  items,
  total,
  onClose,
  onSuccess,
}: CheckoutModalProps) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card' | null>(
    null
  );
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: 'Moldova',
    postalCode: '',
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const [createOrder] = useCreateOrderMutation();
  const [createPayPalOrder] = useCreatePayPalOrderMutation();
  const [capturePayment] = useCapturePayPalPaymentMutation();

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateShipping = () => {
    if (
      !shippingInfo.name ||
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
    return true;
  };

  // PayPal integration
  const createPayPalOrderHandler = async (): Promise<string> => {
    if (!validateShipping()) {
      throw new Error('Validation failed');
    }

    try {
      // 1. Створюємо замовлення в нашій БД
      const orderData = {
        userId: user?._id,
        items: items.map((item) => ({
          productId: item._id,
          productName: item.title.ru || item.title.ro,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl,
        })),
        totalAmount: total,
        shippingAddress: {
          street: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          country: shippingInfo.country,
        },
      };

      const order = await createOrder(orderData).unwrap();

      // 2. Створюємо PayPal замовлення
      const paypalOrder = await createPayPalOrder({
        orderId: order._id,
        amount: total,
        currency: 'MDL',
      }).unwrap();

      return paypalOrder.paypalOrderId;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(
        t('checkout.orderError', {
          defaultValue: 'Ошибка создания заказа',
        })
      );
      throw error;
    }
  };

  const onApprovePayPalHandler = async (data: { orderID: string }) => {
    try {
      // Захоплюємо платіж після підтвердження користувачем
      await capturePayment({ paypalOrderId: data.orderID }).unwrap();

      toast.success(t('checkout.success', { defaultValue: 'Оплата успешна!' }));
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Payment capture error:', error);
      toast.error(
        t('checkout.paymentError', { defaultValue: 'Ошибка оплаты' })
      );
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
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">{t('checkout.title', { defaultValue: 'Оформление заказа' })}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Shipping Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('checkout.shippingInfo', { defaultValue: 'Информация о доставке' })}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t('checkout.name', { defaultValue: 'Полное имя' })}
                value={shippingInfo.name}
                onChange={(e) => handleShippingChange('name', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                type="tel"
                placeholder={t('checkout.phone', { defaultValue: 'Телефон' })}
                value={shippingInfo.phone}
                onChange={(e) => handleShippingChange('phone', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                type="text"
                placeholder={t('checkout.address', { defaultValue: 'Адрес' })}
                value={shippingInfo.address}
                onChange={(e) => handleShippingChange('address', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                type="text"
                placeholder={t('checkout.city', { defaultValue: 'Город' })}
                value={shippingInfo.city}
                onChange={(e) => handleShippingChange('city', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{t('checkout.orderSummary', { defaultValue: 'Итоги заказа' })}</h3>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.title.ru} x {item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} MDL</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>{t('cart.total')}:</span>
                <span>{total.toFixed(2)} MDL</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('checkout.paymentMethod', { defaultValue: 'Способ оплаты' })}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Wallet className="h-6 w-6" />
                <span className="font-semibold">PayPal</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="h-6 w-6" />
                <span className="font-semibold">{t('checkout.card', { defaultValue: 'Карта' })}</span>
              </button>
            </div>
          </div>

          {/* PayPal Buttons */}
          {paymentMethod === 'paypal' && (
            <div className="border-t pt-4">
              <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
                <PayPalButtons
                  createOrder={createPayPalOrderHandler}
                  onApprove={onApprovePayPalHandler}
                  onError={(err) => {
                    console.error('PayPal error:', err);
                    toast.error(t('checkout.paypalError', { defaultValue: 'Ошибка PayPal' }));
                  }}
                  style={{ layout: 'vertical' }}
                />
              </PayPalScriptProvider>
            </div>
          )}

          {/* Card Payment (placeholder) */}
          {paymentMethod === 'card' && (
            <div className="border-t pt-4">
              <p className="text-gray-600 text-center">
                {t('checkout.cardComingSoon', { defaultValue: 'Оплата картой будет доступна в ближайшее время' })}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckoutModal;
