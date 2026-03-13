import { Mail, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function VerifyEmailHeader() {
  const { t } = useTranslation();

  return (
    <>
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
    </>
  );
}
