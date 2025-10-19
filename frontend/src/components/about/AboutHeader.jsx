import React from 'react';
import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const AboutHeader = () => (
    <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-16"
    >
        <motion.h2 variants={item} className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">
            VỀ PLANTO
        </motion.h2>
        <motion.h1 variants={item} className="text-5xl font-extrabold text-black leading-tight max-w-3xl mx-auto">
            Thời Trang Đột Phá, Chất Lượng Hàng Đầu.
        </motion.h1>
    </motion.header>
);

export default AboutHeader;