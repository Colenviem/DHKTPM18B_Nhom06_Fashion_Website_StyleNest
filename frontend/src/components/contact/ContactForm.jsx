import React, { useState, useEffect } from "react"; // Thêm useEffect
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import FormField from "./FormField";
import emailjs from "@emailjs/browser";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ContactForm = ({ user }) => {
  // Khởi tạo state rỗng
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);


  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);

    emailjs
        .send(
            "service_ui2r9c7",
            "template_8j8vsy8",
            formData,
            "YOUR_PUBLIC_KEY"
        )
        .then(
            (response) => {
              console.log("SUCCESS!", response.status, response.text);
              alert("Gửi tin nhắn thành công!");
              setFormData((prev) => ({
                ...prev,
                title: "",
                message: "",
              }));
            },
            (err) => {
              console.log("FAILED...", err);
              alert("Gửi tin nhắn thất bại. Vui lòng thử lại.");
            }
        )
        .finally(() => {
          setIsSending(false);
        });
  };

  return (
      <motion.div
          variants={itemVariants}
          className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100"
      >
        <h2 className="text-3xl font-bold mb-8 text-[#4B5563]">
          Gửi Tin Nhắn Cho Chúng Tôi
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <FormField
              label="Họ và Tên"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={!!user} // Khóa nếu user tồn tại
          />
          <FormField
              label="Địa chỉ Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!!user} // Khóa nếu user tồn tại
          />
          <FormField
              label="Tiêu đề"
              name="title"
              value={formData.title}
              onChange={handleChange}
          />
          <FormField
              label="Nội dung tin nhắn"
              name="message"
              isTextArea
              value={formData.message}
              onChange={handleChange}
          />
          <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSending}
              className="w-full py-3 bg-[#6F47EB] text-white font-semibold rounded-xl shadow-md hover:bg-[#5b36d3] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSending ? "Đang gửi..." : "Gửi Tin Nhắn"}</span>
            <FiSend size={18} />
          </motion.button>
        </form>
      </motion.div>
  );
};

export default ContactForm;