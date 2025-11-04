import React, { useContext, useState, useMemo } from "react";
import FilterSidebar from "../../components/filter/FilterSidebar";
import NewArrivalsSection from "../../components/product/NewArrivalsSection";
import { ProductsContext } from "../../context/ProductsContext";

const ListProductPage = () => {
    const { productsData, loading } = useContext(ProductsContext);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedStockStatus, setSelectedStockStatus] = useState("Có sẵn");
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 100000, max: 5000000 });

    // 🔍 Lọc sản phẩm theo các bộ lọc (gọi hook ở mọi render, kể cả khi loading)
    const filteredProducts = useMemo(() => {
        if (loading || !productsData) return [];
        return productsData.filter((product) => {
            // Lọc theo thương hiệu
            const brandMatch =
                selectedBrands.length === 0 || selectedBrands.includes(product.brand);

            // Lọc theo trạng thái tồn kho
            const totalStock =
                product.variants?.reduce((sum, v) => sum + (v.inStock || 0), 0) || 0;
            const isAvailable = product.available && totalStock > 0;
            const stockMatch =
                selectedStockStatus.length === 0 ||
                (isAvailable && selectedStockStatus.includes("Có sẵn")) ||
                (!isAvailable && selectedStockStatus.includes("Hết hàng"));

            // Lọc theo màu
            const colorMatch =
                selectedColors.length === 0 ||
                product.variants?.some((v) =>
                    selectedColors.includes(v.color?.toLowerCase())
                );

            // Lọc theo kích cỡ
            const sizeMatch =
                selectedSizes.length === 0 ||
                product.variants?.some((v) => selectedSizes.includes(v.size));

            // Tính giá sau khi discount
            const priceAfterDiscount =
                product.price * (1 - (product.discount || 0) / 100);

            // Lọc theo khoảng giá
            const priceMatch =
                priceAfterDiscount >= priceRange.min &&
                priceAfterDiscount <= priceRange.max;

            return brandMatch && stockMatch && colorMatch && sizeMatch && priceMatch;
        });
    }, [
        productsData,
        loading,
        selectedBrands,
        selectedStockStatus,
        selectedColors,
        selectedSizes,
        priceRange,
    ]);

    // Chỉ điều kiện hóa phần JSX
    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    return (
        <div className="py-10 bg-white min-h-screen">
            <div className="max-w-full mx-auto flex px-4 sm:px-6 lg:px-8 space-x-8">
                <div className="w-full lg:w-1/4 hidden lg:block">
                    <div className="sticky top-28">
                        <FilterSidebar
                            selectedBrands={selectedBrands}
                            setSelectedBrands={setSelectedBrands}
                            selectedStockStatus={selectedStockStatus}
                            setSelectedStockStatus={setSelectedStockStatus}
                            selectedColors={selectedColors}
                            setSelectedColors={setSelectedColors}
                            selectedSizes={selectedSizes}
                            setSelectedSizes={setSelectedSizes}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                        />
                    </div>
                </div>

                <div className="w-full lg:w-3/4">
                    <NewArrivalsSection
                        products={filteredProducts}
                        title="Danh sách sản phẩm"
                    />
                </div>
            </div>
        </div>
    );
};

export default ListProductPage;