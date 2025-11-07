import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiMinus, FiPlus, FiHeart } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaPinterestP } from "react-icons/fa";
import RenderStars from "../ui/RenderStars";
import ProductCard from "./ProductCard";
import ReviewSection from "../review/ReviewSection";
import { Link } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [activeColor, setActiveColor] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // fetch detail product hihi
  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`http://localhost:8080/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          if (data.variants?.length > 0) {
            setActiveColor(data.variants[0].color);
            setActiveSize(data.variants[0].size);
          }
        })
        .catch(console.error);
  }, [id]);


  // fetch interactive product hihi (4 products)
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
        .then((res) => res.json())
        .then((data) => setRelatedProducts(data.slice(0, 4)))
        .catch(console.error);
  }, []);

  if (!product)
    return (
        <p className="text-center text-gray-500 py-20 text-xl">
          Đang tải sản phẩm...
        </p>
    );

  const discountedPrice =
      product.discount && product.discount > 0
          ? product.price * (1 - product.discount / 100)
          : product.price;

  const thumbnails =
      product.variants?.flatMap((v) => v.images || []) ||
      (product.image ? [product.image] : []);


  const renderTabContent = () =>
      activeTab === "description" ? (
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">
            {product.description || "Không có mô tả cho sản phẩm này."}
          </p>
      ) : (
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Thương hiệu: {product.brand || "Chưa rõ"}</li>
            <li>Chất liệu: {product.material || "Đang cập nhật"}</li>
            <li>Xuất xứ: {product.origin || "Việt Nam"}</li>
            <li>Tình trạng: {product.inStock ? "Còn hàng" : "Hết hàng"}</li>
          </ul>
      );

  return (
      <div className="bg-gray-50 text-black py-14 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
          {/* 🔹 Hình ảnh sản phẩm */}
          <div className="w-full md:w-1/2 flex gap-6">
            <div className="w-20 flex flex-row md:flex-col gap-3">
              {thumbnails.map((thumb, index) => (
                  <div
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`h-20 p-1 rounded-lg cursor-pointer border transition-all duration-300 ${
                          activeImage === index
                              ? "border-gray-50 ring-2 ring-gray-300 scale-105"
                              : "border-gray-300 hover:border-black/50 hover:scale-105"
                      }`}
                  >
                    <img
                        src={thumb}
                        alt=""
                        className="rounded-md w-full h-full object-cover"
                    />
                  </div>
              ))}
            </div>

            {/* Ảnh chính */}
            <div className="flex-1">
              <div className="bg-white p-3 border border-gray-200 rounded-xl shadow-md">
                <img
                    src={thumbnails[activeImage] || product.image}
                    alt={product.name}
                    className="w-full object-cover rounded-lg"
                    style={{ aspectRatio: "1 / 1" }}
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-6 bg-white border border-gray-200 rounded-2xl shadow-md">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
              {product.name}
            </h1>

            <div className="flex items-center mb-5">
              <RenderStars rating={product.rating?.average || 4} />
              <span className="ml-2 text-sm text-gray-600">
              ({product.rating?.count || 0} Reviews)
            </span>
              <span className="ml-4 text-sm text-green-600 font-medium">
              {product.inStock ? "Còn hàng" : "Hết hàng"}
            </span>
            </div>

            {/* Giá */}
            <div className="flex items-center mb-6">
              {product.discount > 0 && (
                  <span className="text-gray-400 line-through text-2xl">
                {product.price.toLocaleString()}₫
              </span>
              )}
              <span className="text-4xl font-bold text-black ml-4">
              {discountedPrice.toLocaleString()}₫
            </span>
              {product.discount > 0 && (
                  <span className="ml-4 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-full">
                -{product.discount}%
              </span>
              )}
            </div>

            <p className="text-gray-700 mb-6 border-b border-gray-200 pb-4">
              {product.slogan ||
                  "Sản phẩm mang phong cách hiện đại và chất lượng cao."}
            </p>

            {/* Màu & Size (nếu có variants) */}
            {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="font-medium w-20">Màu sắc:</span>
                    <div className="flex gap-3">
                      {[...new Set(product.variants.map((v) => v.color))].map(
                          (color, i) => (
                              <div
                                  key={i}
                                  onClick={() => setActiveColor(color)}
                                  className={`w-8 h-8 rounded-full cursor-pointer transition-transform duration-200 ${
                                      activeColor === color
                                          ? "ring-2 ring-black ring-offset-2"
                                          : ""
                                  }`}
                                  style={{
                                    backgroundColor: color || "#ccc",
                                    border: "1px solid #ddd",
                                  }}
                              />
                          )
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-medium w-20">Kích cỡ:</span>
                    <div className="flex gap-2">
                      {[...new Set(product.variants.map((v) => v.size))].map(
                          (size) => (
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
                          )
                      )}
                    </div>
                  </div>
                </div>
            )}

            {/* Số lượng & hành động */}
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

            {/* Chia sẻ */}
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

        {/* Review */}
        <ReviewSection productId={product.id}/>

        <div className="max-w-7xl mx-auto mt-20">
          <h2 className="text-3xl font-extrabold mb-6 border-b pb-3 border-gray-300">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
                <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="hover:scale-[1.02] transition-transform"
                >
                  <ProductCard product={p} />
                </Link>
            ))}
          </div>
        </div>
      </div>
  );
};

export default ProductDetail;
