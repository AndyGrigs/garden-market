import { useState } from "react";
import { useSelector } from "react-redux";
import AdminCategories from "./Admin/AdminCategories";
import Header from "./Header";
import { RootState } from "../store/store";
import AdminTrees from "./Admin/AdminTrees";
import CategoryModal from "./Admin/CategoryModal";
import { useCreateCategoryMutation } from "../store/api/categoryApi";

const AdminPanel = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [createCategory] = useCreateCategoryMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);


  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={0}
        onCartClick={() => {}}
        isAuthenticated={isAuthenticated}
      />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Адмін-панель</h1>
        <button
        onClick={() => setIsModalOpen(pr=>!pr)}
        className="bg-emerald-600 mr-auto text-white px-4 py-2 rounded mb-4"
      >
        ➕ Додати категорію
      </button>
       
        <AdminCategories
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        <AdminTrees selectedCategoryId={selectedCategoryId} />
        
      <CategoryModal
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        onSubmit={async (data) => {
          try {
            await createCategory({ name: JSON.stringify(data) }).unwrap();
            setIsModalOpen(false);
          } catch (err) {
            console.error(err);
            alert("Помилка створення категорії");
          }
        }}
      />
      </main>
    </div>
  );
};

export default AdminPanel;
