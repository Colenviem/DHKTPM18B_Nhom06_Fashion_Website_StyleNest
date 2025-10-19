import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';

const navItemClasses =
    "relative cursor-pointer text-[16px] font-medium text-gray-700 hover:text-black transition-all duration-300 " +
    "after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-black after:left-1/2 after:bottom-[-6px] after:rounded-full " +
    "hover:after:w-full hover:after:left-0 after:transition-all after:duration-300";

const fashionSubItems = [
    { id: 1, navItem: "Quần Áo", link: "/fashion/men's-clothing" },
    { id: 2, navItem: "Giày Dép", link: "/fashion/women's-clothing" },
    { id: 3, navItem: "Phụ Kiện", link: "/fashion/accessory" },
    { id: 4, navItem: "Sản Phẩm Mới", link: "/fashion/new" },
];

const navItems = [
    { id: 1, navItem: "Trang Chủ", link: "/" },
    { id: 2, navItem: "Thời Trang", link: "/fashion", dropdown: fashionSubItems },
    { id: 3, navItem: "Giới Thiệu", link: "/about" },
    { id: 4, navItem: "Liên Hệ", link: "/contact" },
    { id: 5, navItem: "Dịch vụ", link: "/services" },
];

const Navigation = () => {
    return (
        <nav className="hidden md:block">
            <ul className="flex space-x-8">
                {navItems.map((item) =>
                item.dropdown ? (
                    <li key={item.id} className="relative group">
                        <Link to={item.link} className={navItemClasses + " flex items-center"}>
                            {item.navItem}
                            <FiChevronDown className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                        </Link>

                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible -translate-y-2
                                            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-20">
                            <ul className="py-2">
                                {item.dropdown.map((sub) => (
                                    <li key={sub.id}>
                                        <Link to={sub.link} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black text-sm font-medium">
                                            {sub.navItem}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ) : (
                    <li key={item.id}>
                        <Link to={item.link} className={navItemClasses}>
                            {item.navItem}
                        </Link>
                    </li>
                )
                )}
            </ul>
        </nav>
    );
};

export default Navigation;