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
  
  const [newName, setNewName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const lang = useLanguage();

  const handleDelete = async (id: string) => {
    if (window.confirm(t('categories.confirm'))) {
      try {
        await deleteCategory(id).unwrap();
      } catch {
        alert(t('categories.notDeleted'));
      }
    }
  };

  const handleUpdate = async (id: string) => {
    if (!newName?.trim()) return;
    try {
      await updateCategory({
        id,
        name: { [lang]: newName },
      }).unwrap();
      setEditingCategoryId("");
      setNewName("");
    } catch {
      alert(t('categories.failUpdate'));
    }
  };

  const getCategoryName = (name: TranslatedString): string => {
    return name[lang as keyof typeof name] || name.ru || "Unnamed";
  };

  return (
    <>
      <div className="p-6 bg-white shadow">
        <h2 className="text-2xl font-bold mb-4">Категорії</h2>
        <button
          onClick={() => setIsModalOpen(pr => !pr)}
          className="bg-emerald-600 mr-auto text-white px-4 py-2 rounded mb-4"
        >
          ➕ {t('categories.add')}
        </button>

        {isLoading ? (
          <Loader/>
        ) : (
          <ul className="space-y-2">
            {categories?.map((cat: Category) => (
              <li
                key={cat._id}
                className="flex justify-between items-center border-b pb-2"
              >
                {editingCategoryId === cat._id ? (
                  <>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="border px-2 py-1 rounded mr-2"
                    />
                    <button
                      onClick={() => handleUpdate(cat._id)}
                      className="bg-emerald-500 text-white rounded px-3 py-1 mr-2"
                    >
                      {t('common.save')}
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategoryId("");
                        setNewName("");
                      }}
                      className="bg-gray-400 text-white rounded px-3 py-1"
                    >
                      {t('common.cancel')}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      {/* Відображення зображення категорії */}
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
                        onClick={() => {
                          setEditingCategoryId(cat._id);
                          setNewName(getCategoryName(cat.name));
                        }}
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
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        
        {/* <CategoryModal
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
          onSubmit={async (data) => {
            try {
              await createCategory({
                name: data,
                imageUrl: data.imageUrl,
              }).unwrap();
              setIsModalOpen(false);
            } catch (err) {
              console.error(err);
              alert("Помилка створення категорії");
            }
          }}
        /> */}
        <CategoryModal
  onClose={() => setIsModalOpen(false)}
  isOpen={isModalOpen}
  onSubmit={async (data) => {
    try {
      // ✅ FIX: data hat jetzt das richtige Format { ru, ro, en, imageUrl? }
      await createCategory({
        name: {
          ru: data.ru,
          ro: data.ro, 
          en: data.en
        },
        imageUrl: data.imageUrl, // imageUrl ist jetzt optional
      }).unwrap();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Помилка створення категорії");
    }
  }}
/>
      </div>
    </>
  );
};

export default AdminCategories;