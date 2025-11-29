import React, { useState, useContext } from "react";
import { CouponsContext } from "../../context/CouponsContext";
import AddCouponForm from "../form/AddCouponForm";
import EditCouponForm from "../form/EditCouponForm";
import { FiCheckCircle, FiXCircle, FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";
import { BsTicketPerforated } from "react-icons/bs";
import { motion } from "framer-motion";
import axiosClient from "../../api/axiosClient";

const formatCurrency = (amount) => {
  if (!amount) return "0";
  return new Intl.NumberFormat("vi-VN").format(amount);
};

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("vi-VN");
};

const CouponListsTable = () => {
  const { couponsData, setCouponsData, loading, error } =
      useContext(CouponsContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCoupon, setEditingCoupon] = useState(null);
  const filteredCoupons = couponsData.filter((coupon) => {
    const key = searchTerm.toLowerCase();
    return (
        coupon.code.toLowerCase().includes(key) ||
        coupon.description.toLowerCase().includes(key) ||
        coupon.id?.toLowerCase().includes(key)
    );
  });
  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn chắc muốn xóa mã giảm giá này?`)) return;
    try {
      await axiosClient.delete(`/coupons/${id}`);
      setCouponsData(couponsData.filter((c) => c.id !== id));
      alert("✅ Xóa thành công!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Xóa thất bại!";
      alert(`❌ ${msg}`);
    }
  };

  return (
      <div className="p-6 pt-24 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Danh sách Mã giảm giá
        </h1>

        {/* Thanh tìm kiếm + Thêm coupon */}
        <div className="flex items-center justify-between flex-wrap gap-6 mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Thêm coupon */}
          <AddCouponForm />
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
              <th className="px-6 py-4 text-center">Đã dùng / Giới hạn</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
            </thead>

            <motion.tbody className="bg-white divide-y divide-gray-100">
              {!loading &&
                  !error &&
                  filteredCoupons.map((coupon) => (
                      <tr key={coupon.id || coupon.code} className="hover:bg-gray-50 transition text-base leading-7">
                        <td className="px-6 py-6 font-bold text-indigo-700 flex items-center gap-3">
                          <BsTicketPerforated className="text-indigo-600" />
                          {coupon.code}
                        </td>
                        <td className="px-6 py-6">{coupon.type}</td>
                        <td className="px-6 py-6 max-w-xs">{coupon.description}</td>
                        <td className="px-6 py-6 font-medium">{formatCurrency(coupon.minimumOrderAmount)} VND</td>
                        <td className="px-6 py-6">{formatDate(coupon.expirationDate)}</td>
                        <td className="px-6 py-6 text-center">{coupon.usedCount}/{coupon.usageLimit}</td>
                        <td className="px-6 py-6 text-center">
                          {coupon.active ? (
                              <FiCheckCircle className="text-green-500" />
                          ) : (
                              <FiXCircle className="text-red-500" />
                          )}
                        </td>
                        <td className="px-6 py-6 text-center flex justify-center gap-2">
                          <button
                              title="Sửa"
                              className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100"
                              onClick={() => setEditingCoupon(coupon)}
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                              title="Xóa"
                              className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                              onClick={() => handleDelete(coupon.id)} // 3. Truyền ID vào hàm xóa
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                  ))}
            </motion.tbody>
          </table>
        </div>

        {/* Modal sửa coupon */}
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