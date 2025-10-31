import React from "react";
import { motion } from "framer-motion";

const AboutCTA = () => (
    <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="pt-4 text-center"
    >
        <button
            className="px-8 py-3 bg-[#6F47EB] text-white font-semibold rounded-full shadow-md 
                    hover:bg-[#5A39C9] transition-all duration-300 transform hover:scale-105"
        >
            Khám Phá Câu Chuyện Của Chúng Tôi
        </button>
    </motion.div>
);

export default AboutCTA;