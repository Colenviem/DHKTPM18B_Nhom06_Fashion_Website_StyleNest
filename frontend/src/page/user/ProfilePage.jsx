// src/page/user/ProfilePage.jsx (Cập nhật: Tích hợp form địa chỉ)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiEdit, FiSave, FiXCircle, FiMapPin, FiTag, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

// 1. Component form địa chỉ, được định nghĩa *bên trong* ProfilePage
const NewAddressForm = ({ onSave, onCancel }) => {
    const [address, setAddress] = useState({
        street: '',
        city: '',
        province: '',
        postalCode: '',
        isDefault: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Thêm validation (kiểm tra rỗng) ở đây nếu cần
        if (!address.street || !address.city || !address.province || !address.postalCode) {
            alert("Vui lòng điền đầy đủ thông tin địa chỉ.");
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
                <h3 className="text-lg font-semibold text-gray-700">Thêm địa chỉ mới</h3>
                {/* Tên đường */}
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
                {/* Tỉnh/Thành phố */}
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
                {/* Mã bưu điện */}
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
                {/* Đặt làm mặc định */}
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
                {/* Nút bấm */}
                <div className="flex justify-end space-x-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold
                       hover:bg-gray-300 transition-all duration-300"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-lg font-semibold
                       hover:bg-green-700 transition-all duration-300"
                    >
                        Lưu địa chỉ
                    </button>
                </div>
            </form>
        </motion.div>
    );
};


function ProfilePage() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        userName: '',
        role: '',
        createdAt: '',
        isActive: false,
        addresses: [],
        coupons: [],
    });
    const [isEditMode, setIsEditMode] = useState(false);

    // 2. Thêm state để mở/đóng form địa chỉ
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    const [message, setMessage] = useState({ type: '', content: '' });
    const navigate = useNavigate();

    // (useEffect tải thông tin user... không thay đổi)
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
                role: parsedUser.role || 'CUSTOMER',
                createdAt: parsedUser.createdAt ? new Date(parsedUser.createdAt).toLocaleDateString('vi-VN') : 'N/A',
                isActive: parsedUser.isActive || false,
                addresses: parsedUser.addresses || [],
                coupons: parsedUser.coupons || [],
            });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // (handleChange... không thay đổi)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // (handleSubmit (lưu Tên/Họ)... không thay đổi)
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
            const res = await axios.put(
                `http://localhost:8080/api/users/${user.id}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedUserInStorage = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));
            setUser(updatedUserInStorage);
            setMessage({ type: 'success', content: 'Cập nhật hồ sơ thành công!' });
            setIsEditMode(false);
        } catch (err) {
            setMessage({ type: 'error', content: err.response?.data?.message || 'Lỗi khi cập nhật hồ sơ.' });
        }
    };

    // 3. Hàm mới để xử lý LƯU ĐỊA CHỈ (từ form inline)
    const handleAddAddress = async (newAddress) => {
        // Nếu người dùng chọn "mặc định", hãy bỏ "mặc định" ở các địa chỉ cũ
        let newAddressList = [...formData.addresses];
        if (newAddress.isDefault) {
            newAddressList = newAddressList.map(addr => ({ ...addr, isDefault: false }));
        }
        newAddressList.push(newAddress);

        const updateData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: user.email,
            userName: user.userName,
            addresses: newAddressList, // Đây là danh sách địa chỉ mới
            coupons: formData.coupons,
        };

        try {
            // Gọi *cùng* API update user
            const res = await axios.put(
                `http://localhost:8080/api/users/${user.id}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedUserInStorage = { ...user, ...res.data, addresses: newAddressList };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));

            setUser(updatedUserInStorage);
            setFormData(prev => ({ ...prev, addresses: newAddressList }));

            setMessage({ type: 'success', content: 'Thêm địa chỉ mới thành công!' });
            setIsAddingAddress(false); // 4. Đóng form sau khi lưu
        } catch (err) {
            setMessage({ type: 'error', content: err.response?.data?.message || 'Lỗi khi thêm địa chỉ.' });
            // Không đóng form nếu lỗi
        }
    };


    if (!user) {
        return null; // Hiển thị loading...
    }

    return (
        <div className="bg-gray-50 py-10 font-[Manrope]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden"
            >
                <div className="md:flex">
                    {/* ... (Phần Avatar bên trái không đổi) ... */}
                    <div className="md:w-1/3 bg-gray-100 p-8 flex flex-col items-center justify-center border-r border-gray-200">
                        <FiUser className="text-8xl text-gray-400" />
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">
                            {user.userName}
                        </h2>
                        <p className="text-gray-500">{user.email}</p>
                        {!isEditMode && (
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="mt-6 flex items-center justify-center bg-[#6F47EB] text-white py-2 px-5 rounded-lg font-semibold
                           hover:bg-indigo-700 transition-all duration-300"
                            >
                                <FiEdit className="mr-2" />
                                Chỉnh sửa
                            </button>
                        )}
                    </div>

                    {/* ... (Phần Form thông tin bên phải không đổi) ... */}
                    <div className="md:w-2/3 p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            Hồ Sơ Của Tôi
                        </h1>

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

                        {/* ... (Form Họ, Tên, Email... không đổi) ... */}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Vai trò</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        disabled
                                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB] disabled:bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Ngày tham gia</label>
                                    <input
                                        type="text"
                                        value={formData.createdAt}
                                        disabled
                                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F47EB] disabled:bg-gray-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                                <input
                                    type="text"
                                    value={formData.isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                                    disabled
                                    className={`mt-1 w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 font-medium ${
                                        formData.isActive ? 'text-green-600' : 'text-red-600'
                                    }`}
                                />
                            </div>
                            {isEditMode && (
                                <div className="flex justify-end space-x-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditMode(false)}
                                        className="flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-5 rounded-lg font-semibold
                               hover:bg-gray-300 transition-all duration-300"
                                    >
                                        <FiXCircle className="mr-2" />
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center bg-green-600 text-white py-2 px-5 rounded-lg font-semibold
                               hover:bg-green-700 transition-all duration-300"
                                    >
                                        <FiSave className="mr-2" />
                                        Lưu
                                    </button>
                                </div>
                            )}
                        </form>

                        <hr className="my-8 border-gray-200" />

                        {/* === PHẦN HIỂN THỊ ĐỊA CHỈ === */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <FiMapPin className="mr-3 text-gray-500" />
                                    Sổ địa chỉ
                                </h2>
                                {/* 5. Nút bấm "+ Thêm" (chỉ hiển thị khi không đang thêm) */}
                                {!isAddingAddress && (
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingAddress(true)}
                                        className="flex items-center text-sm text-[#6F47EB] font-semibold hover:underline"
                                    >
                                        <FiPlus className="mr-1" />
                                        Thêm địa chỉ mới
                                    </button>
                                )}
                            </div>

                            {/* Danh sách địa chỉ đã lưu */}
                            {formData.addresses.length > 0 ? (
                                <ul className="space-y-3">
                                    {formData.addresses.map((addr, index) => (
                                        <li key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 ">
                                            <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">
                          {addr.street}
                        </span>
                                                {addr.isDefault && (
                                                    <span className="text-xs font-bold text-green-600 bg-green-100 py-1 px-2 rounded-full">
                            Mặc định
                          </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {addr.city}, {addr.province} - {addr.postalCode}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                // Chỉ hiển thị "Chưa có địa chỉ" nếu không đang thêm
                                !isAddingAddress && <p className="text-gray-500">Bạn chưa có địa chỉ nào.</p>
                            )}

                            {/* 6. Hiển thị form thêm địa chỉ inline */}
                            {isAddingAddress && (
                                <NewAddressForm
                                    onSave={handleAddAddress}
                                    onCancel={() => setIsAddingAddress(false)}
                                />
                            )}
                        </div>

                        {/* ... (Phần Mã giảm giá không đổi) ... */}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <FiTag className="mr-3 text-gray-500" />
                                Mã giảm giá của bạn
                            </h2>
                            {formData.coupons.length > 0 ? (
                                <ul className="space-y-3">
                                    {formData.coupons.map((coupon, index) => (
                                        <li key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs font-mono">
                                            {JSON.stringify(coupon)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Bạn không có mã giảm giá nào.</p>
                            )}
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default ProfilePage;