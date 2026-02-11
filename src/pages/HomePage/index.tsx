// ✅ ЩО ТУТ:
// - Layout сторінки
// - Імпорти компонентів
// - Об'єднання всіх частин
// - Передача props між компонентами

import { useOutletContext } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { ResponsiveFilterLayout } from './components/ResponsiveFilterLayout';
import { useHomePage } from './hooks/useHomePage';

interface HomePageContext {
  isCategoryFilterOpen: boolean;
  setIsCategoryFilterOpen: (open: boolean) => void;
}

export const HomePage = () => {
  // ❌ НЕ ТУТ: бізнес-логіка, API виклики, складні useState
  // ✅ ТУТ: тільки виклик custom hook
  const {
    products,
    filters,
    handleFilterChange,
    isLoading
  } = useHomePage();

  const { isCategoryFilterOpen, setIsCategoryFilterOpen } = useOutletContext<HomePageContext>();

  return (
    <div className="home-page">
      <HeroSection />

      <ResponsiveFilterLayout
        filters={filters}
        onChange={handleFilterChange}
        products={products}
        isLoading={isLoading}
        isCategoryFilterOpen={isCategoryFilterOpen}
        onCategoryFilterClose={() => setIsCategoryFilterOpen(false)}
      />
    </div>
  );
};