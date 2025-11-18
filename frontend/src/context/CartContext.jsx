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
                console.log("📦 Raw cart data:", cartRes.data);

                // Fetch full product details for each item in cart
                const items = await Promise.all(
                    (cartRes.data?.items || []).map(async (item) => {
                        try {
                            // Fetch full product details from product API
                            const productRes = await axios.get(
                                `http://localhost:8080/api/products/${item.product.id}`
                            );
                            const fullProduct = productRes.data;

                            console.log("🛍️ Full product data:", fullProduct);

                            const variants = fullProduct.variants || [];

                            // Get selected color/size from cart item or use first variant
                            const selectedColor = item.product.selectedColor || variants[0]?.color;
                            const selectedSize = item.product.selectedSize || variants[0]?.size;

                            const matchedVariant = variants.find(
                                v => v.color === selectedColor && v.size === selectedSize
                            ) || variants[0];

                            return {
                                id: fullProduct.id,
                                name: fullProduct.name,
                                thumbnails:
                                    matchedVariant?.images?.length > 0
                                        ? [...matchedVariant.images]
                                        : [fullProduct.image],
                                price: fullProduct.price,
                                discount: fullProduct.discount || 0,
                                quantity: item.quantity,
                                colors: [...new Set(variants.map(v => v.color))],
                                sizes: [...new Set(variants.map(v => v.size))],
                                selectedColor: selectedColor,
                                selectedSize: selectedSize,
                                maxInStock: matchedVariant?.inStock || 0
                            };
                        } catch (err) {
                            console.error(`❌ Error fetching product ${item.product.id}:`, err);
                            // Fallback to cart data if product fetch fails
                            return {
                                id: item.product.id,
                                name: item.product.name,
                                thumbnails: item.product.thumbnails || [],
                                price: item.product.price,
                                discount: item.product.discount || 0,
                                quantity: item.quantity,
                                colors: [],
                                sizes: [],
                                selectedColor: null,
                                selectedSize: null,
                                maxInStock: 0
                            };
                        }
                    })
                );

                console.log("✅ Processed cart items:", items);
                setCartItems(items);

                // Fetch user address
                const userRes = await axios.get(`http://localhost:8080/api/users/${userId}`);
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

    const saveCart = async (updatedCart = cartItems) => {
        setCartItems(updatedCart);
        try {
            const payload = {
                items: updatedCart.map(item => ({
                    product: {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        discount: item.discount,
                        selectedColor: item.selectedColor,
                        selectedSize: item.selectedSize,
                        thumbnails: item.thumbnails
                    },
                    quantity: item.quantity,
                    priceAtTime: Math.round(item.price * (1 - item.discount / 100))
                })),
                totalQuantity: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: Math.round(
                    updatedCart.reduce(
                        (sum, item) =>
                            sum + item.quantity * (1 - item.discount / 100) * item.price,
                        0
                    )
                )
            };

            await axios.put(`http://localhost:8080/api/carts/user/${userId}`, payload);
            console.log("✅ Cart saved successfully");
        } catch (err) {
            console.error("❌ Lỗi khi lưu giỏ hàng:", err);
        }
    };

    const addToCart = (product, quantity = 1) => {
        if (!userId) {
            alert("⚠️ Bạn phải đăng nhập để thêm vào giỏ hàng!");
            return;
        }

        const existingItem = cartItems.find(
            item =>
                item.id === product.id &&
                item.selectedColor === product.selectedColor &&
                item.selectedSize === product.selectedSize
        );

        let updatedCart;

        if (existingItem) {
            updatedCart = cartItems.map(item =>
                item.id === product.id &&
                item.selectedColor === product.selectedColor &&
                item.selectedSize === product.selectedSize
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            updatedCart = [...cartItems, { ...product, quantity }];
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