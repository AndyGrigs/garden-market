// src/components/Admin/TreeModal.tsx - Спрощена версія
import { useEffect, useState } from "react";
import { useGetCategoriesQuery } from "../../store/api/categoryApi";
import { Loader2, X, Upload } from "lucide-react";
import { Category, TranslatedString } from "../../types/ICategories";
import { TreeFormData } from "../../types/ITree";
import { useDeleteImageMutation, useUploadImageMutation } from '../../store/api/uploadApi';
import { t } from 'i18next';
import { BASE_URL } from '../../config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (treeData: TreeFormData) => void;
  initialData?: TreeFormData;
}

const TreeModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const [form, setForm] = useState<TreeFormData>(
    initialData || {
      title: { ru: "", ro: "", en: "" },
      description: { ru: "", ro: "", en: "" },
      price: 0,
      stock: 0,
      category: "",
      imageUrl: "",
    }
  );

  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const { data: categories } = useGetCategoriesQuery();

  useEffect(() => {
    if (isOpen) {
      console.log('🔄 TreeModal відкрилась з даними:', initialData);
      
      if (initialData) {
        setForm({
          title: {
            ru: initialData.title?.ru ?? "",
            ro: initialData.title?.ro ?? "",
            en: initialData.title?.en ?? "",
          },
          description: {
            ru: initialData.description?.ru ?? "",
            ro: initialData.description?.ro ?? "",
            en: initialData.description?.en ?? "",
          },
          price: initialData.price ?? 0,
          stock: initialData.stock ?? 0,
          category: initialData.category ?? "",
          imageUrl: initialData.imageUrl ?? "",
          _id: initialData._id
        });
      } else {
        setForm({
          title: { ru: "", ro: "", en: "" },
          description: { ru: "", ro: "", en: "" },
          price: 0,
          stock: 0,
          category: "",
          imageUrl: "",
        });
      }
    }
  }, [isOpen, initialData]);

  const handleLangChange = (
    field: keyof Pick<TreeFormData, "title" | "description">,
    lang: keyof TranslatedString,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleChange = <T extends keyof TreeFormData>(
    field: T,
    value: TreeFormData[T]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Спрощене завантаження нового фото
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      try {
        console.log('📤 Завантажуємо нове зображення...');
        const formData = new FormData();
        formData.append('image', event.target.files[0]);
        
        const response = await uploadImage(formData).unwrap();
        setForm(prev => ({ ...prev, imageUrl: response.imageUrl }));
        console.log('✅ Зображення завантажено:', response.imageUrl);
      } catch (error) {
        alert("Не вдалося завантажити фото");
        console.error(error);
      }
    }
  };

  // ✅ Спрощене видалення фото
  const handleDeleteImage = async () => {
    if (form.imageUrl && !form.imageUrl.startsWith('blob:')) {
      try {
        const filename = form.imageUrl.split('/').pop();
        if (filename) {
          console.log('🗑️ Видаляємо файл:', filename);
          await deleteImage(filename).unwrap();
        }
      } catch (error) {
        console.error("Помилка видалення зображення", error);
        alert("Не вдалося видалити зображення");
      }
    }
    
    // Скидаємо зображення
    setForm(prev => ({ ...prev, imageUrl: "" }));
    console.log('✅ Зображення видалено');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(form.title.ru ?? "").trim() || form.price <= 0 || !form.category) {
      alert("Назва (RU), ціна та категорія обов'язкові");
      return;
    }

    try {
      console.log('📤 Відправляємо дані товару:', form);
      onSubmit(form);
      
      // Очищаємо форму
      setForm({
        title: { ru: "", ro: "", en: "" },
        description: { ru: "", ro: "", en: "" },
        price: 0,
        stock: 0,
        category: "",
        imageUrl: "",
      });
      onClose();
      
    } catch (error) {
      console.error('❌ Помилка створення/редагування товару:', error);
      alert("Помилка збереження товару");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full p-6 rounded-lg shadow-lg max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {initialData?._id ? 'Редагувати товар' : 'Додати товар'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Назви */}
        <h4 className="font-semibold mb-2">Назва</h4>
        {["ru", "ro", "en"].map((lang) => (
          <input
            key={lang}
            className="border border-green-600 px-3 py-2 mb-2 rounded w-full"
            placeholder={`Назва (${lang.toUpperCase()})`}
            value={form.title[lang as keyof TranslatedString]}
            onChange={(e) =>
              handleLangChange(
                "title",
                lang as keyof TranslatedString,
                e.target.value
              )
            }
            required={lang === 'ru'}
          />
        ))}

        {/* Описи */}
        <h4 className="font-semibold mb-2 mt-4">Опис</h4>
        {["ru", "ro", "en"].map((lang) => (
          <textarea
            key={lang}
            className="border border-green-600 px-3 py-2 mb-2 rounded w-full h-20"
            placeholder={`Опис (${lang.toUpperCase()})`}
            value={form.description[lang as keyof TranslatedString]}
            onChange={(e) =>
              handleLangChange(
                "description",
                lang as keyof TranslatedString,
                e.target.value
              )
            }
          />
        ))}

        {/* Ціна і кількість */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ціна</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="border border-green-600 px-3 py-2 rounded w-full"
              placeholder="0"
              value={form.price || ""}
              onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Кількість</label>
            <input
              type="number"
              min="0"
              className="border border-green-600 px-3 py-2 rounded w-full"
              placeholder="0"
              value={form.stock || ""}
              onChange={(e) => handleChange("stock", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Категорія */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Категорія</label>
          <select
            className="border border-green-600 px-3 py-2 rounded w-full"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
          >
            <option value="">Оберіть категорію</option>
            {categories?.map((cat: Category) => (
              <option key={cat._id} value={cat._id}>
                {cat.name?.ru || cat.name?.en || cat.name?.ro}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Спрощена секція фото товару */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Фото товару</label>
          
          {/* Поточне зображення з кнопкою видалення */}
          {form.imageUrl && (
            <div className="mb-4">
              <img
                src={form.imageUrl.startsWith('blob:') ? form.imageUrl : `${BASE_URL}${form.imageUrl}`}
                alt="Зображення товару"
                className="w-full h-40 object-cover rounded border"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                disabled={uploading}
              >
                🗑️ {t('dashboard.deleteImage')}
              </button>
            </div>
          )}

          {/* Завантаження нового зображення (тільки якщо немає поточного) */}
          {!form.imageUrl && (
            <div className="border-2 border-dashed border-green-300 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="tree-image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="tree-image-upload"
                className={`cursor-pointer flex flex-col items-center gap-2 text-gray-600 hover:text-gray-800 ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload size={32} />
                <span className="text-sm font-medium">
                  Завантажити зображення
                </span>
                <span className="text-xs text-gray-500">
                  JPG, PNG до 5MB
                </span>
              </label>
            </div>
          )}

          {/* Індикатор завантаження */}
          {uploading && (
            <div className="flex items-center gap-2 mt-2 text-blue-600">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm">Завантаження...</span>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            disabled={uploading}
          >
            Скасувати
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TreeModal;