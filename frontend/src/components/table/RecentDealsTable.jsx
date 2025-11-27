import React, { useState, useMemo, useEffect } from 'react'; 
import { motion } from 'framer-motion';

// Import Context
// Đã thêm fetchOrdersByMonthAndYear
import { useStatisticalContext } from '../../context/StatisticalContext'; 

// --- CÁC HÀM TIỆN ÍCH (Giữ nguyên) ---

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


// --- FRAMER MOTION VARIANTS (Giữ nguyên) ---

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


// --- COMPONENT CHÍNH ---

function RecentDealsTable() {
    // Lấy dữ liệu đã lọc (allOrders), trạng thái loading và hàm fetch mới
    const { 
        allOrders, 
        allOrdersLoading, 
        error, 
        fetchAllOrders, 
        fetchOrdersByMonthAndYear 
    } = useStatisticalContext();
    
    // Khởi tạo state cho Month/Year (giữ nguyên logic mặc định)
    // TÌM THÁNG/NĂM MỚI NHẤT CÓ DỮ LIỆU TỪ MẢNG GỐC (nếu cần logic này)
    const latestDate = useMemo(() => {
        if (allOrders.length === 0) return null;
        
        // Tìm đơn hàng mới nhất
        const latestOrder = allOrders[0]; 
        
        if (latestOrder && latestOrder.createdAt) {
            try {
                const date = new Date(latestOrder.createdAt);
                return {
                    month: date.getMonth() + 1, // 1-12
                    year: date.getFullYear()
                };
            } catch (e) {
                return null;
            }
        }
        return null;
    }, [allOrders]);
    
    const today = new Date();
    const defaultMonth = latestDate?.month || (today.getMonth() + 1);
    const defaultYear = latestDate?.year || today.getFullYear();

    // Sử dụng state local để quản lý bộ lọc được chọn
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
    const [selectedYear, setSelectedYear] = useState(defaultYear);

    // --- EFFECT: THỰC HIỆN TRUY VẤN KHI THÁNG/NĂM THAY ĐỔI ---
    // Gọi API mỗi khi selectedMonth hoặc selectedYear thay đổi.
    useEffect(() => {
        // Chỉ gọi API nếu tháng và năm là số hợp lệ
        if (selectedYear && selectedMonth && selectedMonth >= 1 && selectedMonth <= 12) {
            // Gọi hàm fetch từ Context
            fetchOrdersByMonthAndYear(selectedYear, selectedMonth);
        } else if (!selectedYear || !selectedMonth) {
            // Xử lý trường hợp người dùng xóa input (tùy chọn)
            // Có thể gọi fetchAllOrders() hoặc để trống (setAllOrders([]))
            // Hiện tại ta để dữ liệu trống hoặc dùng logic của useMemo
        }
        
        // Cleanup effect: Không cần thiết trong trường hợp này, nhưng là pattern tốt
    }, [selectedYear, selectedMonth, fetchOrdersByMonthAndYear]); 
    
    
    // --- LỌC VÀ CHUẨN BỊ DỮ LIỆU ---
    
    // filteredOrders (Tên biến này không còn cần thiết nếu allOrders đã là dữ liệu đã lọc)
    // Nhưng ta giữ lại nó để lấy 10 item đầu tiên và ánh xạ
    // **QUAN TRỌNG:** Vì ta chuyển sang API Filter, allOrders giờ đã chứa dữ liệu ĐÃ LỌC
    const recentOrders = useMemo(() => {
        // allOrders giờ đã là dữ liệu LỌC từ API, và đã được sắp xếp CŨ -> MỚI (Tăng dần)
        // Ta lấy 10 đơn hàng đầu tiên (là 10 đơn hàng CŨ NHẤT trong tháng đó)
        return allOrders.slice(0, 10); 
    }, [allOrders]);
    
    // Ánh xạ dữ liệu để hiển thị trong bảng
    const tableData = recentOrders.map(order => ({
        id: order.id,
        name: order.items[0]?.product?.name || 'Multiple Items', 
        piece: order.items.reduce((sum, item) => sum + item.quantity, 0), 
        location: order.shippingAddress?.street || 'N/A', 
        date: formatDateTime(order.createdAt), 
        amount: formatCurrency(order.totalAmount), 
        status: order.status,
        image: order.items[0]?.product?.image || 'https://via.placeholder.com/60', 
    }));


    // Tạo danh sách Tháng cố định và Năm từ dữ liệu (Chỉ cần Months cố định)
    const availableMonthsInVietnamese = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => ({
            value: i + 1,
            label: `Tháng ${i + 1}`
        }));
    }, []);

    // --- HANDLERS (Đã sửa để dùng setSelectedMonth/Year) ---

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value, 10);
        setSelectedMonth(newMonth);
    }

    const handleYearChange = (e) => {
        const value = e.target.value;
        const newYear = parseInt(value, 10);
        
        // Chỉ cập nhật nếu là số hợp lệ hoặc là chuỗi rỗng
        if (!isNaN(newYear) && newYear >= 2000 && newYear <= 2099) { 
            setSelectedYear(newYear);
        } else if (value === "") {
            // Có thể chọn một giá trị mặc định khi xóa
            // Tạm thời set về năm hiện tại hoặc để null (nếu muốn vô hiệu hóa lọc)
            setSelectedYear(today.getFullYear()); 
        }
    };


    // --- RENDER DROPDOWNS ---

    const renderDropdowns = () => (
        <div className="flex gap-2">
            <select 
                className="border border-gray-300 text-sm rounded-lg px-2 py-1 text-gray-600 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
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
                value={selectedYear || ''} // Hiển thị giá trị hoặc chuỗi rỗng nếu selectedYear là null
                onChange={handleYearChange}
                className="border border-gray-300 text-sm rounded-lg px-2 py-1 text-gray-600 w-20 text-center focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
        </div>
    );

    // --- RENDER HÀM XỬ LÝ TRẠNG THÁI ---
    
    if (allOrdersLoading) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex justify-center items-center h-64">
                <p className="text-lg text-indigo-500">Đang tải dữ liệu đơn hàng...</p>
            </div>
        );
    }

    if (error && !allOrdersLoading) {
        return (
             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-64">
                <p className="text-lg text-red-500 font-semibold mb-3">Lỗi tải dữ liệu:</p>
                <p className="text-sm text-gray-700">{error}</p>
            </div>
        );
    }
    
    const currentMonthLabel = availableMonthsInVietnamese.find(m => m.value === selectedMonth)?.label || 'tháng này';

    // Xử lý khi không có dữ liệu sau khi lọc
    if (tableData.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-64">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                    <h2 className="text-xl font-semibold text-gray-800">
                        📦 Đơn hàng gần đây (Tháng {selectedMonth}/{selectedYear})
                    </h2>
                    {renderDropdowns()}
                </div>
                <p className="text-lg text-gray-500 text-center mt-12">
                    Không có đơn hàng nào trong {currentMonthLabel} năm {selectedYear}.
                </p>
            </div>
        );
    }


    // --- RENDER BẢNG CHÍNH ---

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-full overflow-x-auto">
            
            {/* --- Phần Header & Dropdown Tháng/Năm --- */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                    📦 Đơn hàng gần đây (Tháng {selectedMonth}/{selectedYear})
                </h2>
                {renderDropdowns()}
            </div>

            {/* --- Phần Bảng --- */}
            <table className="min-w-full text-sm text-left border-collapse">
                <thead className="text-gray-500 uppercase text-xs border-b border-gray-200">
                    <tr>
                        <th className="py-3 px-4">Tên sản phẩm</th>
                        <th className="py-3 px-4">Địa điểm</th>
                        <th className="py-3 px-4">Thời gian</th>
                        <th className="py-3 px-4">Tổng tiền</th>
                        <th className="py-3 px-4">Tổng số lượng</th>
                        <th className="py-3 px-4 text-center">Trạng thái</th>
                    </tr>
                </thead>
                
                <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Tải dữ liệu lên Bảng */}
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
                                    className="w-6 h-6 object-contain"
                                />
                                {row.name}
                            </td>
                            <td className="py-3 px-4 text-gray-600">{row.location}</td>
                            <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{row.date}</td>
                            <td className="py-3 px-4 text-gray-600">{row.piece}</td>
                            <td className="py-3 px-4 font-bold text-gray-800">{row.amount}</td>
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