import { useTranslation } from 'react-i18next';

interface BasicInfoFieldsProps {
  fullName: string;
  email: string;
  password: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export default function BasicInfoFields({
  fullName,
  email,
  password,
  onFullNameChange,
  onEmailChange,
  onPasswordChange
}: BasicInfoFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
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
            onChange={(e) => onFullNameChange(e.target.value)}
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
            onChange={(e) => onEmailChange(e.target.value)}
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
          onChange={(e) => onPasswordChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder={t("auth.register.password")}
        />
      </div>
    </>
  );
}