import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListProduct from './ListProduct'; 

const NewArrivalsSection = ({ products, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState("All");

  // ✅ Map giữa tên danh mục và category_id
  const categoryMap = {
    "All": "",
    "Quần áo nam": "CAT001",
    "Quần áo nữ": "CAT002",
    "Phụ kiện": "CAT003",
    "Giày dép": "CAT004",
    "Khuyến mãi": "sale"
  };

  // ✅ Danh sách nút filter
  const categories = Object.keys(categoryMap);

  // ✅ Cập nhật activeCategory từ URL nếu có query param
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");

    if (!categoryParam) {
      setActiveCategory("All");
      return;
    }

    // Tìm key tương ứng trong map
    const found = Object.entries(categoryMap).find(
      ([, value]) => value === categoryParam
    const [activeCategory, setActiveCategory] = useState("Tất Cả");

    const categories = [
        "Tất Cả", 
        "Thời Trang Nam", 
        "Thời Trang Nữ", 
        "Phụ Kiện", 
        "Giày Dép"
    ];

    const filteredProducts = useMemo(() => {
        if (activeCategory === "Tất Cả") {
            return products;
        }
        return products.filter(product => product.category.name === activeCategory);
    }, [products, activeCategory]);

    return (
        <div className="bg-white text-[#4B5563] font-[Manrope]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 space-y-6">
                <div className="text-center space-y-6">
                    <h2 className="text-5xl font-semibold text-[#111827]">
                        {title}
                    </h2>

                    <p className="text-[#4B5563] max-w-3xl mx-auto text-lg leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
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

                <ListProduct products={filteredProducts} activeCategory={activeCategory} />

                <div className="text-center">
                    <button className="bg-[#6F47EB] text-white font-semibold border-2 border-[#6F47EB] hover:bg-[#5a38d1] px-10 py-3 rounded-full transition-all duration-300 transform hover:scale-[1.05] shadow-lg shadow-[#6F47EB]/30 cursor-pointer">
                        Xem Thêm Sản Phẩm
                    </button>
                </div>
            </div>
        </div>
    );

    if (found) {
      setActiveCategory(found[0]);
    }
  }, [location.search]);

  // ✅ Khi người dùng click nút category
  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);

    const catId = categoryMap[categoryName];

    // Chuyển hướng sang URL mới (trigger lại useEffect trong ListProductPage)
    if (catId === "" || catId === undefined) {
      navigate("/fashion");
    } else {
      navigate(`/fashion?category=${catId}`);
    }
  };

  // ✅ Lọc sản phẩm tạm thời (UI), không ảnh hưởng tới API fetch
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter(
      (p) => p.category?.id === categoryMap[activeCategory]
    );
  }, [products, activeCategory]);

  return (
    <div className="bg-white text-[#4B5563] font-[Manrope]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 space-y-6">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-semibold text-[#111827]">
            {title}
          </h2>

          <p className="text-[#4B5563] max-w-3xl mx-auto text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
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

        {filteredProducts && filteredProducts.length > 0 ? (
          <ListProduct products={filteredProducts} activeCategory={activeCategory} />
        ) : (
          <div className="text-center py-10 text-lg text-gray-500 font-medium">
            Hiện tại chưa có sản phẩm đang chọn.
          </div>
        )}

        <div className="text-center">
          <button className="bg-[#6F47EB] text-white font-semibold border-2 border-[#6F47EB] hover:bg-[#5a38d1] px-10 py-3 rounded-full transition-all duration-300 transform hover:scale-[1.05] shadow-lg shadow-[#6F47EB]/30 cursor-pointer">
            Xem Thêm Sản Phẩm
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsSection;
