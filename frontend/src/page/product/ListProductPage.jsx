import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FilterSidebar from "../../components/filter/FilterSidebar";
import NewArrivalsSection from "../../components/product/NewArrivalsSection";
import { getAllProducts, getProductsByCategoryId } from "../../context/ProductContext";
import Spinner from "../../components/spinner/Spinner";

const ListProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category"); // VD: "CAT001,CAT002"

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data = [];

        if (categoryParam && categoryParam !== "new") {
          // ✅ Nếu có nhiều category, gọi API cho từng cái
          const categories = categoryParam.split(",");
          const allData = await Promise.all(
            categories.map((catId) => getProductsByCategoryId(catId))
          );
          data = allData.flat(); // Gộp kết quả lại
        } else {
          data = await getAllProducts();
        }

        // ✅ Format ảnh mặc định
        const formatted = data.map((product) => {
          let coverImage = "/placeholder.png";
          if (
            product.variants &&
            product.variants.length > 0 &&
            product.variants[0].images &&
            product.variants[0].images.length > 0
          ) {
            coverImage = product.variants[0].images[0];
          }
          return { ...product, coverImage };
        });

        setProducts(formatted);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err.message);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam]);

  if (loading)
    return <Spinner size={12}/>;

  if (error)
    return <div className="py-20 text-center text-xl font-medium text-red-600">Lỗi: {error}</div>;

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
            products={products}
            title="Danh sách sản phẩm"
            subtitle="Khám phá những sản phẩm theo danh mục bạn chọn."
          />
        </div>
      </div>
    </div>
  );
};

export default ListProductPage;
