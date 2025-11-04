import { Routes, Route, Navigate } from "react-router-dom";

import DashboardSidebar from "../../components/sidebar/DashboardSidebar";
import DashboardHeader from "../../components/layout/DashboardHeader";

import Dashboard from "../../components/dashboard/Dashboard";
import AccountListsTable from "../../components/table/AccountListsTable";
import BrandListsTable from "../../components/table/BrandListsTable";
import CategorieListsTable from "../../components/table/CategorieListsTable";
import CouponListsTable from "../../components/table/CouponListsTable";
import OrderListsTable from "../../components/table/OrderListsTable";
import ProductListsTable from "../../components/table/ProductListsTable";
import UserListsTable from "../../components/table/UserListsTable";
import ProductEdit from "../../components/edit/ProductEdit";
import AdminSetting from "../../components/setting/AdminSetting";

const AdminPage = () => {
  return (
    <div className="flex min-h-screen font-[Manrope]">
      <DashboardSidebar />

      <main className="flex-1 relative overflow-y-auto">
        <DashboardHeader />

        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="accounts" element={<AccountListsTable />} />
          <Route path="brands" element={<BrandListsTable />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="categories" element={<CategorieListsTable />} />
          <Route path="coupons" element={<CouponListsTable />} />
          <Route path="orders" element={<OrderListsTable />} />
          <Route path="products" element={<ProductListsTable />} />
          <Route path="users" element={<UserListsTable />} />
          <Route path="settings" element={<AdminSetting />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPage;