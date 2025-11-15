import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListProduct from './ListProduct';

const NewArrivalsSection = ({ products, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const categoryMap = [
    { id: "", name: "Hiện tất cả" }
  ];

  products.forEach(p => {
    if (!categoryMap.some(c => c.id === p.category.id)) {
      categoryMap.push({
        id: p.category.id,
        name: p.category.name
      });
    }
  });

  const categoryNames = categoryMap.map(c => c.name);

  const [activeCategory, setActiveCategory] = useState("Hiện tất cả");

  // ⭐ Thêm state để hiển thị toàn bộ sản phẩm
  const [showAll, setShowAll] = useState(false);

  // Cập nhật category từ URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");

    if (!categoryParam) {
      setActiveCategory("Hiện tất cả");
      return;
    }

    const found = categoryMap.find(c => c.id === categoryParam);
    if (found) {
      setActiveCategory(found.name);
    }
  }, [location.search]);

  // Lọc sản phẩm theo category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "Hiện tất cả") return products;
    const c = categoryMap.find(x => x.name === activeCategory);
    return products.filter(p => p.category?.id === c.id);
  }, [products, activeCategory]);

  // ⭐ Lấy 6 sản phẩm đầu — trừ khi user nhấn Xem thêm
  const displayedProducts = showAll 
    ? filteredProducts
    : filteredProducts.slice(0, 6);

  const handleCategoryClick = (categoryName) => {
    const selected = categoryMap.find(c => c.name === categoryName);
    navigate(`?category=${selected?.id || ""}`);
    setActiveCategory(categoryName);

    setShowAll(false);
  };

  return (
    <div className="bg-white text-[#4B5563] font-[Manrope]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 space-y-6">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-semibold text-[#111827]">{title}</h2>
          <p className="text-[#4B5563] max-w-3xl mx-auto text-lg leading-relaxed">{subtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {categoryNames.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 border-2 cursor-pointer ${
                category === activeCategory
                  ? "bg-[#6F47EB] text-white border-[#6F47EB] shadow-lg shadow-[#6F47EB]/30 hover:bg-[#5a38d1]"
                  : "bg-white text-[#4B5563] border-gray-300 hover:border-[#6F47EB] hover:text-[#6F47EB] hover:shadow-md"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {displayedProducts.length > 0 ? (
          <ListProduct products={displayedProducts} activeCategory={activeCategory} />
        ) : (
          <div className="text-center py-10 text-lg text-gray-500 font-medium">
            Hiện tại chưa có sản phẩm đang chọn.
          </div>
        )}

        {/* ⭐ Nút xem thêm */}
        {filteredProducts.length > 6 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-[#6F47EB] text-white font-semibold border-2 border-[#6F47EB] hover:bg-[#5a38d1] px-10 py-3 rounded-full transition-all duration-300 transform hover:scale-[1.05] shadow-lg shadow-[#6F47EB]/30 cursor-pointer"
            >
              {showAll ? "Thu gọn" : "Xem Thêm Sản Phẩm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivalsSection;