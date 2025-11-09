import React from 'react'
import { Routes, Route } from 'react-router-dom';

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import ListProductPage from '../product/ListProductPage'
import HomePage from '../home/HomePage'
import Checkout from '../../components/checkout/Checkout'
import CartPage from '../cart/CartPage'
import ProductDetail from '../../components/product/ProductDetail'
import LoginPage from '../auth/LoginPage'
import AboutPage from '../about/AboutPage'
import ContactPage from '../contact/ContactPage'
import RegisterPage from '../auth/RegisterPage'
import VerifyPage from '../auth/VerifyPage'
import ServicesPage from '../service/ServicesPage'
import ProfilePage from './ProfilePage'
import ForgotPasswordPage from "../auth/ForgotPasswordPage";
import ChatWidget from "../../components/chat/ChatWidget";

const UserPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow mt-16">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/fashion" element={<ListProductPage/>} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/products/edit/new" element={<ProductDetail />} />
                    <Route path="/detail" element={<ProductDetail/>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/verify-email" element={<VerifyPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </main>
            <ChatWidget />
            <Footer />
        </div>
    )
}

export default UserPage