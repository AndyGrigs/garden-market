import { motion } from "@/utils/motionComponents";
import { useVerifyEmail } from "./hooks/useVerifyEmail";
import VerifyEmailHeader from "./components/VerifyEmailHeader";
import VerifyEmailForm from "./components/VerifyEmailForm";

export default function VerifyEmail() {
  const {
    email, setEmail,
    code, setCode,
    message,
    error,
    isVerifying,
    isResending,
    handleVerify,
    handleResendCode,
  } = useVerifyEmail();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <VerifyEmailHeader />

        <VerifyEmailForm
          email={email}
          code={code}
          message={message}
          error={error}
          isVerifying={isVerifying}
          isResending={isResending}
          onEmailChange={setEmail}
          onCodeChange={setCode}
          onSubmit={handleVerify}
          onResend={handleResendCode}
        />
      </motion.div>
    </div>
  );
}
