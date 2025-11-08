import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const localUser = JSON.parse(localStorage.getItem("user"));
    const [user, setUser] = useState(localUser || null);
    const userId = localUser?.userId || localUser?.id;

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
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

                const userRes = await axios.get(`http://localhost:8080/api/users/${userId}`);
                const userData = userRes.data;
                setUser(userData);
                setAddresses(userData.addresses || []);
                const defaultAddr = userData.addresses?.find(a => a.default);
                setSelectedAddress(defaultAddr || userData.addresses?.[0] || null);

            } catch (err) {
                console.error("Lỗi lấy giỏ hàng hoặc địa chỉ:", err);
            } finally {
                setLoading(false);
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
        } catch (err) {
            console.error("❌ Lỗi khi lưu giỏ hàng:", err);
        }
    };

    const addToCart = (product, quantity = 1) => {
        if (!userId) {
            alert("⚠️ Bạn phải đăng nhập để thêm vào giỏ hàng!");
            return;
        }

        const existingItem = cartItems.find(item => item.id === product.id);

        const imageUrl = product.image || (product.variants?.[0]?.images?.[0]) || "/placeholder.png";

        let updatedCart;
        if (existingItem) {
            updatedCart = cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            );
        } else {
            updatedCart = [
                ...cartItems,
                {
                    id: product.id,
                    name: product.name,
                    thumbnails: [imageUrl],
                    price: product.price,
                    discount: product.discount || 0,
                    quantity,
                    colors: product.variants?.map(v => v.color) || ["Trắng", "Đen"],
                    selectedColor: product.variants?.[0]?.color || "Trắng",
                    size: product.variants?.map(v => v.size) || ["M", "L"],
                    selectedSize: product.variants?.[0]?.size || "M",
                }
            ];
        }

        setCartItems(updatedCart);
        saveCart(updatedCart);
    };



    return (
        <CartContext.Provider value={{
            cartItems,
            saveCart,
            addToCart,
            setCartItems,
            loading,
            addresses,
            selectedAddress,
            setSelectedAddress,
            userId,
            user
        }}>
            {children}
        </CartContext.Provider>
    );
};
