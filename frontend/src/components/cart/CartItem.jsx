import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

const CartItem = ({ item = {}, index, onChange }) => {
    const [quantity, setQuantity] = useState(item.quantity || 1);

    // ✅ SỬA Ở ĐÂY — không dùng item.product nữa
    const price = item.price || 0;
    const discount = item.discount || 0;
    const name = item.name || "Sản phẩm";
    const thumbnails = item.thumbnails?.length ? item.thumbnails : [""];

    const colors = item.colors || ["Trắng", "Đen"];
    const sizes = item.size || ["M", "L"];
    const selectedColor = item.selectedColor || colors[0];
    const selectedSize = item.selectedSize || sizes[0];

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    useEffect(() => {
        onChange && onChange({ ...item, quantity });
    }, [quantity, onChange]);

    return (
        <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.01, boxShadow: "0 6px 25px rgba(0,0,0,0.08)" }}
            className="flex flex-col px-4 py-4 sm:flex-row bg-white rounded-2xl border border-gray-200 overflow-hidden"
        >
            <div className="w-full sm:w-40 h-50 overflow-hidden relative">
                <img
                    src={thumbnails[0]}
                    alt={name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <button
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-red-500 hover:text-white text-gray-600 transition"
                    onClick={() => onChange && onChange({ ...item, quantity: 0, delete: true })}
                >
                    <FiTrash2 />
                </button>
            </div>

            <div className="flex flex-col justify-start p-6 flex-grow gap-4">
                <h3 className="text-xl font-semibold">{name}</h3>

                <div className="flex gap-3 text-sm text-gray-700">
                    <select
                        value={selectedColor}
                        onChange={() => {}}
                        className="border border-gray-300 rounded-md py-1 px-3"
                    >
                        {colors.map(color => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>

                    <select
                        value={selectedSize}
                        onChange={() => {}}
                        className="border border-gray-300 rounded-md py-1 px-3"
                    >
                        {sizes.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                        <button
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={handleDecrease}
                        >
                            <FiMinus />
                        </button>

                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                            className="w-16 text-center border-none outline-none font-semibold no-spin"
                        />

                        <button
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={handleIncrease}
                        >
                            <FiPlus />
                        </button>
                    </div>

                    <div className="text-right">
                        <p className="text-lg font-bold text-black">
                            {(price * (1 - discount / 100) * quantity).toLocaleString("vi-VN")} đ
                        </p>
                        <p className="text-sm line-through text-gray-400">
                            {price.toLocaleString("vi-VN")} đ
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;
