import AdminCategories from "./Admin/AdminCategories"

const AdminPanel = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Адмін-панель</h1>
      <AdminCategories />
      {/* Тут потім буде AdminProducts */}
    </div>
  )
}

export default AdminPanel