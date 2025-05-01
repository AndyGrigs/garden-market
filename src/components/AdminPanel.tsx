import { useState } from "react";
import { useSelector } from "react-redux";
import AdminCategories from "./Admin/AdminCategories";
import Header from "./Header";
import { RootState } from "../store/store";
import AdminTrees from "./Admin/AdminTrees";

const AdminPanel = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

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
       
        <AdminCategories
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        <AdminTrees selectedCategoryId={selectedCategoryId} />
      </main>
    </div>
  );
};

export default AdminPanel;
