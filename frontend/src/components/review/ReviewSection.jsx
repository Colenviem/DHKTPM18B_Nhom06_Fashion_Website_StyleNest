import React, {useEffect, useState} from "react";
import {FiStar, FiUser, FiCamera} from "react-icons/fi";
import RenderStars from "../ui/RenderStars";
import axiosClient from "../../api/axiosClient";

const ReviewSection = ({productId}) => {
    const [reviews, setReviews] = useState([]);

    const [newReview, setNewReview] = useState({
        name: "",
        rating: 5,
        text: "",
    });

    useEffect(() => {
        if (!productId) return;

        axiosClient.get(`/reviews/product/${productId}`)
            .then((res) => setReviews(res.data))
            .catch((err) => console.error("Lỗi khi tải review:", err));
    }, [productId]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setNewReview({...newReview, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.name || !newReview.text) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const reviewToSend = {
            user: {userName: newReview.name},
            rating: newReview.rating,
            comment: newReview.text,
            productId: productId,
        };

        try {
            const res = await axiosClient.post("/reviews", reviewToSend);

            const created = res.data;
            setReviews((prev) => [created, ...prev]);
            setNewReview({name: "", rating: 5, text: ""});
            alert("Cảm ơn bạn đã đánh giá sản phẩm!");
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại!";
            alert(errorMsg);
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-20 px-4 md:px-0">
            <h2 className="text-4xl font-bold text-gray-900 mb-10 border-b pb-4 border-gray-200">
                Đánh giá sản phẩm ({reviews.length})
            </h2>

            <div className="space-y-10">
                {reviews.length === 0 && (
                    <p className="text-gray-500 italic">
                        Chưa có đánh giá nào cho sản phẩm này.
                    </p>
                )}

                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div
                                className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-full border border-gray-300 shadow-inner">
                                <FiUser className="text-2xl text-gray-700"/>
                            </div>
                            <div>
                                <p className="font-bold text-lg text-gray-900">
                                    {review.user?.userName || "Người dùng ẩn danh"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {review.createdAt
                                        ? new Date(review.createdAt).toLocaleDateString("vi-VN")
                                        : "Vừa đăng"}
                                </p>
                            </div>
                        </div>

                        <div className="mb-3">
                            <RenderStars rating={review.rating}/>
                        </div>

                        <p className="text-gray-800 italic leading-relaxed border-l-4 border-gray-200 pl-4 bg-gray-50 rounded-r-lg py-2 mb-4">
                            “{review.comment}”
                        </p>

                        {review.images && review.images.length > 0 && (
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FiCamera className="text-gray-700"/>
                                    <p className="font-semibold text-gray-800 text-sm">
                                        Ảnh khách hàng
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {review.images.map((photo, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
                                        >
                                            <img
                                                src={photo}
                                                alt={`Ảnh review ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="text-sm text-gray-500 mt-3">
                            ❤️ {review.likes ?? 0} lượt thích
                        </div>
                    </div>
                ))}
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-20 bg-white border border-gray-200 rounded-2xl p-10 shadow-2xl"
            >
                <h3 className="text-3xl font-bold text-black mb-8 border-b pb-4 border-gray-200">
                    Viết đánh giá của bạn
                </h3>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Tên của bạn
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={newReview.name}
                        onChange={handleChange}
                        placeholder="Nhập tên..."
                        className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition duration-200"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Đánh giá (sao)
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({...newReview, rating: star})}
                                className={`text-3xl transition-transform transform hover:scale-125 ${
                                    newReview.rating >= star
                                        ? "text-yellow-400 drop-shadow-md"
                                        : "text-gray-400 hover:text-gray-500"
                                }`}
                            >
                                <FiStar/>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Nội dung đánh giá
                    </label>
                    <textarea
                        name="text"
                        value={newReview.text}
                        onChange={handleChange}
                        placeholder="Chia sẻ cảm nhận của bạn..."
                        className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 h-32 resize-none transition duration-200"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-black text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-black/30"
                >
                    Gửi đánh giá
                </button>
            </form>
        </div>
    );
};

export default ReviewSection;