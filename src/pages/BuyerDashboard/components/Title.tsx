import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface TitleProps{
    name: string;
}

export default function Title({ name }: TitleProps) {
    const {t} = useTranslation();
  return (
    <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("dashboard.welcome", { name })}
            </h1>
            <Link
              to="/"
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>{t("dashboard.mainPage")}</span>
            </Link>
          </div>
  );
}