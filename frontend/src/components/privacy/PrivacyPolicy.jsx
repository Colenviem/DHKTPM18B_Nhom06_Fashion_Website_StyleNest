import React from "react";

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto p-6 mt-6 text-gray-800 leading-relaxed">
            <h1 className="text-3xl font-bold mb-4">Chính Sách Bảo Mật</h1>
            <p>
                Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng khi mua sắm tại hệ thống của chúng tôi.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. Thu thập thông tin</h2>
            <p>
                Chúng tôi thu thập các thông tin cần thiết bao gồm: Họ tên, số điện thoại, email, địa chỉ giao hàng... nhằm phục vụ việc đặt hàng và chăm sóc khách hàng.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Mục đích sử dụng</h2>
            <ul className="list-disc ml-6">
                <li>Xử lý đơn hàng và giao hàng</li>
                <li>Liên hệ khi có vấn đề phát sinh</li>
                <li>Gửi ưu đãi và thông báo sản phẩm nếu bạn đồng ý</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Bảo mật thông tin</h2>
            <p>
                Chúng tôi cam kết không chia sẻ thông tin của bạn cho bên thứ ba, trừ khi được yêu cầu bởi pháp luật hoặc có sự đồng ý từ bạn.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Thanh toán an toàn</h2>
            <p>
                Mọi thông tin thanh toán được mã hóa và bảo mật, đảm bảo an toàn cho khách hàng khi giao dịch.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">5. Quyền của khách hàng</h2>
            <p>
                Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xoá thông tin cá nhân của mình bất cứ lúc nào.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">6. Thay đổi chính sách</h2>
            <p>
                Chính sách có thể được cập nhật theo từng thời điểm. Mọi thay đổi sẽ được công khai trên trang web.
            </p>

            <p className="mt-8 font-semibold">
                Nếu bạn có bất kỳ thắc mắc nào, vui lòng{" "}
                <a
                    href="/contact"
                    className="text-blue-600 hover:underline"
                >
                    liên hệ bộ phận hỗ trợ khách hàng
                </a>.
            </p>
        </div>
    );
}
