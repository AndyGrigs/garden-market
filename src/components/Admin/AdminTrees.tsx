import { useState } from "react";
import {
  useCreateTreeMutation,
  useGetTreesQuery,
  useUpdateTreeMutation,
  useDeleteTreeMutation,
} from "../../store/api/treesApi";
import TreeModal from "./TreeModal";
import { Tree, TreeFormData } from "../../types/ITree";
import { useDeleteImageMutation } from '../../store/api/uploadApi';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from 'i18next';
import { BASE_URL } from '../../config';

interface AdminTreesProps {
  selectedCategoryId: string;
}

const AdminTrees = ({ selectedCategoryId }: AdminTreesProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTreeData, setEditTreeData] = useState<TreeFormData | null>(null);
  // const { data: trees, isLoading } = useGetTreesQuery();
  const { data: trees, isLoading } = useGetTreesQuery(undefined, {
  refetchOnMountOrArgChange: true,
});
  const [createTree] = useCreateTreeMutation();
  const [updateTree] = useUpdateTreeMutation();
  const [deleteTree] = useDeleteTreeMutation();
  const [deleteImage] = useDeleteImageMutation();
  const lang = useLanguage();

  const filteredTrees = trees?.filter(
    (tree) => tree.category?._id === selectedCategoryId
  );

  const isTreeDataValid = (treeData: TreeFormData) => {
    return treeData.title?.ru && treeData.title?.en && treeData.title?.ro && treeData.category;
  };

  const handleDeleteTree = async (id: string, imageUrl?: string) => {
    if (window.confirm(t('dashboard.deleteTreeConfirm'))) {
      try {
        if (imageUrl) {
          const normalizedUrl = imageUrl.startsWith("/uploads/") ? imageUrl.replace("/uploads/", "") : imageUrl;
          await deleteImage(normalizedUrl).unwrap();
        }
        await deleteTree(id).unwrap();
      } catch (error) {
        alert('Ошибка удаления товара...');
        console.error(error);
      }
    }
  };

  const getTreeTitle = (title: { [key: string]: string }) => {
    return title?.[lang] || "";
  };

  const handleEditTree = (tree: Tree) => {
      setEditTreeData({
        title: tree.title,
        description: tree.description,
        price: tree.price,
        stock: tree.stock,
        imageUrl: tree.imageUrl,
        category: tree.category?._id || "",
        _id: tree._id,
      });
      setIsModalOpen(true);
    };

  const handleSubmitTree = async (treeData: TreeFormData) => {
    if (!isTreeDataValid(treeData)) {
      alert("Некоректні дані для створення/редагування товару");
      return;
    }

    try {
      if (editTreeData && editTreeData._id) {
        await updateTree({
          id: editTreeData._id,
          body: {
            ...treeData,
            category: {
              name: { ru: "", ro: "", en: "" },
            },
          },
        }).unwrap();
      } else {
        await createTree({
          title: treeData.title,
          description: treeData.description,
          price: treeData.price,
          stock: treeData.stock,
          imageUrl: treeData.imageUrl,
          category: {
            _id: treeData.category,
            name: { ru: "", ro: "", en: "" },
          },
        }).unwrap();
      }
      setIsModalOpen(false);
      setEditTreeData(null);
    } catch (err) {
      alert("Ошибка создания/редактирования товара");
      console.error(err);
    }
  };

  if (!selectedCategoryId) {
    return (
      <div className="p-6 bg-white shadow rounded">
        <h3 className="text-xl font-semibold mb-4">
          Выберите категорию для просмотра товаров
        </h3>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded">
      <h3 className="text-xl font-semibold mb-4">
        Товары в избранной категории
      </h3>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-emerald-600 text-white px-4 py-2 mb-3 ml-auto rounded hover:bg-emerald-700"
      >
        ➕ Добавить товар
      </button>
      {isLoading ? (
        <div className="text-center">Загрузка...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrees?.map((tree) => (
            <div key={tree._id} className="border rounded-lg p-4 shadow-sm">

              <img
                src={tree.imageUrl ? `${BASE_URL}${tree.imageUrl}` : "/placeholder.jpg"}
                alt={getTreeTitle(tree.title)}
                className="w-full h-32 object-cover rounded mb-2"
              />
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
                onClick={() => handleEditTree(tree)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 mr-2"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDeleteTree(tree._id, tree.imageUrl)}
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
        onClose={() => {
          setIsModalOpen(false);
          setEditTreeData(null);
        }}
        onSubmit={handleSubmitTree}
        initialData={editTreeData || {
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
