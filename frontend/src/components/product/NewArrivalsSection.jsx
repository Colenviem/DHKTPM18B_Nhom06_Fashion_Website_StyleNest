import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

const NewArrivalsSection = ({ 
    products,
    title = "New Arrivals", 
    subtitle = "Khám phá những bộ sưu tập thời trang mới nhất vừa cập bến. Luôn cập nhật các sản phẩm độc đáo và thịnh hành nhất.",
}) => {
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Men's Fashion", "Women's Fashion", "Women Accessories", "Men Accessories", "Discount Deals"];

    const filteredProducts = useMemo(() => {
        if (activeCategory === "All") {
            return products;
        }
        return products.filter(product => product.category === activeCategory);
    }, [products, activeCategory]);

    return (
        <div className="bg-white text-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-bold text-black mb-4 text-balance">
                        {title}
                    </h2>
                    <p className="text-gray-700 max-w-3xl mx-auto text-pretty text-lg leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 border-2 ${
                                category === activeCategory
                                    ? "bg-black text-white border-black shadow-lg shadow-black/20 hover:bg-gray-800"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black hover:bg-gray-50"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} variant={"light"} /> 
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <p className="text-xl text-gray-700">Không tìm thấy sản phẩm nào trong danh mục **{activeCategory}**.</p>
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <button className="bg-transparent border-2 border-black text-black font-semibold hover:bg-black hover:text-white px-10 py-3 rounded-full transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-black/10">
                        View More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewArrivalsSection;