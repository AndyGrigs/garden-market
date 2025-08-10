

import { useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../store/api/categoryApi";

import { Category, TranslatedString } from "../../types/ICategories";
import { useLanguage } from "../../hooks/useLanguage";
import CategoryModal from "./CategoryModal";
import { BASE_URL } from "../../config";
import { t } from 'i18next';
import { Loader } from 'lucide-react';
import { EditCategoryModal } from './EditCategoryModal';
import toast from 'react-hot-toast';

interface AdminCategoriesProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

const AdminCategories = ({
  selectedCategoryId,
  onSelectCategory,
}: AdminCategoriesProps) => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const lang = useLanguage();

  const handleDelete = async (id: string) => {
    if (window.confirm(t('categories.confirm'))) {
      try { 
        await deleteCategory(id).unwrap();
      } catch {
        toast.error(t('categories.notDeleted'));
      }
    }
  };


  const getCategoryName = (name: TranslatedString): string => {
    return name[lang as keyof typeof name] || name.ru || "Unnamed";
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true); 
  };

 
 const handleUpdateCategory = async (updatedData: TranslatedString & { imageUrl?: string }) => {
  if (!editingCategory) return;

  try {
    await updateCategory({
      id: editingCategory._id,
      name: {
        ru: updatedData.ru,
        ro: updatedData.ro,
        en: updatedData.en
      },
      imageUrl: updatedData.imageUrl 
    }).unwrap();
    
    
    setIsEditModalOpen(false);
    setEditingCategory(null);
    
  } catch (error) {
    console.error('❌ Error to update:', error);
    toast.error(t('categories.failUpdate'));
  }
};    

  return (
    <>
      <div className="p-6 bg-white shadow">
        <h2 className="text-2xl font-bold mb-4">{t('categories.categories')}</h2>
        <button
          onClick={() => setIsModalOpen(pr => !pr)}
          className="bg-emerald-600 mr-auto text-white px-4 py-2 rounded mb-4"
        >
          ➕ {t('categories.add')}
        </button>

        <div className='mb-4'>
          <button onClick={()=> onSelectCategory('all')}
            className={`w-full text-left p-3 rounded border transition-colors ${
              selectedCategoryId === 'all' ? 'bg-emerald-100 border-emerald-500' : ' border-gray-200 hover: bg-gray-100' 
            }` }
            >
           {t('common.allProducts')}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <ul className="space-y-2">
            {categories?.map((cat: Category) => (
              <li
                key={cat._id}
                className="flex justify-between items-center border-b pb-2"
              >
            
                <div className="flex items-center gap-3">
                  {cat.imageUrl && (
                    <img
                      src={`${BASE_URL}${cat.imageUrl}`}
                      alt={getCategoryName(cat.name)}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  )}
                  <span
                    onClick={() => onSelectCategory(cat._id)}
                    className={`cursor-pointer ${
                      selectedCategoryId === cat._id
                        ? "text-emerald-600 font-bold"
                        : "text-gray-800"
                    }`}
                  >
                    {getCategoryName(cat.name)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(cat)}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    {t('categories.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    {t('categories.delete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {/* Модалка створення */}
        <CategoryModal
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
          onSubmit={async (data) => {
            try {
              await createCategory({
                name: {
                  ru: data.ru,
                  ro: data.ro, 
                  en: data.en
                },
                imageUrl: data.imageUrl,
              }).unwrap();
              setIsModalOpen(false);
            } catch (err) {
              console.error(err);
              toast.error(t('categories.failCreate'));
            }
          }}
        />

       

        {/* Модалка редагування */}
        {editingCategory && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCategory(null);
          }}
          initialData={editingCategory.name}
          initialImageUrl={editingCategory.imageUrl}
          categoryName={getCategoryName(editingCategory.name)}
          onSubmit={handleUpdateCategory}
        />
      )}
      </div>
    </>
  );
};

export default AdminCategories;