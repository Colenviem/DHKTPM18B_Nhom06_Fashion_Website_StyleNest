import React, { createContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

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

                const cartRes = await axiosClient.get(`/carts/user/${userId}`);
                console.log("📦 Raw cart data:", cartRes.data);

                const items = await Promise.all(
                    (cartRes.data?.items || []).map(async (item) => {
                        try {
                            const fullProduct = item.product;
                            const keyProduct = item.key;
                            const variants = fullProduct.variants || [];
                            const selectedColor = item.product.color;
                            const selectedSize = item.product.size;

                            const matchedVariant = variants.find(
                                v => v.color === selectedColor && v.size === selectedSize
                            ) || variants[0];

                            return {
                                key: keyProduct,
                                id: fullProduct.id,
                                name: fullProduct.name,
                                thumbnails: matchedVariant?.images?.length > 0 ? [...matchedVariant.images] : [fullProduct.image],
                                price: fullProduct.price,
                                discount: fullProduct.discount || 0,
                                quantity: item.quantity,
                                color: selectedColor,
                                size: selectedSize,
                                sku: fullProduct.sku || matchedVariant?.sku || "",
                            };

                        } catch (err) {
                            console.error(`❌ Error fetching product ${item.product.id}:`, err);
                        }
                    })
                );

                console.log("✅ Processed cart items:", items);
                setCartItems(items);
                const userRes = await axiosClient.get(`/users/${userId}`);
                const userData = userRes.data;

                setUser(userData);
                setAddresses(userData.addresses || []);

                const defaultAddr =
                    userData.addresses?.find(a => a.default) || userData.addresses?.[0] || null;
                setSelectedAddress(defaultAddr);

            } catch (err) {
                console.error("❌ Lỗi lấy giỏ hàng hoặc địa chỉ:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);


    const getCartItemKey = (item) =>
        `${item.id}_${item.selectedColor || ""}_${item.selectedSize || ""}_${
            item.sku || ""
        }`;

    const saveCart = async (updatedCart = cartItems) => {
        setCartItems(updatedCart);
        try {
            const payload = {
                items: updatedCart.map((item) => ({
                    product: {
                        key: item.key,
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        discount: item.discount,
                        color: item.color,
                        size: item.size,
                        image: item.thumbnails?.[0] || null,
                        sku: item.sku || null
                    },
                    quantity: item.quantity,
                    priceAtTime: Math.round(item.price * (1 - item.discount / 100))
                })),
                totalQuantity: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: Math.round(
                    updatedCart.reduce(
                        (sum, item) => sum + item.quantity * item.price * (1 - item.discount / 100),
                        0
                    )
                )
            };
            console.log(payload);
            await axiosClient.put(`/carts/user/${userId}`, payload);
            console.log("✅ Cart saved successfully");
        } catch (err) {
            console.error("❌ Lỗi khi lưu giỏ hàng:", err);
        }
    };


    const addToCart = (product, quantity) => {
        const qty = quantity ?? product.quantity ?? 1;

        if (!userId) {
            alert("⚠️ Bạn phải đăng nhập để thêm vào giỏ hàng!");
            return;
        }

        const productKey = getCartItemKey(product);

        const existingItem = cartItems.find(
            item => getCartItemKey(item) === productKey
        );

        let updatedCart;

        if (existingItem) {
            updatedCart = cartItems.map(item =>
                getCartItemKey(item) === productKey
                    ? { ...item, quantity: item.quantity + qty }
                    : item
            );
        } else {
            updatedCart = [...cartItems, { ...product, quantity: qty }];
        }

        setCartItems(updatedCart);
        saveCart(updatedCart);
    };



    return (
        <CartContext.Provider
            value={{
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
            }}
        >
            {children}
        </CartContext.Provider>
    );
};