import { TranslatedString } from '../../types/ICategories';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TranslatedString) => void;
  initialData: TranslatedString;
  categoryName: string;
}

export const EditCategoryModal = ({ isOpen, onClose, onSubmit, initialData, categoryName }: Props) => {

    if(!isOpen) return null;
     return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-bold mb-4">
          Редагувати: {categoryName}
        </h3>
        
        <p>Тут будуть поля для редагування</p>
        
        <div className="flex gap-2 mt-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Скасувати
          </button>
          <button 
            
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
}


