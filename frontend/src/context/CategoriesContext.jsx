import React, { createContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
export const CategoriesContext = createContext();

// Provider component
export const CategoriesProvider = ({ children }) => {
    const [categoriesData, setCategoriesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axiosClient
            .get("/categories")
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