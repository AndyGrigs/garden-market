import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../store/api/authApi";
import { setCredentials } from "../store/slices/authSlice";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await register({ fullName, email, password }).unwrap();
      dispatch(setCredentials(result));
      navigate("/", { replace: true });
    } catch (err) {
      setError(t("auth.register.error"));
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={0}
        onCartClick={() => {}}
        isAuthenticated={false}
      />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t("auth.register.title")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t("auth.register.login")}{" "}
              <Link
                to="/login"
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                {t("auth.login.title")}
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  {t("auth.register.name")}
                </label>
                <input
                  id="name"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder={t("auth.register.name")}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  {t("auth.register.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder={t("auth.register.email")}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  {t("auth.register.password")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder={t("auth.register.password")}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {isLoading
                  ? t("auth.register.loading")
                  : t("auth.register.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
