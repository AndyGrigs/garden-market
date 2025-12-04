import { useState } from 'react';
import { X, CreditCard, Wallet } from 'lucide-react';
import { motion } from '@/utils/motionComponents';
import { useTranslation } from 'react-i18next';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { CartItem } from '@/types';
import { useCreateOrderMutation } from '@/store/api/orderApi';
import { useCapturePayPalPaymentMutation, useCreatePayPalOrderMutation, useCreateStripePaymentIntentMutation } from '@/store/api/paymentsApi';
import RunPayButton from './RunPayButton';
import PayNetButton from './PayNetButton';
import CardPaymentForm from './CardPaymentForm';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/store/store';

interface CheckoutModalProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'your-paypal-client-id';

export default function CheckoutModal({ items, total, onClose, onSuccess }: CheckoutModalProps) {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'runpay' | 'paynet' | 'card' | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: 'Moldova',
    postalCode: ''
  });

  const user = useAppSelector((state) => state.auth.user);
  const [createOrder] = useCreateOrderMutation();
  const [createPayPalOrder] = useCreatePayPalOrderMutation();
  const [capturePayment] = useCapturePayPalPaymentMutation();
  const [createStripeIntent] = useCreateStripePaymentIntentMutation();

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateShipping = () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      toast.error(t('checkout.fillAllFields', { defaultValue: 'Заполните все обязательные поля' }));
      return false;
    }
    return true;
  };

  // Створити замовлення перед вибором способу оплати
  const createOrderBeforePayment = async () => {
    if (!validateShipping()) return null;

    if (!user) {
      toast.error(t('checkout.loginRequired', { defaultValue: 'Необходимо войти в систему' }));
      return null;
    }

    try {
      const orderData = {
        userId: user._id,
        items: items.map(item => ({
          productId: item._id,
          productName: item.title.ru || item.title.ro || item.title.en || 'Product',
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl
        })),
        totalAmount: total,
        shippingAddress: {
          street: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode || '',
          country: shippingInfo.country
        },
        customerInfo: {
          name: shippingInfo.name,
          phone: shippingInfo.phone,
          email: user.email
        }
      };

      const order = await createOrder(orderData).unwrap();
      setOrderId(order._id);
      toast.success(t('checkout.orderCreated', { defaultValue: 'Заказ создан, выберите способ оплаты' }));
      return order._id;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(t('checkout.orderError', { defaultValue: 'Ошибка создания заказа' }));
      return null;
    }
  };

  // PayPal handlers
  const createPayPalOrderHandler = async () => {
    let currentOrderId = orderId;
    
    if (!currentOrderId) {
      currentOrderId = await createOrderBeforePayment();
      if (!currentOrderId) throw new Error('Failed to create order');
    }

    try {
      const paypalOrder = await createPayPalOrder({
        orderId: currentOrderId,
        amount: total,
        currency: 'MDL'
      }).unwrap();

      return paypalOrder.paypalOrderId;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
  };

  const onApprovePayPalHandler = async (data: { orderID: string }) => {
    try {
      await capturePayment({ paypalOrderId: data.orderID }).unwrap();
      toast.success(t('checkout.success', { defaultValue: 'Оплата успешна!' }));
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Payment capture error:', error);
      toast.error(t('checkout.paymentError', { defaultValue: 'Ошибка оплаты' }));
    }
  };

  // Обробник для RunPay/PayNet - спочатку створити замовлення
  const handleLocalPaymentMethod = async (method: 'runpay' | 'paynet') => {
    if (!orderId) {
      const newOrderId = await createOrderBeforePayment();
      if (newOrderId) {
        setPaymentMethod(method);
      }
    } else {
      setPaymentMethod(method);
    }
  };

  // Обробник для Card payment
  const handleCardPaymentMethod = async () => {
    if (!orderId) {
      const newOrderId = await createOrderBeforePayment();
      if (!newOrderId) return;
    }

    try {
      // Створюємо Stripe Payment Intent
      const result = await createStripeIntent({
        orderId: orderId!,
        amount: total,
        currency: 'EUR',
        customerInfo: {
          name: shippingInfo.name,
          email: user?.email
        }
      }).unwrap();

      if (result.success && result.clientSecret) {
        setStripeClientSecret(result.clientSecret);
        setPaymentMethod('card');
      } else {
        toast.error(t('checkout.paymentError', { defaultValue: 'Ошибка создания платежа' }));
      }
    } catch (error) {
      console.error('Stripe intent error:', error);
      toast.error(t('checkout.stripeError', { defaultValue: 'Ошибка Stripe' }));
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
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
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
                placeholder={t('checkout.name', { defaultValue: 'Полное имя' }) + ' *'}
                value={shippingInfo.name}
                onChange={(e) => handleShippingChange('name', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
              <input
                type="tel"
                placeholder={t('checkout.phone', { defaultValue: 'Телефон' }) + ' *'}
                value={shippingInfo.phone}
                onChange={(e) => handleShippingChange('phone', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder={t('checkout.address', { defaultValue: 'Адрес' }) + ' *'}
                value={shippingInfo.address}
                onChange={(e) => handleShippingChange('address', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none md:col-span-2"
                required
              />
              <input
                type="text"
                placeholder={t('checkout.city', { defaultValue: 'Город' }) + ' *'}
                value={shippingInfo.city}
                onChange={(e) => handleShippingChange('city', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder={t('checkout.postalCode', { defaultValue: 'Почтовый индекс' })}
                value={shippingInfo.postalCode}
                onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder={t('checkout.country', { defaultValue: 'Страна' })}
                value={shippingInfo.country}
                onChange={(e) => handleShippingChange('country', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none md:col-span-2"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{t('checkout.orderSummary', { defaultValue: 'Итоги заказа' })}</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.title.ru} x {item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} MDL</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>{t('cart.total', { defaultValue: 'Итого' })}:</span>
              <span>{total.toFixed(2)} MDL</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('checkout.paymentMethod', { defaultValue: 'Способ оплаты' })}</h3>
            
            {/* ⬇️ Оновлені кнопки вибору */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Wallet className="h-5 w-5" />
                <span className="font-semibold">PayPal</span>
                <span className="text-xs text-gray-500">(USD)</span>
              </button>

              {/* ⬇️ RunPay кнопка */}
              <button
                onClick={() => handleLocalPaymentMethod('runpay')}
                className={`p-3 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  paymentMethod === 'runpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Wallet className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">RunPay</span>
                <span className="text-xs text-gray-500">(MDL)</span>
              </button>

              {/* ⬇️ PayNet кнопка */}
              <button
                onClick={() => handleLocalPaymentMethod('paynet')}
                className={`p-3 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  paymentMethod === 'paynet' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold">PayNet</span>
                <span className="text-xs text-gray-500">(MDL)</span>
              </button>

              <button
                onClick={handleCardPaymentMethod}
                className={`p-3 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold">{t('checkout.card', { defaultValue: 'Карта' })}</span>
                <span className="text-xs text-gray-500">(EUR)</span>
              </button>
            </div>

            {/* Payment Buttons */}
            <div className="space-y-3">
              {/* PayPal */}
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

              {/* ⬇️ RunPay кнопка */}
              {paymentMethod === 'runpay' && orderId && (
                <div className="border-t pt-4">
                  <RunPayButton
                    orderId={orderId}
                    amount={total}
                  />
                </div>
              )}

              {/* ⬇️ PayNet кнопка */}
              {paymentMethod === 'paynet' && orderId && (
                <div className="border-t pt-4">
                  <PayNetButton
                    orderId={orderId}
                    amount={total}
                    customerInfo={{
                      name: shippingInfo.name,
                      email: user?.email
                    }}
                  />
                </div>
              )}

              {/* Card Payment */}
              {paymentMethod === 'card' && stripeClientSecret && (
                <div className="border-t pt-4">
                  <CardPaymentForm
                    clientSecret={stripeClientSecret}
                    onSuccess={() => {
                      onSuccess();
                      onClose();
                    }}
                    onError={(error) => {
                      console.error('Card payment error:', error);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}