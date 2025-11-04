// src/page/auth/RegisterPage.jsx
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FIELD_LABELS = {
    userName: "Tên đăng nhập",
    firstName: "Tên",
    lastName: "Họ",
    email: "Email",
    password: "Mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
};

const FIELD_ORDER = [
    { field: "firstName", type: "text", span: "md:col-span-1" },
    { field: "lastName", type: "text", span: "md:col-span-1" },
    { field: "userName", type: "text", span: "md:col-span-1" },
    { field: "email", type: "text", span: "md:col-span-2" },
    { field: "password", type: "password", span: "md:col-span-1" },
    { field: "confirmPassword", type: "password", span: "md:col-span-1" },
];

function RegisterPage() {
    const [formData, setFormData] = useState({
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.userName.trim()) newErrors.userName = "Tên đăng nhập là bắt buộc.";
        if (!formData.firstName.trim()) newErrors.firstName = "Tên là bắt buộc.";
        if (!formData.lastName.trim()) newErrors.lastName = "Họ là bắt buộc.";
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            newErrors.email = "Email không hợp lệ.";
        if (formData.password.length < 6)
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsSuccess(null);

        if (!validateForm()) return;

        try {
            const res = await axios.post(
                "http://localhost:8080/api/accounts",
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    userName: formData.userName,
                    password: formData.password,
                    role: "CUSTOMER",
                },
                { withCredentials: true }
            );

            setMessage(res.data.message || "Mã xác thực đã được gửi, vui lòng kiểm tra email.");
            setIsSuccess(true);

            setTimeout(() => {
                navigate("/verify-email", { state: { email: formData.email } });
            }, 2000);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Đăng ký không thành công. Tên đăng nhập hoặc Email đã tồn tại."
            );
            setIsSuccess(false);
        }
    };

    return (
        <div className="bg-gray-50 py-10 flex justify-center font-[Manrope]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-2xl rounded-2xl overflow-hidden flex w-full max-w-7xl"
            >
                {/* Hình bên trái */}
                <div className="hidden md:block w-1/2 h-auto">
                    <img
                        src="https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=800"
                        alt="Register banner"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Form đăng ký */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <h1 className="text-4xl font-extrabold text-black mb-1">
                        Tạo Tài Khoản Mới
                    </h1>
                    <p className="text-gray-600 mt-1 mb-10 text-lg">
                        Tham gia cộng đồng{" "}
                        <span className="font-bold text-[#6F47EB]">Planto</span>
                    </p>

                    <form
                        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8"
                        onSubmit={handleSubmit}
                    >
                        {FIELD_ORDER.map(({ field, type, span }) => (
                            <div key={field} className={`relative ${span}`}>
                                <input
                                    type={type}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    required
                                    className={`peer w-full border-b-2 ${
                                        errors[field]
                                            ? "border-red-500"
                                            : "border-gray-300 focus:border-[#6F47EB]"
                                    } focus:outline-none pt-4 pb-2 transition duration-300`}
                                    placeholder=" "
                                />
                                <label
                                    className="absolute left-0 -top-4 text-sm text-gray-500 transition-all duration-300
                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                    peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6F47EB]"
                                >
                                    {FIELD_LABELS[field]}
                                </label>
                                {errors[field] && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-600 text-xs mt-1 absolute bottom-[-20px] left-0"
                                    >
                                        {errors[field]}
                                    </motion.p>
                                )}
                            </div>
                        ))}

                        {/* Nút đăng ký */}
                        <div className="col-span-1 md:col-span-2 mt-8">
                            <button
                                type="submit"
                                className="w-full bg-[#6F47EB] text-white py-3.5 rounded-xl text-lg font-semibold
                hover:bg-indigo-700 hover:cursor-pointer transition
                shadow-lg shadow-[#6F47EB]/30 transform hover:scale-[1.01]"
                            >
                                Tạo Tài Khoản
                            </button>
                        </div>
                    </form>

                    {/* Thông báo kết quả */}
                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-center mt-6 text-sm font-medium p-3 rounded-lg border ${
                                isSuccess
                                    ? "text-green-700 bg-green-50 border-green-200"
                                    : "text-red-700 bg-red-50 border-red-200"
                            }`}
                        >
                            {message}
                        </motion.p>
                    )}

                    {/* Liên kết đăng nhập */}
                    <div className="text-center text-base pt-4">
                        <span className="text-gray-600 mr-1">Đã có tài khoản? </span>
                        <Link
                            to="/login"
                            className="text-[#6F47EB] font-extrabold hover:underline hover:text-indigo-700"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default RegisterPage;
