import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useVerifyEmailMutation,
  useResendVerificationCodeMutation,
} from "../../../store/api/authApi";
import { useTranslation } from "react-i18next";
import { ErrorResponse } from "../../../types/IUser";

export function useVerifyEmail() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendCode, { isLoading: isResending }] = useResendVerificationCodeMutation();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
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
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: ErrorResponse | unknown) {
      setError(
        (err as ErrorResponse)?.data?.message || t("verification.verificationFailed")
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
        (err as ErrorResponse)?.data?.message || t("verification.failedToResend")
      );
    }
  };

  return {
    email, setEmail,
    code, setCode,
    message,
    error,
    isVerifying,
    isResending,
    handleVerify,
    handleResendCode,
  };
}
