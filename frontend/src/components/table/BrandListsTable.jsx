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
import Spinner from "../../components/spinner/Spinner";
import axiosClient from "../../api/axiosClient";

const getBrandStatus = (isActive) =>
    isActive
        ? {
              text: "Còn hoạt động",
              icon: <FiCheckCircle className="w-5 h-5 text-green-500 mx-auto" />,
              colorClass: "text-green-600 font-bold",
          }
        : {
              text: "Ngừng hoạt động",
              icon: <FiXCircle className="w-5 h-5 text-red-500 mx-auto" />,
              colorClass: "text-red-600 font-bold",
          };

const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString(
        "vi-VN",
        { hour: "2-digit", minute: "2-digit" }
    )}`;
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
        setSearchLoading(true);
        try {
            const res = await axiosClient.get("/brands");
            setBrandsData(res.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách brands:", error);
            setBrandsData([]);
        } finally {
            setSearchLoading(false);
        }
    }, [setBrandsData]);

    useEffect(() => {
        if ((!brandsData || brandsData.length === 0) && !loading) fetchBrands();
    }, [brandsData, loading, fetchBrands]);

    useEffect(() => {
        const keyword = searchKeyword.trim();
        const performSearch = async () => {
            setSearchLoading(true);
            try {
                let res;
                if (keyword) {
                    res = await axiosClient.get(`/brands/search`, {
                        params: { keyword: keyword },
                    });
                } else {
                    res = await axiosClient.get("/brands");
                }
                setBrandsData(res.data);
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
                setBrandsData([]);
            } finally {
                setSearchLoading(false);
            }
        };
        performSearch();
    }, [searchKeyword, setBrandsData]);

    const openModal = (brand = null) => {
    setEditingBrand(brand);
        setFormData({
            name: brand?.name ?? "",
            description: brand?.description ?? "",
            logoUrl: brand?.logoUrl ?? "",
            isActive: brand?.active ?? false,    // ✅ đúng field
            isFeatured: brand?.featured ?? false, // ✅ đúng field
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingBrand(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                logoUrl: formData.logoUrl,
                active: formData.isActive,
                featured: formData.isFeatured,
            };

            console.log(editingBrand)

            console.log(payload);

            if (editingBrand) {
                await axiosClient.put(`/brands/${editingBrand.id}`, payload);
            } else {
                await axiosClient.post("/brands", payload);
            }
            await fetchBrands();
            setSearchInput("");
            setSearchKeyword("");

            closeModal();
        } catch (error) {
            console.error("Lỗi khi thêm/sửa thương hiệu:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    if (loading || searchLoading)
        return <Spinner size={12} content="Đang tải dữ liệu nhãn hàng" />;
    if (!brandsData || !Array.isArray(brandsData))
        return <div className="p-6 pt-24 bg-gray-50 min-h-screen">Không có dữ liệu</div>;

    const placeholderLogo = "https://placehold.co/32x32/E0E0E0/333333?text=B";

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
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && setSearchKeyword(searchInput.trim())
                            }
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        />
                    </div>
                    <button
                        className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg text-sm hover:bg-indigo-600 transition-colors shadow-md flex items-center gap-1.5 min-w-[80px] justify-center"
                        onClick={() => setSearchKeyword(searchInput.trim())}
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
                    <FiPlus className="w-4 h-4" /> Thêm Thương hiệu mới
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
                            <th className="px-6 py-4 text-center">Thương hiệu (ID)</th>
                            <th className="px-6 py-4 text-center">Mô tả</th>
                            <th className="px-6 py-4 text-center">Nổi bật</th>
                            <th className="px-6 py-4 text-center">Ngày tạo</th>
                            <th className="px-6 py-4 text-center">Cập nhật cuối</th>
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
                        {brandsData.map((brand) => {
                            const status = getBrandStatus(brand.active);
                            return (
                                <motion.tr
                                    key={brand.id}
                                    variants={rowVariants}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* Thương hiệu */}
                                    <td className="px-6 py-4 font-extrabold text-gray-900 whitespace-nowrap flex text-left gap-3">
                                        <img
                                            src={brand.logoUrl || placeholderLogo}
                                            alt={brand.name || "Logo"}
                                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = placeholderLogo;
                                            }}
                                        />
                                        <div className="font-semibold text-gray-800">
                                            {brand.name}
                                        </div>
                                    </td>

                                    {/* Mô tả */}
                                    <td className="px-6 py-4 text-gray-700 max-w-xs truncate text-left">
                                        {brand.description}
                                    </td>

                                    {/* Nổi bật */}
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        {brand.isFeatured ? (
                                            <FiStar className="w-5 h-5 text-yellow-500 mx-auto" />
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>

                                    {/* Ngày tạo */}
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono text-center">
                                        {formatDateTime(brand.createdAt)}
                                    </td>

                                    {/* Cập nhật cuối */}
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs font-mono flex items-center justify-center gap-1">
                                        <BsClockHistory className="w-3 h-3 text-gray-400" />
                                        {formatDateTime(brand.updatedAt)}
                                    </td>

                                    {/* Trạng thái */}
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            {status.icon}
                                            <span className={status.colorClass}>{status.text}</span>
                                        </div>
                                    </td>

                                    {/* Hành động */}
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="flex justify-center items-center gap-2">
                                            <button
                                                title="Sửa"
                                                className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors"
                                                onClick={() => openModal(brand)}
                                            >
                                                <FiEdit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                        {brandsData.length === 0 && (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-8 text-gray-500 italic"
                                >
                                    {searchKeyword
                                        ? `Không tìm thấy thương hiệu nào phù hợp với từ khóa "${searchKeyword}".`
                                        : "Không có thương hiệu nào."}
                                </td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-800 pb-4">
                            {editingBrand ? "Sửa Thương hiệu" : "Thêm Thương hiệu mới"}
                        </h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <input
                                type="text"
                                placeholder="Tên thương hiệu"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-shadow w-full"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Mô tả"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-shadow w-full"
                            />

                            {/* Image Upload */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700 font-medium">
                                    Logo Thương hiệu
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = () =>
                                                setFormData({ ...formData, logoUrl: reader.result });
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-shadow w-full"
                                />
                                {formData.logoUrl && (
                                    <img
                                        src={formData.logoUrl || placeholderLogo}
                                        alt="Preview Logo"
                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200 mt-2"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isActive: e.target.checked })
                                        }
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-700 font-medium">
                                        Đang hoạt động
                                    </span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isFeatured: e.target.checked })
                                        }
                                        className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400"
                                    />
                                    <span className="text-gray-700 font-medium">Nổi bật</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors shadow-sm"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
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