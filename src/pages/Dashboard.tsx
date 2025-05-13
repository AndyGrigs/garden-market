import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

export default function Dashboard() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => !!state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={0}
        onCartClick={() => {}}
        isAuthenticated={isAuthenticated}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t("dashboard.welcome", { name: user.fullName })}
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("dashboard.profile")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  {t("dashboard.name")}
                </label>
                <p className="mt-1 text-gray-900">{user.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  {t("dashboard.email")}
                </label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("dashboard.orderHistory")}
            </h2>
            <div className="text-gray-600">{t("dashboard.noOrders")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
