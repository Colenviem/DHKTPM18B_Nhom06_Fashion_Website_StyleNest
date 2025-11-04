import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiSearch, FiCheckCircle, FiXCircle, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom"; 
import { getAllProducts } from "../../context/ProductContext";

const calculateTotalStock = (variants) => {
    if (!variants || !Array.isArray(variants)) return 0;
    return variants.reduce((sum, variant) => sum + variant.inStock, 0);
};

const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getProductStatus = (totalStock, isAvailable) => {
    const isProductAvailable = isAvailable === true || isAvailable === "true" || isAvailable === 1 || isAvailable === "1";
    if (isProductAvailable) {
        if (totalStock > 0) {
            return {
                text: "Còn hàng",
                icon: <FiCheckCircle className="w-5 h-5 text-green-500 mx-auto" />,
                colorClass: "text-green-600 font-bold",
            };
        } else {
            return {
                text: "Hết hàng",
                icon: <FiAlertTriangle className="w-5 h-5 text-yellow-500 mx-auto" />,
                colorClass: "text-yellow-600 font-bold",
            };
        }
    } else {
        return {
            text: "Ngừng bán",
            icon: <FiXCircle className="w-5 h-5 text-red-500 mx-auto" />,
            colorClass: "text-red-600 font-bold",
        };
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const rowVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

const ProductListsTable = () => {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const handleRowClick = (productId) => {
        navigate(`/admin/products/edit/${productId}`); 
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllProducts();
                setProducts(data);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err.message);
                setError("Đã xảy ra lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.id.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-6 pt-24 bg-gray-50 min-h-screen flex items-center justify-center">
                <FiLoader className="w-8 h-8 text-indigo-500 animate-spin mr-3" />
                <span className="text-lg font-medium text-indigo-600">Đang tải dữ liệu sản phẩm...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 pt-24 bg-gray-50 min-h-screen text-center">
                <h1 className="text-3xl font-extrabold text-red-600 mb-4">Lỗi Tải Dữ liệu 😔</h1>
                <p className="text-gray-700">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Tải lại trang
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
            {/* ... (Phần UI Search Bar) ... */}
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Quản lý Sản phẩm</h1>
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
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sản phẩm (ID)</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá (Đã giảm)</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Tổng Tồn kho</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Đã bán</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>

                    <motion.tbody
                        className="bg-white divide-y divide-gray-100"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredProducts.map((product) => {
                            const totalStock = calculateTotalStock(product.variants);
                            const finalPrice = product.price * (1 - product.discount / 100);
                            const image = product.variants?.[0]?.images?.[0] || "https://placehold.co/60x60/E0E0E0/333333?text=N/A";
                            const status = getProductStatus(totalStock, product.available); 

                            return (
                                <motion.tr
                                    key={product.id}
                                    variants={rowVariants}
                                    className="hover:bg-indigo-50 transition-colors cursor-pointer"
                                    onClick={() => handleRowClick(product.id)} // 🌟 GỌI HÀM ĐIỀU HƯỚNG
                                >
                                    {/* Sản phẩm (Ảnh + ID + Tên) */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image || image} 
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-100 shadow-sm"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/E0E0E0/333333?text=N/A" }}
                                            />
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500 font-mono">{product.id}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Danh mục (Giữ nguyên) */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                                            {product.category?.name || "N/A"}
                                        </span>
                                    </td>

                                    {/* Giá (Đã giảm) (Giữ nguyên) */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {formatVND(finalPrice)}
                                        {product.discount > 0 && (
                                            <span className="ml-2 text-xs text-red-500 font-normal">
                                                (-{product.discount}%)
                                            </span>
                                        )}
                                    </td>

                                    {/* Tổng Tồn kho (Giữ nguyên) */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${totalStock < 10 && totalStock > 0 ? 'bg-red-100 text-red-800' : totalStock === 0 ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                                            {totalStock} Pcs
                                        </span>
                                    </td>
                                    
                                    {/* Đã bán (Giữ nguyên) */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700 font-medium">
                                        {product.sold}
                                    </td>

                                    {/* TRẠNG THÁI MỚI (Giữ nguyên) */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            {status.icon}
                                            <span className={`text-xs mt-1 ${status.colorClass}`}>{status.text}</span>
                                        </div>
                                    </td>

                                    {/* Hành động: Ngăn sự kiện click lan truyền */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium"
                                        onClick={(e) => e.stopPropagation()} // 🌟 NGĂN SỰ KIỆN CLICK LAN TRUYỀN
                                    >
                                        <div className="flex space-x-2 justify-center">
                                            <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100 transition">
                                            <FiEdit2 className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                        
                        {filteredProducts.length === 0 && !loading && (
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