import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDirty, setIsDirty] = useState(false); // chỉ PUT khi thay đổi

    const userId = "USR001";

    // Lấy giỏ hàng từ server
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/carts/user/${userId}`);
                const cart = res.data;

                if (cart?.items && cart.items.length > 0) {
                    const items = cart.items.map(item => ({
                        id: item.product?.id || item.id,
                        name: item.product?.name || "Unknown",
                        thumbnails: item.product?.image ? [item.product.image] : [],
                        price: item.priceAtTime || item.product?.price || 0,
                        discount: item.product?.discount || 0,
                        quantity: item.quantity || 1,
                        colors: item.product?.colors || ["Trắng", "Đen"],
                        selectedColor: item.product?.colors?.[0] || "Trắng",
                        size: item.product?.sizes || ["M", "L"],
                        selectedSize: item.product?.sizes?.[0] || "M",
                    }));
                    setCartItems(items);
                } else {
                    setCartItems([]); // đảm bảo cartItems là mảng rỗng khi không có item
                }

                console.log("Cart items loaded:", cart.items); // debug
            } catch (err) {
                console.error("Lỗi lấy giỏ hàng:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [userId]);

    // Lưu giỏ hàng lên server khi có thay đổi
    useEffect(() => {
        const saveCart = async () => {
            try {
                const payload = {
                    items: cartItems.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        selectedColor: item.selectedColor,
                        selectedSize: item.selectedSize
                    })),
                    totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
                    totalPrice: cartItems.reduce(
                        (sum, item) => sum + (item.price * (1 - (item.discount/100))) * item.quantity,
                        0
                    )
                };

                await axios.put(`http://localhost:8080/api/carts/user/${userId}`, payload);
                setIsDirty(false); // đã lưu xong
            } catch (err) {
                console.error("Lỗi lưu giỏ hàng:", err);
            }
        };

        if (!loading && isDirty) saveCart();
    }, [cartItems, loading, isDirty, userId]);

    // wrapper để cập nhật cartItems và đánh dấu là dirty
    const updateCartItems = (items) => {
        setCartItems(items);
        setIsDirty(true);
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems: updateCartItems, loading }}>
            {children}
        </CartContext.Provider>
    );
};
