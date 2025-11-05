import React, { useContext } from "react";
import { FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext.jsx";

const CartSummary = ({ cartItems = [] }) => {
    const navigate = useNavigate();
    const { saveCart } = useContext(CartContext);
    const { userId } = useContext(CartContext);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (1 - (item.discount || 0)/100) * (item.quantity || 1),
        0
    );

    const shippingFee = 30000;
    const total = subtotal + shippingFee;

    const handleCheckout = async () => {
        if (!userId) {
            alert("Vui lòng đăng nhập trước khi thanh toán!");
            navigate("/login");
            return;
        }

        try {
            await saveCart();
            navigate("/checkout");
        } catch (err) {
            console.error("❌ Lỗi khi lưu giỏ hàng trước khi thanh toán:", err);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 sticky top-10"
        >
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">Tóm Tắt Đơn Hàng</h2>

            <div className="space-y-4 text-gray-800">
                <div className="flex justify-between">
                    <span>Tạm tính ({cartItems.length} sản phẩm)</span>
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

            <button
                type="button"
                onClick={handleCheckout}
                className="w-full mt-8 py-3 rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2
      hover:bg-[#6F47EB] hover:scale-105 transition duration-300 ease-in-out shadow-md hover:shadow-lg hover:cursor-pointer"
            >
                <span>Thanh Toán Ngay</span>
                <FiChevronRight size={22} />
            </button>
        </motion.div>
    );
};

export default CartSummary;
