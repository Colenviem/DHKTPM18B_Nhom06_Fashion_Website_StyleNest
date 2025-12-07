import { FiMapPin, FiCheckCircle, FiChevronRight, FiInfo, FiX, FiPlus, FiRefreshCw } from "react-icons/fi";
import { CartContext } from "../../context/CartContext.jsx";
import { useContext, useState, useMemo, useEffect } from "react";

import axiosClient from "../../api/axiosClient";
import { useNavigate, useLocation } from "react-router-dom";

const shippingFee = 30000;
const PRIMARY_COLOR = "#6F47EB";
const PRIMARY_HOVER = "#5E3FB9";
const TEXT_COLOR = "#4B5563";

const Checkout = () => {
    const { cartItems, userId, setCartItems, user } = useContext(CartContext);
    const fullName = user ? user.firstName + " " + user.lastName : "";

    const [note, setNote] = useState("");
    const navigate = useNavigate();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Code");

    const location = useLocation();
    const productsFromBuyNow = location.state?.products || [];
    const itemsToCheckout = productsFromBuyNow.length > 0 ? productsFromBuyNow : cartItems;

    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showNewAddressModal, setShowNewAddressModal] = useState(false);
    const [tempSelectedAddress, setTempSelectedAddress] = useState(null);

    const [couponCode, setCouponCode] = useState("");
    const [discountValue, setDiscountValue] = useState(0);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdOrderCode, setCreatedOrderCode] = useState(null);

    const [editingAddressId, setEditingAddressId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", phone: "", street: "", city: "" });

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingAddress, setLoadingAddress] = useState(false);

    const [showCouponModal, setShowCouponModal] = useState(false);
    const [showCouponError, setShowCouponError] = useState(false);
    const [couponMessage, setCouponMessage] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // QR Code payment states
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, checking, success, failed
    const [checkingInterval, setCheckingInterval] = useState(null);

    // --- CẤU HÌNH NGÂN HÀNG (Khớp với Backend) ---
    const BANK_INFO = {
        bankId: "970422",       // Mã BIN của MB Bank (Military Bank)
        accountNo: "0326829327", // Số tài khoản từ cấu hình server
        accountName: "TRAN CONG TINH", // Tên chủ tài khoản
        template: "compact2"    // Template QR gọn
    };

    const subtotal = useMemo(() =>
            itemsToCheckout.reduce((total, item) =>
                    total + item.price * (1 - (item.discount || 0)/100) * item.quantity
                , 0),
        [itemsToCheckout]
    );

    const total = subtotal + shippingFee - discountValue;

    // Tạo QR code khi chọn phương thức Credit (SePay / Chuyển khoản)
    useEffect(() => {
        if (selectedPaymentMethod === "Credit") {
            generateQRCode();
        } else {
            // Dừng kiểm tra khi chuyển phương thức khác
            if (checkingInterval) {
                clearInterval(checkingInterval);
                setCheckingInterval(null);
            }
            setPaymentStatus("pending");
        }

        return () => {
            if (checkingInterval) {
                clearInterval(checkingInterval);
            }
        };
    }, [selectedPaymentMethod, total]);

    const generateQRCode = async () => {
        try {
            const amount = Math.round(total);
            // Tạo mã tham chiếu tạm thời (hoặc lấy ID đơn hàng nếu đã có)
            const refCode = createdOrderCode || `PAY${new Date().getTime().toString().slice(-6)}`;
            const description = `Thanh toan ${refCode}`;

            // Tạo QR code theo chuẩn VietQR (SePay hỗ trợ chuẩn này)
            // Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.jpg
            const qrContent = `https://img.vietqr.io/image/${BANK_INFO.bankId}-${BANK_INFO.accountNo}-${BANK_INFO.template}.jpg?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;

            setQrCodeUrl(qrContent);
            setPaymentStatus("pending");
        } catch (error) {
            console.error("Lỗi tạo QR code:", error);
        }
    };

    // Hàm kiểm tra trạng thái thanh toán
    const checkPaymentStatus = async () => {
        try {
            // Sử dụng axiosClient để gọi API Backend (đã cấu hình BaseURL)
            // Giả sử Backend có API kiểm tra giao dịch hoặc Webhook đã update trạng thái Order
            // Ở đây gọi API check tạm thời hoặc logic polling

            // Lưu ý: Nếu Backend dùng Webhook SePay, Client thường nên chờ Socket hoặc polling trạng thái đơn hàng
            // Dưới đây là ví dụ polling API kiểm tra transaction
            const response = await axiosClient.get("/payment/check-transaction", {
                params: {
                    accountNo: BANK_INFO.accountNo,
                    amount: Math.round(total),
                    content: `Thanh toan` // Backend sẽ lọc theo nội dung
                }
            });

            if (response.data.success || response.data.status === "COMPLETED") {
                setPaymentStatus("success");
                if (checkingInterval) {
                    clearInterval(checkingInterval);
                    setCheckingInterval(null);
                }
                // Tự động đặt hàng sau khi thanh toán thành công
                setTimeout(() => {
                    handleCheckout();
                }, 1000);
            }
        } catch (error) {
            console.error("Lỗi kiểm tra thanh toán:", error);
        }
    };

    // Bắt đầu kiểm tra thanh toán
    const startPaymentChecking = () => {
        setPaymentStatus("checking");

        // Kiểm tra mỗi 5 giây để tránh spam server
        const interval = setInterval(() => {
            checkPaymentStatus();
        }, 5000);

        setCheckingInterval(interval);

        // Tự động dừng sau 10 phút
        setTimeout(() => {
            if (interval) {
                clearInterval(interval);
                setCheckingInterval(null);
                if (paymentStatus === "checking") {
                    setPaymentStatus("failed");
                }
            }
        }, 600000);
    };

    const [newAddressForm, setNewAddressForm] = useState({
        name: "",
        phone: "",
        street: "",
        city: "",
        district: "",
        ward: "",
        addressType: "home",
        isDefault: false
    });

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then(res => res.json())
            .then(data => setCities(data))
            .catch(err => console.error('Lỗi load tỉnh/thành:', err));
    }, []);

    const handleCityChange = (cityCode) => {
        setNewAddressForm(prev => ({
            ...prev,
            city: cityCode,
            district: "",
            ward: ""
        }));
        setWards([]);

        if (cityCode) {
            setLoadingAddress(true);
            fetch(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    setDistricts(data.districts || []);
                    setLoadingAddress(false);
                })
                .catch(err => {
                    console.error('Lỗi load quận/huyện:', err);
                    setLoadingAddress(false);
                });
        } else {
            setDistricts([]);
        }
    };

    const applyCoupon = async () => {
        const code = couponCode.trim();
        if (!code) {
            setCouponMessage("Vui lòng nhập mã giảm giá!");
            setShowCouponError(true);
            return;
        }

        try {
            const res = await axiosClient.get("/orders/validate", {
                params: {
                    code,
                    orderAmount: Number(subtotal)
                }
            });

            if (res.data.valid) {
                setAppliedCoupon(res.data);
                setDiscountValue(res.data.discount || 0);
                setCouponMessage(res.data.message || "Áp dụng mã thành công!");
                setShowCouponModal(true);
                setShowCouponError(false);
            } else {
                setCouponMessage(res.data.message);
                setShowCouponError(true);
                setDiscountValue(0);
                setAppliedCoupon(null);
                setShowCouponModal(false);
            }

        } catch (err) {
            const msg = err.response?.data?.message || "Mã giảm giá không hợp lệ!";
            setCouponMessage(msg);
            setShowCouponError(true);
            setDiscountValue(0);
            setAppliedCoupon(null);
            setShowCouponModal(false);
        }
    };

    const handleDistrictChange = (districtCode) => {
        setNewAddressForm(prev => ({
            ...prev,
            district: districtCode,
            ward: ""
        }));

        if (districtCode) {
            setLoadingAddress(true);
            fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    setWards(data.wards || []);
                    setLoadingAddress(false);
                })
                .catch(err => {
                    console.error('Lỗi load phường/xã:', err);
                    setLoadingAddress(false);
                });
        } else {
            setWards([]);
        }
    };

    const handleCheckout = async () => {
        try {

            if (!userId) {
                alert("Bạn chưa đăng nhập!");
                return;
            }

            if (!selectedAddress) {
                alert("Vui lòng chọn địa chỉ nhận hàng!");
                return;
            }

            if (!itemsToCheckout || itemsToCheckout.length === 0) {
                alert("Không có sản phẩm để đặt hàng!");
                return;
            }

            const orderPayload = {
                userId: userId,
                paymentMethod: selectedPaymentMethod,
                shippingAddress: {
                    id: selectedAddress.id || null,
                    name: selectedAddress.name || "Khách hàng",
                    street: `${selectedAddress.street}, ${selectedAddress.city || ""}`.trim(),
                    phoneNumber: selectedAddress.phone || selectedAddress.phoneNumber
                },
                items: itemsToCheckout.map(item => ({
                    productId: item.id,
                    quantity: item.quantity || 1
                })),
                discountAmount: discountValue || 0,
                shippingFee: shippingFee,
                note: note,
                subtotal: subtotal,
                totalAmount: subtotal + shippingFee - (discountValue || 0),
                couponCode: appliedCoupon?.code || null
            };
            console.log("📤 Sending order payload:", JSON.stringify(orderPayload, null, 2));
            const response = await axiosClient.post("/orders", orderPayload);

            setCreatedOrderCode(response.data.orderCode || response.data.id || "ORD-" + new Date().getTime());
            setShowSuccessModal(true);

            if (productsFromBuyNow.length === 0) {
                setCartItems([]);
            }

        } catch (error) {
            console.error("❌ Checkout error:", error);

            if (error.response) {
                console.error("Status:", error.response?.status);
                console.error("Response data:", JSON.stringify(error.response?.data, null, 2));

                const errorMsg = error.response?.data?.error
                    || error.response?.data?.message
                    || error.message;
                alert("Đặt hàng thất bại: " + errorMsg);
            } else {
                alert("Đặt hàng thất bại: " + error.message);
            }
        }
    };

    const handleNewAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAddressForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const openNewAddressModal = () => {
        setNewAddressForm({
            name: fullName,
            phone: "",
            street: "",
            city: "",
            district: "",
            ward: "",
            addressType: "home",
            isDefault: false
        });
        setDistricts([]);
        setWards([]);
        setShowNewAddressModal(true);
    };

    const closeNewAddressModal = () => {
        setShowNewAddressModal(false);
        setDistricts([]);
        setWards([]);
    };

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                // 3. Dùng axiosClient gọi API user
                const res = await axiosClient.get(`/users/${userId}`);
                const user = res.data;
                const addrs = Array.isArray(user.addresses) ? user.addresses : [];

                const mappedAddresses = addrs.map(a => {
                    const isDefault = a.isDefault === true ||
                        a.isDefault === "true" ||
                        a.default === true ||
                        a.default === "true";

                    return {
                        id: a.id,
                        name: user.firstName + " " + user.lastName,
                        phone: a.phoneNumber || "Chưa có",
                        street: (a.street || "").replace(/,+/g, "").trim(),
                        city: a.city || "Chưa có",
                        isDefault: isDefault
                    };
                });

                setAddresses(mappedAddresses);

                const defaultAddr = mappedAddresses.find(a => a.isDefault === true);
                const addressToSelect = defaultAddr || mappedAddresses[0] || null;

                setSelectedAddress(addressToSelect);

                if (mappedAddresses.length === 0) {
                    setShowNewAddressModal(true);
                }
            } catch (err) {
                console.error("Lỗi lấy user:", err.response?.data || err.message);
            }
        };

        fetchUser();
    }, [userId]);

    const selectAddress = (addr) => setTempSelectedAddress(addr);
    const confirmAddressSelection = () => {
        if (tempSelectedAddress) setSelectedAddress(tempSelectedAddress);
        setShowAddressModal(false);
        setTempSelectedAddress(null);
    };

    const handleAddNewAddress = async () => {
        if (!newAddressForm.name || !newAddressForm.phone || !newAddressForm.street ||
            !newAddressForm.city || !newAddressForm.district || !newAddressForm.ward) {
            alert("Vui lòng nhập đầy đủ thông tin địa chỉ!");
            return;
        }

        const cityName = cities.find(c => c.code === parseInt(newAddressForm.city))?.name || "";
        const districtName = districts.find(d => d.code === parseInt(newAddressForm.district))?.name || "";
        const wardName = wards.find(w => w.code === parseInt(newAddressForm.ward))?.name || "";

        const newAddr = {
            name: newAddressForm.name,
            phoneNumber: newAddressForm.phone,
            street: `${newAddressForm.street}, ${wardName}, ${districtName}`.trim(),
            city: cityName,
            isDefault: newAddressForm.isDefault
        };

        try {
            const res = await axiosClient.post(`/users/${userId}/addresses`, newAddr);
            const addedAddress = res.data;

            const mappedAddress = {
                id: addedAddress.id,
                name: addedAddress.name || newAddr.name,
                phone: addedAddress.phoneNumber || newAddressForm.phone,
                street: addedAddress.street || newAddr.street,
                city: addedAddress.city || cityName,
                isDefault: addedAddress.isDefault
            };

            setAddresses(prev =>
                mappedAddress.isDefault
                    ? prev.map(a => ({ ...a, isDefault: false })).concat(mappedAddress)
                    : [...prev, mappedAddress]
            );

            if (mappedAddress.isDefault || !selectedAddress) setSelectedAddress(mappedAddress);

            setNewAddressForm({
                name: "",
                phone: "",
                street: "",
                city: "",
                district: "",
                ward: "",
                addressType: "home",
                isDefault: false
            });
            setDistricts([]);
            setWards([]);
            setShowNewAddressModal(false);
            alert("Thêm địa chỉ thành công!");
        } catch (err) {
            console.error("Lỗi thêm địa chỉ:", err.response?.data || err.message);
            alert("Thêm địa chỉ thất bại, vui lòng thử lại!");
        }
    };

    const handleEditAddress = (addr) => {
        setEditingAddressId(addr.id);
        setEditForm({
            name: addr.name,
            phone: addr.phone,
            street: addr.street,
            ward: addr.ward || "",
            district: addr.district || "",
            city: addr.city || ""
        });
    };

    const handleSaveEditAddress = async () => {
        const updated = {
            name: editForm.name,
            phoneNumber: editForm.phone,
            street: `${editForm.street}, ${editForm.ward}, ${editForm.district}`.trim(),
            city: editForm.city
        };

        try {
            // 5. Dùng axiosClient cập nhật địa chỉ
            await axiosClient.put(`/users/${userId}/addresses/${editingAddressId}`, updated);

            setAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...a, ...editForm } : a));
            if (selectedAddress?.id === editingAddressId) setSelectedAddress({ ...selectedAddress, ...editForm });
            setEditingAddressId(null);
            alert("Cập nhật địa chỉ thành công!");
        } catch (err) {
            console.error("Lỗi cập nhật địa chỉ:", err.response?.data || err.message);
            alert("Cập nhật địa chỉ thất bại!");
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!id) return;

        if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

        try {
            await axiosClient.delete(`/users/${userId}/addresses/${id}`);

            setAddresses(prev => {
                const newAddresses = prev.filter(a => a.id !== id);
                if (selectedAddress?.id === id) setSelectedAddress(newAddresses[0] || null);
                return newAddresses;
            });
            alert("Xóa địa chỉ thành công!");
        } catch (err) {
            console.error("Lỗi xóa địa chỉ:", err.response?.data || err.message);
            alert("Xóa địa chỉ thất bại, vui lòng thử lại!");
        }
    };

    const setAddressAsDefault = async (id) => {
        try {
            console.log("🔄 Setting address as default:", id);

            await axiosClient.put(`/users/${userId}/addresses/${id}/default`);
            const updatedAddresses = addresses.map(a => ({
                ...a,
                isDefault: a.id === id
            }));

            setAddresses(updatedAddresses);

            const defaultAddr = updatedAddresses.find(a => a.id === id);

            if (defaultAddr) {
                setSelectedAddress(defaultAddr);
            }

            alert("Đã đặt địa chỉ này làm mặc định!");
        } catch (err) {
            console.error("Lỗi thiết lập mặc định:", err.response?.data || err.message);
            alert("Không thể thiết lập địa chỉ mặc định, vui lòng thử lại!");
        }
    };

    if (!cartItems) return <div>Đang tải giỏ hàng...</div>;
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6 py-10">

            <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-7xl font-[Manrope] space-y-6 overflow-hidden" style={{ color: TEXT_COLOR }}>
                <div className="px-6 py-4">
                    <div className="flex items-start gap-4">
                        <FiMapPin className="text-[#6F47EB] h-6 w-6 mt-1 animate-pulse" />
                        <div className="flex-1">
                            <h2 className="text-[#6F47EB] text-lg font-semibold">Địa Chỉ Nhận Hàng</h2>
                            <div className="flex justify-between items-center pt-2">
                                {selectedAddress ? (
                                    <div>
                                        <p className="font-semibold text-gray-800 mb-2">{selectedAddress.name}</p>
                                        <p className="text-gray-600 mb-2">{selectedAddress.phone}</p>
                                        <p className="text-gray-600 text-sm">
                                            {(selectedAddress.street ? selectedAddress.street + ", " : "") + (selectedAddress.city || "")}
                                        </p>
                                    </div>
                                ) : (
                                    <p>Chưa có địa chỉ</p>
                                )}
                                <div className="flex gap-4">
                                    {selectedAddress?.isDefault && (
                                        <span className="border border-[#6F47EB] text-[#6F47EB] px-3 py-1 rounded text-sm">Mặc Định</span>
                                    )}
                                    <button className="text-gray-600 font-medium hover:text-[#6F47EB] transition-colors duration-200" onClick={() => setShowAddressModal(true)}>Thay Đổi</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal hiển thị danh sách địa chỉ */}
                {showAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center font-[Manrope]">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />
                        <div className="relative bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 z-10 animate-scaleIn">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Địa chỉ của tôi</h2>
                                <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <FiX className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scroll">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className={`border rounded-xl p-4 transition-all duration-300 cursor-pointer ${tempSelectedAddress?.id === addr.id ? 'bg-indigo-50' : 'bg-white'} hover:shadow-md`}
                                        style={tempSelectedAddress?.id === addr.id ? { borderColor: PRIMARY_COLOR } : {}}
                                        onClick={() => selectAddress(addr)}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            {editingAddressId === addr.id ? (
                                                <div className="flex-1 space-y-3">
                                                    <input type="text" className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[${PRIMARY_COLOR}] focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 transition-all duration-200`} value={editForm.name} readOnly onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Tên người nhận" />
                                                    <input type="text" className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[${PRIMARY_COLOR}] focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 transition-all duration-200`} value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Số điện thoại" />
                                                    <input type="text" className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[${PRIMARY_COLOR}] focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 transition-all duration-200`} value={editForm.street} onChange={(e) => setEditForm({ ...editForm, street: e.target.value })} placeholder="Địa chỉ" />
                                                    <div className="flex gap-3 pt-1">
                                                        <button className={`bg-[${PRIMARY_COLOR}] hover:bg-[${PRIMARY_HOVER}] text-white px-4 py-2 rounded-md transition-all duration-200 hover:scale-105`} onClick={handleSaveEditAddress}>Lưu</button>
                                                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-all duration-200" onClick={() => setEditingAddressId(null)}>Hủy</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1">
                                                    <div className={`text-xl font-semibold mb-2 text-[${TEXT_COLOR}]`}>{addr.name}</div>
                                                    <div className="text-sm text-gray-600 mb-2">{addr.phone}</div>
                                                    <p className="text-sm text-gray-700">{addr.street}{addr.city ? `, ${addr.city}` : ""}</p>
                                                </div>
                                            )}
                                            <div className="flex flex-col items-end text-sm">
                                                {addr.isDefault ? (
                                                    <span className="text-[#6F47EB] border border-[#6F47EB] px-3 py-2 rounded mb-4 text-xs font-medium">Mặc Định</span>
                                                ) : (
                                                    <button className={`text-[${PRIMARY_COLOR}] border border-[${PRIMARY_COLOR}] px-3 py-2 rounded hover:bg-indigo-50 mb-4 text-xs transition-all duration-200 hover:scale-105`} onClick={() => setAddressAsDefault(addr.id)}>Thiết lập mặc định</button>
                                                )}
                                                <div className="flex gap-3">
                                                    <button className={`text-[${PRIMARY_COLOR}] hover:text-[${PRIMARY_HOVER}] hover:underline`} onClick={(e) => handleEditAddress(addr, e)}>Sửa</button>
                                                    <button className={`text-[${PRIMARY_COLOR}] hover:text-[${PRIMARY_HOVER}] hover:underline`} onClick={(e) => handleDeleteAddress(addr.id, e)}>Xóa</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className={`w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center text-[${PRIMARY_COLOR}] hover:border-[${PRIMARY_HOVER}] hover:bg-indigo-50 transition-all duration-200 hover:scale-[1.02]`} onClick={openNewAddressModal}>
                                    <FiPlus className="h-5 w-5 mr-2" />
                                    Thêm Địa Chỉ Mới
                                </button>
                            </div>
                            <div className="mt-8 flex justify-end gap-4">
                                <button className="bg-gray-100 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200" onClick={() => setShowAddressModal(false)}>Hủy</button>
                                <button className={`bg-[${PRIMARY_COLOR}] text-white px-6 py-2 rounded-lg hover:bg-[${PRIMARY_HOVER}] transition-all duration-200 hover:scale-105 hover:shadow-lg`} onClick={confirmAddressSelection}>Xác Nhận</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Thêm địa chỉ mới */}
                {showNewAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center font-[Manrope]">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"></div>
                        <div className="relative bg-white border border-gray-300 p-6 rounded-xl shadow-xl w-full max-w-3xl mx-4 animate-scaleIn z-10 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">Địa chỉ mới</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                                        <input type="text" name="name" value={newAddressForm.name} onChange={handleNewAddressChange} placeholder="Họ và tên" className={`w-full border border-gray-300 rounded px-4 py-3 transition-all duration-200 focus:border-[${PRIMARY_COLOR}] focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20`} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                                        <input type="text" name="phone" value={newAddressForm.phone} onChange={handleNewAddressChange} placeholder="Số điện thoại" className={`w-full border border-gray-300 rounded px-4 py-3 transition-all duration-200 focus:border-[${PRIMARY_COLOR}] focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20`} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select value={newAddressForm.city} onChange={(e) => handleCityChange(e.target.value)} className={`w-full border border-gray-300 rounded px-4 py-3 appearance-none transition-all duration-200 focus:border-[${PRIMARY_COLOR}] focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 bg-white`}>
                                            <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                            {cities.map(city => (<option key={city.code} value={city.code}>{city.name}</option>))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"><FiChevronRight className="h-4 w-4 transform rotate-90" /></div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select value={newAddressForm.district} onChange={(e) => handleDistrictChange(e.target.value)} disabled={!newAddressForm.city || loadingAddress} className={`w-full border border-gray-300 rounded px-4 py-3 appearance-none transition-all duration-200 focus:border-[${PRIMARY_COLOR}] focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`}>
                                            <option value="">-- Chọn Quận/Huyện --</option>
                                            {districts.map(district => (<option key={district.code} value={district.code}>{district.name}</option>))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"><FiChevronRight className="h-4 w-4 transform rotate-90" /></div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Xã <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select value={newAddressForm.ward} onChange={(e) => setNewAddressForm(prev => ({ ...prev, ward: e.target.value }))} disabled={!newAddressForm.district || loadingAddress} className={`w-full border border-gray-300 rounded px-4 py-3 appearance-none transition-all duration-200 focus:border-[${PRIMARY_COLOR}] focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`}>
                                            <option value="">-- Chọn Phường/Xã --</option>
                                            {wards.map(ward => (<option key={ward.code} value={ward.code}>{ward.name}</option>))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"><FiChevronRight className="h-4 w-4 transform rotate-90" /></div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
                                    <textarea name="street" value={newAddressForm.street} onChange={handleNewAddressChange} placeholder="Số nhà, tên đường..." className={`w-full border border-gray-300 rounded px-4 py-3 h-24 transition-all duration-200 focus:border-[${PRIMARY_COLOR}] focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20`}></textarea>
                                </div>
                                <div>
                                    <p className="mb-2">Loại địa chỉ:</p>
                                    <div className="flex space-x-4">
                                        <button className={`border rounded px-4 py-2 transition-all duration-200 ${newAddressForm.addressType === "home" ? `border-[${PRIMARY_COLOR}] text-[${PRIMARY_COLOR}]` : "border-gray-300"}`} onClick={() => setNewAddressForm({ ...newAddressForm, addressType: "home" })}>Nhà Riêng</button>
                                        <button className={`border rounded px-4 py-2 transition-all duration-200 ${newAddressForm.addressType === "office" ? `border-[${PRIMARY_COLOR}] text-[${PRIMARY_COLOR}]` : "border-gray-300"}`} onClick={() => setNewAddressForm({ ...newAddressForm, addressType: "office" })}>Văn Phòng</button>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" name="isDefault" id="isDefaultCheckbox" checked={newAddressForm.isDefault} onChange={handleNewAddressChange} className={`mr-2 h-4 w-4 text-[${PRIMARY_COLOR}] focus:ring-[${PRIMARY_COLOR}] border-gray-300 rounded`} />
                                    <label htmlFor="isDefaultCheckbox">Đặt làm địa chỉ mặc định</label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2 transition-all duration-200 hover:bg-gray-300" onClick={closeNewAddressModal}>Trở Lại</button>
                                <button className={`bg-[${PRIMARY_COLOR}] text-white px-4 py-2 rounded transition-all duration-200 hover:bg-[${PRIMARY_HOVER}] hover:scale-105`} onClick={handleAddNewAddress}>Hoàn thành</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Danh sách sản phẩm */}
                <div className="px-6 py-4 space-y-4">
                    <div className="grid grid-cols-12 gap-4 pb-2 border-b text-base font-medium">
                        <div className="col-span-6">Sản phẩm</div>
                        <div className="col-span-2 text-right">Đơn giá</div>
                        <div className="col-span-2 text-center">Số lượng</div>
                        <div className="col-span-2 text-right">Thành tiền</div>
                    </div>
                    {itemsToCheckout.map(item => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b text-gray-700 hover:bg-gray-50">
                            <div className="col-span-6 flex items-center gap-3">
                                <img src={item.thumbnails?.[0]} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-gray-100" />
                                <p className="text-sm">{item.name}</p>
                            </div>
                            <div className="col-span-2 text-right text-sm">{(item.price * (1 - (item.discount || 0)/100)).toLocaleString()} đ</div>
                            <div className="col-span-2 text-center text-sm">{item.quantity}</div>
                            <div className="col-span-2 text-right font-semibold">{(item.price * (1 - (item.discount || 0)/100) * item.quantity).toLocaleString()} đ</div>
                        </div>
                    ))}
                </div>

                {/* Lời nhắn & Mã giảm giá */}
                <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
                    <label className="col-span-3 text-gray-600">Lời nhắn:</label>
                    <div className="col-span-9">
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" placeholder="Lưu ý cho Người bán..." value={note} onChange={e => setNote(e.target.value)} />
                    </div>
                </div>
                <div className="px-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã Giảm Giá
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Nhập mã..."
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 border rounded-lg px-4 py-2 focus:border-[#6F47EB] focus:ring-2 focus:ring-[#6F47EB]/20 outline-none transition"
                        />
                        <button
                            onClick={applyCoupon}
                            className="bg-[#6F47EB] hover:bg-[#5E3FB9] text-white px-4 py-2 rounded-lg transition font-medium"
                        >
                            Áp dụng
                        </button>
                    </div>

                    {discountValue > 0 && (
                        <p className="text-green-600 mt-2 text-sm">
                            Đã giảm: {discountValue.toLocaleString()} đ
                        </p>
                    )}
                </div>

                {showCouponModal && (
                    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <h2 className="text-xl font-semibold text-green-600 mb-3">
                                🎉 Áp dụng mã thành công!
                            </h2>
                            <p>{couponMessage}</p>

                            <button
                                onClick={() => setShowCouponModal(false)}
                                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}

                {showCouponError && (
                    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <h2 className="text-xl font-semibold text-red-600 mb-3">
                                ⚠️ Lỗi áp dụng mã
                            </h2>
                            <p>{couponMessage}</p>

                            <button
                                onClick={() => setShowCouponError(false)}
                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}

                {/* Vận chuyển & Phí */}
                <div className="px-6 py-4 grid grid-cols-12 gap-4 text-gray-800">
                    <div className="col-span-3 font-medium">Phương thức vận chuyển:</div>
                    <div className="col-span-7 space-y-4">
                        <div>
                            <div className="flex items-center">
                                <span className="font-medium">Nhanh</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Nhận hàng từ 8–9 Tháng 5</p>
                            <p className="text-sm text-gray-600 mt-1 flex items-center">
                                Nhận voucher ₫15.000 nếu giao sau 9 Tháng 5 2025
                                <FiInfo className="h-4 w-4 ml-1 text-gray-600" />
                            </p>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm">
                                Hoặc chọn Hỏa Tốc để{" "}
                                <button className="text-[#6F47EB] font-medium inline-flex items-center mt-2 hover:text-[#5E3FB9]">
                                    <FiCheckCircle className="h-4 w-4 mr-1" /> nhận hôm nay <FiChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </p>
                        </div>
                    </div>
                    <div className="col-span-2 text-right font-medium">{shippingFee.toLocaleString()} đ</div>
                </div>

                <div className="px-6 py-4 space-y-6 text-gray-800">

                    {/* PHƯƠNG THỨC THANH TOÁN */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
                        <div className="flex space-x-4">
                            {["Credit", "Googlepay", "Code"].map(method => (
                                <button
                                    key={method}
                                    className={`border rounded px-4 py-2 text-sm transition-all duration-200 hover:scale-105 
                        ${selectedPaymentMethod === method
                                        ? "border-[#6F47EB] text-[#6F47EB]"
                                        : "hover:border-gray-400"}`}
                                    onClick={() => setSelectedPaymentMethod(method)}
                                >
                                    {{
                                        Credit: "Quét mã QR",
                                        Googlepay: "Google Pay",
                                        Code: "Thanh toán khi nhận"
                                    }[method]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* HIỂN THỊ THEO PHƯƠNG THỨC ĐÃ CHỌN */}
                    {selectedPaymentMethod === "Credit" && (
                        <div className="space-y-3 mt-4 border p-6 rounded-lg">
                            <div className="text-center space-y-4">
                                <p className="font-semibold text-lg">Quét mã QR để thanh toán</p>

                                {/* Thông tin ngân hàng */}
                                <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ngân hàng:</span>
                                        <span className="font-medium">MB Bank (Quân Đội)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Số tài khoản:</span>
                                        <span className="font-medium">{BANK_INFO.accountNo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Chủ tài khoản:</span>
                                        <span className="font-medium">{BANK_INFO.accountName}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 mt-2">
                                        <span className="text-gray-600">Số tiền:</span>
                                        <span className="font-bold text-[#6F47EB] text-lg">
                                            {Math.round(total).toLocaleString()} đ
                                        </span>
                                    </div>
                                </div>

                                {/* QR Code */}
                                <div className="flex justify-center">
                                    {qrCodeUrl ? (
                                        <div className="relative">
                                            <img
                                                src={qrCodeUrl}
                                                alt="QR thanh toán"
                                                className="w-80 h-80 rounded-lg shadow-lg"
                                            />
                                            {paymentStatus === "checking" && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                                    <div className="text-white text-center">
                                                        <FiRefreshCw className="w-8 h-8 mx-auto animate-spin mb-2" />
                                                        <p>Đang kiểm tra thanh toán...</p>
                                                    </div>
                                                </div>
                                            )}
                                            {paymentStatus === "success" && (
                                                <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center rounded-lg">
                                                    <div className="text-white text-center">
                                                        <FiCheckCircle className="w-12 h-12 mx-auto mb-2" />
                                                        <p className="font-bold text-lg">Thanh toán thành công!</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-80 h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <p className="text-gray-500">Đang tạo mã QR...</p>
                                        </div>
                                    )}
                                </div>

                                {/* Nút kiểm tra thanh toán */}
                                {paymentStatus === "pending" && (
                                    <button
                                        onClick={startPaymentChecking}
                                        className="bg-[#6F47EB] hover:bg-[#5E3FB9] text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 font-medium"
                                    >
                                        Tôi đã chuyển khoản
                                    </button>
                                )}

                                {paymentStatus === "checking" && (
                                    <div className="text-blue-600 font-medium">
                                        <FiRefreshCw className="inline animate-spin mr-2" />
                                        Đang xác nhận thanh toán...
                                    </div>
                                )}

                                {paymentStatus === "failed" && (
                                    <div className="space-y-2">
                                        <p className="text-red-600 font-medium">
                                            Chưa nhận được thanh toán. Vui lòng thử lại!
                                        </p>
                                        <button
                                            onClick={startPaymentChecking}
                                            className="bg-[#6F47EB] hover:bg-[#5E3FB9] text-white px-6 py-2 rounded-lg transition"
                                        >
                                            Kiểm tra lại
                                        </button>
                                    </div>
                                )}

                                {/* Hướng dẫn */}
                                <div className="bg-blue-50 p-4 rounded-lg text-left text-sm">
                                    <p className="font-semibold mb-2 text-blue-800">📱 Hướng dẫn thanh toán:</p>
                                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                                        <li>Mở ứng dụng ngân hàng của bạn</li>
                                        <li>Quét mã QR ở trên</li>
                                        <li>Kiểm tra thông tin và số tiền</li>
                                        <li>Xác nhận chuyển khoản</li>
                                        <li>Nhấn "Tôi đã chuyển khoản" để xác nhận</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedPaymentMethod === "Googlepay" && (
                        <div className="space-y-3 mt-4 border p-4 rounded-lg">
                            <p className="font-semibold text-gray-700">Thanh toán qua Google Pay</p>
                            <input
                                type="email"
                                placeholder="Email Google Pay"
                                className="w-full border rounded px-4 py-2 focus:outline-[#6F47EB]"
                            />
                            <button className="bg-black text-white rounded px-4 py-2 w-full">
                                Xác nhận Google Pay
                            </button>
                        </div>
                    )}

                    {selectedPaymentMethod === "Code" && (
                        <div className="mt-4 text-sm text-gray-600">
                            Trả tiền trực tiếp khi nhận hàng 🚚
                        </div>
                    )}

                </div>


                <div className="px-6 py-4 space-y-2 border-t border-b">
                    <div className="flex justify-between">
                        <span>Tổng tiền hàng</span>
                        <span>{subtotal.toLocaleString()} đ</span>
                    </div>

                    {discountValue > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Giảm giá</span>
                            <span>-{discountValue.toLocaleString()} đ</span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span>Phí vận chuyển</span>
                        <span>{shippingFee.toLocaleString()} đ</span>
                    </div>

                    <div className="flex justify-between font-bold text-xl mt-2">
                        <span>Tổng thanh toán</span>
                        <span>{total.toLocaleString()} đ</span>
                    </div>
                </div>


                <div className="px-6 py-4 flex justify-between items-center text-sm text-gray-600">
                    <p>
                        Khi nhấn <span className="font-medium">'Đặt hàng'</span>, bạn đồng ý
                        với <a href="#" className="text-blue-500 hover:underline">Điều khoản StyleNest</a>.
                    </p>
                    <div className="flex gap-2">
                        <button
                            style={{ backgroundColor: '#9CA3AF' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#6B7280'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = '#9CA3AF'}
                            className="text-white font-medium py-3 px-4 rounded transition-all duration-200 hover:scale-105 hover:shadow-lg"
                            onClick={() => navigate('/cart')}
                        >
                            Quay lại
                        </button>

                        <button
                            style={{ backgroundColor: PRIMARY_COLOR }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = PRIMARY_HOVER}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
                            className="text-white font-medium py-3 px-4 rounded transition-all duration-200 hover:scale-105 hover:shadow-lg"
                            onClick={handleCheckout}
                        >
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-[Manrope]">
                    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl text-center animate-scaleIn">
                        <FiCheckCircle className="text-green-500 w-16 h-16 mx-auto mb-3" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            Đặt hàng thành công!
                        </h2>
                        {createdOrderCode && (
                            <p className="text-gray-600 mb-4">
                                Mã đơn hàng: <span className="font-semibold">{createdOrderCode}</span>
                            </p>
                        )}
                        <p className="text-gray-600 mb-6">
                            Cảm ơn bạn đã mua sắm tại StyleNest.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => navigate("/profile")} className="bg-[#6F47EB] text-white px-4 py-2 rounded-lg hover:bg-[#5E3FB9] transition-all duration-200">
                                Xem đơn hàng
                            </button>
                            <button onClick={() => navigate("/fashion")} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200">
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;