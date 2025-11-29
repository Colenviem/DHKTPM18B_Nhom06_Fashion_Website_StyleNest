import React, { useState, useContext } from "react";
import { FiX } from "react-icons/fi";
import axiosClient from "../../api/axiosClient";
import { CategoriesContext } from "../../context/CategoriesContext";

const EditCategoryForm = ({ category, onClose }) => {
  const { categoriesData, setCategoriesData } = useContext(CategoriesContext);
  const [formData, setFormData] = useState({ ...category });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCategory = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      const response = await axiosClient.put(
          `/categories/${category.id}`,
          updatedCategory
      );

      const updatedList = categoriesData.map((c) =>
          c.id === category.id ? response.data : c
      );
      setCategoriesData(updatedList);

      alert("✅ Cập nhật category thành công!");
      onClose();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Cập nhật category thất bại!";
      alert(`❌ ${errorMsg}`);
    }
  };

  return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        ></div>

        <div className="relative bg-white text-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Chỉnh sửa Category</h2>
            <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium text-gray-700">ID:</label>
              <input
                  type="text"
                  name="id"
                  value={formData.id}
                  disabled
                  className="flex-1 border border-gray-300 px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium text-gray-700">Tên:</label>
              <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium text-gray-700">Mô tả:</label>
              <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium text-gray-700">URL hình ảnh:</label>
              <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Hủy
              </button>
              <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default EditCategoryForm;