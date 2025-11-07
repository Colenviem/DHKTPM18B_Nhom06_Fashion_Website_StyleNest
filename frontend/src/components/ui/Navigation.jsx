import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiHome, FiShoppingBag, FiInfo, FiPhone, FiSettings } from 'react-icons/fi';

const navItemClasses =
  "relative cursor-pointer text-[16px] font-medium text-[#4B5563] hover:text-[#6F47EB] transition-all duration-300 font-[Manrope] " +
  "after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#6F47EB] after:left-1/2 after:bottom-[-6px] after:rounded-full " +
  "hover:after:w-full hover:after:left-0 after:transition-all after:duration-300";

// ✅ Thay link dropdown để truyền category_id qua query param
const fashionSubItems = [
  { id: 1, navItem: "Quần Áo", link: "/fashion?category=CAT001,CAT002" },
  { id: 2, navItem: "Giày Dép", link: "/fashion?category=CAT004" },
  { id: 3, navItem: "Phụ Kiện", link: "/fashion?category=CAT003" },
  { id: 4, navItem: "Sản Phẩm Mới", link: "/fashion?category=new" },
];

const navItems = [
  { id: 1, navItem: "Trang Chủ", link: "/", icon: <FiHome className="mr-2 text-[18px]" /> },
  { id: 2, navItem: "Thời Trang", link: "/fashion", dropdown: fashionSubItems, icon: <FiShoppingBag className="mr-2 text-[18px]" /> },
  { id: 3, navItem: "Giới Thiệu", link: "/about", icon: <FiInfo className="mr-2 text-[18px]" /> },
  { id: 4, navItem: "Liên Hệ", link: "/contact", icon: <FiPhone className="mr-2 text-[18px]" /> },
  { id: 5, navItem: "Dịch vụ", link: "/services", icon: <FiSettings className="mr-2 text-[18px]" /> },
];

const Navigation = () => {
  return (
    <nav className="hidden md:block font-[Manrope]">
      <ul className="flex space-x-8">
        {navItems.map((item) =>
          item.dropdown ? (
            <li key={item.id} className="relative group">
              <Link to={item.link} className={navItemClasses + " flex items-center"}>
                {item.icon}
                {item.navItem}
                <FiChevronDown className="ml-1 w-4 h-4 text-gray-500 group-hover:text-[#6F47EB] transition-transform duration-300 group-hover:rotate-180" />
              </Link>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible -translate-y-2
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-20">
                <ul className="py-2">
                  {item.dropdown.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        to={sub.link}
                        className="block px-4 py-2 text-[#4B5563] hover:text-[#6F47EB] hover:bg-gray-50 text-sm font-medium transition-colors duration-200"
                      >
                        {sub.navItem}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ) : (
            <li key={item.id}>
              <Link to={item.link} className={navItemClasses + " flex items-center"}>
                {item.icon}
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
