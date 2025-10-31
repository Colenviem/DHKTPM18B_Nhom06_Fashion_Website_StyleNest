import React, { useState } from 'react'; // <-- Đã thêm useState
import { motion } from 'framer-motion';
// Đã thêm FiSearch và FiPlus
import { FiCheckCircle, FiXCircle, FiUser, FiShield, FiEdit, FiTrash2, FiSearch, FiPlus } from 'react-icons/fi'; 
import { BsClockHistory } from 'react-icons/bs';

// Dữ liệu Accounts đã tạo ở trên
const accountsData = [
  {
    _id: "ACC001",
    userName: "vana_nguyen",
    passWord: "$2a$10$HASHED_PASSWORD_FOR_VANA",
    role: "CUSTOMER",
    isActive: true,
    userId: "USR001",
    lastLogin: "2025-10-30T10:00:00.000Z"
  },
  {
    _id: "ACC002",
    userName: "admin_le",
    passWord: "$2a$10$HASHED_PASSWORD_FOR_ADMIN",
    role: "ADMIN",
    isActive: true,
    userId: "USR003",
    lastLogin: "2025-10-31T09:00:00.000Z"
  },
  {
    _id: "ACC003",
    userName: "tranthib",
    passWord: "$2a$10$HASHED_PASSWORD_FOR_THIB",
    role: "CUSTOMER",
    isActive: false,
    userId: "USR002",
    lastLogin: "2025-08-01T14:30:00.000Z"
  },
  {
    _id: "ACC004",
    userName: "support_pham",
    passWord: "$2a$10$HASHED_PASSWORD_FOR_SUPPORT",
    role: "SUPPORT",
    isActive: true,
    userId: "USR004",
    lastLogin: "2025-10-31T08:00:00.000Z"
  },
];

// Hàm tiện ích để định dạng thời gian đăng nhập
const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString('vi-VN');
    const timePart = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} ${timePart}`;
};

// Hàm lấy class CSS cho Role
const getRoleClasses = (role) => {
    switch (role) {
        case 'ADMIN':
            return 'bg-red-100 text-red-700 font-extrabold';
        case 'SUPPORT':
            return 'bg-yellow-100 text-yellow-700 font-bold';
        case 'CUSTOMER':
        default:
            return 'bg-blue-100 text-blue-700 font-medium';
    }
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

const AccountListsTable = () => {
    const [searchTerm, setSearchTerm] = useState(''); // State cho thanh tìm kiếm

    // Logic Lọc dữ liệu
    const filteredAccounts = accountsData.filter(account => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return (
            account.userName.toLowerCase().includes(lowerCaseSearch) ||
            account._id.toLowerCase().includes(lowerCaseSearch) ||
            account.userId.toLowerCase().includes(lowerCaseSearch)
        );
    });

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
             <h1 className="text-3xl font-semibold text-gray-800 mb-4">Danh sách Tài khoản</h1>

            {/* --- Thanh Tìm Kiếm & Nút Thêm Mới --- */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                
                {/* Thanh Search Input */}
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo ID hoặc Username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                </div>

                {/* Nút Thêm Tài khoản mới (Mẫu) */}
                <button
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-1.5"
                >
                    <FiPlus className="w-4 h-4" /> 
                    Thêm Tài khoản mới
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    {/* --- HEADER --- */}
                    <thead className="bg-gray-50">
                        <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
                            <th className="px-6 py-4 text-left">Account ID</th>
                            <th className="px-6 py-4 text-left">Username</th>
                            <th className="px-6 py-4 text-left">Liên kết User ID</th>
                            <th className="px-6 py-4 text-center">Vai trò</th>
                            <th className="px-6 py-4 text-left">Đăng nhập cuối</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    
                    {/* --- BODY --- */}
                    <motion.tbody
                        className="bg-white divide-y divide-gray-100"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredAccounts.map(account => (
                            <motion.tr
                                key={account._id}
                                variants={rowVariants}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                {/* Account ID */}
                                <td className="px-6 py-4 font-extrabold text-gray-900">{account._id}</td>
                                
                                {/* Username */}
                                <td className="px-6 py-4 text-gray-800 font-medium flex items-center gap-2">
                                    <FiUser className="w-4 h-4 text-indigo-500" />
                                    {account.userName}
                                </td>
                                
                                {/* User ID (Liên kết) */}
                                <td className="px-6 py-4 text-gray-600 font-mono text-xs">{account.userId}</td>
                                
                                {/* Vai trò (Role) */}
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${getRoleClasses(account.role)}`}>
                                        <FiShield className="w-3 h-3" />
                                        {account.role}
                                    </span>
                                </td>

                                {/* Đăng nhập cuối */}
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono flex items-center gap-1">
                                    <BsClockHistory className="w-3 h-3 text-gray-400" />
                                    {formatDateTime(account.lastLogin)}
                                </td>
                                
                                {/* Trạng thái (isActive) */}
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    {account.isActive ? (
                                        <FiCheckCircle className="w-5 h-5 text-green-500 mx-auto" title="Hoạt động" />
                                    ) : (
                                        <FiXCircle className="w-5 h-5 text-red-500 mx-auto" title="Ngừng hoạt động" />
                                    )}
                                </td>

                                {/* Cột Hành động */}
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <div className="flex justify-center items-center gap-2">
                                        <button 
                                            title="Sửa thông tin"
                                            className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors"
                                        >
                                            <FiEdit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            title={account.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                                            className={`p-2 rounded-full transition-colors ${
                                                account.isActive ? 
                                                'text-red-600 hover:text-red-800 hover:bg-red-100' :
                                                'text-green-600 hover:text-green-800 hover:bg-green-100'
                                            }`}
                                        >
                                            {account.isActive ? (
                                                <FiXCircle className="w-4 h-4" /> 
                                            ) : (
                                                <FiCheckCircle className="w-4 h-4" /> 
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        
                        {/* Hiển thị khi không tìm thấy kết quả */}
                        {filteredAccounts.length === 0 && (
                            <tr className="border-t border-gray-100">
                                <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                                    Không tìm thấy tài khoản nào phù hợp với từ khóa "{searchTerm}".
                                </td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>
            </div>
        </div>
    );
};

export default AccountListsTable;