import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCheckCircle, FiShield } from 'react-icons/fi';

const stats = [
    { icon: FiTrendingUp, number: "10K+", label: "Khách hàng hài lòng" },
    { icon: FiCheckCircle, number: "500+", label: "Sản phẩm độc quyền" },
    { icon: FiShield, number: "5*", label: "Chất lượng cam kết" },
];

const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const AboutStats = () => (
    <div className="grid grid-cols-3 gap-4 pt-4">
        {stats.map((stat, index) => (
            <motion.div
                key={index}
                variants={item}
                className="text-center p-4 border border-gray-200 rounded-xl shadow-sm bg-gray-50 hover:bg-white transition"
            >
                <stat.icon className="text-3xl mx-auto mb-2" />
                <p className="text-2xl font-extrabold">{stat.number}</p>
                <p className="text-xs text-gray-500 uppercase mt-1">{stat.label}</p>
            </motion.div>
        ))}
    </div>
);

export default AboutStats;