import React, { useEffect, useState } from 'react'
import ProductCard from '../../components/product/ProductCard';

const HomePage = () => {
    const [timeLeft, setTimeLeft] = useState({});
    const [current, setCurrent] = useState(0);

    const brands = [
        "/src/assets/images/banners/calvin.png",
        "/src/assets/images/banners/chanel.png",
        "/src/assets/images/banners/denim.png",
        "/src/assets/images/banners/louis.png",
        "/src/assets/images/banners/prada.png"
    ];

    const products = [
        {
            id: 1,
            name: "Shiny Dress",
            brand: "Al Karim",
            price: 95.5,
            reviews: "4.1k Customer Reviews",
            rating: 5,
            image: "/src/assets/images/products/ShinyDress.png",
            soldOut: true,
        },
        {
            id: 2,
            name: "Long Dress",
            brand: "Al Karim",
            price: 95.5,
            reviews: "4.1k Customer Reviews",
            rating: 5,
            image: "/src/assets/images/products/LongDress.png",
            soldOut: true,
        },
        {
            id: 3,
            name: "Full Sweater",
            brand: "Al Karim",
            price: 95.5,
            reviews: "4.1k Customer Reviews",
            rating: 5,
            image: "/src/assets/images/products/FullSweater.png",
            soldOut: true,
        },
        {
            id: 4,
            name: "White Dress",
            brand: "Al Karim",
            price: 95.5,
            reviews: "4.1k Customer Reviews",
            rating: 5,
            image: "/src/assets/images/products/WhiteDress.png",
            soldOut: true,
        },
        {
            id: 5,
            name: "Colorful Dress",
            brand: "Al Karim",
            price: 95.5,
            reviews: "4.1k Customer Reviews",
            rating: 5,
            image: "/src/assets/images/products/ColorfulDress.png",
            soldOut: true,
        },
        {
            id: 6,
            name: "White Shirt",
            brand: "Al Karim",
            price: 95.5,
            reviews: "4.1k Customer Reviews",
            rating: 5,
            image: "/src/assets/images/products/WhiteShirt.png",
            soldOut: true,
        },
    ];

    const categories = ["Men's Fashion", "Women's Fashion", "Women Accessories", "Men Accessories", "Discount Deals"];

    useEffect(() => {
        const targetDate = new Date().getTime() + 2 * 24 * 60 * 60 * 1000; // 2 days
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => setCurrent((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    const nextSlide = () => setCurrent((prev) => (prev === products.length - 1 ? 0 : prev + 1));

    const instagramPosts = [
        "/fashion-man-beige-coat.jpg",
        "/fashion-woman-gray-sweater.jpg",
        "/fashion-woman-colorful-outfit.jpg",
        "/fashion-man-checkered-shirt.jpg",
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
    ]

    const testimonials = [
        {
            id: 1,
            name: "James K.",
            role: "Traveler",
            image: "/professional-man-smiling.png",
            rating: 5,
            text: "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
        },
        {
            id: 2,
            name: "Sarah W.",
            role: "Designer",
            image: "/professional-woman-smiling.png",
            rating: 5,
            text: "I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.",
        }
    ]

    return (
        <div className="bg-white min-h-screen w-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center gap-10 py-2">
                    {brands.map((brand, index) => (
                        <div key={index} className="w-28 h-16 flex items-center justify-center">
                            <img
                                src={brand}
                                alt={`brand-${index}`}
                                className="max-h-full object-contain hover:scale-105 transition-transform"
                            />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-10 py-14 items-center max-w-7xl mx-auto">
                {/* Left Content */}
                <div>
                    <h2 className="text-3xl font-bold mb-4">Deals Of The Month</h2>
                    <p className="text-gray-500 mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
                    dui ultrices sollicitudin aliquam sem. Scelerisque dui ultrices
                    sollicitudin.
                    </p>
                    <button className="px-6 py-2 bg-black text-white rounded-md shadow-md mb-6">
                    Buy Now
                    </button>

                    {/* Countdown */}
                    <h3 className="font-semibold text-lg mb-4">Hurry, Before It’s Too Late!</h3>
                    <div className="flex gap-4">
                    {["Days", "Hr", "Mins", "Sec"].map((label, i) => {
                        const values = [
                        timeLeft.days || 0,
                        timeLeft.hours || 0,
                        timeLeft.minutes || 0,
                        timeLeft.seconds || 0,
                        ];
                        return (
                        <div key={i} className="text-center">
                            <div className="bg-gray-100 p-4 rounded-md text-2xl font-bold shadow-md">
                            {values[i].toString().padStart(2, "0")}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{label}</p>
                        </div>
                        );
                    })}
                    </div>
                </div>

                {/* Slider */}
                <div className="relative flex items-center justify-center">
                    <button
                    onClick={prevSlide}
                    className="absolute left-2 bg-white rounded-full p-2 shadow"
                    >
                    <i class="bx  bx-chevron-left"></i> 
                    </button>

                    <div className="flex gap-6 overflow-hidden">
                    {products.map((product, index) => (
                        <div
                        key={product.id}
                        className={`w-60 h-[400px] flex-shrink-0 rounded-xl overflow-hidden shadow-md relative transition-transform duration-500 ${
                            index === current ? "scale-100" : "scale-90 opacity-70"
                        }`}
                        >
                        <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow">
                            <p className="text-sm">{product.title}</p>
                            <p className="font-bold text-lg">{product.discount}</p>
                        </div>
                        </div>
                    ))}
                    </div>

                    <button
                    onClick={nextSlide}
                    className="absolute right-2 bg-white rounded-full p-2 shadow"
                    >
                    <i class="bx bx-arrow-right-strokestroke"></i> 
                    </button>
                </div>
            </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div>
                     <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">New Arrivals</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-pretty">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem.
                        Scelerisque duis ultrices sollicitudin
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((category, index) => (
                    <button
                        key={category}
                        variant={index === 1 ? "default" : "outline"}
                        className={`px-6 py-2 rounded-full ${
                        index === 1
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {category}
                    </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {products.map((product) => (
                        <ProductCard product={product} />
                    ))}
                </div>

                 <div className="text-center">
                    <button className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full">View More</button>
                </div>
            </div>


            <div className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">Follow Us On Instagram</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-pretty">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem.
                    Scelerisque duis ultrices sollicitudin
                </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {instagramPosts.map((post, index) => (
                        <div key={index} className="aspect-square overflow-hidden rounded-lg cursor-pointer group">
                        <img
                            src={post || "/placeholder.svg"}
                            alt={`Instagram post ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        </div>
                    ))}
                </div>
            </div>
            </div>

            <div className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">This Is What Our Customers Say</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-pretty">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis
                    </p>
                    </div>

                    <div className="relative">
                    <div className="flex gap-8 justify-center items-center">
                        {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-white p-8 max-w-md shadow-sm">
                            <div className="flex items-start gap-4 mb-4">
                            <img
                                src={testimonial.image || "/placeholder.svg"}
                                alt={testimonial.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <p className="text-gray-700 mb-4 text-pretty">{testimonial.text}</p>
                                <div className="flex items-center gap-1 mb-2">
                                </div>
                                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                <p className="text-sm text-gray-600">{testimonial.role}</p>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md"
                    >
                        <i class="bx  bx-chevron-left"></i> 
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md"
                    >
                        <i class="bx bx-arrow-right-strokestroke"></i> 
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;
