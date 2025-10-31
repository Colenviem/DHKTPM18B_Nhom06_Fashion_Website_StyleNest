import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dữ liệu mẫu (Giống dạng sóng trong ảnh dashboard ban đầu)
const data = [
  { name: '5K', sales: 20000 },
  { name: '10K', sales: 30000 },
  { name: '15K', sales: 55000 },
  { name: '20K', sales: 80000 }, // Đỉnh cao
  { name: '25K', sales: 48000 },
  { name: '30K', sales: 52000 },
  { name: '35K', sales: 30000 },
  { name: '40K', sales: 43000 },
  { name: '45K', sales: 70000 },
  { name: '50K', sales: 62000 },
  { name: '55K', sales: 50000 },
  { name: '60K', sales: 58000 },
];

// Biến thể Framer Motion cho Card
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

function SalesOverviewChart() {
    return (
        // Áp dụng animation cho Card
        <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            {/* --- Phần Header & Dropdown Tháng --- */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Sales Details
                </h2>
                <select className="border border-gray-300 text-sm rounded-lg px-2 py-1 text-gray-600 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150">
                    <option>October</option>
                    <option>September</option>
                    <option>August</option>
                </select>
            </div>

            {/* --- Phần Biểu đồ --- */}
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }} // Giảm margin trái cho trục Y gần hơn
                    >
                        {/* Lưới ngang mờ */}
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="#f0f0f0" 
                            vertical={false} // Chỉ hiển thị lưới ngang
                        />
                        
                        {/* Trục X */}
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} // Ẩn đường trục X
                            tickLine={false} // Ẩn dấu tick
                            tick={{ fontSize: 12, fill: '#9ca3af' }} // Màu chữ xám
                            padding={{ left: 20, right: 20 }} // Thêm padding cho các điểm đầu cuối
                        />
                        
                        {/* Trục Y */}
                        <YAxis 
                            axisLine={false} // Ẩn đường trục Y
                            tickLine={false} // Ẩn dấu tick
                            tick={{ fontSize: 12, fill: '#9ca3af' }} // Màu chữ xám
                            tickFormatter={(value) => `${value / 1000}K`} // Định dạng giá trị (ví dụ: 40000 -> 40K)
                        />
                        
                        {/* Tooltip khi hover */}
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '8px', 
                                border: '1px solid #e5e7eb', 
                                backgroundColor: '#ffffff', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        
                        {/* Đường Line chính */}
                        <Line
                            type="monotone" // Đường cong mượt
                            dataKey="sales"
                            stroke="#4A55FF" // Màu xanh tím đậm (thay vì #6366f1)
                            strokeWidth={3}
                            dot={false} // Ẩn chấm tròn mặc định
                            activeDot={{ r: 6, fill: "#ffffff", stroke: "#4A55FF", strokeWidth: 2 }} // Chấm to khi hover
                            isAnimationActive={true} // Bật animation tự vẽ của Recharts
                            animationDuration={1500} // Thời gian animation
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

export default SalesOverviewChart;