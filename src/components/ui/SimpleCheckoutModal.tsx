import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartItem } from '../../types';
import { useAppSelector } from '../../store/store';
import toast from 'react-hot-toast';
import { useCreateOrderMutation } from '@/store/api/orderApi';
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
  const [createOrder, {loading}] = useCreateOrderMutation();
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
          title: item.title,
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
        toast.success(result.message || t('checkout.success', { 
          defaultValue: 'Замовлення створено! Перевірте email.' 
        }));
        onSuccess();
        onClose();
      }
    } catch (error: unknown) {
      console.error('Order creation error:', error);
      toast.error(error?.data?.message || t('checkout.orderError', { 
        defaultValue: 'Помилка створення замовлення' 
      }));
    }
  };

  return <div>SimpleCheckoutModal</div>;
};

export default SimpleCheckoutModal;
