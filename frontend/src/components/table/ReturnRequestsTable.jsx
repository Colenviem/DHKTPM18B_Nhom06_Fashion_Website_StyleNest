import React, { useState, useEffect } from 'react';
import { FiSearch, FiCheckCircle, FiXCircle, FiRotateCcw, FiBox, FiUser, FiImage, FiX, FiEdit } from 'react-icons/fi';
import axiosClient from "../../api/axiosClient";
import { motion, AnimatePresence } from 'framer-motion';

const ReturnRequestsTable = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [adminNote, setAdminNote] = useState('');
    const [itemDecisions, setItemDecisions] = useState({}); // { "variantId": "APPROVED" }

    useEffect(() => {
        const fetchReturns = async () => {
            try {
                const res = await axiosClient.get("/returns");

                const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRequests(sortedData);
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReturns();
    }, []);

    const openDetailModal = (req) => {
        setSelectedRequest(req);
        setAdminNote(req.adminNote || '');

        const initialDecisions = {};
        req.items.forEach(item => {
            const key = item.variantId || item.product.id;
            initialDecisions[key] = item.status || 'APPROVED';
        });
        setItemDecisions(initialDecisions);

        setIsModalOpen(true);
    };

    const handleItemDecisionChange = (key, status) => {
        setItemDecisions(prev => ({ ...prev, [key]: status }));
    };

    const handleSubmitDecision = async () => {
        const isAllRejected = Object.values(itemDecisions).every(s => s === 'REJECTED');
        if (isAllRejected && !adminNote.trim()) {
            alert("Bạn đã từ chối tất cả sản phẩm. Vui lòng nhập lý do vào ô 'Phản hồi'.");
            return;
        }

        if (!window.confirm("Xác nhận xử lý yêu cầu này?")) return;
        const itemsPayload = selectedRequest.items.map(item => ({
            productId: item.product.id,
            variantId: item.variantId,
            status: itemDecisions[item.variantId || item.product.id]
        }));

        try {

            await axiosClient.put(`/returns/${selectedRequest.id}/status`,
                {
                    status: 'PROCESSED',
                    adminNote: adminNote,
                    items: itemsPayload
                }
            );

            alert("Đã lưu quyết định xử lý!");
            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            const msg = error.response?.data?.error || error.message;
            alert("Lỗi: " + msg);
        }
    };

    const handleRefundConfirm = async () => {
        if (!window.confirm("Xác nhận đã nhận hàng và hoàn tiền cho khách?")) return;

        try {
            await axiosClient.put(`/returns/${selectedRequest.id}/status`,
                {
                    status: 'REFUNDED',
                    adminNote: adminNote
                }
            );
            alert("Đã cập nhật trạng thái Hoàn tiền!");
            window.location.reload();
        } catch (error) {
            const msg = error.response?.data?.error || error.message;
            alert("Lỗi: " + msg);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'APPROVED': 'bg-blue-100 text-blue-800 border-blue-200',
            'REFUNDED': 'bg-green-100 text-green-800 border-green-200',
            'REJECTED': 'bg-red-100 text-red-800 border-red-200',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100'}`}>
                {status}
            </span>
        );
    };

    const filteredRequests = requests.filter(req =>
        (req.id && req.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (req.orderId && req.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen pt-24 font-[Manrope]">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Quản lý Đổi / Trả hàng</h1>
            </div>

            {/* Search */}
            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="relative max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm mã yêu cầu, mã đơn hàng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4 text-left font-bold">Mã Yêu cầu</th>
                        <th className="px-6 py-4 text-left font-bold">Khách hàng</th>
                        <th className="px-6 py-4 text-left font-bold">Lý do</th>
                        <th className="px-6 py-4 text-left font-bold">Hoàn tiền (Dự kiến)</th>
                        <th className="px-6 py-4 text-center font-bold">Trạng thái</th>
                        <th className="px-6 py-4 text-right font-bold">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {loading ? <tr><td colSpan="6" className="p-8 text-center">Đang tải...</td></tr> :
                        filteredRequests.length === 0 ? <tr><td colSpan="6" className="p-8 text-center text-gray-500">Không có dữ liệu</td></tr> :
                            filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-indigo-600 cursor-pointer hover:underline" onClick={() => openDetailModal(req)}>
                                        #{req.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500"><FiUser /></div>
                                            <span className="text-gray-700 text-xs">{req.userId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={req.reason}>{req.reason}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{(req.totalRefundAmount || 0).toLocaleString('vi-VN')}₫</td>
                                    <td className="px-6 py-4 text-center">{getStatusBadge(req.status)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openDetailModal(req)}
                                            className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-indigo-100"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL CHI TIẾT --- */}
            <AnimatePresence>
                {isModalOpen && selectedRequest && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-md p-4 font-[Manrope]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-100"
                        >
                            {/* Header Modal */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Xử lý Yêu cầu Trả hàng</h2>
                                    <p className="text-sm text-gray-500 mt-1">Mã đơn gốc: <span className="font-mono font-bold text-gray-700">{selectedRequest.orderId}</span></p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 hover:bg-gray-100">
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* 1. Bảng duyệt từng sản phẩm */}
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <FiBox className="text-indigo-600"/> 1. Duyệt sản phẩm
                                    </h3>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-600">
                                            <tr>
                                                <th className="p-3">Sản phẩm</th>
                                                <th className="p-3 text-center">SL</th>
                                                <th className="p-3">Ghi chú từ khách</th>
                                                <th className="p-3 text-center w-40">Quyết định</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                            {selectedRequest.items?.map((item, idx) => {
                                                const key = item.variantId || item.product.id;
                                                // Chỉ cho sửa nếu đơn đang chờ duyệt (PENDING)
                                                const isEditable = selectedRequest.status === 'PENDING';

                                                return (
                                                    <tr key={idx}>
                                                        <td className="p-3 flex items-center gap-3">
                                                            <img src={item.product?.image} alt="" className="w-12 h-12 rounded border object-cover bg-gray-50" />
                                                            <div>
                                                                <p className="font-semibold text-gray-800 line-clamp-1">{item.product?.name}</p>
                                                                <p className="text-xs text-gray-500">{item.variantId || "Mặc định"}</p>
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-center font-bold">{item.quantity}</td>
                                                        <td className="p-3 text-gray-600 italic">{item.note || "---"}</td>
                                                        <td className="p-3 text-center">
                                                            {isEditable ? (
                                                                <select
                                                                    value={itemDecisions[key]}
                                                                    onChange={(e) => handleItemDecisionChange(key, e.target.value)}
                                                                    className={`p-2 rounded-lg border font-bold text-xs outline-none cursor-pointer w-full ${
                                                                        itemDecisions[key] === 'APPROVED'
                                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                                            : 'bg-red-50 text-red-700 border-red-200'
                                                                    }`}
                                                                >
                                                                    <option value="APPROVED">✅ Đồng ý</option>
                                                                    <option value="REJECTED">❌ Từ chối</option>
                                                                </select>
                                                            ) : (
                                                                // Read-only mode
                                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                                    (item.status || 'APPROVED') === 'APPROVED'
                                                                        ? 'text-green-600 bg-green-100'
                                                                        : 'text-red-600 bg-red-100'
                                                                }`}>
                                                                        {item.status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}
                                                                    </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* 2. Lý do & Ảnh từ khách */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="font-bold text-gray-700 mb-2">Lý do chung:</h4>
                                        <p className="text-gray-800 whitespace-pre-wrap">{selectedRequest.reason}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><FiImage /> Ảnh bằng chứng:</h4>
                                        {selectedRequest.images && selectedRequest.images.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRequest.images.map((img, i) => (
                                                    <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 border rounded-lg overflow-hidden hover:opacity-80 transition-opacity shadow-sm">
                                                        <img src={img} alt="Proof" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 text-sm italic">Không có ảnh đính kèm.</div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <FiEdit className="text-indigo-600"/> 2. Phản hồi tới khách hàng
                                    </h3>
                                    <textarea
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        disabled={selectedRequest.status !== 'PENDING'}
                                        placeholder="Nhập lý do từ chối hoặc ghi chú cho khách..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 z-10">
                                {selectedRequest.status === 'PENDING' ? (
                                    <>
                                        <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">Hủy bỏ</button>
                                        <button
                                            onClick={handleSubmitDecision}
                                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2 transition-transform transform hover:-translate-y-0.5"
                                        >
                                            <FiCheckCircle /> Xác nhận xử lý
                                        </button>
                                    </>
                                ) : (
                                    selectedRequest.status === 'APPROVED' ? (
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-blue-600 italic font-medium">Đơn đã duyệt. Chờ nhận hàng.</span>
                                            <button
                                                onClick={handleRefundConfirm}
                                                className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg flex items-center gap-2 transition-transform transform hover:-translate-y-0.5"
                                            >
                                                <FiRotateCcw /> Đã nhận hàng & Hoàn tiền
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500 font-bold italic py-2 flex items-center gap-2">
                                            {selectedRequest.status === 'REFUNDED' ? <FiCheckCircle className="text-green-500"/> : <FiXCircle className="text-red-500"/>}
                                            Yêu cầu này đã kết thúc ({selectedRequest.status}).
                                        </span>
                                    )
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReturnRequestsTable;