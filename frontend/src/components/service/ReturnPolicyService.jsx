import React from "react";
import { FiClock, FiRefreshCw, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";

const ReturnPolicyService = () => {
    return (
        <div className="font-[Manrope]">
            {/* Hero */}
            <div className="w-full h-64 sm:h-72 md:h-80 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">
                    Đổi Trả Dễ Dàng Trong 30 Ngày
                </h1>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
                <p className="text-gray-700 leading-relaxed text-lg text-center max-w-4xl mx-auto">
                    Mua sắm an tâm cùng chính sách đổi trả linh hoạt trong vòng 30 ngày.
                    Nếu sản phẩm không như mong đợi, chúng tôi sẽ hỗ trợ đổi trả nhanh chóng.
                </p>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        {
                            icon: FiClock,
                            title: "30 Ngày Linh Hoạt",
                            desc: "Thoải mái đổi trả nếu sản phẩm chưa phù hợp.",
                        },
                        {
                            icon: FiRefreshCw,
                            title: "Quy Trình Nhanh Gọn",
                            desc: "Xử lý đổi trả chỉ trong 1-3 ngày làm việc.",
                        },
                        {
                            icon: FiShield,
                            title: "Hỗ Trợ Tối Đa",
                            desc: "Đảm bảo quyền lợi khách hàng lên hàng đầu.",
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
                        to="/contact"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all shadow-md hover:scale-105"
                    >
                        Liên hệ hỗ trợ đổi trả
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicyService;
