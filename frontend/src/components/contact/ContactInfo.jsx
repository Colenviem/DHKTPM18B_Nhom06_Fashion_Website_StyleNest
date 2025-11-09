import React from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";

const detailVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ContactInfo = () => {
  return (
      <motion.div
          variants={itemVariants}
          className="flex flex-col justify-center"
      >
        <h2 className="text-3xl font-bold mb-8 text-[#4B5563]">
          Thông Tin Liên Hệ
        </h2>

        <div className="space-y-8">
          <motion.div
              variants={detailVariants}
              className="flex items-start space-x-4"
          >
            <FiMapPin className="text-2xl text-[#6F47EB] flex-shrink-0 mt-1 hover:scale-110 transition-transform duration-300" />
            <div>
              <h3 className="text-xl font-semibold text-[#4B5563]">
                Trụ sở chính
              </h3>
              <p className="text-[#4B5563] text-lg">
                Nguyễn Văn Bảo/12 Đ. Hạnh Thông, Phường, Gò Vấp, Thành phố Hồ Chí
                Minh 700000, Việt Nam
              </p>
            </div>
          </motion.div>

          <motion.div
              variants={detailVariants}
              className="flex items-start space-x-4"
          >
            <FiMail className="text-2xl text-[#6F47EB] flex-shrink-0 mt-1 hover:scale-110 transition-transform duration-300" />
            <div>
              <h3 className="text-xl font-semibold text-[#4B5563]">
                Email hỗ trợ
              </h3>
              <p className="text-[#4B5563] text-lg">
                trancongtinh20042004@gmail.com
              </p>
            </div>
          </motion.div>

          <motion.div
              variants={detailVariants}
              className="flex items-start space-x-4"
          >
            <FiPhone className="text-2xl text-[#6F47EB] flex-shrink-0 mt-1 hover:scale-110 transition-transform duration-300" />
            <div>
              <h3 className="text-xl font-semibold text-[#4B5563]">
                Điện thoại
              </h3>
              <p className="text-[#4B5563] text-lg">+844444111111</p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-12">
          <h3 className="text-2xl font-bold mb-4 text-[#4B5563]">
            Giờ làm việc
          </h3>
          <p className="text-[#4B5563]">Thứ Hai - Thứ Sáu: 9:00 AM - 5:00 PM EST</p>
          <p className="text-[#4B5563]">Thứ Bảy: 10:00 AM - 3:00 PM EST</p>
        </motion.div>
      </motion.div>
  );
};

export default ContactInfo;