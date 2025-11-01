// src/page/auth/VerifyPage.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function VerifyPage() {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Lấy email từ state được truyền qua khi navigate từ RegisterPage
    const email = location.state?.email;

    // Nếu không có email (người dùng vào trang này trực tiếp),
    // tự động chuyển hướng họ về trang đăng ký.
    useEffect(() => {
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (code.length !== 6 || !/^\d{6}$/.test(code)) {
            setError("Mã xác thực phải là 6 chữ số.");
            return;
        }

        setIsLoading(true);

        try {
            // Gọi API /api/accounts/verify
            // Backend của bạn dùng @RequestParam nên chúng ta truyền nó trên URL
            const res = await axios.post(
                `http://localhost:8080/api/accounts/verify?email=${email}&code=${code}`
            );

            // Backend (AccountServiceImpl.verifyCode) trả về user và token khi thành công
            if (res.status === 201 && res.data.token) {
                // TODO: Lưu token và thông tin user vào Context/LocalStorage
                // Giống hệt như trang Login
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                setMessage("Xác thực thành công! Đang chuyển hướng bạn...");

                // Chờ 2s rồi chuyển về trang chủ
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "Mã xác thực không đúng hoặc đã hết hạn."
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) {
        // Hiển thị loading hoặc null trong khi chuyển hướng
        return null;
    }

    return (
        <div className="w-full bg-gray-50 py-20 flex justify-center font-[Manrope]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-md p-8 sm:p-12"
            >
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-gray-900 text-center">
                        Kiểm tra Email của bạn
                    </h1>
                    <p className="text-gray-600 mt-3 mb-8 text-center">
                        Chúng tôi đã gửi một mã 6 chữ số tới <br />
                        <span className="font-semibold text-[#6F47EB]">{email}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                maxLength={6}
                                className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB] focus:outline-none py-3 text-center text-2xl tracking-[0.5em]"
                                placeholder=" "
                            />
                            <label className="absolute left-0 top-3 text-gray-500 text-base transition-all duration-300
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]">
                                Nhập mã xác thực
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

                        {message && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-green-700 text-sm text-center bg-green-50 p-2 rounded-md border border-green-200"
                            >
                                {message}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#6F47EB] text-white py-3 rounded-xl font-semibold
                hover:bg-[#5a36cc] transition-all duration-300 shadow-md
                disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Đang xử lý..." : "Xác Nhận"}
                        </button>

                        {/* Link đăng ký */}
                        <div className="text-center text-sm pt-4">
                            <span className="text-gray-600">Không nhận được mã? </span>
                            <button
                                type="button"
                                // TODO: Bạn có thể thêm logic gửi lại mã ở đây
                                // (Gọi API /api/accounts/forgot-password)
                                className="text-[#6F47EB] font-semibold hover:text-[#5a36cc] hover:underline"
                            >
                                Gửi lại
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default VerifyPage;