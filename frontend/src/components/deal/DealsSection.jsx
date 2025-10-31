import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const DealsSection = ({ products }) => {
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});

  const nextSlide = () => setCurrent((prev) => (prev + 1) % products.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + products.length) % products.length);

  useEffect(() => {
    if (products && products.length > 1) {
      const timer = setInterval(nextSlide, 4000);
      return () => clearInterval(timer);
    }
  }, [products]);

  useEffect(() => {
    const targetDate = new Date().getTime() + 2 * 24 * 60 * 60 * 1000;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const visibleProducts = [
    products[current],
    products[(current + 1) % products.length],
  ];

  return (
    <section className="relative overflow-hidden bg-animated-gradient text-white py-42 font-[Manrope]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(111,71,235,0.15),transparent_60%)] pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#BDA5FF] mb-3 inline-block">
            Ưu Đãi Hàng Tháng
          </span>
          <h2 className="text-5xl font-extrabold mb-4 text-white leading-tight">
            Ưu đãi của tháng
          </h2>
          <p className="text-gray-300 mb-8 max-w-lg leading-relaxed">
            Khám phá các ưu đãi độc quyền chỉ có trong tháng này!
            Đừng bỏ lỡ cơ hội sở hữu những sản phẩm tuyệt vời với giá tốt nhất.
          </p>

          <button className="relative overflow-hidden px-8 py-3 font-semibold rounded-xl bg-gradient-to-r from-[#6F47EB] to-[#A67CFF] text-white shadow-lg transition-all duration-300 hover:scale-[1.05] hover:shadow-[#6F47EB]/40 btn-glow">
            <span className="relative z-10">Xem Chi Tiết Ngay</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#A67CFF] to-[#6F47EB] opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </button>

          <h3 className="font-semibold text-xl mb-6 mt-10 text-white">
            Ưu đãi sẽ kết thúc sau:
          </h3>

          <div className="flex gap-4">
            {["Ngày", "Giờ", "Phút", "Giây"].map((label, i) => {
              const values = [
                timeLeft.days || 0,
                timeLeft.hours || 0,
                timeLeft.minutes || 0,
                timeLeft.seconds || 0,
              ];
              return (
                <div
                  key={i}
                  className="text-center bg-white/10 backdrop-blur-md border border-[#6F47EB]/40 p-4 rounded-2xl w-20 h-24 flex flex-col justify-center items-center shadow-lg shadow-[#6F47EB]/30 hover:shadow-[#A67CFF]/40 transition-all duration-300"
                >
                  <p className="text-3xl font-extrabold text-white drop-shadow-[0_0_6px_rgba(111,71,235,0.5)] timer-box">
                    {values[i].toString().padStart(2, "0")}
                  </p>
                  <p className="text-xs font-medium text-[#BDA5FF] mt-1 uppercase tracking-wide">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative flex items-center justify-center min-h-[450px]">
          <button
            onClick={prevSlide}
            className="absolute -left-6 md:-left-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-[#6F47EB]/30 hover:bg-[#6F47EB] hover:text-white hover:scale-110 transition-all duration-300 z-30"
          >
            <FiChevronLeft className="text-3xl" />
          </button>

          <div className="flex items-center justify-center gap-6">
            <AnimatePresence initial={false} mode="wait">
              {visibleProducts.map((product, index) => {
                if (index > 0) return null;
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 200, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -200, scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                      damping: 25,
                      duration: 0.6,
                    }}
                    className="relative w-72 md:w-96 h-[420px] md:h-[480px] rounded-3xl shadow-2xl shadow-black/70 overflow-hidden cursor-pointer group card-float"
                  >
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 text-white">
                      <span className="text-xs font-medium uppercase text-[#A67CFF]">
                        Giảm giá đặc biệt
                      </span>
                      <h3 className="text-2xl font-bold mt-1 mb-1 drop-shadow-lg">
                        {product.title}
                      </h3>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold text-[#BDA5FF]">
                          {product.discount}
                        </p>
                        <span className="text-sm font-medium line-through opacity-60 text-gray-400">
                          $59.99
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button
            onClick={nextSlide}
            className="absolute -right-6 md:-right-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-[#6F47EB]/30 hover:bg-[#6F47EB] hover:text-white hover:scale-110 transition-all duration-300 z-30"
          >
            <FiChevronRight className="text-3xl" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;