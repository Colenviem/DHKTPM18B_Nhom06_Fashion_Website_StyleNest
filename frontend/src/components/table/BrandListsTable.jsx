import React, { useState, useContext, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BrandsContext } from "../../context/BrandsContext";
import {
    FiCheckCircle,
    FiXCircle,
    FiStar,
    FiEdit,
    FiSearch,
    FiPlus,
} from "react-icons/fi";
import { BsClockHistory } from "react-icons/bs";
import axios from "axios";

// Format ngày giờ
const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString("vi-VN");
    const timePart = date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return `${datePart} ${timePart}`;
};

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
};

const BrandListsTable = () => {
    const { brandsData, setBrandsData, loading } = useContext(BrandsContext);

    const [searchInput, setSearchInput] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        logoUrl: "",
        isActive: true,
        isFeatured: false,
    });

    const fetchBrands = useCallback(async () => {
        setSearchLoading(true); // Đặt loading khi fetch toàn bộ
        try {
            const res = await axios.get("http://localhost:8080/api/brands");
            setBrandsData(res.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách brands:", error);
            setBrandsData([]);
        } finally {
            setSearchLoading(false);
        }
    }, [setBrandsData]);

    useEffect(() => {
        if ((!brandsData || brandsData.length === 0) && !loading) {
            fetchBrands();
        }
    }, [fetchBrands, brandsData, loading]);

    useEffect(() => {
        const keyword = searchKeyword.trim();

        const performSearch = async () => {
            setSearchLoading(true);

            try {
                if (keyword) {
                    const res = await axios.get(`http://localhost:8080/api/brands/search?keyword=${keyword}`);
                    setBrandsData(res.data);
                } else {
                    fetchBrands();
                }
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
                setBrandsData([]);
            } finally {
                if (keyword) setSearchLoading(false);
            }
        };

        if (keyword !== "" || brandsData.length === 0) {
            performSearch();
        } else if (keyword === "") {
            fetchBrands();
        }

    }, [searchKeyword]);

    if (loading || searchLoading) return <div className="p-6 pt-24 bg-gray-50 min-h-screen">Đang tải dữ liệu...</div>;
    if (!brandsData || !Array.isArray(brandsData)) return <div className="p-6 pt-24 bg-gray-50 min-h-screen">Không có dữ liệu</div>;


    const openModal = (brand = null) => {
        setEditingBrand(brand);
        if (brand) {
            setFormData({
                name: brand.name || "",
                description: brand.description || "",
                logoUrl: brand.logoUrl || "",
                isActive: brand.active,
                isFeatured: brand.featured,
            });
        } else {
            setFormData({
                name: "",
                description: "",
                logoUrl: "",
                isActive: true,
                isFeatured: false,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingBrand(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBrand) {
                const updatePayload = {
                    ...formData,
                    active: formData.isActive,
                    featured: formData.isFeatured
                }
                await axios.put(`http://localhost:8080/api/brands/${editingBrand.id}`, updatePayload);
            } else {
                const createPayload = {
                    ...formData,
                    active: formData.isActive,
                    featured: formData.isFeatured
                }
                await axios.post("http://localhost:8080/api/brands", createPayload);
            }

            await fetchBrands();

            setSearchInput("");
            setSearchKeyword("");
            closeModal();

        } catch (error) {
            console.error("Lỗi khi thêm/sửa thương hiệu:", error);
        }
    };

    const toggleActive = async (brand) => {
        try {
            setBrandsData((prev) =>
                prev.map((b) =>
                    b.id === brand.id ? { ...b, active: !b.active, updatedAt: new Date().toISOString() } : b
                )
            );

            // Gọi backend để lưu thay đổi
            await axios.put(`http://localhost:8080/api/brands/${brand.id}/toggleActive`);
        } catch (error) {
            console.error("Toggle Active lỗi:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/brands/${id}`);
            fetchBrands();
        } catch (error) {
            console.error("Xóa lỗi:", error);
        }
    };

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">
                Danh sách Thương hiệu
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">

                <div className="relative flex items-center w-full sm:w-96 gap-2">
                    <div className="relative flex-grow">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Nhập Tên hoặc ID thương hiệu..."
                            value={searchInput} // Dùng searchInput
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => { // Tìm kiếm khi nhấn Enter
                                if (e.key === 'Enter') {
                                    setSearchKeyword(searchInput.trim());
                                }
                            }}
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        />
                    </div>

                    <button
                        className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg text-sm hover:bg-indigo-600 transition-colors shadow-md flex items-center gap-1.5 min-w-[80px] justify-center"
                        onClick={() => setSearchKeyword(searchInput.trim())} // Bấm nút để kích hoạt tìm kiếm
                        disabled={searchLoading}
                    >
                        {searchLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <FiSearch className="w-4 h-4" />
                                Tìm
                            </>
                        )}
                    </button>
                </div>

                <button
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-1.5"
                    onClick={() => openModal()}
                >
                    <FiPlus className="w-4 h-4" />
                    Thêm Thương hiệu mới
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                    <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
                        <th className="px-6 py-4 text-left">Thương hiệu (ID)</th>
                        <th className="px-6 py-4 text-left">Mô tả</th>
                        <th className="px-6 py-4 text-center">Nổi bật</th>
                        <th className="px-6 py-4 text-left">Ngày tạo</th>
                        <th className="px-6 py-4 text-left">Cập nhật cuối</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-center">Hành động</th>
                    </tr>
                    </thead>

                    <motion.tbody
                        className="bg-white divide-y divide-gray-100"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {brandsData.map((brand) => (
                            <motion.tr
                                key={brand.id}
                                variants={rowVariants}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 font-extrabold text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={brand.logoUrl}
                                            alt={brand.name}
                                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "https://placehold.co/32x32/E0E0E0/333333?text=B";
                                            }}
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                {brand.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-gray-700 max-w-xs truncate">
                                    {brand.description}
                                </td>

                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    {brand.featured ? (
                                        <FiStar className="w-5 h-5 text-yellow-500 mx-auto" />
                                    ) : (
                                        <span className="text-gray-300">—</span>
                                    )}
                                </td>

                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono">
                                    {formatDateTime(brand.createdAt)}
                                </td>

                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono flex items-center gap-1">
                                    <BsClockHistory className="w-3 h-3 text-gray-400" />
                                    {formatDateTime(brand.updatedAt)}
                                </td>

                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    {brand.active ? (
                                        <FiCheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                    ) : (
                                        <FiXCircle className="w-5 h-5 text-red-500 mx-auto" />
                                    )}
                                </td>

                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            title="Sửa"
                                            className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors"
                                            onClick={() => openModal(brand)}
                                        >
                                            <FiEdit className="w-4 h-4" />
                                        </button>
                                        <button
                                            title={brand.active ? "Vô hiệu hóa" : "Kích hoạt"}
                                            className={`p-2 rounded-full transition-colors ${
                                                brand.active
                                                    ? "text-red-600 hover:text-red-800 hover:bg-red-100"
                                                    : "text-green-600 hover:text-green-800 hover:bg-green-100"
                                            }`}
                                            onClick={() => toggleActive(brand)}
                                        >
                                            {brand.active ? (
                                                <FiXCircle className="w-4 h-4" />
                                            ) : (
                                                <FiCheckCircle className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            title="Xóa"
                                            className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-colors"
                                            onClick={() => handleDelete(brand.id)}
                                        >
                                            <FiXCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        {brandsData.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                                    {searchKeyword ?
                                        `Không tìm thấy thương hiệu nào phù hợp với từ khóa "${searchKeyword}".`
                                        : "Không có thương hiệu nào."}
                                </td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingBrand ? "Sửa Thương hiệu" : "Thêm Thương hiệu mới"}
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Tên thương hiệu"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="border px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Mô tả"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="URL Logo"
                                value={formData.logoUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, logoUrl: e.target.value })
                                }
                                className="border px-3 py-2 rounded"
                            />
                            <div className="flex items-center gap-4 mt-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isActive: e.target.checked })
                                        }
                                    />
                                    Đang hoạt động
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isFeatured: e.target.checked })
                                        }
                                    />
                                    Nổi bật
                                </label>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                    onClick={closeModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandListsTable;