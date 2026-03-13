import { motion } from '@/utils/motionComponents';
import TermsModal from '../../shared/ui/TermsModal';
import { useRegister } from './hooks/useRegister';
import RegisterHeader from './components/RegisterHeader';
import RegisterForm from './components/RegisterForm';

export default function Register() {
  const {
    fullName, setFullName,
    email, setEmail,
    password, setPassword,
    role, setRole,
    sellerInfo, setSellerInfo,
    error,
    success,
    termsAccepted, setTermsAccepted,
    showTermsModal, setShowTermsModal,
    isLoading,
    handleSubmit,
  } = useRegister();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full space-y-8"
        >
          <RegisterHeader />

          <RegisterForm
            fullName={fullName}
            email={email}
            password={password}
            role={role}
            sellerInfo={sellerInfo}
            error={error}
            success={success}
            termsAccepted={termsAccepted}
            isLoading={isLoading}
            onFullNameChange={setFullName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onRoleChange={setRole}
            onSellerInfoChange={setSellerInfo}
            onTermsChange={setTermsAccepted}
            onOpenTermsModal={() => setShowTermsModal(true)}
            onSubmit={handleSubmit}
          />
        </motion.div>
      </div>

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setShowTermsModal(false);
        }}
      />
    </div>
  );
}
