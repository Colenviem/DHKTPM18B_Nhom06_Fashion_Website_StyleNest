// src/pages/LoginPage.jsx
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// Import đúng API mới (dùng axiosClient)
import { addCustomerLogin } from "../../context/LoginHistorys"; // Đường dẫn chính xác

import { SkeletonInput, SkeletonButton } from "../../components/loadings/Skeleton";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Xóa thông báo lỗi sau 4 giây
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/accounts/login",
        { 
          userName: username.trim(), 
          password 
        },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.token) {
        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "CUSTOMER") {
          const loginResult = await addCustomerLogin(user.userName);
          if (!loginResult.success) {
            console.warn("Không ghi được lịch sử đăng nhập:", loginResult.message);
          }
        }

        window.dispatchEvent(new Event("auth-change"));

        if (user.role === "ADMIN" || user.role === "STAFF") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.status === 401
          ? "Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại!"
          : "Không thể kết nối đến server. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const LoginSkeleton = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <SkeletonInput />
        <SkeletonInput />
      </div>
      <SkeletonButton />
      <div className="flex justify-between text-sm">
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-50 py-10 font-[Manrope] min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-2xl rounded-2xl overflow-hidden flex w-full max-w-7xl mx-auto"
      >
        {/* Banner trái */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
            alt="Welcome back"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form đăng nhập */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại
          </h1>
          <p className="text-gray-600 mb-8">
            Đăng nhập vào <span className="font-bold text-[#6F47EB]">StyleNest</span>
          </p>

          {/* Google Login (tạm chưa làm) */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition mb-6">
            <FcGoogle className="text-2xl" />
            <span className="font-medium">Tiếp tục với Google</span>
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">Hoặc</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Form */}
          {isLoading ? (
            <LoginSkeleton />
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username */}
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="peer w-full border-b-2 border-gray-300 pt-8 pb-3 focus:border-[#6F47EB] focus:outline-none transition"
                  placeholder=" "
                />
                <label className="absolute left-0 top-3 text-gray-500 text-sm transition-all 
                  peer-placeholder-shown:top-8 peer-placeholder-shown:text-base
                  peer-focus:top-3 peer-focus:text-sm peer-focus:text-[#6F47EB]">
                  Tên đăng nhập
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="peer w-full border-b-2 border-gray-300 pt-8 pb-3 pr-10 focus:border-[#6F47EB] focus:outline-none transition"
                  placeholder=" "
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-8 cursor-pointer select-none text-xl"
                >
                  {showPassword ? "Visible" : "Hidden"}
                </span>
                <label className="absolute left-0 top-3 text-gray-500 text-sm transition-all 
                  peer-placeholder-shown:top-8 peer-placeholder-shown:text-base
                  peer-focus:top-3 peer-focus:text-sm peer-focus:text-[#6F47EB]">
                  Mật khẩu
                </label>
              </div>

              {/* Thông báo lỗi */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-4 rounded-lg text-center font-medium border border-red-200"
                >
                  {error}
                </motion.div>
              )}

              {/* Nút đăng nhập */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6F47EB] hover:bg-[#5a36cc] text-white font-bold py-4 rounded-xl transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-[#6F47EB] font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;