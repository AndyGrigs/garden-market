import { useState, useEffect } from "react";
import { X, Upload, Loader2, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Category } from '../types/ICategories';
import { Tree, TreeApiData } from '../types/ITree';
import { useLanguage } from '../hooks/useLanguage';
import { useGetCategoriesQuery } from '../store/api/categoryApi';
import { useUploadImageMutation } from '../store/api/uploadApi';
import { useCreateSellerTreeMutation, useUpdateSellerTreeMutation } from '../store/api/sellerApi';
import toast from 'react-hot-toast';

interface SellerTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTree: Tree | null;
}

interface TreeFormData {
  title: {
    ru: string;
    ro: string;
    en: string;
  };
  description: {
    ru: string;
    ro: string;
    en: string;
  };
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}



const SellerTreeModal = ({ isOpen, onClose, editingTree }: SellerTreeModalProps) => {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [createTree] = useCreateSellerTreeMutation();
  const [updateTree] = useUpdateSellerTreeMutation();
  const [uploadImage] = useUploadImageMutation();
  const { data: categories } = useGetCategoriesQuery();
  
  const [formData, setFormData] = useState<TreeFormData>({
    title: { ru: "", ro: "", en: "" },
    description: { ru: "", ro: "", en: "" },
    price: 0,
    stock: 0,
    category: "",
    imageUrl: "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Заповнення форми при редагуванні
  useEffect(() => {
    if (editingTree) {
      setFormData({
        title: editingTree.title,
        description: editingTree.description,
        price: editingTree.price,
        stock: editingTree.stock,
        category: editingTree.category?._id || "",
        imageUrl: editingTree.imageUrl || "",
      });
      setImagePreview(editingTree.imageUrl ? `${import.meta.env.VITE_API_URL}${editingTree.imageUrl}` : "");
    } else {
      setFormData({
        title: { ru: "", ro: "", en: "" },
        description: { ru: "", ro: "", en: "" },
        price: 0,
        stock: 0,
        category: "",
        imageUrl: "",
      });
      setImagePreview("");
    }
    setImageFile(null);
  }, [editingTree, isOpen]);

  // Обробка зміни файлу зображення
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Завантаження зображення на сервер
  const uploadImageToServer = async (): Promise<string> => {
    if (!imageFile) return formData.imageUrl;

    setIsUploading(true);
    try {
      const formDataImage = new FormData();
      formDataImage.append("image", imageFile);
      
      const result = await uploadImage(formDataImage).unwrap();
      return result.url;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error(t('seller.imageUploadError', { defaultValue: 'Помилка завантаження зображення' }));
    } finally {
      setIsUploading(false);
    }
  };

  // Обробка відправки форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валідація тільки російської мови
    if (!formData.title.ru.trim()) {
      toast.error(t('seller.validation.titleRuRequired', { defaultValue: 'Заповніть назву товару' }));
      return;
    }

    if (!formData.description.ru.trim()) {
      toast.error(t('seller.validation.descriptionRuRequired', { defaultValue: 'Заповніть опис товару' }));
      return;
    }

    if (formData.price <= 0) {
      toast.error(t('seller.validation.priceRequired', { defaultValue: 'Ціна повинна бути більше 0' }));
      return;
    }

    if (formData.stock < 0) {
      toast.error(t('seller.validation.stockInvalid', { defaultValue: 'Кількість не може бути від\'ємною' }));
      return;
    }

    if (!formData.category) {
      toast.error(t('seller.validation.categoryRequired', { defaultValue: 'Виберіть категорію' }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Завантажуємо зображення якщо є нове
      const imageUrl = await uploadImageToServer();

      // ⬇️ ВАЖЛИВО: Для нових товарів очищуємо переклади
      const treeData: TreeApiData =  {
      title: editingTree 
        ? formData.title
        : { ru: formData.title.ru, ro: "", en: "" },
      description: editingTree
        ? formData.description  
        : { ru: formData.description.ru, ro: "", en: "" },
      price: formData.price,
      stock: formData.stock,
      category: formData.category, // ⬅️ Тут передаємо ID як string
      imageUrl,
    }

      if (editingTree) {
      await updateTree({
        id: editingTree._id,
        data: {
          ...treeData,
          title: {
            ru: formData.title.ru,
            ro: editingTree.title.ro,
            en: editingTree.title.en,
          },
          description: {
            ru: formData.description.ru,
            ro: editingTree.description.ro,
            en: editingTree.description.en,
          }
        },
      }).unwrap();
      
        
        toast.success(t('seller.updateSuccess', { defaultValue: 'Товар успішно оновлено' }));
      } else {
        // Створення нового товару
        await createTree(treeData).unwrap();
        
        toast.success(t('seller.createSuccess', { 
          defaultValue: 'Товар створено! Адміністратор додасть переклади найближчим часом.' 
        }));
      }

      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(t('seller.submitError', { defaultValue: 'Помилка збереження товару' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getCategoryName = (category: Category) => {
    return category?.name?.[lang] || category?.name?.en || category?.name?.ru || "Unknown";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingTree 
              ? t('seller.editProduct', { defaultValue: 'Редагувати товар' })
              : t('seller.addProduct', { defaultValue: 'Додати товар' })
            }
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* ⬇️ ІНФОРМАЦІЙНЕ ПОВІДОМЛЕННЯ */}
        <div className="p-6 bg-blue-50 border-b">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                {t('seller.translationInfo.title', { defaultValue: 'Інформація про переклади' })}
              </h4>
              <p className="text-sm text-blue-700">
                {editingTree 
                  ? t('seller.translationInfo.editMode', { 
                      defaultValue: 'Ви можете редагувати тільки російську версію. Переклади залишаться без змін.' 
                    })
                  : t('seller.translationInfo.createMode', { 
                      defaultValue: 'Заповніть інформацію російською мовою. Адміністратор додасть переклади після перевірки.' 
                    })
                }
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ліва колонка - основна інформація */}
            <div className="space-y-4">
              {/* Назва товару (тільки російською) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('seller.form.titleRu', { defaultValue: 'Назва товару (російською)' })} *
                </label>
                <input
                  type="text"
                  placeholder={t('seller.form.titleRuPlaceholder', { defaultValue: 'Введіть назву товару...' })}
                  value={formData.title.ru}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, ru: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                
                {/* Показуємо існуючі переклади при редагуванні */}
                {editingTree && (editingTree.title.en || editingTree.title.ro) && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      {t('seller.existingTranslations', { defaultValue: 'Існуючі переклади:' })}
                    </p>
                    {editingTree.title.en && (
                      <p className="text-sm text-gray-700">🇬🇧 {editingTree.title.en}</p>
                    )}
                    {editingTree.title.ro && (
                      <p className="text-sm text-gray-700">🇷🇴 {editingTree.title.ro}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Опис товару (тільки російською) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('seller.form.descriptionRu', { defaultValue: 'Опис товару (російською)' })} *
                </label>
                <textarea
                  placeholder={t('seller.form.descriptionRuPlaceholder', { defaultValue: 'Введіть детальний опис товару...' })}
                  value={formData.description.ru}
                  onChange={(e) => setFormData({
                    ...formData,
                    description: { ...formData.description, ru: e.target.value }
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                
                {/* Показуємо існуючі переклади при редагуванні */}
                {editingTree && (editingTree.description.en || editingTree.description.ro) && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      {t('seller.existingTranslations', { defaultValue: 'Існуючі переклади:' })}
                    </p>
                    {editingTree.description.en && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500">🇬🇧 Англійською:</p>
                        <p className="text-sm text-gray-700">{editingTree.description.en}</p>
                      </div>
                    )}
                    {editingTree.description.ro && (
                      <div>
                        <p className="text-xs text-gray-500">🇷🇴 Румунською:</p>
                        <p className="text-sm text-gray-700">{editingTree.description.ro}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ціна та кількість */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('seller.form.price', { defaultValue: 'Ціна' })} (грн) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('seller.form.stock', { defaultValue: 'Кількість' })} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({
                      ...formData,
                      stock: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Категорія */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('seller.form.category', { defaultValue: 'Категорія' })} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({
                    ...formData,
                    category: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">
                    {t('seller.form.selectCategory', { defaultValue: 'Виберіть категорію' })}
                  </option>
                  {categories?.map((category: Category) => (
                    <option key={category._id} value={category._id}>
                      {getCategoryName(category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Права колонка - зображення та попередній перегляд */}
            <div className="space-y-4">
              {/* Завантаження зображення */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('seller.form.image', { defaultValue: 'Зображення товару' })}
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto max-h-48 rounded-lg object-cover"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{t('seller.form.changeImage', { defaultValue: 'Змінити зображення' })}</span>
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center space-y-2 cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {t('seller.form.uploadImage', { defaultValue: 'Натисніть щоб завантажити зображення' })}
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG до 10MB
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Попередній перегляд */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {t('seller.form.preview', { defaultValue: 'Попередній перегляд' })}
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">{t('seller.form.title', { defaultValue: 'Назва' })}:</span>
                    <span className="ml-2 text-gray-900">
                      {formData.title.ru || t('common.notFilled', { defaultValue: 'Не заповнено' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('seller.form.price', { defaultValue: 'Ціна' })}:</span>
                    <span className="ml-2 text-gray-900">{formData.price} грн</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('seller.form.stock', { defaultValue: 'Кількість' })}:</span>
                    <span className="ml-2 text-gray-900">{formData.stock} шт.</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('seller.form.category', { defaultValue: 'Категорія' })}:</span>
                    <span className="ml-2 text-gray-900">
                      {formData.category 
                        ? getCategoryName(categories?.find(cat => cat._id === formData.category))
                        : t('common.notSelected', { defaultValue: 'Не вибрано' })
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Статус перекладів */}
              {!editingTree && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      {t('seller.translationStatus.title', { defaultValue: 'Статус перекладів' })}
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700">
                    {t('seller.translationStatus.newProduct', { 
                      defaultValue: 'Після створення товару адміністратор отримає сповіщення та додасть переклади українською та англійською мовами.' 
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {t('common.cancel', { defaultValue: 'Скасувати' })}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {(isSubmitting || isUploading) && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {isSubmitting || isUploading
                  ? t('common.saving', { defaultValue: 'Збереження...' })
                  : editingTree 
                    ? t('common.update', { defaultValue: 'Оновити' })
                    : t('seller.createAndNotify', { defaultValue: 'Створити і повідомити адміна' })
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerTreeModal;