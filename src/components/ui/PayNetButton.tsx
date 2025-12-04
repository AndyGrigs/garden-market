import { useState, useRef } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from '@/utils/motionComponents';
import toast from 'react-hot-toast';
import { useCreatePayNetPaymentMutation } from '@/store/api/paymentsApi';

interface PayNetButtonProps {
  orderId: string;
  amount: number;
  customerInfo: {
    name: string;
    email?: string;
  };
  disabled?: boolean;
}

export default function PayNetButton({ orderId, amount, customerInfo, disabled }: PayNetButtonProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [createPayNetPayment] = useCreatePayNetPaymentMutation();
  const formRef = useRef<HTMLDivElement>(null);

  const handlePayNetPayment = async () => {
    setIsProcessing(true);
    
    try {
      const result = await createPayNetPayment({
        orderId,
        amount,
        customerInfo
      }).unwrap();

      if (result.success && result.paymentForm) {
        // Створюємо тимчасовий div для форми
        const formContainer = document.createElement('div');
        formContainer.innerHTML = result.paymentForm;
        document.body.appendChild(formContainer);
        
        // Автоматично сабмітимо форму (вона редіректить на PayNet)
        const form = formContainer.querySelector('form');
        if (form) {
          form.submit();
        }
        
        if (result.message) {
          toast.custom(result.message);
        }
      } else {
        toast.error(t('checkout.paymentError', { defaultValue: 'Ошибка создания платежа' }));
      }
    } catch (error) {
      console.error('PayNet error:', error);
      toast.error(t('checkout.paynetError', { defaultValue: 'Ошибка PayNet' }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={handlePayNetPayment}
        disabled={disabled || isProcessing}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-3 hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t('checkout.processing', { defaultValue: 'Обработка...' })}</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>{t('checkout.payWithPayNet', { defaultValue: 'Оплатить через PayNet' })}</span>
          </>
        )}
      </motion.button>
      <div ref={formRef} style={{ display: 'none' }} />
    </>
  );
}