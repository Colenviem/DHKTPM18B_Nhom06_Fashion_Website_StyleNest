import React from "react";

const priceRange = { min: 37, max: 94 };

const colorMap = {
    grey: "bg-gray-400",
    red: "bg-red-500",
    black: "bg-black",
    orange: "bg-orange-400",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    pink: "bg-pink-400",
};

const COLORS = [
    { name: "Xám", color: "grey", selected: true },
    { name: "Đỏ", color: "red" },
    { name: "Đen", color: "black", selected: true },
    { name: "Cam", color: "orange" },
    { name: "Xanh dương", color: "blue", selected: true },
    { name: "Xanh lá", color: "green" },
    { name: "Vàng", color: "yellow" },
    { name: "Hồng", color: "pink" },
];

const SIZES = ["Nhỏ", "Vừa", "Lớn", "XL", "XXL"];

const BRANDS = [
    { name: "Khu công nghệ Gadget", count: 2, selected: false },
    { name: "Initech Space", count: 3, selected: true },
    { name: "Looney Tunes", count: 2, selected: false },
    { name: "Massive Dynamic", count: 2, selected: true },
    { name: "Pro Tech Gear", count: 2, selected: false },
    { name: "Soylent Green", count: 3, selected: false },
    { name: "The Simpsons", count: 3, selected: false },
    { name: "Weeds Capital", count: 2, selected: false },
];

const STOCK_STATUS = [
    { name: "Có sẵn", count: 17, selected: false },
    { name: "Còn trong kho", count: 17, selected: true },
    { name: "Hết hàng", count: 1, selected: false },
];

const PRODUCT_CONDITIONS = [
    { name: "Mới", count: 9, selected: false },
    { name: "Tân trang", count: 5, selected: true },
    { name: "Đã qua sử dụng", count: 6, selected: false },
];

const inputClasses =
     "rounded border-gray-400 text-black focus:ring-black checked:bg-black checked:border-transparent";

const FilterSidebar = () => {
    return (
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg shadow-gray-200/50 overflow-hidden">
            <div className="p-5 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-black text-lg uppercase tracking-wider">
                    Bộ lọc
                </h3>
            </div>

            <div className="p-5 border-b border-gray-200">
                <h4 className="font-bold text-black mb-4 border-b border-gray-100 pb-3 uppercase text-sm tracking-wide">
                    Tình trạng hàng
                </h4>
                <div className="space-y-4">
                    {STOCK_STATUS.map((item) => (
                        <label
                        key={item.name}
                        className="flex items-center gap-3 cursor-pointer"
                        >
                        <input
                            type="checkbox"
                            className={inputClasses}
                            readOnly
                            defaultChecked={item.selected}
                        />
                        <span className="text-gray-800 text-base">{item.name}</span>
                        <span className="text-gray-500 text-sm ml-auto font-medium">
                            ({item.count})
                        </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="p-5 border-b border-gray-200">
                <h4 className="font-bold text-black mb-4 border-b border-gray-100 pb-3 uppercase text-sm tracking-wide">
                    Kích cỡ
                </h4>
                <div className="space-y-4">
                    {SIZES.map((size) => (
                        <label
                        key={size}
                        className="flex items-center gap-3 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                className={inputClasses}
                                readOnly
                                defaultChecked={size === "Vừa"}
                            />
                            <span className="text-gray-800 text-base">{size}</span>
                            <span className="text-gray-500 text-sm ml-auto font-medium">
                                (6)
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="p-5 border-b border-gray-200">
                <h4 className="font-bold text-black mb-4 border-b border-gray-100 pb-3 uppercase text-sm tracking-wide">
                    Màu sắc
                </h4>
                <div className="flex flex-wrap gap-x-4 gap-y-4">
                    {COLORS.map((c) => (
                        <div key={c.name} className="flex items-center">
                        <label
                            className={`relative w-7 h-7 rounded-full ${
                            colorMap[c.color]
                            } cursor-pointer transition-all duration-200 hover:scale-110 ${
                            c.selected
                                ? "ring-2 ring-offset-2 ring-black"
                                : "border border-gray-300"
                            }`}
                            title={c.name}
                        ></label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-5 border-b border-gray-200">
                <h4 className="font-bold text-black mb-4 border-b border-gray-100 pb-3 uppercase text-sm tracking-wide">
                    Giá
                </h4>
                <div className="mb-4 text-center">
                    <span className="text-xl font-extrabold text-black">
                        ${priceRange.min}.00 - ${priceRange.max}.00
                    </span>
                </div>
                <input
                    type="range"
                    min="37"
                    max="100"
                    defaultValue={priceRange.max}
                    readOnly
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span className="font-medium">Tối thiểu: ${priceRange.min}.00</span>
                    <span className="font-medium">Tối đa: $100.00</span>
                </div>
            </div>

            <div className="p-5 border-b border-gray-200">
                <h4 className="font-bold text-black mb-4 border-b border-gray-100 pb-3 uppercase text-sm tracking-wide">
                    Thương hiệu
                </h4>
                <div className="space-y-4 overflow-y-auto pr-2">
                    {BRANDS.map((brand) => (
                        <label
                        key={brand.name}
                        className="flex items-center gap-3 cursor-pointer"
                        >
                        <input
                            type="checkbox"
                            className={inputClasses}
                            readOnly
                            defaultChecked={brand.selected}
                        />
                        <span className="text-gray-800 text-base">{brand.name}</span>
                        <span className="text-gray-500 text-sm ml-auto font-medium">
                            ({brand.count})
                        </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="p-5 border-b border-gray-200">
                <h4 className="font-bold text-black mb-4 border-b border-gray-100 pb-3 uppercase text-sm tracking-wide">
                    Tình trạng sản phẩm
                </h4>
                <div className="space-y-4">
                    {PRODUCT_CONDITIONS.map((item) => (
                        <label
                        key={item.name}
                        className="flex items-center gap-3 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                className={inputClasses}
                                readOnly
                                defaultChecked={item.selected}
                            />
                            <span className="text-gray-800 text-base">{item.name}</span>
                            <span className="text-gray-500 text-sm ml-auto font-medium">
                                ({item.count})
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;