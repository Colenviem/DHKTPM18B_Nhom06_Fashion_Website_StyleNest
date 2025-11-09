// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CouponsProvider } from "./context/CouponsContext.jsx";
import { CategoriesProvider } from "./context/CategoriesContext.jsx";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import { BrandsProvider } from "./context/BrandsContext.jsx";
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <BrandsProvider>
                <CartProvider>
                    <ProductsProvider>
                        <CategoriesProvider>
                            <CouponsProvider>
                                <BrowserRouter>
                                    <App />
                                </BrowserRouter>
                            </CouponsProvider>
                        </CategoriesProvider>
                    </ProductsProvider>
                </CartProvider>
            </BrandsProvider>
        </AuthProvider>
    </StrictMode>
);