import { Routes, Route } from "react-router-dom";
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './page/home/HomePage';
import LoginPage from './page/auth/LoginPage';
import RegisterPage from './page/auth/RegisterPage';
import ProductDetail from "./components/product/ProductDetail";
import ListProductPage from "./page/home/ListProductPage";
import Cart from "./components/cart/Cart";

function App() {
  return (
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow mt-16">
          <Routes>
            <Route path="/" element={<Cart />} />
            <Route path="/list" element={<ListProductPage/>} />
            <Route path="/detail" element={<ProductDetail/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
  );
}

export default App;