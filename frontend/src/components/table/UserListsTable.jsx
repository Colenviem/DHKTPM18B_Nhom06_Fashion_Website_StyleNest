import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion'; // Tắt animation để debug
import { FiUser, FiMapPin, FiGift, FiSearch, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

// Hàm tiện ích để định dạng ngày tháng (Chỉ lấy ngày)
const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('vi-VN');
};

// Component Skeleton cho bảng
const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
        <td className="px-6 py-4 text-center"><div className="h-6 w-12 bg-gray-200 rounded-full mx-auto"></div></td>
        <td className="px-6 py-4 text-center"><div className="h-6 w-12 bg-gray-200 rounded-full mx-auto"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
    </tr>
);


const UserListsTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Người dùng chưa đăng nhập.");
                }

                const response = await axios.get('http://localhost:8080/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUsers(response.data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải danh sách người dùng:", err);
                setError(err.response?.data?.message || "Không thể tải dữ liệu. Bạn có thể chưa đăng nhập hoặc không có quyền.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        // Đảm bảo các trường không bị null trước khi gọi toLowerCase()
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        const id = (user.id || '').toLowerCase();

        return (
            email.includes(lowerCaseSearch) ||
            id.includes(lowerCaseSearch) ||
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
                    </tr>
                    </thead>

                    {/* --- BODY ---
                     *
                     * BỎ HẾT MOTION.TBODY
                     *
                     */}
                    <tbody className="bg-white divide-y divide-gray-100">
                    {/* Loading */}
                    {isLoading && (
                        <>
                            <SkeletonRow />
                            <SkeletonRow />
                            <SkeletonRow />
                        </>
                    )}

                    {/* Error */}
                    {!isLoading && error && (
                        <tr className="border-t border-gray-100">
                            <td colSpan="6" className="text-center py-8 text-red-500 italic">
                                <div className="flex justify-center items-center gap-2">
                                    <FiAlertCircle />
                                    {error}
                                </div>
                            </td>
                        </tr>
                    )}

                    {/* Empty */}
                    {!isLoading && !error && filteredUsers.length === 0 && (
                        <tr className="border-t border-gray-100">
                            <td colSpan="6" className="text-center py-8 text-gray-500 italic">
                                {users.length === 0
                                    ? "Không có người dùng nào trong hệ thống."
                                    : `Không tìm thấy người dùng nào phù hợp với từ khóa "${searchTerm}".`
                                }
                            </td>
                        </tr>
                    )}

                    {/* Data
                         *
                         * BỎ HẾT MOTION.TR
                         *
                         */}
                    {!isLoading && !error && filteredUsers.map(user => (
                        <tr
                            key={user.id}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            {/* ID */}
                            <td className="px-6 py-4 font-extrabold text-gray-900 text-left">{user.id}</td>

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
                                        {user.addresses ? user.addresses.length : 0}
                                    </span>
                            </td>

                            {/* Coupon (Số lượng) */}
                            <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1 font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs">
                                        <FiGift className="w-4 h-4" />
                                        {user.coupons ? user.coupons.length : 0}
                                    </span>
                            </td>

                            {/* Ngày tham gia */}
                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono text-left">
                                {formatDate(user.createdAt)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserListsTable;