import React, { useEffect, useState } from 'react'
import DealsSection from '../../components/deal/DealsSection';
import NewArrivalsSection from '../../components/product/NewArrivalsSection';
import InstagramFeedSection from '../../components/instagram/InstagramFeedSection';

const HomePage = () => {
    const  products = [
        { id: 1, name: "Shiny Dress", category: "Women's Fashion", rating: 5, image: "/src/assets/images/products/ShinyDress.png" },
        { id: 2, name: "Long Dress", category: "Women's Fashion", rating: 4,image: "/src/assets/images/products/LongDress.png" },
        { id: 3, name: "Full Sweater", category: "Men's Fashion", image: "/src/assets/images/products/FullSweater.png" },
        { id: 4, name: "White Dress", category: "Women's Accessories", image: "/src/assets/images/products/WhiteDress.png" },
        { id: 5, name: "Colorful Dress", category: "Women's Fashion", image: "/src/assets/images/products/ColorfulDress.png" },
        { id: 6, name: "White Shirt", category: "Men's Fashion", image: "/src/assets/images/products/WhiteShirt.png" },
    ];
    const title = "Hàng mới đến";
    const subtitle = "Khám phá những bộ sưu tập thời trang mới nhất vừa cập bến. Luôn cập nhật các sản phẩm độc đáo và thịnh hành nhất.";

    return (
        <div className="min-h-screen w-full space-y-10">
            <DealsSection products={products} />
            <NewArrivalsSection products={products} title={title} subtitle={subtitle} />
            <InstagramFeedSection/>
        </div>
    )
}

export default HomePage;
