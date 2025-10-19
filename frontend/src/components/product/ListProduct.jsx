import React from 'react';
import ProductCard from './ProductCard';

const ListProduct = ({ products, activeCategory }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            {products.length > 0 ? (
                products.map((product) => (
                    <ProductCard key={product.id} product={product} variant={"light"} /> 
                ))
            ) : (
                <div className="col-span-full text-center py-10">
                    <p className="text-xl text-gray-700">
                        Không tìm thấy sản phẩm nào trong danh mục {activeCategory}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ListProduct;