import React from "react";
import { motion } from "framer-motion";
import AboutHeader from "../../components/about/AboutHeader";
import AboutImage from "../../components/about/AboutImage";
import AboutStats from "../../components/about/AboutStats";
import AboutCTA from "../../components/about/AboutCTA";

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
};

const AboutPage = () => {
    return (
        <section className="py-16 bg-gray-50 text-[#4B5563] font-[Manrope]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AboutHeader />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-12">
                <AboutImage />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="space-y-8"
                >
                    <p className="text-xl font-medium leading-relaxed text-[#4B5563]">
                        Tại{" "}
                        <span className="text-black font-semibold">StyleNest</span>, chúng tôi tin rằng thời trang
                        không chỉ là quần áo — mà là sự tự tin và phong cách sống.
                    </p>

                    <p className="text-lg text-[#4B5563] leading-loose">
                        Sứ mệnh của chúng tôi là truyền cảm hứng để bạn thể hiện{" "}
                        <span className="font-semibold text-black">cá tính riêng</span> một cách trọn vẹn nhất.
                        Mỗi sản phẩm đều được thiết kế tinh tế, mang đậm dấu ấn hiện đại và bền vững.
                    </p>

                    <AboutStats />
                    <AboutCTA />
                </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutPage;