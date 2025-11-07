import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../context/ProductContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        console.log("Chi tiết sản phẩm:", data);
        setProduct(data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("🛒 Đã thêm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    alert("🚀 Chức năng Mua Ngay (sẽ dẫn đến trang thanh toán trong tương lai).");
  };

  if (loading)
    return (
      <div className="py-20 text-center text-xl font-medium text-[#111827]">
        Đang tải sản phẩm...
      </div>
    );

  if (error)
    return (
      <div className="py-20 text-center text-xl font-medium text-red-600">
        {error}
      </div>
    );

  if (!product)
    return (
      <div className="py-20 text-center text-xl font-medium text-[#4B5563]">
        Không tìm thấy sản phẩm!
      </div>
    );

  const allImages = product.variants
    ? product.variants.flatMap((variant) => variant.images || [])
    : [];

  return (
    <div className="py-10 bg-white min-h-screen font-[Manrope]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          className="mb-8 flex items-center text-[#4B5563] hover:text-[#6F47EB] transition duration-200 font-medium"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="lg:w-1/2">
            {allImages.length > 0 ? (
              <Carousel
                showThumbs={true}
                infiniteLoop={true}
                autoPlay={true}
                showStatus={false}
                interval={4000}
                className="rounded-lg shadow-xl"
              >
                {allImages.map((img, index) => (
                  <div key={index}>
                    <img
                      src={img}
                      alt={`Ảnh ${index + 1}`}
                      className="object-cover w-full rounded-lg"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <img
                src="/placeholder.png"
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg shadow-xl"
              />
            )}
          </div>

          {/* 🧾 Thông tin sản phẩm */}
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111827]">
              {product.name}
            </h1>

            {/* Giá + giảm giá */}
            <div className="flex items-center space-x-4">
              <p className="text-3xl font-bold text-[#6F47EB] border-b pb-2 border-gray-200">
                {(product.price * (1 - (product.discount || 0) / 100)).toLocaleString("vi-VN")}₫
              </p>
              {product.discount > 0 && (
                <span className="text-lg text-red-500 line-through">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-white bg-red-500 px-2 py-1 rounded-md text-sm font-semibold">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Rating */}
            <p className="text-yellow-500 font-medium">
              ⭐ {product.rating?.average} / 5 ({product.rating?.count} đánh giá)
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#111827]">
                Mô tả chi tiết:
              </h3>
              <p className="text-[#4B5563] leading-relaxed">
                {product.description || "Không có mô tả chi tiết."}
              </p>

              <ul className="text-[#4B5563] space-y-1 pt-2">
                <li><b>Thương hiệu:</b> {product.brand}</li>
                <li><b>Chất liệu:</b> {product.material}</li>
                <li><b>Xuất xứ:</b> {product.origin}</li>
                <li><b>Đã bán:</b> {product.sold}</li>
              </ul>
            </div>

            {/* Kiểm soát số lượng */}
            <div className="flex items-center space-x-4 pt-4">
              <span className="text-lg font-medium text-[#111827]">
                Số lượng:
              </span>
              <div className="flex items-center border border-gray-300 rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-xl font-semibold text-[#4B5563] hover:bg-gray-100 rounded-l-full transition duration-150"
                >
                  -
                </button>
                <span className="px-4 text-lg font-bold text-[#111827]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 text-xl font-semibold text-[#4B5563] hover:bg-gray-100 rounded-r-full transition duration-150"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                className="w-full sm:w-1/2 bg-white text-[#6F47EB] font-semibold text-lg border-2 border-[#6F47EB] hover:bg-gray-100 px-10 py-3 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg cursor-pointer"
                onClick={handleBuyNow}
              >
                🚀 Mua Ngay
              </button>

              <button
                className="w-full sm:w-1/2 bg-[#6F47EB] text-white font-semibold text-lg border-2 border-[#6F47EB] hover:bg-[#5a38d1] px-10 py-3 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-[#6F47EB]/40 cursor-pointer"
                onClick={handleAddToCart}
              >
                🛒 Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
