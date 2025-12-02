import React from "react";
import { FiStar, FiSmile, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const StylingService = () => {
    return (
        <div className="font-[Manrope]">
            {/* Hero Section */}
            <div className="relative w-full h-64 sm:h-72 md:h-80 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">
                    Tư Vấn Phong Cách Cá Nhân
                </h1>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
                <p className="text-gray-700 leading-relaxed text-lg text-center max-w-4xl mx-auto">
                    Đội ngũ stylist chuyên nghiệp sẽ giúp bạn lựa chọn trang phục phù hợp
                    nhất với vóc dáng, phong cách và sự tự tin của bạn.
                    Cùng StyleNest khám phá phiên bản đẹp nhất của bạn!
                </p>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        {
                            icon: FiStar,
                            title: "Cá Nhân Hóa",
                            desc: "Phân tích dáng người & phong cách riêng của bạn.",
                        },
                        {
                            icon: FiSmile,
                            title: "Tự Tin Tỏa Sáng",
                            desc: "Trang phục phù hợp sẽ giúp bạn nổi bật mọi lúc.",
                        },
                        {
                            icon: FiCheckCircle,
                            title: "Stylist Chuyên Nghiệp",
                            desc: "Được hỗ trợ bởi chuyên gia thời trang nhiều kinh nghiệm.",
                        },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-all"
                        >
                            <item.icon className="mx-auto text-4xl text-purple-600 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                    <Link
                        to="/contact"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all shadow-md hover:scale-105"
                    >
                        Đặt lịch tư vấn ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StylingService;
