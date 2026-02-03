// src/pages/AdminPanel/AdminTrees/hooks/useAdminTrees.ts
import { useTranslation } from 'react-i18next';
import {
  useGetTreesQuery,
  useCreateTreeMutation,
  useUpdateTreeMutation,
  useDeleteTreeMutation,
} from '@/store/api/treesApi';
import { useDeleteImageMutation } from '@/store/api/uploadApi';
import { Tree, TreeFormData } from '@/types/ITree';
import toast from 'react-hot-toast';

const useAdminTrees = (selectedCategoryId: string = 'all') => {
  const { t } = useTranslation();
  
  // RTK Query hooks
  const { data: trees, isLoading, error, refetch } = useGetTreesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createTree, { isLoading: isCreating }] = useCreateTreeMutation();
  const [updateTree, { isLoading: isUpdating }] = useUpdateTreeMutation();
  const [deleteTree, { isLoading: isDeleting }] = useDeleteTreeMutation();
  const [deleteImage] = useDeleteImageMutation();

  // Filter trees by category
  const filteredTrees = selectedCategoryId === 'all'
    ? trees || []
    : (trees || []).filter((tree) => {
        const categoryId = typeof tree.category === 'string' 
          ? tree.category 
          : tree.category?._id;
        return categoryId === selectedCategoryId;
      });

  // Validation helper
  const isTreeDataValid = (treeData: TreeFormData): boolean => {
    return !!(treeData.title?.ru && treeData.title?.ro && treeData.category);
  };

  // Create tree handler
  const handleCreate = async (treeData: TreeFormData): Promise<Tree | null> => {
    if (!isTreeDataValid(treeData)) {
      toast.error(t('dashboard.invalidTreedata'));
      return null;
    }

    try {
      const newTree = await createTree({
        title: treeData.title,
        description: treeData.description,
        price: treeData.price,
        stock: treeData.stock,
        imageUrl: treeData.imageUrl,
        category: treeData.category,
      }).unwrap();
      
      toast.success(t('dashboard.treeCreated'));
      return newTree;
    } catch (err) {
      toast.error(t('dashboard.createEditTreeError'));
      console.error(err);
      return null;
    }
  };

  // Update tree handler
  const handleUpdate = async (id: string, treeData: TreeFormData): Promise<Tree | null> => {
    if (!isTreeDataValid(treeData)) {
      toast.error(t('dashboard.invalidTreedata'));
      return null;
    }

    try {
      const updatedTree = await updateTree({
        id,
        body: {
          title: treeData.title,
          description: treeData.description,
          price: treeData.price,
          stock: treeData.stock,
          imageUrl: treeData.imageUrl,
          category: treeData.category,
        },
      }).unwrap();
      
      toast.success(t('dashboard.treeUpdated'));
      return updatedTree;
    } catch (err) {
      toast.error(t('dashboard.createEditTreeError'));
      console.error(err);
      return null;
    }
  };

  // Delete tree handler
  const handleDelete = async (id: string, imageUrl?: string): Promise<boolean> => {
    if (!window.confirm(t('dashboard.deleteTreeConfirm'))) {
      return false;
    }

    try {
      // Delete image first if exists
      if (imageUrl) {
        const normalizedUrl = imageUrl.startsWith('/uploads/') 
          ? imageUrl.replace('/uploads/', '') 
          : imageUrl;
        await deleteImage(normalizedUrl).unwrap();
      }
      
      await deleteTree(id).unwrap();
      toast.success(t('dashboard.treeDeleted'));
      return true;
    } catch (err) {
      toast.error(t('dashboard.deleteTreeError'));
      console.error(err);
      return false;
    }
  };

  return {
    // Data
    trees: filteredTrees,
    allTrees: trees || [],
    
    // States
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    isProcessing: isCreating || isUpdating || isDeleting,
    
    // Handlers
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  };
};

export default useAdminTrees;
