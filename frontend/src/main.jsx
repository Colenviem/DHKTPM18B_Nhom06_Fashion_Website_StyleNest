import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CouponsProvider } from "./context/CouponsContext.jsx";
import { CategoriesProvider } from "./context/CategoriesContext.jsx";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import { BrandsProvider } from "./context/BrandsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrandsProvider>
      <ProductsProvider>
        <CategoriesProvider>
          <CouponsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CouponsProvider>
        </CategoriesProvider>
      </ProductsProvider>
    </BrandsProvider>
  </StrictMode>
);
