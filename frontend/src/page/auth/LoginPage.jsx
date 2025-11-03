// src/page/auth/LoginPage.jsx (Đã sửa)

import { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
          "http://localhost:8080/api/accounts/login",
          {
            userName: username,
            password: password
          },
          { withCredentials: true }
      );

      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        // Dùng window.location.href để ép Header load lại localStorage
        window.location.href = "/";
      } else {
        setError("Đăng nhập thất bại, không nhận được token.");
      }
    } catch (err) {
      if (err.response?.status === 401)
        setError("Sai tên đăng nhập, mật khẩu hoặc tài khoản chưa kích hoạt.");
      else setError("Đã xảy ra lỗi! Vui lòng thử lại.");
    }
  };

  return (
    <div className="w-full bg-gray-50 py-10 font-[Manrope]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-2xl rounded-2xl overflow-hidden flex w-full max-w-7xl mx-auto"
      >
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900">Chào mừng trở lại</h1>
          <p className="text-gray-600 mt-1 mb-8">
            Đăng nhập vào <span className="font-semibold text-[#6F47EB]">StyleNest</span>
          </p>
      <div className="w-full bg-gray-50 py-10 font-[Manrope]">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-2xl rounded-2xl overflow-hidden flex w-full max-w-7xl mx-auto"
        >
          {/* ... (Phần hình ảnh) ... */}
          <div className="hidden md:block w-1/2">
            <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                alt="Login"
                className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
            {/* ... (Phần tiêu đề và nút Google) ... */}
            <h1 className="text-4xl font-bold text-gray-900">Chào mừng trở lại</h1>
            <p className="text-gray-600 mt-1 mb-8">
              Đăng nhập vào <span className="font-semibold text-[#6F47EB]">Planto</span>
            </p>

            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-100 transition">
              <FcGoogle className="w-5 h-5" /> Tiếp tục với Google
            </button>

            <div className="flex items-center gap-2 my-8">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm">Hoặc đăng nhập bằng</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* === SỬA LABEL CHO TÊN ĐĂNG NHẬP === */}
              <div className="relative">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB] focus:outline-none py-3"
                    placeholder=" "
                />
                <label
                    // SỬA: Đổi default 'top-3 text-base' thành '-top-4 text-sm'
                    className="absolute left-0 -top-4 text-sm text-gray-500 transition-all duration-300
                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                    peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]"
                >
                  Tên đăng nhập
                </label>
              </div>

              {/* === SỬA LABEL CHO MẬT KHẨU === */}
              <div className="relative">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB] focus:outline-none py-3"
                    placeholder=" "
                />
                <label
                    // SỬA: Đổi default 'top-3 text-base' thành '-top-4 text-sm'
                    className="absolute left-0 -top-4 text-sm text-gray-500 transition-all duration-300
                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                    peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]"
                >
                  Mật khẩu
                </label>
              </div>

              {/* ... (Phần còn lại của form) ... */}
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
                  className="w-full bg-[#6F47EB] text-white py-3 rounded-xl font-semibold hover:bg-[#5a36cc] transition-all duration-300 shadow-md"
              >
                Đăng nhập
              </button>

              <div className="flex justify-between items-center text-sm pt-2">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="accent-[#6F47EB]" /> Ghi nhớ
                </label>
                <a
                    href="#"
                    className="text-[#6F47EB] hover:text-[#5a36cc] hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>

              <div className="text-center text-sm pt-4">
                <span className="text-gray-600">Chưa có tài khoản? </span>
                <Link
                    to="/register"
                    className="text-[#6F47EB] font-semibold hover:text-[#5a36cc] hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
  );
}

export default LoginPage;