import { motion } from '@/utils/motionComponents';
import { t } from 'i18next';

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

export default function SellerInfoFields({
  sellerInfo,
  onSellerInfoChange,
}: SellerInfoFieldsProps) {
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
        {t('seller.sellerInfoTitle')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('seller.nurseryNameLabel')}
          </label>
          <input
            type="text"
            required
            value={sellerInfo.nurseryName}
            onChange={(e) => updateField('nurseryName', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder={t('seller.nurseryNamePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('seller.phoneLabel')}
          </label>
          <input
            type="tel"
            required
            value={sellerInfo.phoneNumber}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder={t('seller.phonePlaceholder')}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('seller.addressLabel')}
        </label>
        <input
          type="text"
          value={sellerInfo.address}
          onChange={(e) => updateField('address', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder={t('seller.addressPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('seller.licenseLabel')}
        </label>
        <input
          type="text"
          value={sellerInfo.businessLicense}
          onChange={(e) => updateField('businessLicense', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder={t('seller.licensePlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('seller.descriptionLabel')}
        </label>
        <textarea
          rows={3}
          value={sellerInfo.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder={t('seller.descriptionPlaceholder')}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          {t('seller.verificationNotice')}
        </p>
      </div>
    </motion.div>
  );
}
