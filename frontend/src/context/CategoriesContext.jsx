import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Tạo Context
export const CategoriesContext = createContext();

// Provider component
export const CategoriesProvider = ({ children }) => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8080/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        })
      .then((response) => {
        setCategoriesData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  return (
    <CategoriesContext.Provider value={{ categoriesData, setCategoriesData, loading }}>
      {children}
    </CategoriesContext.Provider>
  );
};
