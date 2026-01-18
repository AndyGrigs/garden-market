// ✅ ЩО ТУТ:
// - Layout сторінки
// - Імпорти компонентів
// - Об'єднання всіх частин
// - Передача props між компонентами

import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { FilterSidebar } from './components/FilterSidebar';
import { useHomePage } from './hooks/useHomePage';

export const HomePage = () => {
  // ❌ НЕ ТУТ: бізнес-логіка, API виклики, складні useState
  // ✅ ТУТ: тільки виклик custom hook
  const { 
    products, 
    filters, 
    handleFilterChange,
    isLoading 
  } = useHomePage();

  return (
    <div className="home-page">
      <HeroSection />
      
      <div className="flex gap-8">
        <FilterSidebar 
          filters={filters}
          onChange={handleFilterChange}
        />
        
        <ProductGrid 
          products={products}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};