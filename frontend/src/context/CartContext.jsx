import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Lấy userId từ localStorage (sau khi login)
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId || user?.id;

    useEffect(() => {
        if (!userId) {
            setLoading(false); // nếu chưa login thì dừng loading
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Lấy giỏ hàng
                const cartRes = await axios.get(`http://localhost:8080/api/carts/user/${userId}`);
                const cart = cartRes.data;

                const items = cart?.items?.map(item => ({
                    id: item.product?.id || item.id,
                    name: item.product?.name ?? "Sản phẩm không tên",
                    thumbnails: item.product?.image ? [item.product.image] : [],
                    price: item.product?.price ?? item.priceAtTime ?? 0,
                    discount: item.product?.discount ?? 0,
                    quantity: item.quantity ?? 1,
                    colors: item.product?.colors || ["Trắng", "Đen"],
                    selectedColor: item.selectedColor || item.product?.colors?.[0] || "Trắng",
                    size: item.product?.sizes || ["M", "L"],
                    selectedSize: item.selectedSize || item.product?.sizes?.[0] || "M",
                })) || [];

                setCartItems(items);

                // 2. Lấy addresses
                const userRes = await axios.get(`http://localhost:8080/api/users/${userId}`);
                const userData = userRes.data;
                setAddresses(userData.addresses || []);
                const defaultAddr = userData.addresses?.find(a => a.default);
                setSelectedAddress(defaultAddr || userData.addresses?.[0] || null);

            } catch (err) {
                console.error("Lỗi lấy giỏ hàng hoặc địa chỉ:", err);
            } finally {
                setLoading(false); // quan trọng: luôn set false
            }
        };

        fetchData();
    }, [userId]);

    const saveCart = async (updatedCart = cartItems) => {
        setCartItems(updatedCart);
        try {
            const payload = {
                items: updatedCart.map(item => ({
                    product: {
                        id: item.id,
                        name: item.name,
                        image: item.thumbnails?.[0] || "",
                        price: item.price,
                        discount: item.discount
                    },
                    quantity: item.quantity,
                    priceAtTime: Math.round(item.price * (1 - item.discount / 100))
                })),
                totalQuantity: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: Math.round(
                    updatedCart.reduce((sum, item) => sum + item.quantity * (1 - item.discount / 100) * item.price, 0)
                )
            };

            await axios.put(`http://localhost:8080/api/carts/user/${userId}`, payload);
            console.log("✅ Giỏ hàng đã được cập nhật!");
        } catch (err) {
            console.error("❌ Lỗi khi lưu giỏ hàng:", err);
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            saveCart,
            setCartItems,
            loading,
            addresses,
            selectedAddress,
            setSelectedAddress,
            userId
        }}>
            {children}
        </CartContext.Provider>
    );
};
