import { useTranslation } from "react-i18next";

import { TrendingUp, Package, DollarSign, AlertCircle } from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage';
import { Tree } from '@/types/ITree';
import { getCurrency } from '@/shared/helpers/getCurrency';


// Define TranslatedString type for category names and titles
type TranslatedString = {
  ru?: string;
  en?: string;
  ro?: string;
};


interface SellerStatsProps {
  trees: Tree[];
}

const SellerStats = ({ trees }: SellerStatsProps) => {
  const { t } = useTranslation();
  const lang = useLanguage();

  const getTreeTitle = (title: { [key: string]: string }) => {
    return title?.[lang] || title?.en || title?.ru || "Unknown";
  };

  // Розрахунок статистики
  const totalProducts = trees.length;
  const activeProducts = trees.filter(tree => tree.isActive).length;
  const inactiveProducts = totalProducts - activeProducts;
  const totalStock = trees.reduce((sum, tree) => sum + (tree.stock || 0), 0);
  const totalValue = trees.reduce((sum, tree) => sum + (tree.price * (tree.stock || 0)), 0);
  const averagePrice = totalProducts > 0 ? trees.reduce((sum, tree) => sum + tree.price, 0) / totalProducts : 0;
  
  // Продукти з низьким запасом (менше 5)
  const lowStockProducts = trees.filter(tree => tree.stock < 5);
  
  const categoryStats = trees.reduce((acc, tree) => {
    // Use type assertion to safely access the translation
    const nameObj = tree.category?.name as TranslatedString | undefined;
    const categoryName =
      (nameObj && nameObj[lang as keyof TranslatedString]) ||
      t('common.noCategory', { defaultValue: 'Без категории' });
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // // Категорії товарів
  // const categoryStats = trees.reduce((acc, tree) => {
  //   const categoryName = tree.category?.name?.[lang as keyof TranslatedString] || t('common.noCategory', { defaultValue: 'Без категорії' }); || t('common.noCategory', { defaultValue: 'Без категорії' });
  //   acc[categoryName] = (acc[categoryName] || 0) + 1;
  //   return acc;
  // }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Загальна статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">{t('seller.stats.totalProducts', { defaultValue: 'Всего товаров' })}</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">{t('seller.stats.activeProducts', { defaultValue: 'Активных' })}</p>
              <p className="text-2xl font-bold">{activeProducts}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">{t('seller.stats.totalStock', { defaultValue: 'Общий запас' })}</p>
              <p className="text-2xl font-bold">{totalStock}</p>
            </div>
            <Package className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">{t('seller.stats.totalValue', { defaultValue: 'Общая стоимость' })}</p>
              <p className="text-2xl font-bold">{totalValue.toLocaleString()} {getCurrency()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Детальна статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Продукти з низьким запасом */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              {t('seller.stats.lowStock', { defaultValue: 'Низкий запас' })}
            </h3>
          </div>
          
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500">
              {t('seller.stats.noLowStock', { defaultValue: 'Все товары имеют достаточный запас' })}
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((tree) => (
                <div key={tree._id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{getTreeTitle(tree.title)}</p>
                    <p className="text-sm text-gray-600">{tree.price} {getCurrency()}</p>
                  </div>
                  <span className="px-2 py-1 bg-orange-200 text-orange-800 text-sm rounded-full">
                    {tree.stock} шт.
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Статистика по категоріях */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('seller.stats.byCategories', { defaultValue: 'По категориям' })}
          </h3>
          
          {Object.keys(categoryStats).length === 0 ? (
            <p className="text-gray-500">
              {t('seller.stats.noCategories', { defaultValue: 'Нет товаров с категориями' })}
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-700">{category}</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {count} {t('common.pieces', { defaultValue: 'шт.' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Додаткова інформація */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('seller.stats.additionalInfo', { defaultValue: 'Дополнительная информация' })}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{averagePrice.toFixed(0)} {getCurrency()}</p>
            <p className="text-sm text-gray-600">
              {t('seller.stats.averagePrice', { defaultValue: 'Средняя цена' })}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{inactiveProducts}</p>
            <p className="text-sm text-gray-600">
              {t('seller.stats.inactiveProducts', { defaultValue: 'Неактивных товаров' })}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            {/* <p className="text-2xl font-bold text-emerald-600">
              {mostExpensiveProduct.price} {getCurrency()}
            </p> */}
            <p className="text-sm text-gray-600">
              {t('seller.stats.mostExpensive', { defaultValue: 'Самый дорогой товар' })}
            </p>
          </div>
        </div>
{/* 
        {mostExpensiveProduct.title && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              {t('seller.stats.mostExpensiveProduct', { defaultValue: 'Найдорожчий товар' })}:
            </p>
            <p className="font-medium text-emerald-800">
              {getTreeTitle(mostExpensiveProduct.title)}
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SellerStats;