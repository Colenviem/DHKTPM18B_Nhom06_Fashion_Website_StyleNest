// LoginHistorys.jsx
const API_URL = "http://localhost:8080/api/login-history";

// Ghi login cho CUSTOMER
export async function addCustomerLogin(username) {
  try {
    const res = await fetch(`${API_URL}/customer/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  } catch (error) {
    console.error("Error addCustomerLogin:", error);
    return null;
  }
}

// Lấy thống kê hôm nay (group theo username)
export async function getTodayStats() {
  try {
    const res = await fetch(`${API_URL}/stats/today`);
    return await res.json();
  } catch (error) {
    console.error("Error getTodayStats:", error);
    return null;
  }
}

// Lấy thống kê hôm qua (group theo username)
export async function getYesterdayStats() {
  try {
    const res = await fetch(`${API_URL}/stats/yesterday`);
    return await res.json();
  } catch (error) {
    console.error("Error getYesterdayStats:", error);
    return null;
  }
}
