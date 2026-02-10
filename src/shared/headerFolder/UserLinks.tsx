import { Link } from "react-router-dom";
import {  User } from "lucide-react";
import { useTranslation } from "react-i18next";



export function UserLinks() {
  const { t } = useTranslation();

  return (
    <Link
      to="/dashboard"
      className="flex items-center space-x-2 bg-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
    >
      <User className="h-6 w-6" />
      <span className="font-semibold">{t("header.dashboard")}</span>
    </Link>
  );
}