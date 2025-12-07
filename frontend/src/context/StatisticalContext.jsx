import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import axiosClient from "../api/axiosClient"; // ✅ Dùng axiosClient

const StatisticalContext = createContext();

export const StatisticalProvider = ({ children }) => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [monthlyLoading, setMonthlyLoading] = useState(false);
    
    // --- State cho Thống kê Hàng tuần ---
    const [weeklyStats, setWeeklyStats] = useState({ 
        thisWeekCount: 0, 
        lastWeekCount: 0, 
        thisWeekAmount: 0,
        lastWeekAmount: 0
    });
    const [weeklyLoading, setWeeklyLoading] = useState(false);

    const [pendingCount, setPendingCount] = useState(0);
    const [pendingLoading, setPendingLoading] = useState(false);
    
    // --- State cho danh sách tất cả đơn hàng ---
    const [allOrders, setAllOrders] = useState([]);
    const [allOrdersLoading, setAllOrdersLoading] = useState(false);

    // --- STATE MỚI: Top 5 sản phẩm bán chạy + "Các sản phẩm khác" ---
    const [topProducts, setTopProducts] = useState([]);
    const [topProductsLoading, setTopProductsLoading] = useState(false);

    // State chung cho lỗi
    const [error, setError] = useState(null);

    // === CÁC HÀM FETCH CŨ (giữ nguyên) ===
    const fetchMonthlyRevenue = useCallback(async (year, month) => {
        setMonthlyLoading(true);
        setError(null);
        setMonthlyData([]);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Monthly API: ${response.status}`);
            const result = await response.json();
            setMonthlyData(result);
        } catch (err) {
            console.error("Lỗi fetch monthly:", err);
            setError(err.message);
        } finally {
            setMonthlyLoading(false);
        }
    }, []);

    const fetchWeeklyStats = useCallback(async () => {
        setWeeklyLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/orders/weekly-count');
            if (!response.ok) throw new Error(`Weekly API: ${response.status}`);
            const result = await response.json();
            setWeeklyStats(result);
        } catch (err) {
            console.error("Lỗi fetch weekly:", err);
            setError(err.message);
        } finally {
            setWeeklyLoading(false);
        }
    }, []);

    const fetchPendingCount = useCallback(async () => {
        setPendingLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/orders/countPending/PENDING');
            if (!response.ok) throw new Error(`Pending API: ${response.status}`);
            const result = await response.json();
            const count = typeof result === 'object' ? result.count || result.total || result : result;
            setPendingCount(count);
        } catch (err) {
            console.error("Lỗi fetch pending:", err);
            setError(err.message);
        } finally {
            setPendingLoading(false);
        }
    }, []);

    const fetchAllOrders = useCallback(async () => {
        setAllOrdersLoading(true);
        setError(null);
        setAllOrders([]);
        try {
            const response = await fetch('http://localhost:8080/api/orders');
            if (!response.ok) throw new Error(`All Orders API: ${response.status}`);
            const result = await response.json();
            if (Array.isArray(result)) {
                const sorted = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setAllOrders(sorted);
            }
        } catch (err) {
            console.error("Lỗi fetch all orders:", err);
            setError(err.message);
        } finally {
            setAllOrdersLoading(false);
        }
    }, []);

    const fetchOrdersByMonthAndYear = useCallback(async (year, month) => {
        setAllOrdersLoading(true);
        setError(null);
        setAllOrders([]);
        try {
            const response = await fetch(`http://localhost:8080/api/orders/filter?year=${year}&month=${month}`);
            if (!response.ok) throw new Error(`Filter API: ${response.status}`);
            const result = await response.json();
            if (Array.isArray(result)) {
                setAllOrders(result);
            }
        } catch (err) {
            console.error("Lỗi fetch filter orders:", err);
            setError(err.message);
        } finally {
            setAllOrdersLoading(false);
        }
    }, []);

    const fetchTop5Products = useCallback(async (year, month) => {
        setTopProductsLoading(true);
        setError(null);
        setTopProducts([]); // reset trước khi fetch

        const url = `http://localhost:8080/api/orders/reports/top-products?year=${year}&month=${month}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Top Products API Error ${response.status}: ${text}`);
            }
            const result = await response.json();

            // Đảm bảo luôn là mảng, nếu backend trả rỗng thì vẫn giữ []
            if (Array.isArray(result)) {
                setTopProducts(result);
            } else {
                console.warn("Top products API không trả về mảng:", result);
                setTopProducts([]);
            }
        } catch (err) {
            console.error("Lỗi khi lấy top 5 sản phẩm:", err);
            setError(err.message);
            setTopProducts([]);
        } finally {
            setTopProductsLoading(false);
        }
    }, []);

    // Tải dữ liệu khi app khởi động
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // tháng 1-12

        fetchAllOrders();
        fetchMonthlyRevenue(year, month);
        fetchWeeklyStats();
        fetchPendingCount();
        fetchTop5Products(year, month); // Tự động load top 5 của tháng hiện tại
    }, []);

    // Giá trị cung cấp ra ngoài
    const contextValue = {
        // Monthly
        monthlyData,
        monthlyLoading,
        fetchMonthlyRevenue,

        // Weekly
        weeklyStats,
        weeklyLoading,
        fetchWeeklyStats,

        // Pending
        pendingCount,
        pendingLoading,
        fetchPendingCount,

        // All Orders + Filter
        allOrders,
        allOrdersLoading,
        fetchAllOrders,
        fetchOrdersByMonthAndYear,

        // === MỚI: Top 5 sản phẩm ===
        topProducts,
        topProductsLoading,
        fetchTop5Products: fetchTop5Products,

        // Error chung
        error,
    };

    return (
        <StatisticalContext.Provider value={contextValue}>
            {children}
        </StatisticalContext.Provider>
    );
};

// Custom hook
export const useStatisticalContext = () => {
    const context = useContext(StatisticalContext);
    if (!context) {
        throw new Error('useStatisticalContext must be used within StatisticalProvider');
    }
    return context;
};