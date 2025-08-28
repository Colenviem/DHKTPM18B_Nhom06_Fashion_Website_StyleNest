import { useState } from "react";
import { Link } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [language, setLanguage] = useState("vi");

    const navLinks = [
        { name: "Trang chủ", path: "/" },
        { name: "Sản phẩm", path: "/products" },
        { name: "Giới thiệu", path: "/about" },
        { name: "Liên hệ", path: "/contact" },
        { name: "Blog", path: "/blog" },
    ];

    return (
        <header className="w-full bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 space-y-2">
                {/* Top bar */}
                <div className="flex justify-between items-center py-2 text-gray-500 text-sm">
                    <div className="flex items-center gap-6">
                        {/* Thông báo */}
                        <div className="flex items-center gap-1 cursor-pointer hover:text-black transition">
                            <i className="bx bx-bell text-lg"></i>
                            <span>Thông báo</span>
                        </div>

                        {/* Hỗ trợ */}
                        <div className="flex items-center gap-1 cursor-pointer hover:text-black transition">
                            <i className="bx bx-help-circle text-lg"></i>
                            <span>Hỗ trợ</span>
                        </div>

                        {/* Ngôn ngữ */}
                        <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-1 hover:text-black transition"
                        >
                            <i className="bx bx-globe text-lg"></i>
                            <span>{language === "vi" ? "Tiếng Việt" : "English"}</span>
                            <i className="bx bx-chevron-down"></i>
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <ul className="py-1">
                                <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setLanguage("vi");
                                    setIsMenuOpen(false);
                                }}
                                >
                                    Tiếng Việt
                                </li>
                                <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setLanguage("en");
                                    setIsMenuOpen(false);
                                }}
                                >
                                    English
                                </li>
                            </ul>
                            </div>
                        )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Đăng nhập */}
                        <div className="flex items-center gap-1 cursor-pointer hover:text-black transition">
                            <i className="bx bx-user text-lg"></i>
                            <span>Đăng nhập</span>
                        </div>
                    </div>
                </div>

                {/* Main header */}
                <div className="flex items-center justify-between gap-20">
                    {/* Logo */}
                    <Link to="/" className="shrink-0">
                        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-800 hover:text-black transition-colors">
                            STYLENET
                        </h1>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w">
                        <div className="relative w-full">
                            <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full border border-gray-300 rounded-2xl py-2.5 pl-10 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-[#1f1f1f] text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-900 transition">
                                Tìm kiếm
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex justify-center space-x-8 text-gray-600 font-medium py-2">
                            {navLinks.map((link, idx) => (
                                <Link
                                key={idx}
                                to={link.path}
                                className="hover:text-black transition"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Cart */}
                    <div className="relative shrink-0">
                        <i className="bx bx-shopping-bag text-3xl text-gray-600 hover:text-black transition cursor-pointer"></i>
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            3
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;