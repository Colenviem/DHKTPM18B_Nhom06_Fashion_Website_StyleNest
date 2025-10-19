import React from 'react';
import { motion } from 'framer-motion';

const AboutImage = () => (
    <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative h-[550px] rounded-2xl overflow-hidden shadow-2xl shadow-gray-400/50"
    >
        <img
            src="https://images.pexels.com/photos/3772517/pexels-photo-3772517.jpeg"
            alt="Fashion model"
            className="w-full h-full object-cover transform hover:scale-105 transition duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/10 flex items-end p-8">
            <p className="text-white text-xl font-bold backdrop-blur-sm p-2 rounded-lg">
                #PhốiĐồHoànHảo
            </p>
        </div>
    </motion.div>
);

export default AboutImage;