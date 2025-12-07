import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { saveOrUpdateAccount } from "../../context/AccountsContext";

import axiosClient from "../../api/axiosClient";

const AccountForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addresses: [
      {
        id: uuidv4(),
        street: "",
        city: "",
        phoneNumber: "",
        isDefault: false,
      },
    ],
  });

  const [account, setAccount] = useState({
    username: "",
    role: "CUSTOMER",
    active: true,
    userId: null,
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const accRes = await axiosClient.get(`/accounts/${id}`);
        const acc = accRes.data;

        setAccount({
          id: acc.id,
          username: acc.username,
          role: acc.role,
          active: acc.active,
          userId: acc.userId,
        });
        if (acc.userId) {
          const userRes = await axiosClient.get(`/users/${acc.userId}`);
          const usr = userRes.data;

          setUser({
            firstName: usr.firstName,
            lastName: usr.lastName,
            email: usr.email,
            addresses: usr.addresses?.length
                ? usr.addresses.map((address) => ({
                  id: address.id,
                  street: address.street,
                  city: address.city ?? "",
                  phoneNumber: address.phoneNumber,
                  isDefault: Boolean(address.isDefault),
                }))
                : [
                  {
                    id: uuidv4(),
                    street: "",
                    city: "",
                    phoneNumber: "",
                    isDefault: false,
                  },
                ],
          });
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addAddress = () => {
    setUser({
      ...user,
      addresses: [
        ...user.addresses,
        {
          id: uuidv4(),
          street: "",
          city: "",
          phoneNumber: "",
          isDefault: false,
        },
      ],
    });
  };

  const setDefaultAddress = (index) => {
    setUser((prevUser) => {
      const updated = prevUser.addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index,
      }));
      return { ...prevUser, addresses: updated };
    });
  };

  const removeAddress = (index) => {
    const updated = [...user.addresses];
    updated.splice(index, 1);
    setUser({ ...user, addresses: updated });
  };

  const updateAddress = (index, field, value) => {
    const updated = [...user.addresses];
    updated[index][field] = value;
    setUser({ ...user, addresses: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!id) {
      saveOrUpdateAccount(account, user, "add")
          .then((res) => {
            alert("Tạo tài khoản thành công!");
            navigate("/admin/accounts");
          })
          .catch((err) => {
            console.error(err);
            const msg = err.response?.data?.message || err.message;
            alert("Lỗi khi tạo tài khoản: " + msg);
          });
    } else {
      saveOrUpdateAccount(account, user, "update")
          .then((res) => {
            alert("Cập nhật tài khoản thành công!");
            navigate("/admin/accounts");
          })
          .catch((err) => {
            console.error(err);
            const msg = err.response?.data?.message || err.message;
            alert("Lỗi khi cập nhật tài khoản: " + msg);
          });
    }
  };

  return (
      <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-4">
          {id ? "✏️ Edit Account" : "➕ Add New Account"}
        </h2>

        {isLoading && (
            <div className="text-center text-gray-500 py-4">
              Đang tải dữ liệu...
            </div>
        )}

        {/* ACCOUNT */}
        <h3 className="text-xl font-semibold mt-4">🔐 Thông tin tài khoản</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
              type="text"
              placeholder="Tên đăng nhập"
              className="border p-3 rounded-xl"
              value={account.username}
              onChange={(e) => setAccount({ ...account, username: e.target.value })}
          />

          <select
              className="border p-3 rounded-xl"
              value={account.role}
              onChange={(e) => setAccount({ ...account, role: e.target.value })}
          >
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPPORT">SUPPORT</option>
          </select>

          <select
              className="border p-3 rounded-xl"
              value={account.active ? "true" : "false"}
              onChange={(e) =>
                  setAccount({
                    ...account,
                    active: e.target.value === "true",
                  })
              }
          >
            <option value="true">Kích hoạt</option>
            <option value="false">Vô hiệu hóa</option>
          </select>
        </div>

        {/* USER */}
        <h3 className="text-xl font-semibold mt-6">👤 Thông tin người dùng</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
              type="text"
              placeholder="Họ"
              className="border p-3 rounded-xl"
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          />

          <input
              type="text"
              placeholder="Tên"
              className="border p-3 rounded-xl"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />

          <input
              type="email"
              placeholder="Email"
              className="border p-3 rounded-xl col-span-2"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        {/* ADDRESSES */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">🏠 Địa chỉ</h3>
            <button
                type="button"
                onClick={addAddress}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl"
            >
              <FiPlus /> Thêm Địa chỉ
            </button>
          </div>

          {user.addresses.map((addr, index) => (
              <motion.div
                  key={addr.id}
                  className="border p-4 rounded-xl mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 relative"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
              >
                <button
                    type="button"
                    onClick={() => removeAddress(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow"
                >
                  <FiTrash2 />
                </button>

                <input
                    type="text"
                    placeholder="Đường"
                    className="border p-3 rounded-xl"
                    value={addr.street}
                    onChange={(e) => updateAddress(index, "street", e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Thành phố"
                    className="border p-3 rounded-xl"
                    value={addr.city}
                    onChange={(e) => updateAddress(index, "city", e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Số điện thoại"
                    className="border p-3 rounded-xl"
                    value={addr.phoneNumber}
                    onChange={(e) =>
                        updateAddress(index, "phoneNumber", e.target.value)
                    }
                />

                <select
                    className="border p-3 rounded-xl"
                    value={addr.isDefault ? "true" : "false"}
                    onChange={(e) => {
                      if (e.target.value === "true") {
                        setDefaultAddress(index); // đảm bảo chỉ 1 default
                      } else {
                        updateAddress(index, "isDefault", false);
                      }
                    }}
                >
                  <option value="false">Địa chỉ phụ</option>
                  <option value="true">Mặc định</option>
                </select>
              </motion.div>
          ))}
        </div>

        {/* SUBMIT */}
        <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl w-full font-semibold"
        >
          {id ? "Update Account" : "Create Account"}
        </button>
      </motion.form>
  );
};

export default AccountForm;