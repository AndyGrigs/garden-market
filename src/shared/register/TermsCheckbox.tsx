import { t } from 'i18next';

interface TermsCheckboxProps {
  checked: boolean;
  onCheckChange: (checked: boolean) => void;
  onOpenModal: () => void;
}

export default function TermsCheckbox({ checked, onCheckChange, onOpenModal }: TermsCheckboxProps) {
  return (
    <div className="flex items-start space-x-2">
      <input
        id="terms"
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckChange(e.target.checked)}
        className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
      />
      <label htmlFor="terms" className="text-sm text-gray-600">
      {t('auth.register.accept')}{' '}
      <button
        type="button"
        onClick={onOpenModal}
        className="text-emerald-600 hover:text-emerald-500 underline"
      >
        {t('auth.register.siteTerms')}
      </button>
    </label>

    </div>
  );
}