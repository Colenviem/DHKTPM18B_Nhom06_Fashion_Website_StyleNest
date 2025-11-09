import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { FiUsers, FiShoppingBag, FiTrendingUp, FiClock } from 'react-icons/fi';

// 1. Import Context
import { useStatisticalContext } from '../../context/StatisticalContext'; // Đảm bảo đường dẫn đúng

// Hàm tính toán phần trăm tăng trưởng
const calculateGrowth = (current, previous) => {
    if (previous === 0) {
        // Nếu tuần trước bằng 0, coi là tăng 100% nếu tuần này > 0
        return current > 0 ? 100 : 0; 
    }
    const change = current - previous;
    const percent = (change / previous) * 100;
    return parseFloat(percent.toFixed(1)); // Làm tròn 1 chữ số thập phân
};

// Dữ liệu cứng ban đầu cho các thẻ (Chỉ giữ lại Total Users)
const baseStatData = [
    {
        title: "Total Users",
        value: 40689, // Giữ cứng
        icon: <FiUsers className="w-6 h-6" />,
        color: "bg-indigo-500",
        change: "+8.5% Up from yesterday",
        changeColor: "text-green-500",
        changeIcon: "▲",
        type: "USERS",
    },
];

// Biến thể Framer Motion (Giữ nguyên)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.1,
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

// Hàm định dạng tiền tệ (Ví dụ: VND)
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);
};


function StatCards() {
    // 2. Lấy TẤT CẢ dữ liệu cần thiết từ Context
    const { 
        weeklyStats, 
        weeklyLoading, 
        pendingCount, 
        pendingLoading 
    } = useStatisticalContext();
    
    // Dữ liệu Đơn hàng
    const { 
        thisWeekCount, 
        lastWeekCount,
        thisWeekAmount, 
        lastWeekAmount
    } = weeklyStats;

    // --- 1. Xử lý dữ liệu Đơn hàng Hàng tuần (Total Orders) ---
    const orderGrowthPercent = calculateGrowth(thisWeekCount, lastWeekCount);
    const isOrderIncrease = orderGrowthPercent >= 0;
    const orderChangeText = isOrderIncrease 
        ? `+${Math.abs(orderGrowthPercent)}% Up from last week`
        : `${Math.abs(orderGrowthPercent)}% Down from last week`;
    const orderChangeColor = isOrderIncrease ? "text-green-600" : "text-red-600";
    const orderChangeIcon = isOrderIncrease ? "▲" : "▼";

    const totalOrdersCard = {
        title: "Total Orders",
        value: thisWeekCount,
        icon: <FiShoppingBag className="w-6 h-6" />,
        color: "bg-yellow-500",
        change: orderChangeText,
        changeColor: orderChangeColor,
        changeIcon: orderChangeIcon,
        type: "ORDERS",
        // Dùng separator cho count
        separator: ",", 
    };

    // --- 2. Xử lý dữ liệu Doanh thu Hàng tuần (Total Sales) ---
    const salesGrowthPercent = calculateGrowth(thisWeekAmount, lastWeekAmount);
    const isSalesIncrease = salesGrowthPercent >= 0;
    const salesChangeText = isSalesIncrease 
        ? `+${Math.abs(salesGrowthPercent)}% Up from last week`
        : `${Math.abs(salesGrowthPercent)}% Down from last week`;
    const salesChangeColor = isSalesIncrease ? "text-green-600" : "text-red-600";
    const salesChangeIcon = isSalesIncrease ? "▲" : "▼";
    
    // *Lưu ý*: CountUp không thể tự động định dạng tiền tệ phức tạp (ví dụ: VND)
    // Chúng ta sẽ hiển thị CountUp cho giá trị (đã chia cho 1 triệu cho gọn)
    const displayAmount = thisWeekAmount / 1000000; // Ví dụ: 125,060,000 -> 125.06
    
    const totalSalesCard = {
        title: "Total Sales (Tr.VND)", // Đổi tên cho rõ ràng
        value: displayAmount, 
        prefix: "", // Không dùng prefix vì đã có formatCurrency
        suffix: " Tr",
        icon: <FiTrendingUp className="w-6 h-6" />,
        color: "bg-green-7800",
        change: salesChangeText,
        changeColor: salesChangeColor,
        changeIcon: salesChangeIcon,
        type: "SALES",
        // Dùng decimal cho amount
        decimal: ".",
        decimals: 2, 
    };
    
    // --- 3. Xử lý dữ liệu Pending (Total Pending) ---
    const totalPendingCard = {
        title: "Total Pending",
        value: pendingCount, 
        icon: <FiClock className="w-6 h-6" />,
        color: "bg-red-500",
        change: `Hiện đang có ${pendingCount} đơn hàng chưa duyệt`, // Có thể thay bằng logic so sánh với hôm qua/tuần trước nếu có
        changeColor: "text-red-500", 
        changeIcon: "•",
        type: "PENDING",
        separator: ",",
    };

    // Kết hợp dữ liệu (Total Users -> Orders -> Sales -> Pending)
    const finalStatData = [
        baseStatData[0], 
        totalOrdersCard, 
        totalSalesCard, 
        totalPendingCard
    ];

    // Hiển thị Loading State nếu bất kỳ API nào đang tải
    if (weeklyLoading || pendingLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-24 items-center justify-center">
                <p className="text-indigo-500 col-span-4 text-center">Đang tải thống kê...</p>
            </div>
        );
    }

    return (
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {finalStatData.map((card, i) => (
                <motion.div
                    key={card.title} 
                    variants={itemVariants}
                    whileHover={{ 
                        y: -5, 
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)' 
                    }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 300 
                    }}
                    className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 cursor-pointer"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">
                                {card.title}
                            </h3>
                            <p className="text-3xl font-extrabold mt-1 text-gray-900">
                                {/* Sử dụng thuộc tính CountUp phù hợp với từng loại dữ liệu */}
                                {card.prefix}
                                <CountUp 
                                    end={card.value} 
                                    duration={1.8} 
                                    separator={card.separator}
                                    decimal={card.decimal}
                                    decimals={card.decimals}
                                />
                                {card.suffix}
                            </p>
                        </div>
                        <div
                            className={`p-3 rounded-xl ${card.color} text-white text-xl shadow-lg bg-opacity-90`}
                        >
                            {card.icon}
                        </div>
                    </div>
                    {/* Hiển thị phần trăm thay đổi động */}
                    <p className={`text-sm mt-3 font-semibold flex items-center gap-1 ${card.changeColor}`}>
                        <span className="font-bold">{card.changeIcon}</span>
                        {card.change}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );
}

export default StatCards;