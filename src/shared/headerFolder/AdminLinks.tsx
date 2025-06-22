import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AdminLink() {
  const { t } = useTranslation();

  return (
    <Link
      to="/admin"
      className="flex items-center space-x-2 bg-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
    >
      <Shield className="h-6 w-6" />
      <span className="font-semibold">{t("admin-panel")}</span>
    </Link>
  );
}
