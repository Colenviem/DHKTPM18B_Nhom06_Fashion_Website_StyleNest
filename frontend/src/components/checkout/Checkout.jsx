import { useState } from "react";
import {
  FiMapPin,
  FiCheckCircle,
  FiChevronRight,
  FiInfo,
  FiX,
  FiPlus,
} from "react-icons/fi";

const demoCartItems = [
  {
    id: "P1",
    name: "Áo Sơ Mi Lụa Tay Dài Cao Cấp",
    thumbnails: ["https://via.placeholder.com/150/FFFFFF/808080?text=Ao+So+Mi"],
    price: 750000,
    discount: 10,
    quantity: 1,
    selectedSize: "M",
    selectedColor: "Trắng",
    colors: ["Trắng", "Đen", "Xanh Navy"],
    size: ["S", "M", "L"],
  },
  {
    id: "P2",
    name: "Quần Jeans Skinny Rách Gối Thời Trang",
    thumbnails: ["https://via.placeholder.com/150/FFFFFF/808080?text=Quan+Jeans"],
    price: 520000,
    discount: 0,
    quantity: 2,
    selectedSize: "30",
    selectedColor: "Xanh Đậm",
    colors: ["Xanh Đậm", "Đen"],
    size: ["29", "30", "31", "32"],
  },
];

const demoAddresses = [
  {
    id: "101",
    name: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Đường ABC, Phường 1, Quận 2, TP. Hồ Chí Minh",
    addressType: "home",
    isDefault: true,
  },
  {
    id: "102",
    name: "Trần Thị B",
    phone: "0901234568",
    address: "456 Tòa nhà XYZ, Phường 3, Quận 4, TP. Hồ Chí Minh",
    addressType: "office",
    isDefault: false,
  },
];

const shippingFee = 32800;

const PRIMARY_COLOR = "#6F47EB";
const PRIMARY_HOVER = "#5E3FB9";
const TEXT_COLOR = "#4B5563"; // Dark slate gray

const Checkout = () => {
  const [note, setNote] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addresses, setAddresses] = useState(demoAddresses);
  const [selectedAddress, setSelectedAddress] = useState(demoAddresses.find(a => a.isDefault)); 
  const [tempSelectedAddress, setTempSelectedAddress] = useState(selectedAddress);
  const [cartItemSelected, setCartItemSelected] = useState(demoCartItems);

  const [editForm, setEditForm] = useState({ name: '', phone: '', address: '' });
  const [newAddressForm, setNewAddressForm] = useState({
    name: "",
    phone: "",
    address: "",
    detailAddress: "",
    addressType: "home",
    isDefault: false,
    location: "",
  });

  const calculateSubtotal = () =>
    cartItemSelected.reduce((total, item) => total + item.price * (1 - item.discount / 100) * item.quantity, 0);

  const calculateTotal = () => calculateSubtotal() + shippingFee;

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddressForm({
      ...newAddressForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openNewAddressModal = () => {
    setShowAddressModal(false);
    setShowNewAddressModal(true);
  };

  const closeNewAddressModal = () => {
    setShowNewAddressModal(false);
    setShowAddressModal(true);
  };

  const selectAddress = (address) => {
    setTempSelectedAddress(address);
  };

  const confirmAddressSelection = () => {
    if (tempSelectedAddress) {
      setSelectedAddress(tempSelectedAddress);
    }
    setShowAddressModal(false);
    setTempSelectedAddress(null);
  };
  
  const handleCheckout = () => {
    console.log("Chức năng 'Đặt hàng' (demo)");
  };
  
  const handleAddNewAddress = () => {
    console.log("Chức năng 'Thêm địa chỉ' (demo)");
    setShowNewAddressModal(false);
  };

  const handleEditAddress = (addr, e) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    setEditForm({ name: addr.name, phone: addr.phone, address: addr.address });
  };
  
  const handleSaveEditAddress = () => {
     console.log("Chức năng 'Lưu' (demo)");
     setEditingAddressId(null);
  }

  const handleDeleteAddress = (addrId, e) => {
    e.stopPropagation();
    console.log("Chức năng 'Xóa' (demo)");
  };
  
  const setAddressAsDefault = (addressId, e) => {
     e.stopPropagation();
     console.log("Chức năng 'Thiết lập mặc định' (demo)");
  }

  if (!cartItemSelected || !selectedAddress) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6 py-10">
      <div 
            className={`bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-7xl font-[Manrope] space-y-6 overflow-hidden text-[${TEXT_COLOR}]`}
        >
        <div className="px-6 py-4">
          <div className="flex items-start gap-4">
            <FiMapPin className="text-[#6F47EB] h-6 w-6 mt-1 animate-pulse" />
            <div className="flex-1">
              <h2 className="text-[#6F47EB] text-lg font-semibold">Địa Chỉ Nhận Hàng</h2>

              {selectedAddress ? (
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">{selectedAddress.name}</p>
                    <p className="text-gray-600 mb-2">{selectedAddress.phone}</p>
                    <p className="text-gray-600 text-sm">{selectedAddress.address}</p>
                  </div>
                  <div className="flex gap-4">
                    {selectedAddress.isDefault && (
                      <span className="border border-[#6F47EB] text-[#6F47EB] px-3 py-1 rounded text-sm">Mặc Định</span>
                    )}
                    <button 
                      className={`text-gray-600 font-medium hover:text-[${PRIMARY_COLOR}] transition-colors duration-200`} 
                      onClick={() => setShowAddressModal(true)}
                    >
                      Thay Đổi
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center pt-2">
                  <p className="text-gray-600 text-sm italic">Bạn chưa có địa chỉ nhận hàng. Vui lòng cập nhật thông tin.</p>
                  <button 
                    className={`text-gray-600 font-medium hover:text-[${PRIMARY_COLOR}] transition-colors duration-200`} 
                    onClick={() => setShowAddressModal(true)}
                  >
                    Thêm Địa Chỉ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className={`grid grid-cols-12 gap-4 pb-2 border-b text-base font-medium text-[${TEXT_COLOR}]`}>
            <div className="col-span-6">Sản phẩm</div>
            <div className="col-span-2 text-right">Đơn giá</div>
            <div className="col-span-2 text-center">Số lượng</div>
            <div className="col-span-2 text-right">Thành tiền</div>
          </div>

          {cartItemSelected.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-4 items-center py-3 border-b text-gray-700 transition-all duration-200 hover:bg-gray-50">
              <div className="col-span-6 flex items-center gap-3">
                <img src={item.thumbnails[0]} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-gray-100" />
                <p className={`text-sm text-[${TEXT_COLOR}]`}>{item.name}</p>
              </div>
              <div className="col-span-2 text-right text-sm">{(item.price * (1 - item.discount / 100)).toLocaleString()} đ</div>
              <div className="col-span-2 text-center text-sm">{item.quantity}</div>
              <div className="col-span-2 text-right font-semibold">{(item.price * (1 - item.discount / 100) * item.quantity).toLocaleString()} đ</div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
          <label className={`col-span-3 text-gray-600`}>Lời nhắn:</label>
          <div className="col-span-9">
            <input
              type="text"
              className={`w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[${PRIMARY_COLOR}] focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 transition-all duration-200`}
              placeholder="Lưu ý cho Người bán..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-4 grid grid-cols-12 gap-4 text-gray-800">
          <div className={`col-span-3 font-medium text-[${TEXT_COLOR}]`}>Phương thức vận chuyển:</div>
          <div className="col-span-7 space-y-4">
            <div>
              <div className="flex items-center">
                <span className="font-medium">Nhanh</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Nhận hàng từ 8–9 Tháng 5</p>
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                Nhận voucher ₫15.000 nếu giao sau 9 Tháng 5 2025
                <FiInfo className={`h-4 w-4 ml-1 text-[${TEXT_COLOR}]`} />
              </p>
            </div>
            <div className="mt-2">
              <p className="text-sm">
                Hoặc chọn Hỏa Tốc để{" "}
                <br />
                <button className={`text-[${PRIMARY_COLOR}] font-medium inline-flex items-center mt-2 hover:text-[${PRIMARY_HOVER}]`}>
                  <FiCheckCircle className="h-4 w-4 mr-1" />
                  nhận hôm nay
                  <FiChevronRight className="h-4 w-4 ml-1" />
                </button>
              </p>
            </div>
          </div>
          <div className="col-span-2 text-right font-medium">{shippingFee.toLocaleString('vi-VN')} đ</div>
        </div>

        <div className="px-6 py-4 space-y-6 text-gray-800">
          <div>
            <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
            <div className="flex space-x-4">
              {["credit", "googlepay", "cod"].map((method) => (
                <button
                  key={method}
                  className={`border rounded px-4 py-2 text-sm transition-all duration-200 hover:scale-105 
                        ${selectedPaymentMethod === method ? `border-[${PRIMARY_COLOR}] text-[${PRIMARY_COLOR}]` : "hover:border-gray-400"}
                    `}
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

          <div className="space-y-2 border-t border-b py-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span>{new Intl.NumberFormat('vi-VN').format(calculateSubtotal())} đ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span>{new Intl.NumberFormat('vi-VN').format(shippingFee)} đ</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tổng thanh toán</span>
            <span className="text-2xl font-bold text-[#6F47EB]">
              {new Intl.NumberFormat('vi-VN').format(calculateTotal())} đ
            </span>
          </div>
        </div>

        <div className="px-6 py-4 flex justify-between items-center text-sm text-gray-600">
          <p>
            Khi nhấn <span className="font-medium">'Đặt hàng'</span>, bạn đồng ý
            với <a href="#" className="text-blue-500 hover:underline">Điều khoản StyleNest</a>.
          </p>
          <button 
            className={`bg-[${PRIMARY_COLOR}] hover:bg-[${PRIMARY_HOVER}] text-white font-medium py-3 px-4 rounded transition-all duration-200 hover:scale-105 hover:shadow-lg`}
            onClick={handleCheckout}
          >
            Đặt hàng
          </button>
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
                  className={`border rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                    tempSelectedAddress?.id === addr.id ? `border-[${PRIMARY_COLOR}]` : "border-gray-200 bg-white" 
                  } hover:shadow-md`}
                  onClick={() => selectAddress(addr)}
                >
                  <div className="flex justify-between items-start gap-4">
                    {editingAddressId === addr.id ? (
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[${PRIMARY_COLOR}] focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 transition-all duration-200`}
                          value={editForm.name}
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
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
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
                        <p className="text-sm text-gray-700">{addr.address}</p>
                      </div>
                    )}

                    <div className="flex flex-col items-end text-sm">
                      {addr.isDefault ? (
                        <span className="text-[#6F47EB] border border-[#6F47EB] px-3 py-2 rounded mb-4 text-xs font-medium">
                          Mặc Định
                        </span>
                      ) : (
                        <button
                          className={`text-[${PRIMARY_COLOR}] border border-[${PRIMARY_COLOR}] px-3 py-2 rounded hover:bg-indigo-50 mb-4 text-xs transition-all duration-200 hover:scale-105`}
                          onClick={(e) => setAddressAsDefault(addr.id, e)}
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
                    onChange={handleNewAddressChange}
                    className={`w-full border border-gray-300 rounded px-4 py-3 appearance-none transition-all duration-200 focus:border-[${PRIMARY_COLOR}] focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20`}
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

              <div>
                <textarea
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
    </div>
  );
}

export default Checkout;