// src/components/Admin/TreeModal.tsx - Спрощена версія
import { useEffect, useState } from 'react';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { Loader2, X, Upload } from 'lucide-react';
import { Category, TranslatedString } from '@/types/ICategories';
import { TreeFormData } from '@/types/ITree';
import {
  useDeleteImageMutation,
  useUploadImageMutation,
} from '@/store/api/uploadApi';
import { t } from 'i18next';
import { BASE_URL } from '@/config';
import toast from 'react-hot-toast';
import NumberInput from '@/shared/NumberInput';
import { AnimatePresence, motion } from '@/utils/motionComponents';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (treeData: TreeFormData) => void;
  initialData?: TreeFormData;
}

const TreeModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const [form, setForm] = useState<TreeFormData>(
    initialData || {
      title: { ru: '', ro: '' },
      description: { ru: '', ro: '' },
      price: 0,
      stock: 0,
      category: '',
      imageUrl: '',
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
            ru: initialData.title?.ru ?? '',
            ro: initialData.title?.ro ?? '',
          },
          description: {
            ru: initialData.description?.ru ?? '',
            ro: initialData.description?.ro ?? '',
          },
          price: initialData.price ?? 0,
          stock: initialData.stock ?? 0,
          category: initialData.category ?? '',
          imageUrl: initialData.imageUrl ?? '',
          _id: initialData._id,
        });
      } else {
        setForm({
          title: { ru: '', ro: '' },
          description: { ru: '', ro: '' },
          price: 0,
          stock: 0,
          category: '',
          imageUrl: '',
        });
      }
    }
  }, [isOpen, initialData]);

  const handleLangChange = (
    field: keyof Pick<TreeFormData, 'title' | 'description'>,
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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      try {
        const formData = new FormData();
        formData.append('image', event.target.files[0]);

        const response = await uploadImage(formData).unwrap();
        setForm((prev) => ({ ...prev, imageUrl: response.imageUrl }));
      } catch (error) {
        toast.error(t('common.error'));
        console.error(error);
      }
    }
  };

  const handleDeleteImage = async () => {
    if (form.imageUrl && !form.imageUrl.startsWith('blob:')) {
      try {
        const filename = form.imageUrl.split('/').pop();
        if (filename) {
          console.log('🗑️ Видаляємо файл:', filename);
          await deleteImage(filename).unwrap();
        }
      } catch (error) {
        toast.error(t('common.error'));
        console.log(error);
      }
    }

    setForm((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(form.title.ru ?? '').trim() || form.price <= 0 || !form.category) {
      toast.error(t('common.enterNameRus'));
      return;
    }

    try {
      onSubmit(form);

      setForm({
        title: { ru: '', ro: '' },
        description: { ru: '', ro: '' },
        price: 0,
        stock: 0,
        category: '',
        imageUrl: '',
      });
      onClose();
    } catch (error) {
      console.error('❌ Помилка створення/редагування товару:', error);
      toast.error(t('common.error'));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="tree-modal"
          className="fixed inset-0 bg-black bg-opacity-50 w-full h-screen z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <form
                onSubmit={handleSubmit}
                className="bg-white w-full p-6 rounded-lg shadow-lg max-w-md max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    {initialData?._id
                      ? t('dashboard.edit')
                      : t('dashboard.addProduct')}
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
                <h4 className="font-semibold mb-2">{t('common.name')}</h4>
                {['ru', 'ro'].map((lang) => (
                  <input
                    key={lang}
                    className="border border-green-600 px-3 py-2 mb-2 rounded w-full"
                    placeholder={`(${t('common.name')}) (${lang.toUpperCase()})`}
                    value={form.title[lang as keyof TranslatedString]}
                    onChange={(e) =>
                      handleLangChange(
                        'title',
                        lang as keyof TranslatedString,
                        e.target.value
                      )
                    }
                    required={lang === 'ru'}
                  />
                ))}

                {/* Описи */}
                <h4 className="font-semibold mb-2 mt-4">
                  {t('common.describing')}
                </h4>
                {['ru', 'ro'].map((lang) => (
                  <textarea
                    key={lang}
                    className="border border-green-600 px-3 py-2 mb-2 rounded w-full h-20"
                    placeholder={`(${t('common.describing')}) (${lang.toUpperCase()})`}
                    value={form.description[lang as keyof TranslatedString]}
                    onChange={(e) =>
                      handleLangChange(
                        'description',
                        lang as keyof TranslatedString,
                        e.target.value
                      )
                    }
                  />
                ))}

                {/* Ціна і кількість */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('common.price')}
                    </label>
                    <NumberInput
                      label={t('common.price')}
                      value={form.price}
                      onChange={(value) => handleChange('price', value)}
                      type="decimal"
                      step={0.01}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('common.quantity')}
                    </label>
                    

                    <NumberInput
                      label="Количество"
                      value={form.stock}
                      onChange={(value) => handleChange('stock', value)}
                      type="integer"
                    />
                  </div>
                </div>

                {/* Категорія */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {t('categories.category')}
                  </label>
                  <select
                    className="border border-green-600 px-3 py-2 rounded w-full"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    required
                  >
                    <option value="">{t('categories.chooseCategory')}</option>
                    {categories?.map((cat: Category) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name?.ru || cat.name?.ro}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ Спрощена секція фото товару */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {t('photo.product')}
                  </label>

                  {/* Поточне зображення з кнопкою видалення */}
                  {form.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={
                          form.imageUrl.startsWith('blob:') || form.imageUrl.startsWith('http')
                            ? form.imageUrl
                            : `${BASE_URL}${form.imageUrl}`
                        }
                        alt={t('photo.product')}
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
                      <span className="text-sm">{t('photo.uploading')}</span>
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
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        {t('photo.uploading')}
                      </>
                    ) : (
                      t('common.save')
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TreeModal;
