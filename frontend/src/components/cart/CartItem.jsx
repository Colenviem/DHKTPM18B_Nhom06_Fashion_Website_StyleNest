import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

const CartItem = ({ item = {}, index, onChange }) => {
    const [quantity, setQuantity] = useState(item.quantity || 1);

    const price = item.priceAtTime || item.price || 0;
    const discount = item.discount || 0;
    const name = item.name || "Sản phẩm";

    const thumbnails = item.thumbnails?.length
        ? item.thumbnails
        : ["https://via.placeholder.com/300x400?text=No+Image"];

    const selectedColor = item.color;
    const selectedSize = item.size;

    const COLOR_MAP = {
        red: "Đỏ",
        blue: "Xanh dương",
        black: "Đen",
        white: "Trắng",
        green: "Xanh lá",
        yellow: "Vàng",
        orange: "Cam",
        pink: "Hồng",
        purple: "Tím",
        brown: "Nâu",
        gray: "Xám",
        silver: "Bạc",
        gold: "Vàng kim",
        default: "Không rõ"
    };

    const toVietnameseColor = (color) => {
        if (!color) return COLOR_MAP.default;
        return COLOR_MAP[color.toLowerCase()] || color;
    };

    const handleIncrease = () => {
        if (quantity < item.maxInStock) {
            const newQty = quantity + 1;
            setQuantity(newQty);
            onChange && onChange({ ...item, quantity: newQty });
        } else {
            alert(`⚠️ Chỉ còn ${item.maxInStock} sản phẩm trong kho!`);
        }
    };

    const handleDecrease = () => {
        const newQty = Math.max(1, quantity - 1);
        setQuantity(newQty);
        onChange && onChange({ ...item, quantity: newQty });
    };

    const handleInputChange = (e) => {
        let value = Number(e.target.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > item.maxInStock) {
            value = item.maxInStock;
            alert(`⚠️ Chỉ còn ${item.maxInStock} sản phẩm trong kho!`);
        }
        setQuantity(value);
        onChange && onChange({ ...item, quantity: value });
    };

    useEffect(() => {
        onChange && onChange({ ...item, quantity });
    }, []);

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
                    onClick={() =>
                        onChange && onChange({ ...item, quantity: 0, delete: true })
                    }
                >
                    <FiTrash2 />
                </button>
            </div>

            <div className="flex flex-col justify-start p-6 flex-grow gap-4">
                <h3 className="text-xl font-semibold">{name}</h3>

                <div className="flex gap-3 text-sm text-gray-700">
                    <span className="border border-gray-300 rounded-md py-1 px-3 block">
                        Màu: {toVietnameseColor(selectedColor)}
                    </span>

                    <span className="border border-gray-300 rounded-md py-1 px-3 block">
                        Size: {selectedSize}
                    </span>
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
                            max={item.maxInStock}
                            value={quantity}
                            onChange={handleInputChange}
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
                        {discount > 0 && (
                            <p className="text-sm line-through text-gray-400">
                                {price.toLocaleString("vi-VN")} đ
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;
