// src/pages/LoginPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SkeletonInput, SkeletonButton } from "../../components/loadings/Skeleton";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁 Thêm state toggle
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

        window.dispatchEvent(new Event("auth-change"));

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

                  {/* Password + 👁 Eye icon */}
                  <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"} // <-- Toggle eye
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB]
                             focus:outline-none py-3 pr-10"
                        placeholder=" "
                    />

                    {/* 👁 Eye icon */}
                    <span
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                  {showPassword ? (
                      // Eye Open
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-gray-500 hover:text-[#6F47EB] transition"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51
       7.36 4.5 12 4.5c4.638 0 8.573 3.007
       9.963 7.178.07.207.07.431 0 .639C20.577
       16.49 16.64 19.5 12 19.5c-4.638
       0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>

                  ) : (
                      // Eye Closed
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-gray-500 hover:text-[#6F47EB] transition"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.228 6.228A10.45 10.45 0 0112 4.5c4.756
       0 8.773 3.162 10.065 7.5a10.523
       10.523 0 01-4.293 5.773"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894
       7.894L21 21m-3.228-3.228l-3.65-3.65m0
       0a3 3 0 10-4.243-4.243"
                        />
                      </svg>
                  )}
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

                  <div className="flex justify-between items-center text-sm pt-2">
                    <label className="flex items-center gap-2 text-gray-600">
                      <input type="checkbox" className="accent-[#6F47EB]" /> Ghi nhớ
                    </label>
                    <Link
                        to="/forgot-password"
                        className="text-[#6F47EB] hover:text-[#5a36cc] hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
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
            )}
          </div>
        </motion.div>
      </div>
  );
}

export default LoginPage;
