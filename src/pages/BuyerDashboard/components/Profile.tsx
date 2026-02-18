import { useTranslation } from "react-i18next";
import { User } from "lucide-react";
import { motion } from "@/utils/motionComponents";

interface ProfileProps {
  fullName: string;
}

export default function Profile({ fullName }: ProfileProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <User className="h-5 w-5 mr-2" />
        {t("dashboard.profile")}
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-600">
          {t("dashboard.name")}
        </label>
        <p className="mt-1 text-gray-900">{fullName}</p>
      </div>
    </motion.div>
  );
}
