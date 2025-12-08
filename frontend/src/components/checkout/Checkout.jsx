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

    // --- STATE THANH TOÁN QR ---
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [currentTransactionCode, setCurrentTransactionCode] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [checkingInterval, setCheckingInterval] = useState(null);

    const subtotal = useMemo(() =>
            itemsToCheckout.reduce((total, item) =>
                    total + item.price * (1 - (item.discount || 0)/100) * item.quantity
                , 0),
        [itemsToCheckout]
    );

    const total = subtotal + shippingFee - discountValue;

    // Cleanup interval
    useEffect(() => {
        return () => {
            if (checkingInterval) clearInterval(checkingInterval);
        };
    }, [checkingInterval]);

    // --- LOGIC GỌI BACKEND ---
    const handleCreateSePayTransaction = async (orderId, amount) => {
        try {
            const res = await axiosClient.post("/payment/sepay/create", {
                orderId: orderId,
                amount: amount
            });
            setQrCodeUrl(res.data.qrCodeUrl);
            setCurrentTransactionCode(res.data.description);

            setShowPaymentModal(true);
            setPaymentStatus("pending");
            startPaymentChecking(res.data.description);
        } catch (err) {
            console.error(err);
            alert("Lỗi tạo mã thanh toán: " + (err.response?.data?.message || err.message));
        }
    };

    const startPaymentChecking = (transactionCode) => {
        const interval = setInterval(async () => {
            try {
                const res = await axiosClient.get("/payment/check-transaction", {
                    params: { content: transactionCode }
                });

                if (res.data.success || res.data.status === "COMPLETED") {
                    clearInterval(interval);
                    setCheckingInterval(null);
                    setPaymentStatus("success");
                    setTimeout(() => {
                        setShowPaymentModal(false);
                        setShowSuccessModal(true);
                        if (productsFromBuyNow.length === 0) setCartItems([]);
                    }, 2000);
                }
            } catch (error) { /* Silent fail */ }
        }, 3000);

        setCheckingInterval(interval);
        setTimeout(() => { if (interval) clearInterval(interval); }, 600000);
    };

    // --- LOGIC ĐỊA CHỈ & COUPON ---
    const [newAddressForm, setNewAddressForm] = useState({
        name: "", phone: "", street: "", city: "", district: "", ward: "", addressType: "home", isDefault: false
    });

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/').then(res => res.json()).then(data => setCities(data));
    }, []);

    const handleCityChange = (c) => {
        setNewAddressForm(prev => ({ ...prev, city: c, district: "", ward: "" })); setWards([]);
        if (c) { setLoadingAddress(true); fetch(`https://provinces.open-api.vn/api/p/${c}?depth=2`).then(res => res.json()).then(d => { setDistricts(d.districts || []); setLoadingAddress(false); }); } else setDistricts([]);
    };
    const handleDistrictChange = (d) => {
        setNewAddressForm(prev => ({ ...prev, district: d, ward: "" }));
        if (d) { setLoadingAddress(true); fetch(`https://provinces.open-api.vn/api/d/${d}?depth=2`).then(res => res.json()).then(data => { setWards(data.wards || []); setLoadingAddress(false); }); } else setWards([]);
    };

    const applyCoupon = async () => {
        const code = couponCode.trim();
        if (!code) { setCouponMessage("Vui lòng nhập mã!"); setShowCouponError(true); return; }
        try {
            const res = await axiosClient.get("/orders/validate", { params: { code, orderAmount: Number(subtotal) } });
            if (res.data.valid) { setAppliedCoupon(res.data); setDiscountValue(res.data.discount || 0); setCouponMessage("Áp dụng thành công!"); setShowCouponModal(true); setShowCouponError(false); }
            else { setCouponMessage(res.data.message); setShowCouponError(true); setDiscountValue(0); setAppliedCoupon(null); setShowCouponModal(false); }
        } catch (err) { setCouponMessage("Mã không hợp lệ!"); setShowCouponError(true); setDiscountValue(0); }
    };

    const handleCheckout = async () => {
        try {
            if (!userId) { alert("Bạn chưa đăng nhập!"); return; }
            if (!selectedAddress) { alert("Vui lòng chọn địa chỉ!"); return; }
            if (!itemsToCheckout || itemsToCheckout.length === 0) { alert("Không có sản phẩm!"); return; }

            const orderPayload = {
                userId: userId, paymentMethod: selectedPaymentMethod,
                shippingAddress: { id: selectedAddress.id, name: selectedAddress.name, street: `${selectedAddress.street}, ${selectedAddress.city}`, phoneNumber: selectedAddress.phone },
                items: itemsToCheckout.map(item => ({ productId: item.id, quantity: item.quantity || 1 })),
                discountAmount: discountValue || 0, shippingFee: shippingFee, note: note, subtotal: subtotal, totalAmount: total, couponCode: appliedCoupon?.code || null
            };

            const response = await axiosClient.post("/orders", orderPayload);
            const newOrderId = response.data.id;
            const newOrderCode = response.data.orderNumber || newOrderId;
            setCreatedOrderCode(newOrderCode);

            if (selectedPaymentMethod === "Credit") {
                await handleCreateSePayTransaction(newOrderId, total);
            } else {
                setShowSuccessModal(true);
                if (productsFromBuyNow.length === 0) setCartItems([]);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Đặt hàng thất bại: " + (error.response?.data?.message || error.message));
        }
    };

    // --- API USER & ADDRESS CRUD ---
    const handleNewAddressChange = (e) => { const { name, value, type, checked } = e.target; setNewAddressForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value })); };
    const openNewAddressModal = () => { setNewAddressForm({ name: fullName, phone: "", street: "", city: "", district: "", ward: "", addressType: "home", isDefault: false }); setDistricts([]); setWards([]); setShowNewAddressModal(true); };
    const closeNewAddressModal = () => { setShowNewAddressModal(false); setDistricts([]); setWards([]); };

    useEffect(() => {
        if (!userId) return;
        const fetchUser = async () => {
            try {
                const res = await axiosClient.get(`/users/${userId}`);
                const addrs = res.data.addresses || [];
                const mapped = addrs.map(a => ({
                    id: a.id, name: res.data.firstName + " " + res.data.lastName, phone: a.phoneNumber || "Chưa có",
                    street: (a.street || "").replace(/,+/g, "").trim(), city: a.city || "Chưa có",
                    isDefault: a.isDefault === true || a.isDefault === "true" || a.default === true
                }));
                setAddresses(mapped);
                const def = mapped.find(a => a.isDefault);
                setSelectedAddress(def || mapped[0] || null);
                if (mapped.length === 0) setShowNewAddressModal(true);
            } catch (e) { console.error(e); }
        };
        fetchUser();
    }, [userId]);

    const selectAddress = (a) => setTempSelectedAddress(a);
    const confirmAddressSelection = () => { if (tempSelectedAddress) setSelectedAddress(tempSelectedAddress); setShowAddressModal(false); };

    const handleAddNewAddress = async () => {
        if (!newAddressForm.name || !newAddressForm.phone || !newAddressForm.street || !newAddressForm.city) { alert("Nhập thiếu thông tin!"); return; }
        const cName = cities.find(c => c.code === parseInt(newAddressForm.city))?.name || "";
        const dName = districts.find(d => d.code === parseInt(newAddressForm.district))?.name || "";
        const wName = wards.find(w => w.code === parseInt(newAddressForm.ward))?.name || "";
        const newAddr = { name: newAddressForm.name, phoneNumber: newAddressForm.phone, street: `${newAddressForm.street}, ${wName}, ${dName}`.trim(), city: cName, isDefault: newAddressForm.isDefault };
        try {
            const res = await axiosClient.post(`/users/${userId}/addresses`, newAddr);
            const added = { id: res.data.id, name: newAddr.name, phone: newAddr.phoneNumber, street: newAddr.street, city: newAddr.city, isDefault: newAddr.isDefault };
            setAddresses(prev => added.isDefault ? prev.map(a => ({...a, isDefault: false})).concat(added) : [...prev, added]);
            if (added.isDefault || !selectedAddress) setSelectedAddress(added);
            closeNewAddressModal(); alert("Thêm thành công!");
        } catch (e) { alert("Lỗi thêm địa chỉ!"); }
    };

    const handleEditAddress = (addr) => { setEditingAddressId(addr.id); setEditForm({ name: addr.name, phone: addr.phone, street: addr.street, city: addr.city }); };
    const handleSaveEditAddress = async () => {
        try { await axiosClient.put(`/users/${userId}/addresses/${editingAddressId}`, { name: editForm.name, phoneNumber: editForm.phone, street: editForm.street, city: editForm.city }); setAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...a, ...editForm } : a)); if (selectedAddress?.id === editingAddressId) setSelectedAddress({...selectedAddress, ...editForm}); setEditingAddressId(null); alert("Cập nhật thành công!"); } catch (e) { alert("Lỗi cập nhật!"); }
    };
    const handleDeleteAddress = async (id) => { if (!window.confirm("Xóa?")) return; try { await axiosClient.delete(`/users/${userId}/addresses/${id}`); setAddresses(prev => prev.filter(a => a.id !== id)); alert("Đã xóa!"); } catch (e) { alert("Lỗi xóa!"); } };
    const setAddressAsDefault = async (id) => { try { await axiosClient.put(`/users/${userId}/addresses/${id}/default`); const u = addresses.map(a => ({ ...a, isDefault: a.id === id })); setAddresses(u); setSelectedAddress(u.find(a => a.id === id)); alert("Đã đặt mặc định!"); } catch (e) { alert("Lỗi!"); } };

    if (!cartItems) return <div>Loading...</div>;

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6 py-10">
            <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-7xl font-[Manrope] space-y-6 overflow-hidden" style={{ color: TEXT_COLOR }}>

                {/* 1. ĐỊA CHỈ */}
                <div className="px-6 py-4">
                    <div className="flex items-start gap-4">
                        <FiMapPin className="text-[#6F47EB] h-6 w-6 mt-1" />
                        <div className="flex-1">
                            <h2 className="text-[#6F47EB] text-lg font-semibold">Địa Chỉ Nhận Hàng</h2>
                            <div className="flex justify-between items-center pt-2">
                                {selectedAddress ? (
                                    <div><p className="font-semibold">{selectedAddress.name} | {selectedAddress.phone}</p><p className="text-sm text-gray-600">{selectedAddress.street}, {selectedAddress.city}</p></div>
                                ) : <p>Chưa có địa chỉ</p>}
                                <button className="text-blue-600 font-medium" onClick={() => setShowAddressModal(true)}>Thay Đổi</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === [SỬA LỖI BỊ CHE] MODAL CHỌN ĐỊA CHỈ (z-index cao) === */}
                {showAddressModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center font-[Manrope]">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <div className="relative bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 z-10">
                            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">Địa chỉ của tôi</h2><button onClick={() => setShowAddressModal(false)}><FiX className="h-6 w-6" /></button></div>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scroll">
                                {addresses.map((addr) => (
                                    <div key={addr.id} onClick={() => selectAddress(addr)} className={`border p-4 rounded-xl cursor-pointer ${tempSelectedAddress?.id === addr.id ? 'bg-indigo-50 border-[#6F47EB]' : ''}`}>
                                        <div className="flex justify-between">
                                            {editingAddressId === addr.id ? (
                                                <div className="w-full space-y-2">
                                                    <input className="border p-2 w-full rounded" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                                                    <input className="border p-2 w-full rounded" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                                                    <input className="border p-2 w-full rounded" value={editForm.street} onChange={e => setEditForm({...editForm, street: e.target.value})} />
                                                    <div className="flex gap-2"><button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleSaveEditAddress}>Lưu</button><button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setEditingAddressId(null)}>Hủy</button></div>
                                                </div>
                                            ) : (
                                                <div><p className="font-bold">{addr.name} | {addr.phone}</p><p>{addr.street}, {addr.city}</p></div>
                                            )}
                                            <div className="flex flex-col items-end gap-2">
                                                {addr.isDefault ? <span className="text-[#6F47EB] text-xs border border-[#6F47EB] px-2 rounded">Mặc định</span> : <button className="text-xs text-blue-600" onClick={(e) => {e.stopPropagation(); setAddressAsDefault(addr.id)}}>Đặt mặc định</button>}
                                                <div className="flex gap-2 text-sm"><button className="text-blue-600" onClick={(e) => {e.stopPropagation(); handleEditAddress(addr)}}>Sửa</button><button className="text-red-600" onClick={(e) => {e.stopPropagation(); handleDeleteAddress(addr.id)}}>Xóa</button></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full border-2 border-dashed p-3 text-[#6F47EB] rounded-xl flex justify-center items-center gap-2" onClick={openNewAddressModal}><FiPlus/> Thêm địa chỉ mới</button>
                            </div>
                            <div className="mt-6 flex justify-end gap-3"><button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setShowAddressModal(false)}>Hủy</button><button className="bg-[#6F47EB] text-white px-4 py-2 rounded" onClick={confirmAddressSelection}>Xác nhận</button></div>
                        </div>
                    </div>
                )}

                {/* === [SỬA LỖI BỊ CHE] MODAL THÊM ĐỊA CHỈ (z-index cao) === */}
                {showNewAddressModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center font-[Manrope]">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                        <div className="relative bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl mx-4 z-10 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">Thêm địa chỉ mới</h2>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input className="border p-2 rounded" name="name" placeholder="Họ tên" value={newAddressForm.name} onChange={handleNewAddressChange} />
                                <input className="border p-2 rounded" name="phone" placeholder="SĐT" value={newAddressForm.phone} onChange={handleNewAddressChange} />
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                <select className="border p-2 rounded" value={newAddressForm.city} onChange={e => handleCityChange(e.target.value)}><option value="">Tỉnh/Thành</option>{cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</select>
                                <select className="border p-2 rounded" value={newAddressForm.district} onChange={e => handleDistrictChange(e.target.value)}><option value="">Quận/Huyện</option>{districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}</select>
                                <select className="border p-2 rounded" value={newAddressForm.ward} onChange={e => setNewAddressForm({...newAddressForm, ward: e.target.value})}><option value="">Phường/Xã</option>{wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}</select>
                            </div>
                            <textarea className="border p-2 rounded w-full mb-4" name="street" placeholder="Địa chỉ cụ thể" value={newAddressForm.street} onChange={handleNewAddressChange}></textarea>
                            <div className="flex items-center mb-4"><input type="checkbox" name="isDefault" checked={newAddressForm.isDefault} onChange={handleNewAddressChange} className="mr-2" /><label>Đặt mặc định</label></div>
                            <div className="flex justify-end gap-2"><button className="bg-gray-200 px-4 py-2 rounded" onClick={closeNewAddressModal}>Hủy</button><button className="bg-[#6F47EB] text-white px-4 py-2 rounded" onClick={handleAddNewAddress}>Lưu</button></div>
                        </div>
                    </div>
                )}

                {/* 2. SẢN PHẨM */}
                <div className="px-6 py-4 border-t space-y-4">
                    {itemsToCheckout.map(item => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b">
                            <div className="col-span-6 flex items-center gap-3"><img src={item.thumbnails?.[0]} className="w-14 h-14 rounded" /><p className="text-sm">{item.name}</p></div>
                            <div className="col-span-2 text-right">{(item.price * (1 - (item.discount || 0)/100)).toLocaleString()} đ</div>
                            <div className="col-span-2 text-center">x{item.quantity}</div>
                            <div className="col-span-2 text-right font-bold">{(item.price * (1 - (item.discount || 0)/100) * item.quantity).toLocaleString()} đ</div>
                        </div>
                    ))}
                </div>

                {/* 3. COUPON & NOTE */}
                <div className="px-6 py-4 grid grid-cols-12 gap-4">
                    <div className="col-span-6"><label className="block mb-1 text-sm font-medium">Lời nhắn</label><input className="border w-full p-2 rounded" value={note} onChange={e => setNote(e.target.value)} /></div>
                    <div className="col-span-6"><label className="block mb-1 text-sm font-medium">Mã giảm giá</label><div className="flex gap-2"><input className="border flex-1 p-2 rounded" value={couponCode} onChange={e => setCouponCode(e.target.value)} /><button className="bg-[#6F47EB] text-white px-4 rounded" onClick={applyCoupon}>Áp dụng</button></div>{discountValue > 0 && <p className="text-green-600 text-sm mt-1">Giảm: {discountValue.toLocaleString()} đ</p>}</div>
                </div>

                {/* 4. PHƯƠNG THỨC THANH TOÁN */}
                <div className="px-6 py-4 border-t space-y-4">
                    <h3 className="text-lg font-medium">Phương thức thanh toán</h3>
                    <div className="flex space-x-4">
                        {["Credit", "Googlepay", "Code"].map(m => (
                            <button key={m} className={`border rounded px-4 py-3 flex-1 text-sm ${selectedPaymentMethod === m ? 'border-[#6F47EB] text-[#6F47EB] bg-indigo-50' : 'hover:border-gray-400'}`} onClick={() => setSelectedPaymentMethod(m)}>
                                {{ Credit: "Chuyển khoản (VietQR)", Googlepay: "Google Pay", Code: "Thanh toán khi nhận" }[m]}
                            </button>
                        ))}
                    </div>
                    {selectedPaymentMethod === "Credit" && <div className="bg-blue-50 p-4 rounded text-blue-800 text-sm flex gap-2"><FiInfo className="mt-1"/> <p>Vui lòng nhấn nút <b>"Đặt hàng"</b>. Mã QR sẽ hiện ra để bạn quét.</p></div>}
                </div>

                {/* 5. TỔNG KẾT & NÚT ĐẶT HÀNG */}
                <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="flex justify-between mb-2"><span>Tổng tiền hàng:</span><span>{subtotal.toLocaleString()} đ</span></div>
                    <div className="flex justify-between mb-2"><span>Phí vận chuyển:</span><span>{shippingFee.toLocaleString()} đ</span></div>
                    {discountValue > 0 && <div className="flex justify-between mb-2 text-green-600"><span>Giảm giá:</span><span>-{discountValue.toLocaleString()} đ</span></div>}
                    <div className="flex justify-between text-xl font-bold text-[#6F47EB] border-t pt-2 mt-2"><span>Tổng thanh toán:</span><span>{total.toLocaleString()} đ</span></div>
                    <div className="flex justify-end gap-3 mt-4"><button className="bg-gray-300 px-6 py-2 rounded" onClick={() => navigate('/cart')}>Quay lại</button><button className="bg-[#6F47EB] text-white px-6 py-2 rounded hover:bg-[#5E3FB9]" onClick={handleCheckout}>Đặt hàng</button></div>
                </div>
            </div>

            {/* === [SỬA LỖI BỊ CHE] MODAL QR (z-index cao) === */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-[#6F47EB] p-4 text-white text-center relative"><h3 className="text-lg font-bold">Thanh toán đơn hàng</h3><button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4"><FiX/></button></div>
                        <div className="p-6 flex flex-col items-center">
                            <div className="bg-white p-2 border-2 border-dashed rounded-xl mb-4">{qrCodeUrl ? <img src={qrCodeUrl} className="w-64 h-auto rounded" /> : <div className="h-64 flex items-center justify-center text-gray-400"><FiRefreshCw className="animate-spin text-3xl"/><p className="ml-2">Đang tạo mã...</p></div>}</div>
                            <div className="w-full bg-yellow-50 p-3 rounded text-sm mb-4 text-center border border-yellow-200"><p className="text-gray-500 mb-1">Nội dung chuyển khoản:</p><p className="font-mono font-bold text-lg text-yellow-800 select-all">{currentTransactionCode}</p></div>
                            <div className="text-center w-full">{paymentStatus === "pending" || paymentStatus === "checking" ? <div className="text-blue-600 flex justify-center gap-2 items-center bg-blue-50 py-2 rounded"><FiRefreshCw className="animate-spin"/> Đang chờ thanh toán...</div> : <div className="text-green-600 flex justify-center gap-2 items-center bg-green-50 py-2 rounded font-bold"><FiCheckCircle/> Thành công!</div>}</div>
                            <button onClick={() => setShowPaymentModal(false)} className="mt-4 text-gray-400 text-sm underline">Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* === [SỬA LỖI BỊ CHE] MODAL THÀNH CÔNG (z-index cao) === */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
                    <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl text-center">
                        <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4"><FiCheckCircle className="text-green-500 text-3xl"/></div>
                        <h2 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h2>
                        <p className="text-gray-600 mb-6">Mã đơn: <b>{createdOrderCode}</b></p>
                        <div className="flex justify-center gap-3"><button onClick={() => navigate("/profile")} className="bg-[#6F47EB] text-white px-4 py-2 rounded">Xem đơn hàng</button><button onClick={() => navigate("/fashion")} className="bg-gray-100 text-gray-800 px-4 py-2 rounded">Tiếp tục mua</button></div>
                    </div>
                </div>
            )}

            {showCouponModal && (<div className="fixed inset-0 z-[9999] bg-black/40 flex justify-center items-center"><div className="bg-white p-6 rounded-xl shadow-md text-center"><h2 className="text-green-600 text-xl font-bold mb-2">🎉 {couponMessage}</h2><button onClick={() => setShowCouponModal(false)} className="bg-green-600 text-white px-4 py-2 rounded">OK</button></div></div>)}
            {showCouponError && (<div className="fixed inset-0 z-[9999] bg-black/40 flex justify-center items-center"><div className="bg-white p-6 rounded-xl shadow-md text-center"><h2 className="text-red-600 text-xl font-bold mb-2">⚠️ {couponMessage}</h2><button onClick={() => setShowCouponError(false)} className="bg-red-600 text-white px-4 py-2 rounded">Đóng</button></div></div>)}
        </div>
    );
};

export default Checkout;