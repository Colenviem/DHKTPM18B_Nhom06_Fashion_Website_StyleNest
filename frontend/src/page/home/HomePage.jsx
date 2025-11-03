import React, { useContext, useEffect, useState } from 'react'
import DealsSection from '../../components/deal/DealsSection';
import NewArrivalsSection from '../../components/product/NewArrivalsSection';
import InstagramFeedSection from '../../components/instagram/InstagramFeedSection';
import { ProductsContext } from '../../context/ProductsContext';

const HomePage = () => {
    const { productsData, loading } = useContext(ProductsContext);
        
    if (loading) return <div>Đang tải dữ liệu...</div>;
    const title = "Hàng mới đến";
    const subtitle = "Khám phá những bộ sưu tập thời trang mới nhất vừa cập bến. Luôn cập nhật các sản phẩm độc đáo và thịnh hành nhất.";

    return (
        <div className="min-h-screen w-full space-y-10">
            <DealsSection products={productsData} />
            <NewArrivalsSection products={productsData} title={title} subtitle={subtitle} />
            <InstagramFeedSection/>
        </div>
    )
}

export default HomePage;
