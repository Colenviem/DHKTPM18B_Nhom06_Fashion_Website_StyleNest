import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Tạo Context
export const CouponsContext = createContext();

// Provider component
export const CouponsProvider = ({ children }) => {
  const [couponsData, setCouponsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/coupons")
      .then((response) => {
        setCouponsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <CouponsContext.Provider value={{ couponsData, setCouponsData, loading, setLoading, error, setError }}>
      {children}
    </CouponsContext.Provider>
  );
};
