import { useState } from "react";
import { TranslatedString } from "../../types/ICategories";
import { useUploadImageMutation, useDeleteImageMutation } from "../../store/api/uploadApi";
import { Loader2 } from "lucide-react";
import { BASE_URL } from "../../config";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TranslatedString & { imageUrl?: string }) => void;
  initialData?: TranslatedString;
}

const CategoryModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const [formData, setFormData] = useState<TranslatedString>(
    initialData || { ru: "", ro: "", en: "" }
  );
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const handleChange = (lang: keyof TranslatedString, value: string) => {
    setFormData((prev) => ({ ...prev, [lang]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const form = new FormData();
      form.append("image", e.target.files[0]);
      try {
        const res = await uploadImage(form).unwrap();
        setImageUrl(res.imageUrl);
      } catch (error) {
        alert("Не вдалося завантажити фото");
        console.error(error);
      }
    }
  };

  const handleDeleteImage = async () => {
    if (imageUrl) {
      try {
        const filename = imageUrl.split("/").pop();
        if (filename) {
          await deleteImage(filename).unwrap();
          setImageUrl("");
        }
      } catch (error) {
        alert("Не вдалося видалити зображення");
        console.error(error);
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.ru?.trim()) {
      alert("Название по-русски обязательно!!!");
      return;
    }
    onSubmit({ ...formData, imageUrl });
    setFormData({ ru: "", ro: "", en: "" });
    setImageUrl("");
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
          <div>
            <label className="block text-sm font-medium mb-1">Фото категорії</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            {uploading && (
              <div className="flex items-center mb-2">
                <Loader2 className="animate-spin" />
                <span className="ml-2">Завантаження...</span>
              </div>
            )}
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={`${BASE_URL}${imageUrl}`}
                  alt="preview"
                  className="h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Видалити фото
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={uploading}
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={uploading}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;