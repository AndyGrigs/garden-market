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

  const [newCategory, setNewCategory] = useState('');
  const [newName, setNewName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string>("");

  const handleCreate = async () => {
    if (!newCategory?.trim()) return; // якщо поле порожнє, нічого не робимо
    try {
      await createCategory({ name: newCategory }).unwrap(); // створити категорію
      setNewCategory(""); // очистити поле
    } catch (err) {
      console.log(err);
      alert("Помилка створення категорії");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю категорію?")) {
      try {
        await deleteCategory(id).unwrap();
      } catch {
        alert("Не вдалося видалити");
      }
    }
  };

  const handleUpdate = async (id: string) => {
    if (!newName?.trim()) return;
    try {
      await updateCategory({ id, name: newName }).unwrap();
      setEditingCategoryId('');
      setNewName("");
    } catch {
      alert("Не вдалося оновити категорію");
    }
  };

  return (
    <div className="p-6 bg-white shadow">
      <h2 className="text-2xl font-bold mb-4">Категорії</h2>
      <div className="flex mb-4">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Нова категорія"
          className="border px-3 py-2 rounded mr-2 w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Створити
        </button>
      </div>

      {isLoading ? (
  <p>Завантаження...</p>
) : (
  <ul className="space-y-2">
    {categories?.map((cat) => (
      <li key={cat._id} className="flex justify-between items-center border-b pb-2">
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
              Зберегти
            </button>
            <button
              onClick={() => {
                setEditingCategoryId('');
                setNewName('');
              }}
              className="bg-gray-400 text-white rounded px-3 py-1"
            >
              Скасувати
            </button>
          </>
        ) : (
          <>
            <span>{cat.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingCategoryId(cat._id);
                  setNewName(cat.name);
                }}
                className="text-blue-500 text-sm hover:underline"
              >
                Редагувати
              </button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-red-500 text-sm hover:underline"
              >
                Видалити
              </button>
            </div>
          </>
        )}
      </li>
    ))}
  </ul>
)}

    </div>
  );
};

export default AdminCategories;
