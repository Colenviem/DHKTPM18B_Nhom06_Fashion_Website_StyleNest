import React from "react";
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiChevronRight,
  FiInbox,
} from "react-icons/fi";
import { motion } from "framer-motion";

const Cart = () => {
  const demoCart = [
    {
      id: 1,
      name: "Áo Sơ Mi Lụa Cao Cấp",
      thumbnails: [
        "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600&q=80",
      ],
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
      thumbnails: [
        "https://images.unsplash.com/photo-1602293589930-45d7de8b716f?w=600&q=80",
      ],
      price: 980000,
      discount: 15,
      quantity: 1,
      colors: ["Xanh Nhạt", "Đen"],
      selectedColor: "Xanh Nhạt",
      size: ["29", "30", "31", "32"],
      selectedSize: "30",
    },
  ];

  const selectedCount = 2;
  const subtotal = 1487500;
  const shippingFee = 30000;
  const total = subtotal + shippingFee;
  const isEmpty = demoCart.length === 0;

  const EmptyCart = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center bg-white rounded-2xl shadow-md p-12"
    >
      <FiInbox className="text-6xl text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">
        Giỏ hàng của bạn đang trống
      </h2>
      <p className="text-gray-500 mt-2 mb-6">
        Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm nhé!
      </p>
      <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow hover:bg-gray-800 transition-all duration-300">
        Khám phá sản phẩm
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 lg:px-16 font-['Inter'] text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-10"
      >
        <FiShoppingCart className="text-4xl text-black" />
        <h1 className="text-4xl font-extrabold tracking-tight">
          Giỏ Hàng Của Bạn
        </h1>
      </motion.div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* === SẢN PHẨM === */}
          <div className="lg:col-span-2 space-y-6">
            {demoCart.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
                }}
                className="flex flex-col sm:flex-row bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300"
              >
                <div className="w-full sm:w-40 h-40 overflow-hidden relative">
                  <img
                    src={item.thumbnails[0]}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-red-500 hover:text-white text-gray-600 transition">
                    <FiTrash2 />
                  </button>
                </div>

                <div className="flex flex-col justify-between p-6 flex-grow">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <div className="flex gap-3 text-sm text-gray-700 mb-3">
                      <select
                        defaultValue={item.selectedColor}
                        className="border border-gray-300 rounded-md py-1 px-3 focus:ring-2 focus:ring-black focus:border-black"
                      >
                        {item.colors.map((color) => (
                          <option key={color}>{color}</option>
                        ))}
                      </select>
                      <select
                        defaultValue={item.selectedSize}
                        className="border border-gray-300 rounded-md py-1 px-3 focus:ring-2 focus:ring-black focus:border-black"
                      >
                        {item.size.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                      <button className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                        <FiMinus />
                      </button>
                      <span className="px-4 font-semibold">{item.quantity}</span>
                      <button className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                        <FiPlus />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-black">
                        {(
                          item.price *
                          (1 - item.discount / 100) *
                          item.quantity
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </p>
                      <p className="text-sm line-through text-gray-400">
                        {item.price.toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* === TỔNG KẾT === */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 sticky top-10"
          >
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-4">
              Tóm Tắt Đơn Hàng
            </h2>

            <div className="space-y-4 text-gray-800">
              <div className="flex justify-between">
                <span>Tạm tính ({selectedCount} sản phẩm)</span>
                <span className="font-semibold">
                  {subtotal.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-semibold">
                  {shippingFee.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng cộng</span>
              <span className="text-black font-bold">
                {total.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <button className="w-full mt-8 py-3 rounded-xl bg-black text-white font-semibold text-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
              <span>Thanh Toán Ngay</span>
              <FiChevronRight size={22} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cart;