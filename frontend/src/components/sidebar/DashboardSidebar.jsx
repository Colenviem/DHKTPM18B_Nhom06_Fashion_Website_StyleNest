import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    FiHome, FiBox, FiClipboard, FiTag, FiGift,
    FiLock, FiUser, FiAward, FiSettings,
    FiBarChart2, FiLogOut, FiChevronDown, FiChevronRight, FiRotateCcw, FiList
} from 'react-icons/fi';

const menuStructure = [
    {
        group: null,
        items: [
            { label: "Bảng điều khiển", icon: <FiHome />, path: "/admin/dashboard" },
            { label: "Sản phẩm", icon: <FiBox />, path: "/admin/products" },
            {
                label: "Hóa đơn",
                icon: <FiClipboard />,
                path: "/admin/orders",
                subItems: [
                    { label: "Danh sách đơn hàng", icon: <FiList />, path: "/admin/orders" },
                    { label: "Yêu cầu trả hàng", icon: <FiRotateCcw />, path: "/admin/ordersReturns" }
                ]
            },
            { label: "Danh mục", icon: <FiTag />, path: "/admin/categories" },
            { label: "Ưu đãi", icon: <FiGift />, path: "/admin/coupons" },
            { label: "Tài khoản", icon: <FiLock />, path: "/admin/accounts" },
            { label: "Người dùng", icon: <FiUser />, path: "/admin/users" },
            { label: "Thương hiệu", icon: <FiAward />, path: "/admin/brands" },
        ],
    },
];

const SidebarItem = ({ item }) => {
    const location = useLocation();

    const isActiveParent = item.subItems
        ? item.subItems.some(sub => location.pathname === sub.path)
        : location.pathname === item.path;

    const [isOpen, setIsOpen] = useState(isActiveParent);

    const toggleOpen = () => setIsOpen(!isOpen);

    if (!item.subItems) {
        return (
            <NavLink
                to={item.path}
                className={({ isActive }) => `
                    flex items-center gap-3 p-3 rounded-lg text-sm transition-all duration-200
                    ${isActive
                    ? "bg-indigo-600 text-white font-semibold shadow-md"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                }
                `}
            >
                {item.icon}
                {item.label}
            </NavLink>
        );
    }

    return (
        <div className="flex flex-col">
            <button
                onClick={toggleOpen}
                className={`
                    flex items-center justify-between w-full p-3 rounded-lg text-sm transition-all duration-200
                    ${isActiveParent
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                }
                `}
            >
                <div className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                </div>
                {isOpen ? <FiChevronDown /> : <FiChevronRight />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4"
                    >
                        <div className="border-l-2 border-indigo-100 pl-2 mt-1 space-y-1">
                            {item.subItems.map((sub, idx) => (
                                <NavLink
                                    key={idx}
                                    to={sub.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-2 p-2 rounded-lg text-sm transition-all duration-200
                                        ${isActive
                                        ? "text-indigo-600 bg-indigo-50 font-semibold"
                                        : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                                    }
                                    `}
                                >
                                    {sub.icon}
                                    {sub.label}
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DashboardSidebar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <motion.aside
            className="w-64 bg-white flex flex-col border-r border-gray-200 shadow-sm max-h-screen sticky top-0 font-[Manrope]"
            initial={{ x: -64 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="p-6 text-2xl font-bold text-indigo-700 flex items-center gap-2 border-b border-gray-200">
                <FiBarChart2 /> DashStack
            </div>

            <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
                {menuStructure.map((group, idx) => (
                    <div key={idx} className="space-y-1 mb-4">
                        {group.group && (
                            <h4 className="text-xs uppercase text-gray-400 font-bold px-3 pt-4 pb-1 tracking-wider">
                                {group.group}
                            </h4>
                        )}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                        >
                            {group.items.map((item, i) => (
                                <SidebarItem key={i} item={item} />
                            ))}
                        </motion.div>
                    </div>
                ))}
            </nav>

            <div className="mt-auto p-4 border-t border-gray-200 space-y-1">
                <NavLink
                    to="/admin/settings"
                    className="flex items-center gap-3 p-3 rounded-lg text-sm hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 font-medium transition duration-200"
                >
                    <FiSettings className='text-indigo-400' /> Cài đặt
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-sm hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 font-medium transition duration-200"
                >
                    <FiLogOut className='text-indigo-400' /> Đăng xuất
                </button>
            </div>
        </motion.aside>
    );
}

export default DashboardSidebar;