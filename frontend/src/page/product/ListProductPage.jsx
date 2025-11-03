import React, { useContext, useState } from "react";
import FilterSidebar from "../../components/filter/FilterSidebar";
import NewArrivalsSection from "../../components/product/NewArrivalsSection";
import { ProductsContext } from "../../context/ProductsContext";

const ListProductPage = () => {

    const { productsData, loading } = useContext(ProductsContext);
    
      if (loading) return <div>Đang tải dữ liệu...</div>;
  // const products = [
  // { id: 1, name: "Shiny Dress", category: "Women's Fashion", rating: 5, image: "/src/assets/images/products/ShinyDress.png" },
  // { id: 2, name: "Long Dress", category: "Women's Fashion", rating: 4, image: "/src/assets/images/products/LongDress.png" },
  // { id: 3, name: "Full Sweater", category: "Men's Fashion", image: "/src/assets/images/products/FullSweater.png" },
  // { id: 4, name: "White Dress", category: "Women's Accessories", image: "/src/assets/images/products/WhiteDress.png" },
  // { id: 5, name: "Colorful Dress", category: "Women's Fashion", image: "/src/assets/images/products/ColorfulDress.png" },
  // { id: 6, name: "White Shirt", category: "Men's Fashion", image: "/src/assets/images/products/WhiteShirt.png" },
  // ];

  return (
    <div className="py-10 bg-white min-h-screen">
      <div className="max-w-full mx-auto flex px-4 sm:px-6 lg:px-8 space-x-8">
        <div className="w-full lg:w-1/4 hidden lg:block">
          <div className="sticky top-28">
            <FilterSidebar />
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          <NewArrivalsSection
            products={productsData}
            title="Danh sách sản phẩm"
            subtitle=""
          />
        </div>
      </div>
    </div>
  );
};

export default ListProductPage;
