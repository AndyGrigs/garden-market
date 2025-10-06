import { motion } from 'framer-motion';

interface SellerInfo {
  nurseryName: string;
  address: string;
  phoneNumber: string;
  businessLicense: string;
  description: string;
}

interface SellerInfoFieldsProps {
  sellerInfo: SellerInfo;
  onSellerInfoChange: (info: SellerInfo) => void;
}

export default function SellerInfoFields({ sellerInfo, onSellerInfoChange }: SellerInfoFieldsProps) {
  const updateField = (field: keyof SellerInfo, value: string) => {
    onSellerInfoChange({ ...sellerInfo, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4 border-t pt-6"
    >
      <h3 className="text-lg font-medium text-gray-900">
        Інформація про продавця
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Назва розсадника *
          </label>
          <input
            type="text"
            required
            value={sellerInfo.nurseryName}
            onChange={(e) => updateField('nurseryName', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Наприклад: Зелений Світ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Телефон *
          </label>
          <input
            type="tel"
            required
            value={sellerInfo.phoneNumber}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="+380XXXXXXXXX"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Адреса
        </label>
        <input
          type="text"
          value={sellerInfo.address}
          onChange={(e) => updateField('address', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Місто, вулиця, будинок"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Номер ліцензії
        </label>
        <input
          type="text"
          value={sellerInfo.businessLicense}
          onChange={(e) => updateField('businessLicense', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Необов'язково"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Опис діяльності
        </label>
        <textarea
          rows={3}
          value={sellerInfo.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Розкажіть про свій бізнес..."
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          Ваш акаунт продавця буде перевірений адміністратором протягом 24 годин.
        </p>
      </div>
    </motion.div>
  );
}