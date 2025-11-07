import React, { useEffect, useMemo, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import RenderStars from "../ui/RenderStars";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${product.id}`);
    };

    // Hàm format tiền tệ
    const formatVND = (price) => {
        if (typeof price === "number") {
            return price.toLocaleString("vi-VN") + "₫";
        }
        return price || "0₫";
    };

    // Gom tất cả ảnh của các variant
    const allImages = useMemo(() => {
        return product.variants?.flatMap((v) => v.images || []) || [];
    }, [product]);

    // Quản lý ảnh hiện tại
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Tự động đổi ảnh sau mỗi 2 giây
    useEffect(() => {
        if (allImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [allImages.length]);

    const originalPrice =
        typeof product.price === "number" ? product.price : 0;
    const discountPercentage =
        typeof product.discount === "number" ? product.discount : 0;
    const salePrice =
        discountPercentage > 0
            ? originalPrice * (100 - discountPercentage) / 100
            : originalPrice;

    return (
        <div
            onClick={handleClick}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden max-w-xs w-full shadow-lg hover:shadow-gray-300 transition duration-500 ease-in-out transform hover:-translate-y-2 cursor-pointer mb-4"
        >
            <div className="relative h-64 overflow-hidden rounded-t-2xl">
                <img
                    src={
                        allImages[currentImageIndex] ||
                        product.image ||
                        "https://via.placeholder.com/400x400?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                />

                {discountPercentage > 0 && (
                    <span className="absolute top-3 left-3 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md bg-red-600">
            -{discountPercentage}%
          </span>
                )}
            </div>

            <div className="p-4 space-y-2 text-black">
                <h2 className="text-xl font-bold text-black line-clamp-1">
                    {product.name || "Tên sản phẩm"}
                </h2>

                <p className="text-sm text-gray-600 leading-normal line-clamp-2">
                    {product.description || "Không có mô tả"}
                </p>

                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <RenderStars rating={product.rating?.average || 0} />
                    <span className="text-[#4B5563] text-xs ml-1">
            ({product.rating?.count || 0} đánh giá)
          </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex flex-col items-start">
                        <p className="text-2xl font-extrabold text-[#4B5563] leading-none">
                            {formatVND(salePrice)}
                        </p>

                        {discountPercentage > 0 && (
                            <p className="text-sm text-[#4B5563] line-through mt-1">
                                {formatVND(originalPrice)}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // tránh click trùng
                            alert("Đã thêm vào giỏ hàng!");
                        }}
                        className="p-3 border-2 border-[#6F47EB] text-[#6F47EB] rounded-full hover:bg-[#6F47EB] hover:text-white transition-all duration-300 transform group-hover:scale-105 shadow-md shadow-black/10"
                        aria-label="Add to cart"
                    >
                        <FiShoppingBag className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
