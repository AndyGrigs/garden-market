import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateTreeMutation,
  useGetTreesQuery,
  useUpdateTreeMutation,
  useDeleteTreeMutation,
} from "../../store/api/treesApi";
import { setTrees, addTree, updateTree as updateTreeAction, removeTree, setEditingTree } from "../../store/slices/treeSlice";
import TreeModal from "./TreeModal";
import { Tree, TreeFormData } from "../../types/ITree";
import { useDeleteImageMutation } from '../../store/api/uploadApi';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from 'i18next';
import { BASE_URL } from '../../config';
import { RootState } from "../../store/store";

interface AdminTreesProps {
  selectedCategoryId: string;
}

const AdminTrees = ({ selectedCategoryId }: AdminTreesProps) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { trees, editingTree } = useSelector((state: RootState) => state.tree);
  

  const { data: apiTrees, isLoading } = useGetTreesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createTree] = useCreateTreeMutation();
  const [updateTree] = useUpdateTreeMutation();
  const [deleteTree] = useDeleteTreeMutation();
  const [deleteImage] = useDeleteImageMutation();
  const lang = useLanguage();

  useEffect(() => {
    if (apiTrees) {
      dispatch(setTrees(apiTrees));
    }
  }, [apiTrees, dispatch]);

  const filteredTrees = trees.filter(
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
        // Update Redux store
        dispatch(removeTree(id));
      } catch (error) {
        alert(t('dashboard.deleteTreeError'));
        console.error(error);
      }
    }
  };

  const getTreeTitle = (title: { [key: string]: string }) => {
    return title?.[lang] || "";
  };

  const handleEditTree = (tree: Tree) => {
    dispatch(setEditingTree(tree));
    setIsModalOpen(true);
  };

  const handleSubmitTree = async (treeData: TreeFormData) => {
    if (!isTreeDataValid(treeData)) {
      alert(t('dashboard.invalidTreedata'));
      return;
    }

    try {
      if (editingTree && editingTree._id) {
       
        const updatedTree = await updateTree({
          id: editingTree._id,
          body: {
            ...treeData,
            category: {
              _id: treeData.category,
              name: { ru: "", ro: "", en: "" },
            },
          },
        }).unwrap();
        
        // Update Redux store
        dispatch(updateTreeAction(updatedTree));
      } else {
        // Create new tree
        const newTree = await createTree({
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
        
        // Update Redux store
        dispatch(addTree(newTree));
      }
      
      setIsModalOpen(false);
      dispatch(setEditingTree(null));
    } catch (err) {
      alert(t('dashboard.createEditTreeError'));
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setEditingTree(null));
  };

  if (!selectedCategoryId) {
    return (
      <div className="p-6 bg-white shadow rounded">
        <h3 className="text-xl font-semibold mb-4">
          {t('dashboard.selectCategoryPrompt')}
        </h3>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded">
      <h3 className="text-xl font-semibold mb-4">
        {t('dashboard.selectedCategoryProducts')}
      </h3>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-emerald-600 text-white px-4 py-2 mb-3 ml-auto rounded hover:bg-emerald-700"
      >
        ➕ {t('dashboard.addProduct')}
      </button>
      {isLoading ? (
        <div className="text-center">{t('collection.loading')}</div>
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
               { t('tree.priceLabel', { price: tree.price })}
              </p>
              {/* <p className="text-gray-600 mb-2">
                t('tree.inStockLabel', { stock: tree.stock })
              </p> */}
              <button


                onClick={() => handleEditTree(tree)}
                className="bg-yellow-500 mb-3 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 mr-2"
              >
               {t('dashboard.edit')}
              </button>
              <button
                onClick={() => handleDeleteTree(tree._id, tree.imageUrl)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                {t('dashboard.delete')}
              </button>
            </div>
          ))}
        </div>
      )}

      <TreeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTree}
        initialData={editingTree ? {
          title: editingTree.title,
          description: editingTree.description,
          price: editingTree.price,
          stock: editingTree.stock,
          imageUrl: editingTree.imageUrl,
          category: editingTree.category?._id || selectedCategoryId,
          _id: editingTree._id,
        } : {
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