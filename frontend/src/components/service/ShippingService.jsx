import React from "react";
import { FiTruck, FiMapPin, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";

const ShippingService = () => {
    return (
        <div className="font-[Manrope]">
            {/* Hero */}
            <div className="w-full h-64 sm:h-72 md:h-80 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">
                    Giao Hàng Siêu Tốc & Miễn Phí
                </h1>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
                <p className="text-gray-700 leading-relaxed text-lg text-center max-w-4xl mx-auto">
                    Giao hàng miễn phí cho đơn từ <span className="font-semibold">500.000đ</span>,
                    hỗ trợ giao siêu tốc 24 giờ tại các thành phố lớn và theo dõi đơn hàng qua hệ thống.
                </p>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        {
                            icon: FiTruck,
                            title: "Miễn Phí Vận Chuyển",
                            desc: "Áp dụng toàn quốc cho đơn trên 500.000đ.",
                        },
                        {
                            icon: FiZap,
                            title: "Giao Siêu Tốc 24h",
                            desc: "Nhanh chóng tại Hà Nội, TP.HCM & các thành phố lớn.",
                        },
                        {
                            icon: FiMapPin,
                            title: "Theo Dõi Đơn Hàng",
                            desc: "Cập nhật trạng thái giao hàng liên tục.",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
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
                        to="/profile"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all shadow-md hover:scale-105"
                    >
                        Theo dõi đơn hàng
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ShippingService;
