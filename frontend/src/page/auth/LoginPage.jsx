import { useState } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineMail } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/login",
      { username, password },
      { withCredentials: true } // gửi cookie session
    );

    if (res.status === 200) {
      navigate("/"); // đăng nhập thành công
    }
  } catch (err) {
    console.error("Login error:", err);

    // Nếu server có phản hồi (HTTP status khác 2xx)
    if (err.response) {
      if (err.response.status === 401) {
        setError("Sai tên đăng nhập hoặc mật khẩu!");
      } else {
        setError(`Lỗi từ server: ${err.response.data || err.response.statusText}`);
      }

    // Nếu request đã gửi nhưng không nhận được phản hồi (server không phản hồi)
    } else if (err.request) {
      setError("Không thể kết nối đến server. Vui lòng thử lại sau!");

    // Lỗi khác (ví dụ lỗi cú pháp, lỗi JS, v.v.)
    } else {
      setError("Đã xảy ra lỗi không xác định: " + err.message);
    }
  }
};

  return (
    <div className="flex items-center justify-center bg-gray-50 min-h-[70vh] px-4">
      <div className="p-10 bg-white shadow-md rounded-2xl overflow-hidden flex w-full max-w-5xl">
        {/* Left Image */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
            alt="Login banner"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FASCO</h1>
          <h2 className="text-lg font-semibold text-gray-700 mb-6">
            Sign In To FASCO
          </h2>

          {/* Social Buttons */}
          <div className="flex gap-4 mb-6">
            <Button
              text="Sign up with Google"
              variant="google"
              icon={<FcGoogle className="w-5 h-5" />}
            />
            <Button
              text="Sign up with Email"
              variant="email"
              icon={<AiOutlineMail className="w-5 h-5 text-red-500" />}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-2"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-2"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}

            <Button text="Sign In" variant="default" />

            <Link to="/register">
              <Button text="Register Now" variant="outline" />
            </Link>

            <div className="text-right">
              <a href="#" className="text-blue-500 text-sm hover:underline">
                Forget Password?
              </a>
            </div>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-500 mt-8">FASCO Terms & Conditions</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
