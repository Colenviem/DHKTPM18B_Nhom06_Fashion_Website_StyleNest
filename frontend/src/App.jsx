import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserPage from "./page/user/UserPage";
import AdminPage from "./page/admin/AdminPage";

import { StatisticalProvider } from "./context/StatisticalContext"; 

function App() {
  return (
      <Routes>
        <Route path="/*" element={<UserPage />} />
        <Route
          path="/admin/*"
          element={
            <StatisticalProvider>
              <AdminPage />
            </StatisticalProvider>
          }
        />
      </Routes>
  );
}

export default App;