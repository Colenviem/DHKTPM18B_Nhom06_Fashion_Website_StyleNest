import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
    {
        question: "Thời gian giao hàng bao lâu?",
        answer:
            "Chúng tôi giao hàng từ 2 - 5 ngày tùy khu vực. Khu vực nội thành thường nhận hàng trong 24 - 48 giờ.",
    },
    {
        question: "Tôi có thể đổi trả không?",
        answer:
            "Bạn có thể đổi trả trong vòng 7 ngày nếu sản phẩm còn nguyên tem mác và chưa qua sử dụng.",
    },
    {
        question: "Làm sao để kiểm tra trạng thái đơn hàng?",
        answer:
            "Bạn có thể theo dõi tại trang 'Theo dõi đơn hàng' hoặc liên hệ hotline hỗ trợ.",
    },
    {
        question: "Có hỗ trợ thanh toán khi nhận hàng?",
        answer:
            "Hiện tại chúng tôi hỗ trợ thanh toán COD và cổng thanh toán online an toàn.",
    },
];

export default function FAQs() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="max-w-5xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold text-center text-[#6F47EB] mb-12">
                Câu hỏi thường gặp
            </h1>

            <div className="space-y-4">
                {faqs.map((item, index) => (
                    <div
                        key={index}
                        className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-gray-700">
                                {item.question}
                            </h3>

                            <FiChevronDown
                                className={`text-[#6F47EB] text-2xl transition-transform ${
                                    activeIndex === index ? "rotate-180" : ""
                                }`}
                            />
                        </div>

                        {activeIndex === index && (
                            <p className="mt-3 text-gray-600">
                                {item.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
