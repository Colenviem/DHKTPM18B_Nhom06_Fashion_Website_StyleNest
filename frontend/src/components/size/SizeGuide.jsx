import React from "react";

export default function SizeGuide() {
    return (
        <section className="max-w-5xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold text-center text-[#6F47EB] mb-12">
                Hướng dẫn chọn size
            </h1>

            {/* Giới thiệu */}
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
                Vui lòng tham khảo bảng kích thước bên dưới để chọn được size phù hợp nhất.
                Nếu bạn phân vân giữa hai size, chúng tôi khuyên chọn size lớn hơn.
            </p>

            {/* Bảng size */}
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-xl shadow-md text-center bg-white">
                    <thead className="bg-[#6F47EB] text-white">
                    <tr>
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-4">Chiều cao (cm)</th>
                        <th className="py-3 px-4">Cân nặng (kg)</th>
                        <th className="py-3 px-4">Vòng ngực (cm)</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-700">
                    {[
                        ["S", "155 - 165", "45 - 55", "84 - 88"],
                        ["M", "165 - 170", "55 - 62", "88 - 92"],
                        ["L", "170 - 175", "62 - 70", "92 - 96"],
                        ["XL", "175 - 180", "70 - 80", "96 - 102"],
                        ["XXL", "180 - 185", "80 - 90", "102 - 110"],
                    ].map((row, i) => (
                        <tr key={i} className="border border-gray-200">
                            {row.map((cell, j) => (
                                <td key={j} className="py-3 px-4">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Hình minh họa */}
            <div className="text-center mt-12">
                <img
                    src="https://media.loveitopcdn.com/3807/thumb/saiavh7.jpg"
                    alt="Minh họa số đo cơ thể"
                    className="max-w-lg mx-auto mb-4 opacity-90"
                />
                <p className="text-gray-500 text-sm italic">
                    Hình minh họa đo vòng ngực để chọn size áo phù hợp.
                </p>
            </div>

            {/* Lưu ý */}
            <div className="bg-white p-6 rounded-2xl shadow-md mt-14 border">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">
                    Lưu ý khi chọn size
                </h3>
                <ul className="text-gray-600 list-disc pl-6 space-y-2">
                    <li>Số đo có thể chênh lệch ±2cm tùy sản phẩm.</li>
                    <li>Form chuẩn dáng người Việt.</li>
                    <li>Nếu bạn có thân hình thể thao (vai rộng, ngực lớn), hãy tăng 1 size.</li>
                    <li>Liên hệ bộ phận hỗ trợ nếu cần tư vấn chi tiết hơn.</li>
                </ul>
            </div>
        </section>
    );
}
