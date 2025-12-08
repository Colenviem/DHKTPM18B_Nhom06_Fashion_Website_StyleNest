import React, { createContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";


export const AccountsContext = createContext();

export const AccountsProvider = ({ children }) => {
  const [accountsData, setAccountsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
        .get("/accounts")
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

  try {
    const url = method === "add"
        ? "/accounts/admin"
        : `/accounts/admin/${account.id}`;

    const response = await axiosClient({
      method: method === "add" ? "POST" : "PUT",
      url: url,
      data: { account, user },
    });

    const data = response.data;
    console.log("Response data:", data);

    return {
      type: "success",
      message: data?.message || "Lưu tài khoản thành công",
      account: data?.data || account,
    };

  } catch (error) {
    console.error("❌ Lỗi khi lưu/cập nhật tài khoản:", error);

    if (error.response && error.response.data) {
      const data = error.response.data;
      if (data.status === "error" && data.errors) {
        return Promise.reject({
          type: "validation",
          message: data.message,
          errors: data.errors,
        });
      } else {
        return Promise.reject({
          type: "server",
          message: data.message || "Lỗi không xác định từ server",
        });
      }
    }

    return Promise.reject({
      type: "network",
      message: "Không thể kết nối tới server hoặc thực hiện lưu/cập nhật dữ liệu.",
    });
  }
