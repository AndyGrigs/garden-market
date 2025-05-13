import { useEffect, useState } from "react";
import { Tree } from "../../types";
import { useGetCategoriesQuery } from "../../store/api/categoryApi";
import { Category } from "../../types/ICategories";
import { Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (treeData: Partial<Tree>) => void;
  initialData?: Partial<Tree>;
}

const TreeModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const [formData, setFormData] = useState<Partial<Tree>>(initialData || {});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: categories } = useGetCategoriesQuery();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.imageUrl) setPreviewUrl(initialData.imageUrl);
    }
  }, [initialData]);

  const handleChange = (
    field: keyof Tree,
    value: string | number | Category | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);
    setUploading(true);

    try {
      const res = await fetch("http://localhost:4444/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
      setPreviewUrl(`http://localhost:4444${data.imageUrl}`);
    } catch (err) {
      alert("Не удалось загрузить фото");

      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.price || !formData.category) {
      alert("Заполните обязательные поля: Название, Цена, Категория");
      return;
    }
    onSubmit(formData);
    setFormData({});
    setPreviewUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  z-50 flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="bg-white w-full p-6 rounded-lg shadow-lg max-w-md"
      >
        <h3 className="text-xl mb-6 text-center font-semibold">
          Добавить товар
        </h3>

        <input
          className="border border-green-600 px-3 py-2 mb-4 rounded w-full "
          placeholder="Название"
          value={formData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <input
          className="border border-green-600 px-3 py-2 mb-4 rounded w-full "
          placeholder="Описание"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />

  
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Фото товара</label>
          <input type="file" accept="image/*" onChange={handleFileUpload}/>
          {uploading && <Loader2/>}
          {previewUrl && (
            <img 
            src={previewUrl}
            alt="preview" 
            className="mt-2 h-40 object-cover rounded"
            />
          )}
        </div>
        <input
          type="number"
          className="border border-green-600 px-3 py-2 mb-4 rounded w-full "
          placeholder="Цена"
          value={formData.price || ""}
          onChange={(e) => handleChange("price", e.target.value)}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded w-full mb-2"
          placeholder="Количество на складе"
          value={formData.stock || ""}
          onChange={(e) => handleChange("stock", Number(e.target.value))}
        />

        <select
          className="border px-3 py-2 rounded w-full mb-4"
          value={
            typeof formData.category === "string"
              ? formData.category
              : formData.category?._id || ""
          }
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
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Отменить
          </button>
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 text-white px-4 py-2 rounded"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default TreeModal;
