import { useState } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";

function RegisterPage() {

  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); //true = success, false = error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Username is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email format";
    if (!formData.phoneNumber.match(/^[0-9]{9,11}$/))
      newErrors.phoneNumber = "Invalid phone number";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

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
        "http://localhost:8080/api/users/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          username: formData.userName,
          password: formData.password,
          role: "customer",
          phoneNumber: formData.phoneNumber,
        },
        { withCredentials: true }
      );

      setMessage(res.data.message || "Đăng ký thành công!");
      setIsSuccess(true);
      setFormData({
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Đăng ký không thành công. Vui lòng thử lại."
      );
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 min-h-[70vh] px-4">
      <div className="p-10 bg-white shadow-md rounded-2xl overflow-hidden flex w-full max-w-5xl">
        {/* Left Image */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
            alt="Register banner"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FASCO</h1>
          <h2 className="text-lg font-semibold text-gray-700 mb-6">
            Create Account
          </h2>

          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {[
              "userName",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "password",
              "confirmPassword",
            ].map((field, index) => (
              <div key={index} className="col-span-1">
                <input
                  type={field.includes("password") ? "password" : "text"}
                  name={field}
                  placeholder={
                    field === "userName"
                      ? "Username"
                      : field === "firstName"
                      ? "First Name"
                      : field === "lastName"
                      ? "Last Name"
                      : field === "email"
                      ? "Email Address"
                      : field === "phoneNumber"
                      ? "Phone Number"
                      : field === "password"
                      ? "Password"
                      : "Confirm Password"
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  className={`border-b border-gray-300 focus:outline-none focus:border-black py-2 w-full ${
                    errors[field] ? "border-red-500" : ""
                  }`}
                />
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                )}
              </div>
            ))}

            <div className="col-span-2 mt-4">
              <Button text="Create Account" variant="default" />
            </div>
          </form>

          {/* ✅ Message color: xanh nếu thành công, đỏ nếu lỗi */}
          {message && (
            <p
              className={`text-center mt-4 text-lg font-medium ${
                isSuccess ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
