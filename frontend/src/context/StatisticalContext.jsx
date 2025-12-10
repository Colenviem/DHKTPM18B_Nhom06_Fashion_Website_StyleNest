import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import axiosClient from "../api/axiosClient";

const StatisticalContext = createContext();

export const StatisticalProvider = ({ children }) => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [monthlyLoading, setMonthlyLoading] = useState(false);

    const [weeklyStats, setWeeklyStats] = useState({
        thisWeekCount: 0,
        lastWeekCount: 0,
        thisWeekAmount: 0,
        lastWeekAmount: 0
    });
    const [weeklyLoading, setWeeklyLoading] = useState(false);

    const [pendingCount, setPendingCount] = useState(0);
    const [pendingLoading, setPendingLoading] = useState(false);

    const [allOrders, setAllOrders] = useState([]);
    const [allOrdersLoading, setAllOrdersLoading] = useState(false);

    const [error, setError] = useState(null);

    const fetchMonthlyRevenue = useCallback(async (year, month) => {
        setMonthlyLoading(true);
        setError(null);
        setMonthlyData([]);

        try {

            const response = await axiosClient.get(`/orders/monthly?year=${year}&month=${month}`);
            setMonthlyData(response.data);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu doanh thu hàng tháng:", err);
            setError(err.message || "Không thể kết nối hoặc lấy dữ liệu Monthly API.");
        } finally {
            setMonthlyLoading(false);
        }
    }, []);

    const fetchWeeklyStats = useCallback(async () => {
        setWeeklyLoading(true);
        setError(null);

        try {

            const response = await axiosClient.get(`/orders/weekly-count`);
            setWeeklyStats(response.data);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu thống kê hàng tuần:", err);
            setError(err.message || "Không thể kết nối hoặc lấy dữ liệu Weekly API.");
        } finally {
            setWeeklyLoading(false);
        }
    }, []);

    const fetchPendingCount = useCallback(async () => {
        setPendingLoading(true);
        setError(null);

        try {

            const response = await axiosClient.get(`/orders/countPending/PENDING`);
            const result = response.data;

            let countValue = 0;
            if (typeof result === 'object' && result !== null) {
                countValue = result.count || result.total || 0;
            } else if (typeof result === 'number') {
                countValue = result;
            }

            setPendingCount(countValue);
        } catch (err) {
            console.error("Lỗi khi lấy số lượng Pending:", err);
            setError(err.message || "Không thể kết nối hoặc lấy dữ liệu Pending Count API.");
        } finally {
            setPendingLoading(false);
        }
    }, []);

    const fetchAllOrders = useCallback(async () => {
        setAllOrdersLoading(true);
        setError(null);
        setAllOrders([]);

        try {

            const response = await axiosClient.get(`/orders`);
            const result = response.data;

            if (Array.isArray(result)) {
                const sortedOrders = result.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setAllOrders(sortedOrders);
            } else {
                console.warn("API /api/orders không trả về mảng dữ liệu.");
                setAllOrders([]);
            }

        } catch (err) {
            console.error("Lỗi khi lấy tất cả đơn hàng:", err);
            setError(err.message || "Không thể kết nối hoặc lấy dữ liệu All Orders API.");
        } finally {
            setAllOrdersLoading(false);
        }
    }, []);

    const [topProducts, setTopProducts] = useState([]);
    const [topProductsLoading, setTopProductsLoading] = useState(false);

    const fetchTop5Products = useCallback(async (year, month) => {
        setTopProductsLoading(true);
        setTopProducts([]); // reset

        try {
            const response = await axiosClient.get(`/orders/reports/top-products?year=${year}&month=${month}`);

            const data = Array.isArray(response.data) ? response.data : [];
            setTopProducts(data);
        } catch (err) {
            console.error("Lỗi khi lấy top sản phẩm:", err);
            setTopProducts([]); 
        } finally {
            setTopProductsLoading(false);
        }
    }, []);


    const fetchOrdersByMonthAndYear = useCallback(async (year, month) => {
        setAllOrdersLoading(true);
        setError(null);
        setAllOrders([]);

        try {

            const response = await axiosClient.get(`/orders/filter?year=${year}&month=${month}`);
            const result = response.data;

            if (Array.isArray(result)) {
                setAllOrders(result);
            } else {
                console.warn("API /api/orders/filter không trả về mảng dữ liệu.");
                setAllOrders([]);
            }

        } catch (err) {
            console.error(`Lỗi khi lấy đơn hàng tháng ${month}/${year}:`, err);
            setError(err.message || "Không thể kết nối hoặc lấy dữ liệu Filter Orders API.");
        } finally {
            setAllOrdersLoading(false);
        }
    }, []);


    useEffect(() => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        fetchAllOrders();
        fetchMonthlyRevenue(currentYear, currentMonth);
        fetchWeeklyStats();
        fetchPendingCount();

    }, [fetchMonthlyRevenue, fetchWeeklyStats, fetchPendingCount, fetchAllOrders]);

    const contextValue = {
        data: monthlyData,
        loading: monthlyLoading,
        monthlyData,
        monthlyLoading,
        fetchMonthlyRevenue,

        weeklyStats,
        weeklyLoading,
        fetchWeeklyStats,

        topProducts,
        topProductsLoading,
        fetchTop5Products,

        pendingCount,
        pendingLoading,
        fetchPendingCount,

        allOrders,
        allOrdersLoading,
        fetchAllOrders,
        fetchOrdersByMonthAndYear,

        error,
    };

    return (
        <StatisticalContext.Provider value={contextValue}>
            {children}
        </StatisticalContext.Provider>
    );
};

export const useStatisticalContext = () => {
    const context = useContext(StatisticalContext);
    if (context === undefined) {
        throw new Error('useStatisticalContext phải được sử dụng bên trong StatisticalProvider');
    }
    return context;
};