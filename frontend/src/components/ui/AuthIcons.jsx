import React from 'react';
import { FiSearch, FiShoppingBag, FiMenu } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AuthIcons = ({ toggleSearch }) => {
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

            <div className="hidden lg:flex items-center space-x-3 ml-4">
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
            </div>

            <FiMenu className="md:hidden cursor-pointer text-[#4B5563] hover:text-[#6F47EB] transition-all duration-300" />
        </div>
    );
};

export default AuthIcons;