import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../store/api/authApi";
import { setUser} from "../store/slices/authSlice";
import { LogIn, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { t } = useTranslation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setUser(result.user));
      navigate(from, { replace: true });
    } catch (err) {
      setError(t("auth.login.error"));
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
            <LogIn className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t("auth.login.title")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t("auth.login.register")}{" "}
              <Link
                to="/register"
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                {t("auth.register.title")}
              </Link>
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link
              to="/"
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Main Page</span>
            </Link>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  {t("auth.login.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder={t("auth.login.email")}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  {t("auth.login.password")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder={t("auth.login.password")}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {isLoading ? t("auth.login.loading") : t("auth.login.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}