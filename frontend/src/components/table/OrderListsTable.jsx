import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiChevronDown, FiChevronUp, FiSearch, FiX } from 'react-icons/fi';
import axiosClient from "../../api/axiosClient";


const orderTypes = [
    { id: 'NORMAL', label: 'Nhanh' },
    { id: 'EXPRESS', label: 'Hỏa tốc' },
];

const statusOptions = [
    { id: 'Delivered', label: 'Delivered', color: 'green' },
    { id: 'PENDING', label: 'Pending', color: 'red' },
    { id: 'Cancelled', label: 'Cancelled', color: 'gray' },
];

const getStatusClasses = (status) => {
    switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-700';
        case 'PENDING': return 'bg-red-100 text-red-700';
        case 'Cancelled': return 'bg-gray-100 text-gray-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

const FilterModal = ({ onClose, selectedItems, setSelectedItems, options, title }) => {
    const toggleItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    return (
        <motion.div
            className="absolute top-full mt-2 left-0 w-80 bg-white rounded-xl shadow-xl p-6 z-20 border border-gray-200"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <h3 className="font-semibold text-lg text-gray-800 mb-4">{title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => toggleItem(option.id)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all
              ${selectedItems.includes(option.id)
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-700'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <button
                onClick={onClose}
                className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
            >
                Apply
            </button>
        </motion.div>
    );
};

const OrderListsTable = () => {
    const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
    const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosClient.get("/orders");
                const data = res.data;

                const mapped = data.map(order => ({
                    id: order.id,
                    name: order.user?.userName || "No Name",
                    location: order.shippingAddress?.street || "No Address",
                    date: order.createdAt,
                    paymentMethod: order.paymentMethod || "Unknown",
                    status: order.status,
                    type: order.type || "NORMAL"
                }));

                setOrders(mapped);
            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-GB', options);
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axiosClient.put(`/orders/${id}/status`, { status: newStatus });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === id ? { ...order, status: newStatus } : order
                )
            );

            alert("Cập nhật trạng thái thành công!");
        } catch (err) {
            console.error("Error updating status", err);
            const msg = err.response?.data?.message || "Failed to update status";
            alert(msg);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <FiChevronDown className="w-4 h-4 text-gray-400" />;
        }
        return sortConfig.direction === 'asc'
            ? <FiChevronUp className="w-4 h-4 text-indigo-600" />
            : <FiChevronDown className="w-4 h-4 text-indigo-600" />;
    };

    const filteredAndSortedOrders = React.useMemo(() => {
        let filtered = orders.filter((order) => {
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(order.type);
            const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(order.status);
            const matchesDate = filterDate ? order.date?.slice(0, 10) === filterDate : true;
            const matchesDateRange = (() => {
                if (!dateRange.from && !dateRange.to) return true;
                const orderDate = new Date(order.date);
                const fromDate = dateRange.from ? new Date(dateRange.from) : null;
                const toDate = dateRange.to ? new Date(dateRange.to) : null;

                if (fromDate && toDate) {
                    return orderDate >= fromDate && orderDate <= toDate;
                } else if (fromDate) {
                    return orderDate >= fromDate;
                } else if (toDate) {
                    return orderDate <= toDate;
                }
                return true;
            })();

            const matchesSearch = searchQuery === '' ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.location.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesType && matchesStatus && matchesDate && matchesDateRange && matchesSearch;
        });

        filtered.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'date') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return filtered;
    }, [orders, selectedTypes, selectedStatuses, filterDate, dateRange, searchQuery, sortConfig]);


    const activeFiltersCount =
        selectedTypes.length +
        selectedStatuses.length +
        (filterDate ? 1 : 0) +
        (dateRange.from || dateRange.to ? 1 : 0) +
        (searchQuery ? 1 : 0);

    return (
        <div className="p-6 bg-gray-50 min-h-screen pt-24">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Danh sách đặt hàng</h1>
                {activeFiltersCount > 0 && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            {activeFiltersCount} bộ lọc đang áp dụng
          </span>
                )}
            </div>

            {loading && (
                <p className="text-center text-gray-600 text-lg">Đang tải dữ liệu...</p>
            )}

            {error && (
                <p className="text-center text-red-600 text-lg">Lỗi: {error}</p>
            )}

            {!loading && !error && (
                <>
                    {/* SEARCH BAR */}
                    <div className="mb-4">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo ID, tên, hoặc địa chỉ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-10 py-3 bg-white border border-gray-300 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* FILTER BAR */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">
                        <div className="flex flex-wrap items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white border border-indigo-600 rounded-xl text-sm font-medium">
                                <FiFilter className="w-4 h-4" /> Lọc Theo
                            </button>

                            {/* Date Range */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                    className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl text-sm shadow-sm"
                                />
                                <span className="text-gray-500">-</span>
                                <input
                                    type="date"
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                    className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl text-sm shadow-sm"
                                />
                            </div>

                            {/* Order Type Filter */}
                            <div className="relative">


                                <AnimatePresence>
                                    {isTypeFilterOpen && (
                                        <FilterModal
                                            onClose={() => setIsTypeFilterOpen(false)}
                                            selectedItems={selectedTypes}
                                            setSelectedItems={setSelectedTypes}
                                            options={orderTypes}
                                            title="Chọn loại đơn hàng"
                                        />
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                                    className={`flex items-center gap-1 px-4 py-2 border rounded-xl text-sm
                    ${selectedStatuses.length > 0
                                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    Trạng thái {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
                                    <FiChevronDown className="ml-1 w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                    {isStatusFilterOpen && (
                                        <FilterModal
                                            onClose={() => setIsStatusFilterOpen(false)}
                                            selectedItems={selectedStatuses}
                                            setSelectedItems={setSelectedStatuses}
                                            options={statusOptions}
                                            title="Chọn trạng thái"
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>

                    {/* Results count */}
                    <div className="mb-4 text-sm text-gray-600">
                        Hiển thị <span className="font-semibold text-gray-900">{filteredAndSortedOrders.length}</span> đơn hàng
                        {sortConfig.key && (
                            <span className="ml-2">
                • Sắp xếp theo <span className="font-semibold">{sortConfig.key === 'date' ? 'Ngày' : sortConfig.key}</span>
                                {sortConfig.direction === 'desc' ? ' (mới → cũ)' : ' (cũ → mới)'}
              </span>
                        )}
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                            <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">

                                <th
                                    className="px-6 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors select-none"
                                    onClick={() => handleSort('id')}
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        ID {getSortIcon('id')}
                                    </div>
                                </th>

                                <th
                                    className="px-6 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors select-none"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        Tên khách hàng {getSortIcon('name')}
                                    </div>
                                </th>

                                <th
                                    className="px-6 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors select-none"
                                    onClick={() => handleSort('location')}
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        Địa điểm {getSortIcon('location')}
                                    </div>
                                </th>

                                <th
                                    className="px-6 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors select-none"
                                    onClick={() => handleSort('date')}
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        Thời gian {getSortIcon('date')}
                                    </div>
                                </th>

                                <th
                                    className="px-6 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors select-none"
                                    onClick={() => handleSort('paymentMethod')}
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        Thanh toán {getSortIcon('paymentMethod')}
                                    </div>
                                </th>

                                <th
                                    className="px-6 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors select-none"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        Trạng thái {getSortIcon('status')}
                                    </div>
                                </th>

                            </tr>
                            </thead>


                            <motion.tbody
                                className="bg-white divide-y divide-gray-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {filteredAndSortedOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500 italic">
                                            Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                                        </td>
                                    </tr>
                                )}

                                {filteredAndSortedOrders.map((order) => (
                                    <motion.tr
                                        key={order.id}
                                        className="hover:bg-gray-50 transition-colors"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <td className="px-6 py-3 font-semibold">{order.id}</td>
                                        <td className="px-6 py-3">{order.name}</td>
                                        <td className="px-6 py-3 whitespace-nowrap">{order.location}</td>
                                        <td className="px-6 py-3 whitespace-nowrap font-mono">{formatDate(order.date)}</td>
                                        <td className="px-6 py-3 text-center">{order.paymentMethod}</td>
                                        <td className="px-6 py-3">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className={`px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusClasses(order.status)}`}
                                            >
                                                <option value="Delivered">Delivered</option>
                                                <option value="PENDING">Pending</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>

                                    </motion.tr>
                                ))}
                            </motion.tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderListsTable;