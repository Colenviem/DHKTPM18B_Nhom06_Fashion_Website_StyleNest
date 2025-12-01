import React from "react";
import { ShieldCheck, Lock, CreditCard } from "lucide-react";

const PaymentSecurityService = () => (
    <div className="max-w-5xl mx-auto px-6 py-12 font-[Manrope]">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">
            Thanh Toán Bảo Mật & An Toàn
        </h1>

        <p className="text-gray-700 leading-relaxed mb-8">
            Chúng tôi sử dụng chuẩn mã hóa SSL và tích hợp cổng thanh toán uy tín,
            đảm bảo mọi giao dịch và thông tin cá nhân của bạn luôn được bảo vệ tuyệt đối.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl shadow-md bg-white flex flex-col items-center">
                <ShieldCheck className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Mã hóa SSL 256-bit
                </h3>
                <p className="text-sm text-gray-600 text-center">
                    Bảo vệ dữ liệu trong suốt quá trình thanh toán.
                </p>
            </div>

            <div className="p-6 rounded-xl shadow-md bg-white flex flex-col items-center">
                <Lock className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Xác thực giao dịch
                </h3>
                <p className="text-sm text-gray-600 text-center">
                    OTP & bảo mật 2 lớp hạn chế nguy cơ gian lận.
                </p>
            </div>

            <div className="p-6 rounded-xl shadow-md bg-white flex flex-col items-center">
                <CreditCard className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Đa dạng phương thức
                </h3>
                <p className="text-sm text-gray-600 text-center">
                    Hỗ trợ ví điện tử, thẻ ngân hàng và COD linh hoạt.
                </p>
            </div>
        </div>

        <p className="mt-10 text-gray-700">
            Nếu bạn có bất kỳ thắc mắc nào liên quan đến thanh toán, vui lòng liên hệ{" "}
            <a href="/contact" className="text-purple-600 font-semibold underline">
                bộ phận hỗ trợ khách hàng
            </a>
            .
        </p>
    </div>
);

export default PaymentSecurityService;
