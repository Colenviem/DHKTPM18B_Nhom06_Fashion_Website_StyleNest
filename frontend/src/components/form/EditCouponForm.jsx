import React, { useState, useContext } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { CouponsContext } from "../../context/CouponsContext";

const EditCouponForm = ({ coupon, onClose }) => {
  const { couponsData, setCouponsData } = useContext(CouponsContext);
  const [formData, setFormData] = useState({ ...coupon });

  const [errors, setErrors] = useState({
    discountError: "",
    minimumOrderAmountError: "",
    usageLimitError: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Validation ngay khi thay đổi
    if (name === "discount") {
      setErrors((prev) => ({
        ...prev,
        discountError: Number(value) <= 0 ? "Discount phải > 0" : "",
      }));
    }

    if (name === "minimumOrderAmount") {
      setErrors((prev) => ({
        ...prev,
        minimumOrderAmountError:
          Number(value) < 0 ? "Đơn tối thiểu phải >= 0" : "",
      }));
    }

    if (name === "usageLimit") {
      setErrors((prev) => ({
        ...prev,
        usageLimitError: Number(value) <= 0 ? "Giới hạn sử dụng phải > 0" : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      errors.discountError ||
      errors.minimumOrderAmountError ||
      errors.usageLimitError

    ) {
      alert("❌ Vui lòng sửa các lỗi trước khi lưu!");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        expirationDate: formData.expirationDate + ":00Z",
        usedCount: formData.usedCount, // giữ nguyên
      };

      const response = await axios.put(
        `http://localhost:8080/api/coupons/${coupon.code}`,
        dataToSend,
        { withCredentials: true }
      );

      const updatedList = couponsData.map((c) =>
        c.code === coupon.code ? response.data : c
      );
      setCouponsData(updatedList);

      alert("✅ Cập nhật thành công!");
      onClose();
    } catch (error) {
      console.error(error);
      alert("❌ Cập nhật thất bại!");
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
          <h2 className="text-xl font-semibold">Chỉnh sửa Coupon</h2>
          <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Code - readonly */}
          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium text-gray-700">Code:</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              disabled
              className="flex-1 border border-gray-300 px-3 py-2 rounded bg-gray-100"
            />
          </div>

          {/* Loại */}
          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium text-gray-700">Loại:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="flex-1 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ORDER">ORDER</option>
              <option value="SHIPPING">SHIPPING</option>
              <option value="PRODUCT">PRODUCT</option>
            </select>
          </div>

          {/* Discount */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium text-gray-700">% Giảm giá:</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className={`flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.discountError ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.discountError && (
              <span className="text-red-500 text-sm">{errors.discountError}</span>
            )}
          </div>

          {/* Description */}
          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium text-gray-700">Mô tả:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="flex-1 border border-gray-300 px-3 py-2 rounded focus:ring-indigo-500"
            />
          </div>

          {/* Minimum Order Amount */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium text-gray-700">Đơn tối thiểu:</label>
              <input
                type="number"
                name="minimumOrderAmount"
                value={formData.minimumOrderAmount}
                onChange={handleChange}
                className={`flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.minimumOrderAmountError ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.minimumOrderAmountError && (
              <span className="text-red-500 text-sm">{errors.minimumOrderAmountError}</span>
            )}
          </div>

          {/* Expiration Date */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium text-gray-700">Hạn sử dụng:</label>
              <input
                type="datetime-local"
                name="expirationDate"
                value={formData.expirationDate?.slice(0, 16) || ""}
                onChange={handleChange}
                className={`flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
            {errors.expirationError && (
              <span className="text-red-500 text-sm">{errors.expirationError}</span>
            )}
          </div>

          {/* Usage Limit */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium text-gray-700">Giới hạn:</label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                className={`flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.usageLimitError ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.usageLimitError && (
              <span className="text-red-500 text-sm">{errors.usageLimitError}</span>
            )}
          </div>

          {/* Used Count - readonly */}
          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium text-gray-700">Đã dùng:</label>
            <input
              type="number"
              name="usedCount"
              value={formData.usedCount}
              readOnly
              className="flex-1 border border-gray-300 px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Active */}
          <div className="flex justify-end items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="text-sm text-gray-700">Active</label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={
                !!errors.discountError ||
                !!errors.minimumOrderAmountError ||
                !!errors.usageLimitError ||
                !!errors.expirationError
              }
              className={`px-4 py-2 text-white rounded ${
                !!errors.discountError ||
                !!errors.minimumOrderAmountError ||
                !!errors.usageLimitError ||
                !!errors.expirationError
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCouponForm;
