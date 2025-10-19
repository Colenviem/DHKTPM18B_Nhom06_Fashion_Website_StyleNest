import React from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import FormField from "./FormField";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ContactForm = () => {
  return (
    <motion.div variants={itemVariants} className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Gửi Tin Nhắn Cho Chúng Tôi</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
        <FormField label="Họ và Tên" name="name" />
        <FormField label="Địa chỉ Email" name="email" type="email" />
        <FormField label="Tiêu đề" name="subject" />
        <FormField label="Nội dung tin nhắn" name="message" isTextArea={true} />

        <motion.button
          className="w-full py-3 bg-black text-white font-semibold rounded-xl shadow-md hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>Gửi Tin Nhắn</span>
          <FiSend size={18} />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ContactForm;