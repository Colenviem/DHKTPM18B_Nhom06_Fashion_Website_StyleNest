import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStatisticalContext } from '../../context/StatisticalContext'; // Import Context đã tạo

// Biến thể Framer Motion cho Card
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.6, ease: "easeOut" } 
    },
};

// Hàm định dạng Tooltip (Optional: giúp hiển thị số tiền dễ đọc hơn)
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-md text-sm">
                <p className="text-gray-700 font-medium">Từ ngày: {label}</p>
                <p className="text-indigo-600">
                    Doanh thu: 
                    <span className="font-bold ml-1">
                        {payload[0].value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 })}
                    </span>
                </p>
            </div>
        );
    }
    return null;
};

// Hàm định dạng trục Y (ví dụ: 100000000 -> 100M)
const formatCurrencyTick = (value) => {
    if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)} Tỷ`;
    }
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(0)} Tr`;
    }
    return value;
};


function SalesOverviewChart() {
    const { data: rawData, loading, error, fetchMonthlyRevenue } = useStatisticalContext();
    
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedMonth, setSelectedMonth] = useState(11);

    const chartData = useMemo(() => {
        return rawData.map(item => ({
            name: item.range,      // '1–5', '6–10', ... (Trục X)
            revenue: item.revenue  // Giá trị Doanh thu (Trục Y)
        }));
    }, [rawData]);

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value, 10);
        setSelectedMonth(newMonth);
        fetchMonthlyRevenue(selectedYear, newMonth);
    };

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value, 10);
        setSelectedYear(newYear);
        fetchMonthlyRevenue(newYear, selectedMonth);
    };

    // Tạo danh sách tháng (cho Dropdown)
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: `Tháng ${i + 1}`,
    }));

    return (
        <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            {/* --- Phần Header & Dropdown Tháng/Năm --- */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                    📈 Doanh thu theo Ngày (Tháng {selectedMonth}/{selectedYear})
                </h2>
                <div className="flex gap-2">
                    <select 
                        className="border border-gray-300 text-sm rounded-lg px-2 py-1 text-gray-600 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                    >
                        {months.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min="2020"
                        max="2030"
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="border border-gray-300 text-sm rounded-lg px-2 py-1 text-gray-600 w-20 text-center focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    />
                </div>
            </div>

            {/* --- Hiển thị trạng thái --- */}
            {loading && <div className="h-72 flex items-center justify-center"><p className="text-indigo-500">Đang tải dữ liệu doanh thu...</p></div>}
            {error && <div className="h-72 flex items-center justify-center"><p className="text-red-500">Lỗi: {error}</p></div>}
            {(!loading && !error && chartData.length === 0) && (
                <div className="h-72 flex items-center justify-center"><p className="text-gray-500">Không có dữ liệu doanh thu cho tháng này.</p></div>
            )}

            {/* --- Phần Biểu đồ --- */}
            {!loading && !error && chartData.length > 0 && (
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                            data={chartData} // Sử dụng dữ liệu đã được chuyển đổi
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }} 
                        >
                            {/* Lưới ngang mờ */}
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="#f0f0f0" 
                                vertical={false} 
                            />
                            
                            {/* Trục X: Khoảng ngày */}
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 12, fill: '#9ca3af' }} 
                                padding={{ left: 20, right: 20 }} 
                            />
                            
                            {/* Trục Y: Doanh thu */}
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 12, fill: '#9ca3af' }} 
                                tickFormatter={formatCurrencyTick} // Định dạng hiển thị tiền tệ
                            />
                            
                            {/* Tooltip khi hover */}
                            <Tooltip content={<CustomTooltip />} />
                            
                            {/* Đường Line chính */}
                            <Line
                                type="monotone" 
                                dataKey="revenue" // Data Key đổi thành 'revenue'
                                stroke="#4A55FF" 
                                strokeWidth={3}
                                dot={false} 
                                activeDot={{ r: 6, fill: "#ffffff", stroke: "#4A55FF", strokeWidth: 2 }} 
                                isAnimationActive={true} 
                                animationDuration={1500} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </motion.div>
    );
}

export default SalesOverviewChart;