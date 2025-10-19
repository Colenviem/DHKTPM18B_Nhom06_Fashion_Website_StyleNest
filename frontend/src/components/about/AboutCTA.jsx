import React from 'react';
import { motion } from 'framer-motion';

const AboutCTA = () => (
    <motion.div variants={{ visible: { opacity: 1, y: 0 } }} className="pt-4">
        <button className="px-8 py-3 bg-black text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300">
            Khám Phá Câu Chuyện Của Chúng Tôi
        </button>
    </motion.div>
);

export default AboutCTA;