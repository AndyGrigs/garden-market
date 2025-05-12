import { useState } from "react";
import { TranslatedString } from "../../types/ICategories";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TranslatedString) => void;
  initialData?: TranslatedString;
}

const CategoryModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const [formData, setFormData] = useState<TranslatedString>(
    initialData || { ru: "", ro: "", en: "" }
  );

  const handleChange = (lang: keyof TranslatedString, value: string) => {
    setFormData((prev) => ({ ...prev, [lang]: value }));
  };

  const handleSubmit = () => {
    if (!formData.ru?.trim()) {
      alert("Название по-русски обязательно!!!");
      return;
    }
    onSubmit(formData);
    setFormData({ ru: "", ro: "", en: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 w-full h-screen z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">Добавление категории</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название (RU)</label>
            <input
              type="text"
              value={formData.ru}
              onChange={(e) => handleChange("ru", e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Введите название на русском"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Название (RO)</label>
            <input
              type="text"
              value={formData.ro}
              onChange={(e) => handleChange("ro", e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Введите название на румынском"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Название (EN)</label>
            <input
              type="text"
              value={formData.en}
              onChange={(e) => handleChange("en", e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Введите название на английском"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;