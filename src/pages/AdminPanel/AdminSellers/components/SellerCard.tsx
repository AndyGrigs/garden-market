import { PendingSeller } from '@/store/api/adminApi';
import {
  Building2,
  User,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from './ActionButton';

interface SellerCardProps {
  seller: PendingSeller;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  isProcessing: boolean;
}

const SellerCard = ({
  seller,
  onApprove,
  onReject,
  isProcessing,
}: SellerCardProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/*Header*/}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {seller.fullName}
          </h3>
        </div>
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          <p>{seller.email}</p>

          {seller.sellerInfo?.nurseryName && (
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{seller.sellerInfo.nurseryName}</span>
            </div>
          )}

          {/*Expanded details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              {seller.sellerInfo?.phoneNumber && (
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700">
                      {t('admin.sellers.phone')}:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {seller.sellerInfo.phoneNumber}
                    </span>
                  </div>
                </div>
              )}

              {seller.sellerInfo?.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700">
                      {t('admin.sellers.address')}:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {seller.sellerInfo.address}
                    </span>
                  </div>
                </div>
              )}

              {seller.sellerInfo?.businessLicense && (
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700">
                      {t('admin.sellers.license')}:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {seller.sellerInfo.businessLicense}
                    </span>
                  </div>
                </div>
              )}

              {seller.sellerInfo?.description && (
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700">
                      {t('admin.sellers.description')}:
                    </span>
                    <p className="mt-1 text-gray-600">
                      {seller.sellerInfo.description}
                    </p>
                  </div>
                </div>
              )}

              {seller.sellerInfo?.registrationDate && (
                <div className="text-sm text-gray-500">
                  {t('admin.sellers.registered')}:{' '}
                  {new Date(
                    seller.sellerInfo.registrationDate
                  ).toLocaleDateString()}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <ActionButton
                  onClick={() => onApprove(seller.id)}
                  disabled={isProcessing}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('admin.sellers.approve')}</span>
                </ActionButton>

                <ActionButton
                  onClick={() => onReject(seller.id)}
                  disabled={isProcessing}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{t('admin.sellers.reject')}</span>
                </ActionButton>

                <ActionButton
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                >
                  {isExpanded
                    ? t('admin.sellers.showLess')
                    : t('admin.sellers.showMore')}
                </ActionButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerCard;
