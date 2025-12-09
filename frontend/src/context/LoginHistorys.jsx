
import axiosClient from "../api/axiosClient";

const API_URL = "/login-history"; // axiosClient đã có baseURL nên chỉ cần path

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

export const getTodayStats = async () => {
  return axiosClient
    .get("/login-history/stats/today")
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

export const getYesterdayStats = async () => {
  return axiosClient
    .get("/login-history/stats/yesterday")
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
