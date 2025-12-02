import React, { createContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
export const ProductsContext = createContext();


export const ProductsProvider = ({ children }) => {
    const [productsData, setProductsData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axiosClient
            .get("/products")
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