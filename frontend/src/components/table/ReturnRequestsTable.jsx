import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiCheckCircle, FiXCircle, FiRotateCcw, FiBox, FiUser, FiImage } from 'react-icons/fi';
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';

const ReturnRequestsTable = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // State cho Modal chi tiết
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch dữ liệu
    useEffect(() => {
        const fetchReturns = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await axios.get("http://localhost:8080/api/returns", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Sắp xếp mới nhất lên đầu
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

    const handleUpdateStatus = async (id, newStatus) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập lại.");
            return;
        }

        const confirmMsg = newStatus === 'APPROVED'
            ? "Bạn có chắc muốn DUYỆT yêu cầu này? (Khách sẽ gửi hàng về)"
            : (newStatus === 'REFUNDED'
                ? "Xác nhận ĐÃ NHẬN HÀNG & HOÀN TIỀN cho khách?"
                : "Bạn có chắc muốn TỪ CHỐI yêu cầu này?");

        if (!window.confirm(confirmMsg)) return;

        try {
            await axios.put(`http://localhost:8080/api/returns/${id}/status`,
                {
                    status: newStatus,
                    adminNote: newStatus === 'APPROVED' ? "Admin đã duyệt, vui lòng gửi hàng." : "Đã xử lý."
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));

            // Nếu đang mở modal của đơn này thì cũng cập nhật state modal hoặc đóng lại
            if (selectedRequest && selectedRequest.id === id) {
                setIsModalOpen(false);
                setSelectedRequest(null);
            }
            alert("Thao tác thành công!");
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.error || error.message));
        }
    };

    const openDetailModal = (req) => {
        setSelectedRequest(req);
        setIsModalOpen(true);
    };

    const getStatusBadge = (status) => {
        const styles = {
            'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'APPROVED': 'bg-blue-100 text-blue-800 border-blue-200',
            'REFUNDED': 'bg-green-100 text-green-800 border-green-200',
            'REJECTED': 'bg-red-100 text-red-800 border-red-200',
            'COMPLETED': 'bg-purple-100 text-purple-800 border-purple-200'
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
                        <th className="px-6 py-4 text-left font-bold">Lý do chính</th>
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

            {/* --- MODAL CHI TIẾT (Phần mới thêm) --- */}
            <AnimatePresence>
                {isModalOpen && selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header Modal */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Chi tiết Yêu cầu Trả hàng</h2>
                                    <p className="text-sm text-gray-500 mt-1">Mã đơn gốc: <span className="font-mono font-bold text-gray-700">{selectedRequest.orderId}</span></p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <FiXCircle size={28} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Phần 1: Thông tin sản phẩm trả */}
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><FiBox className="text-indigo-600"/> Sản phẩm yêu cầu trả</h3>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-600">
                                            <tr>
                                                <th className="p-3">Sản phẩm</th>
                                                <th className="p-3">Phân loại</th>
                                                <th className="p-3 text-center">SL</th>
                                                <th className="p-3 text-right">Hoàn tiền</th>
                                                <th className="p-3">Lý do / Ghi chú</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                            {selectedRequest.items?.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-3 flex items-center gap-3">
                                                        <img src={item.product?.image} alt="" className="w-12 h-12 rounded border object-cover" />
                                                        <span className="font-medium text-gray-800 line-clamp-2 w-48" title={item.product?.name}>{item.product?.name}</span>
                                                    </td>
                                                    <td className="p-3 text-gray-500">{item.variantId || "Mặc định"}</td>
                                                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                                                    <td className="p-3 text-right text-indigo-600 font-bold">{(item.refundPrice || 0).toLocaleString('vi-VN')}₫</td>
                                                    <td className="p-3 text-gray-600 italic">{item.note || "Không có"}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Phần 2: Lý do & Hình ảnh */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="font-bold text-gray-700 mb-2">Lý do chung từ khách:</h4>
                                        <p className="text-gray-800 whitespace-pre-wrap">{selectedRequest.reason}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><FiImage /> Hình ảnh bằng chứng:</h4>
                                        {selectedRequest.images && selectedRequest.images.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRequest.images.map((img, i) => (
                                                    <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 border rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                                                        <img src={img} alt="Proof" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-sm italic">Khách không gửi kèm ảnh.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Modal - Action Buttons */}
                            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                                {selectedRequest.status === 'PENDING' && (
                                    <>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedRequest.id, 'REJECTED')}
                                            className="px-5 py-2.5 bg-white border border-red-300 text-red-600 rounded-lg font-bold hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <FiXCircle /> Từ chối trả hàng
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedRequest.id, 'APPROVED')}
                                            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2"
                                        >
                                            <FiCheckCircle /> Đồng ý trả hàng
                                        </button>
                                    </>
                                )}

                                {selectedRequest.status === 'APPROVED' && (
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm text-blue-600 font-medium italic">
                                            * Đơn đã được duyệt. Khi nhận được hàng hoàn, hãy bấm nút bên phải.
                                        </p>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedRequest.id, 'REFUNDED')}
                                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg flex items-center gap-2"
                                        >
                                            <FiRotateCcw /> Đã nhận hàng & Hoàn tiền
                                        </button>
                                    </div>
                                )}

                                {['REFUNDED', 'REJECTED'].includes(selectedRequest.status) && (
                                    <span className="text-gray-500 font-bold italic py-2">Yêu cầu này đã kết thúc.</span>
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