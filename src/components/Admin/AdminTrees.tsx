
import { useState } from 'react';
import { useCreateTreeMutation, useGetTreesQuery } from '../../store/api/treesApi';
import TreeModal from './TreeModal';
import { Tree } from '../../types';


interface AdminTreesProps {
    selectedCategoryId: string;
  }


const AdminTrees = ({ selectedCategoryId }: AdminTreesProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: trees } = useGetTreesQuery();
  const [createTree] = useCreateTreeMutation();

    const filteredTrees = trees?.filter(tree => tree.category?._id === selectedCategoryId);

 const handleAddTree = async (treeData: Partial<Tree>) => {
    if (!treeData.title || !treeData.category?._id || !treeData.category?.name) {
      alert("Некоректні дані для створення товару");
      return;
    }

    try {
      await createTree({
        title: treeData.title,
        category: {
          _id: treeData.category._id,
          name: treeData.category.name,
        },
      }).unwrap();
      setIsModalOpen(false); 
    } catch (err) {
      alert("Ошибка создания товара");
      console.error(err);
    }
  };
  return (
    <div className="p-6 bg-white shadow rounded">
         <h3 className="text-xl font-semibold mb-4">Товари в обраній категорії:</h3>
         <button
        onClick={() => setIsModalOpen(true)}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
      >
        ➕ Додати товар
      </button>
      {filteredTrees?.map(tree => (
        <div key={tree._id}>{tree.title}</div>
      ))}

      <TreeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTree}
        initialData={{ category: { _id: selectedCategoryId, name: '' } }}
      />
   
    
     </div>
  )
}

export default AdminTrees