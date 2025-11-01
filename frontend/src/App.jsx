import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserPage from "./page/user/UserPage";
import AdminPage from "./page/admin/AdminPage";



function App() {
    return (
        <Routes>
            <Route path="/*" element={<UserPage />} />

            <Route
                path="/admin/*"
                element={
                    <AdminPage />
                }
            />
        </Routes>
    );
}

export default App;