import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartItem } from '../../types';
import { useAppSelector } from '../../store/store';
import toast from 'react-hot-toast';
import { useCreateOrderMutation } from '@/store/api/orderApi';
import { X } from 'lucide-react';
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
  const [createOrder, { loading }] = useCreateOrderMutation();
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
          defaultValue: 'Заполните все обязятельньіе поля',
        })
      );
      return false;
    }

    // Валідація email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error(
        t('checkout.invalidEmail', { defaultValue: 'Невірний email' })
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
      toast.error(
        error?.data?.message ||
          t('checkout.orderError', {
            defaultValue: 'Ошибка создания заказа',
          })
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
    </motion.div>
  );
};

export default SimpleCheckoutModal;
