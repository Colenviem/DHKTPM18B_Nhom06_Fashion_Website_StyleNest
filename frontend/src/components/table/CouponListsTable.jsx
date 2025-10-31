import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiSearch, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';

const couponsData = [
  {
    _id: "CPN001",
    code: "SALE20",
    type: "ORDER",
    discount: 20,
    description: "Giảm 20% cho đơn hàng từ 300,000 VND",
    minimumOrderAmount: 300000,
    expirationDate: "2024-12-31T23:59:59.000Z",
    usageLimit: 500,
    usedCount: 150,
    isActive: true,
  },
  {
    _id: "CPN002",
    code: "FREESHIP",
    type: "SHIPPING",
    discount: 100,
    description: "Miễn phí vận chuyển cho đơn hàng bất kỳ.",
    minimumOrderAmount: 0,
    expirationDate: "2024-11-30T23:59:59.000Z",
    usageLimit: 1000,
    usedCount: 980,
    isActive: true,
  },
  {
    _id: "CPN003",
    code: "FIXED50K",
    type: "ORDER",
    discount: 50000,
    description: "Giảm cố định 50,000 VND cho đơn hàng từ 500,000 VND.",
    minimumOrderAmount: 500000,
    expirationDate: "2024-10-31T23:59:59.000Z",
    usageLimit: 200,
    usedCount: 200,
    isActive: false,
  },
  {
    _id: "CPN004",
    code: "NEWUSER15",
    type: "PRODUCT",
    discount: 15,
    description: "Giảm 15% cho sản phẩm đầu tiên (dành cho người dùng mới).",
    minimumOrderAmount: 100000,
    expirationDate: "2025-06-30T23:59:59.000Z",
    usageLimit: 800,
    usedCount: 50,
    isActive: true,
  },
];

// Hàm định dạng số tiền VND (Giữ nguyên)
const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'VND');
};

// Hàm định dạng ngày (Giữ nguyên)
const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('vi-VN');
};

// Variants cho Framer Motion (Giữ nguyên)
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

const CouponListsTable = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Logic Lọc dữ liệu
    const filteredCoupons = couponsData.filter(coupon => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return (
            coupon.code.toLowerCase().includes(lowerCaseSearch) ||
            coupon.description.toLowerCase().includes(lowerCaseSearch) ||
            coupon._id.toLowerCase().includes(lowerCaseSearch)
        );
    });

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Danh sách Mã giảm giá</h1>

            {/* --- Thanh Tìm Kiếm & Nút Thêm Mới (Cải tiến CSS) --- */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                
                {/* Thanh Search Input */}
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã hoặc mô tả..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                </div>

                {/* Nút Thêm Mã Giảm Giá Mới */}
                <button
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-1.5"
                >
                    <FiPlus className="w-4 h-4" /> 
                    Thêm Mã giảm giá mới
                </button>
            </div>
            
            {/* --- Bảng Mã Giảm Giá --- */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    {/* --- HEADER --- */}
                    <thead className="bg-gray-50">
                        <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
                            <th className="px-6 py-4 text-left">Mã</th>
                            <th className="px-6 py-4 text-left">Loại</th>
                            <th className="px-6 py-4 text-left">Mô tả chi tiết</th>
                            <th className="px-6 py-4 text-left">Đơn tối thiểu</th>
                            <th className="px-6 py-4 text-left">Hạn sử dụng</th>
                            <th className="px-6 py-4 text-center">Đã dùng/Giới hạn</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Hành động</th> {/* Thêm cột Hành động */}
                        </tr>
                    </thead>
                    
                    {/* --- BODY --- */}
                    <motion.tbody
                        className="bg-white divide-y divide-gray-100"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredCoupons.map(coupon => (
                            <motion.tr
                                key={coupon._id}
                                variants={rowVariants}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                {/* Mã (Code) */}
                                <td className="px-6 py-4 font-extrabold text-indigo-700 whitespace-nowrap flex items-center gap-2">
                                    <BsTicketPerforated className="w-5 h-5 text-indigo-500" />
                                    {coupon.code}
                                </td>
                                
                                {/* Loại (Type) */}
                                <td className="px-6 py-4 text-gray-600">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                                        ${coupon.type === 'ORDER' ? 'bg-purple-100 text-purple-700' : 
                                          coupon.type === 'SHIPPING' ? 'bg-green-100 text-green-700' : 
                                          'bg-yellow-100 text-yellow-700'}`}>
                                        {coupon.type}
                                    </span>
                                </td>

                                {/* Mô tả */}
                                <td className="px-6 py-4 text-gray-700 max-w-xs">{coupon.description}</td>
                                
                                {/* Đơn tối thiểu */}
                                <td className="px-6 py-4 text-gray-700 font-medium whitespace-nowrap">
                                    {formatVND(coupon.minimumOrderAmount)}
                                </td>
                                
                                {/* Hạn sử dụng */}
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono">
                                    {formatDate(coupon.expirationDate)}
                                </td>
                                
                                {/* Đã dùng/Giới hạn */}
                                <td className="px-6 py-4 text-center text-gray-600">
                                    {coupon.usedCount} / {coupon.usageLimit}
                                </td>

                                {/* Trạng thái (isActive) */}
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    {coupon.isActive ? (
                                        <FiCheckCircle className="w-5 h-5 text-green-500 mx-auto" title="Hoạt động" />
                                    ) : (
                                        <FiXCircle className="w-5 h-5 text-red-500 mx-auto" title="Không hoạt động" />
                                    )}
                                </td>
                                
                                {/* Hành động (Actions) */}
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <div className="flex justify-center items-center gap-2">
                                        <button 
                                            title="Sửa"
                                            className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors"
                                        >
                                            <FiEdit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            title="Xóa"
                                            className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-colors"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        
                        {/* Hiển thị khi không tìm thấy kết quả */}
                        {filteredCoupons.length === 0 && (
                            <tr className="border-t border-gray-100">
                                <td colSpan="8" className="text-center py-8 text-gray-500 italic">
                                    Không tìm thấy mã giảm giá nào phù hợp với từ khóa "{searchTerm}".
                                </td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>
            </div>
        </div>
    );
};

export default CouponListsTable;