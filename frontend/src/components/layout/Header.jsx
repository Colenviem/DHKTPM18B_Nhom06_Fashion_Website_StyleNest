import { useState } from "react";
import { Link } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Giới thiệu", to: "/" },
    {
      name: "Dịch vụ",
      to: "/",
      hasDropdown: true,
      dropdownItems: ["Dịch vụ 1", "Dịch vụ 2", "Dịch vụ 3"],
    },
    {
      name: "Biểu phí",
      to: "/",
      hasDropdown: true,
      dropdownItems: ["Biểu phí 1", "Biểu phí 2"],
    },
    {
      name: "Tin tức",
      to: "/",
      hasDropdown: true,
      dropdownItems: ["Tin mới", "Tin cũ"],
    },
    { name: "Hướng dẫn", to: "/" },
    { name: "Chính sách", to: "/" },
    { name: "Tuyển dụng", to: "/" },
    { name: "Liên hệ", to: "/" },
  ];

  return (
    <header className="bg-white text-[#484848] w-full border-b border-gray-200 shadow-sm">
      {/* Top bar */}
      <div className="bg-[#d64d3c] px-2 sm:px-4 py-1.5 sm:py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs sm:text-sm">
          {/* Left */}
          <div className="flex items-center gap-1 sm:gap-2">
            <i className="bx bx-phone text-white text-[16px]"></i>
            <span className="text-white text-[14px] sm:text-sm">
              <span className="hidden xs:inline">Hotline 24/7: </span>
              <span className="font-medium">0965.54.54.64</span>
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <div className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:text-white/90 transition-colors">
              <i className="bx bx-envelope text-white text-[16px]"></i>
              <span className="text-white text-[14px] sm:text-sm">
                <span className="hidden sm:inline">cskh@</span>
                <span className="sm:hidden">@</span>gianghuy.com
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:text-white/90 transition-colors">
              <i className="bx bx-user text-white text-[16px]"></i>
              <span className="text-white text-[14px] sm:text-sm">
                <span className="hidden sm:inline">Đăng nhập / Đăng ký</span>
                <span className="sm:hidden">Đăng nhập</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 py-3">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-[#d64d3c]">
          STYLENET
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative group"
              // bỏ onMouseEnter/onMouseLeave, dùng group-hover thay
            >
              <Link
                to={item.to}
                className="flex items-center gap-1 py-2 text-[#484848] hover:text-[#d64d3c] transition-colors relative"
              >
                <span className="relative whitespace-nowrap">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#FF682B]"></span>
                </span>
                {item.hasDropdown && <i className="bx bx-chevron-down"></i>}
              </Link>

              {/* Dropdown menu */}
              {item.hasDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 bg-white text-[#484848] border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50 
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                >
                  {item.dropdownItems?.map((dropdownItem) => (
                    <a
                      key={dropdownItem}
                      href="/"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      {dropdownItem}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 pr-9 lg:px-4 lg:py-2 lg:pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d64d3c]/40 focus:bg-white transition-all duration-200 w-32 lg:w-48 xl:w-56 text-sm"
            />
            <i className="bx bx-search absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`bx ${isMobileMenuOpen ? "bx-x" : "bx-menu"}`}></i>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          {navItems.map((item) => (
            <div key={item.name} className="border-b border-gray-100">
              <Link
                to={item.to}
                className="block px-4 py-2 hover:bg-gray-50 text-gray-800"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;