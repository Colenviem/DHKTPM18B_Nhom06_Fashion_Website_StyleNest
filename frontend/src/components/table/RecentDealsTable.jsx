import React from 'react';
import { motion } from 'framer-motion';

const dealsData = [
    { name: "Apple Watch", location: "6096 Marjolaine Landing", date: "12.09.2019 - 12:53 PM", piece: "423", amount: "$34,295", status: "Delivered", image: "https://i.ibb.co/L5B7n2t/apple-watch.png" },
    { name: "AirPods Pro", location: "1932 Larkin Ave", date: "14.09.2019 - 9:23 AM", piece: "210", amount: "$12,500", status: "Pending", image: "https://i.ibb.co/3Wf4Q7W/airpods.png" },
    { name: "MacBook Pro", location: "876 River Road", date: "15.09.2019 - 3:00 PM", piece: "55", amount: "$89,990", status: "Delivered", image: "https://i.ibb.co/74S2K9g/macbook.png" },
    { name: "iPad Mini", location: "301 Main St", date: "16.09.2019 - 11:45 AM", piece: "150", amount: "$25,450", status: "Canceled", image: "https://i.ibb.co/b3gQ8k7/ipad.png" },
];

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

const getStatusClasses = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-700";
        case "Pending":
            return "bg-yellow-100 text-yellow-700";
        case "Canceled":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

function RecentDealsTable() {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-full overflow-x-auto">
            
            {/* --- Phần Header & Dropdown Tháng --- */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Deals Details
                </h2>
                <select className="text-sm border border-gray-300 rounded-lg py-1 px-3 bg-white focus:ring-indigo-500 focus:border-indigo-500">
                    <option>October</option>
                    <option>September</option>
                    <option>August</option>
                </select>
            </div>

            {/* --- Phần Bảng --- */}
            <table className="min-w-full text-sm text-left border-collapse">
                <thead className="text-gray-500 uppercase text-xs border-b border-gray-200">
                    <tr>
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Date - Time</th>
                        <th className="py-3 px-4">Piece</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                </thead>
                
                {/* --- Phần Body có Animation --- */}
                <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {dealsData.map((row, i) => (
                        <motion.tr
                            key={i}
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