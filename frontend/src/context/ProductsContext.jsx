import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Tạo Context
export const ProductsContext = createContext();

// Provider component
export const ProductsProvider = ({ children }) => {
  const [productsData, setProductsData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/products`)
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
    <ProductsContext.Provider
      value={{
        productsData,
        setProductsData,
        loading,
        searchResults,
        setSearchResults,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
