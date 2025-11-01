// src/components/ui/AuthIcons.jsx (Đã cập nhật)

import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingBag, FiMenu, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

// Các lớp CSS cho dropdown (lấy từ Navigation)
const dropdownClasses =
    "absolute top-full right-0 mt-4 w-52 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible -translate-y-2 " +
    "group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-20";

const dropdownItemClasses =
    "flex items-center w-full px-4 py-2 text-[#4B5563] hover:text-[#6F47EB] hover:bg-gray-50 text-sm font-medium transition-colors duration-200";

// Lớp CSS cho nút (giống nút Đăng nhập)
const authButtonClasses =
    "text-[15px] font-medium py-2 px-3 rounded-full text-[#4B5563] hover:text-[#6F47EB] transition-all duration-300 flex items-center";


const AuthIcons = ({ toggleSearch }) => {
    // 1. Thêm state và hooks cần thiết
    const [authUser, setAuthUser] = useState(null);
    const navigate = useNavigate();

    // 2. Kiểm tra localStorage khi component tải
    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString) {
            try {
                setAuthUser(JSON.parse(userString));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.clear(); // Xóa localStorage nếu dữ liệu hỏng
            }
        }
    }, []); // Chỉ chạy 1 lần

    // 3. Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setAuthUser(null); // Cập nhật UI
        navigate("/login"); // Về trang đăng nhập
    };


    return (
        <div className="flex items-center space-x-6 text-2xl font-[Manrope]">
            <FiSearch
                className="cursor-pointer text-[#4B5563] hover:text-[#6F47EB] transition-all duration-300"
                onClick={toggleSearch}
            />

            <div className="relative group">
                <Link to="/cart" className="flex items-center">
                    <FiShoppingBag
                        className="cursor-pointer text-[#4B5563] transition-all duration-300 group-hover:text-[#6F47EB]"
                    />
                    <span
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#4B5563] text-white text-[10px] font-bold flex items-center justify-center transition-colors duration-300 group-hover:bg-[#6F47EB]"
                    >
                        3
                    </span>
                </Link>
            </div>

            {/* ===== 4. LOGIC HIỂN THỊ ĐĂNG NHẬP / PROFILE ===== */}
            <div className="hidden lg:flex items-center space-x-3 ml-4">
                {authUser ? (
                    // --- NẾU ĐÃ ĐĂNG NHẬP ---
                    <div className="relative group">
                        <button className={authButtonClasses}>
                            <FiUser className="mr-2" />
                            {authUser.userName}
                            <FiChevronDown className="ml-1 w-4 h-4" />
                        </button>

                        {/* Dropdown Profile */}
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
                    // --- NẾU CHƯA ĐĂNG NHẬP ---
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

            <FiMenu className="md:hidden cursor-pointer text-[#4B5563] hover:text-[#6F47EB] transition-all duration-300" />
        </div>
    );
};

export default AuthIcons;