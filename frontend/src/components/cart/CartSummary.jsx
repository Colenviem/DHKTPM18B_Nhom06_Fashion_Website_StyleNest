import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

const CartSummary = ({ selectedCount, subtotal, shippingFee, total }) => (
    <motion.div initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 sticky top-10">

        <h2 className="text-2xl font-bold mb-6 border-b pb-4">Tóm Tắt Đơn Hàng</h2>

        <div className="space-y-4 text-gray-800">
        <div className="flex justify-between">
            <span>Tạm tính ({selectedCount} sản phẩm)</span>
            <span className="font-semibold">{subtotal.toLocaleString("vi-VN")} đ</span>
        </div>
        <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span className="font-semibold">{shippingFee.toLocaleString("vi-VN")} đ</span>
        </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        <div className="flex justify-between text-lg font-semibold">
        <span>Tổng cộng</span>
        <span className="text-black font-bold">{total.toLocaleString("vi-VN")} đ</span>
        </div>

        <button className="w-full mt-8 py-3 rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2">
        <span>Thanh Toán Ngay</span>
        <FiChevronRight size={22} />
        </button>
    </motion.div>
);

export default CartSummary;