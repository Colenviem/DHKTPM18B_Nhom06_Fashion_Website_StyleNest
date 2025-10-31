import React from "react";
import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const AboutHeader = () => (
    <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-4"
    >
        <motion.h2
            variants={item}
            className="text-lg font-semibold uppercase tracking-widest mb-3"
            >
            VỀ STYLENEST
        </motion.h2>

        <motion.h1
        variants={item}
        className="text-5xl font-extrabold text-black leading-tight mx-auto"
        >
        Thời Trang Đột Phá, Chất Lượng Hàng Đầu.
        </motion.h1>
    </motion.header>
);

export default AboutHeader;