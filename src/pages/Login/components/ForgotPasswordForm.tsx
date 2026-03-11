import { useTranslation } from "react-i18next";
import { motion } from "@/utils/motionComponents";

interface ForgotPasswordFormProps {
  forgotEmail: string;
  error: string;
  forgotMessage: string;
  isForgotLoading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export default function ForgotPasswordForm({
  forgotEmail,
  error,
  forgotMessage,
  isForgotLoading,
  onEmailChange,
  onSubmit,
  onBack,
}: ForgotPasswordFormProps) {
  const { t } = useTranslation();

  return (
    <motion.form
      key="forgot"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="mt-8 space-y-6"
      onSubmit={onSubmit}
    >
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("auth.resetPassword.title")}
        </h3>
        <p className="text-sm text-gray-600">
          {t("auth.resetPassword.subtitle")}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {forgotMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {forgotMessage}
        </div>
      )}

      <div>
        <label htmlFor="forgot-email" className="sr-only">
          {t("auth.login.email")}
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          required
          value={forgotEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
          placeholder={t("auth.login.email")}
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={isForgotLoading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          {isForgotLoading ? t("auth.resetPassword.sending") : t("auth.resetPassword.submit")}
        </button>
      </div>
    </motion.form>
  );
}
