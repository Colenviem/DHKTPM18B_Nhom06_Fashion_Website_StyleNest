import React from "react";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { motion } from "framer-motion";

const CartItem = ({ item, index }) => {
    return (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.01, boxShadow: "0 6px 25px rgba(0,0,0,0.08)" }}
            className="flex flex-col px-4 py-4 sm:flex-row bg-white rounded-2xl border border-gray-200 overflow-hidden"
        >
            <div className="w-full sm:w-40 h-50 overflow-hidden relative">
                <img src={item.thumbnails[0]} alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-red-500 hover:text-white text-gray-600 transition">
                <FiTrash2 />
                </button>
            </div>

            <div className="flex flex-col justify-start p-6 flex-grow gap-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <div className="flex gap-3 text-sm text-gray-700">
                    <select defaultValue={item.selectedColor}
                            className="border border-gray-300 rounded-md py-1 px-3">
                        {item.colors.map((color) => <option key={color}>{color}</option>)}
                    </select>
                    <select defaultValue={item.selectedSize}
                            className="border border-gray-300 rounded-md py-1 px-3">
                        {item.size.map((s) => <option key={s}>{s}</option>)}
                    </select>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button className="px-2 py-1 text-gray-600 hover:bg-gray-100"><FiMinus /></button>
                        <span className="px-2 font-semibold">{item.quantity}</span>
                        <button className="px-2 py-1 text-gray-600 hover:bg-gray-100"><FiPlus /></button>
                    </div>

                    <div className="text-right">
                        <p className="text-lg font-bold text-black">
                        {(item.price * (1 - item.discount / 100) * item.quantity).toLocaleString("vi-VN")} đ
                        </p>
                        <p className="text-sm line-through text-gray-400">{item.price.toLocaleString("vi-VN")} đ</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;