import React from 'react';
import { motion } from 'framer-motion';
import AboutHeader from '../../components/about/AboutHeader';
import AboutImage from '../../components/about/AboutImage';
import AboutStats from '../../components/about/AboutStats';
import AboutCTA from '../../components/about/AboutCTA';

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
};

const AboutPage = () => {
    return (
        <section className="py-6 bg-white text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AboutHeader />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <AboutImage />
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="space-y-8"
                    >
                        <p className="text-xl font-medium leading-relaxed text-gray-700">
                            Tại Planto, chúng tôi tin rằng thời trang không chỉ là quần áo, mà là sự tự tin và phong cách sống.
                        </p>
                        <p className="text-gray-600 leading-loose">
                            Sứ mệnh của chúng tôi là truyền cảm hứng cho bạn thể hiện cá tính riêng một cách trọn vẹn nhất.
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