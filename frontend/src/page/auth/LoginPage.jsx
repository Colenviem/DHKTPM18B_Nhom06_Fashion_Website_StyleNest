import { useState } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";
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
      const res = await axios.post("http://localhost:8080/api/auth/login",
        { username, password },
        { withCredentials: true }
      );
      if (res.status === 200) navigate("/");
    } catch (err) {
      if (err.response?.status === 401) setError("Sai tên đăng nhập hoặc mật khẩu!");
      else setError("Đã xảy ra lỗi! Vui lòng thử lại.");
    }
  };

  return (
  <div className="flex justify-center items-centerw-full w-full p-6 bg-gray-100">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-2xl rounded-2xl overflow-hidden flex w-full max-w-7xl mx-auto"
    >
      {/* Ảnh bên trái */}
      <div className="hidden md:block w-1/2">
        <img
          src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form bên phải */}
      <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 mt-1 mb-8">
          Sign in to <span className="font-semibold">Planto</span>
        </p>

        {/* Nút Google */}
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-100 transition">
          <FcGoogle className="w-5 h-5" /> Tiếp tục với Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 my-8">
          <div className="flex-1 border-t"></div>
          <span className="text-gray-500 text-sm">Hoặc đăng nhập bằng</span>
          <div className="flex-1 border-t"></div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="peer w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-3"
              placeholder=" "
            />
            <label className="absolute left-0 top-3 text-gray-500 text-base transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-sm peer-focus:text-black">
              Tên đăng nhập
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-3"
              placeholder=" "
            />
            <label className="absolute left-0 top-3 text-gray-500 text-base transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-sm peer-focus:text-black">
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

          <button type="submit" className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
            Đăng nhập
          </button>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-black" /> Ghi nhớ
            </label>
            <a href="#" className="text-gray-600 hover:text-black hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          <div className="text-center text-sm pt-4">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Link to="/register" className="text-black font-semibold hover:underline">
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
