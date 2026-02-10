import React, { useState, useContext } from "react";
import { FiX } from "react-icons/fi";
import axiosClient from "../../api/axiosClient";
import { CouponsContext } from "../../context/CouponsContext";

const EditCouponForm = ({ coupon, onClose }) => {
  const { couponsData, setCouponsData } = useContext(CouponsContext);
  const [formData, setFormData] = useState({ ...coupon });

  const [errors, setErrors] = useState({
    codeError: "",
    discountError: "",
    minimumOrderAmountError: "",
    usageLimitError: "",
    expirationError: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Validation
    if(name === "code") {
      const isDuplicate = couponsData.some((c) => c.code === value && c.id !== coupon.id);
      if(isDuplicate) {
        setErrors((prev) => ({
          ...prev,
          codeError: `Code "${value}" đã tồn tại`,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          codeError: value.trim() === "" ? "Code không được để trống" : "",
        }));
      }
    }
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

    if (name === "expirationDate") {
      const selected = new Date(value);
      const now = new Date();

      setErrors((prev) => ({
        ...prev,
        expirationError:
          selected < now ? "Ngày hết hạn phải lớn hơn hiện tại" : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      errors.codeError ||
      errors.discountError ||
      errors.minimumOrderAmountError ||
      errors.usageLimitError ||
      errors.expirationError
    ) {
      alert("❌ Vui lòng sửa lỗi trước khi lưu!");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        expirationDate: new Date(formData.expirationDate).toISOString(),
        usedCount: formData.usedCount,
      };

      console.log("Sending data:", dataToSend);

      const response = await axiosClient.put(
          `/coupons/${coupon.id}`,
          dataToSend
      );

      const updatedList = couponsData.map((c) =>
        c.id === coupon.id ? response.data : c
      );

      setCouponsData(updatedList);

      alert("✅ Cập nhật thành công!");
      onClose();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Cập nhật thất bại!";
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
          <h2 className="text-xl font-semibold">Chỉnh sửa Coupon</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Code */}
          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium text-gray-700">
              Code:
            </label>
            <input
              type="text"
              name="code"
              onChange={handleChange}
              value={formData.code}
              className="flex-1 border px-3 py-2 rounded bg-white"
            />
          </div>

          {/* Type */}
          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium text-gray-700">
              Loại:
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="flex-1 border px-3 py-2 rounded"
            >
              <option value="ORDER">ORDER</option>
              <option value="SHIPPING">SHIPPING</option>
              <option value="PRODUCT">PRODUCT</option>
            </select>
          </div>
            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium">% Giảm giá:</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className={`flex-1 border px-3 py-2 rounded ${
                  errors.discountError ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
              {errors.discountError && (
                <span className="text-red-500 text-sm">
                  {errors.discountError}
                </span>
              )}
            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium text-gray-700">Loại:</label>
              <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex-1 border px-3 py-2 rounded"
              >
                <option value="ORDER">ORDER</option>
                <option value="SHIPPING">SHIPPING</option>
                <option value="PRODUCT">PRODUCT</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label className="w-36 text-sm font-medium">% Giảm giá:</label>
                <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className={`flex-1 border px-3 py-2 rounded ${
                        errors.discountError ? "border-red-500" : "border-gray-300"
                    }`}
                />
              </div>
              {errors.discountError && (
                  <span className="text-red-500 text-sm">{errors.discountError}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium">Đơn tối thiểu:</label>
              <input
                type="number"
                name="minimumOrderAmount"
                value={formData.minimumOrderAmount}
                onChange={handleChange}
                className={`flex-1 border px-3 py-2 rounded ${
                  errors.minimumOrderAmountError
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            {errors.minimumOrderAmountError && (
              <span className="text-red-500 text-sm">
                {errors.minimumOrderAmountError}
              </span>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label className="w-36 text-sm font-medium">Đơn tối thiểu:</label>
                <input
                    type="number"
                    name="minimumOrderAmount"
                    value={formData.minimumOrderAmount}
                    onChange={handleChange}
                    className={`flex-1 border px-3 py-2 rounded ${
                        errors.minimumOrderAmountError ? "border-red-500" : "border-gray-300"
                    }`}
                />
              </div>
              {errors.minimumOrderAmountError && (
                  <span className="text-red-500 text-sm">{errors.minimumOrderAmountError}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label className="w-36 text-sm font-medium">Hạn sử dụng:</label>
                <input
                    type="datetime-local"
                    name="expirationDate"
                    value={formData.expirationDate?.slice(0, 16) || ""}
                    onChange={handleChange}
                    className="flex-1 border px-3 py-2 rounded"
                />
              </div>
              {errors.expirationError && (
                  <span className="text-red-500 text-sm">{errors.expirationError}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label className="w-36 text-sm font-medium">Giới hạn:</label>
                <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    className={`flex-1 border px-3 py-2 rounded ${
                        errors.usageLimitError ? "border-red-500" : "border-gray-300"
                    }`}
                />
              </div>
              {errors.usageLimitError && (
                  <span className="text-red-500 text-sm">{errors.usageLimitError}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium">Hạn sử dụng:</label>
              <input
                type="datetime-local"
                name="expirationDate"
                value={formData.expirationDate?.slice(0, 16) || ""}
                onChange={handleChange}
                className="flex-1 border px-3 py-2 rounded"
              />
            </div>
            {errors.expirationError && (
              <span className="text-red-500 text-sm">
                {errors.expirationError}
              </span>
            )}


          {/* Usage limit */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label className="w-36 text-sm font-medium">Giới hạn:</label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                className={`flex-1 border px-3 py-2 rounded ${
                  errors.usageLimitError ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.usageLimitError && (
              <span className="text-red-500 text-sm">
                {errors.usageLimitError}
              </span>
            )}
          </div>

          {/* Used Count */}
          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium">Đã dùng:</label>
            <input
              type="number"
              value={formData.usedCount}
              readOnly
              className="flex-1 border px-3 py-2 rounded bg-gray-100"
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
            <label className="text-sm">Active</label>
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
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
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
