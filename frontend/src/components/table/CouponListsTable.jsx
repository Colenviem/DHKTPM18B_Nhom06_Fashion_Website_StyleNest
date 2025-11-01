import React, { useContext, useState } from "react";
import { CouponsContext } from "../../context/CouponsContext";
import EditCouponForm from "../form/EditCouponForm";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { BsTicketPerforated } from "react-icons/bs";
import AddCouponForm from "../form/AddCouponForm";
import axios from "axios";
import { toast } from "react-toastify";

// Hàm format
const formatVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(amount)
    .replace("₫", "VND");
};

const formatDate = (value) => {
  if (!value) return "N/A";
  let isoString =
    typeof value === "object" && value !== null && "$date" in value
      ? value.$date
      : value;
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("vi-VN");
};

const CouponListsTable = () => {
  const { couponsData, setCouponsData, loading } = useContext(CouponsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Lọc dữ liệu theo code, description hoặc id
  const filteredCoupons = couponsData.filter((coupon) => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      coupon.code.toLowerCase().includes(lowerCaseSearch) ||
      coupon.description.toLowerCase().includes(lowerCaseSearch) ||
      coupon.id.toLowerCase().includes(lowerCaseSearch)
    );
  });

  if (loading) return <div>Đang tải dữ liệu...</div>;

  // Hàm xoá
  const handleDelete = async (code) => {
    if (!window.confirm(`Bạn có chắc muốn xóa mã ${code}?`)) return;

    try {
      await axios.delete(`http://localhost:8080/api/coupons/${code}`, {
        withCredentials: true,
      });
      setCouponsData(couponsData.filter((c) => c.code !== code));
      alert("✅ Xóa thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Xóa thất bại!");
    }
  };

  return (
    <div className="p-6 pt-24 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Danh sách Mã giảm giá
      </h1>

      {/* Search & Add */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          />
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-1.5">
          <AddCouponForm />
        </button>
      </div>

      {/* Bảng */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
              <th className="px-6 py-4 text-left">Mã</th>
              <th className="px-6 py-4 text-left">Loại</th>
              <th className="px-6 py-4 text-left">Mô tả</th>
              <th className="px-6 py-4 text-left">Đơn tối thiểu</th>
              <th className="px-6 py-4 text-left">Hạn sử dụng</th>
              <th className="px-6 py-4 text-center">Đã dùng/Giới hạn</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <motion.tbody className="bg-white divide-y divide-gray-100">
            {filteredCoupons.map((coupon) => (
              <motion.tr
                key={coupon.id || coupon._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-extrabold text-indigo-700 whitespace-nowrap flex items-center gap-2">
                  <BsTicketPerforated className="w-5 h-5 text-indigo-500" />
                  {coupon.code}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      coupon.type === "ORDER"
                        ? "bg-purple-100 text-purple-700"
                        : coupon.type === "SHIPPING"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {coupon.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700 max-w-xs">
                  {coupon.description}
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium whitespace-nowrap">
                  {formatVND(coupon.minimumOrderAmount)}
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono">
                  {formatDate(coupon.expirationDate)}
                </td>
                <td className="px-6 py-4 text-center text-gray-600">
                  {coupon.usedCount} / {coupon.usageLimit}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  {coupon.active ? (
                    <FiCheckCircle
                      className="w-5 h-5 text-green-500 mx-auto"
                      title="Hoạt động"
                    />
                  ) : (
                    <FiXCircle
                      className="w-5 h-5 text-red-500 mx-auto"
                      title="Không hoạt động"
                    />
                  )}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      title="Sửa"
                      className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100"
                      onClick={() => setEditingCoupon(coupon)} // mở modal sửa
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      title="Xóa"
                      className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                      onClick={() => handleDelete(coupon.code)} // gọi xoá
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {filteredCoupons.length === 0 && (
              <tr className="border-t border-gray-100">
                <td
                  colSpan="8"
                  className="text-center py-8 text-gray-500 italic"
                >
                  Không tìm thấy mã giảm giá phù hợp "{searchTerm}".
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
      {/* Modal Sửa Coupon */}
      {editingCoupon && (
        <EditCouponForm
          coupon={editingCoupon}
          onClose={() => setEditingCoupon(null)}
        />
      )}
    </div>
  );
};
export default CouponListsTable;
