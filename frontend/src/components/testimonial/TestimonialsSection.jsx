import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import RenderStars from "../ui/RenderStars";

const TestimonialsSection = () => {
  const testimonials = [
    { id: 1, name: "Alice J.", role: "Creative Director", text: "Thiết kế thực sự nổi bật và chất lượng vật liệu vượt trội. Sản phẩm đã vượt quá mong đợi của tôi. Hoàn toàn xứng đáng!", rating: 5, image: "https://via.placeholder.com/150/f3f4f6/111827?text=A" },
    { id: 2, name: "David L.", role: "CEO, Tech Corp", text: "Trải nghiệm mua sắm mượt mà, giao hàng nhanh chóng và sản phẩm đúng như mô tả. Tôi rất hài lòng với dịch vụ khách hàng.", rating: 4, image: "https://via.placeholder.com/150/e5e7eb/111827?text=D" },
    { id: 3, name: "Châu N.", role: "Fashion Blogger", text: "Đây là phong cách tôi đang tìm kiếm! Tông màu sáng tinh tế và chi tiết rất tinh xảo. Chắc chắn sẽ mua thêm trong tương lai.", rating: 5, image: "https://via.placeholder.com/150/f3f4f6/111827?text=C" },
    { id: 4, name: "Minh T.", role: "UI Designer", text: "Tôi yêu cách họ đóng gói sản phẩm. Từ bao bì đến trải nghiệm mở hộp đều tuyệt vời.", rating: 5, image: "https://via.placeholder.com/150/f3f4f6/111827?text=M" },
    { id: 5, name: "Linh P.", role: "Photographer", text: "Chất lượng ảnh của sản phẩm thật đáng kinh ngạc. Tôi cảm thấy rất hài lòng!", rating: 4, image: "https://via.placeholder.com/150/e5e7eb/111827?text=L" },
    { id: 6, name: "An K.", role: "Blogger", text: "Phong cách sang trọng và dịch vụ nhanh chóng. Một trải nghiệm tuyệt vời!", rating: 5, image: "https://via.placeholder.com/150/f3f4f6/111827?text=K" },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= testimonials.length ? 0 : prev + visibleCount
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - visibleCount < 0
        ? testimonials.length - visibleCount
        : prev - visibleCount
    );
  };

  const visibleTestimonials = testimonials.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="bg-white py-24 text-[#111827] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-black mb-4">
                This Is What Our Customers Say
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
                Hãy xem những gì khách hàng của chúng tôi nói về sản phẩm và dịch vụ của chúng tôi.
            </p>
        </div>

        {/* Testimonials */}
        <div className="relative">
          <div className="flex justify-center items-stretch overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={startIndex}
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="flex gap-8 justify-center"
              >
                {visibleTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white border border-gray-200 p-8 max-w-sm flex-1 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col h-full">
                      <p className="text-gray-800 mb-6 italic flex-1 text-lg leading-relaxed">
                        "{testimonial.text}"
                      </p>

                      <div className="flex items-center gap-4 border-t border-gray-100 pt-4 mt-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-200"
                        />
                        <div className="flex-1">
                          <RenderStars rating={testimonial.rating} />
                          <h4 className="font-bold text-[#111827] mt-1">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white border border-gray-300 text-gray-800 shadow-md hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white border border-gray-300 text-gray-800 shadow-md hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            aria-label="Next testimonial"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;