// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        try {
            const userString = localStorage.getItem("user");
            return userString ? JSON.parse(userString) : null;
        } catch (e) {
            console.error("Lỗi khi đọc user từ localStorage", e);
            return null;
        }
    });

    const login = (user, token) => {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        setAuthUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setAuthUser(null);
    };

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "user") {
                try {
                    setAuthUser(e.newValue ? JSON.parse(e.newValue) : null);
                } catch (e) {
                    console.error("Lỗi khi đồng bộ storage", e);
                    setAuthUser(null);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const value = {
        authUser,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth phải được dùng bên trong AuthProvider");
    }
    return context;
};