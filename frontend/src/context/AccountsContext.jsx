import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Tạo Context
export const AccountsContext = createContext();

// Provider component
export const AccountsProvider = ({ children }) => {
  const [accountsData, setAccountsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8080/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAccountsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  return (
    <AccountsContext.Provider
      value={{ accountsData, setAccountsData, loading }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const saveOrUpdateAccount = async (account, user, method) => {
  console.log("saveOrUpdateAccount called with:", { account, user, method });
  const token = localStorage.getItem("token");
  try {
    const url = method === "add"
      ? "http://localhost:8080/api/accounts/admin"
      : `http://localhost:8080/api/accounts/admin/${account.id}`; // dùng account.id

    const response = await fetch(url, {
      method: method === "add" ? "POST" : "PUT",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ account, user }),
    });

    let data;
    try {
      data = await response.json();  // parse JSON
      console.log("Response data:", data);
    } catch (err) {
      data = null; // nếu server trả về không phải JSON
    }

    if (!response.ok) {
      if (data?.status === "error" && data?.errors) {
        return Promise.reject({
          type: "validation",
          message: data.message,
          errors: data.errors,
        });
      } else {
        return Promise.reject({
          type: "server",
          message: data?.message || "Lỗi không xác định từ server",
        });
      }
    }

    return {
      type: "success",
      message: data?.message || "Lưu tài khoản thành công",
      account: data?.data || account,
    };

  } catch (error) {
    console.error("❌ Lỗi khi lưu/cập nhật tài khoản:", error);
    return Promise.reject({
      type: "network",
      message: "Không thể kết nối tới server hoặc thực hiện lưu/cập nhật dữ liệu.",
    });
  }
};

