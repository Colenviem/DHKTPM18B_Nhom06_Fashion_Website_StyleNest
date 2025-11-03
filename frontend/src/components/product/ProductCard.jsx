import React from "react";
import { FiShoppingBag } from "react-icons/fi"; 
import RenderStars from "../ui/RenderStars";

const ProductCard = ({ product }) => {
    const formatVND = (price) => {
        if (typeof price === 'number') {
        return price.toLocaleString('vi-VN') + '₫';
        }
        return price || '0₫'; 
    };

    console.log("ProductCard product:", product);

    const originalPrice = typeof product.price === 'number' ? product.price : "";
    const salePrice = product.discount > 0 ? formatVND(product.price*(100-product.discount)/100) : originalPrice;

    // const discountPercentage =
    //     product.price && product.originalPrice &&
    //     typeof product.price === 'number' &&
    //     typeof product.originalPrice === 'number'
    //     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    //     : null;
    const discountPercentage = typeof product.discount === 'number' ? product.discount : "0";

    return (
        <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden max-w-xs w-full shadow-lg hover:shadow-gray-300 transition duration-500 ease-in-out transform hover:-translate-y-2 cursor-pointer mb-4">
            <div className="relative h-64 overflow-hidden rounded-t-2xl">
                <img
                    src={product.image || "https://via.placeholder.com/400x400?text=SALE"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                />
                
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {(product.isNew || discountPercentage) && (
                    <span
                        className={`absolute top-3 left-3 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md ${
                        discountPercentage ? 'bg-red-600' : 'bg-black'
                        }`}
                    >
                        {discountPercentage ? `-${discountPercentage}%` : 'NEW'}
                    </span>
                )}
            </div>

            <div className="p-4 space-y-2 text-black">
                <h2 className="text-2xl font-bold text-black line-clamp-1">
                    {product.name || "Stylish Product Name"}
                </h2>
                
                <p className="text-sm text-gray-600 leading-normal line-clamp-2">
                    {product.description || "Experience the best in modern design and quality materials."}
                </p>

                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <RenderStars rating={product.rating.average} />
                    <span className="text-[#4B5563] text-xs ml-1">({product.rating.count} reviews)</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex flex-col items-start">
                        <p className="text-3xl font-extrabold text-[#4B5563] leading-none">
                            {formatVND(salePrice)}
                        </p>
                        
                        <div className="flex items-center gap-3">
                            <p className="text-sm text-[#4B5563] line-through mt-1">
                                {originalPrice===salePrice ? "" : formatVND(originalPrice)}
                            </p>
                            {discountPercentage > 0 && (
                                <p className="text-sm text-[#4B5563] font-bold mt-1">
                                -{discountPercentage}%
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <button 
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