// ✅ ЩО ТУТ:
// - useState для локального стану
// - useEffect для side effects
// - API виклики (RTK Query hooks)
// - Обробка фільтрів
// - Пагінація логіка
// - Сортування

import { useState, useEffect } from 'react';
import { useGetTreesQuery } from '@/store/api/treesApi';
import { Tree } from '@/types/ITree';

export interface HomePageFilters {
  categoryId: string | null;
  priceRange: [number, number];
  inStock: boolean;
}

export const useHomePage = () => {
  // Локальні стани
  const [filters, setFilters] = useState<HomePageFilters>({
    categoryId: null,
    priceRange: [0, 1000],
    inStock: true
  });

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  // API виклики
  const { data: allProducts, isLoading, error } = useGetTreesQuery();

  // Фільтрація та сортування продуктів
  const products = allProducts?.filter((product: Tree) => {
    // Фільтр по категорії
    if (filters.categoryId) {
      const categoryId = typeof product.category === 'object' && product.category !== null
        ? product.category._id
        : product.category;
      if (categoryId !== filters.categoryId) return false;
    }

    // Фільтр по ціні
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Фільтр по наявності
    if (filters.inStock && product.stock <= 0) {
      return false;
    }

    return true;
  }).sort((a: Tree, b: Tree) => {
    if (sortBy === 'price') {
      return a.price - b.price;
    }
    // Sort by name (ru)
    return a.title.ru.localeCompare(b.title.ru);
  }) || [];

  // Обробники подій
  const handleFilterChange = (newFilters: Partial<HomePageFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset пагінації при зміні фільтрів
  };

  const handleSortChange = (newSort: 'name' | 'price') => {
    setSortBy(newSort);
  };

  // Side effects
  useEffect(() => {
    // Логіка при зміні фільтрів
    console.log('Filters changed:', filters);
  }, [filters]);

  // Повертаємо все, що потрібно компонентам
  return {
    products,
    isLoading,
    error,
    filters,
    sortBy,
    page,
    handleFilterChange,
    handleSortChange,
    setPage
  };
};