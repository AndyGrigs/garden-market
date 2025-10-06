import { Category } from '../../types/ICategories';

export const getCategoryName = (category: Category | undefined, lang: string = 'ru') => {
    return (
      category?.name?.[lang as keyof typeof category.name] ||
      category?.name?.ru ||
      category?.name?.ro ||
      'Unknown'
    );
  };