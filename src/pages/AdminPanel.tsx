import { useState } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import AdminCategories from "../components/Admin/AdminCategories";
import AdminTrees from "../components/Admin/AdminTrees";

const AdminPanel = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <Link
            to="/"
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Main Page</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AdminCategories
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
          <AdminTrees selectedCategoryId={selectedCategoryId} />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;