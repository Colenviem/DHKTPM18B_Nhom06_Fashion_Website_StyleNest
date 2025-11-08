import { FiMapPin, FiCheckCircle, FiChevronRight, FiInfo, FiX, FiPlus } from "react-icons/fi";
import { CartContext } from "../../context/CartContext.jsx";
import { useContext, useState, useMemo, useEffect } from "react";
import axios from "axios";
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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");

    const location = useLocation();
    const productsFromBuyNow = location.state?.products || [];
    const itemsToCheckout = productsFromBuyNow.length > 0 ? productsFromBuyNow : cartItems;

    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showNewAddressModal, setShowNewAddressModal] = useState(false);
    const [tempSelectedAddress, setTempSelectedAddress] = useState(null);


    const [editingAddressId, setEditingAddressId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", phone: "", street: "", city: "" });

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const subtotal = useMemo(() =>
            itemsToCheckout.reduce((total, item) =>
                    total + item.price * (1 - (item.discount || 0)/100) * item.quantity
                , 0),
        [itemsToCheckout]
    );

    const total = subtotal + shippingFee;

    const [newAddressForm, setNewAddressForm] = useState({
        name: "",
        phone: "",
        street: "",
        city: "",
        addressType: "home",
        isDefault: false
    });

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!userId || !token) {
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
                shippingAddress: {
                    id: selectedAddress.id || null,
                    name: selectedAddress.name || "Khách hàng",
                    street: `${selectedAddress.street}, ${selectedAddress.city || ""}`.trim(),
                    phoneNumber: selectedAddress.phone && selectedAddress.phone !== "Chưa có"
                        ? selectedAddress.phone
                        : "0000000000"
                },
                items: itemsToCheckout.map(item => ({
                    productId: item.id,
                    quantity: item.quantity || 1
                })),
                shippingFee: shippingFee,
                note: note,
                totalPrice: total
            };



            console.log("📤 Sending order payload:", JSON.stringify(orderPayload, null, 2));

            const response = await axios.post(
                "http://localhost:8080/api/orders",
                orderPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ Order created:", response.data);
            alert("Đặt hàng thành công!");

            if (productsFromBuyNow.length === 0) {
                setCartItems([]);
            }

            navigate("/orders");
        } catch (error) {
            console.error("❌ Checkout error:", error);

            if (axios.isAxiosError(error)) {
                console.error("Status:", error.response?.status);
                console.error("Response data:", JSON.stringify(error.response?.data, null, 2));
                console.error("Request payload:", error.config?.data);

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
        setNewAddressForm(prev => ({
            ...prev,
            name: fullName,
            phone: "",
            street: "",
            city: "",
            addressType: "home",
            isDefault: false
        }));
        setShowNewAddressModal(true);
    };

    const closeNewAddressModal = () => setShowNewAddressModal(false);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/users/${userId}`);
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
        if (!newAddressForm.name || !newAddressForm.phone || !newAddressForm.detailAddress || !newAddressForm.location) {
            alert("Vui lòng nhập đầy đủ thông tin địa chỉ!");
            return;
        }

        const [ward = "", district = "", city = "Chưa có"] = newAddressForm.location
            .split(',')
            .map(s => s.trim())
            .reverse();


        const newAddr = {
            name: newAddressForm.name,
            phoneNumber: newAddressForm.phone,
            street: `${newAddressForm.detailAddress}, ${ward}, ${district}`.trim(),
            city: city,
            isDefault: newAddressForm.isDefault
        };



        try {
            const res = await axios.post(`http://localhost:8080/api/users/${userId}/addresses`, newAddr);
            const addedAddress = res.data;

            const mappedAddress = {
                id: addedAddress.id,
                name: addedAddress.name || newAddr.name,
                phone: addedAddress.phoneNumber || newAddr.phone,
                street: addedAddress.street || newAddr.street,
                city: addedAddress.city || newAddr.city,
                isDefault: addedAddress.isDefault
            };

            setAddresses(prev =>
                mappedAddress.isDefault
                    ? prev.map(a => ({ ...a, isDefault: false })).concat(mappedAddress)
                    : [...prev, mappedAddress]
            );

            if (mappedAddress.isDefault || !selectedAddress) setSelectedAddress(mappedAddress);

            setNewAddressForm({ name: "", phone: "", detailAddress: "", location: "", addressType: "home", isDefault: false });
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
            await axios.put(`http://localhost:8080/api/users/${userId}/addresses/${editingAddressId}`, updated);
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
            await axios.delete(`http://localhost:8080/api/users/${userId}/addresses/${id}`);
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
            const token = localStorage.getItem("token");

            console.log("🔄 Setting address as default:", id);

            await axios.put(
                `http://localhost:8080/api/users/${userId}/addresses/${id}/default`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedAddresses = addresses.map(a => ({
                ...a,
                isDefault: a.id === id
            }));

            setAddresses(updatedAddresses);

            const defaultAddr = updatedAddresses.find(a => a.id === id);

            if (defaultAddr) {
                setSelectedAddress(defaultAddr);
                console.log("✅ New default address set:", defaultAddr);
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
                                                    <input
                                                        type="text"
                                                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[${PRIMARY_COLOR}] focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 transition-all duration-200`}
                                                        value={editForm.name}
                                                        readOnly
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        placeholder="Tên người nhận"
                                                    />
                                                    <input
                                                        type="text"
                                                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[${PRIMARY_COLOR}] focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 transition-all duration-200`}
                                                        value={editForm.phone}
                                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                        placeholder="Số điện thoại"
                                                    />
                                                    <input
                                                        type="text"
                                                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[${PRIMARY_COLOR}] focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 transition-all duration-200`}
                                                        value={editForm.street}
                                                        onChange={(e) => setEditForm({ ...editForm, street: e.target.value })}
                                                        placeholder="Địa chỉ"
                                                    />

                                                    <div className="flex gap-3 pt-1">
                                                        <button
                                                            className={`bg-[${PRIMARY_COLOR}] hover:bg-[${PRIMARY_HOVER}] text-white px-4 py-2 rounded-md transition-all duration-200 hover:scale-105`}
                                                            onClick={handleSaveEditAddress}
                                                        >
                                                            Lưu
                                                        </button>
                                                        <button
                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-all duration-200"
                                                            onClick={() => setEditingAddressId(null)}
                                                        >
                                                            Hủy
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1">
                                                    <div className={`text-xl font-semibold mb-2 text-[${TEXT_COLOR}]`}>{addr.name}</div>
                                                    <div className="text-sm text-gray-600 mb-2">{addr.phone}</div>
                                                    <p className="text-sm text-gray-700">
                                                        {addr.street}{addr.city ? `, ${addr.city}` : ""}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex flex-col items-end text-sm">
                                                {addr.isDefault ? (
                                                    <span className="text-[#6F47EB] border border-[#6F47EB] px-3 py-2 rounded mb-4 text-xs font-medium">Mặc Định</span>
                                                ) : (
                                                    <button
                                                        className={`text-[${PRIMARY_COLOR}] border border-[${PRIMARY_COLOR}] px-3 py-2 rounded hover:bg-indigo-50 mb-4 text-xs transition-all duration-200 hover:scale-105`}
                                                        onClick={() => setAddressAsDefault(addr.id)}
                                                    >
                                                        Thiết lập mặc định
                                                    </button>
                                                )}
                                                <div className="flex gap-3">
                                                    <button
                                                        className={`text-[${PRIMARY_COLOR}] hover:text-[${PRIMARY_HOVER}] hover:underline`}
                                                        onClick={(e) => handleEditAddress(addr, e)}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        className={`text-[${PRIMARY_COLOR}] hover:text-[${PRIMARY_HOVER}] hover:underline`}
                                                        onClick={(e) => handleDeleteAddress(addr.id, e)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    className={`w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center text-[${PRIMARY_COLOR}] hover:border-[${PRIMARY_HOVER}] hover:bg-indigo-50 transition-all duration-200 hover:scale-[1.02]`}
                                    onClick={openNewAddressModal}
                                >
                                    <FiPlus className="h-5 w-5 mr-2" />
                                    Thêm Địa Chỉ Mới
                                </button>
                            </div>

                            <div className="mt-8 flex justify-end gap-4">
                                <button
                                    className="bg-gray-100 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
                                    onClick={() => setShowAddressModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className={`bg-[${PRIMARY_COLOR}] text-white px-6 py-2 rounded-lg hover:bg-[${PRIMARY_HOVER}] transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                                    onClick={confirmAddressSelection}
                                >
                                    Xác Nhận
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showNewAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center font-[Manrope]">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"></div>
                        <div className="relative bg-white border border-gray-300 p-6 rounded-xl shadow-xl w-full max-w-3xl mx-4 animate-scaleIn z-10">
                            <h2 className="text-xl font-bold mb-4">Địa chỉ mới</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newAddressForm.name}
                                            onChange={handleNewAddressChange}
                                            placeholder="Họ và tên"
                                            className={`w-full border border-gray-300 rounded px-4 py-3 transition-all duration-200 focus:border-[${PRIMARY_COLOR}] focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20`}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={newAddressForm.phone}
                                            onChange={handleNewAddressChange}
                                            placeholder="Số điện thoại"
                                            className={`w-full border border-gray-300 rounded px-4 py-3 transition-all duration-200 focus:border-[${PRIMARY_COLOR}] focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="relative">
                                        <select
                                            name="location"
                                            value={newAddressForm.location}
                                            className={`w-full border border-gray-300 rounded px-4 py-3 appearance-none transition-all duration-200 focus:border-[${PRIMARY_COLOR}] focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20`}
                                            onChange={(e) => {
                                                setNewAddressForm(prev => ({ ...prev, location: e.target.value }));
                                            }}
                                        >
                                            <option value="">Tỉnh/Thành phố, Quận/Huyện, Phường/Xã</option>
                                            <option value="Phường 1, Quận 1, TP. Hồ Chí Minh">Phường 1, Quận 1, TP. Hồ Chí Minh</option>
                                            <option value="Phường 10, Quận Cầu Giấy, Hà Nội">Phường 10, Quận Cầu Giấy, Hà Nội</option>
                                            <option value="Phường 5, Quận Hải Châu, Đà Nẵng">Phường 5, Quận Hải Châu, Đà Nẵng</option>
                                        </select>




                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <FiChevronRight className="h-4 w-4 transform rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div><textarea
                    name="detailAddress"
                    value={newAddressForm.detailAddress}
                    onChange={handleNewAddressChange}
                    placeholder="Địa chỉ cụ thể (Số nhà, tên đường...)"
                    className={`w-full border border-gray-300 rounded px-4 py-3 h-24 transition-all duration-200 focus:border-[${PRIMARY_COLOR}] focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20`}
                ></textarea>
                                </div>

                                <div>
                                    <p className="mb-2">Loại địa chỉ:</p>
                                    <div className="flex space-x-4">
                                        <button
                                            className={`border rounded px-4 py-2 transition-all duration-200 ${
                                                newAddressForm.addressType === "home" ? `border-[${PRIMARY_COLOR}] text-[${PRIMARY_COLOR}]` : "border-gray-300"
                                            }`}
                                            onClick={() => setNewAddressForm({ ...newAddressForm, addressType: "home" })}
                                        >
                                            Nhà Riêng
                                        </button>
                                        <button
                                            className={`border rounded px-4 py-2 transition-all duration-200 ${
                                                newAddressForm.addressType === "office" ? `border-[${PRIMARY_COLOR}] text-[${PRIMARY_COLOR}]` : "border-gray-300"
                                            }`}
                                            onClick={() => setNewAddressForm({ ...newAddressForm, addressType: "office" })}
                                        >
                                            Văn Phòng
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isDefault"
                                        id="isDefaultCheckbox"
                                        checked={newAddressForm.isDefault}
                                        onChange={handleNewAddressChange}
                                        className={`mr-2 h-4 w-4 text-[${PRIMARY_COLOR}] focus:ring-[${PRIMARY_COLOR}] border-gray-300 rounded`}
                                    />
                                    <label htmlFor="isDefaultCheckbox">Đặt làm địa chỉ mặc định</label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2 transition-all duration-200 hover:bg-gray-300" onClick={closeNewAddressModal}>
                                    Trở Lại
                                </button>
                                <button
                                    className={`bg-[${PRIMARY_COLOR}] text-white px-4 py-2 rounded transition-all duration-200 hover:bg-[${PRIMARY_HOVER}] hover:scale-105`}
                                    onClick={handleAddNewAddress}
                                >
                                    Hoàn thành
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="px-6 py-4 space-y-4">
                    <div className="grid grid-cols-12 gap-4 pb-2 border-b text-base font-medium">
                        <div className="col-span-6">Sản phẩm</div>
                        <div className="col-span-2 text-right">Đơn giá</div>
                        <div className="col-span-2 text-center">Số lượng</div>
                        <div className="col-span-2 text-right">Thành tiền</div>
                    </div>

                    {/*{cartItems.map(item => (*/}
                    {/*    <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b text-gray-700 hover:bg-gray-50">*/}
                    {/*        <div className="col-span-6 flex items-center gap-3">*/}
                    {/*            <img src={item.thumbnails?.[0]} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-gray-100" />*/}
                    {/*            <p className="text-sm">{item.name}</p>*/}
                    {/*        </div>*/}
                    {/*        <div className="col-span-2 text-right text-sm">{(item.price * (1 - (item.discount || 0)/100)).toLocaleString()} đ</div>*/}
                    {/*        <div className="col-span-2 text-center text-sm">{item.quantity}</div>*/}
                    {/*        <div className="col-span-2 text-right font-semibold">{(item.price * (1 - (item.discount || 0)/100) * item.quantity).toLocaleString()} đ</div>*/}
                    {/*    </div>*/}
                    {/*))}*/}
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

                {/* Lời nhắn */}
                <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
                    <label className="col-span-3 text-gray-600">Lời nhắn:</label>
                    <div className="col-span-9">
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" placeholder="Lưu ý cho Người bán..." value={note} onChange={e => setNote(e.target.value)} />
                    </div>
                </div>

                {/* Phương thức vận chuyển */}
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

                {/* Phương thức thanh toán */}
                <div className="px-6 py-4 space-y-6 text-gray-800">
                    <div>
                        <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
                        <div className="flex space-x-4">
                            {["credit", "googlepay", "cod"].map(method => (
                                <button
                                    key={method}
                                    className={`border rounded px-4 py-2 text-sm transition-all duration-200 hover:scale-105 ${selectedPaymentMethod === method ? "border-[#6F47EB] text-[#6F47EB]" : "hover:border-gray-400"}`}
                                    onClick={() => setSelectedPaymentMethod(method)}
                                >
                                    {{
                                        credit: "Thẻ Tín dụng",
                                        googlepay: "Google Pay",
                                        cod: "Thanh toán khi nhận"
                                    }[method]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tổng thanh toán */}
                <div className="px-6 py-4 space-y-2 border-t border-b">
                    <div className="flex justify-between">
                        <span>Tổng tiền hàng</span>
                        <span>{subtotal.toLocaleString()} đ</span>
                    </div>
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
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#6B7280'} // hover gray-500
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
        </div>
    );
};

export default Checkout;
