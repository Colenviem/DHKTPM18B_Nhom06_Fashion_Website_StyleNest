import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../ui/Navigation";
import AuthIcons from "../ui/AuthIcons";
import SearchBar from "../ui/SearchBar";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <header className="bg-white text-black shadow-md fixed w-full top-0 left-0 z-[100] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <img src="/imgs/plant-icon.png" alt="Logo" className="w-10 h-10 transition-transform duration-500 group-hover:rotate-6" />
              <h1 className="text-3xl font-extrabold tracking-wide group-hover:text-gray-700 transition-colors duration-300">
                Planto.
              </h1>
          </Link>

          <Navigation />

          <AuthIcons toggleSearch={toggleSearch} />

        </div>
      </header>
      
      <SearchBar isSearchOpen={isSearchOpen} toggleSearch={toggleSearch} />
    </>
  );
};

export default Header;