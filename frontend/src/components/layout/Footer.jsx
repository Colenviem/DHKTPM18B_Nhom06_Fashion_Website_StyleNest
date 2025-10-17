import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi"; 

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

    const socialIcons = [
        { name: "facebook", icon: FiFacebook },
        { name: "instagram", icon: FiInstagram },
        { name: "twitter", icon: FiTwitter },
        { name: "youtube", icon: FiYoutube },
    ];

    return (
        <footer className="bg-black border-t border-gray-800"> 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-gray-800"> 
                    <div className="flex flex-col">
                        <h2 className="text-4xl font-black mb-6 text-white tracking-wider">
                            FASCO
                        </h2>
                        <p className="mb-8 text-gray-500 text-base leading-relaxed">
                            Complete your style with awesome clothes from us.
                        </p>

                        <div className="flex space-x-4">
                            {socialIcons.map((item, i) => (
                                <Link
                                    key={i}
                                    to="#" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 border-2 border-white text-white rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg hover:shadow-white/20"
                                    aria-label={`Follow us on ${item.name}`}
                                >
                                    <item.icon className="text-xl" /> 
                                </Link>
                            ))}
                        </div>
                    </div>

                    {[
                        { title: "Company", links: companyLinks },
                        { title: "Quick Link", links: quickLinks },
                        { title: "Legal", links: legalLinks },
                    ].map((section, sectionIdx) => (
                        <div key={sectionIdx}>
                            <h3 className="text-xl font-bold mb-6 text-white tracking-wide border-l-4 border-white pl-3">
                                {section.title}
                            </h3>
                            <ul className="space-y-4"> 
                                {section.links.map((link, idx) => (
                                    <li key={idx}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-500 text-base hover:text-white transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-6 py-2 text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} FASCO. All rights reserved. | Crafted with passion.
                </div>
            </div>
        </footer>
    );
};

export default Footer;