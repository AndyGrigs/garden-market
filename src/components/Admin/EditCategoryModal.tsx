// src/components/Admin/EditCategoryModal.tsx - З фоткою
import { useState, FormEvent, useEffect } from 'react';
import { TranslatedString } from '../../types/ICategories';
import { useUploadImageMutation, useDeleteImageMutation } from "../../store/api/uploadApi";
import { Loader2, X, Upload } from "lucide-react";
import { BASE_URL } from "../../config";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TranslatedString & { imageUrl?: string }) => void; // ✅ Додали imageUrl
  initialData?: TranslatedString;
  categoryName?: string;
  initialImageUrl?: string; // ✅ Додали початкове зображення
}

export const EditCategoryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = { ru: "", ro: "", en: "" },
  categoryName = "Категорія",
  initialImageUrl = "" // ✅ Початкове зображення
}: Props) => {
  
  const [formData, setFormData] = useState<TranslatedString>(initialData);
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // ✅ API хуки для роботи з зображеннями
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  // Оновлюємо дані при зміні пропсів
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
    }
  }, [initialData, initialImageUrl]);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        ru: initialData.ru || "",
        ro: initialData.ro || "",
        en: initialData.en || ""
      });
      setImageUrl(initialImageUrl || "");
      setSelectedFile(null); // Скидаємо вибраний файл
    }
  }, [isOpen, initialData, initialImageUrl]);

  const handleChange = (lang: keyof TranslatedString, value: string) => {
    setFormData(prev => ({
      ...prev,
      [lang]: value
    }));
  };

  // ✅ Обробка вибору файлу
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Показуємо превью
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setImageUrl(previewUrl);
    }
  };

  // ✅ Видалення зображення
  const handleDeleteImage = async () => {
    if (imageUrl && !imageUrl.startsWith('blob:')) {
      try {
        const filename = imageUrl.split("/").pop();
        if (filename) {
          await deleteImage(filename).unwrap();
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
    
    // Скидаємо зображення
    setImageUrl("");
    setSelectedFile(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.ru?.trim() ?? false) {
      alert('Поле RU обов\'язкове!');
      return;
    }

    try {
      let finalImageUrl = imageUrl;

      // ✅ Якщо вибрано новий файл - завантажуємо його
      if (selectedFile) {
        console.log('📤 Завантажуємо нове зображення...');
        const form = new FormData();
        form.append('image', selectedFile);
        
        const uploadResult = await uploadImage(form).unwrap();
        finalImageUrl = uploadResult.imageUrl;
        console.log('✅ Зображення завантажено:', finalImageUrl);
      }

      // ✅ Відправляємо дані з imageUrl
      console.log('📤 Відправляємо дані:', { ...formData, imageUrl: finalImageUrl });
      onSubmit({ ...formData, imageUrl: finalImageUrl });
      onClose();
      
    } catch (error) {
      console.error('❌ Помилка:', error);
      alert('Помилка збереження!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Редагувати: {categoryName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Поля назв */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Назва (RU) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ru}
              onChange={(e) => handleChange('ru', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Російська назва"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Назва (RO)</label>
            <input
              type="text"
              value={formData.ro}
              onChange={(e) => handleChange('ro', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Румунська назва"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Назва (EN)</label>
            <input
              type="text"
              value={formData.en}
              onChange={(e) => handleChange('en', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Англійська назва"
            />
          </div>

          {/* ✅ Секція зображення */}
          <div>
            <label className="block text-sm font-medium mb-2">Зображення категорії</label>
            
            {/* Поточне зображення */}
            {imageUrl && (
              <div className="mb-3">
                <img
                  src={imageUrl.startsWith('blob:') ? imageUrl : `${BASE_URL}${imageUrl}`}
                  alt="Зображення категорії"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="mt-2 text-red-600 text-sm hover:underline flex items-center gap-1"
                >
                  <X size={16} />
                  Видалити зображення
                </button>
              </div>
            )}

            {/* Завантаження нового зображення */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <Upload size={24} />
                <span className="text-sm">
                  {imageUrl ? 'Замінити зображення' : 'Завантажити зображення'}
                </span>
              </label>
            </div>

            {/* Індикатор завантаження */}
            {uploading && (
              <div className="flex items-center gap-2 mt-2 text-blue-600">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm">Завантаження...</span>
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex gap-2 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={uploading}
            >
              Скасувати
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};