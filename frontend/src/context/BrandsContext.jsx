import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Tạo Context
export const BrandsContext = createContext();

// Provider component
export const BrandsProvider = ({ children }) => {
  const [brandsData, setBrandsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/brands")
      .then((response) => {
        setBrandsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  return (
    <BrandsContext.Provider value={{ brandsData, setBrandsData, loading }}>
      {children}
    </BrandsContext.Provider>
  );
};
