import React from 'react';
import { FiSearch, FiShoppingBag, FiMenu } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AuthIcons = ({ toggleSearch }) => {
    return (
        <div className="flex items-center space-x-6 text-2xl">
            <FiSearch 
                className="cursor-pointer text-gray-700 hover:text-black transition-all duration-300" 
                onClick={toggleSearch} 
            />
            
            <div className="relative">
                <Link to="/cart">
                    <FiShoppingBag className="cursor-pointer text-gray-700 hover:text-black transition-all duration-300" />
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center">
                        3
                    </span>
                </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-3 ml-4">
                <Link to="/login" className="text-[15px] font-medium py-2 px-3 rounded-full hover:text-black transition-all">
                    Đăng nhập
                </Link>
                <Link
                    to="/register"
                    className="text-[15px] font-semibold py-2.5 px-6 rounded-full bg-black text-white shadow-sm transition-all duration-300 hover:bg-gray-900 hover:shadow-lg hover:scale-[1.03]"
                >
                    Đăng ký
                </Link>
            </div>

            <FiMenu className="md:hidden cursor-pointer text-gray-700 hover:text-black transition-all duration-300" />
        </div>
    );
};

export default AuthIcons;