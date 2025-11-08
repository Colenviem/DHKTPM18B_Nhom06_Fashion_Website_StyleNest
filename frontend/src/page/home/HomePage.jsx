import React, { useEffect, useState } from "react";
import DealsSection from "../../components/deal/DealsSection";
import NewArrivalsSection from "../../components/product/NewArrivalsSection";
import InstagramFeedSection from "../../components/instagram/InstagramFeedSection";
import { getAllProducts } from "../../context/ProductContext";
import Spinner from "../../components/spinner/Spinner";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = "Hàng mới đến";
  const subtitle =
    "Khám phá những bộ sưu tập thời trang mới nhất vừa cập bến. Luôn cập nhật các sản phẩm độc đáo và thịnh hành nhất.";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAllProducts();

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

          return {
            ...product,
            coverImage, 
          };
        });

        setProducts(formatted);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        setError(
          err.message || "Đã xảy ra lỗi không xác định khi tải sản phẩm."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <Spinner size={12} />
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 font-bold">
        Lỗi: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Không tìm thấy sản phẩm nào.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full space-y-10">
      {/* 🛍️ Ưu đãi */}
      <DealsSection products={products} />

      {/* 🆕 Hàng mới đến */}
      <NewArrivalsSection
        products={products}
        title={title}
        subtitle={subtitle}
      />

      {/* 📸 Instagram */}
      <InstagramFeedSection />
    </div>
  );
};

export default HomePage;
