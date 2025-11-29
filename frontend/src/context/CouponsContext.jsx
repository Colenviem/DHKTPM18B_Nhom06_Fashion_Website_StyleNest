import React, { createContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient"; // ✅ Sử dụng axiosClient

// Tạo Context
export const CouponsContext = createContext();

// Provider component
export const CouponsProvider = ({ children }) => {
    const [couponsData, setCouponsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosClient
            .get("/coupons")
            .then((response) => {
                setCouponsData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi khi fetch coupons:", error);
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