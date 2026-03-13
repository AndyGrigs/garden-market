import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "@/utils/motionComponents";

interface VerifyEmailFormProps {
  email: string;
  code: string;
  message: string;
  error: string;
  isVerifying: boolean;
  isResending: boolean;
  onEmailChange: (v: string) => void;
  onCodeChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
}

export default function VerifyEmailForm({
  email, code, message, error,
  isVerifying, isResending,
  onEmailChange, onCodeChange,
  onSubmit, onResend,
}: VerifyEmailFormProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-8"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md"
          >
            {message}
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

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {t("verification.emailAddress")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder={t("verification.emailPlaceholder")}
          />
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            {t("verification.code")}
          </label>
          <input
            id="code"
            name="code"
            type="text"
            required
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-lg font-mono tracking-widest"
            placeholder={t("verification.codePlaceholder")}
            maxLength={3}
            pattern="[0-9]{3}"
          />
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-5 w-5 border-b-2 border-white"
              />
            ) : (
              t("verification.verify")
            )}
          </button>

          <button
            type="button"
            onClick={onResend}
            disabled={isResending}
            className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-4 w-4 border-b-2 border-gray-600"
              />
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>{t("verification.resend")}</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {t("verification.alreadyVerified")}{" "}
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
            {t("verification.signInHere")}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
