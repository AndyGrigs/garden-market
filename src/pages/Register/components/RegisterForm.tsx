import { useTranslation } from 'react-i18next';
import { motion } from '@/utils/motionComponents';
import RoleSelector from '../../../shared/register/RoleSelector';
import BasicInfoFields from '../../../shared/register/BasicInfoFields';
import SellerInfoFields from '../../../shared/register/SellerInfoFields';
import TermsCheckbox from '../../../shared/register/TermsCheckbox';

interface SellerInfo {
  nurseryName: string;
  address: string;
  phoneNumber: string;
  businessLicense: string;
  description: string;
}

interface RegisterFormProps {
  fullName: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
  sellerInfo: SellerInfo;
  error: string;
  success: string;
  termsAccepted: boolean;
  isLoading: boolean;
  onFullNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onRoleChange: (v: 'buyer' | 'seller') => void;
  onSellerInfoChange: (v: SellerInfo) => void;
  onTermsChange: (v: boolean) => void;
  onOpenTermsModal: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterForm({
  fullName, email, password, role, sellerInfo,
  error, success, termsAccepted, isLoading,
  onFullNameChange, onEmailChange, onPasswordChange,
  onRoleChange, onSellerInfoChange, onTermsChange,
  onOpenTermsModal, onSubmit,
}: RegisterFormProps) {
  const { t } = useTranslation();

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mt-8 space-y-6"
      onSubmit={onSubmit}
    >
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md"
        >
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
        >
          {error}
        </motion.div>
      )}

      <RoleSelector role={role} onRoleChange={onRoleChange} />

      <BasicInfoFields
        fullName={fullName}
        email={email}
        password={password}
        onFullNameChange={onFullNameChange}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
      />

      {role === 'seller' && (
        <SellerInfoFields
          sellerInfo={sellerInfo}
          onSellerInfoChange={onSellerInfoChange}
        />
      )}

      <TermsCheckbox
        checked={termsAccepted}
        onCheckChange={onTermsChange}
        onOpenModal={onOpenTermsModal}
      />

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="rounded-full h-5 w-5 border-b-2 border-white"
            />
          ) : (
            t('auth.register.submit')
          )}
        </button>
      </div>
    </motion.form>
  );
}
