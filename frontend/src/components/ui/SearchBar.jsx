import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ isSearchOpen, toggleSearch }) => {
    return (
        <div
            className={`fixed top-[80px] left-1/2 -translate-x-1/2 
            w-[90%] sm:w-[500px] lg:w-[650px]
            bg-white border border-gray-200 shadow-xl rounded-2xl
            px-4 sm:px-6 py-3 flex items-center gap-3 z-[90]
            transition-all duration-500 ease-out
            ${isSearchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'}`}
        >
            <FiSearch className="text-[20px] text-gray-500 flex-shrink-0" />

            <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu, danh mục..."
                className="flex-grow bg-transparent text-gray-800 text-[15px] sm:text-[16px] placeholder-gray-400 focus:outline-none"
                autoFocus={isSearchOpen}
            />

            <button
                className="hidden sm:block px-4 py-2 text-sm font-medium bg-[#6F47EB] text-white rounded-xl hover:bg-[#5a36cc] transition-all duration-300"
            >
                Tìm kiếm
            </button>

            <FiX
                className="text-2xl text-gray-500 cursor-pointer hover:text-black transition-colors"
                onClick={toggleSearch}
            />
        </div>
    );
};

export default SearchBar;