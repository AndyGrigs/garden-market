import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../store/api/authApi";
import { UserPlus, Home, Users, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { ErrorResponse } from "../types/IUser";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [sellerInfo, setSellerInfo] = useState({
    nurseryName: "",
    address: "",
    phoneNumber: "",
    businessLicense: "",
    description: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { t, i18n } = useTranslation();

  const detectedLanguage = i18n.language || navigator.language.split('-')[0] || 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Валідація для продавців
    if (role === 'seller') {
      if (!sellerInfo.nurseryName.trim()) {
        setError("Назва розсадника обов'язкова для продавців");
        return;
      }
      if (!sellerInfo.phoneNumber.trim()) {
        setError("Номер телефону обов'язковий для продавців");
        return;
      }
    }

    try {
      const registerData = {
        fullName,
        email,
        password,
        language: detectedLanguage,
        role,
        ...(role === 'seller' && { sellerInfo })
      };
      console.log("📤 Відправляємо дані:", registerData);
      const result = await register(registerData).unwrap();

      setSuccess(result.message);
      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      }, 4000);
    } catch (err: ErrorResponse | unknown) {
      setError(
        (err as ErrorResponse)?.data?.message || t("auth.register.error")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={0}
        onCartClick={() => {}}
        isAuthenticated={false}
      />

      <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 right-4">
          <Link
            to="/"
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Main Page</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full space-y-8"
        >
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

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md"
              >
                {success}
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

            {/* Вибір ролі */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Виберіть тип акаунту
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Покупець */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    role === 'buyer'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setRole('buyer')}
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className={`h-6 w-6 ${role === 'buyer' ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <div>
                      <h3 className={`text-sm font-medium ${role === 'buyer' ? 'text-emerald-900' : 'text-gray-900'}`}>
                        Покупець
                      </h3>
                      <p className={`text-xs ${role === 'buyer' ? 'text-emerald-700' : 'text-gray-500'}`}>
                        Купую рослини для себе
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={role === 'buyer'}
                    onChange={() => setRole('buyer')}
                    className="absolute top-3 right-3"
                  />
                </motion.div>

                {/* Продавець */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    role === 'seller'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setRole('seller')}
                >
                  <div className="flex items-center space-x-3">
                    <Users className={`h-6 w-6 ${role === 'seller' ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <div>
                      <h3 className={`text-sm font-medium ${role === 'seller' ? 'text-emerald-900' : 'text-gray-900'}`}>
                        Продавець
                      </h3>
                      <p className={`text-xs ${role === 'seller' ? 'text-emerald-700' : 'text-gray-500'}`}>
                        Продаю рослини на платформі
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={role === 'seller'}
                    onChange={() => setRole('seller')}
                    className="absolute top-3 right-3"
                  />
                </motion.div>
              </div>
            </div>

            {/* Основні поля */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t("auth.register.name")}
                </label>
                <input
                  id="name"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={t("auth.register.name")}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t("auth.register.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={t("auth.register.email")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t("auth.register.password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t("auth.register.password")}
              />
            </div>

            {/* Додаткові поля для продавців */}
            {role === 'seller' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 border-t pt-6"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  Інформація про продавця
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Назва розсадника *
                    </label>
                    <input
                      type="text"
                      required={role === 'seller'}
                      value={sellerInfo.nurseryName}
                      onChange={(e) => setSellerInfo({...sellerInfo, nurseryName: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Наприклад: Зелений Світ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      required={role === 'seller'}
                      value={sellerInfo.phoneNumber}
                      onChange={(e) => setSellerInfo({...sellerInfo, phoneNumber: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="+380XXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Адреса
                  </label>
                  <input
                    type="text"
                    value={sellerInfo.address}
                    onChange={(e) => setSellerInfo({...sellerInfo, address: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Місто, вулиця, будинок"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Номер ліцензії
                  </label>
                  <input
                    type="text"
                    value={sellerInfo.businessLicense}
                    onChange={(e) => setSellerInfo({...sellerInfo, businessLicense: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Необов'язково"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Опис діяльності
                  </label>
                  <textarea
                    rows={3}
                    value={sellerInfo.description}
                    onChange={(e) => setSellerInfo({...sellerInfo, description: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Розкажіть про свій бізнес..."
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700">
                    Ваш акаунт продавця буде перевірений адміністратором протягом 24 годин.
                  </p>
                </div>
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {isLoading ? (
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
                  t("auth.register.submit")
                )}
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}