import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SkeletonInput, SkeletonButton } from "../../components/loadings/Skeleton";

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==============================
  // VALIDATE THEO ĐÚNG BACKEND
  // ==============================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Tên không được để trống";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Họ không được để trống";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Định dạng email không hợp lệ";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "Tên đăng nhập không được để trống";
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
          "Mật khẩu phải dài ít nhất 8 ký tự và chứa chữ hoa, chữ thường, số và ký tự đặc biệt.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==============================
  // SUBMIT FORM
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(null);

    if (!validateForm()) return;

    setIsLoading(true);

    const cleanedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      userName: formData.userName.trim(),
      password: formData.password.trim(),
      role: "CUSTOMER",
    };

    try {
      const res = await axios.post(
          "http://localhost:8080/api/accounts",
          cleanedData,
          { withCredentials: true }
      );

      setMessage(res.data.message || "Mã xác thực đã được gửi, vui lòng kiểm tra email.");
      setIsSuccess(true);

      navigate("/verify-email", { state: { email: cleanedData.email } });

    } catch (err) {
      setMessage(
          err.response?.data?.message ||
          "Đăng ký không thành công. Tên đăng nhập hoặc Email đã tồn tại."
      );
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // SKELETON
  const RegisterSkeleton = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {FIELD_ORDER.map(({ field, span }) => (
            <div key={field} className={span}>
              <SkeletonInput label={false} />
            </div>
        ))}
        <div className="col-span-1 md:col-span-2 mt-8">
          <SkeletonButton />
        </div>
      </div>
  );

  return (
      <div className="bg-gray-50 py-10 flex justify-center font-[Manrope]">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-2xl overflow-hidden flex w-full max-w-7xl"
        >
          {/* BANNER */}
          <div className="hidden md:block w-1/2 h-auto">
            <img
                src="https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=800"
                alt="Register banner"
                className="h-full w-full object-cover"
            />
          </div>

          {/* FORM */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-black mb-1">Tạo Tài Khoản Mới</h1>
            <p className="text-gray-600 mt-1 mb-10 text-lg">
              Tham gia cộng đồng <span className="font-bold text-[#6F47EB]">StyleNest</span>
            </p>

            {isLoading ? (
                <RegisterSkeleton />
            ) : (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8" onSubmit={handleSubmit}>
                  {FIELD_ORDER.map(({ field, type, span }) => {
                    const isPasswordField = field === "password";
                    const isConfirmPasswordField = field === "confirmPassword";

                    return (
                        <div key={field} className={`relative ${span}`}>
                          <input
                              type={
                                isPasswordField
                                    ? showPassword ? "text" : "password"
                                    : isConfirmPasswordField
                                        ? showConfirmPassword ? "text" : "password"
                                        : type
                              }
                              name={field}
                              value={formData[field]}
                              onChange={handleChange}
                              required
                              className={`peer w-full border-b-2 ${
                                  errors[field]
                                      ? "border-red-500"
                                      : "border-gray-300 focus:border-[#6F47EB]"
                              } focus:outline-none py-3 pr-10 transition duration-300`}
                              placeholder=" "
                          />

                          {/* 👁 Con mắt (ĐÃ ĐƯỢC CẬP NHẬT) */}
                          {(isPasswordField || isConfirmPasswordField) && (
                              <span
                                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                                  onClick={() =>
                                      isPasswordField
                                          ? setShowPassword((prev) => !prev)
                                          : setShowConfirmPassword((prev) => !prev)
                                  }
                              >
                                {((isPasswordField && showPassword) ||
                                    (isConfirmPasswordField && showConfirmPassword)) ? (
                                    // MẮT MỞ (Style từ LoginPage)
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
                                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                      />
                                      <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>

                                ) : (
                                    // MẮT ĐÓNG (Style từ LoginPage)
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
                                          d="M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.523 10.523 0 01-4.293 5.773"
                                      />
                                      <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243"
                                      />
                                    </svg>
                                )}
                              </span>
                          )}

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
                    );
                  })}

                  <div className="col-span-1 md:col-span-2 mt-8">
                    <button
                        type="submit"
                        className="w-full bg-[#6F47EB] text-white py-3.5 rounded-xl text-lg font-semibold
                    hover:bg-indigo-700 transition shadow-lg shadow-[#6F47EB]/30 transform hover:scale-[1.01]"
                    >
                      Tạo Tài Khoản
                    </button>
                  </div>
                </form>
            )}

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