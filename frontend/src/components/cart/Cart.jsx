import React, { useContext  } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import { CartContext } from "../../context/CartContext.jsx";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

const Cart = () => {
    const { cartItems, setCartItems, saveCart, loading } = useContext(CartContext);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600 font-medium">Đang tải giỏ hàng...</p>
        </div>
    );


    const isEmpty = !cartItems || cartItems.length === 0;

    const handleChange = (updatedItem) => {
        setCartItems(prev => {
            const updatedCart = updatedItem.delete
                ? prev.filter(ci => ci.id !== updatedItem.id)
                : prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci);

            saveCart(updatedCart);
            return updatedCart;
        });
    };



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
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onChange={handleChange}
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
