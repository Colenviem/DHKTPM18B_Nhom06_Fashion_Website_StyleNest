import React, { createContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export const BrandsContext = createContext();

export const BrandsProvider = ({ children }) => {
    const [brandsData, setBrandsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient
            .get("/brands")
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