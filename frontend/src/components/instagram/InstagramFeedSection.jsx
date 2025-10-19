import React from "react";
import { FiInstagram } from "react-icons/fi";
import { Link } from "react-router-dom"; 

const InstagramFeedSection = () => {
    const instagramPosts = [
        "https://res.cloudinary.com/dixzxzdrd/image/upload/v1760695801/download_riehwg.jpg",
        "https://res.cloudinary.com/dixzxzdrd/image/upload/v1760695801/download_riehwg.jpg",
        "https://res.cloudinary.com/dixzxzdrd/image/upload/v1760695801/download_riehwg.jpg",
        "https://res.cloudinary.com/dixzxzdrd/image/upload/v1760695801/download_riehwg.jpg",
        "https://res.cloudinary.com/dixzxzdrd/image/upload/v1760695801/download_riehwg.jpg"
    ]

    return (
        <div className="bg-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 pb-8 border-b border-gray-200">
                    <h2 className="text-6xl font-black text-black mb-4 tracking-tight">
                        <span className="block text-lg font-medium text-gray-500 uppercase tracking-widest mb-1">
                            #FashionInLight
                        </span>
                        Theo dõi chúng tôi trên Instagram
                    </h2>
                    <p className="text-gray-700 max-w-3xl mx-auto text-pretty text-lg leading-relaxed">
                        Hãy theo dõi chúng tôi để cập nhật những bộ sưu tập mới nhất, tin tức thời trang và những ưu đãi độc quyền!
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10">
                    {instagramPosts.map((post, index) => (
                        <div
                        key={index}
                        className="relative aspect-square group overflow-hidden rounded-xl shadow-lg shadow-gray-300/50 hover:shadow-gray-400 transition-all duration-700"
                        >
                        <img
                            src={post}
                            alt={`Instagram post ${index + 1}`}
                            className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-[2deg] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                            <Link 
                                to="#"
                                className="bg-black/80 backdrop-blur-sm p-4 rounded-full border border-white/30 hover:scale-110 transition-transform duration-300"
                                aria-label="View on Instagram"
                            >
                                <FiInstagram className="text-white text-xl" />
                            </Link>
                        </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <button className="bg-transparent border-2 border-black text-black font-bold hover:bg-black hover:text-white px-12 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md shadow-black/20 flex items-center justify-center gap-3 mx-auto text-lg">
                        <FiInstagram className="text-2xl" />
                        @FashionBrandName
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstagramFeedSection;