import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
// Sử dụng các icon mẫu của bạn
import { FiUsers, FiShoppingBag, FiTrendingUp, FiClock } from 'react-icons/fi';

// Dữ liệu ban đầu
const statData = [
    {
        title: "Total Users",
        value: 40689, // Thay chuỗi bằng số để dùng CountUp
        icon: <FiUsers className="w-6 h-6" />,
        color: "bg-indigo-500", // Màu đơn sắc cho nền icon
        change: "+8.5% Up from yesterday",
        changeColor: "text-green-500",
        changeIcon: "▲",
    },
    {
        title: "Total Orders",
        value: 10293,
        icon: <FiShoppingBag className="w-6 h-6" />,
        color: "bg-yellow-500",
        change: "+1.3% Up from last week",
        changeColor: "text-green-500",
        changeIcon: "▲",
    },
    {
        title: "Total Sales",
        value: 89000,
        prefix: "$",
        icon: <FiTrendingUp className="w-6 h-6" />,
        color: "bg-green-500",
        change: "-4.3% Down from yesterday",
        changeColor: "text-red-500",
        changeIcon: "▼",
    },
    {
        title: "Total Pending",
        value: 2040,
        icon: <FiClock className="w-6 h-6" />,
        color: "bg-red-500",
        change: "+1.8% Up from yesterday",
        changeColor: "text-green-500",
        changeIcon: "▲",
    },
];

// Biến thể cho Container (lưới) để tạo hiệu ứng Stagger
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.1, // Chờ 0.1s rồi bắt đầu
            staggerChildren: 0.15, // Mỗi thẻ cách nhau 0.15s
        },
    },
};

// Biến thể cho từng Card (item)
const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Bắt đầu ẩn, dịch xuống 30px
    visible: { opacity: 1, y: 0 },   // Hiện ra, về vị trí ban đầu
};

function StatCards() {
    return (
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {statData.map((card, i) => (
                <motion.div
                    key={i}
                    variants={itemVariants}
                    // Hiệu ứng di chuột: nảy lên nhẹ
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
                                {/* Áp dụng CountUp cho hiệu ứng đếm số */}
                                {card.prefix}
                                <CountUp end={card.value} duration={1.8} separator="," />
                            </p>
                        </div>
                        <div
                            className={`p-3 rounded-xl ${card.color} text-white text-xl shadow-lg bg-opacity-90`}
                            // Thay đổi: Dùng màu nền đơn sắc (không gradient) và bo góc vuông hơn (rounded-xl)
                        >
                            {card.icon}
                        </div>
                    </div>
                    {/* Thay đổi: Dùng icon để biểu thị tăng/giảm */}
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