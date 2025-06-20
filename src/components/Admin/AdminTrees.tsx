import { useState } from "react";
import {
  useCreateTreeMutation,
  useGetTreesQuery,
} from "../../store/api/treesApi";
import TreeModal from "./TreeModal";
import { TreeFormData } from "../../types/ITree";
import { useDeleteImageMutation } from '../../store/api/uploadApi';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from 'i18next';

interface AdminTreesProps {
  selectedCategoryId: string;
}

const AdminTrees = ({ selectedCategoryId }: AdminTreesProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: trees, isLoading } = useGetTreesQuery();
  const [createTree] = useCreateTreeMutation();
  const [deleteTree] = useDeleteImageMutation();
  const lang = useLanguage();

  const filteredTrees = trees?.filter(
    (tree) => tree.category?._id === selectedCategoryId
  );

  const handleAddTree = async (treeData: TreeFormData) => {
  if (
    !treeData.title?.ru ||
    !treeData.title?.en ||
    !treeData.title?.ro ||
    !treeData.category
  ) {
    alert("Некоректні дані для створення товару");
    return;
  }

  try {
    await createTree({
      title: treeData.title,
      description: treeData.description,
      price: treeData.price,
      stock: treeData.stock,
      imageUrl: treeData.imageUrl,
      category: {
        _id: treeData.category,
        name: {
          ru: "", ro: "", en: "", 
        },
      },
    }).unwrap();

    setIsModalOpen(false);
  } catch (err) {
    alert("Ошибка создания товара");
    console.error(err);
  }
};

const handleDeleteTree = async (id: string) => {
  if (window.confirm(t('dashboard.deleteTreeConfirm'))) {
    try {
      await deleteTree(id).unwrap();
    } catch (error) {
      alert('Ошибка удаления товара...')
      console.error(error)
    }
  }
}
const getTreeTitle = (title: { [key: string]: string }) => {
  return title?.[lang] || "";
}

if (!selectedCategoryId) {
    return (
      <div className="p-6 bg-white shadow rounded">
        <h3 className="text-xl font-semibold mb-4">
            Выберите категорию для просмотра товаров
        </h3>
      </div>
    );
  }

return(
    <div className="p-6 bg-white shadow rounded">
      <h3 className="text-xl font-semibold mb-4">
        Товары в избранной категории
      </h3>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
      >
        ➕ Добавить товар
      </button>
       {isLoading ? (
        <div className="text-center">Загрузка...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrees?.map((tree) => (
            <div key={tree._id} className="border rounded-lg p-4 shadow-sm">
              {tree.imageUrl && (
                <img
                  src={`https://garden-market-backend.onrender.com${tree.imageUrl}`}
                  alt={getTreeTitle(tree.title)}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <h4 className="font-semibold text-lg mb-2">
                {getTreeTitle(tree.title)}
              </h4>
              <p className="text-gray-600 mb-2">
                Цена: ₴{tree.price}
              </p>
              <p className="text-gray-600 mb-2">
                В наличии: {tree.stock}
              </p>
              <button
                onClick={() => handleDeleteTree(tree._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}

      <TreeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTree}
        initialData={{
          title: { ru: "", ro: "", en: "" },
          description: { ru: "", ro: "", en: "" },
          price: 0,
          stock: 0,
          imageUrl: "",
          category: selectedCategoryId,
        }}
      />
    </div>
  );
};

export default AdminTrees;
