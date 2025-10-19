import { Routes, Route } from "react-router-dom";
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './page/home/HomePage';
import LoginPage from './page/auth/LoginPage';
import RegisterPage from './page/auth/RegisterPage';
import ProductDetail from "./components/product/ProductDetail";
import ListProductPage from "./page/product/ListProductPage";
import Cart from "./components/cart/Cart";
import Checkout from "./components/checkout/Checkout";
import AboutPage from "./page/about/AboutPage";
import ContactPage from "./page/contact/ContactPage";
import ServicesPage from "./page/service/ServicesPage";
import ChatWidget from "./components/chat/ChatWidget";

function App() {
  return (
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow mt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/fashion" element={<ListProductPage/>} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            
            <Route path="/detail" element={<ProductDetail/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/services" element={<ServicesPage />} />
          </Routes>
        </main>
        <ChatWidget />
        <Footer />
      </div>
  );
}

export default App;