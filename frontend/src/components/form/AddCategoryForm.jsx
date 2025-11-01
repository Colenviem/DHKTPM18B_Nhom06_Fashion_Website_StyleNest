import React, { useState, useContext, useEffect } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import axios from "axios";
import { CategoriesContext } from "../../context/CategoriesContext";

const AddCategoryForm = () => {
  const { categoriesData, setCategoriesData } = useContext(CategoriesContext);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    imageUrl: "",
    createdAt: "",
    updatedAt: "",
  });

  const [idError, setIdError] = useState(""); // trạng thái lỗi cho ID

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Kiểm tra trùng ID ngay khi nhập
    if (name === "id") {
      const isDuplicate = categoriesData.some((cat) => cat.id === value);
      setIdError(isDuplicate ? `ID "${value}" đã tồn tại` : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nếu có lỗi ID thì không gửi request
    if (idError) {
      alert("❌ Vui lòng nhập ID hợp lệ trước khi thêm");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await axios.post(
        "http://localhost:8080/api/categories",
        dataToSend,
        { withCredentials: true }
      );

      setCategoriesData([...categoriesData, response.data]);
      setShowForm(false);
      setFormData({
        id: "",
        name: "",
        description: "",
        imageUrl: "",
        createdAt: "",
        updatedAt: "",
      });
      setIdError("");
      alert("✅ Thêm category thành công!");
    } catch (error) {
      console.error(error);
      alert("❌ Thêm category thất bại!");
    }
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        onClick={() => setShowForm(true)}
      >
        <FiPlus className="w-4 h-4" /> Thêm Category
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowForm(false)}
          ></div>

          <div className="relative bg-white text-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md z-50 transition-transform transform scale-95 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Thêm Category mới</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowForm(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* ID Input */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-sm font-medium text-gray-700">ID:</label>
                  <input
                    type="text"
                    name="id"
                    placeholder="Nhập ID"
                    value={formData.id}
                    onChange={handleChange}
                    className={`flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500 ${
                      idError ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {idError && <span className="text-red-500 text-sm">{idError}</span>}
              </div>

              {/* Tên Input */}
              <div className="flex items-center gap-2">
                <label className="w-36 text-sm font-medium text-gray-700">Tên:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nhập tên"
                  value={formData.name}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Mô tả Input */}
              <div className="flex items-center gap-2">
                <label className="w-36 text-sm font-medium text-gray-700">Mô tả:</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Nhập mô tả"
                  value={formData.description}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* URL hình ảnh Input */}
              <div className="flex items-center gap-2">
                <label className="w-36 text-sm font-medium text-gray-700">URL hình ảnh:</label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Nhập URL hình ảnh"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!!idError} // disable nếu ID trùng
                  className={`px-4 py-2 text-white rounded ${
                    idError ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCategoryForm;
