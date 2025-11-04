import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft, FiTag, FiSave, FiBox, FiLoader, FiRotateCcw
} from "react-icons/fi";
import { motion } from "framer-motion";
import { getProductById, saveOrUpdateProduct } from "../../context/ProductContext";

const ProductEdit = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [changedFields, setChangedFields] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        setOriginalProduct(data);
      } catch (err) {
        alert("Không thể tải chi tiết sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const markChanged = (fieldPath) => {
    setChangedFields((prev) => new Set(prev).add(fieldPath));
  };

  const clearChanged = (fieldPath) => {
    setChangedFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fieldPath);
      return newSet;
    });
  };

  const handleChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
    markChanged(field);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...product.variants];
    newVariants[index][field] = value;
    setProduct((prev) => ({ ...prev, variants: newVariants }));
    markChanged(`variant-${index}-${field}`);
  };

  const handleReset = (field) => {
    setProduct((prev) => ({
      ...prev,
      [field]: originalProduct[field],
    }));
    clearChanged(field);
  };

  const handleVariantReset = (index, field) => {
    const newVariants = [...product.variants];
    newVariants[index][field] = originalProduct.variants[index][field];
    setProduct((prev) => ({ ...prev, variants: newVariants }));
    clearChanged(`variant-${index}-${field}`);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveOrUpdateProduct(product);
      alert("✅ Cập nhật thành công!");
      setOriginalProduct(product);
      setChangedFields(new Set());
    } catch (err) {
      alert("❌ Lưu thất bại, vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-indigo-600 w-8 h-8 mr-2" />
        <span>Đang tải...</span>
      </div>
    );

  return (
    <motion.div
      className="p-6 pt-24 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chỉnh Sửa: {product.name}</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-60"
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin mr-2" /> Đang lưu...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Lưu thay đổi
              </>
            )}
          </button>
          <Link
            to="/admin/products"
            className="flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-100"
          >
            <FiArrowLeft className="mr-2" /> Quay lại
          </Link>
        </div>
      </div>

      {/* THÔNG TIN CƠ BẢN */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiTag className="mr-2 text-indigo-600" /> Thông Tin Cơ Bản
        </h2>

        {[
          ["name", "Tên sản phẩm"],
          ["shortDescription", "Mô tả ngắn"],
          ["price", "Giá gốc"],
          ["discount", "Giảm giá (%)"],
          ["brand", "Thương hiệu"],
          ["material", "Chất liệu"],
          ["origin", "Xuất xứ"],
        ].map(([field, label]) => (
          <div key={field} className="mb-4 flex items-center gap-2">
            <label className="w-40 font-semibold">{label}:</label>
            <input
              type={field === "price" || field === "discount" ? "number" : "text"}
              value={product[field] || ""}
              onChange={(e) =>
                handleChange(
                  field,
                  field === "price" || field === "discount"
                    ? parseFloat(e.target.value)
                    : e.target.value
                )
              }
              className={`flex-1 border rounded-lg p-2 ${
                changedFields.has(field) ? "border-blue-500" : "border-gray-300"
              }`}
            />
            {changedFields.has(field) && (
              <button
                onClick={() => handleReset(field)}
                className="text-gray-500 hover:text-red-500"
                title="Hoàn tác thay đổi"
              >
                <FiRotateCcw />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* BIẾN THỂ */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 p-6 flex items-center border-b">
          <FiBox className="w-5 h-5 mr-2 text-indigo-600" /> Biến thể ({product.variants?.length || 0})
        </h2>
        {product.variants?.map((variant, index) => (
          <div key={index} className="p-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-6 gap-3">
            {[
              { field: "sku", placeholder: "SKU" },
              { field: "color", placeholder: "Màu sắc" },
              { field: "size", placeholder: "Kích cỡ" },
              { field: "inStock", placeholder: "Tồn kho", type: "number" },
            ].map(({ field, placeholder, type = "text" }) => (
              <input
                key={field}
                type={type}
                value={variant[field] || ""}
                onChange={(e) => handleVariantChange(index, field, type === "number" ? parseInt(e.target.value) : e.target.value)}
                placeholder={placeholder}
                className={`border p-2 rounded-lg ${
                  changedFields.has(`variant-${index}-${field}`) ? "border-indigo-500 shadow-sm" : "border-gray-300"
                }`}
              />
            ))}
            <select
              value={variant.available ? "true" : "false"}
              onChange={(e) => handleVariantChange(index, "available", e.target.value === "true")}
              className={`border p-2 rounded-lg ${
                changedFields.has(`variant-${index}-available`) ? "border-indigo-500 shadow-sm" : "border-gray-300"
              }`}
            >
              <option value="true">Còn bán</option>
              <option value="false">Ngừng bán</option>
            </select>
            <input
              value={variant.images?.[0] || ""}
              onChange={(e) => handleVariantChange(index, "images", [e.target.value])}
              placeholder="Link ảnh"
              className={`border p-2 rounded-lg ${
                changedFields.has(`variant-${index}-images`) ? "border-indigo-500 shadow-sm" : "border-gray-300"
              }`}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductEdit;
