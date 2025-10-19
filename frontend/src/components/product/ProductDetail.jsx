import React, { useState } from "react";
import { FiMinus, FiPlus, FiHeart } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaPinterestP } from "react-icons/fa";
import RenderStars from "../ui/RenderStars";
import ProductCard from "./ProductCard";
import ReviewSection from "../review/ReviewSection";

const ProductDetail = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [activeColor, setActiveColor] = useState("#111");
  const [activeSize, setActiveSize] = useState("M");

  const product = {
    name: "Áo Khoác Nam Streetwear",
    brand: "Planto",
    rating: 4,
    review: 24,
    instock: 12,
    price: 850000,
    discount: 20,
    slogan:
      "Phong cách đường phố hiện đại — tinh tế và mạnh mẽ trong từng chi tiết.",
    thumbnails: ["/imgs/demo1.jpg", "/imgs/demo2.jpg", "/imgs/demo3.jpg", "/imgs/demo4.jpg"],
    colors: ["#111", "#BB86FC", "#E0B0FF", "#888"],
    sizes: ["S", "M", "L", "XL"],
  };

  const relatedProducts = [
    { id: "rp1", name: "Áo phông Basic", price: 250000, image: "https://via.placeholder.com/400x400/f5f5f5/000000?text=Basic" },
    { id: "rp2", name: "Quần Jeans Slim", price: 700000, image: "https://via.placeholder.com/400x400/f5f5f5/000000?text=Jeans" },
    { id: "rp3", name: "Giày Sneaker Trắng", price: 1200000, image: "https://via.placeholder.com/400x400/f5f5f5/000000?text=Sneaker" },
    { id: "rp4", name: "Túi Đeo Chéo", price: 450000, image: "https://via.placeholder.com/400x400/f5f5f5/000000?text=Bag" },
  ];

  const reviewsData = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    rating: 5,
    date: "20/09/2025",
    text: "Chất liệu áo tuyệt vời, form dáng chuẩn, giao hàng siêu nhanh. Rất hài lòng!",
    reviewPhotos: [
      "https://via.placeholder.com/150/e0e0e0/333333?text=Review+Pic+1",
      "https://via.placeholder.com/150/d0d0d0/333333?text=Review+Pic+2",
      "https://via.placeholder.com/150/c0c0c0/333333?text=Review+Pic+3",
      "https://via.placeholder.com/150/b0b0b0/333333?text=Review+Pic+4",
    ],
  },
  {
    id: 2,
    user: "Trần Thị B",
    rating: 4,
    date: "15/09/2025",
    text: "Áo đẹp như hình, chỉ hơi rộng một chút so với size thông thường. Nên tham khảo bảng size kỹ hơn.",
  },
  {
    id: 3,
    user: "Lê Văn C",
    rating: 5,
    date: "10/09/2025",
    text: "Mua cho bạn trai, anh ấy rất thích. Màu sắc và độ dày vải rất phù hợp với thời tiết se lạnh.",
  },
];


  const discountedPrice = product.price * (1 - product.discount / 100);

  const renderTabContent = () =>
    activeTab === "description" ? (
      <p className="leading-relaxed text-gray-700">
        Sản phẩm được làm từ **Cotton 100%** cao cấp, mang lại cảm giác thoải
        mái và tự tin suốt cả ngày. Thiết kế hiện đại, phù hợp cho mọi phong cách
        từ đi chơi đến công sở. Công nghệ nhuộm màu **bền bỉ**, luôn giữ được độ
        mới sau nhiều lần giặt.
      </p>
    ) : (
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>**Chất liệu:** Cotton 100% cao cấp, thoáng khí.</li>
        <li>**Màu sắc:** Đen huyền bí / Xám bạc hiện đại.</li>
        <li>**Kích thước:** S - M - L - XL, form Regular Fit.</li>
        <li>**Xuất xứ:** Việt Nam, tiêu chuẩn quốc tế.</li>
      </ul>
    );

  return (
    <div className="bg-gray-50 text-black py-14 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2 flex gap-6">
          <div className="w-20 flex flex-row md:flex-col gap-3">
            {product.thumbnails.map((thumb, index) => (
              <div
                key={index}
                onClick={() => setActiveImage(index)}
                className={`h-20 p-1 rounded-lg cursor-pointer border transition-all duration-300 ${
                  activeImage === index
                    ? "border-gray-50 ring-2 ring-gray-300 scale-105"
                    : "border-gray-300 hover:border-black/50 hover:scale-105"
                }`}
              >
                <img src={thumb} alt="" className="rounded-md w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
            <div className="bg-white p-3 border border-gray-200 rounded-xl shadow-md">
              <img
                src={product.thumbnails[activeImage]}
                alt={product.name}
                className="w-full object-cover rounded-lg"
                style={{ aspectRatio: "1 / 1" }}
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 p-6 bg-white border border-gray-200 rounded-2xl shadow-md">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{product.name}</h1>

          <div className="flex items-center mb-5">
            <RenderStars rating={product.rating} />
            <span className="ml-2 text-sm text-gray-600">({product.review} Reviews)</span>
            <span className="ml-4 text-sm text-green-600 font-medium">
              Còn hàng ({product.instock})
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-center mb-6">
            <span className="text-gray-400 line-through text-2xl">
              {product.price.toLocaleString()}₫
            </span>
            <span className="text-4xl font-bold text-black ml-4">
              {discountedPrice.toLocaleString()}₫
            </span>
            <span className="ml-4 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-full">
              -{product.discount}%
            </span>
          </div>

          <p className="text-gray-700 mb-6 border-b border-gray-200 pb-4">
            {product.slogan}
          </p>

          {/* Color & Size */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="font-medium w-20">Màu sắc:</span>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveColor(color)}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-transform duration-200 ${
                      activeColor === color ? "ring-2 ring-black ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium w-20">Kích cỡ:</span>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setActiveSize(size)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
                      activeSize === size
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-700 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <FiMinus />
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-14 text-center font-semibold bg-white text-black outline-none"
              />
              <button
                className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
              >
                <FiPlus />
              </button>
            </div>

            <button className="flex-1 bg-black text-white font-bold px-6 py-3 rounded-lg hover:bg-gray-900 transition-transform hover:scale-[1.02]">
              Thêm vào giỏ hàng
            </button>

            <button className="p-3 border border-black rounded-lg hover:bg-black hover:text-white transition">
              <FiHeart className="text-lg" />
            </button>
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
            <span className="text-gray-700 font-medium">Chia sẻ:</span>
            <div className="flex gap-2">
              {[FaFacebookF, FaTwitter, FaPinterestP].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:opacity-80 transition"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mt-14">
        <nav className="flex space-x-10 border-b border-gray-300">
          {["description", "details"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-semibold text-lg transition-colors ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-black hover:border-gray-400"
              }`}
            >
              {tab === "description" ? "Mô tả sản phẩm" : "Chi tiết"}
            </button>
          ))}
        </nav>

        <div className="py-8 px-6 text-gray-700 bg-white border border-t-0 border-gray-300 rounded-b-xl">
          {renderTabContent()}
        </div>
      </div>

        <ReviewSection reviews={reviewsData} />

      <div className="max-w-7xl mx-auto mt-20">
        <h2 className="text-3xl font-extrabold mb-6 border-b pb-3 border-gray-300">
          Sản phẩm liên quan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;