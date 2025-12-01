import React, { useState, useContext } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import axios from "axios";
import { CouponsContext } from "../../context/CouponsContext";
import "react-toastify/dist/ReactToastify.css";

const token = localStorage.getItem("token");

const AddCouponForm = () => {
  const { couponsData, setCouponsData } = useContext(CouponsContext);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "CP" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    code: "",
    type: "ORDER",
    discount: 0,
    description: "",
    minimumOrderAmount: 0,
    expirationDate: "",
    usageLimit: 1, // mặc định > 0
    usedCount: 0, // luôn = 0
    active: true,
  });

  const [errors, setErrors] = useState({
    codeError: "",
    expirationError: "",
    usageLimitError: "",
    minimumOrderAmountError: "",
    discountError: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Validate ngay khi nhập
    if (name === "code") {
      const isDuplicate = couponsData.some(
        (coupon) => coupon.code.toLowerCase() === value.toLowerCase()
      );
      setErrors((prev) => ({
        ...prev,
        codeError: isDuplicate ? `Code "${value}" đã tồn tại` : "",
      }));
    }

    if (name === "expirationDate") {
      const selectedDate = new Date(value);
      const now = new Date();
      setErrors((prev) => ({
        ...prev,
        expirationError:
          selectedDate < now
            ? "Ngày hết hạn phải lớn hơn hoặc bằng hiện tại"
            : "",
      }));
    }

    if (name === "usageLimit") {
      const usage = Number(value);
      setErrors((prev) => ({
        ...prev,
        usageLimitError: usage <= 0 ? "Giới hạn sử dụng phải > 0" : "",
      }));
    }

    if (name === "minimumOrderAmount") {
      const minAmount = Number(value);
      setErrors((prev) => ({
        ...prev,
        minimumOrderAmountError:
          minAmount < 0 ? "Giá trị đơn tối thiểu phải >= 0" : "",
      }));
    }

    if (name === "discount") {
      const discount = Number(value);
      setErrors((prev) => ({
        ...prev,
        discountError: discount <= 0 ? "Discount phải > 0" : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Đảm bảo ID không trùng
    let isDuplicateID;
    do {
      isDuplicateID = couponsData.some((coupon) => coupon.id === formData.id);

      if (isDuplicateID) {
        formData.id =
          "CP" + Math.random().toString(36).substring(2, 8).toUpperCase();
      }
    } while (isDuplicateID);

    if (
      errors.codeError ||
      errors.expirationError ||
      errors.usageLimitError ||
      errors.minimumOrderAmountError ||
      errors.discountError
    ) {
      alert("❌ Vui lòng sửa các lỗi trước khi thêm coupon!");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        expirationDate: formData.expirationDate + ":00Z",
        usedCount: 0, // luôn = 0
      };

      const response = await axios.post(
        "http://localhost:8080/api/coupons",
        dataToSend,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCouponsData([...couponsData, response.data]);
      setShowForm(false);
      setFormData({
        id: "CP" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        code: "",
        type: "ORDER",
        discount: 0,
        description: "",
        minimumOrderAmount: 0,
        expirationDate: "",
        usageLimit: 1,
        usedCount: 0,
        active: true,
      });
      setErrors({
        codeError: "",
        expirationError: "",
        usageLimitError: "",
        minimumOrderAmountError: "",
        discountError: "",
      });
      alert("✅ Thêm coupon thành công!");
    } catch (error) {
      console.error(error);
      alert("❌ Thêm coupon thất bại!");
    }
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        onClick={() => setShowForm(true)}
      >
        <FiPlus className="w-4 h-4" />
        Thêm Mã giảm giá
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowForm(false)}
          ></div>

          <div className="relative bg-white text-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md z-50 transition-transform transform scale-95 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Thêm Coupon mới</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowForm(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Code */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-sm font-medium text-gray-700">
                    Code:
                  </label>
                  <input
                    type="text"
                    name="code"
                    placeholder="Nhập code"
                    value={formData.code}
                    onChange={handleChange}
                    className={`flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.codeError ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {errors.codeError && (
                  <span className="text-red-500 text-sm">
                    {errors.codeError}
                  </span>
                )}
              </div>

              {/* Loại */}
              <div className="flex items-center gap-2">
                <label className="w-36 text-sm font-medium text-gray-700">
                  Loại:
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ORDER">ORDER</option>
                  <option value="SHIPPING">SHIPPING</option>
                  <option value="PRODUCT">PRODUCT</option>
                </select>
              </div>

              {/* Discount */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-sm font-medium text-gray-700">
                    % Giảm giá:
                  </label>
                  <input
                    type="number"
                    name="discount"
                    placeholder="Nhập discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className={`flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.discountError
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {errors.discountError && (
                  <span className="text-red-500 text-sm">
                    {errors.discountError}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="flex items-center gap-2">
                <label className="w-36 text-sm font-medium text-gray-700">
                  Mô tả:
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="Nhập mô tả"
                  value={formData.description}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Minimum Order Amount */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-sm font-medium text-gray-700">
                    Giá trị đơn tối thiểu:
                  </label>
                  <input
                    type="number"
                    name="minimumOrderAmount"
                    placeholder="Nhập đơn tối thiểu"
                    value={formData.minimumOrderAmount}
                    onChange={handleChange}
                    className={`flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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
              </div>

              {/* Expiration Date */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-sm font-medium text-gray-700">
                    Hạn sử dụng:
                  </label>
                  <input
                    type="datetime-local"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleChange}
                    className={`flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.expirationError
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {errors.expirationError && (
                  <span className="text-red-500 text-sm">
                    {errors.expirationError}
                  </span>
                )}
              </div>

              {/* Usage Limit */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-sm font-medium text-gray-700">
                    Giới hạn sử dụng:
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    placeholder="Nhập giới hạn sử dụng"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    className={`flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.usageLimitError
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.usageLimitError && (
                  <span className="text-red-500 text-sm">
                    {errors.usageLimitError}
                  </span>
                )}
              </div>

              {/* Used Count - readonly */}
              <div className="flex items-center gap-2">
                <label className="w-36 text-sm font-medium text-gray-700">
                  Số lần đã dùng:
                </label>
                <input
                  type="number"
                  name="usedCount"
                  value={0}
                  readOnly
                  className="flex-1 border border-gray-300 px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-2 justify-end">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active
                </label>
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
                  disabled={
                    !!errors.codeError ||
                    !!errors.expirationError ||
                    !!errors.usageLimitError ||
                    !!errors.minimumOrderAmountError ||
                    !!errors.discountError
                  }
                  className={`px-4 py-2 text-white rounded ${
                    !!errors.codeError ||
                    !!errors.expirationError ||
                    !!errors.usageLimitError ||
                    !!errors.minimumOrderAmountError ||
                    !!errors.discountError
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
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

export default AddCouponForm;
