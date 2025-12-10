// src/components/ui/AuthIcons.jsx

import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext.jsx";
import {
    FiSearch,
    FiShoppingBag,
    FiMenu,
    FiUser,
    FiLogOut,
    FiChevronDown,
} from "react-icons/fi";

const AuthIcons = ({ toggleSearch }) => {
    // --- Lấy giỏ hàng từ context ---
    const { cartItems } = useContext(CartContext);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // --- Quản lý đăng nhập ---
    const [authUser, setAuthUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = () => {
            const userString = localStorage.getItem("user");
            if (userString) {
                try {
                    setAuthUser(JSON.parse(userString));
                } catch (e) {
                    console.error("Failed to parse user from localStorage", e);
                    localStorage.clear();
                }
            } else {
                setAuthUser(null);
            }
        };

        loadUser();

        // ✅ Lắng nghe event
        window.addEventListener("auth-change", loadUser);

        return () => {
            window.removeEventListener("auth-change", loadUser);
        };
    }, []);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
         if (confirmLogout) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // 🔥 Notify component khác
        window.dispatchEvent(new Event("auth-change"));

        setAuthUser(null);
        navigate("/login");
         }
    };

    // --- Các class CSS ---
    const dropdownClasses =
        "absolute top-full right-0 mt-4 w-52 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible -translate-y-2 " +
        "group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-20";

    const dropdownItemClasses =
        "flex items-center w-full px-4 py-2 text-[#4B5563] hover:text-[#6F47EB] hover:bg-gray-50 text-sm font-medium transition-colors duration-200";

    const authButtonClasses =
        "text-[15px] font-medium py-2 px-3 rounded-full text-[#4B5563] hover:text-[#6F47EB] transition-all duration-300 flex items-center";

    // --- JSX chính ---
    return (
        <div className="flex items-center space-x-6 text-2xl font-[Manrope]">
            {/* Nút tìm kiếm */}
            <FiSearch
                className="cursor-pointer text-[#4B5563] hover:text-[#6F47EB] transition-all duration-300"
                onClick={toggleSearch}
            />

            {/* Giỏ hàng */}
            <div className="relative group">
                <Link to="/cart" className="flex items-center">
                    <FiShoppingBag className="cursor-pointer text-[#4B5563] transition-all duration-300 group-hover:text-[#6F47EB]" />
                    {totalQuantity > 0 && (
                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#4B5563] text-white text-[10px] font-bold flex items-center justify-center transition-colors duration-300 group-hover:bg-[#6F47EB]">
              {totalQuantity}
            </span>
                    )}
                </Link>
            </div>

            {/* Đăng nhập / Hồ sơ */}
            <div className="hidden lg:flex items-center space-x-3 ml-4">
                {authUser ? (
                    <div className="relative group">
                        <button className={authButtonClasses}>
                            <FiUser className="mr-2" />
                            {authUser.firstName + " " + authUser.lastName}
                            <FiChevronDown className="ml-1 w-4 h-4" />
                        </button>

                        <div className={dropdownClasses}>
                            <ul className="py-2">
                                <li>
                                    <Link to="/profile" className={dropdownItemClasses}>
                                        <FiUser className="mr-2" />
                                        Hồ sơ của tôi
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className={dropdownItemClasses + " w-full"}
                                    >
                                        <FiLogOut className="mr-2" />
                                        Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-[15px] font-medium py-2 px-3 rounded-full text-[#4B5563] hover:text-[#6F47EB] transition-all duration-300"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to="/register"
                            className="text-[15px] font-semibold py-2.5 px-6 rounded-full bg-[#6F47EB] text-white shadow-sm transition-all duration-300 hover:bg-[#4F46E5] hover:shadow-lg hover:scale-[1.03]"
                        >
                            Đăng ký
                        </Link>
                    </>
                )}
            </div>

            {/* Menu mobile */}
            <FiMenu className="md:hidden cursor-pointer text-[#4B5563] hover:text-[#6F47EB] transition-all duration-300" />
        </div>
    );
};

export default AuthIcons;
