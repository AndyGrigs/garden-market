import { useState } from "react";
import { Package, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetSellerTreesQuery } from "@/store/api/sellerApi";
import SellerTrees from './SellerTrees';
import SellerStats from './SellerStats';
import MainPageLink from '@/shared/MainPageLink';


const SellerDashboard = () => {
  const { t } = useTranslation();
  const { data: sellerData, isLoading } = useGetSellerTreesQuery();
  const [activeTab, setActiveTab] = useState<'products' | 'stats'>('products');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('seller.dashboard.title', { defaultValue: 'Панель продавца' })}
          </h1>
         <MainPageLink/>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t('seller.stats.totalProducts', { defaultValue: 'Всего товаров' })}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {sellerData?.trees?.length || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t('seller.stats.activeProducts', { defaultValue: 'Активных товаров' })}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {sellerData?.trees?.filter(tree => tree.isActive)?.length || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t('seller.stats.totalStock', { defaultValue: 'Общий запас' })}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {sellerData?.trees?.reduce((sum, tree) => sum + (tree.stock || 0), 0) || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'products'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('seller.myProducts', { defaultValue: 'Мои товары' })}
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'stats'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('seller.tabs.statistics', { defaultValue: 'Статистика' })}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <SellerTrees 
                trees={sellerData?.trees || []} 
                isLoading={isLoading} 
              />
            )}
            {activeTab === 'stats' && (
              <SellerStats trees={sellerData?.trees || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;