import { useState } from 'react';
import toast from 'react-hot-toast';
import { Wallet, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from '@/utils/motionComponents';
import { useCreateRunPayPaymentMutation } from '@/store/api/paymentsApi';
import { CURRENCY } from '@/config';

interface RunPayButtonProps {
  orderId: string;
  amount: number;
  disabled?: boolean;
}

export default function RunPayButton({ orderId, amount, disabled }: RunPayButtonProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [createRunPayPayment] = useCreateRunPayPaymentMutation();

  const handleRunPayPayment = async () => {
    setIsProcessing(true);
    
    try {
      const result = await createRunPayPayment({
        orderId,
        amount,
        currency: {CURRENCY}
      }).unwrap();

      if (result.success && result.paymentUrl) {
        // Відкриваємо RunPay в новому вікні
        window.open(result.paymentUrl, '_blank');
        
        if (result.message) {
          toast.custom(result.message);
        }
      } else {
        toast.error(t('checkout.paymentError', { defaultValue: 'Ошибка создания платежа' }));
      }
    } catch (error) {
      console.error('RunPay error:', error);
      toast.error(t('checkout.runpayError', { defaultValue: 'Ошибка RunPay' }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={handleRunPayPayment}
      disabled={disabled || isProcessing}
      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-3 hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t('checkout.processing', { defaultValue: 'Обработка...' })}</span>
        </>
      ) : (
        <>
          <Wallet className="h-5 w-5" />
          <span>{t('checkout.payWithRunPay', { defaultValue: 'Оплатить через RunPay' })}</span>
        </>
      )}
    </motion.button>
  );
}