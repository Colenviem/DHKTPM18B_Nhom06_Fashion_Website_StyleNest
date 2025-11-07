import React, { useMemo } from "react";

const formatVND = (price) => {
  if (typeof price === "number") {
    return price.toLocaleString("vi-VN") + "₫";
  }
  return price || "0₫";
};

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

// const PRODUCT_CONDITIONS = [
//   { name: "Mới", count: 9, selected: false },
//   { name: "Tân trang", count: 5, selected: true },
//   { name: "Đã qua sử dụng", count: 6, selected: false },
// ];

const inputClasses =
  "rounded border-gray-400 text-black focus:ring-black checked:bg-black checked:border-transparent";

const FilterSidebar = ({
  displayProducts,
  selectedBrands,
  setSelectedBrands,
  selectedStockStatus,
  setSelectedStockStatus,
  selectedColors,
  setSelectedColors,
  selectedSizes,
  setSelectedSizes,
  priceRange,
  setPriceRange,
}) => {

  // Tạo danh sách BRANDS từ dữ liệu brandsData
  //   const BRANDS = useMemo(() => {
  //     if (!brandsData || brandsLoading) return [];

  //     return brandsData.map((brand) => ({
  //       name: brand.name,
  //       count: Math.floor(Math.random() * 5) + 1, //Sau này sửa số lượng từ API
  //       selected: brand.name === "Adidas" ? true : false,
  //     }));
  //   }, [brandsData, brandsLoading]);

  // Tạo danh sách BRANDS từ displayProducts
  const BRANDS = useMemo(() => {
    if (!displayProducts || displayProducts.length === 0) return [];

    const brandCount = {};

    displayProducts.forEach((p) => {
      const brand = p.brand?.trim();
      if (brand) {
        brandCount[brand] = (brandCount[brand] || 0) + 1;
      }
    });

    return Object.entries(brandCount).map(([name, count]) => ({
      name,
      count,
    }));
  }, [displayProducts]);

  // Tạo danh sách SIZES từ displayProducts
  const SIZES = useMemo(() => {
    if (!displayProducts || displayProducts.length === 0) return [];

    const sizeCount = {};

    displayProducts.forEach((p) => {
      p.variants?.forEach((v) => {
        const size = v.size?.trim();
        if (size) {
          sizeCount[size] = (sizeCount[size] || 0) + 1;
        }
      });
    });

    // Sắp xếp theo thứ tự phổ biến nhất
    return Object.entries(sizeCount).map(([size, count]) => ({
      size,
      count,
    }));
  }, [displayProducts]);

  // Tạo danh sách STOCK_STATUS từ productsData
  const STOCK_STATUS = useMemo(() => {
    //if (!productsData || productsLoading) return [];

    const availableProducts = displayProducts.filter((p) => {
      // Tính tổng số lượng tồn kho từ tất cả các variants
      const totalStock =
        p.variants?.reduce((sum, v) => sum + (v.inStock || 0), 0) || 0;
      return p.available && totalStock > 0;
    });

    const outOfStockProducts = displayProducts.filter((p) => {
      const totalStock =
        p.variants?.reduce((sum, v) => sum + (v.inStock || 0), 0) || 0;
      return !p.available || totalStock === 0;
    });

    return [
      { name: "Có sẵn", count: availableProducts.length, selected: true },
      { name: "Hết hàng", count: outOfStockProducts.length, selected: false },
    ];
  }, [displayProducts]);

  // Xử lý click chọn thương hiệu
  const handleBrandChange = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
  };

  // Xử lý click chọn tình trạng hàng
  const handleStockStatusChange = (status) => {
    setSelectedStockStatus((prev) => (prev === status ? "" : status));
  };

  // Hàm xử lý chọn màu
  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Hàm xử lý chọn kích cỡ
  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Hàm xử lý thay đổi khoảng giá
  const handlePriceChange = (e) => {
    const newMax = Number(e.target.value);
    setPriceRange((prev) => ({ ...prev, max: newMax }));
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-lg shadow-gray-200/50 overflow-hidden">
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-black text-lg uppercase tracking-wider">
          Bộ lọc
        </h3>
      </div>

      {/* Tình trạng hàng */}
      <div className="p-5 border-b border-gray-200">
        <h4 className="font-bold mb-4 text-sm uppercase text-black tracking-wide">
          Tình trạng hàng
        </h4>
        <div className="space-y-4">
          {STOCK_STATUS.map((item) => (
            <label
              key={item.name}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="stockStatus"
                className={inputClasses}
                checked={selectedStockStatus === item.name}
                onChange={() => handleStockStatusChange(item.name)}
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
              key={size.size}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className={inputClasses}
                checked={(selectedSizes || []).includes(size.size)}
                onChange={() => handleSizeChange(size.size)}
              />
              <span className="text-gray-800 text-base">{size.size}</span>
              <span className="text-gray-500 text-sm ml-auto font-medium">
                ({size.count})
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
            <label
              key={c.color}
              title={c.name}
              className={`relative w-7 h-7 rounded-full ${
                colorMap[c.color]
              } cursor-pointer transition-all duration-200 hover:scale-110 ${
                (selectedColors || []).includes(c.color)
                  ? "ring-2 ring-offset-2 ring-black"
                  : "border border-gray-300"
              }`}
              onClick={() => handleColorChange(c.color)}
            ></label>
          ))}
        </div>
      </div>

      {/* Giá */}
      <div className="p-5 border-b border-gray-200">
        <h4 className="font-bold text-black mb-4 border-b border-gray-100 pb-3 uppercase text-sm tracking-wide">
          Giá
        </h4>

        <div className="mb-4 text-center">
          <span className="text-xl font-extrabold text-black">
            {formatVND(priceRange.min)} - {formatVND(priceRange.max)}
          </span>
        </div>

        <input
          type="range"
          min="100000"
          max="5000000"
          value={priceRange.max}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-black"
        />

        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span className="font-medium">
            Tối thiểu: {formatVND(priceRange.min)}
          </span>
          <span className="font-medium">
            Tối đa: {formatVND(priceRange.max)}
          </span>
        </div>
      </div>

      {/* Thương hiệu */}
      <div className="p-5 border-b border-gray-200">
        <h4 className="font-bold mb-4 text-sm uppercase text-black tracking-wide">
          Thương hiệu
        </h4>
        <div className="space-y-4">
          {BRANDS.map((brand) => (
            <label
              key={brand.name}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className={inputClasses}
                checked={(selectedBrands || []).includes(brand.name)}
                onChange={() => handleBrandChange(brand.name)}
              />
              <span className="text-gray-800 text-base">{brand.name}</span>
              <span className="text-gray-500 text-sm ml-auto font-medium">
                ({brand.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* <div className="p-5 border-b border-gray-200">
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
      </div> */}
    </div>
  );
};

export default FilterSidebar;
