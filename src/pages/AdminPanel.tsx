import { useState } from "react";
import AdminCategories from "../components/Admin/AdminCategories";
import AdminTrees from "../components/Admin/AdminTrees";
import AdminSellers from "../components/Admin/AdminSellers";
import AdminNotifications from "../components/Admin/AdminNotifications";
import NotificationBell from "../components/Admin/NotificationBell";
import { useTranslation } from 'react-i18next';
import MainPageLink from '../shared/MainPageLink';

const AdminPanel = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<'sellers' | 'notifications' | 'products'>('sellers');
  const {t} = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('header.adminPanel')}</h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <MainPageLink/>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('sellers')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'sellers'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.sellers')}
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.notifications')}
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'products'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.products')}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'sellers' && (
          <div className="mb-8">
            <AdminSellers />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="mb-8">
            <AdminNotifications />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AdminCategories
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />
            <AdminTrees selectedCategoryId={selectedCategoryId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;