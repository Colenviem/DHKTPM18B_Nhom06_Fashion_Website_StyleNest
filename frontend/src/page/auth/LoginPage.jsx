import Button from "../../components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineMail } from "react-icons/ai";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="flex items-center justify-center bg-gray-50">
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
          <form className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-2"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-2"
              />
            </div>

            <Button text="Sign In" variant="default" />

            <Link to="/register">
              <Button text="Register Now" variant="outline" />
            </Link>

            <div className="text-right">
              <a
                href="#"
                className="text-blue-500 text-sm hover:underline"
              >
                Forget Password?
              </a>
            </div>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-500 mt-8">
            FASCO Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;