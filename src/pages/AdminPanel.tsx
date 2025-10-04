import { useState } from "react";
import AdminCategories from "../components/Admin/AdminCategories";
import AdminTrees from "../components/Admin/AdminTrees";
import { t } from 'i18next';
import MainPageLink from '../shared/MainPageLink';

const AdminPanel = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('header.adminPanel')}</h1>
          <MainPageLink/>
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