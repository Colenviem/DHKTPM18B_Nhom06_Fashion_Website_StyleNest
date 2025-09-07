import React from "react";
import "boxicons/css/boxicons.min.css";

const ProductCard = ({ product ,variant = "home" }) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden max-w-xs w-full border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
            <div className="p-4 space-y-3">
                {/* Product Image */}
                <div className="relative rounded-lg overflow-hidden h-64">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                    {/* Title */}
                    <h2 className="text-xl font-medium text-[#484848]">{product.name}</h2>

                    {/* Reviews */}
                    <div className="flex justify-between items-center my-3">
                        <p className="text-[#484848] text-[12px] font-normal">
                            (4.1k) Đánh giá
                        </p>
                        <div className="flex items-center text-yellow-400 text-sm">
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bx-star"></i>
                        </div>
                    </div>

                    {/* Price + Status */}
                    <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-medium text-[#484848] flex items-baseline gap-1">
                            {product.price}
                            <span className="text-base text-gray-600 underline">đ</span>
                        </p>
                        <span className="text-[12px] text-red-500 font-normal">
                            Gần bán hết
                        </span>
                    </div>

                    {/* Button */}
                    {variant === "home" ? (
                        <button className="w-full bg-black text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium tracking-wide 
                                            border border-transparent hover:bg-white hover:text-[#484848] hover:border-gray-300 hover:shadow-md transition-all duration-300">
                            <i className="bx bx-show text-lg"></i>
                            Xem chi tiết
                        </button>
                        ) : (
                        <button className="w-full bg-black text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium tracking-wide 
                                            border border-transparent hover:bg-white hover:text-[#484848] hover:border-gray-300 hover:shadow-md transition-all duration-300">
                            <i className="bx bx-cart-alt text-lg"></i>
                            Thêm vào giỏ
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;