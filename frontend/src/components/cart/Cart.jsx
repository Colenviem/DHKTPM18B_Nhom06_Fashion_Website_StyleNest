import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

const Cart = () => {
  const demoCart = [
    {
      id: 1,
      name: "Áo Sơ Mi Lụa Cao Cấp",
      thumbnails: ["https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600&q=80"],
      price: 750000,
      discount: 10,
      quantity: 1,
      colors: ["Trắng", "Đen", "Xanh Navy"],
      selectedColor: "Trắng",
      size: ["S", "M", "L"],
      selectedSize: "M",
    },
    {
      id: 2,
      name: "Quần Jeans Slim-fit Rách Gối",
      thumbnails: ["https://images.unsplash.com/photo-1602293589930-45d7de8b716f?w=600&q=80"],
      price: 980000,
      discount: 15,
      quantity: 1,
      colors: ["Xanh Nhạt", "Đen"],
      selectedColor: "Xanh Nhạt",
      size: ["29", "30", "31", "32"],
      selectedSize: "30",
    },
  ];

  const isEmpty = demoCart.length === 0;
  const selectedCount = demoCart.length;
  const subtotal = demoCart.reduce(
    (sum, item) => sum + item.price * (1 - item.discount / 100) * item.quantity,
    0
  );
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  return (
    <div className="px-4 sm:px-8 lg:px-16 text-gray-700">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <FiShoppingCart className="text-4xl text-[#6F47EB]" />
        <h1 className="text-4xl font-extrabold tracking-tight">
          Giỏ Hàng Của Bạn
        </h1>
      </motion.div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {demoCart.map((item, index) => (
              <CartItem key={item.id} item={item} index={index} />
            ))}
          </div>

          <CartSummary
            selectedCount={selectedCount}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={total}
          />
        </div>
      )}
    </div>
  );
};

export default Cart;