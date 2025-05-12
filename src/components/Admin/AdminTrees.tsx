
import { useGetTreesQuery } from '../../store/api/treesApi';


interface AdminTreesProps {
    selectedCategoryId: string;
  }


const AdminTrees = ({ selectedCategoryId }: AdminTreesProps) => {
    const { data: trees } = useGetTreesQuery();
    const filteredTrees = trees?.filter(tree => tree.category?._id === selectedCategoryId);


  return (
    <div className="p-6 bg-white shadow rounded">
         <h3 className="text-xl font-semibold mb-4">Товари в обраній категорії:</h3>
      {filteredTrees?.map(tree => (
        <div key={tree._id}>{tree.title}</div>
      ))}
     </div>
  )
}

export default AdminTrees