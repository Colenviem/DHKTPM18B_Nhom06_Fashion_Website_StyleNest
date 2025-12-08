import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosClient from '../../api/axiosClient';

const getStatusClasses = (status) => {
    const normalizedStatus = status ? status.toUpperCase() : 'UNKNOWN';
    switch (normalizedStatus) {
        case "DELIVERED":
            return "bg-green-100 text-green-700";
        case "PENDING":
        case "PROCESSING":
            return "bg-yellow-100 text-yellow-700";
        case "CANCELED":
        case "CANCELLED":
            return "bg-red-100 text-red-700";
        case "PAID":
            return "bg-green-100 text-green-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const formatDateTime = (isoDate) => {
    if (!isoDate) return 'N/A';
    try {
        const date = new Date(isoDate);
        const datePart = date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
        const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        return `${datePart} - ${timePart}`;
    } catch (e) {
        return 'Invalid Date';
    }
};

const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.08,
        },
    },
};

const rowVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
};
function RecentDealsTable() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await axiosClient.get('/orders');
                const allData = res.data;
                const filtered = allData.filter(order => {
                    if (!order.createdAt) return false;
                    const d = new Date(order.createdAt);
                    return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
                });
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(filtered.slice(0, 20));
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải đơn hàng:", err);
                setError("Không thể tải dữ liệu đơn hàng.");
            } finally {
                setLoading(false);
            }
        };

        if (selectedYear && selectedMonth) {
            fetchOrders();
        }
    }, [selectedMonth, selectedYear]);
    const tableData = useMemo(() => orders.map(order => ({
        id: order.id,
        name: order.items?.[0]?.product?.name || 'Sản phẩm khác...',
        piece: order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
        location: order.shippingAddress?.street || 'N/A',
        date: formatDateTime(order.createdAt),
        amount: formatCurrency(order.totalPrice || order.totalAmount),
        status: order.status,
        image: order.items?.[0]?.product?.image || 'https://via.placeholder.com/60',
    })), [orders]);

    const availableMonthsInVietnamese = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => ({
            value: i + 1,
            label: `Tháng ${i + 1}`
        }));
    }, []);
    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value, 10));
    }

    const handleYearChange = (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 2000 && val <= 2099) {
            setSelectedYear(val);
        }
    };
    const renderDropdowns = () => (
        <div className="flex gap-2">
            <select
                className="border border-gray-300 text-sm rounded-lg px-2 py-1 text-gray-600 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 outline-none"
                value={selectedMonth}
                onChange={handleMonthChange}
            >
                {availableMonthsInVietnamese.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                ))}
            </select>
            <input
                type="number"
                min="2020"
                max="2030"
                value={selectedYear}
                onChange={handleYearChange}
                className="border border-gray-300 text-sm rounded-lg px-2 py-1 text-gray-600 w-20 text-center focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 outline-none"
            />
        </div>
    );
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex justify-center items-center h-64">
                <p className="text-lg text-indigo-500 animate-pulse">Đang tải dữ liệu đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-64 flex flex-col items-center justify-center">
                <p className="text-lg text-red-500 font-semibold mb-2">Lỗi tải dữ liệu</p>
                <p className="text-sm text-gray-500">{error}</p>
            </div>
        );
    }

    const currentMonthLabel = availableMonthsInVietnamese.find(m => m.value === selectedMonth)?.label || 'tháng này';
    if (tableData.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-64">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                    <h2 className="text-xl font-semibold text-gray-800">
                        📦 Đơn hàng gần đây
                    </h2>
                    {renderDropdowns()}
                </div>
                <div className="flex flex-col items-center justify-center h-40">
                    <p className="text-lg text-gray-400">
                        Không có đơn hàng nào trong {currentMonthLabel} năm {selectedYear}.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-full overflow-x-auto">

            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                    📦 Đơn hàng gần đây
                </h2>
                {renderDropdowns()}
            </div>

            <table className="min-w-full text-sm text-left border-collapse">
                <thead className="text-gray-500 uppercase text-xs border-b border-gray-200">
                <tr>
                    <th className="py-3 px-4">Tên sản phẩm</th>
                    <th className="py-3 px-4">Địa điểm</th>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Tổng tiền</th>
                    <th className="py-3 px-4 text-center">Số lượng</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                </tr>
                </thead>

                <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {tableData.map((row) => (
                        <motion.tr
                            key={row.id}
                            variants={rowVariants}
                            className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                            <td className="py-3 px-4 flex items-center gap-3 font-medium text-gray-800">
                                <img
                                    src={row.image}
                                    alt={row.name}
                                    className="w-10 h-10 object-cover rounded-md border border-gray-200"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/60"; }}
                                />
                                <span className="line-clamp-1 max-w-[200px]" title={row.name}>{row.name}</span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 max-w-[150px] truncate" title={row.location}>
                                {row.location}
                            </td>
                            <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{row.date}</td>

                            <td className="py-3 px-4 font-bold text-gray-800">{row.amount}</td>
                            <td className="py-3 px-4 text-gray-600 text-center">{row.piece}</td>

                            <td className="py-3 px-4 text-center">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusClasses(row.status)}`}
                                >
                                    {row.status}
                                </span>
                            </td>
                        </motion.tr>
                    ))}
                </motion.tbody>
            </table>
        </div>
    );
}

export default RecentDealsTable;