import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion'; // Tắt animation để debug
import {
    FiCheckCircle, FiXCircle, FiUser, FiShield, FiEdit, FiSearch, FiPlus, FiAlertCircle
} from 'react-icons/fi';
import { BsClockHistory } from 'react-icons/bs';
import axios from 'axios';

// Hàm tiện ích để định dạng thời gian
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

// Component Skeleton cho bảng
const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
        <td className="px-6 py-4 text-center"><div className="h-6 w-20 bg-gray-200 rounded-full mx-auto"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
        <td className="px-6 py-4 text-center"><div className="h-5 w-5 bg-gray-200 rounded-full mx-auto"></div></td>
        <td className="px-6 py-4 text-center">
            <div className="flex justify-center items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
        </td>
    </tr>
);

const AccountListsTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/accounts', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAccounts(response.data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải danh sách tài khoản:", err);
                setError( "Không thể tải dữ liệu. Bạn có thể chưa đăng nhập hoặc không có quyền.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const filteredAccounts = accounts.filter(account => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const userName = (account.userName || '').toLowerCase();
        const id = (account.id || '').toLowerCase();
        const userId = (account.userId || '').toLowerCase();

        return (
            userName.includes(lowerCaseSearch) ||
            id.includes(lowerCaseSearch) ||
            userId.includes(lowerCaseSearch)
        );
    });

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Danh sách Tài khoản</h1>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
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
                <button
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-1.5"
                >
                    <FiPlus className="w-4 h-4" />
                    Thêm Tài khoản mới
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                    <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
                        <th className="px-6 py-4 text-left">Account ID</th>
                        <th className="px-6 py-4 text-left">Username</th>
                        <th className="px-6 py-4 text-left">Liên kết User ID</th>
                        <th className="px-6 py-4 text-center">Vai trò</th>
                        <th className="px-6 py-4 text-left">Hết hạn Xác thực</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-center">Hành động</th>
                    </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-100">
                    {isLoading && (
                        <>
                            <SkeletonRow />
                            <SkeletonRow />
                            <SkeletonRow />
                        </>
                    )}

                    {!isLoading && error && (
                        <tr className="border-t border-gray-100">
                            <td colSpan="7" className="text-center py-8 text-red-500 italic">
                                <div className="flex justify-center items-center gap-2">
                                    <FiAlertCircle />
                                    {error}
                                </div>
                            </td>
                        </tr>
                    )}

                    {!isLoading && !error && filteredAccounts.length === 0 && (
                        <tr className="border-t border-gray-100">
                            <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                                {accounts.length === 0
                                    ? "Không có tài khoản nào trong hệ thống."
                                    : `Không tìm thấy tài khoản nào phù hợp với từ khóa "${searchTerm}".`
                                }
                            </td>
                        </tr>
                    )}

                    {!isLoading && !error && filteredAccounts.map(account => (
                        <tr
                            key={account.id}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            {/* Account ID */}
                            <td className="px-6 py-4 font-extrabold text-gray-900">{account.id}</td>

                            {/* Username */}
                            <td className="px-6 py-4 text-gray-800 font-medium flex items-center gap-2">
                                <FiUser className="w-4 h-4 text-indigo-500" />
                                {account.username}
                                fetchAccounts                       </td>

                            {/* User ID (Liên kết) */}
                            <td className="px-6 py-4 text-gray-600 font-mono text-xs">{account.userId || 'Chưa liên kết'}</td>

                            {/* Vai trò (Role) */}
                            <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${getRoleClasses(account.role)}`}>
                                        <FiShield className="w-3 h-3" />
                                        {account.role}
                                    </span>
                            </td>

                            {/* Hết hạn Xác thực (Đọc từ verificationExpiry) */}
                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono flex items-center gap-1">
                                <BsClockHistory className="w-3 h-3 text-gray-400" />
                                {formatDateTime(account.verificationExpiry)}
                            </td>

                            {/* * --- SỬA LỖI ---
                                 * Đổi "account.isActive" thành "account.active"
                                 * (Vì Jackson tự động đổi tên khi serialize)
                                 */}
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                {account.active ? ( // <-- SỬA LẠI THÀNH "active"
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
                                        title={account.active ? "Vô hiệu hóa" : "Kích hoạt"} // <-- SỬA LẠI THÀNH "active"
                                        className={`p-2 rounded-full transition-colors ${
                                            account.active ? // <-- SỬA LẠI THÀNH "active"
                                                'text-red-600 hover:text-red-800 hover:bg-red-100' :
                                                'text-green-600 hover:text-green-800 hover:bg-green-100'
                                        }`}
                                    >
                                        {account.active ? ( // <-- SỬA LẠI THÀNH "active"
                                            <FiXCircle className="w-4 h-4" />
                                        ) : (
                                            <FiCheckCircle className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccountListsTable;