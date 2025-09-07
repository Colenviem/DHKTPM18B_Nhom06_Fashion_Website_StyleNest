import React from "react";
import { Link } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

const Footer = () => {
    const companyLinks = [
        { name: "About", path: "/about" },
        { name: "Contact us", path: "/contact" },
        { name: "Support", path: "/support" },
        { name: "Careers", path: "/careers" },
    ];

    const quickLinks = [
        { name: "Share Location", path: "/location" },
        { name: "Orders Tracking", path: "/orders" },
        { name: "Size Guide", path: "/size-guide" },
        { name: "FAQs", path: "/faqs" },
    ];

    const legalLinks = [
        { name: "Terms & conditions", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
    ];

    const icons = ["facebook", "instagram", "twitter", "youtube"];

    return (
        <footer className="bg-[#1f1f1f] pt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand Section */}
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold mb-4 text-white">FASCO</h2>
                        <p className="mb-6 text-[#8A8A8A] text-sm leading-relaxed">
                            Complete your style with awesome clothes from us.
                        </p>

                        {/* Social Icons */}
                        <div className="flex space-x-3">
                            {icons.map((icon, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md hover:bg-grtext-gray-200 transition-colors"
                                >
                                    <i className={`bx bxl-${icon} text-[22px] text-black`}></i>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
                        <ul className="space-y-3">
                            {companyLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.path}
                                        className="text-[#8A8A8A] text-sm hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Quick Link</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.path}
                                        className="text-[#8A8A8A] text-sm hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
                        <ul className="space-y-3">
                            {legalLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.path}
                                        className="text-[#8A8A8A] text-sm hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider + Bottom Text */}
                <div className="border-t border-gray-100 mt-10 py-6 text-center text-xs text-[#8A8A8A]">
                    © 2025 FASCO. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;