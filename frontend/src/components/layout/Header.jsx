import React from "react";
import { FiSearch, FiShoppingBag, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

const Header = () => {
  const hoverClasses =
    "hover:text-black hover:scale-[1.03] transition-all duration-300";
  const iconHoverClasses =
    "hover:text-black hover:scale-110 transition-transform duration-300";
  
  const navItemHoverClasses =
    "relative font-medium cursor-pointer transition-colors duration-300 text-gray-700 " +
    "hover:text-black " +
    "after:content-[''] after:absolute after:w-0 after:h-[3px] after:bg-black after:left-1/2 after:bottom-[-8px] after:rounded-full " +
    "hover:after:w-full hover:after:left-0 after:transition-all after:duration-300 after:ease-out";

  return (
    <header className="bg-white text-black shadow-lg shadow-gray-200/50 fixed w-full top-0 left-0 z-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        <Link to="/" className="flex items-center space-x-2 cursor-pointer group">
          <img
            src="/imgs/plant-icon.png"
            alt="Planto logo"
            className="w-10 h-10 object-contain transition-transform duration-500 group-hover:rotate-6" 
          />
          <h1 className="text-3xl font-black tracking-wider text-black transition-colors duration-300 group-hover:text-gray-800">
            Planto.
          </h1>{" "}
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-8 text-[17px]">
            {["Home", "Plants Type", "More", "Contact"].map((item) => (
              <li key={item} className={navItemHoverClasses}>
                {item}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center space-x-6 text-2xl">
          
          <FiSearch className={"cursor-pointer text-gray-700 " + iconHoverClasses} />
          
          <div className="relative">
            <FiShoppingBag className={"cursor-pointer text-gray-700 " + iconHoverClasses} />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-black text-[11px] font-bold text-white leading-none ring-1 ring-gray-200">
              3
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-3 ml-4">
            
            <Link
              to="/login"
              className={"text-[15px] font-semibold cursor-pointer py-2 px-3 rounded-full text-gray-700 transition-colors " + hoverClasses}
            >
              Đăng nhập
            </Link>
            
            <Link
              to="/register"
              className={
                "cursor-pointer text-[15px] font-bold py-2.5 px-6 rounded-full bg-black text-white shadow-md shadow-gray-700/30 " +
                "transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-800/40 transform hover:scale-[1.05]"
              }
            >
              Đăng ký
            </Link>
          </div>

          <FiMenu className={"md:hidden cursor-pointer text-gray-700 " + iconHoverClasses} />
        </div>
      </div>
    </header>
  );
};

export default Header;