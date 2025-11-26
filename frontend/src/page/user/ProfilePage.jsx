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
    FiPackage
} from 'react-icons/fi';

import { motion } from 'framer-motion';

// --- Component OrderDetail được định nghĩa bên trong file ---
const OrderDetail = ({ order, onBack }) => {
    const getStatusColor = (status) => {
        const statusColors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Processing': 'bg-blue-100 text-blue-800 border-blue-300',
            'Shipped': 'bg-purple-100 text-purple-800 border-purple-300',
            'Delivered': 'bg-green-100 text-green-800 border-green-300',
            'Cancelled': 'bg-red-100 text-red-800 border-red-300',
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
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!order) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Không tìm thấy đơn hàng</p>
                <button onClick={onBack} className="text-[#6F47EB] hover:underline">
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="font-[Manrope]">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-[#6F47EB] transition-colors mb-4"
                >
                    <FiArrowLeft className="mr-2" />
                    Quay lại danh sách đơn hàng
                </button>

                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h2>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
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
                        <p className="text-gray-600">{order.shippingAddress?.street}</p>
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
                        <div
                            key={idx}
                            className="flex gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex-shrink-0">
                                <img
                                    src={item.product?.image}
                                    alt={item.product?.name}
                                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-2">{item.product?.name}</h4>

                                <div className="space-y-1 text-sm">
                                    {item.variantId && (
                                        <p className="text-gray-600">
                                            <span className="font-medium">Mã sản phẩm:</span> {item.variantId}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div>
                                            <span className="text-gray-600 font-medium">Đơn giá: </span>
                                            <span className=" font-semibold">
                                                {(Number(item.unitPrice) || 0).toLocaleString('vi-VN')}₫
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-gray-600 font-medium">Số lượng: </span>
                                            <span className="px-2 py-0.5 rounded-full font-semibold">
                                                {item.quantity}
                                            </span>
                                        </div>

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
                        <div className="flex items-center gap-2">
                            <FiTruck className="w-4 h-4" />
                            <span>Phí vận chuyển</span>
                        </div>
                        <span className="font-semibold">
                            {(Number(order.shippingFee) || 0).toLocaleString('vi-VN')}₫
                        </span>
                    </div>

                    {order.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Giảm giá</span>
                            <span className="font-semibold">
                                -{(Number(order.discountAmount) || 0).toLocaleString('vi-VN')}₫
                            </span>
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

// --- Component NewAddressForm ---
const NewAddressForm = ({ onSave, onCancel, initialData }) => {
    const defaultAddress = {
        street: '',
        city: '',
        province: '',
        postalCode: '',
        isDefault: false,
    };

    const [address, setAddress] = useState(defaultAddress);

    useEffect(() => {
        if (initialData) {
            setAddress(initialData);
        } else {
            setAddress(defaultAddress);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
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
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                    {initialData ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </h3>
                <div>
                    <label className="text-sm font-medium text-gray-600">Địa chỉ (Số nhà, Tên đường)</label>
                    <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Quận/Huyện</label>
                        <input
                            type="text"
                            name="city"
                            value={address.city}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Tỉnh/Thành phố</label>
                        <input
                            type="text"
                            name="province"
                            value={address.province}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Mã bưu điện (Postal Code)</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={address.postalCode}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB]"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isDefault"
                        checked={address.isDefault}
                        onChange={handleChange}
                        id="isDefault"
                        className="h-4 w-4 accent-[#6F47EB]"
                    />
                    <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                        Đặt làm địa chỉ mặc định
                    </label>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
                    >
                        {initialData ? 'Cập nhật' : 'Lưu địa chỉ'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

// --- Component ProfilePage chính ---
function ProfilePage() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        userName: '',
        addresses: [],
        coupons: [],
    });
    const [activeTab, setActiveTab] = useState('profile');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // +++ THÊM STATE ĐỂ THEO DÕI ĐƠN HÀNG ĐANG XEM +++
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [message, setMessage] = useState({ type: '', content: '' });
    const navigate = useNavigate();

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

    const paymentText = {
        Credit: "Thẻ Tín dụng",
        Googlepay: "Google Pay",
        Code: "Thanh toán khi nhận"
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Processing': 'bg-blue-100 text-blue-800 border-blue-300',
            'Shipped': 'bg-purple-100 text-purple-800 border-purple-300',
            'Delivered': 'bg-green-100 text-green-800 border-green-300',
            'Cancelled': 'bg-red-100 text-red-800 border-red-300',
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

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
            const res = await axios.put(`http://localhost:8080/api/users/${user.id}`, updateData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updatedUserInStorage = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));
            setUser(updatedUserInStorage);
            setMessage({ type: 'success', content: 'Cập nhật hồ sơ thành công!' });
            setIsEditMode(false);
        } catch (err) {
            setMessage({
                type: 'error',
                content: err.response?.data?.message || 'Lỗi khi cập nhật hồ sơ.',
            });
        }
    };

    const handleAddAddress = async (newAddress) => {
        setMessage({ type: '', content: '' });

        try {
            const res = await axios.post(
                `http://localhost:8080/api/users/${user.id}/addresses`,
                newAddress,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const addedAddress = res.data;

            let newAddressList = [...formData.addresses];
            if (addedAddress.isDefault) {
                newAddressList = newAddressList.map((addr) => ({ ...addr, isDefault: false }));
            }
            newAddressList.push(addedAddress);
            const updatedUserInStorage = { ...user, addresses: newAddressList };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));

            setUser(updatedUserInStorage);
            setFormData((prev) => ({ ...prev, addresses: newAddressList }));

            setMessage({ type: 'success', content: 'Thêm địa chỉ mới thành công!' });
            setIsAddingAddress(false);
        } catch (err) {
            setMessage({
                type: 'error',
                content: err.response?.data?.message || 'Lỗi khi thêm địa chỉ.',
            });
        }
    };

    const handleUpdateAddress = async (addressData) => {
        setMessage({ type: '', content: '' });
        try {
            const res = await axios.put(
                `http://localhost:8080/api/users/${user.id}/addresses/${addressData.id}`,
                addressData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedAddress = res.data;

            let newAddressList = formData.addresses.map((addr) =>
                addr.id === updatedAddress.id ? updatedAddress : addr
            );

            if (updatedAddress.isDefault) {
                newAddressList = newAddressList.map((addr) =>
                    addr.id === updatedAddress.id ? addr : { ...addr, isDefault: false }
                );
            }

            const updatedUserInStorage = { ...user, addresses: newAddressList };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));

            setUser(updatedUserInStorage);
            setFormData((prev) => ({ ...prev, addresses: newAddressList }));

            setMessage({ type: 'success', content: 'Cập nhật địa chỉ thành công!' });
            setEditingAddress(null);
        } catch (err) {
            setMessage({
                type: 'error',
                content: err.response?.data?.message || 'Lỗi khi cập nhật địa chỉ.',
            });
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            return;
        }

        setMessage({ type: '', content: '' });
        try {
            await axios.delete(`http://localhost:8080/api/users/${user.id}/addresses/${addressId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const newAddressList = formData.addresses.filter((addr) => addr.id !== addressId);

            const updatedUserInStorage = { ...user, addresses: newAddressList };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));

            setUser(updatedUserInStorage);
            setFormData((prev) => ({ ...prev, addresses: newAddressList }));

            setMessage({ type: 'success', content: 'Xóa địa chỉ thành công!' });
        } catch (err) {
            setMessage({
                type: 'error',
                content: err.response?.data?.message || 'Lỗi khi xóa địa chỉ.',
            });
        }
    };

    const handleStartEdit = (addressToEdit) => {
        setEditingAddress(addressToEdit);
        setIsAddingAddress(false);
    };

    const handleCancelForm = () => {
        setIsAddingAddress(false);
        setEditingAddress(null);
    };

    // +++ HÀM MỚI: Xem chi tiết đơn hàng +++
    const handleViewOrderDetail = (order) => {
        setSelectedOrder(order);
    };

    // +++ HÀM MỚI: Quay lại danh sách đơn hàng +++
    const handleBackToOrders = () => {
        setSelectedOrder(null);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="bg-gray-50 py-10 font-[Manrope]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-8xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden"
            >
                <div className="md:flex">
                    <div className="md:w-1/3 bg-gray-100 p-8 flex flex-col items-center justify-center border-r border-gray-200">
                        <FiUser className="text-8xl text-gray-400" />
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">{user.userName}</h2>
                        <p className="text-gray-500">{user.email}</p>
                        {!isEditMode && (
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="mt-6 flex items-center justify-center bg-[#6F47EB] text-white py-2 px-5 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300"
                            >
                                <FiEdit className="mr-2" />
                                Chỉnh sửa
                            </button>
                        )}
                    </div>

                    <div className="md:w-2/3 p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Hồ Sơ Của Tôi</h1>

                        <div className="flex space-x-6 border-b pb-2 mb-6 text-gray-600 font-medium">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`${
                                    activeTab === 'profile'
                                        ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]'
                                        : ''
                                }`}
                            >
                                Thông tin cá nhân
                            </button>

                            <button
                                onClick={() => setActiveTab('address')}
                                className={`${
                                    activeTab === 'address'
                                        ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]'
                                        : ''
                                }`}
                            >
                                Sổ địa chỉ
                            </button>

                            <button
                                onClick={() => {
                                    setActiveTab('orders');
                                    setSelectedOrder(null); // Reset khi chuyển tab
                                }}
                                className={`${
                                    activeTab === 'orders'
                                        ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]'
                                        : ''
                                }`}
                            >
                                Đơn hàng
                            </button>

                            <button
                                onClick={() => setActiveTab('coupons')}
                                className={`${
                                    activeTab === 'coupons'
                                        ? 'text-[#6F47EB] border-b-2 border-[#6F47EB]'
                                        : ''
                                }`}
                            >
                                Mã giảm giá
                            </button>
                        </div>

                        {message.content && (
                            <p
                                className={`text-sm p-3 rounded-lg mb-4 ${
                                    message.type === 'success'
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                            >
                                {message.content}
                            </p>
                        )}

                        {/* TAB 1: THÔNG TIN CÁ NHÂN */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Họ</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            disabled={!isEditMode}
                                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB] disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Tên</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            disabled={!isEditMode}
                                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB] disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB] disabled:bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={formData.userName}
                                        disabled
                                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB] disabled:bg-gray-100"
                                    />
                                </div>

                                {isEditMode && (
                                    <div className="flex justify-end space-x-4 mt-8">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditMode(false)}
                                            className="flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-5 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
                                        >
                                            <FiXCircle className="mr-2" />
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex items-center justify-center bg-green-600 text-white py-2 px-5 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
                                        >
                                            <FiSave className="mr-2" />
                                            Lưu
                                        </button>
                                    </div>
                                )}
                            </form>
                        )}

                        {/* TAB 2: SỔ ĐỊA CHỈ */}
                        {activeTab === 'address' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                        <FiMapPin className="mr-3 text-gray-500" />
                                        Sổ địa chỉ
                                    </h2>

                                    {!isAddingAddress && !editingAddress && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAddingAddress(true);
                                                setEditingAddress(null);
                                            }}
                                            className="flex items-center text-sm text-[#6F47EB] font-semibold hover:underline"
                                        >
                                            <FiPlus className="mr-1" />
                                            Thêm địa chỉ mới
                                        </button>
                                    )}
                                </div>

                                {formData.addresses.length > 0 ? (
                                    <ul className="space-y-3">
                                        {formData.addresses.map((addr) => (
                                            <li
                                                key={addr.id}
                                                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="font-medium text-gray-800">
                                                            {addr.street}
                                                        </span>
                                                        <p className="text-sm text-gray-600">
                                                            {addr.city}, {addr.province} - {addr.postalCode}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col items-end flex-shrink-0 ml-4 space-y-2">
                                                        {addr.isDefault && (
                                                            <span className="text-xs font-bold text-green-600 bg-green-100 py-1 px-2 rounded-full">
                                                                Mặc định
                                                            </span>
                                                        )}
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => handleStartEdit(addr)}
                                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                                                            >
                                                                <FiEdit className="w-3 h-3 mr-1" /> Sửa
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAddress(addr.id)}
                                                                className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center"
                                                            >
                                                                <FiTrash2 className="w-3 h-3 mr-1" /> Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    !isAddingAddress &&
                                    !editingAddress && (
                                        <p className="text-gray-500">Bạn chưa có địa chỉ nào.</p>
                                    )
                                )}

                                {(isAddingAddress || editingAddress) && (
                                    <NewAddressForm
                                        initialData={editingAddress}
                                        onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
                                        onCancel={handleCancelForm}
                                    />
                                )}
                            </div>
                        )}

                        {/* TAB 3: ĐƠN HÀNG */}
                        {activeTab === 'orders' && (
                            <div>
                                {/* +++ HIỂN THỊ CHI TIẾT ĐƠN HÀNG NẾU ĐÃ CHỌN +++ */}
                                {selectedOrder ? (
                                    <OrderDetail order={selectedOrder} onBack={handleBackToOrders} />
                                ) : (
                                    <>
                                        {/* Danh sách đơn hàng */}
                                        {orders.length === 0 && (
                                            <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                                        )}

                                        <div className="space-y-6 p-4 max-w-4xl mx-auto">
                                            {orders?.map((order) => (
                                                <div
                                                    key={order._id}
                                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
                                                >
                                                    {/* Header */}
                                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <FiBox className="w-5 h-5 text-blue-600" />
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    Mã đơn: {order.id}
                                                                </span>
                                                            </div>
                                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Items - Hiển thị tóm tắt */}
                                                    <div className="p-6 space-y-4">
                                                        {order.items?.slice(0, 2).map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                                            >
                                                                <div className="flex-shrink-0">
                                                                    <img
                                                                        src={item.product?.image}
                                                                        alt={item.product?.name}
                                                                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                                                                    />
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                                        {item.product?.name}
                                                                    </h4>

                                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="font-medium">
                                                                                Đơn giá:
                                                                            </span>
                                                                            <span className="text-blue-600 font-semibold">
                                                                                {(
                                                                                    Number(item.product?.price) || 0
                                                                                ).toLocaleString('vi-VN')}
                                                                                ₫
                                                                            </span>
                                                                        </div>

                                                                        <div className="flex items-center gap-1">
                                                                            <span className="font-medium">SL:</span>
                                                                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                                                                                {item.quantity}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* Hiển thị thông báo nếu có nhiều hơn 2 sản phẩm */}
                                                        {order.items?.length > 2 && (
                                                            <p className="text-center text-sm text-gray-500 italic">
                                                                và {order.items.length - 2} sản phẩm khác...
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Summary */}
                                                    <div className="bg-gray-50 px-6 py-4 space-y-3 border-t border-gray-200">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <FiTruck className="w-4 h-4" />
                                                                <span>Phí vận chuyển</span>
                                                            </div>
                                                            <span className="text-gray-900 font-semibold">
                                                                {(
                                                                    Number(order.shippingFee) || 0
                                                                ).toLocaleString('vi-VN')}
                                                                ₫
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <FiCreditCard className="w-4 h-4" />
                                                                <span>Phương thức</span>
                                                            </div>
                                                            <span className="text-gray-900 font-semibold">
                                                                {paymentText[order.paymentMethod] || "Không xác định"}
                                                            </span>

                                                        </div>

                                                        <div className="pt-3 border-t border-gray-300 flex items-center justify-between">
                                                            <span className="text-base font-bold text-gray-900">
                                                                Tổng tiền
                                                            </span>
                                                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                                {(
                                                                    Number(order.totalAmount) || 0
                                                                ).toLocaleString('vi-VN')}
                                                                ₫
                                                            </span>
                                                        </div>

                                                        {/* +++ NÚT XEM CHI TIẾT +++ */}
                                                        <button
                                                            onClick={() => handleViewOrderDetail(order)}
                                                            className="w-full mt-3 flex items-center justify-center gap-2 bg-[#6F47EB] text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300"
                                                        >
                                                            <FiEye className="w-4 h-4" />
                                                            Xem chi tiết
                                                        </button>
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
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <FiTag className="mr-3 text-gray-500" />
                                    Mã giảm giá của bạn
                                </h2>

                                {formData.coupons.length > 0 ? (
                                    <ul className="space-y-3">
                                        {formData.coupons.map((coupon, index) => (
                                            <li
                                                key={index}
                                                className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs font-mono"
                                            >
                                                {JSON.stringify(coupon)}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Bạn không có mã giảm giá nào.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default ProfilePage;