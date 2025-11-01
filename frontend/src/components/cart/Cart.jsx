import React, { useContext } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import { CartContext } from "../../context/CartContext.jsx";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

const Cart = () => {
    const { cartItems, setCartItems, loading } = useContext(CartContext);

    if (loading) return <div>Đang tải giỏ hàng...</div>;

    const isEmpty = !cartItems || cartItems.length === 0;

    return (
        <div className="px-4 sm:px-8 lg:px-16 text-gray-700">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-8"
            >
                <FiShoppingCart className="text-4xl text-[#6F47EB]" />
                <h1 className="text-4xl font-extrabold tracking-tight">Giỏ Hàng Của Bạn</h1>
            </motion.div>

            {isEmpty ? (
                <EmptyCart />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item, index) => (
                            <CartItem
                                key={item.id || index} // fallback index nếu id undefined
                                item={item}
                                index={index}
                                onChange={(updatedItem) => {
                                    if (updatedItem.delete) {
                                        setCartItems(prev => prev.filter(ci => ci.id !== updatedItem.id));
                                    } else {
                                        setCartItems(prev =>
                                            prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci)
                                        );
                                    }
                                }}
                            />
                        ))}
                    </div>

                    <CartSummary cartItems={cartItems} />
                </div>
            )}
        </div>
    );
};

export default Cart;
