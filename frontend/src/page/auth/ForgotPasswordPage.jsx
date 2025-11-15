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

    const [showNewPass, setShowNewPass] = useState(false);       // 👁 Toggle mật khẩu mới
    const [showConfirmPass, setShowConfirmPass] = useState(false); // 👁 Toggle XN mật khẩu

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
                { email: email.trim() }
            );

            setMessage(res.data.message || "Đã gửi mã, vui lòng kiểm tra email.");
            setStep(2);

        } catch (err) {
            setError(
                err.response?.data?.message || "Email không tồn tại hoặc đã xảy ra lỗi."
            );
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
            const res = await axios.post(
                "http://localhost:8080/api/accounts/reset-password",
                {
                    email: email.trim(),
                    verificationCode: code.trim(),
                    newPassword: newPassword.trim(),
                }
            );

            setMessage(res.data.message || "Đặt lại mật khẩu thành công!");

            setTimeout(() => navigate("/login"), 1800);

        } catch (err) {
            setError(
                err.response?.data?.message || "Mã không đúng, đã hết hạn, hoặc có lỗi xảy ra."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // ===============================
    // FORM STEP LOGIC
    // ===============================
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

        // STEP 2 – Reset mật khẩu
        return (
            <form onSubmit={handleResetPassword} className="space-y-6">
                {/* Verification Code */}
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

                {/* NEW PASSWORD */}
                <div className="relative">
                    <input
                        type={showNewPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB] focus:outline-none py-3 pr-10"
                        placeholder=" "
                    />

                    {/* 👁 Toggle icon */}
                    <span
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                        onClick={() => setShowNewPass((prev) => !prev)}
                    >
                        {showNewPass ? (
                            // Eye open
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
                            // Eye closed
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
                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226
           16.338 7.244 19.5 12 19.5c1.67 0
           3.247-.365 4.63-1.018M6.228
           6.228A10.45 10.45 0 0112 4.5c4.756
           0 8.773 3.162 10.065 7.5a10.523
           10.523 0 01-4.293 5.773M6.228
           6.228L3 3m3.228 3.228l3.65 3.65m7.894
           7.894L21 21m-3.228-3.228l-3.65-3.65m0
           0a3 3 0 10-4.243-4.243"
                                />
                            </svg>

                        )}
                    </span>

                    <label className="absolute left-0 -top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]">
                        Mật khẩu mới
                    </label>
                </div>

                {/* CONFIRM NEW PASSWORD */}
                <div className="relative">
                    <input
                        type={showConfirmPass ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="peer w-full border-b-2 border-gray-300 focus:border-[#6F47EB] focus:outline-none py-3 pr-10"
                        placeholder=" "
                    />

                    {/* 👁 Toggle icon */}
                    <span
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                        onClick={() => setShowConfirmPass((p) => !p)}
                    >
                        {showConfirmPass ? (
                            // Eye Open
                            <svg width="22" height="22" fill="none" stroke="currentColor"
                                 strokeWidth="2" className="text-gray-500 hover:text-[#6F47EB] transition">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        ) : (
                            // Eye Closed
                            <svg width="22" height="22" fill="none" stroke="currentColor"
                                 strokeWidth="2" className="text-gray-500 hover:text-[#6F47EB] transition">
                                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.81 21.81 0 0 1 5.06-5.94"/>
                                <path d="M1 1l22 22"/>
                                <path d="M9.53 9.53a3 3 0 0 0 4.24 4.24"/>
                            </svg>
                        )}
                    </span>

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
    };

    // SKELETON
    const LoadingSkeleton = () => (
        <div className="space-y-6">
            {step === 1 && <SkeletonInput label={false} />}
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
                    <h1 className="text-3xl font-bold text-gray-900 text-center">
                        {step === 1 ? "Quên Mật Khẩu?" : "Đặt Lại Mật Khẩu"}
                    </h1>

                    <p className="text-gray-600 mt-3 mb-8 text-center">
                        {step === 1
                            ? "Đừng lo! Nhập email và chúng tôi sẽ gửi mã xác thực."
                            : `Nhập mã & mật khẩu mới cho tài khoản ${email}`}
                    </p>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200 mb-4"
                        >
                            {error}
                        </motion.p>
                    )}

                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-green-700 text-sm text-center bg-green-50 p-2 rounded-md border border-green-200 mb-4"
                        >
                            {message}
                        </motion.p>
                    )}

                    {isLoading ? <LoadingSkeleton /> : renderStep()}

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
