import React, { useState } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { BrandsContext } from "../../context/BrandsContext";
import {
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiEdit,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { BsClockHistory } from "react-icons/bs";

const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  const datePart = date.toLocaleDateString("vi-VN");
  const timePart = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} ${timePart}`;
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

const BrandListsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { brandsData, loading } = useContext(BrandsContext);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  const filteredBrands = brandsData.filter((brand) => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      brand.name.toLowerCase().includes(lowerCaseSearch) ||
      brand.description.toLowerCase().includes(lowerCaseSearch) ||
      brand._id.toLowerCase().includes(lowerCaseSearch)
    );
  });

  return (
    <div className="p-6 pt-24 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Danh sách Thương hiệu
      </h1>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên hoặc ID thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          />
        </div>

        <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-1.5">
          <FiPlus className="w-4 h-4" />
          Thêm Thương hiệu mới
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
              <th className="px-6 py-4 text-left">Thương hiệu (ID)</th>
              <th className="px-6 py-4 text-left">Mô tả</th>
              <th className="px-6 py-4 text-center">Nổi bật</th>
              <th className="px-6 py-4 text-left">Ngày tạo</th>
              <th className="px-6 py-4 text-left">Cập nhật cuối</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>

          <motion.tbody
            className="bg-white divide-y divide-gray-100"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredBrands.map((brand) => (
              <motion.tr
                key={brand._id}
                variants={rowVariants}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Thương hiệu (Logo + Name + ID) */}
                <td className="px-6 py-4 font-extrabold text-gray-900 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/32x32/E0E0E0/333333?text=B";
                      }}
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {brand.name}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {brand._id}
                      </div>
                    </div>
                  </div>
                </td>

                <td
                  className="px-6 py-4 text-gray-700 max-w-xs truncate"
                  title={brand.description}
                >
                  {brand.description}
                </td>

                <td className="px-6 py-4 text-center whitespace-nowrap">
                  {brand.isFeatured ? (
                    <FiStar
                      className="w-5 h-5 text-yellow-500 mx-auto"
                      title="Nổi bật"
                    />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>

                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono">
                  {formatDateTime(brand.createdAt)}
                </td>

                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono flex items-center gap-1">
                  <BsClockHistory className="w-3 h-3 text-gray-400" />
                  {formatDateTime(brand.updatedAt)}
                </td>

                <td className="px-6 py-4 text-center whitespace-nowrap">
                  {brand.isActive ? (
                    <FiCheckCircle
                      className="w-5 h-5 text-green-500 mx-auto"
                      title="Đang hoạt động"
                    />
                  ) : (
                    <FiXCircle
                      className="w-5 h-5 text-red-500 mx-auto"
                      title="Ngừng hoạt động"
                    />
                  )}
                </td>

                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      title="Sửa"
                      className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      title={brand.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                      className={`p-2 rounded-full transition-colors ${
                        brand.isActive
                          ? "text-red-600 hover:text-red-800 hover:bg-red-100"
                          : "text-green-600 hover:text-green-800 hover:bg-green-100"
                      }`}
                    >
                      {brand.isActive ? (
                        <FiXCircle className="w-4 h-4" />
                      ) : (
                        <FiCheckCircle className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {filteredBrands.length === 0 && (
              <tr className="border-t border-gray-100">
                <td
                  colSpan="7"
                  className="text-center py-8 text-gray-500 italic"
                >
                  Không tìm thấy thương hiệu nào phù hợp với từ khóa "
                  {searchTerm}".
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandListsTable;
