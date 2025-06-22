import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserLinksProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export function UserLinks({ cartItemsCount, onCartClick }: UserLinksProps) {
  const { t } = useTranslation();

  return (
    <>
      <button
        onClick={onCartClick}
        className="flex items-center space-x-2 bg-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
      >
        <ShoppingCart className="h-6 w-6" />
        <span className="font-semibold">{cartItemsCount}</span>
      </button>

      <Link
        to="/dashboard"
        className="flex items-center space-x-2 bg-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
      >
        <User className="h-6 w-6" />
        <span className="font-semibold">{t("header.dashboard")}</span>
      </Link>
    </>
  );
}