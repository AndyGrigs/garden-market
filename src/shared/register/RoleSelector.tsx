import { motion } from 'framer-motion';
import { t } from 'i18next';
import { Users, ShoppingCart } from 'lucide-react';

interface RoleSelectorProps {
  role: 'buyer' | 'seller';
  onRoleChange: (role: 'buyer' | 'seller') => void;
}

/*{
  "selectAccountType": {
    "uk": "Виберіть тип акаунту",
    "ru": "Выберите тип аккаунта",
    "ro": "Alegeți tipul de cont"
  },
  "buyerTitle": {
    "uk": "Покупець",
    "ru": "Покупатель",
    "ro": "Cumpărător"
  },
  "buyerDescription": {
    "uk": "Купую рослини для себе",
    "ru": "Покупаю растения для себя",
    "ro": "Cumpăr plante pentru mine"
  },
  "sellerTitle": {
    "uk": "Продавець",
    "ru": "Продавец",
    "ro": "Vânzător"
  },
  "sellerDescription": {
    "uk": "Продаю рослини на платформі",
    "ru": "Продаю растения на платформе",
    "ro": "Vând plante pe platformă"
  }
}
 */

export default function RoleSelector({ role, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        {t('seller.selectAccountType')}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Покупець */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
            role === 'buyer'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => onRoleChange('buyer')}
        >
          <div className="flex items-center space-x-3">
            <ShoppingCart className={`h-6 w-6 ${role === 'buyer' ? 'text-emerald-600' : 'text-gray-400'}`} />
            <div>
              <h3 className={`text-sm font-medium ${role === 'buyer' ? 'text-emerald-900' : 'text-gray-900'}`}>
                {t('seller.buyerTitle')}
              </h3>
              <p className={`text-xs ${role === 'buyer' ? 'text-emerald-700' : 'text-gray-500'}`}>
                {t('seller.buyerDescription')}
              </p>
            </div>
          </div>
          <input
            type="radio"
            name="role"
            value="buyer"
            checked={role === 'buyer'}
            onChange={() => onRoleChange('buyer')}
            className="absolute top-3 right-3"
          />
        </motion.div>

        {/* Продавець */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
            role === 'seller'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => onRoleChange('seller')}
        >
          <div className="flex items-center space-x-3">
            <Users className={`h-6 w-6 ${role === 'seller' ? 'text-emerald-600' : 'text-gray-400'}`} />
            <div>
              <h3 className={`text-sm font-medium ${role === 'seller' ? 'text-emerald-900' : 'text-gray-900'}`}>
                {t('seller.sellerTitle')}
              </h3>
              <p className={`text-xs ${role === 'seller' ? 'text-emerald-700' : 'text-gray-500'}`}>
                {t('seller.sellerDescription')}
              </p>
            </div>
          </div>
          <input
            type="radio"
            name="role"
            value="seller"
            checked={role === 'seller'}
            onChange={() => onRoleChange('seller')}
            className="absolute top-3 right-3"
          />
        </motion.div>
      </div>
    </div>
  );
}