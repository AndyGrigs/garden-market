// src/components/Admin/EditCategoryModal.tsx - Спрощена версія
import { useState, FormEvent, useEffect } from 'react';
import { TranslatedString } from '../../types/ICategories';
import { useUploadImageMutation, useDeleteImageMutation } from "../../store/api/uploadApi";
import { Loader2, X, Upload } from "lucide-react";
import { BASE_URL } from "../../config";
import toast from 'react-hot-toast';
import { t } from 'i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TranslatedString & { imageUrl?: string }) => void;
  initialData?: TranslatedString;
  categoryName?: string;
  initialImageUrl?: string;
}

export const EditCategoryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = { ru: "", ro: "" },
  categoryName = "Категория",
  initialImageUrl = ""
}: Props) => {
  
  const [formData, setFormData] = useState<TranslatedString>(initialData);
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Модалка відкрилась з даними:', { initialData, initialImageUrl });
      
      setFormData({
        ru: initialData?.ru || "",
        ro: initialData?.ro || "",
        // en: initialData?.en || ""
      });
      
      setImageUrl(initialImageUrl || "");
    }
  }, [isOpen, initialData, initialImageUrl]);

  const handleChange = (lang: keyof TranslatedString, value: string) => {
    setFormData(prev => ({
      ...prev,
      [lang]: value
    }));
  };

  // ✅ Завантаження нового фото (без заміни)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const form = new FormData();
        form.append('image', e.target.files[0]);
        
        const uploadResult = await uploadImage(form).unwrap();
        setImageUrl(uploadResult.imageUrl);
        console.log('✅ Зображення завантажено:', uploadResult.imageUrl);
      } catch (error) {
        console.error('❌ Помилка завантаження:', error);
        toast.error('Error/Ошибка!');
      }
    }
  };

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
    
    setImageUrl("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.ru?.trim()) {
      toast.error(t('common.enterNameRus'));
      return;
    }

    try {
      
      onSubmit({ ...formData, imageUrl: imageUrl });
      onClose();
      
    } catch (error) {
      console.error('❌:', error);
      toast.error(t('collection.error'));
    }
  };

  const handleClose = () => {
    onClose();
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
            onClick={handleClose}
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

          {/* <div>
            <label className="block text-sm font-medium mb-1">Назва (EN)</label>
            <input
              type="text"
              value={formData.en}
              onChange={(e) => handleChange('en', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Англійська назва"
            />
          </div> */}

          {/* ✅ Спрощена секція зображення */}
          <div>
            <label className="block text-sm font-medium mb-2">Зображення категорії</label>
            
            {/* Поточне зображення з кнопкою видалення */}
            {imageUrl && (
              <div className="mb-4">
                <img
                  src={imageUrl.startsWith('blob:') ? imageUrl : `${BASE_URL}${imageUrl}`}
                  alt={t('categories.photo')}
                  className="w-full h-40 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  disabled={uploading}
                >
                  🗑️t('photo.delete')
                </button>
              </div>
            )}

            {/* Завантаження нового зображення (тільки якщо немає поточного) */}
            {!imageUrl && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer flex flex-col items-center gap-2 text-gray-600 hover:text-gray-800 ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload size={32} />
                  <span className="text-sm font-medium">
                    {t('photo.upload')}
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
                <span className="text-sm"><Loader2 /></span>
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex gap-2 mt-6">
            <button 
              type="button"
              onClick={handleClose}
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
              {uploading ? <Loader2/> : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};