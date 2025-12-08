import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { FiUsers, FiShoppingBag, FiTrendingUp, FiClock } from 'react-icons/fi';

// Import context thống kê
import { useStatisticalContext } from '../../context/StatisticalContext';

// Import các hàm API LoginHistory
import { getTodayStats, getYesterdayStats } from "../../context/LoginHistorys";

// Tính phần trăm tăng trưởng
const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(1));
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { delayChildren: 0.1, staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

function StatCards() {

    const [todayLogins, setTodayLogins] = useState(0);
    const [yesterdayLogins, setYesterdayLogins] = useState(0);
    const [loadingLogin, setLoadingLogin] = useState(true);

    // Gọi API lấy số lần đăng nhập
    useEffect(() => {
        async function loadLoginStats() {
            setLoadingLogin(true);

            const todayData = await getTodayStats();
            const yesterdayData = await getYesterdayStats();

            const today = todayData?.length || 0;
            const yesterday = yesterdayData?.length || 0;

            setTodayLogins(today);
            setYesterdayLogins(yesterday);
            setLoadingLogin(false);
        }
        loadLoginStats();
    }, []);

    const loginGrowth = calculateGrowth(todayLogins, yesterdayLogins);
    const loginIncrease = loginGrowth >= 0;
    const loginChangeText = loginIncrease
        ? `+${Math.abs(loginGrowth)}% Up from yesterday`
        : `${Math.abs(loginGrowth)}% Down from yesterday`;
    const loginChangeColor = loginIncrease ? "text-green-600" : "text-red-600";
    const loginChangeIcon = loginIncrease ? "▲" : "▼";


    const { 
        weeklyStats, 
        weeklyLoading, 
        pendingCount, 
        pendingLoading 
    } = useStatisticalContext();

    const { thisWeekCount, lastWeekCount, thisWeekAmount, lastWeekAmount } = weeklyStats;

    // Orders
    const orderGrowthPercent = calculateGrowth(thisWeekCount, lastWeekCount);
    const orderChangeText = orderGrowthPercent >= 0
        ? `+${orderGrowthPercent}% Up from last week`
        : `${Math.abs(orderGrowthPercent)}% Down from last week`;

    // Sales
    const salesGrowthPercent = calculateGrowth(thisWeekAmount, lastWeekAmount);


    // ================================
    // 3️⃣ TẠO CÁC THẺ CARD
    // ================================
    const cardUsers = {
        title: "Total Users Today",
        value: todayLogins,
        icon: <FiUsers className="w-6 h-6" />,
        color: "bg-indigo-500",
        change: loginChangeText,
        changeColor: loginChangeColor,
        changeIcon: loginChangeIcon,
        separator: ",",
    };

    const totalOrdersCard = {
        title: "Total Orders",
        value: thisWeekCount,
        icon: <FiShoppingBag className="w-6 h-6" />,
        color: "bg-yellow-500",
        change: orderChangeText,
        changeColor: orderGrowthPercent >= 0 ? "text-green-600" : "text-red-600",
        changeIcon: orderGrowthPercent >= 0 ? "▲" : "▼",
        separator: ",",
    };

    const totalSalesCard = {
        title: "Total Sales (Tr.VND)",
        value: thisWeekAmount / 1_000_000,
        suffix: " Tr",
        icon: <FiTrendingUp className="w-6 h-6" />,
        color: "bg-green-600",
        change: salesGrowthPercent >= 0
            ? `+${salesGrowthPercent}% Up from last week`
            : `${Math.abs(salesGrowthPercent)}% Down from last week`,
        changeColor: salesGrowthPercent >= 0 ? "text-green-600" : "text-red-600",
        changeIcon: salesGrowthPercent >= 0 ? "▲" : "▼",
        decimal: ".",
        decimals: 2,
    };

    const totalPendingCard = {
        title: "Total Pending",
        value: pendingCount,
        icon: <FiClock className="w-6 h-6" />,
        color: "bg-red-500",
        change: `Hiện đang có ${pendingCount} đơn hàng chưa duyệt`,
        changeColor: "text-red-500",
        changeIcon: "•",
        separator: ",",
    };

    const finalStatData = [
        cardUsers,      // Người đăng nhập hôm nay
        totalOrdersCard,
        totalSalesCard,
        totalPendingCard,
    ];

    // Nếu API đang tải
    if (weeklyLoading || pendingLoading || loadingLogin) {
        return (
            <p className="text-indigo-500 text-center py-6">
                Đang tải thống kê...
            </p>
        );
    }

    return (
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {finalStatData.map((card) => (
                <motion.div
                    key={card.title}
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 text-sm">{card.title}</h3>
                            <p className="text-3xl font-extrabold mt-1">
                                <CountUp 
                                    end={card.value}
                                    duration={2}
                                    separator={card.separator}
                                    decimal={card.decimal}
                                    decimals={card.decimals}
                                />
                                {card.suffix}
                            </p>
                        </div>

                        <div className={`p-3 rounded-xl text-white text-xl ${card.color}`}>
                            {card.icon}
                        </div>
                    </div>

                    <p className={`mt-3 text-sm font-semibold flex items-center gap-1 ${card.changeColor}`}>
                        <span>{card.changeIcon}</span> {card.change}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );
}

export default StatCards;
