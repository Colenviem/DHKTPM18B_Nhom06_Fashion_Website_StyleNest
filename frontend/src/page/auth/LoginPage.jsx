// src/pages/LoginPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SkeletonInput, SkeletonButton } from "../../components/loadings/Skeleton";

// 👉 Import hàm từ LoginHistorys.jsx
import { addCustomerLogin } from "../../context/LoginHistorys";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
        { userName: username.trim(), password },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.token) {
        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // 🔥 Ghi lịch sử đăng nhập nếu là CUSTOMER
        if (user.role === "CUSTOMER") {
          try {
            await addCustomerLogin(user.userName);
          } catch (e) {
            console.error("Không thể ghi lịch sử login:", e);
          }
        }

        // Trigger refresh auth state
        window.dispatchEvent(new Event("auth-change"));

        // Điều hướng
        if (user.role === "ADMIN") navigate("/admin/dashboard");
        else navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Sai tên đăng nhập, mật khẩu hoặc tài khoản chưa kích hoạt."
          : "Đã xảy ra lỗi! Vui lòng thử lại."
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
      <div className="flex justify-between">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-50 py-10 font-[Manrope]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-2xl rounded-2xl overflow-hidden flex w-full max-w-7xl mx-auto"
      >

        {/* Banner */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900">Chào mừng trở lại</h1>
          <p className="text-gray-600 mt-1 mb-8">
            Đăng nhập vào <span className="font-semibold text-[#6F47EB]">StyleNest</span>
          </p>

          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-100 transition">
            <FcGoogle className="w-5 h-5" /> Tiếp tục với Google
          </button>

          <div className="flex items-center gap-2 my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">Hoặc đăng nhập bằng</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

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
                  className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB] focus:outline-none py-3"
                  placeholder=" "
                />
                <label className="absolute left-0 -top-4 text-sm text-gray-500 transition-all duration-300
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                  peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]">
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
                  className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB]
                             focus:outline-none py-3 pr-10"
                  placeholder=" "
                />

                {/* Eye toggle */}
                <span
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "👁️" : "🙈"}
                </span>

                <label className="absolute left-0 -top-4 text-sm text-gray-500 transition-all duration-300
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                  peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]">
                  Mật khẩu
                </label>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6F47EB] text-white py-3 rounded-xl font-semibold
                hover:bg-[#5a36cc] transition-all duration-300 shadow-md disabled:bg-gray-400"
              >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
