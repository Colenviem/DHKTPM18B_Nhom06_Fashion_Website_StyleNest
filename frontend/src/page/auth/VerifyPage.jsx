import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient"; // ✅ Dùng axiosClient
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SkeletonOtp, SkeletonButton } from "../../components/loadings/Skeleton";

function VerifyPage() {
    const [searchParams] = useSearchParams();
    const urlEmail = searchParams.get("email");
    const urlCode = searchParams.get("code");

    const [code, setCode] = useState(urlCode || "");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const email = urlEmail || location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate("/register");
        }
        if (urlEmail && urlCode) {
            autoSubmitVerification(urlEmail, urlCode);
        }
    }, [email, navigate, urlEmail, urlCode]);

    const autoSubmitVerification = async (emailToVerify, codeToVerify) => {
        setIsLoading(true);
        setError("");
        setMessage("Đang tự động xác thực...");
        try {
            // ✅ Sửa: Gọi qua axiosClient, dùng template literal cho query param
            const res = await axiosClient.post(
                `/accounts/verify?email=${emailToVerify}&code=${codeToVerify}`
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
            setMessage("");
        } finally {
            setIsLoading(false);
        }
    };

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
            // ✅ Sửa: Gọi qua axiosClient
            const res = await axiosClient.post(
                `/accounts/verify?email=${email}&code=${code}`
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

    const handleResendCode = async () => {
        setIsResending(true);
        setResendMessage("");
        setError("");

        try {
            // ✅ Sửa: Gọi qua axiosClient
            await axiosClient.post(
                `/accounts/forgot-password`,
                { email: email }
            );
            setResendMessage("Đã gửi lại mã thành công!");
        } catch (err) {
            setResendMessage("Gửi lại thất bại. Vui lòng thử lại.");
        } finally {
            setIsResending(false);
            setTimeout(() => setResendMessage(""), 5000);
        }
    };


    if (!email) {
        return null;
    }

    const VerifySkeleton = () => (
        <div className="space-y-6 pt-2">
            <SkeletonOtp />
            <SkeletonButton />
        </div>
    );

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

                    {isLoading ? (
                        <VerifySkeleton />
                    ) : (
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
                        </form>
                    )}

                    {!isLoading && (
                        <div className="text-center text-sm pt-4">
                            <span className="text-gray-600">Không nhận được mã? </span>
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={isResending}
                                className="text-[#6F47EB] font-semibold hover:text-[#5a36cc] hover:underline
                                           disabled:text-gray-400 disabled:no-underline"
                            >
                                {isResending ? "Đang gửi..." : "Gửi lại"}
                            </button>

                            {resendMessage && (
                                <p className="text-sm text-green-600 mt-2">
                                    {resendMessage}
                                </p>
                            )}
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    );
}

export default VerifyPage;