import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function VerifyPage() {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 1. Thêm state cho nút "Gửi lại"
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;


    useEffect(() => {
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    // (handleSubmit không đổi, đã chính xác)
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
            const res = await axios.post(
                `http://localhost:8080/api/accounts/verify?email=${email}&code=${code}`
            );

            if (res.status === 201 && res.data.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setMessage("Xác thực thành công! Đang chuyển hướng bạn...");
                setTimeout(() => {
                    window.location.href = "/";
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

    // 2. Thêm hàm xử lý "Gửi lại mã"
    const handleResendCode = async () => {
        setIsResending(true);
        setResendMessage("");
        setError(""); // Xóa lỗi cũ

        try {
            // Gọi API /forgot-password, vì nó có chức năng gửi code đến email
            await axios.post(
                `http://localhost:8080/api/accounts/forgot-password`,
                { email: email }
            );
            setResendMessage("Đã gửi lại mã thành công!");
        } catch (err) {
            setResendMessage("Gửi lại thất bại. Vui lòng thử lại.");
        } finally {
            setIsResending(false);
            // Ẩn thông báo sau 5 giây
            setTimeout(() => setResendMessage(""), 5000);
        }
    };


    if (!email) {
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
                            {/* 3. SỬA LỖI GIAO DIỆN LABEL */}
                            <label
                                className="absolute left-0 -top-4 text-sm text-gray-500 transition-all duration-300
                                peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                                peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]"
                            >
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

                        <div className="text-center text-sm pt-4">
                            <span className="text-gray-600">Không nhận được mã? </span>
                            <button
                                type="button"
                                // 4. Thêm onClick và logic disabled
                                onClick={handleResendCode}
                                disabled={isResending}
                                className="text-[#6F47EB] font-semibold hover:text-[#5a36cc] hover:underline
                                           disabled:text-gray-400 disabled:no-underline"
                            >
                                {isResending ? "Đang gửi..." : "Gửi lại"}
                            </button>

                            {/* 5. Thêm thông báo gửi lại */}
                            {resendMessage && (
                                <p className="text-sm text-green-600 mt-2">
                                    {resendMessage}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default VerifyPage;