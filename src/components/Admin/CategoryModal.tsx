import { useState } from "react";
import { TranslatedString } from "../../types/ICategories";
import { useUploadImageMutation, useDeleteImageMutation } from "../../store/api/uploadApi";
import { Loader2, X } from "lucide-react";
import { BASE_URL } from "../../config";
import { t } from 'i18next';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TranslatedString & { imageUrl?: string }) => void;
  initialData?: TranslatedString;
}

const CategoryModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const [formData, setFormData] = useState<TranslatedString>(
    initialData || { ru: "", ro: "" }
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
        toast.error(t('photo.fail'));
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
        toast.error(t('photo.failDelete'));
        console.error(error);
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.ru?.trim()) {
      toast.error(t('common.nameRus'));
      return;
    }
    onSubmit({ ...formData, imageUrl });
    setFormData({ ru: "", ro: ""});
    setImageUrl("");
    onClose();
  };

  const handleClose = () => {
    setFormData({ ru: "", ro: ""});
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
        <div className='flex justify-between items-center mb-4'>
          <h3 className="text-lg font-bold mb-4">{t('categories.add')}</h3>
        <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
            aria-label="close"
          >
            <X size={20} />
        </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('common.name')} (RU)</label>
            <input
              type="text"
              value={formData.ru}
              onChange={(e) => handleChange("ru", e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder={t('common.enterNameRus')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('common.name')} (RO)</label>
            <input
              type="text"
              value={formData.ro}
              onChange={(e) => handleChange("ro", e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder={t('common.enterNameRom')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('categories.photo')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            {uploading && (
              <div className="flex items-center mb-2">
                <Loader2 className="animate-spin" />
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
                 { t('photo.delete')}
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
            {t('photo.delete')}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={uploading}
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;