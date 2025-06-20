import { useEffect, useState } from "react";
import { useGetCategoriesQuery } from "../../store/api/categoryApi";
import { Loader2 } from "lucide-react";
import { Category, TranslatedString } from "../../types/ICategories";
import { TreeFormData } from "../../types/ITree";
import { useDeleteImageMutation, useUploadImageMutation } from '../../store/api/uploadApi';
import { t } from 'i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (treeData: TreeFormData) => void;
  initialData?: TreeFormData;
}

const TreeModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const [form, setForm] = useState<TreeFormData>(
    initialData || {
      title: { ru: "", ro: "", en: "" },
      description: { ru: "", ro: "", en: "" },
      price: 0,
      stock: 0,
      category: "",
      imageUrl: "",
    }
  );

// const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

 const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const { data: categories } = useGetCategoriesQuery();

  useEffect(() => {
    if (initialData) {
      setForm({
        title: {
          ru: initialData.title?.ru ?? "",
          ro: initialData.title?.ro ?? "",
          en: initialData.title?.en ?? "",
        },
        description: {
          ru: initialData.description?.ru ?? "",
          ro: initialData.description?.ro ?? "",
          en: initialData.description?.en ?? "",
        },
        price: initialData.price ?? 0,
        stock: initialData.stock ?? 0,
        category: initialData.category ?? "",
        imageUrl: initialData.imageUrl ?? "",
      });

      // if (initialData.imageUrl) {
      //  setPreviewUrl(`https://garden-market-backend.onrender.com${initialData.imageUrl}`);
      // }
    }
  }, [initialData]);

  const handleLangChange = (
    field: keyof Pick<TreeFormData, "title" | "description">,
    lang: keyof TranslatedString,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleChange = <T extends keyof TreeFormData>(
    field: T,
    value: TreeFormData[T]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    try {
      const response = await uploadImage(formData).unwrap();
    // setImageUrl(response.imageUrl);
    setForm(prev=>({...prev, imageUrl: response.imageUrl}))
    } catch (error) {
       alert("Не вдалося завантажити фото");
      console.error(error);
    }
  }
};


const handleDeleteImage = async () => {
  if(form.imageUrl){
  try {
      const filename = form.imageUrl.split('/').pop();
      if(filename){
        await deleteImage(filename).unwrap();
        setForm(prev=>({...prev, imageUrl: ""}))

      }
    } catch (error) {
      console.error("Помилка видалення зображення", error);
        alert("Не вдалося видалити зображення");
    }
  }
  
};


  const handleSubmit = () => {
    if (!(form.title.ru ?? "").trim() || form.price <= 0 || !form.category) {
      alert("Название (ru), цена и категория обязательны");
      return;
    }

    onSubmit(form);
    setForm({
      title: { ru: "", ro: "", en: "" },
      description: { ru: "", ro: "", en: "" },
      price: 0,
      stock: 0,
      category: "",
      imageUrl: "",
    });
    // setPreviewUrl(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="bg-white w-full p-6 rounded-lg shadow-lg max-w-md max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl mb-6 text-center font-semibold">Додати товар</h3>

        <h4 className="font-semibold mb-1">Назва</h4>
        {["ru", "ro", "en"].map((lang) => (
          <input
            key={lang}
            className="border border-green-600 px-3 py-2 mb-2 rounded w-full"
            placeholder={`Назва (${lang.toUpperCase()})`}
            value={form.title[lang as keyof TranslatedString]}
            onChange={(e) =>
              handleLangChange(
                "title",
                lang as keyof TranslatedString,
                e.target.value
              )
            }
          />
        ))}

        <h4 className="font-semibold mb-1 mt-2">Опис</h4>
        {["ru", "ro", "en"].map((lang) => (
          <textarea
            key={lang}
            className="border border-green-600 px-3 py-2 mb-2 rounded w-full"
            placeholder={`Опис (${lang.toUpperCase()})`}
            value={form.description[lang as keyof TranslatedString]}
            onChange={(e) =>
              handleLangChange(
                "description",
                lang as keyof TranslatedString,
                e.target.value
              )
            }
          />
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Фото товару</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {uploading && (
            <div className='flex items-center mb-2'>
              <Loader2 className="animate-spin" />
            </div>
          )}

          {form.imageUrl &&(
            <div className='mt-2'>
              <img
                src={`https://garden-market-backend.onrender.com${form.imageUrl}`}
                alt='preview'
                className='h-40 object-cover rounded'
              />
              <button type='button' onClick={handleDeleteImage} className='mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm'>{t('dashboard.deleteImage')}</button>
            </div>
          )}
        </div>

        <input
          type="number"
          className="border px-3 py-2 rounded w-full mb-2"
          placeholder="Ціна"
          value={form.price}
          onChange={(e) => handleChange("price", Number(e.target.value))}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded w-full mb-4"
          placeholder="На складі"
          value={form.stock}
          onChange={(e) => handleChange("stock", Number(e.target.value))}
        />

        <select
          className="border px-3 py-2 rounded w-full mb-4"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="">Оберіть категорію</option>
          {categories?.map((cat: Category) => (
            <option key={cat._id} value={cat._id}>
              {cat.name.ru}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Скасувати
          </button>
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded"
          >
            Зберегти
          </button>
        </div>
      </form>
    </div>
  );
};

export default TreeModal;
