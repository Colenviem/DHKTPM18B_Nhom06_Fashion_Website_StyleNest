import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ContactForm from "../../components/contact/ContactForm";
import ContactInfo from "../../components/contact/ContactInfo";
import MapSection from "../../components/contact/MapSection";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const ContactPage = () => {
  // 1. Thêm state để giữ thông tin người dùng
  const [currentUser, setCurrentUser] = useState(null);

  // 2. Đọc từ localStorage khi component được tải
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
      <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="py-10 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-[Manrope] space-y-6">
          <motion.header className="text-center">
            <h2 className="text-lg font-semibold uppercase tracking-widest text-gray-500 mb-2">
              KẾT NỐI VỚI CHÚNG TÔI
            </h2>
            <h1 className="text-5xl font-extrabold text-black leading-tight">
              Chúng Tôi Luôn Sẵn Sàng Trợ Giúp
            </h1>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* 3. Truyền 'currentUser' vào ContactForm */}
            <ContactForm user={currentUser} />
            <ContactInfo />
          </div>

          <MapSection />
        </div>
      </motion.section>
  );
};

export default ContactPage;