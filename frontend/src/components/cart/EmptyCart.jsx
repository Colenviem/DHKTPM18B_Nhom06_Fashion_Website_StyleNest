import React from "react";
import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
    const navigate = useNavigate();

    const goToFashion = () => {
        navigate("/fashion"); // chuyển sang route /fashion
        window.scrollTo(0, 0); // scroll lên đầu trang nếu muốn
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center bg-white rounded-2xl shadow-md p-12"
        >
            <FiInbox className="text-6xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold">Giỏ hàng trống</h2>
            <p className="text-gray-500 mt-2 mb-6">Thêm sản phẩm để tiếp tục mua sắm!</p>
            <button
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                onClick={goToFashion}
            >
                Khám phá sản phẩm
            </button>
        </motion.div>
    );
};

export default EmptyCart;
