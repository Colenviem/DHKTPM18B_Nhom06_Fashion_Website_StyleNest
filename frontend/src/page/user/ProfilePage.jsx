import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FiUser, FiEdit, FiSave, FiXCircle, FiMapPin, FiTag, FiPlus,
    FiTrash2, FiBox, FiTruck, FiCreditCard, FiEye, FiArrowLeft,
    FiCalendar, FiPackage, FiRotateCcw, FiUpload, FiX,
    FiClock, FiAlertCircle, FiCheckCircle, FiSearch, FiFilter
} from 'react-icons/fi';

import { motion, AnimatePresence } from 'framer-motion';

import { uploadImage } from '../../context/CloudinaryContext';

const ReturnRequestModal = ({ isOpen, onClose, order, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !order) return null;

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setSelectedFiles((prev) => [...prev, ...newFiles]);
        }
        e.target.value = null;
    };

    const removeImage = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCheckboxChange = (item) => {
        const key = item.variantId || item.product.id;
        setSelectedItems((prev) => {
            const newState = { ...prev };
            if (newState[key]) {
                delete newState[key];
            } else {
                newState[key] = {
                    productId: item.product.id,
                    variantId: item.variantId,
                    quantity: 1,
                    note: '',
                    maxQuantity: item.quantity,
                };
            }
            return newState;
        });
    };

    const handleQuantityChange = (key, newQty) => {
        setSelectedItems((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                quantity: Math.min(Math.max(1, newQty), prev[key].maxQuantity)
            }
        }));
    };

    const handleNoteChange = (key, note) => {
        setSelectedItems((prev) => ({
            ...prev,
            [key]: { ...prev[key], note: note }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const itemsPayload = Object.values(selectedItems).map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            note: item.note
        }));

        if (itemsPayload.length === 0) {
            alert("Vui lòng chọn ít nhất 1 sản phẩm để trả.");
            return;
        }
        if (!reason.trim()) {
            alert("Vui lòng nhập lý do trả hàng.");
            return;
        }

        setIsSubmitting(true);

        try {
            let uploadedUrls = [];
            if (selectedFiles.length > 0) {
                const uploadPromises = selectedFiles.map(item => uploadImage(item.file));
                uploadedUrls = await Promise.all(uploadPromises);
            }

            const payload = {
                orderId: order.id,
                reason: reason,
                images: uploadedUrls,
                items: itemsPayload
            };

            await onSubmit(payload);

        } catch (error) {
            console.error(error);
            alert("Lỗi khi gửi yêu cầu. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-[Manrope]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-100"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-gray-800">Yêu cầu Trả hàng / Hoàn tiền</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <FiXCircle className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* 1. Chọn sản phẩm */}
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">1. Chọn sản phẩm cần trả</h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {order.items.map((item, index) => {
                                const itemKey = item.variantId || item.product.id;
                                const isSelected = !!selectedItems[itemKey];

                                return (
                                    <div key={index} className={`p-3 border rounded-lg transition-all ${isSelected ? 'border-[#6F47EB] bg-purple-50 ring-1 ring-[#6F47EB]' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleCheckboxChange(item)}
                                                className="mt-1 w-5 h-5 accent-[#6F47EB] cursor-pointer"
                                            />
                                            <div className="flex-1">
                                                <div className="flex gap-3">
                                                    <img src={item.product?.image} alt="" className="w-16 h-16 object-cover rounded border border-gray-100" />
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900 line-clamp-2">{item.product?.name}</p>
                                                        {item.variantId && <p className="text-xs text-gray-500 mt-1">Phân loại: {item.variantId}</p>}
                                                        <p className="text-xs text-gray-500">Đã mua: {item.quantity}</p>
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
                                                        >
                                                            <div>
                                                                <label className="text-xs font-semibold text-gray-600 block mb-1">Số lượng trả</label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max={item.quantity}
                                                                    value={selectedItems[itemKey].quantity}
                                                                    onChange={(e) => handleQuantityChange(itemKey, parseInt(e.target.value))}
                                                                    className="w-full p-2 border rounded text-sm focus:border-[#6F47EB] outline-none"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-semibold text-gray-600 block mb-1">Lý do chi tiết</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Vd: Rách, sai màu..."
                                                                    value={selectedItems[itemKey].note}
                                                                    onChange={(e) => handleNoteChange(itemKey, e.target.value)}
                                                                    className="w-full p-2 border rounded text-sm focus:border-[#6F47EB] outline-none"
                                                                />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. Lý do chung */}
                    <div>
                        <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">2. Lý do trả hàng chung (*)</label>
                        <textarea
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Mô tả chi tiết lý do bạn muốn trả hàng..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F47EB] focus:border-transparent outline-none h-24 text-sm resize-none"
                        ></textarea>
                    </div>

                    {/* 3. Hình ảnh */}
                    <div>
                        <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">3. Hình ảnh minh chứng</label>
                        <div className="flex flex-wrap gap-3">
                            {selectedFiles.map((img, index) => (
                                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 group shadow-sm">
                                    <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiX size={12} />
                                    </button>
                                </div>
                            ))}
                            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors">
                                <FiPlus size={24} />
                                <span className="text-[10px] mt-1 font-semibold">Thêm ảnh</span>
                                <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-bold text-sm">Hủy bỏ</button>
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#6F47EB] text-white rounded-lg font-bold text-sm hover:bg-indigo-700 disabled:opacity-70">
                            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// --- COMPONENT 2: CHI TIẾT ĐƠN HÀNG (CÓ LOGIC CHẶN 7 NGÀY) ---
const OrderDetail = ({ order, onBack, onReturnRequest }) => {

    // Hàm kiểm tra điều kiện trả hàng
    const checkCanReturn = (ord) => {
        // 1. Check trạng thái đơn
        if (ord.status !== 'Delivered' && ord.status !== 'Completed') {
            return { can: false, msg: 'Chỉ có thể trả hàng khi đã Giao hàng thành công.' };
        }
        if (ord.status === 'ReturnRequested') {
            return { can: false, msg: 'Đơn hàng đang có yêu cầu trả hàng.' };
        }
        if (ord.status === 'Returned' || ord.status === 'Refunded') {
            return { can: false, msg: 'Đơn hàng đã hoàn tất trả hàng/hoàn tiền.' };
        }

        // 2. Check thời gian 7 ngày
        // Ưu tiên dùng updatedAt (thời điểm giao hàng), nếu không có dùng createdAt
        const deliveryDate = new Date(ord.updatedAt || ord.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - deliveryDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 7) {
            return { can: false, msg: 'Đã quá thời hạn 7 ngày đổi trả kể từ khi nhận hàng.' };
        }

        return { can: true, msg: '' };
    };

    const returnStatus = checkCanReturn(order);

    const getStatusColor = (status) => {
        const statusColors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Processing': 'bg-blue-100 text-blue-800 border-blue-300',
            'Shipped': 'bg-purple-100 text-purple-800 border-purple-300',
            'Delivered': 'bg-green-100 text-green-800 border-green-300',
            'Completed': 'bg-green-100 text-green-800 border-green-300',
            'Cancelled': 'bg-red-100 text-red-800 border-red-300',
            'ReturnRequested': 'bg-orange-100 text-orange-800 border-orange-300',
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="font-[Manrope]">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-[#6F47EB] transition-colors mb-4">
                    <FiArrowLeft className="mr-2" /> Quay lại danh sách đơn hàng
                </button>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h2>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>{order.status}</span>
                    </div>

                    {/* HIỂN THỊ NÚT TRẢ HÀNG HOẶC THÔNG BÁO LỖI */}
                    {returnStatus.can ? (
                        <button onClick={() => onReturnRequest(order)} className="flex items-center gap-2 px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold shadow-sm">
                            <FiRotateCcw /> Yêu cầu trả hàng
                        </button>
                    ) : (
                        // Nếu đơn đã giao/hoàn thành nhưng không được trả thì hiện lý do
                        (order.status === 'Delivered' || order.status === 'Completed' || order.status === 'ReturnRequested') && (
                            <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200">
                                <FiAlertCircle className="text-orange-500"/>
                                {returnStatus.msg}
                            </div>
                        )
                    )}
                </div>
            </motion.div>

            {/* Các thông tin chi tiết đơn hàng */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                        <FiBox className="w-5 h-5 text-[#6F47EB] mt-1 flex-shrink-0" />
                        <div><p className="text-sm text-gray-500">Mã đơn hàng</p><p className="font-semibold text-gray-900">{order.id}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                        <FiCalendar className="w-5 h-5 text-[#6F47EB] mt-1 flex-shrink-0" />
                        <div><p className="text-sm text-gray-500">Ngày đặt hàng</p><p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                        <FiCreditCard className="w-5 h-5 text-[#6F47EB] mt-1 flex-shrink-0" />
                        <div><p className="text-sm text-gray-500">Phương thức thanh toán</p>{order.paymentMethod}</div>
                    </div>
                    <div className="flex items-start gap-3">
                        <FiUser className="w-5 h-5 text-[#6F47EB] mt-1 flex-shrink-0" />
                        <div><p className="text-sm text-gray-500">Người đặt</p><p className="font-semibold text-gray-900">{order.user?.userName}</p></div>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 text-[#6F47EB] mt-1 flex-shrink-0" />
                    <div><h3 className="font-semibold text-gray-900 mb-2">Địa chỉ giao hàng</h3><p className="text-gray-700 font-medium">{order.shippingAddress?.name}</p><p className="text-gray-600">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p><p className="text-gray-600 text-sm">SĐT: {order.shippingAddress?.phoneNumber}</p></div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4"><FiPackage className="w-5 h-5 text-[#6F47EB]" /><h3 className="font-semibold text-gray-900">Sản phẩm ({order.items?.length || 0})</h3></div>
                <div className="space-y-4">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex-shrink-0"><img src={item.product?.image} alt={item.product?.name} className="w-24 h-24 object-cover rounded-lg shadow-md" /></div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-2">{item.product?.name}</h4>
                                <div className="space-y-1 text-sm">
                                    {item.variantId && <p className="text-gray-600"><span className="font-medium">Mã sản phẩm:</span> {item.variantId}</p>}
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div><span className="text-gray-600 font-medium">Đơn giá: </span><span className="font-semibold">{(Number(item.unitPrice) || 0).toLocaleString('vi-VN')}₫</span></div>
                                        <div><span className="text-gray-600 font-medium">Số lượng: </span><span className="px-2 py-0.5 rounded-full font-semibold">{item.quantity}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Tổng quan đơn hàng</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-700"><div className="flex items-center gap-2"><FiTruck className="w-4 h-4" /><span>Phí vận chuyển</span></div><span className="font-semibold">{(Number(order.shippingFee) || 0).toLocaleString('vi-VN')}₫</span></div>
                    {order.discountAmount > 0 && (<div className="flex justify-between text-green-600"><span>Giảm giá</span><span className="font-semibold">-{(Number(order.discountAmount) || 0).toLocaleString('vi-VN')}₫</span></div>)}
                    <div className="flex justify-between text-gray-700">
                        <div className="flex items-center gap-2">
                            <span>Tổng tiền sản phẩm</span>
                        </div>
                        <span className="font-semibold">
                            {(Number(order.subtotal) || 0).toLocaleString('vi-VN')}₫
                        </span>
                    </div>

                    <div className="pt-3 border-t-2 border-gray-300 flex justify-between items-center"><span className="text-base font-bold text-gray-900">Tổng tiền</span><span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{(Number(order.totalAmount) || 0).toLocaleString('vi-VN')}₫</span></div>
                </div>
            </motion.div>
        </div>
    );
};

// --- COMPONENT 3: DANH SÁCH LỊCH SỬ TRẢ HÀNG (ĐÃ THÊM SEARCH & FILTER) ---
const ReturnRequestsList = ({ userId, token }) => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho tìm kiếm và bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        const fetchReturns = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/returns/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Sort mới nhất lên đầu
                setReturns(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                console.error("Lỗi tải yêu cầu trả hàng", err);
            } finally {
                setLoading(false);
            }
        };
        if (userId && token) fetchReturns();
    }, [userId, token]);

    // Logic lọc dữ liệu
    const filteredReturns = returns.filter(req => {
        // 1. Kiểm tra tìm kiếm (Mã yêu cầu HOẶC Mã đơn hàng)
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (req.id && req.id.toLowerCase().includes(term)) ||
            (req.orderId && req.orderId.toLowerCase().includes(term));

        // 2. Kiểm tra trạng thái
        const matchesStatus = filterStatus === 'ALL' || req.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Chờ xử lý', icon: <FiClock /> };
            case 'APPROVED': return { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Đã duyệt', icon: <FiCheckCircle /> };
            case 'REJECTED': return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Từ chối', icon: <FiXCircle /> };
            case 'REFUNDED': return { color: 'bg-green-100 text-green-800 border-green-200', text: 'Đã hoàn tiền', icon: <FiCheckCircle /> };
            default: return { color: 'bg-gray-100', text: status, icon: null };
        }
    };

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div className="space-y-6">
            {/* --- THANH TÌM KIẾM & BỘ LỌC (MỚI) --- */}
            <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                {/* Search Box */}
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm mã yêu cầu hoặc mã đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F47EB] focus:border-transparent outline-none text-sm"
                    />
                </div>

                {/* Filter Combobox */}
                <div className="relative min-w-[200px]">
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F47EB] outline-none text-sm appearance-none bg-white cursor-pointer"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">⏳ Chờ xử lý</option>
                        <option value="APPROVED">✅ Đã duyệt</option>
                        <option value="REFUNDED">💰 Đã hoàn tiền</option>
                        <option value="REJECTED">❌ Bị từ chối</option>
                    </select>
                    {/* Mũi tên custom cho select */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            {/* --- DANH SÁCH KẾT QUẢ --- */}
            {filteredReturns.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white border border-dashed border-gray-300 rounded-xl">
                    <p>Không tìm thấy yêu cầu nào phù hợp.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReturns.map((req) => {
                        const info = getStatusInfo(req.status);
                        return (
                            <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-mono">Mã yêu cầu: <span className="text-gray-800 font-bold">{req.id}</span></p>
                                        <p className="text-sm font-bold text-gray-700 mt-1">Đơn hàng gốc: #{req.orderId}</p>
                                        <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString('vi-VN')}</p>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1 ${info.color}`}>
                                        {info.icon} {info.text}
                                    </span>
                                </div>

                                {/* Items */}
                                <div className="bg-gray-50 p-3 rounded-lg space-y-2 mb-4">
                                    {req.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 rounded border bg-white overflow-hidden flex-shrink-0">
                                                    <img src={item.product?.image} alt="" className="w-full h-full object-cover"/>
                                                </div>
                                                <div>
                                                    <p className="text-gray-700 font-medium line-clamp-1">{item.product?.name}</p>
                                                    <p className="text-gray-500 text-xs">SL: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : (item.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-gray-200')}`}>
                                                {item.status || 'PENDING'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Admin Note / Lý do */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-bold text-gray-700 block mb-1">Lý do bạn trả:</span>
                                        <p className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">{req.reason}</p>
                                    </div>
                                    {req.adminNote && (
                                        <div>
                                            <span className="font-bold text-indigo-600 block mb-1">Phản hồi từ Shop:</span>
                                            <p className="text-gray-700 bg-indigo-50 border border-indigo-100 p-2 rounded">{req.adminNote}</p>
                                        </div>
                                    )}
                                </div>

                                {req.status === 'APPROVED' && (
                                    <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-200 flex items-center gap-2">
                                        <FiAlertCircle className="flex-shrink-0" />
                                        <span><strong>Hướng dẫn:</strong> Đơn đã được duyệt. Vui lòng gửi hàng về shop. Sau khi shop nhận được hàng sẽ tiến hành hoàn tiền.</span>
                                    </div>
                                )}
                                <div className="mt-4 pt-3 border-t flex justify-end items-center gap-2">
                                    <span className="text-sm text-gray-500">Hoàn tiền dự kiến:</span>
                                    <span className="text-lg font-bold text-indigo-600">{(req.totalRefundAmount || 0).toLocaleString('vi-VN')}₫</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// --- COMPONENT 4: FORM ĐỊA CHỈ (Giữ nguyên) ---
const NewAddressForm = ({ onSave, onCancel, initialData }) => {
    const defaultAddress = { street: '', city: '', province: '', postalCode: '', isDefault: false };
    const [address, setAddress] = useState(defaultAddress);

    useEffect(() => {
        if (initialData) setAddress(initialData);
        else setAddress(defaultAddress);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddress((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!address.street || !address.city || !address.province || !address.postalCode) {
            alert('Vui lòng điền đầy đủ thông tin địa chỉ.');
            return;
        }
        onSave(address);
    };

    return (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">{initialData ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                <div><label className="text-sm font-medium text-gray-600">Địa chỉ (Số nhà, Tên đường)</label><input type="text" name="street" value={address.street} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-gray-600">Quận/Huyện</label><input type="text" name="city" value={address.city} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]" /></div>
                    <div><label className="text-sm font-medium text-gray-600">Tỉnh/Thành phố</label><input type="text" name="province" value={address.province} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]" /></div>
                </div>
                <div><label className="text-sm font-medium text-gray-600">Mã bưu điện</label><input type="text" name="postalCode" value={address.postalCode} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]" /></div>
                <div className="flex items-center"><input type="checkbox" name="isDefault" checked={address.isDefault} onChange={handleChange} id="isDefault" className="h-4 w-4 accent-[#6F47EB]" /><label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">Đặt làm địa chỉ mặc định</label></div>
                <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={onCancel} className="flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300">Hủy</button>
                    <button type="submit" className="flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300">{initialData ? 'Cập nhật' : 'Lưu địa chỉ'}</button>
                </div>
            </form>
        </motion.div>
    );
};

// --- COMPONENT CHÍNH: PROFILE PAGE ---
function ProfilePage() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', userName: '', addresses: [], coupons: [] });

    // Thêm tab 'returns' vào state
    const [activeTab, setActiveTab] = useState('profile');

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [orderToReturn, setOrderToReturn] = useState(null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [message, setMessage] = useState({ type: '', content: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
            setFormData({
                firstName: parsedUser.firstName || '',
                lastName: parsedUser.lastName || '',
                email: parsedUser.email || '',
                userName: parsedUser.userName || '',
                addresses: parsedUser.addresses || [],
                coupons: parsedUser.coupons || [],
            });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (activeTab === 'orders' && user && token) {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const res = await axios.get(`http://localhost:8080/api/orders/user/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                } catch (err) {
                    console.error('Error loading orders', err);
                }
                setLoadingOrders(false);
            };
            fetchOrders();
        }
    }, [activeTab, user, token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });
        const updateData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: user.email,
            userName: user.userName,
            addresses: formData.addresses,
            coupons: formData.coupons,
        };
        try {
            const res = await axios.put(`http://localhost:8080/api/users/${user.id}`, updateData, { headers: { Authorization: `Bearer ${token}` } });
            const updatedUserInStorage = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));
            setUser(updatedUserInStorage);
            setMessage({ type: 'success', content: 'Cập nhật hồ sơ thành công!' });
            setIsEditMode(false);
        } catch (err) { setMessage({ type: 'error', content: err.response?.data?.message || 'Lỗi khi cập nhật hồ sơ.' }); }
    };

    const handleAddAddress = async (newAddress) => {
        try {
            const res = await axios.post(`http://localhost:8080/api/users/${user.id}/addresses`, newAddress, { headers: { Authorization: `Bearer ${token}` } });
            const addedAddress = res.data;
            let newAddressList = [...formData.addresses];
            if (addedAddress.isDefault) newAddressList = newAddressList.map((addr) => ({ ...addr, isDefault: false }));
            newAddressList.push(addedAddress);
            const updatedUserInStorage = { ...user, addresses: newAddressList };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));
            setUser(updatedUserInStorage);
            setFormData((prev) => ({ ...prev, addresses: newAddressList }));
            setMessage({ type: 'success', content: 'Thêm địa chỉ mới thành công!' });
            setIsAddingAddress(false);
        } catch (err) { setMessage({ type: 'error', content: err.response?.data?.message || 'Lỗi khi thêm địa chỉ.' }); }
    };

    const handleUpdateAddress = async (addressData) => {
        try {
            const res = await axios.put(`http://localhost:8080/api/users/${user.id}/addresses/${addressData.id}`, addressData, { headers: { Authorization: `Bearer ${token}` } });
            const updatedAddress = res.data;
            let newAddressList = formData.addresses.map((addr) => addr.id === updatedAddress.id ? updatedAddress : addr);
            if (updatedAddress.isDefault) newAddressList = newAddressList.map((addr) => addr.id === updatedAddress.id ? addr : { ...addr, isDefault: false });
            const updatedUserInStorage = { ...user, addresses: newAddressList };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));
            setUser(updatedUserInStorage);
            setFormData((prev) => ({ ...prev, addresses: newAddressList }));
            setMessage({ type: 'success', content: 'Cập nhật địa chỉ thành công!' });
            setEditingAddress(null);
        } catch (err) { setMessage({ type: 'error', content: err.response?.data?.message || 'Lỗi khi cập nhật địa chỉ.' }); }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
        try {
            await axios.delete(`http://localhost:8080/api/users/${user.id}/addresses/${addressId}`, { headers: { Authorization: `Bearer ${token}` } });
            const newAddressList = formData.addresses.filter((addr) => addr.id !== addressId);
            const updatedUserInStorage = { ...user, addresses: newAddressList };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));
            setUser(updatedUserInStorage);
            setFormData((prev) => ({ ...prev, addresses: newAddressList }));
            setMessage({ type: 'success', content: 'Xóa địa chỉ thành công!' });
        } catch (err) { setMessage({ type: 'error', content: err.response?.data?.message || 'Lỗi khi xóa địa chỉ.' }); }
    };

    const handleStartEdit = (addressToEdit) => { setEditingAddress(addressToEdit); setIsAddingAddress(false); };
    const handleCancelForm = () => { setIsAddingAddress(false); setEditingAddress(null); };

    const handleOpenReturnModal = (order) => {
        setOrderToReturn(order);
        setIsReturnModalOpen(true);
    };

    const handleCloseReturnModal = () => {
        setIsReturnModalOpen(false);
        setOrderToReturn(null);
    };

    const handleCreateReturnRequest = async (payload) => {
        try {
            await axios.post(`http://localhost:8080/api/returns`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage({ type: 'success', content: 'Gửi yêu cầu trả hàng thành công! Vui lòng kiểm tra tab "Lịch sử trả hàng".' });
            handleCloseReturnModal();
            setSelectedOrder(null);
            // Tự động chuyển sang tab lịch sử trả hàng
            setActiveTab('returns');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Lỗi khi gửi yêu cầu trả hàng");
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Processing': 'bg-blue-100 text-blue-800 border-blue-300',
            'Shipped': 'bg-purple-100 text-purple-800 border-purple-300',
            'Delivered': 'bg-green-100 text-green-800 border-green-300',
            'Cancelled': 'bg-red-100 text-red-800 border-red-300',
            'ReturnRequested': 'bg-orange-100 text-orange-800 border-orange-300',
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const statusText = {
        PENDING: 'Chờ xử lý',
        PROCESSING: 'Đang xử lý',
        SHIPPED: 'Đang giao',
        Delivered: 'Đã giao',
        Cancelled: 'Đã hủy',
        ReturnRequested: 'Yêu cầu trả hàng'
    }

    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "all" || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);


    const paymentText = { Credit: "Thẻ Tín dụng", Googlepay: "Google Pay", Code: "Thanh toán khi nhận" };

    if (!user) return null;

    return (
        <div className="bg-gray-50 py-10 font-[Manrope]">
            {/* --- Modal Trả hàng --- */}
            <AnimatePresence>
                {isReturnModalOpen && (
                    <ReturnRequestModal
                        isOpen={isReturnModalOpen}
                        onClose={handleCloseReturnModal}
                        order={orderToReturn}
                        onSubmit={handleCreateReturnRequest}
                    />
                )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden min-h-[600px]">
                <div className="w-full p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
                    </div>

                    {/* Navigation Tabs - CẬP NHẬT TAB MỚI */}
                    <div className="flex space-x-6 border-b pb-2 mb-6 text-gray-600 font-medium overflow-x-auto">
                        <button onClick={() => setActiveTab('profile')} className={`whitespace-nowrap pb-2 ${activeTab === 'profile' ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]' : ''}`}>Thông tin cá nhân</button>
                        <button onClick={() => setActiveTab('address')} className={`whitespace-nowrap pb-2 ${activeTab === 'address' ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]' : ''}`}>Sổ địa chỉ</button>
                        <button onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }} className={`whitespace-nowrap pb-2 ${activeTab === 'orders' ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]' : ''}`}>Đơn hàng</button>
                        {/* Tab mới */}
                        <button onClick={() => setActiveTab('returns')} className={`whitespace-nowrap pb-2 ${activeTab === 'returns' ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]' : ''}`}>Lịch sử trả hàng</button>
                        <button onClick={() => setActiveTab('coupons')} className={`whitespace-nowrap pb-2 ${activeTab === 'coupons' ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]' : ''}`}>Mã giảm giá</button>
                    </div>

                    {message.content && (
                        <p className={`text-sm p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message.content}</p>
                    )}

                    {/* TAB 1: THÔNG TIN CÁ NHÂN */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="text-sm font-medium text-gray-600">Họ</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} disabled={!isEditMode} className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB] disabled:bg-gray-50 disabled:text-gray-500" /></div>
                                <div><label className="text-sm font-medium text-gray-600">Tên</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} disabled={!isEditMode} className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB] disabled:bg-gray-50 disabled:text-gray-500" /></div>
                            </div>
                            <div><label className="text-sm font-medium text-gray-600">Email</label><input type="email" name="email" value={formData.email} disabled className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" /></div>
                            <div><label className="text-sm font-medium text-gray-600">Tên đăng nhập</label><input type="text" name="userName" value={formData.userName} disabled className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" /></div>
                            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-100">
                                {!isEditMode ? (
                                    <button type="button" onClick={() => setIsEditMode(true)} className="flex items-center justify-center bg-[#6F47EB] text-white py-2 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"><FiEdit className="mr-2" />Chỉnh sửa thông tin</button>
                                ) : (
                                    <>
                                        <button type="button" onClick={() => setIsEditMode(false)} className="flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"><FiXCircle className="mr-2" />Hủy</button>
                                        <button type="submit" className="flex items-center justify-center bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"><FiSave className="mr-2" />Lưu thay đổi</button>
                                    </>
                                )}
                            </div>
                        </form>
                    )}

                    {/* TAB 2: SỔ ĐỊA CHỈ */}
                    {activeTab === 'address' && (
                        <div>
                            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold text-gray-800 flex items-center"><FiMapPin className="mr-3 text-gray-500" />Sổ địa chỉ</h2>{!isAddingAddress && !editingAddress && (<button type="button" onClick={() => { setIsAddingAddress(true); setEditingAddress(null); }} className="flex items-center text-sm text-[#6F47EB] font-semibold hover:underline"><FiPlus className="mr-1" />Thêm địa chỉ mới</button>)}</div>
                            {formData.addresses.length > 0 ? (
                                <ul className="space-y-3">
                                    {formData.addresses.map((addr) => (
                                        <li key={addr.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200"><div className="flex justify-between items-start"><div><span className="font-medium text-gray-800">{addr.street}</span><p className="text-sm text-gray-600">{addr.city}, {addr.province} - {addr.postalCode}</p></div><div className="flex flex-col items-end flex-shrink-0 ml-4 space-y-2">{addr.isDefault && (<span className="text-xs font-bold text-green-600 bg-green-100 py-1 px-2 rounded-full">Mặc định</span>)}<div className="flex items-center space-x-3"><button onClick={() => handleStartEdit(addr)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"><FiEdit className="w-3 h-3 mr-1" /> Sửa</button><button onClick={() => handleDeleteAddress(addr.id)} className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center"><FiTrash2 className="w-3 h-3 mr-1" /> Xóa</button></div></div></div></li>
                                    ))}
                                </ul>
                            ) : (!isAddingAddress && !editingAddress && (<p className="text-gray-500">Bạn chưa có địa chỉ nào.</p>))}
                            {(isAddingAddress || editingAddress) && (<NewAddressForm initialData={editingAddress} onSave={editingAddress ? handleUpdateAddress : handleAddAddress} onCancel={handleCancelForm} />)}
                        </div>
                    )}

                    {/* TAB 3: ĐƠN HÀNG */}
                    {activeTab === 'orders' && (
                        <div>
                            {selectedOrder ? (
                                <OrderDetail
                                    order={selectedOrder}
                                    onBack={() => setSelectedOrder(null)}
                                    onReturnRequest={handleOpenReturnModal}
                                />
                            ) : (
                                <>
                                    <div className="max-w-5xl mx-auto mb-6 flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="🔍 Tìm kiếm theo mã đơn..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                        />

                                        <select
                                            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="all">Tất cả trạng thái</option>
                                            <option value="PENDING">Chờ xác nhận</option>
                                            <option value="PROCESSING">Đang xử lý</option>
                                            <option value="SHIPPED">Đang giao</option>
                                            <option value="Delivered">Đã giao</option>
                                            <option value="Cancelled">Đã hủy</option>
                                            <option value="ReturnRequested">Yêu cầu hoàn trả</option>
                                        </select>
                                    </div>

                                    {filteredOrders.length === 0 && (
                                        <p className="text-center text-gray-500 italic">
                                            Không tìm thấy đơn hàng phù hợp.
                                        </p>
                                    )}

                                    <div className="space-y-6 max-w-5xl mx-auto">
                                        {currentOrders?.map((order) => (
                                            <div key={order.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2"><FiBox className="w-5 h-5 text-blue-600" /><span className="text-sm font-medium text-gray-600">Mã đơn: {order.id}</span></div>
                                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>{statusText[order.status] || 'Chưa xác định trạng thái'}</span>
                                                    </div>
                                                </div>
                                                <div className="p-6 space-y-4">
                                                    {order.items?.slice(0, 2).map((item, idx) => (
                                                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                                            <div className="flex-shrink-0"><img src={item.product?.image} alt={item.product?.name} className="w-20 h-20 object-cover rounded-lg shadow-md" /></div>
                                                            <div className="flex-1 min-w-0"><h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.product?.name}</h4><div className="flex flex-wrap gap-4 text-sm text-gray-600"><div className="flex items-center gap-1"><span className="font-medium">Đơn giá:</span><span className="text-blue-600 font-semibold">{(Number(item.product?.price) || 0).toLocaleString('vi-VN')}₫</span></div><div className="flex items-center gap-1"><span className="font-medium">SL:</span><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">{item.quantity}</span></div></div></div>
                                                        </div>
                                                    ))}
                                                    {order.items?.length > 2 && (<p className="text-center text-sm text-gray-500 italic">và {order.items.length - 2} sản phẩm khác...</p>)}
                                                </div>
                                                <div className="bg-gray-50 px-6 py-4 space-y-3 border-t border-gray-200">
                                                    <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2 text-gray-600"><FiTruck className="w-4 h-4" /><span>Phí vận chuyển</span></div><span className="text-gray-900 font-semibold">{(Number(order.shippingFee) || 0).toLocaleString('vi-VN')}₫</span></div>
                                                    <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2 text-gray-600"><FiCreditCard className="w-4 h-4" /><span>Phương thức</span></div><span className="text-gray-900 font-semibold">{paymentText[order.paymentMethod] || "Không xác định"}</span></div>
                                                    <div className="pt-3 border-t border-gray-300 flex items-center justify-between"><span className="text-base font-bold text-gray-900">Tổng tiền</span><span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{(Number(order.totalAmount) || 0).toLocaleString('vi-VN')}₫</span></div>
                                                    <button onClick={() => setSelectedOrder(order)} className="w-full mt-3 flex items-center justify-center gap-2 bg-[#6F47EB] text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300"><FiEye className="w-4 h-4" />Xem chi tiết</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-6">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => prev - 1)}
                                                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                ‹
                                            </button>

                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`px-4 py-2 rounded-lg border ${
                                                        currentPage === i + 1
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-white hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}

                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(prev => prev + 1)}
                                                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                ›
                                            </button>
                                        </div>
                                    )}

                                </>
                            )}
                        </div>
                    )}

                    {/* TAB 4: LỊCH SỬ TRẢ HÀNG (MỚI) */}
                    {activeTab === 'returns' && (
                        <ReturnRequestsList userId={user.id} token={token} />
                    )}

                    {/* TAB 5: MÃ GIẢM GIÁ */}
                    {activeTab === 'coupons' && (
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><FiTag className="mr-3 text-gray-500" />Mã giảm giá của bạn</h2>
                            {formData.coupons.length > 0 ? (<ul className="space-y-3">{formData.coupons.map((coupon, index) => (<li key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs font-mono">{JSON.stringify(coupon)}</li>))}</ul>) : (<p className="text-gray-500">Bạn không có mã giảm giá nào.</p>)}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default ProfilePage;