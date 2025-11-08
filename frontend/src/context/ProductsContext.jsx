import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Tạo Context
export const ProductsContext = createContext();

// Provider component
export const ProductsProvider = ({ children }) => {
  const [productsData, setProductsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem("searchQuery") || "";
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchQuery) localStorage.setItem("searchQuery", searchQuery);
    else localStorage.removeItem("searchQuery");
  }, [searchQuery]);

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

  useEffect(() => {
    // console.log("Search Query changed:", searchQuery);
    // if (!searchQuery) return;

    // when u del search? => reset
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    axios
      .get("http://localhost:8080/api/products/search", {
        params: { keyword: searchQuery },
      })
      .then((response) => {
        setSearchResults(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch dữ liệu:", error);
        setLoading(false);
      });
  }, [searchQuery]);

  return (
    <ProductsContext.Provider
      value={{
        productsData,
        setProductsData,
        loading,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
