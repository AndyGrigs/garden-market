// src/pages/AdminPanel/AdminCategories/hooks/useAdminCategories.ts
import { useTranslation } from 'react-i18next';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/store/api/categoryApi';
import { useDeleteImageMutation } from '@/store/api/uploadApi';
import { Category, TranslatedString } from '@/types/ICategories';
import toast from 'react-hot-toast';

export interface CategoryFormData {
  ru?: string;
  ro?: string;
  imageUrl?: string;
}

const useAdminCategories = () => {
  const { t } = useTranslation();

  // RTK Query hooks
  const { data: categories, isLoading, error, refetch } = useGetCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [deleteImage] = useDeleteImageMutation();

  // Create category handler
  const handleCreate = async (data: CategoryFormData): Promise<Category | null> => {
    if (!data.ru?.trim()) {
      toast.error(t('common.nameRus'));
      return null;
    }

    try {
      const newCategory = await createCategory({
        name: {
          ru: data.ru,
          ro: data.ro,
        },
        imageUrl: data.imageUrl,
      }).unwrap();

      toast.success(t('categories.created', { defaultValue: 'Категория создана' }));
      return newCategory;
    } catch (err) {
      toast.error(t('categories.failCreate'));
      console.error(err);
      return null;
    }
  };

  // Update category handler
  const handleUpdate = async (id: string, data: CategoryFormData): Promise<Category | null> => {
    if (!data.ru?.trim()) {
      toast.error(t('common.nameRus'));
      return null;
    }

    try {
      const updatedCategory = await updateCategory({
        id,
        name: {
          ru: data.ru,
          ro: data.ro,
        },
        imageUrl: data.imageUrl,
      }).unwrap();

      return updatedCategory;
    } catch (err) {
      console.error('❌ Error to update:', err);
      toast.error(t('categories.failUpdate'));
      return null;
    }
  };

  // Delete category handler
  const handleDelete = async (id: string, imageUrl?: string): Promise<boolean> => {
    if (!window.confirm(t('categories.confirm'))) {
      return false;
    }

    try {
      // Delete image first if exists
      if (imageUrl) {
        const normalizedUrl = imageUrl.startsWith('/uploads/')
          ? imageUrl.replace('/uploads/', '')
          : imageUrl;
        try {
          await deleteImage(normalizedUrl).unwrap();
        } catch {
          // Image deletion failure shouldn't block category deletion
        }
      }

      await deleteCategory(id).unwrap();
      return true;
    } catch {
      toast.error(t('categories.notDeleted'));
      return false;
    }
  };

  return {
    // Data
    categories: categories || [],

    // States
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    isProcessing: isCreating || isUpdating || isDeleting,

    // Handlers
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  };
};

export default useAdminCategories;
