import { motion } from "framer-motion";

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ServiceHeader = () => (
  <motion.header variants={headerVariants} className="text-center">
    <h2 className="text-sm font-semibold uppercase tracking-widest text-[#4B5563] mb-4">
      DỊCH VỤ ĐẶC QUYỀN
    </h2>
    <h1 className="text-5xl font-extrabold text-black leading-tight max-w-4xl mx-auto">
      Mọi Nhu Cầu Của Bạn Đều Là Ưu Tiên Hàng Đầu Của Chúng Tôi.
    </h1>
  </motion.header>
);

export default ServiceHeader;