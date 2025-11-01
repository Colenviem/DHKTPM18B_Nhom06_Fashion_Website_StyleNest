import React, { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = "USR001"; // Lấy từ auth context hoặc localStorage

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/carts/user/${userId}`)
            .then((res) => {
                const cart = res.data;
                if (cart?.items) {
                    const items = cart.items.map((item) => ({
                        id: item.product?.id || item.id,
                        name: item.product?.name || "Unknown",
                        thumbnails: item.product?.image ? [item.product.image] : [],
                        price: item.product?.price || 0,
                        discount: item.product?.discount || 0,
                        quantity: item.quantity || 1,
                        colors: item.product?.colors || ["Trắng", "Đen"],
                        selectedColor: item.product?.colors?.[0] || "Trắng",
                        size: item.product?.sizes || ["M", "L"],
                        selectedSize: item.product?.sizes?.[0] || "M",
                    }));
                    setCartItems(items);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [userId]);

    const isEmpty = cartItems.length === 0;

    if (loading) return <div>Đang tải giỏ hàng...</div>;

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
                                key={item.id}
                                item={item}
                                index={index}
                                onChange={(updatedItem) => {
                                    setCartItems(prev =>
                                        prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci)
                                    );
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
