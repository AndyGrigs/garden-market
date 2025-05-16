import { useState } from "react";

import AdminCategories from "../components/Admin/AdminCategories";
import AdminTrees from "../components/Admin/AdminTrees";

const AdminPanel = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  return (
    <div className="p-20">
      <AdminCategories
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />
     <AdminTrees selectedCategoryId={selectedCategoryId}/>
    </div>
  );
};

export default AdminPanel;
