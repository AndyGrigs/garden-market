import { useState, lazy, Suspense } from "react";
import NotificationBell from "../../components/Admin/NotificationBell";
import { useTranslation } from 'react-i18next';

const AdminCategories = lazy(() => import("../../components/Admin/AdminCategories"));
const AdminTrees = lazy(() => import("../../components/Admin/AdminTrees"));
const AdminSellers = lazy(() => import("../../components/Admin/AdminSellers"));
const AdminNotifications = lazy(() => import("../../components/Admin/AdminNotifications"));
const AdminOrders = lazy(() => import("../../components/Admin/AdminOrders"));

const AdminPanel = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<'sellers' | 'notifications' | 'products' | 'orders'>('sellers');
  const {t} = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('header.adminPanel')}</h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
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
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.orders', { defaultValue: 'Замовлення' })}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'sellers' && (
          <div className="mb-8">
            <Suspense fallback={<div className="text-center py-8">{t('common.loading', { defaultValue: 'Завантаження...' })}</div>}>
              <AdminSellers />
            </Suspense>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="mb-8">
            <Suspense fallback={<div className="text-center py-8">{t('common.loading', { defaultValue: 'Завантаження...' })}</div>}>
              <AdminNotifications />
            </Suspense>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Suspense fallback={<div className="text-center py-8">{t('common.loading', { defaultValue: 'Завантаження...' })}</div>}>
              <AdminCategories
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />
              <AdminTrees selectedCategoryId={selectedCategoryId} />
            </Suspense>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="mb-8">
            <Suspense fallback={<div className="text-center py-8">{t('common.loading', { defaultValue: 'Завантаження...' })}</div>}>
              <AdminOrders />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;