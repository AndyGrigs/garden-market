
// import { Ruler, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from '@/config';
import { useTreeDescription, useTreeTitle } from '@/hooks/useTreeTranslations';
import { Tree } from '@/types/ITree';
import { getCurrency } from '@/shared/helpers/getCurrency';


interface TreeCardProps {
  tree: Tree;
  onAddToCart: (tree: Tree) => void;
}

export default function TreeCard({ tree, onAddToCart }: TreeCardProps) {
  const { t } = useTranslation();
  const getTreeTitle = useTreeTitle();
  const getTreeDescription = useTreeDescription();


  return (

    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img
     src={
    tree.imageUrl
      ? `${BASE_URL}${tree.imageUrl}`
      : '/placeholder.png'
  }
      
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
       <h3 className="text-xl font-bold text-gray-800 mb-2">
          {getTreeTitle(tree.title)}
        </h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {getTreeDescription(tree.description)}
        </p>

      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-emerald-600">
          {tree.price.toFixed(2)} {getCurrency()}
        </span>
        <button
          onClick={() => onAddToCart(tree)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors"
        >
          {t('tree.addToCart')}
        </button>
      </div>
    </div>
  </div>
  );
}