import React from 'react';
import { Tree } from '../types';
import { Ruler, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TreeCardProps {
  tree: Tree;
  onAddToCart: (tree: Tree) => void;
}

export default function TreeCard({ tree, onAddToCart }: TreeCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={tree.image}
        alt={tree.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{tree.name}</h3>
        <p className="text-gray-600 mb-4">{t(`tree.descriptions.${tree.id}`)}</p>
        <div className="flex items-center space-x-4 mb-4 text-gray-600">
          <div className="flex items-center">
            <Ruler className="h-4 w-4 mr-1" />
            <span>{t('tree.height')}: {tree.height}</span>
          </div>
          <div className="flex items-center">
            <Droplets className="h-4 w-4 mr-1" />
            <span>{t(`tree.maintenance.${tree.maintenance.toLowerCase()}`)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-600">
            ${tree.price.toFixed(2)}
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