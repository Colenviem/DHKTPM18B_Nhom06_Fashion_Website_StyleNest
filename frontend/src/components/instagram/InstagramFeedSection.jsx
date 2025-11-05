import React from "react";
import { FiInstagram, FiFacebook, FiYoutube, FiTwitter } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";
import { Link } from "react-router-dom";

const InstagramFeedSection = () => {
    const instagramPosts = [
        { url: "https://res.cloudinary.com/ddga6y6tm/image/upload/v1761896144/facebook_ngngzx.png", icon: <FiFacebook />, link: "https://facebook.com" },
        { url: "https://res.cloudinary.com/ddga6y6tm/image/upload/v1761896143/unnamed_piu5yn.png", icon: <FiYoutube />, link: "https://youtube.com" },
        { url: "https://res.cloudinary.com/dixzxzdrd/image/upload/v1760695801/download_riehwg.jpg", icon: <FiInstagram />, link: "https://instagram.com" },
        { url: "https://res.cloudinary.com/ddga6y6tm/image/upload/v1761896143/71688f4905ece2a5ee744eaf351ec21bd51491e02025ea4a68501cc93d847e5c_200_jjjp4k.webp", icon: <FiTwitter />, link: "https://twitter.com" },
        { url: "https://res.cloudinary.com/ddga6y6tm/image/upload/v1761896143/unnamed_1_w1kjnn.png", icon: <SiTiktok />, link: "https://tiktok.com" }
    ];
    return (
        <div className="bg-white py-24 font-[Manrope]"> 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 pb-8 border-b border-gray-200">
                    <h2 className="text-5xl md:text-6xl font-black text-black mb-4 tracking-tight">
                        <span className="block text-lg font-semibold text-[#6F47EB] uppercase tracking-widest mb-2">
                            @StyleNest
                        </span>
                        Theo dõi chúng tôi trên các nền tảng
                    </h2>
                    <p className="text-[#4B5563] max-w-2xl mx-auto text-lg leading-relaxed">
                        Hãy theo dõi chúng tôi để cập nhật những bộ sưu tập mới nhất, tin tức thời trang và những ưu đãi độc quyền!
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
                    {instagramPosts.map((post, index) => (
                        <div
                            key={index}
                            className="relative aspect-square group overflow-hidden rounded-xl shadow-md shadow-gray-200 hover:shadow-[#6F47EB]/30 transition-all duration-700 cursor-pointer"
                        >
                            <img
                                src={post.url}
                                alt={`Post ${index + 1}`}
                                className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-[2deg] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#6F47EB]/60 via-[#6F47EB]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Icon riêng */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                <a
                                    href={post.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#6F47EB]/90 backdrop-blur-sm p-4 rounded-full border border-white/40 hover:scale-110 transition-transform duration-300 cursor-pointer"
                                    aria-label={`View post ${index + 1}`}
                                >
                                    {post.icon}  {/* Hiển thị icon tương ứng từng ảnh */}
                                </a>
                            </div>
                        </div>
                    ))}

                </div>

                <div className="text-center mt-16">
                    <button className="bg-[#6F47EB] text-white font-semibold hover:bg-indigo-700 px-10 sm:px-12 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md shadow-[#6F47EB]/30 flex items-center justify-center gap-3 mx-auto text-lg cursor-pointer">
                        <FiInstagram className="text-2xl" />
                        <span className="text-white">@StyleNest</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstagramFeedSection;