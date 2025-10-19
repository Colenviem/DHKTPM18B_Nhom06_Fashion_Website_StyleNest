// src/pages/Services/ServicesPage.jsx
import React from "react";
import { motion } from "framer-motion";
import ServiceHeader from "../../components/service/ServiceHeader";
import ServiceCard from "../../components/service/ServiceCard";
import { FiUsers, FiRefreshCw, FiTruck, FiCreditCard, FiHeadphones } from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const servicesList = [
  {
    icon: FiUsers,
    title: "Tư Vấn Phong Cách Cá Nhân",
    description:
      "Đội ngũ stylist chuyên nghiệp giúp bạn chọn trang phục hoàn hảo theo vóc dáng & cá tính.",
    link: "#",
    delay: 0.2,
  },
  {
    icon: FiRefreshCw,
    title: "Đổi Trả Dễ Dàng Trong 30 Ngày",
    description:
      "An tâm mua sắm với chính sách đổi trả nhanh chóng và linh hoạt.",
    link: "#",
    delay: 0.3,
  },
  {
    icon: FiTruck,
    title: "Giao Hàng Siêu Tốc & Miễn Phí",
    description:
      "Miễn phí giao hàng cho đơn từ 500.000đ, giao nhanh trong 24h tại thành phố lớn.",
    link: "#",
    delay: 0.4,
  },
  {
    icon: FiCreditCard,
    title: "Thanh Toán Bảo Mật",
    description:
      "Thanh toán qua COD, thẻ, ví điện tử với công nghệ mã hóa cao cấp.",
    link: "#",
    delay: 0.5,
  },
  {
    icon: FiHeadphones,
    title: "Hỗ Trợ Khách Hàng 24/7",
    description:
      "Đội hỗ trợ trực tuyến 24/7, sẵn sàng giải đáp mọi thắc mắc.",
    link: "#",
    delay: 0.6,
  },
];

const ServicesPage = () => {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="py-6 bg-gray-50"
        >
        <div className="max-w-7xl mx-auto px-6">
            <ServiceHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, idx) => (
                <ServiceCard key={idx} {...service} />
            ))}
            </div>
        </div>
        </motion.section>
    );
};

export default ServicesPage;