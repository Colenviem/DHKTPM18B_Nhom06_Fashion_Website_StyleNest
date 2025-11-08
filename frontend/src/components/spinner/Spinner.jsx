import React from 'react';
import { FiLoader } from "react-icons/fi";

const Spinner = ({ size, content }) => {
    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen flex items-center justify-center">
            <FiLoader className={`w-${size} h-${size} text-indigo-500 animate-spin mr-3`} />
            <span className="text-lg font-medium text-indigo-600">
                {content}
            </span>
        </div>
    )
}

export default Spinner;
