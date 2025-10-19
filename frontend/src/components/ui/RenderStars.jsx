import React from 'react';
import { FiStar } from "react-icons/fi";

const RenderStars = ({ rating }) => {
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <FiStar
                key={i}
                className={`w-5 h-5 ${
                    i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                }`}
                />
            ))}
        </div>
    );
}

export default RenderStars
