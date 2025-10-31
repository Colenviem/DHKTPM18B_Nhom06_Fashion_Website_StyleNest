import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'; // Thêm icons cho tìm kiếm và hành động

// Dữ liệu Categories (Giữ nguyên)
const categoriesData = [
  { 
    _id: "CAT001",
    name: "Áo Nam",
    description: "Các loại áo dành cho nam giới: T-shirt, Polo, Sơ mi.",
    imageUrl: "https://i.ibb.co/L5B7n2t/apple-watch.png",
    createdAt: "2024-09-01T10:00:00.000Z",
    updatedAt: "2024-10-01T15:30:00.000Z"
  },
  { 
    _id: "CAT002",
    name: "Quần Nữ",
    description: "Các loại quần dành cho nữ giới: Jeans, Khaki, Váy.",
    imageUrl: "https://i.ibb.co/3Wf4Q7W/airpods.png",
    createdAt: "2024-08-15T09:30:00.000Z",
    updatedAt: "2024-10-20T11:45:00.000Z"
  },
  { 
    _id: "CAT003",
    name: "Phụ kiện",
    description: "Các phụ kiện đi kèm: Túi xách, Thắt lưng, Nón.",
    imageUrl: "https://i.ibb.co/74S2K9g/macbook.png",
    createdAt: "2024-07-01T14:20:00.000Z",
    updatedAt: "2024-09-10T08:00:00.000Z"
  },
  { 
    _id: "CAT004",
    name: "Giày Dép",
    description: "Các loại giày dép: Sneaker, Sandal, Boots.",
    imageUrl: "https://i.ibb.co/b3gQ8k7/ipad.png",
    createdAt: "2024-06-25T17:00:00.000Z",
    updatedAt: "2024-10-30T10:10:00.000Z"
  },
];

// Hàm tiện ích để định dạng ngày tháng (Giữ nguyên)
const formatDateTime = (isoString) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        const datePart = date.toLocaleDateString('vi-VN');
        const timePart = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        return `${datePart} ${timePart}`;
    } catch {
        return 'Invalid Date';
    }
};

// Variants cho Framer Motion (Giữ nguyên)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { delayChildren: 0.1, staggerChildren: 0.05 },
    },
};

const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },  
} 

const CategorieListsTable = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Logic Lọc dữ liệu
    const filteredCategories = categoriesData.filter(category => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return (
            category.name.toLowerCase().includes(lowerCaseSearch) ||
            category.description.toLowerCase().includes(lowerCaseSearch) ||
            category._id.toLowerCase().includes(lowerCaseSearch)
        );
    });

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Danh sách Danh mục</h1>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                
                {/* Thanh Search Input */}
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                </div>

                <button
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-1.5"
                >
                    <FiPlus className="w-4 h-4" /> 
                    Thêm Danh mục mới
                </button>
            </div>
            
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    {/* --- HEADER --- */}
                    <thead className="bg-gray-50">
                        <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Tên Danh mục</th>
                            <th className="px-6 py-4 text-left">Mô tả</th>
                            <th className="px-6 py-4 text-left">Banner</th>
                            {/* <th className="px-6 py-4 text-left">Ngày tạo</th> */}
                            {/* <th className="px-6 py-4 text-left">Cập nhật cuối</th> */}
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    
                    {/* --- BODY --- */}
                    <motion.tbody
                        className="bg-white divide-y divide-gray-100"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredCategories.map(category => (
                            <motion.tr
                                key={category._id}
                                variants={rowVariants}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 font-semibold text-gray-900">{category._id}</td>
                                
                                {/* Tên Danh mục */}
                                <td className="px-6 py-4 text-gray-800 font-medium">
                                    {category.name}
                                </td>
                                
                                {/* Mô tả */}
                                <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={category.description}>
                                    {category.description}
                                </td>
                                
                                {/* Banner (Image) */}
                                <td className="px-6 py-4">
                                    <img 
                                        src={category.imageUrl} 
                                        alt={category.name} 
                                        className="w-10 h-10 object-cover rounded-md shadow-sm border border-gray-200"
                                    />
                                </td>
                                
                                {/* Hành động (Thêm mới) */}
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <div className="flex justify-center items-center gap-2">
                                        <button 
                                            title="Sửa"
                                            className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors"
                                        >
                                            <FiEdit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            title="Xóa"
                                            className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-colors"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        
                        {filteredCategories.length === 0 && (
                            <tr className="border-t border-gray-100">
                                <td colSpan="5" className="text-center py-8 text-gray-500 italic">
                                    Không tìm thấy danh mục nào phù hợp với từ khóa "{searchTerm}".
                                </td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>
            </div>
        </div>
    );
};

export default CategorieListsTable;