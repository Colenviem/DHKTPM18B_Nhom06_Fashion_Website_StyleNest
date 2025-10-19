// src/pages/Services/components/ServiceCard.jsx
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ServiceCard = ({ icon: Icon, title, description, link, delay }) => {
  return (
    <motion.div
      variants={cardVariants}
      transition={{ delay }}
      className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-2xl hover:border-black/20 transition-all duration-300"
    >
      <Icon className="text-5xl text-black mb-4 p-2 border-2 border-black rounded-full" />
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      <a href={link} className="text-black font-semibold border-b-2 border-black text-sm hover:border-gray-500 transition">
        Tìm hiểu thêm →
      </a>
    </motion.div>
  );
};

export default ServiceCard;