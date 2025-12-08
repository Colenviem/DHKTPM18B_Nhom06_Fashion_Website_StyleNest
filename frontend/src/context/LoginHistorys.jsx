// src/api/LoginHistoryApi.js  (khuyên tạo file riêng cho đẹp)

import axiosClient from "../api/axiosClient";

// API URL (nếu cần override baseURL, nhưng thường không cần vì axiosClient đã có)
const API_URL = "/login-history"; // axiosClient đã có baseURL nên chỉ cần path

// Ghi lại lần đăng nhập của khách hàng
export const addCustomerLogin = async (username) => {
  try {
    const response = await axiosClient.post(`${API_URL}/customer/${username}`);
    return {
      success: true,
      data: response.data,
      message: response.data?.message || "Ghi nhận đăng nhập thành công",
    };
  } catch (error) {
    console.error("Lỗi khi ghi login khách hàng:", error);

    // Xử lý lỗi giống các hàm khác trong dự án của bạn
    if (error.response) {
      const errData = error.response.data;
      return {
        success: false,
        message: errData?.message || "Lỗi server khi ghi login",
        status: error.response.status,
      };
    }

    return {
      success: false,
      message: "Không thể kết nối đến server",
    };
  }
};

// Lấy thống kê đăng nhập hôm nay (group theo username)
export const getTodayStats = async () => {
  return axiosClient
    .get(`${API_URL}/stats/today`)
    .then((response) => ({
      success: true,
      data: response.data,
    }))
    .catch((error) => {
      console.error("Lỗi lấy thống kê hôm nay:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Không thể lấy thống kê đăng nhập hôm nay",
      };
    });
};

// Lấy thống kê đăng nhập hôm qua
export const getYesterdayStats = async () => {
  return axiosClient
    .get(`${API_URL}/stats/yesterday`)
    .then((response) => ({
      success: true,
      data: response.data,
    }))
    .catch((error) => {
      console.error("Lỗi lấy thống kê hôm qua:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Không thể lấy thống kê đăng nhập hôm qua",
      };
    });
};

// Bonus: Lấy toàn bộ lịch sử đăng nhập (nếu cần)
export const getAllLoginHistory = async (page = 0, size = 20) => {
  try {
    const response = await axiosClient.get(`${API_URL}`, {
      params: { page, size },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Lỗi lấy lịch sử đăng nhập:", error);
    return {
      success: false,
      message: "Không thể tải lịch sử đăng nhập",
    };
  }
};