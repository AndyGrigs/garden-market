import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useVerifyEmailMutation,
  useResendVerificationCodeMutation,
} from "../store/api/authApi";
import { Home, Mail, RefreshCw } from "lucide-react";
import { motion } from '@/utils/motionComponents';
import { ErrorResponse } from "../types/IUser";
import { useTranslation } from "react-i18next";

const VerifyEmail = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendCode, { isLoading: isResending }] =
    useResendVerificationCodeMutation();

  

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !code) {
      setError(t("verification.enterBothFields"));
      return;
    }

    try {
      const response = await verifyEmail({ email, code }).unwrap();
      setMessage(response.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: ErrorResponse | unknown) {
      setError(
        (err as ErrorResponse)?.data?.message ||
          t("verification.verificationFailed")
      );
    }
  };

  const handleResendCode = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError(t("verification.enterEmailAddress"));
      return;
    }

    try {
      const response = await resendCode({ email }).unwrap();
      setMessage(response.message);
    } catch (err: ErrorResponse | unknown) {
      setError(
        (err as ErrorResponse)?.data?.message ||
          t("verification.failedToResend")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-emerald-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t("verification.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("verification.subtitle")}
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            to="/"
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>{t("verification.mainPage")}</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <form onSubmit={handleVerify} className="space-y-6">
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("verification.emailAddress")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t("verification.emailPlaceholder")}
              />
            </div>

            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("verification.code")}
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
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
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                   }}
                    className="rounded-full h-5 w-5 border-b-2 border-white"
                  />
                ) : (
                  t("verification.verify")
                )}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
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
              <Link
                to="/login"
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                {t("verification.signInHere")}
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
