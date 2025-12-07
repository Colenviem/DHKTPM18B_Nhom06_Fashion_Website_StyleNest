import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiEdit, FiTrash2, FiAlertCircle } from "react-icons/fi";

import axiosClient from "../../api/axiosClient";

import { CategoriesContext } from "../../context/CategoriesContext";
import AddCategoryForm from "../form/AddCategoryForm";
import EditCategoryForm from "../form/EditCategoryForm";

const formatDateTime = (isoString) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString("vi-VN");
    const timePart = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart} ${timePart}`;
  } catch {
    return "Invalid Date";
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.1, staggerChildren: 0.05 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};


const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
      <td className="px-6 py-4 text-center"><div className="h-6 w-12 bg-gray-200 rounded-full mx-auto"></div></td>
      <td className="px-6 py-4 text-center"><div className="h-6 w-12 bg-gray-200 rounded-full mx-auto"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
    </tr>
);

const CategorieListsTable = () => {

  const [categoriesData, setCategoriesData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {

        const response = await axiosClient.get("/categories");

        setCategoriesData(response.data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải danh sách danh mục:", err);
        const errorMsg = err.response?.data?.message || "Không thể tải dữ liệu. Bạn có thể chưa đăng nhập hoặc không có quyền.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categoriesData.filter((category) => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
        category.name.toLowerCase().includes(lowerCaseSearch) ||
        category.description.toLowerCase().includes(lowerCaseSearch) ||
        category.id.toLowerCase().includes(lowerCaseSearch)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa danh mục có ID ${id}?`)) return;

    try {
      await axiosClient.delete(`/categories/${id}`);

      setCategoriesData(categoriesData.filter((c) => c.id !== id));
      alert("🗑️ Xóa thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Xóa thất bại!");
    }
  };

  return (
      <div className="p-6 pt-24 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Danh sách Danh mục
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
          {/* Thanh Search Input */}
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            />
          </div>

          <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-1.5">
            <AddCategoryForm />
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            {/* --- HEADER --- */}
            <thead className="bg-gray-50">
            <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Tên Danh mục</th>
              <th className="px-6 py-4 text-left">Mô tả</th>
              <th className="px-6 py-4 text-left">Banner</th>
              {/* <th className="px-6 py-4 text-left">Ngày tạo</th> */}
              {/* <th className="px-6 py-4 text-left">Cập nhật cuối</th> */}
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
            </thead>

            <motion.tbody className="bg-white divide-y divide-gray-100">
              {loading && (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
              )}
              {/* Error */}
              {!loading && error && (
                  <tr className="border-t border-gray-100">
                    <td
                        colSpan="5"
                        className="text-center py-8 text-red-500 italic"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <FiAlertCircle />
                        {error}
                      </div>
                    </td>
                  </tr>
              )}
              {/* Empty */}
              {!loading && !error && filteredCategories.length === 0 && (
                  <tr className="border-t border-gray-100">
                    <td
                        colSpan="6"
                        className="text-center py-8 text-gray-500 italic"
                    >
                      {categoriesData.length === 0
                          ? "Không có danh mục nào trong hệ thống."
                          : `Không tìm thấy danh mục nào phù hợp với từ khóa "${searchTerm}".`}
                    </td>
                  </tr>
              )}
              {!loading && !error && filteredCategories.map((category) => (
                  <motion.tr
                      key={category.id}
                      variants={rowVariants}
                      className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {category.id}
                    </td>

                    {/* Tên Danh mục */}
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {category.name}
                    </td>

                    {/* Mô tả */}
                    <td
                        className="px-6 py-4 text-gray-500 max-w-xs truncate"
                        title={category.description}
                    >
                      {category.description}
                    </td>

                    {/* Banner (Image) */}
                    <td className="px-6 py-4">
                      <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-10 h-10 object-cover rounded-md shadow-sm border border-gray-200"
                      />
                    </td>

                    {/* Hành động (Thêm mới) */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center items-center gap-2">
                        <button
                            title="Sửa"
                            className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100"
                            onClick={() => setEditingCategory(category)} // mở modal sửa
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                            title="Xóa"
                            className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                            onClick={() => handleDelete(category.id)} // gọi xoá
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
        {/* Modal Sửa Danh mục */}
        {editingCategory && (
            <EditCategoryForm
                category={editingCategory}
                onClose={() => setEditingCategory(null)}
            />
        )}
      </div>
  );
};

export default CategorieListsTable;