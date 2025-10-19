import React from "react";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FormField = ({ label, type = "text", name, isTextArea = false }) => (
  <motion.div variants={itemVariants} className="relative mb-6">
    {isTextArea ? (
      <textarea id={name} name={name} rows="4" className="peer w-full border-b-2 border-gray-300 focus:border-black bg-transparent py-3 outline-none" placeholder=" " required />
    ) : (
      <input id={name} type={type} name={name} className="peer w-full border-b-2 border-gray-300 focus:border-black bg-transparent py-3 outline-none" placeholder=" " required />
    )}
    <label htmlFor={name} className="absolute left-0 top-3 text-gray-500 transition-all peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-black">
      {label}
    </label>
  </motion.div>
);

export default FormField;