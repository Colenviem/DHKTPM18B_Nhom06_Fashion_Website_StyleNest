import React from "react";
import { motion } from "framer-motion";

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FormField = ({
                       label,
                       type = "text",
                       name,
                       value,
                       onChange,
                       isTextArea = false,
                       readOnly = false,
                   }) => (
    <motion.div variants={itemVariants} className="relative mb-6">
        {isTextArea ? (
            <textarea
                id={name}
                name={name}
                rows="4"
                className={`peer w-full py-3 outline-none bg-transparent ${
                    readOnly
                        ? 'border-b-0 cursor-not-allowed bg-gray-100 text-gray-700' 
                        : 'border-b-2 border-gray-300 focus:border-black'
                } resize-none`}

                placeholder=" "
                required
                value={value}
                onChange={onChange}
                readOnly={readOnly}
            />
        ) : (
            <input
                id={name}
                type={type}
                name={name}
                className={`peer w-full py-3 outline-none bg-transparent ${
                    readOnly
                        ? 'border-b-0 cursor-not-allowed bg-gray-100 text-gray-700' 
                        : 'border-b-2 border-gray-300 focus:border-black' 
                }`}

                placeholder=" "
                required
                value={value}
                onChange={onChange}
                readOnly={readOnly}
            />
        )}
        <label
            htmlFor={name}
            className={`absolute left-0 text-sm transition-all ${
                readOnly
                    ? '-top-4 text-gray-600' 
                    : 'peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-black'
            } ${readOnly ? 'text-gray-600' : 'text-black'}`}
        >
            {label}
        </label>
    </motion.div>
);

export default FormField;