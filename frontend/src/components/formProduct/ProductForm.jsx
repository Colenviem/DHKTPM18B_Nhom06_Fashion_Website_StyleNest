import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiTag,
  FiSave,
  FiBox,
  FiLoader,
  FiRotateCcw,
  FiTrash2,
  FiImage,
  FiPlusCircle,
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";
import {
  getProductById,
  saveOrUpdateProduct,
  getAllCategories,
  addCategory,
} from "../../context/ProductContext"; 

import {
  uploadImage,
  addVariantImage,
  removeVariantImage,
  updateVariantImage,
} from "../../context/CloudinaryContext"; 

const defaultVariant = {
  sku: "",
  color: "",
  size: "",
  inStock: 0,
  available: true,
  images: [],
};

const ProductForm = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [changedFields, setChangedFields] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({}); // Thêm state để lưu lỗi validation

  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  // ================== LOAD CHI TIẾT SẢN PHẨM + DANH MỤC ==================
  useEffect(() => {
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const categoryData = await getAllCategories();
      setCategories(categoryData);

      if (id) {
        // === CHẾ ĐỘ CHỈNH SỬA ===
        const productData = await getProductById(id);
        setProduct(productData);
        setOriginalProduct(JSON.parse(JSON.stringify(productData)));
      } else {
        // === CHẾ ĐỘ THÊM MỚI ===
        const newProduct = {
          id: null,
          name: "",
          shortDescription: "",
          description: "",
          price: 0,
          discount: 0,
          brand: "",
          material: "",
          origin: "",
          category: "",
          variants: [],
          images: [],
        };
        setProduct(newProduct);
        setOriginalProduct(JSON.parse(JSON.stringify(newProduct)));
      }
    } catch (err) {
      console.error("Fetch detail error:", err);
      alert("Không thể tải dữ liệu!");
    } finally {
      setLoading(false); // 🔥 luôn chạy dù có lỗi hay không
    }
  };

  fetchDetail();
}, [id]);

useEffect(() => {
  console.log("Mode:", id ? "Edit" : "Create new");
  console.log("Product state:", product);
}, [id, product]);



  // ================== MARK & CLEAR FIELD ==================
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

  // ================== THAY ĐỔI INPUT CHÍNH ==================
  const handleChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
    markChanged(field);
    // Clear lỗi khi thay đổi giá trị
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // ================== THAY ĐỔI INPUT BIẾN THỂ ==================
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...product.variants];
    newVariants[index][field] = value;
    setProduct((prev) => ({ ...prev, variants: newVariants }));
    markChanged(`variant-${index}-${field}`);
    // Clear lỗi khi thay đổi giá trị
    setErrors((prev) => ({ ...prev, [`variant-${index}-${field}`]: null }));
  };

  // ================== RESET FIELD CHÍNH ==================
  const handleReset = (field) => {
    setProduct((prev) => ({
      ...prev,
      [field]: originalProduct[field],
    }));
    clearChanged(field);
    setErrors((prev) => ({ ...prev, [field]: null }));
  };
  
  // ================== RESET FIELD BIẾN THỂ ==================
  const handleResetVariant = (index, field) => {
    // 1. Lấy giá trị gốc của trường đó
    const originalValue = originalProduct.variants?.[index]?.[field];
    
    // 2. Cập nhật lại state product với giá trị gốc
    const newVariants = [...product.variants];
    newVariants[index][field] = originalValue;
    
    setProduct((prev) => ({ ...prev, variants: newVariants }));
    
    // 3. Xóa đánh dấu thay đổi
    clearChanged(`variant-${index}-${field}`);
    setErrors((prev) => ({ ...prev, [`variant-${index}-${field}`]: null }));
  };

  // ================== TRANSFORM BACKEND ERRORS ==================
  const transformErrors = (backendErrors) => {
    const transformed = {};
    Object.keys(backendErrors).forEach((key) => {
      let newKey = key;
      // Handle nested fields like category.id -> category
      if (key.startsWith('category.')) {
        newKey = 'category';
      }
      // Handle variants[0].sku -> variant-0-sku
      const variantMatch = key.match(/^variants\[(\d+)\]\.(.+)$/);
      if (variantMatch) {
        const index = variantMatch[1];
        const field = variantMatch[2];
        newKey = `variant-${index}-${field}`;
      }
      transformed[newKey] = backendErrors[key];
    });
    return transformed;
  };

  // ================== LƯU DỮ LIỆU CHUNG ==================
  const handleSave = async () => {
    console.log("--- Dữ liệu Sản phẩm Gửi lên API ---");
    console.log(product);
    console.log("--- End Dữ liệu Sản phẩm ---");

    try {
      setSaving(true);
      setErrors({}); // Clear lỗi trước khi gửi

      const result = await saveOrUpdateProduct(product);

      // Kiểm tra nếu là success (dựa trên API return)
      if (result.type === "success") {
        setProduct(result.product);
        setOriginalProduct(JSON.parse(JSON.stringify(result.product)));
        setChangedFields(new Set());
        alert("✅ Lưu thành công!");
      } else {
        // Không nên đến đây vì API reject sẽ vào catch
      }
    } catch (err) {
      console.error("Save error:", err);
      if (err.type === "validation") {
        const transformedErrors = transformErrors(err.errors);
        setErrors(transformedErrors); // Set lỗi từ backend sau khi transform
        alert(err.message || "Dữ liệu không hợp lệ!");
      } else {
        alert(err.message || "❌ Lưu thất bại, vui lòng thử lại!");
      }
    } finally {
      setSaving(false);
    }
  };

  // ================== UPLOAD ẢNH BIẾN THỂ ==================
  const handleUploadImage = async (file, variantIndex) => {
    if (!file) return;
    try {
      const imageUrl = await uploadImage(file);
      // Giả định addVariantImage trả về product đã cập nhật
      const updated = addVariantImage(product, variantIndex, imageUrl); 
      setProduct(updated);
      markChanged(`variant-${variantIndex}-images`);
      setErrors((prev) => ({ ...prev, [`variant-${variantIndex}-images`]: null }));
    } catch {
      alert("❌ Upload ảnh thất bại!");
    }
  };

  const handleDeleteImage = (variantIndex, imageIndex) => {
    // Giả định removeVariantImage trả về product đã cập nhật
    const updated = removeVariantImage(product, variantIndex, imageIndex); 
    setProduct(updated);
    markChanged(`variant-${variantIndex}-images`);
  };

  const handleReplaceImage = async (file, variantIndex, imageIndex) => {
    if (!file) return;
    try {
      const imageUrl = await uploadImage(file);
      // Giả định updateVariantImage trả về product đã cập nhật
      const updated = updateVariantImage(
        product,
        variantIndex,
        imageIndex,
        imageUrl
      ); 
      setProduct(updated);
      markChanged(`variant-${variantIndex}-images`);
    } catch {
      alert("❌ Thay ảnh thất bại!");
    }
  };

  // ================== THÊM / XÓA BIẾN THỂ ==================
  const handleAddVariant = () => {
    // Sử dụng defaultVariant đã định nghĩa bên trên
    setProduct((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), { ...defaultVariant }],
    }));
    // Đánh dấu mảng variants thay đổi
    markChanged("variants"); 
    setErrors((prev) => ({ ...prev, variants: null })); // Clear lỗi variants nếu có
  };

  const handleDeleteVariant = (index) => {
    if (window.confirm("Bạn có chắc muốn xóa biến thể này? Việc này sẽ được lưu khi bạn nhấn nút 'Lưu thay đổi'")) {
      const updated = [...product.variants];
      updated.splice(index, 1);
      setProduct((prev) => ({ ...prev, variants: updated }));
      markChanged("variants");
      // Clear lỗi liên quan đến variant bị xóa
      setErrors((prev) => {
        const newErrs = { ...prev };
        Object.keys(newErrs).forEach((key) => {
          if (key.startsWith(`variant-${index}-`)) {
            delete newErrs[key];
          }
        });
        return newErrs;
      });
    }
  };

  // ================== THÊM DANH MỤC MỚI ==================
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
        alert("Tên danh mục không được để trống!");
        return;
    }
    try {
      const now = new Date().toISOString();
      const newCatData = {
        ...newCategory,
        // Tạo ID tạm thời nếu chưa có, Backend nên gán ID chính thức
        id: `TEMP_${Date.now()}`, 
        createdAt: now,
        updatedAt: now,
      };
      
      const added = await addCategory(newCatData);
      
      // 1. Cập nhật danh sách categories
      setCategories((prev) => [...prev, added]);
      
      // 2. Tự động chọn danh mục mới cho sản phẩm đang chỉnh sửa
      setProduct((prev) => ({ ...prev, category: added }));
      markChanged("category");

      // 3. Reset Modal
      setNewCategory({ name: "", description: "", imageUrl: "" });
      setShowCategoryModal(false);
      
      alert("✅ Thêm danh mục thành công và đã được chọn!");
    } catch {
      alert("❌ Lỗi khi thêm danh mục!");
    }
  };

  if (loading || !product)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-indigo-600 w-8 h-8 mr-2" />
        <span className="text-lg text-indigo-600">Đang tải chi tiết sản phẩm...</span>
      </div>
    );

  // ================== UI START ==================
  return (
    <motion.div className="p-6 pt-24 bg-gray-50 min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* HEADER & SAVE BUTTON */}
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50/90 z-10 py-4 border-b">
        <h1 className="text-3xl font-bold">
          {id ? `Chỉnh sửa: ${product.name || ""}` : "Thêm sản phẩm mới"}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || changedFields.size === 0} // Chỉ cho phép lưu khi có thay đổi
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin mr-2" /> Đang lưu...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Lưu thay đổi ({changedFields.size})
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
      
      {/* --- THÔNG TIN CƠ BẢN --- */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">
          <FiTag className="mr-2 text-indigo-600" /> Thông Tin Cơ Bản
        </h2>

        {/* --- Tên sản phẩm --- */}
        <div className="mb-4 flex items-center gap-2">
          <label className="w-40 font-semibold shrink-0">Tên sản phẩm:</label>
          <input
            type="text"
            value={product.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`flex-1 border rounded-lg p-2 transition ${
              changedFields.has("name") ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-300"
            } ${errors.name ? "border-red-500" : ""}`}
          />
          {changedFields.has("name") && (
            <button
              onClick={() => handleReset("name")}
              className="text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center transition"
              title="Hoàn tác thay đổi"
            >
              <FiRotateCcw />
            </button>
          )}
        </div>
        {errors.name && <p className="text-red-500 text-sm mb-2 -mt-2 ml-40">{errors.name}</p>}

        {/* --- Danh mục sản phẩm --- */}
        <div className="mb-4 flex items-center gap-2">
          <label className="w-40 font-semibold shrink-0">Danh mục:</label>
          <select
            className={`flex-1 border rounded-lg p-2 transition ${
                changedFields.has("category") ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-300"
            } ${errors.category ? "border-red-500" : ""}`}
            value={product.category?.id || ""}
            onChange={(e) => {
              const selected = categories.find((cat) => cat.id === e.target.value);
              setProduct({ ...product, category: selected });
              markChanged("category");
              setErrors((prev) => ({ ...prev, category: null }));
            }}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 w-24 shrink-0"
            title="Thêm danh mục mới"
          >
            <FiPlusCircle className="inline mr-1"/> Thêm
          </button>
          {changedFields.has("category") && (
            <button
              onClick={() => handleReset("category")}
              className="text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center transition"
              title="Hoàn tác thay đổi"
            >
              <FiRotateCcw />
            </button>
          )}
        </div>
        {errors.category && <p className="text-red-500 text-sm mb-2 -mt-2 ml-40">{errors.category}</p>}

        {/* --- Mô tả --- */}
        <div className="mb-4 flex gap-2">
          <label className="w-40 font-semibold shrink-0 pt-2">Mô tả:</label>
          <div className="flex-1 flex flex-col">
            <textarea
              value={product.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`flex-1 border rounded-lg p-2 transition resize-y min-h-[100px] ${
                changedFields.has("description") ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-300"
              } ${errors.description ? "border-red-500" : ""}`}
            />
            {changedFields.has("description") && (
              <button
                onClick={() => handleReset("description")}
                className="self-start text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center transition mt-1"
                title="Hoàn tác thay đổi"
              >
                <FiRotateCcw />
              </button>
            )}
          </div>
        </div>
        {errors.description && <p className="text-red-500 text-sm mb-2 -mt-2 ml-40">{errors.description}</p>}

        {/* --- Các trường còn lại --- */}
        {[
          ["shortDescription", "Mô tả ngắn", "text"],
          ["price", "Giá gốc", "number"],
          ["discount", "Giảm giá (%)", "number"],
          ["brand", "Thương hiệu", "text"],
          ["material", "Chất liệu", "text"],
          ["origin", "Xuất xứ", "text"],
        ].map(([field, label, type]) => (
          <div key={field}>
            <div className="mb-4 flex items-center gap-2">
              <label className="w-40 font-semibold shrink-0">{label}:</label>
              <input
                type={type}
                value={product[field] || (type === "number" ? 0 : "")}
                min={type === "number" ? 0 : undefined}
                onChange={(e) =>
                  handleChange(
                    field,
                    type === "number"
                      ? parseFloat(e.target.value) || 0
                      : e.target.value
                  )
                }
                className={`flex-1 border rounded-lg p-2 transition ${
                  changedFields.has(field) ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-300"
                } ${errors[field] ? "border-red-500" : ""}`}
              />
              {changedFields.has(field) && (
                <button
                  onClick={() => handleReset(field)}
                  className="text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center transition"
                  title="Hoàn tác thay đổi"
                >
                  <FiRotateCcw />
                </button>
              )}
            </div>
            {errors[field] && <p className="text-red-500 text-sm mb-2 -mt-2 ml-40">{errors[field]}</p>}
          </div>
        ))}
      </div>
      {/* --- END THÔNG TIN CƠ BẢN --- */}

      {/* ================== BIẾN THỂ ================== */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center border-b p-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FiBox className="w-5 h-5 mr-2 text-indigo-600" /> Biến thể ({product.variants?.length || 0})
          </h2>
          <button
            onClick={handleAddVariant}
            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
          >
            <FiPlusCircle /> Thêm biến thể
          </button>
        </div>
        {errors.variants && <p className="text-red-500 text-sm mb-2 px-6">{errors.variants}</p>}

        {product.variants?.map((variant, index) => (
          <div key={index} className="p-6 border-b border-gray-100 relative group transition-all duration-300 hover:bg-indigo-50/50">
            <p className="text-sm font-bold text-indigo-600 mb-3">Biến thể #{index + 1}</p>
            
            {/* Nút xóa */}
            <button
              onClick={() => handleDeleteVariant(index)}
              className="absolute top-4 right-4 text-red-500 opacity-75 group-hover:opacity-100 hover:text-red-700 p-2 rounded-full transition"
              title="Xóa biến thể"
            >
              <FiTrash2 size={20}/>
            </button>

            {/* ==== Dòng thông tin chính ==== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 mb-4">
              {[
                { field: "sku", placeholder: "SKU", type: "text" },
                { field: "color", placeholder: "Màu sắc", type: "text" },
                { field: "size", placeholder: "Kích cỡ", type: "text" },
                { field: "inStock", placeholder: "Tồn kho", type: "number" },
              ].map(({ field, placeholder, type = "text" }) => {
                const isChanged = changedFields.has(`variant-${index}-${field}`);
                const variantError = errors[`variant-${index}-${field}`];
                return (
                  <div key={field}>
                    <div className="relative flex items-center">
                      <input
                        type={type}
                        value={variant[field] || (type === "number" ? 0 : "")}
                        min={type === "number" ? 0 : undefined}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            field,
                            type === "number"
                              ? parseInt(e.target.value) || 0
                              : e.target.value
                          )
                        }
                        placeholder={placeholder}
                        className={`w-full border p-2 rounded-lg transition ${
                          isChanged
                            ? "border-indigo-500 shadow-sm ring-1 ring-indigo-500"
                            : "border-gray-300"
                        } ${variantError ? "border-red-500" : ""}`}
                      />
                      {isChanged && (
                          <button
                            onClick={() => handleResetVariant(index, field)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 p-1"
                            title="Hoàn tác thay đổi"
                          >
                            <FiRotateCcw size={16}/>
                          </button>
                        )}
                    </div>
                    {variantError && <p className="text-red-500 text-sm mt-1">{variantError}</p>}
                  </div>
                );
              })}

              <select
                value={variant.available ? "true" : "false"}
                onChange={(e) =>
                  handleVariantChange(index, "available", e.target.value === "true")
                }
                className={`border p-2 rounded-lg transition ${
                  changedFields.has(`variant-${index}-available`)
                    ? "border-indigo-500 shadow-sm"
                    : "border-gray-300"
                }`}
              >
                <option value="true">🟢 Còn bán</option>
                <option value="false">🔴 Ngừng bán</option>
              </select>
            </div>

            {/* ==== Ảnh biến thể ==== */}
            <h4 className="text-sm font-medium mb-2 flex items-center text-gray-700">
                <FiImage className="mr-1"/> Ảnh biến thể:
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              {variant.images?.map((imgUrl, imgIndex) => (
                <div key={imgIndex} className="relative group w-24 h-24">
                  <img
                    src={imgUrl}
                    alt={`Variant ${index} Image ${imgIndex}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-2 rounded-lg transition">
                    <label className="cursor-pointer bg-yellow-400 text-white p-2 rounded hover:bg-yellow-500" title="Thay thế ảnh">
                      <FiImage size={16}/>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          handleReplaceImage(e.target.files[0], index, imgIndex)
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index, imgIndex)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600" title="Xóa ảnh"
                    >
                      <FiTrash2 size={16}/>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Nút tải ảnh mới */}
              <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-indigo-400 text-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-50 transition">
                <FiPlusCircle size={24}/>
                <span className="text-xs mt-1">Tải ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleUploadImage(e.target.files[0], index)}
                />
              </label>
            </div>
            {errors[`variant-${index}-images`] && <p className="text-red-500 text-sm mt-1">{errors[`variant-${index}-images`]}</p>}
          </div>
        ))}
      </div>
      {/* --- END BIẾN THỂ --- */}

      {/* ========== MODAL THÊM DANH MỤC ========== */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md relative"
          >
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Thêm danh mục mới</h3>
            <button
                onClick={() => setShowCategoryModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
                <FiX size={24}/>
            </button>
            
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Tên danh mục (bắt buộc)"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="border rounded w-full p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <textarea
                    placeholder="Mô tả"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="border rounded w-full p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24 resize-none"
                />
                
                <div className="flex items-center gap-3">
                    <label className="font-semibold text-sm w-20 shrink-0">Ảnh đại diện:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                try {
                                    const url = await uploadImage(file);
                                    setNewCategory({ ...newCategory, imageUrl: url });
                                } catch (error) {
                                    alert("Lỗi tải ảnh danh mục!");
                                }
                            }
                        }}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                </div>
            </div>
            
            {newCategory.imageUrl && (
                <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Ảnh xem trước:</p>
                    <img
                        src={newCategory.imageUrl}
                        alt="preview"
                        className="w-24 h-24 object-cover rounded border"
                    />
                </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!newCategory.name.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                Thêm & Chọn
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductForm;