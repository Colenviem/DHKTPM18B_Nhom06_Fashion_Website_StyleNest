import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FiHome, FiBox, FiClipboard, FiTag, FiGift,
    FiLock, FiUser, FiAward, FiSettings, FiDollarSign,
    FiList, FiBookOpen, FiBarChart2, FiLogOut
} from 'react-icons/fi';

const menuStructure = [
    {
        group: null,
        items: [
            { label: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },
            { label: "Products", icon: <FiBox />, path: "/admin/products" },
            { label: "Orders", icon: <FiClipboard />, path: "/admin/orders" },
            { label: "Categories", icon: <FiTag />, path: "/admin/categories" },
            { label: "Coupons", icon: <FiGift />, path: "/admin/coupons" },
            { label: "Accounts", icon: <FiLock />, path: "/admin/accounts" },
            { label: "Users", icon: <FiUser />, path: "/admin/users" },
            { label: "Brands", icon: <FiAward />, path: "/admin/brands" },
        ],
    },
];

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

const SidebarItem = ({ item }) => (
    <motion.div variants={itemVariants}>
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
    </motion.div>
);

const DashboardSidebar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <motion.aside
            className="w-64 bg-white flex flex-col border-r border-gray-200 shadow-sm max-h-screen sticky top-0"
            initial={{ x: -64 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="p-6 text-2xl font-bold text-indigo-700 flex items-center gap-2 border-b border-gray-200">
                <FiBarChart2 /> DashStack
            </div>

            <nav className="flex-1 px-4 py-4 overflow-y-auto">
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
                    <FiSettings className='text-indigo-400' /> Settings
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-sm hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 font-medium transition duration-200"
                >
                    <FiLogOut className='text-indigo-400' /> Logout
                </button>
            </div>
        </motion.aside>
    );
}

export default DashboardSidebar;