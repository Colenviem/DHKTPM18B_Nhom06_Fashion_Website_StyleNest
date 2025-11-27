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
import AccountForm from "../../components/form/AccountForm";
import UserListsTable from "../../components/table/UserListsTable";
import ProductForm from "../../components/formProduct/ProductForm";
import AdminSetting from "../../components/setting/AdminSetting";
import ReturnRequestsTable  from "../../components/table/ReturnRequestsTable.jsx";
import { AccountsProvider } from "../../context/AccountsContext";

const AdminPage = () => {
  return (
    <div className="flex min-h-screen font-[Manrope]">
      <DashboardSidebar />

      <main className="flex-1 relative overflow-y-auto">
        <DashboardHeader />

        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="accounts"
            element={
              <AccountsProvider>
                <AccountListsTable />
              </AccountsProvider>
            }
          />
          <Route path="accounts/form/:id" element={<AccountForm />} />
          <Route path="accounts/form" element={<AccountForm />} />
          <Route path="brands" element={<BrandListsTable />} />
          <Route path="products/form/:id" element={<ProductForm />} />
          <Route path="products/form" element={<ProductForm />} />
          <Route path="categories" element={<CategorieListsTable />} />
          <Route path="coupons" element={<CouponListsTable />} />
          <Route path="orders" element={<OrderListsTable />} />
          <Route path="products" element={<ProductListsTable />} />
          <Route path="users" element={<UserListsTable />} />
          <Route path="settings" element={<AdminSetting />} />
          <Route path="ordersReturns" element={<ReturnRequestsTable />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPage;
