import React from "react";
import { motion } from "framer-motion";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const MapSection = () => {
    return (
        <motion.div
            variants={itemVariants}
            className="mt-20 h-150 bg-gray-200 rounded-2xl overflow-hidden shadow-xl border border-gray-300"
        >
            <iframe
                src="https://maps.google.com/maps?q=123%20Queen%20Street%20West,%20Toronto,%20ON,%20Canada&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Vị trí văn phòng Toronto"
            ></iframe>
        </motion.div>
    );
};

export default MapSection;