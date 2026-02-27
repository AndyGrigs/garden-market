import { useState, lazy, Suspense } from "react";
import { useTranslation } from 'react-i18next';
import NotificationBell from "./AdminPanel/NotificationBell";
import AdminPendingTrees from "./AdminPanel/AdminNotifications/components/AdminPendingTrees";
import AdminAllSellers from "./AdminPanel/AdminSellers/components/AdminAllSellers";

const AdminCategories = lazy(() => import("./AdminPanel/AdminCategories"));
const AdminTrees = lazy(() => import("./AdminPanel/AdminTrees"));
const AdminSellers = lazy(() => import("./AdminPanel/AdminSellers"));
// const AdminNotifications = lazy(() => import("../components/Admin/AdminNotifications"));
const AdminNotifications = lazy(() => import("./AdminPanel/AdminNotifications"));
const AdminOrders = lazy(() => import("./AdminPanel/AdminOrders"));

const AdminPanel = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<'sellers' | 'allSellers' | 'notifications' | 'products' | 'pendingTrees' | 'orders'>('sellers');
  const {t} = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:p-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('header.adminPanel')}</h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex flex-wrap gap-x-4 sm:gap-x-8">
            <button
              onClick={() => setActiveTab('sellers')}
              className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'sellers'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.sellers')}
            </button>
            <button
              onClick={() => setActiveTab('allSellers')}
              className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'allSellers'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.allSellers')}
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'notifications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.notifications')}
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'products'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.products')}
            </button>
            <button
              onClick={() => setActiveTab('pendingTrees')}
              className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'pendingTrees'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.pendingTrees')}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'orders'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.orders')}
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

        {activeTab === 'allSellers' && (
          <div className="mb-8">
            <AdminAllSellers />
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

        {activeTab === 'pendingTrees' && (
          <div className="mb-8">
            <Suspense fallback={<div className="text-center py-8">{t('common.loading', { defaultValue: 'Завантаження...' })}</div>}>
                <AdminPendingTrees/>
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
