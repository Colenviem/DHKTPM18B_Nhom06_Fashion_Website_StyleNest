import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiUser, FiMapPin, FiGift, FiSearch } from 'react-icons/fi';

const usersData = [
    {
        _id: "USR001",
        firstName: "Nguyễn",
        lastName: "Văn A",
        email: "vana@example.com",
        addresses: [
        { type: "Shipping", street: "123 Đường Láng", city: "Hà Nội" },
        { type: "Billing", street: "456 Phố Huế", city: "Hà Nội" }
        ],
        coupons: [
        { code: "WELCOME10", discount: 10, used: false }
        ],
        createdAt: "2023-01-15T08:00:00.000Z",
    },
    {
        _id: "USR002",
        firstName: "Trần",
        lastName: "Thị B",
        email: "thib@example.com",
        addresses: [
        { type: "Primary", street: "789 Điện Biên Phủ", city: "TP. Hồ Chí Minh" }
        ],
        coupons: [
        { code: "FREESHIP", discount: 100, used: true },
        { code: "SALE20", discount: 20, used: false }
        ],
        createdAt: "2023-05-20T15:30:00.000Z",
    },
    {
        _id: "USR003",
        firstName: "Lê",
        lastName: "Văn C",
        email: "vanc@example.com",
        addresses: [],
        coupons: [],
        createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
        _id: "USR004",
        firstName: "Phạm",
        lastName: "Thị D",
        email: "thid@example.com",
        addresses: [
            { type: "Home", street: "101 CMT8", city: "Đà Nẵng" }
        ],
        coupons: [
            { code: "DANANG25", discount: 25, used: false }
        ],
        createdAt: "2024-03-10T11:20:00.000Z",
    },
];

// Hàm tiện ích để định dạng ngày tháng (Chỉ lấy ngày)
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

const UserListsTable = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Logic Lọc dữ liệu
    const filteredUsers = usersData.filter(user => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        
        return (
            user.email.toLowerCase().includes(lowerCaseSearch) ||
            user._id.toLowerCase().includes(lowerCaseSearch) ||
            fullName.includes(lowerCaseSearch)
        );
    });

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Danh sách Người dùng</h1>

            {/* --- Thanh Tìm Kiếm --- */}
            <div className="flex items-center justify-start flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, ID hoặc Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    {/* --- HEADER --- */}
                    <thead className="bg-gray-50">
                        <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Tên người dùng</th>
                            <th className="px-6 py-4 text-left">Email</th>
                            <th className="px-6 py-4 text-center">Địa chỉ</th>
                            <th className="px-6 py-4 text-center">Coupon</th>
                            <th className="px-6 py-4 text-left">Ngày tham gia</th>
                            {/* Đã loại bỏ cột Hành động */}
                        </tr>
                    </thead>
                    
                    {/* --- BODY --- */}
                    <motion.tbody
                        className="bg-white divide-y divide-gray-100"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredUsers.map(user => (
                            <motion.tr
                                key={user._id}
                                variants={rowVariants}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                {/* ID */}
                                <td className="px-6 py-4 font-extrabold text-gray-900 text-left">{user._id}</td>
                                
                                {/* Tên người dùng */}
                                <td className="px-6 py-4 text-gray-800 font-medium flex items-center gap-2 text-left">
                                    <FiUser className="w-4 h-4 text-indigo-500" />
                                    {user.firstName} {user.lastName}
                                </td>
                                
                                {/* Email */}
                                <td className="px-6 py-4 text-gray-700 font-mono text-xs text-left">{user.email}</td>
                                
                                {/* Địa chỉ (Số lượng) */}
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1 font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-xs">
                                        <FiMapPin className="w-4 h-4" />
                                        {user.addresses.length}
                                    </span>
                                </td>

                                {/* Coupon (Số lượng) */}
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1 font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs">
                                        <FiGift className="w-4 h-4" />
                                        {user.coupons.length}
                                    </span>
                                </td>
                                
                                {/* Ngày tham gia */}
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono text-left">
                                    {formatDate(user.createdAt)}
                                </td>
                                
                                {/* Cột Hành động đã được loại bỏ */}
                            </motion.tr>
                        ))}
                         {/* Hiển thị khi không tìm thấy kết quả */}
                        {filteredUsers.length === 0 && (
                            <tr className="border-t border-gray-100">
                                {/* Cập nhật colSpan từ 7 xuống 6 (vì đã bỏ 1 cột) */}
                                <td colSpan="6" className="text-center py-8 text-gray-500 italic">
                                    Không tìm thấy người dùng nào phù hợp với từ khóa "{searchTerm}".
                                </td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>
            </div>
        </div>
    );
};

export default UserListsTable;