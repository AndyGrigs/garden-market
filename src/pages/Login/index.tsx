import { AnimatePresence } from "@/utils/motionComponents";
import { useLogin } from "./hooks/useLogin";
import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

export default function Login() {
  const {
    email, setEmail,
    password, setPassword,
    error,
    showForgotPassword, setShowForgotPassword,
    forgotEmail, setForgotEmail,
    forgotMessage,
    isLoading,
    isForgotLoading,
    handleSubmit,
    handleForgotPassword,
    handleBackToLogin,
  } = useLogin();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <LoginHeader />

          <AnimatePresence mode="wait">
            {!showForgotPassword ? (
              <LoginForm
                email={email}
                password={password}
                error={error}
                isLoading={isLoading}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleSubmit}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
            ) : (
              <ForgotPasswordForm
                forgotEmail={forgotEmail}
                error={error}
                forgotMessage={forgotMessage}
                isForgotLoading={isForgotLoading}
                onEmailChange={setForgotEmail}
                onSubmit={handleForgotPassword}
                onBack={handleBackToLogin}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
