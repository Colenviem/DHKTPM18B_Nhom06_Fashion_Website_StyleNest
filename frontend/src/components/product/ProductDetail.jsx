import React, { useEffect, useState, useContext, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  getReviewsByProductId,
} from "../../context/ProductContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { CartContext } from "../../context/CartContext";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, userId } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [reviewsError, setReviewsError] = useState(null);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review form states
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewImages, setReviewImages] = useState([]);

  // Kiểm tra user đã mua sản phẩm chưa
  const [orders, setOrders] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      const userIdLocal = user.id;

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8080/api/orders/user/${userIdLocal}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(res.data);

      console.log("Đơn hàng của user:", res.data);

      // Kiểm tra user đã từng mua sản phẩm chưa
      const purchased = res.data.some((order) =>
        order.items.some((item) => item.product.id === product?.id)
      );

      setHasPurchased(purchased);
    } catch (err) {
      console.error("Lỗi lấy orders:", err);
    }
  };

  if (product?.id) {
    fetchOrders();
  }
}, [product]);

  const openModal = (message, duration = 1500) => {
    setModalMessage(message);
    setIsModalOpen(true);

    setTimeout(() => {
      setIsModalOpen(false);
    }, duration);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setReviewsError(null);

      try {
        const productData = await getProductById(id);
        console.log("Chi tiết sản phẩm:", productData);
        setProduct(productData);

        if (productData?.id) {
          const reviewsData = await getReviewsByProductId(productData.id);
          console.log("Danh sách Reviews:", reviewsData);
          setReviews(reviewsData);
        }
        if (productData?.variants?.length > 0) {
          setSelectedColor(productData.variants[0].color);
          setSelectedSize(productData.variants[0].size);
          setSelectedVariant(productData.variants[0]);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        if (err.message.includes("sản phẩm")) {
          setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        } else {
          setReviewsError("Không thể tải danh sách đánh giá.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!userId) {
      openModal("⚠️ Bạn phải đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    if (!product) return;

    if (!selectedVariant || selectedVariant.inStock < quantity) {
      openModal(
        `⚠️ Số lượng tồn kho không đủ! Chỉ còn ${
          selectedVariant?.inStock || 0
        } sản phẩm.`
      );
      return;
    }

    const productData = {
      id: product.id,
      name: product.name,

      price: product.price,
      discount: product.discount,

      thumbnails:
        selectedVariant?.images?.length > 0
          ? selectedVariant.images
          : [product.image],

      colors: [...new Set(product.variants.map((v) => v.color))],
      sizes: [...new Set(product.variants.map((v) => v.size))],

      selectedColor,
      selectedSize,

      maxInStock: selectedVariant?.inStock,

      quantity: quantity,
    };

    console.log("👉 Dữ liệu gửi vào giỏ:", productData);

    addToCart(productData);

    openModal(`🛒 Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const updateSelectedVariant = (color, size) => {
    if (!product?.variants) return;

    const found = product.variants.find(
      (v) => v.color === color && v.size === size
    );

    setSelectedColor(color);
    setSelectedSize(size);
    setSelectedVariant(found || null);
  };

  const handleBuyNow = () => {
    if (!userId) {
      openModal("⚠️ Bạn phải đăng nhập để mua sản phẩm!");
      navigate("/login");
      return;
    }

    if (!product) return;

    if (!selectedVariant || selectedVariant.inStock < quantity) {
      openModal(
        `⚠️ Không đủ hàng! Chỉ còn ${selectedVariant?.inStock || 0} sản phẩm.`
      );
      return;
    }

    const productData = {
      id: product.id,
      name: product.name,
      thumbnails: [
        product.image ||
          product.variants?.[0]?.images?.[0] ||
          "/placeholder.png",
      ],
      price: Math.round(product.price * (1 - (product.discount || 0) / 100)),
      discount: product.discount || 0,
      quantity,
      colors: product.variants?.map((v) => v.color) || ["Trắng", "Đen"],
      selectedColor: selectedColor,
      size: product.variants?.map((v) => v.size) || ["M", "L"],
      selectedSize: selectedSize,
    };

    navigate("/checkout", { state: { products: [productData] } });
  };

  // Xử lý gửi Review
  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      openModal("⚠️ Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      const reviewData = {
        rating: reviewRating,
        comment: reviewText,
        images: reviewImages, //URL ảnh đánh giá
        productId: product.id,
      };

      console.log("📤 Gửi review:", reviewData);

      // Gọi API do bạn tự viết
      // await createReview(product.id, reviewData);

      // Reset
      setReviewText("");
      setReviewRating(5);
      setReviewImages([]);

      openModal("⭐ Đã gửi đánh giá thành công!");

      // Tải lại danh sách reviews
      const updated = await getReviewsByProductId(product.id);
      setReviews(updated);
    } catch (err) {
      openModal("❌ Lỗi khi gửi đánh giá!");
      console.error(err);
    }
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
                {(
                  product.price *
                  (1 - (product.discount || 0) / 100)
                ).toLocaleString("vi-VN")}
                ₫
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
              ⭐ {product.rating?.average} / 5 ({product.rating?.count} đánh
              giá)
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#111827]">
                Mô tả chi tiết:
              </h3>
              <p className="text-[#4B5563] leading-relaxed">
                {product.description || "Không có mô tả chi tiết."}
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[#111827]">
                  Màu sắc:
                </h3>

                <select
                  value={selectedColor}
                  onChange={(e) =>
                    updateSelectedVariant(e.target.value, selectedSize)
                  }
                  className="mt-2 w-40 p-2 border rounded-md focus:ring-2 focus:ring-[#6F47EB] text-sm"
                >
                  {[...new Set(product.variants.map((v) => v.color))].map(
                    (color) => {
                      const colorVi =
                        {
                          black: "Màu Đen",
                          white: "Màu Trắng",
                          red: "Màu Đỏ",
                          blue: "Màu Xanh dương",
                          green: "Màu Xanh lá",
                          yellow: "Màu Vàng",
                          pink: "Màu Hồng",
                          gray: "Màu Xám",
                          orange: "Màu Cam",
                        }[color.toLowerCase()] || color;

                      return (
                        <option key={color} value={color}>
                          {colorVi}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[#111827]">
                  Kích thước:
                </h3>

                <div className="flex gap-3 mt-2">
                  {[...new Set(product.variants.map((v) => v.size))].map(
                    (size) => (
                      <button
                        key={size}
                        onClick={() =>
                          updateSelectedVariant(selectedColor, size)
                        }
                        className={`w-12 h-12 flex items-center justify-center rounded-full border text-sm font-semibold transition 
                    ${
                      selectedSize === size
                        ? "bg-[#6F47EB] text-white border-[#6F47EB]"
                        : "bg-white text-[#111827] border-gray-300 hover:bg-gray-100"
                    }`}
                      >
                        {size}
                      </button>
                    )
                  )}
                </div>
              </div>

              <ul className="text-[#4B5563] space-y-1 pt-2">
                <li>
                  <b>Còn lại: </b>
                  <span className="text-sm text-gray-600">
                    {selectedVariant?.inStock || 0} sản phẩm
                  </span>
                </li>

                <li>
                  <b>Thương hiệu:</b> {product.brand}
                </li>
                <li>
                  <b>Chất liệu:</b> {product.material}
                </li>
                <li>
                  <b>Xuất xứ:</b> {product.origin}
                </li>
                <li>
                  <b>Đã bán:</b> {product.sold}
                </li>
              </ul>
            </div>

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

        {/* FORM VIẾT ĐÁNH GIÁ - chỉ hiện khi user đã mua */}
        {hasPurchased && (
          <div className="mb-10 p-6 border rounded-xl shadow-sm bg-white mt-10">
            <h3 className="text-2xl font-bold text-[#111827] mb-4">
              ✍️ Viết đánh giá của bạn
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className={`text-3xl transition ${
                    star <= reviewRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Nhập nội dung */}
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-[#6F47EB] outline-none text-gray-700"
              rows={4}
            />

            {/* Upload ảnh */}
            <div className="mt-4">
              <label className="font-semibold text-[#111827]">
                Tải ảnh (tuỳ chọn):
              </label>
              <input
                type="file"
                multiple
                className="mt-2"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const urls = files.map((f) => URL.createObjectURL(f));
                  setReviewImages(urls);
                }}
              />

              {/* Preview ảnh */}
              {reviewImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {reviewImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Nút gửi */}
            <button
              onClick={handleSubmitReview}
              className="mt-4 bg-[#6F47EB] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#5936d6] shadow-md transition"
            >
              Gửi đánh giá ⭐
            </button>
          </div>
        )}

        {/* --- 💬 Phần Hiển thị Reviews --- */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-[#111827] mb-6">
            💬 Đánh giá sản phẩm ({reviews.length})
          </h2>

          {reviewsError && (
            <p className="text-red-500 italic mb-4">{reviewsError}</p>
          )}

          {reviews.length === 0 && !reviewsError ? (
            <p className="text-[#4B5563] italic">
              Sản phẩm này chưa có đánh giá nào.
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-[#111827]">
                      👤 {review.user.userName || "Người dùng ẩn danh"}
                    </p>
                    <p className="text-sm text-yellow-500 font-bold">
                      {Array(review.rating).fill("⭐").join("")}
                    </p>
                  </div>
                  <p className="text-gray-700 italic mb-3">
                    "{review.comment}"
                  </p>

                  {/* NEW CODE: Hiển thị hình ảnh review */}
                  {review.images && review.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 border-t pt-3 border-gray-200">
                      {review.images.map((imgUrl, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={imgUrl}
                          alt={`Ảnh đánh giá ${review.id}-${imgIndex + 1}`}
                          className="w-20 h-20 object-cover rounded-md border border-gray-300 shadow-sm cursor-pointer"
                        />
                      ))}
                    </div>
                  )}
                  {/* END NEW CODE */}

                  <div className="flex items-center justify-between text-sm text-[#6B7280] mt-3">
                    <span>👍 {review.likes} lượt thích</span>
                    <span>
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
            <div
              className="pointer-events-auto bg-white rounded-2xl p-6 w-[320px] shadow-[0_10px_35px_rgba(0,0,0,0.15)] border border-gray-100
                       animate-fadeInUp transform transition-all"
            >
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-[#6F47EB]/10 flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-[#111827] text-center mb-2">
                Thông báo
              </h3>

              {/* Message */}
              <p className="text-gray-700 text-center mb-5">{modalMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
