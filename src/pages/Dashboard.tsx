import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { RootState } from "../store/store";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";

export default function Dashboard() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("dashboard.welcome", { name: user.fullName })}
            </h1>
            <Link
              to="/"
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Main Page</span>
            </Link>
          </div>

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