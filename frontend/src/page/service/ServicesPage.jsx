import React from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiRefreshCw,
  FiTruck,
  FiCreditCard,
  FiHeadphones,
} from "react-icons/fi";
import ServiceHeader from "../../components/service/ServiceHeader";
import ServiceCard from "../../components/service/ServiceCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const SERVICES = [
    {
        icon: FiUsers,
        title: "Tư Vấn Phong Cách Cá Nhân",
        description: "Đội ngũ stylist chuyên nghiệp giúp bạn chọn trang phục hoàn hảo theo vóc dáng & cá tính.",
        link: "/services/styling",
    },
    {
        icon: FiRefreshCw,
        title: "Đổi Trả Dễ Dàng Trong 30 Ngày",
        description: "An tâm mua sắm với chính sách đổi trả nhanh chóng và linh hoạt.",
        link: "/services/return-policy",
    },
    {
        icon: FiTruck,
        title: "Giao Hàng Siêu Tốc & Miễn Phí",
        description: "Miễn phí giao hàng cho đơn từ 500.000đ, giao nhanh trong 24h tại thành phố lớn.",
        link: "/services/shipping",
    },
    {
        icon: FiCreditCard,
        title: "Thanh Toán Bảo Mật",
        description: "Thanh toán qua COD, thẻ, ví điện tử với công nghệ mã hóa cao cấp.",
        link: "/services/payment-security",
    },
    {
        icon: FiHeadphones,
        title: "Hỗ Trợ Khách Hàng 24/7",
        description: "Đội hỗ trợ trực tuyến 24/7, sẵn sàng giải đáp mọi thắc mắc.",
        link: "/contact",
    },
];


const ServicesPage = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="py-12 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6 font-[Manrope] space-y-6">
        <ServiceHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, idx) => (
            <ServiceCard key={idx} {...service} delay={0.2 + idx * 0.1} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ServicesPage;