import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation, useForgotPasswordMutation } from "../../../store/api/authApi";
import { useTranslation } from "react-i18next";
import { setUser } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
  const { t } = useTranslation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login({ email, password }).unwrap();

      if (result.user) {
        dispatch(setUser(result.user));
        toast.success(t("auth.login.success", { defaultValue: "Successfully logged in!" }));
        navigate(from, { replace: true });
      }
    } catch {
      const errorMessage = t("auth.login.error");
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setForgotMessage("");

    try {
      const result = await forgotPassword({ email: forgotEmail }).unwrap();
      setForgotMessage(result.message);
      toast.success(result.message);

      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(forgotEmail)}`);
      }, 2000);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err instanceof Error
          ? err.message
          : t("auth.resetPassword.error", { defaultValue: "Failed to send reset code. Please try again." }));
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setError("");
    setForgotMessage("");
  };

  return {
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
  };
}
