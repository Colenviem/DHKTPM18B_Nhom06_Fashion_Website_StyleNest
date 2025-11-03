import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Tạo Context
export const ProductsContext = createContext();

// Provider component
export const ProductsProvider = ({ children }) => {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        setProductsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  return (
    <ProductsContext.Provider value={{ productsData, setProductsData, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};
