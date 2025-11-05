import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SkeletonInput, SkeletonButton } from "../../components/loadings/Skeleton";

function ForgotPasswordPage() {

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Email là bắt buộc.");
            return;
        }
        setIsLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:8080/api/accounts/forgot-password",
                { email: email }
            );

            setMessage(res.data.message || "Đã gửi mã, vui lòng kiểm tra email.");
            setError("");
            setStep(2);

        } catch (err) {
            setError(
                err.response?.data?.message || "Email không tồn tại hoặc đã xảy ra lỗi."
            );
            setMessage("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!code || !newPassword || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        setIsLoading(true);

        try {
            // Gọi API /reset-password của backend
            const res = await axios.post(
                "http://localhost:8080/api/accounts/reset-password",
                {
                    email: email,
                    verificationCode: code,
                    newPassword: newPassword,
                }
            );

            setMessage(res.data.message || "Đặt lại mật khẩu thành công!");
            setError("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setError(
                err.response?.data?.message || "Mã không đúng, đã hết hạn, hoặc có lỗi xảy ra."
            );
            setMessage("");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        if (step === 1) {
            return (
                <form onSubmit={handleRequestCode} className="space-y-6">
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB] focus:outline-none py-3"
                            placeholder=" "
                        />
                        <label className="absolute left-0 -top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]">
                            Email của bạn
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#6F47EB] text-white py-3 rounded-xl font-semibold hover:bg-[#5a36cc] transition-all duration-300 shadow-md disabled:bg-gray-400"
                    >
                        {isLoading ? "Đang gửi..." : "Gửi Mã Xác Thực"}
                    </button>
                </form>
            );
        }

        if (step === 2) {
            return (
                <form onSubmit={handleResetPassword} className="space-y-6">
                    {/* Mã xác thực */}
                    <div className="relative">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            maxLength={6}
                            className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB] focus:outline-none py-3 text-center text-xl tracking-[0.3em]"
                            placeholder=" "
                        />
                        <label className="absolute left-0 -top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]">
                            Mã xác thực (từ email)
                        </label>
                    </div>

                    {/* Mật khẩu mới */}
                    <div className="relative">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB] focus:outline-none py-3"
                            placeholder=" "
                        />
                        <label className="absolute left-0 -top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]">
                            Mật khẩu mới
                        </label>
                    </div>

                    {/* Xác nhận Mật khẩu */}
                    <div className="relative">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB] focus:outline-none py-3"
                            placeholder=" "
                        />
                        <label className="absolute left-0 -top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]">
                            Xác nhận mật khẩu mới
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#6F47EB] text-white py-3 rounded-xl font-semibold hover:bg-[#5a36cc] transition-all duration-300 shadow-md disabled:bg-gray-400"
                    >
                        {isLoading ? "Đang xử lý..." : "Xác Nhận Mật Khẩu Mới"}
                    </button>
                </form>
            );
        }
    };

    // Component cho Loading Skeleton
    const LoadingSkeleton = () => (
        <div className="space-y-6">
            {step === 1 && (
                <>
                    <SkeletonInput label={false} />
                </>
            )}
            {step === 2 && (
                <>
                    <SkeletonInput label={false} />
                    <SkeletonInput label={false} />
                    <SkeletonInput label={false} />
                </>
            )}
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
                    {/* Tiêu đề động */}
                    <h1 className="text-3xl font-bold text-gray-900 text-center">
                        {step === 1 ? "Quên Mật Khẩu?" : "Đặt Lại Mật Khẩu"}
                    </h1>

                    {/* Mô tả động */}
                    <p className="text-gray-600 mt-3 mb-8 text-center">
                        {step === 1
                            ? "Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi một mã xác thực."
                            : `Nhập mã và mật khẩu mới cho tài khoản ${email}`}
                    </p>

                    {/* Thông báo lỗi (chung) */}
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200 mb-4"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Thông báo thành công (chung) */}
                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-green-700 text-sm text-center bg-green-50 p-2 rounded-md border border-green-200 mb-4"
                        >
                            {message}
                        </motion.p>
                    )}

                    {/* Form động */}
                    {isLoading ? <LoadingSkeleton /> : renderStep()}

                    {/* Link quay lại */}
                    <div className="text-center text-sm pt-6">
                        <Link
                            to="/login"
                            className="text-[#6F47EB] font-semibold hover:text-[#5a36cc] hover:underline"
                        >
                            Quay về Đăng nhập
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default ForgotPasswordPage;