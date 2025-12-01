import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";

const Footer = () => {
  const companyLinks = [
    { name: "Về chúng tôi", path: "/about" },
    { name: "Liên hệ", path: "/contact" },
    { name: "Hỗ trợ", path: "/contact" },
    { name: "Tuyển dụng", path: "/contact" },
  ];

  const quickLinks = [
    { name: "Chia sẻ vị trí", path: "/contact" },
    { name: "Theo dõi đơn hàng", path: "/profile" },
    { name: "Hướng dẫn chọn size", path: "/size" },
    { name: "Câu hỏi thường gặp", path: "/faqs" },
  ];

  const legalLinks = [
    { name: "Điều khoản & điều kiện", path: "/services" },
    { name: "Chính sách bảo mật", path: "/privacy" },
  ];

    const socialIcons = [
        { name: "facebook", icon: FiFacebook, url: "https://www.facebook.com/stylenest.hairsalon/" },
        { name: "instagram", icon: FiInstagram, url: "https://www.instagram.com/style.nestt7/" },
        { name: "twitter", icon: FiTwitter, url: "https://www.instagram.com/style.nestt7/" },
        { name: "youtube", icon: FiYoutube, url: "https://www.youtube.com/@stylenest3036/videos" },
    ];

    return (
    <footer className="bg-[#0B0B0F] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6">
        {/* Grid chính */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
          {/* Logo + Mạng xã hội */}
          <div className="flex flex-col">
            <h2 className="text-4xl font-black mb-6 text-white tracking-wider">
              StyleNest
            </h2>
            <p className="mb-8 text-gray-400 text-base leading-relaxed">
              Hoàn thiện phong cách của bạn với những bộ trang phục tuyệt vời từ chúng tôi.
            </p>

              <div className="flex space-x-4">
                  {socialIcons.map((item, i) => (
                      <a
                          key={i}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 border-2 border-[#6F47EB] text-[#6F47EB] rounded-full flex items-center justify-center
        transition-all duration-300 hover:bg-[#6F47EB] hover:text-white hover:scale-105 shadow-sm shadow-[#6F47EB]/30"
                          aria-label={`Theo dõi chúng tôi trên ${item.name}`}
                      >
                          <item.icon className="text-xl" />
                      </a>
                  ))}
              </div>
          </div>

          {/* Các cột liên kết */}
          {[
            { title: "Công ty", links: companyLinks },
            { title: "Liên kết nhanh", links: quickLinks },
            { title: "Pháp lý", links: legalLinks },
          ].map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="text-xl font-bold mb-6 text-white tracking-wide border-l-4 border-[#6F47EB] pl-3">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="text-gray-400 text-base hover:text-[#6F47EB] transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Phần bản quyền */}
        <div className="mt-6 py-3 text-center text-sm text-gray-500 border-t border-gray-800">
          © {new Date().getFullYear()}{" "}
          <span className="font-bold text-[#6F47EB]">STYLENEST</span>. Mọi quyền được bảo lưu. |
          Thiết kế với ❤️ và đam mê.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
