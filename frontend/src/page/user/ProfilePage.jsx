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
    FiTrash2 // --- Thêm icon Thùng rác ---
} from 'react-icons/fi';
import { motion } from 'framer-motion';

// --- BẮT ĐẦU: Component NewAddressForm được định nghĩa bên trong file ---

const NewAddressForm = ({ onSave, onCancel, initialData }) => {
    // State mặc định
    const defaultAddress = {
        street: '',
        city: '',
        province: '',
        postalCode: '',
        isDefault: false,
    };

    const [address, setAddress] = useState(defaultAddress);

    // Tự động điền form nếu ở chế độ "Sửa" (có initialData)
    // Hoặc reset form nếu chuyển từ "Sửa" sang "Thêm"
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
                <h3 className="text-lg font-semibold text-gray-700">
                    {initialData ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </h3>
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
                        {initialData ? 'Cập nhật' : 'Lưu địa chỉ'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

// --- KẾT THÚC: Component NewAddressForm ---


// --- BẮT ĐẦU: Component ProfilePage chính ---

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
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    // +++ THÊM STATE ĐỂ BIẾT ĐANG SỬA ĐỊA CHỈ NÀO +++
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // (Hàm này giữ nguyên)
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

    // (Hàm này giữ nguyên)
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
                newAddressList = newAddressList.map(addr => ({ ...addr, isDefault: false }));
            }
            newAddressList.push(addedAddress);
            const updatedUserInStorage = { ...user, addresses: newAddressList };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));

            setUser(updatedUserInStorage);
            setFormData(prev => ({ ...prev, addresses: newAddressList }));

            setMessage({ type: 'success', content: 'Thêm địa chỉ mới thành công!' });
            setIsAddingAddress(false); // Đóng form
        } catch (err) {
            setMessage({ type: 'error', content: err.response?.data?.message || 'Lỗi khi thêm địa chỉ.' });
        }
    };

    // +++ HÀM MỚI: Cập nhật địa chỉ +++
    const handleUpdateAddress = async (addressData) => {
        setMessage({ type: '', content: '' });
        try {
            const res = await axios.put(
                `http://localhost:8080/api/users/${user.id}/addresses/${addressData.id}`,
                addressData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedAddress = res.data;

            let newAddressList = formData.addresses.map(addr =>
                addr.id === updatedAddress.id ? updatedAddress : addr
            );

            if (updatedAddress.isDefault) {
                newAddressList = newAddressList.map(addr =>
                    addr.id === updatedAddress.id ? addr : { ...addr, isDefault: false }
                );
            }

            const updatedUserInStorage = { ...user, addresses: newAddressList };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));

            setUser(updatedUserInStorage);
            setFormData(prev => ({ ...prev, addresses: newAddressList }));

            setMessage({ type: 'success', content: 'Cập nhật địa chỉ thành công!' });
            setEditingAddress(null); // Đóng form sửa

        } catch (err) {
            setMessage({ type: 'error', content: err.response?.data?.message || 'Lỗi khi cập nhật địa chỉ.' });
        }
    };

    // +++ HÀM MỚI: Xóa địa chỉ +++
    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
            return;
        }

        setMessage({ type: '', content: '' });
        try {
            await axios.delete(
                `http://localhost:8080/api/users/${user.id}/addresses/${addressId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newAddressList = formData.addresses.filter(addr => addr.id !== addressId);

            const updatedUserInStorage = { ...user, addresses: newAddressList };
            localStorage.setItem('user', JSON.stringify(updatedUserInStorage));

            setUser(updatedUserInStorage);
            setFormData(prev => ({ ...prev, addresses: newAddressList }));

            setMessage({ type: 'success', content: 'Xóa địa chỉ thành công!' });

        } catch (err)
        {
            setMessage({ type: 'error', content: err.response?.data?.message || 'Lỗi khi xóa địa chỉ.' });
        }
    };

    // +++ HÀM MỚI: Để bắt đầu sửa (bật form sửa) +++
    const handleStartEdit = (addressToEdit) => {
        setEditingAddress(addressToEdit);
        setIsAddingAddress(false); // Tắt form thêm (nếu đang bật)
    };

    // +++ HÀM MỚI: Để hủy/đóng form (cho cả thêm và sửa) +++
    const handleCancelForm = () => {
        setIsAddingAddress(false);
        setEditingAddress(null);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="bg-gray-50 py-10 font-[Manrope]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden"
            >
                <div className="md:flex">
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

                        {/* === PHẦN SỔ ĐỊA CHỈ (ĐÃ CẬP NHẬT) === */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <FiMapPin className="mr-3 text-gray-500" />
                                    Sổ địa chỉ
                                </h2>

                                {/* +++ SỬA: Chỉ hiện nút "Thêm" khi không có form nào đang mở +++ */}
                                {!isAddingAddress && !editingAddress && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingAddress(true);
                                            setEditingAddress(null); // Tắt sửa (nếu có)
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
                                    {/* +++ SỬA: Dùng addr.id làm key (giả sử API trả về id) +++ */}
                                    {formData.addresses.map((addr) => (
                                        <li key={addr.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 ">

                                            {/* +++ SỬA: Bố cục lại để thêm nút Sửa/Xóa +++ */}
                                            <div className="flex justify-between items-start">
                                                {/* Thông tin */}
                                                <div>
                                                    <span className="font-medium text-gray-800">
                                                        {addr.street}
                                                    </span>
                                                    <p className="text-sm text-gray-600">
                                                        {addr.city}, {addr.province} - {addr.postalCode}
                                                    </p>
                                                </div>

                                                {/* Nút & Tag */}
                                                <div className="flex flex-col items-end flex-shrink-0 ml-4 space-y-2">
                                                    {addr.isDefault && (
                                                        <span className="text-xs font-bold text-green-600 bg-green-100 py-1 px-2 rounded-full">
                                                            Mặc định
                                                        </span>
                                                    )}
                                                    {/* +++ THÊM NÚT SỬA/XÓA +++ */}
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => handleStartEdit(addr)}
                                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                                                        >
                                                            <FiEdit className="w-3 h-3 mr-1"/> Sửa
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAddress(addr.id)}
                                                            className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center"
                                                        >
                                                            <FiTrash2 className="w-3 h-3 mr-1"/> Xóa
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                !isAddingAddress && !editingAddress &&
                                <p className="text-gray-500">Bạn chưa có địa chỉ nào.</p>
                            )}

                            {/* +++ SỬA: Logic hiển thị form động (cho cả Thêm và Sửa) +++ */}
                            {(isAddingAddress || editingAddress) && (
                                <NewAddressForm
                                    // Gửi dữ liệu nếu là "Sửa", nếu không thì là null
                                    initialData={editingAddress}
                                    // Tự động chọn hàm 'handleUpdateAddress' hoặc 'handleAddAddress'
                                    onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
                                    onCancel={handleCancelForm}
                                />
                            )}
                        </div>
                        {/* === KẾT THÚC SỔ ĐỊA CHỈ === */}


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