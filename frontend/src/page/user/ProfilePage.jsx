import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FiUser,
    FiEdit,
    FiSave,
    FiXCircle,
    FiMapPin,
    FiTag,
    FiPlus,
    FiTrash2,
    FiBox,
    FiTruck,
    FiCreditCard,
    FiEye,
    FiArrowLeft,
    FiCalendar,
    FiPackage,
    FiRotateCcw // Icon cho nút trả hàng
} from 'react-icons/fi';

import { motion, AnimatePresence } from 'framer-motion';

// --- 1. Component Modal Yêu cầu trả hàng ---
const ReturnRequestModal = ({ isOpen, onClose, order, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [imageUrls, setImageUrls] = useState(''); // Chuỗi link ảnh cách nhau dấu phẩy
    // State lưu danh sách item được chọn: Key là variantId (hoặc productId nếu variantId null)
    const [selectedItems, setSelectedItems] = useState({});

    if (!isOpen || !order) return null;

    // Xử lý khi tick chọn/bỏ chọn sản phẩm
    const handleCheckboxChange = (item) => {
        // Sử dụng variantId làm key, nếu null thì dùng productId để tránh lỗi key
        const key = item.variantId || item.product.id;

        setSelectedItems((prev) => {
            const newState = { ...prev };
            if (newState[key]) {
                delete newState[key]; // Bỏ chọn
            } else {
                // Chọn mặc định số lượng 1
                newState[key] = {
                    productId: item.product.id,
                    variantId: item.variantId, // Giữ nguyên giá trị (có thể là null) để gửi về BE
                    quantity: 1,
                    note: '',
                    maxQuantity: item.quantity, // Lưu lại số lượng max để validate UI
                    productName: item.product.name,
                    productImage: item.product.image
                };
            }
            return newState;
        });
    };

    // Xử lý thay đổi số lượng trả
    const handleQuantityChange = (key, newQty) => {
        setSelectedItems((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                quantity: Math.min(Math.max(1, newQty), prev[key].maxQuantity)
            }
        }));
    };

    // Xử lý thay đổi ghi chú từng món
    const handleNoteChange = (key, note) => {
        setSelectedItems((prev) => ({
            ...prev,
            [key]: { ...prev[key], note: note }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Chuyển đổi object selectedItems thành mảng payload
        const itemsPayload = Object.values(selectedItems).map(item => ({
            productId: item.productId,
            variantId: item.variantId, // Backend sẽ dùng Objects.equals để so sánh cái này
            quantity: item.quantity,
            note: item.note
        }));

        if (itemsPayload.length === 0) {
            alert("Vui lòng chọn ít nhất 1 sản phẩm để trả.");
            return;
        }

        const payload = {
            orderId: order.id,
            reason: reason,
            images: imageUrls.split(',').map(url => url.trim()).filter(url => url !== ''),
            items: itemsPayload
        };

        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/10 backdrop-blur-md p-4 font-[Manrope]">
        <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-gray-800">Yêu cầu Trả hàng / Hoàn tiền</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <FiXCircle className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Danh sách sản phẩm */}
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Chọn sản phẩm cần trả:</h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {order.items.map((item, index) => {
                                // Tạo key duy nhất cho UI
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

                                                {/* Khu vực nhập số lượng trả nếu được chọn */}
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
                                                                <label className="text-xs font-semibold text-gray-600 block mb-1">Ghi chú (Lỗi gì?)</label>
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

                    {/* Lý do chung & Ảnh */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2 text-sm">Lý do trả hàng chung (*)</label>
                            <textarea
                                required
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Mô tả chi tiết lý do bạn muốn trả hàng..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F47EB] focus:border-transparent outline-none h-24 text-sm resize-none"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2 text-sm">Hình ảnh minh chứng</label>
                            <input
                                type="text"
                                value={imageUrls}
                                onChange={(e) => setImageUrls(e.target.value)}
                                placeholder="Dán link ảnh (cách nhau bởi dấu phẩy)"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F47EB] focus:border-transparent outline-none text-sm"
                            />
                            <p className="text-xs text-gray-400 mt-1">Ví dụ: https://imgur.com/anh1.jpg, https://imgur.com/anh2.png</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-bold text-sm transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-[#6F47EB] text-white rounded-lg hover:bg-indigo-700 font-bold text-sm shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                        >
                            Gửi yêu cầu
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// --- 2. Component OrderDetail (Hiển thị chi tiết và Nút trả hàng) ---
const OrderDetail = ({ order, onBack, onReturnRequest }) => {
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

    const paymentText = {
        Credit: "Thẻ Tín dụng",
        Googlepay: "Google Pay",
        Code: "Thanh toán khi nhận"
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (!order) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Không tìm thấy đơn hàng</p>
                <button onClick={onBack} className="text-[#6F47EB] hover:underline">Quay lại</button>
            </div>
        );
    }

    // Kiểm tra điều kiện hiển thị nút trả hàng
    const canReturn = order.status === 'Delivered' || order.status === 'Completed';

    return (
        <div className="font-[Manrope]">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-[#6F47EB] transition-colors mb-4"
                >
                    <FiArrowLeft className="mr-2" /> Quay lại danh sách đơn hàng
                </button>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h2>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </div>

                    {/* NÚT YÊU CẦU TRẢ HÀNG */}
                    {canReturn && (
                        <button
                            onClick={() => onReturnRequest(order)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold shadow-sm"
                        >
                            <FiRotateCcw /> Yêu cầu trả hàng
                        </button>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                        <FiBox className="w-5 h-5 text-[#6F47EB] mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Mã đơn hàng</p>
                            <p className="font-semibold text-gray-900">{order.id}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <FiCalendar className="w-5 h-5 text-[#6F47EB] mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                            <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <FiCreditCard className="w-5 h-5 text-[#6F47EB] mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                            {paymentText[order.paymentMethod] || "Không xác định"}
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <FiUser className="w-5 h-5 text-[#6F47EB] mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Người đặt</p>
                            <p className="font-semibold text-gray-900">{order.user?.userName}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200"
            >
                <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 text-[#6F47EB] mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Địa chỉ giao hàng</h3>
                        <p className="text-gray-700 font-medium">{order.shippingAddress?.name}</p>
                        <p className="text-gray-600">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                        <p className="text-gray-600 text-sm">SĐT: {order.shippingAddress?.phoneNumber}</p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200"
            >
                <div className="flex items-center gap-2 mb-4">
                    <FiPackage className="w-5 h-5 text-[#6F47EB]" />
                    <h3 className="font-semibold text-gray-900">Sản phẩm ({order.items?.length || 0})</h3>
                </div>

                <div className="space-y-4">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex-shrink-0">
                                <img src={item.product?.image} alt={item.product?.name} className="w-24 h-24 object-cover rounded-lg shadow-md" />
                            </div>
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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200"
            >
                <h3 className="font-semibold text-gray-900 mb-4">Tổng quan đơn hàng</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                        <div className="flex items-center gap-2"><FiTruck className="w-4 h-4" /><span>Phí vận chuyển</span></div>
                        <span className="font-semibold">{(Number(order.shippingFee) || 0).toLocaleString('vi-VN')}₫</span>
                    </div>
                    {order.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Giảm giá</span><span className="font-semibold">-{(Number(order.discountAmount) || 0).toLocaleString('vi-VN')}₫</span>
                        </div>
                    )}
                    <div className="pt-3 border-t-2 border-gray-300 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#6F47EB] to-purple-600 bg-clip-text text-transparent">
                            {(Number(order.totalAmount) || 0).toLocaleString('vi-VN')}₫
                        </span>
                    </div>
                </div>
            </motion.div>

            {order.updatedAt && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-6 text-sm text-gray-500"
                >
                    Cập nhật lần cuối: {formatDate(order.updatedAt)}
                </motion.div>
            )}
        </div>
    );
};

// --- 3. Component NewAddressForm (Giữ nguyên) ---
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
                <div>
                    <label className="text-sm font-medium text-gray-600">Địa chỉ (Số nhà, Tên đường)</label>
                    <input type="text" name="street" value={address.street} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-gray-600">Quận/Huyện</label><input type="text" name="city" value={address.city} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]" /></div>
                    <div><label className="text-sm font-medium text-gray-600">Tỉnh/Thành phố</label><input type="text" name="province" value={address.province} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]" /></div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Mã bưu điện (Postal Code)</label>
                    <input type="text" name="postalCode" value={address.postalCode} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]" />
                </div>
                <div className="flex items-center">
                    <input type="checkbox" name="isDefault" checked={address.isDefault} onChange={handleChange} id="isDefault" className="h-4 w-4 accent-[#6F47EB]" />
                    <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={onCancel} className="flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300">Hủy</button>
                    <button type="submit" className="flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300">{initialData ? 'Cập nhật' : 'Lưu địa chỉ'}</button>
                </div>
            </form>
        </motion.div>
    );
};

// --- 4. Component ProfilePage chính ---
function ProfilePage() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', userName: '', addresses: [], coupons: [] });
    const [activeTab, setActiveTab] = useState('profile');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // --- State cho Modal Trả hàng ---
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [orderToReturn, setOrderToReturn] = useState(null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [message, setMessage] = useState({ type: '', content: '' });
    const navigate = useNavigate();

    // Load User
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

    // Load Orders
    useEffect(() => {
        if (activeTab === 'orders' && user && token) {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const res = await axios.get(`http://localhost:8080/api/orders/user/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setOrders(res.data);
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

    // --- Các hàm xử lý User & Address (Giữ nguyên) ---
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

    // --- LOGIC XỬ LÝ TRẢ HÀNG ---
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
            setMessage({ type: 'success', content: 'Gửi yêu cầu trả hàng thành công! Chúng tôi sẽ sớm liên hệ.' });
            handleCloseReturnModal();
            setSelectedOrder(null); // Quay lại danh sách đơn
            // Có thể reload lại danh sách đơn hàng ở đây nếu cần cập nhật trạng thái
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

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="w-full p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
                    </div>

                    <div className="flex space-x-6 border-b pb-2 mb-6 text-gray-600 font-medium overflow-x-auto">
                        <button onClick={() => setActiveTab('profile')} className={`whitespace-nowrap ${activeTab === 'profile' ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]' : ''}`}>Thông tin cá nhân</button>
                        <button onClick={() => setActiveTab('address')} className={`whitespace-nowrap ${activeTab === 'address' ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]' : ''}`}>Sổ địa chỉ</button>
                        <button onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }} className={`whitespace-nowrap ${activeTab === 'orders' ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]' : ''}`}>Đơn hàng</button>
                        <button onClick={() => setActiveTab('coupons')} className={`whitespace-nowrap ${activeTab === 'coupons' ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]' : ''}`}>Mã giảm giá</button>
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
                                    onReturnRequest={handleOpenReturnModal} // Truyền prop này
                                />
                            ) : (
                                <>
                                    {orders.length === 0 && (<p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>)}
                                    <div className="space-y-6 max-w-5xl mx-auto">
                                        {orders?.map((order) => (
                                            <div key={order.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2"><FiBox className="w-5 h-5 text-blue-600" /><span className="text-sm font-medium text-gray-600">Mã đơn: {order.id}</span></div>
                                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>{order.status}</span>
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
                                </>
                            )}
                        </div>
                    )}

                    {/* TAB 4: MÃ GIẢM GIÁ */}
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