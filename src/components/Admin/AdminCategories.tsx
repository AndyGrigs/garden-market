import { useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../store/api/categoryApi";

const AdminCategories = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const [newCategory, setNewCategory] = useState();
  const [newName, setNewName] = useState();
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  return <div className="p-6 bg-white shadow" >
    <h2 className="text-2xl font-bold mb-4">Категорії</h2>
  </div>;
};

export default AdminCategories;
