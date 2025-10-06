import { motion } from 'framer-motion';
import { Users, ShoppingCart } from 'lucide-react';

interface RoleSelectorProps {
  role: 'buyer' | 'seller';
  onRoleChange: (role: 'buyer' | 'seller') => void;
}

export default function RoleSelector({ role, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Виберіть тип акаунту
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
                Покупець
              </h3>
              <p className={`text-xs ${role === 'buyer' ? 'text-emerald-700' : 'text-gray-500'}`}>
                Купую рослини для себе
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
                Продавець
              </h3>
              <p className={`text-xs ${role === 'seller' ? 'text-emerald-700' : 'text-gray-500'}`}>
                Продаю рослини на платформі
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