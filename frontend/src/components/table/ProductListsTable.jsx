import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiSearch, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

// 1. Dữ liệu Sản phẩm MỚI (chỉ lấy 2 mẫu cho gọn)
const detailedProductsData = [
    {
        _id: "PRD001",
        name: "Áo Thun Cotton Oversize",
        shortDescription: "Áo thun cotton phom rộng, nhiều màu.",
        category: { id: "CAT001", name: "Áo Nam" },
        price: 250000, // VND
        discount: 10, // %
        sold: 32,
        variants: [
            { sku: "ATOS-W-M", color: "white", size: "M", inStock: 30, isAvailable: "true", images: ["https://placehold.co/60x60/FFFFFF/333333/png?text=W"] },
            { sku: "ATOS-W-L", color: "white", size: "L", inStock: 25, isAvailable: "true", images: ["https://placehold.co/60x60/FFFFFF/333333/png?text=W"] },
            { sku: "ATOS-B-M", color: "black", size: "M", inStock: 20, isAvailable: "true", images: ["https://placehold.co/60x60/000000/FFFFFF/png?text=B"] },
        ],
        isAvailable: true,
    },
    {
        _id: "PRD002",
        name: "Quần Jeans Nữ Cạp Cao",
        shortDescription: "Jeans cạp cao co giãn, phong cách Hàn Quốc.",
        category: { id: "CAT002", name: "Quần Nữ" },
        price: 499000,
        discount: 0,
        sold: 150,
        variants: [
            { sku: "JCC-BL-S", color: "blue", size: "S", inStock: 10, isAvailable: "true", images: ["https://placehold.co/60x60/3B82F6/FFFFFF/png?text=J"] },
            { sku: "JCC-BL-M", color: "blue", size: "M", inStock: 5, isAvailable: "true", images: ["https://placehold.co/60x60/3B82F6/FFFFFF/png?text=J"] },
        ],
        isAvailable: true, // Dù 1 variant gần hết hàng, sản phẩm vẫn có thể có sẵn
    },
    {
        _id: "PRD003",
        name: "Giày Sneaker Thời Trang",
        shortDescription: "Giày thể thao đế mềm, nhẹ, dễ phối đồ.",
        category: { id: "CAT004", name: "Giày Dép" },
        price: 850000,
        discount: 15,
        sold: 210,
        variants: [
            { sku: "SNTT-W-38", color: "white", size: "38", inStock: 0, isAvailable: "false", images: ["https://placehold.co/60x60/F761A1/FFFFFF/png?text=S"] },
            { sku: "SNTT-W-39", color: "white", size: "39", inStock: 1, isAvailable: "true", images: ["https://placehold.co/60x60/F761A1/FFFFFF/png?text=S"] },
        ],
        isAvailable: false, // Giả sử nếu tổng stock < 5 thì coi là không có sẵn
    },
];

// 2. Hàm tiện ích để tính tổng tồn kho và định dạng VND
const calculateTotalStock = (variants) => {
    return variants.reduce((sum, variant) => sum + variant.inStock, 0);
};

const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// 3. Components và Variants (Giữ nguyên)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const rowVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

const ProductListsTable = () => {
  const [search, setSearch] = useState("");

  const filteredProducts = detailedProductsData.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product._id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 pt-24 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Quản lý Sản phẩm Tồn kho</h1>

        {/* Search Bar */}
        <div className="relative w-full max-w-lg bg-white rounded-xl shadow-md mb-6">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Tìm kiếm theo Tên hoặc Mã sản phẩm..."
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {/* CÁC TRƯỜNG QUAN TRỌNG ĐÃ CHỌN */}
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Sản phẩm (ID)
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Danh mục
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Giá (Đã giảm)
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Tổng Tồn kho
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Đã bán
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Trạng thái
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Hành động
                        </th>
                    </tr>
                </thead>

                <motion.tbody
                    className="bg-white divide-y divide-gray-100"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredProducts.map((product) => {
                        // Tính toán các giá trị hiển thị
                        const totalStock = calculateTotalStock(product.variants);
                        const finalPrice = product.price * (1 - product.discount / 100);
                        const image = product.variants[0]?.images[0] || "https://placehold.co/60x60/E0E0E0/333333?text=N/A";

                        return (
                            <motion.tr
                                key={product._id}
                                variants={rowVariants}
                                className="hover:bg-indigo-50 transition-colors cursor-pointer"
                            >
                                {/* Sản phẩm (Ảnh + ID + Tên) */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={image}
                                            alt={product.name}
                                            className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-100 shadow-sm"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/E0E0E0/333333?text=N/A" }}
                                        />
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                                            <div className="text-xs text-gray-500 font-mono">{product._id}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Danh mục */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                                        {product.category.name}
                                    </span>
                                </td>

                                {/* Giá (Đã giảm) */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {formatVND(finalPrice)}
                                    {product.discount > 0 && (
                                        <span className="ml-2 text-xs text-red-500 font-normal">
                                            (-{product.discount}%)
                                        </span>
                                    )}
                                </td>

                                {/* Tổng Tồn kho */}
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${totalStock < 10 ? 'bg-red-100 text-red-800' : totalStock < 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                        {totalStock} Pcs
                                    </span>
                                </td>
                                
                                {/* Đã bán */}
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700 font-medium">
                                    {product.sold}
                                </td>

                                {/* Trạng thái */}
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {product.isAvailable ? (
                                        <FiCheckCircle className="w-5 h-5 text-green-500 mx-auto" title="Có sẵn" />
                                    ) : (
                                        <FiXCircle className="w-5 h-5 text-red-500 mx-auto" title="Hết hàng/Ngừng bán" />
                                    )}
                                </td>

                                {/* Hành động */}
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex space-x-2 justify-center">
                                        <Link to={`/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100 transition">
                                        <FiEdit2 className="w-5 h-5" />
                                        </Link>
                                        <Link to={`/products/delete/${product._id}`} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition">
                                        <FiTrash2 className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </td>
                            </motion.tr>
                        );
                    })}
                    
                    {/* Hiển thị khi không tìm thấy */}
                    {filteredProducts.length === 0 && (
                        <tr className="border-t border-gray-100">
                            <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                                Không tìm thấy sản phẩm nào.
                            </td>
                        </tr>
                    )}
                </motion.tbody>
                </table>
            </div>
        </div>
  );
};

export default ProductListsTable;