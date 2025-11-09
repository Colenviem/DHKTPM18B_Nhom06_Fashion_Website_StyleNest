import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// 1. Khởi tạo Context
const StatisticalContext = createContext();

// 2. Định nghĩa Provider Component
export const StatisticalProvider = ({ children }) => {
    // --- State cho Doanh thu Hàng tháng (API cũ) ---
    const [monthlyData, setMonthlyData] = useState([]);
    const [monthlyLoading, setMonthlyLoading] = useState(false);
    
    // --- State cho Thống kê Hàng tuần (API mới) ---
    const [weeklyStats, setWeeklyStats] = useState({ 
        thisWeekCount: 0, 
        lastWeekCount: 0,
        thisWeekAmount: 0,
        lastWeekAmount: 0 
    });
    const [weeklyLoading, setWeeklyLoading] = useState(false);
    
    // --- State cho số lượng hóa đơn Pending ---
    const [pendingCount, setPendingCount] = useState(0);
    const [pendingLoading, setPendingLoading] = useState(false);
    
    // --- State MỚI: Danh sách tất cả đơn hàng (Được dùng chung cho cả fetch All và fetch Filter) ---
    const [allOrders, setAllOrders] = useState([]);
    const [allOrdersLoading, setAllOrdersLoading] = useState(false);
    
    // State chung cho lỗi
    const [error, setError] = useState(null);

    // --- Hàm fetch Doanh thu Hàng tháng (Giữ nguyên) ---
    const fetchMonthlyRevenue = useCallback(async (year, month) => {
        setMonthlyLoading(true);
        setError(null);
        setMonthlyData([]); 

        const url = `http://localhost:8080/api/orders/monthly?year=${year}&month=${month}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`[Monthly API] Lỗi HTTP! Status: ${response.status}. Chi tiết: ${errorBody}`);
            }
            const result = await response.json();
            setMonthlyData(result);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu doanh thu hàng tháng:", err);
            setError(err.message || "Không thể kết nối hoặc lấy dữ liệu Monthly API.");
        } finally {
            setMonthlyLoading(false);
        }
    }, []);

    // --- Hàm fetch Thống kê Hàng tuần (Giữ nguyên) ---
    const fetchWeeklyStats = useCallback(async () => {
        setWeeklyLoading(true);
        setError(null);

        const url = `http://localhost:8080/api/orders/weekly-count`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`[Weekly API] Lỗi HTTP! Status: ${response.status}. Chi tiết: ${errorBody}`);
            }
            const result = await response.json();
            setWeeklyStats(result); 
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu thống kê hàng tuần:", err);
            setError(err.message || "Không thể kết nối hoặc lấy dữ liệu Weekly API.");
        } finally {
            setWeeklyLoading(false);
        }
    }, []);
    
    // --- Hàm Lấy số lượng hóa đơn Pending (Giữ nguyên) ---
    const fetchPendingCount = useCallback(async () => {
        setPendingLoading(true);
        setError(null);

        const url = `http://localhost:8080/api/orders/countPending/PENDING`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`[Pending Count API] Lỗi HTTP! Status: ${response.status}. Chi tiết: ${errorBody}`);
            }
            
            const result = await response.json(); 
            
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

    // --- Hàm MỚI: Lấy tất cả danh sách đơn hàng (Endpoint gốc: /api/orders) ---
    // Hàm này được giữ lại để tải dữ liệu ban đầu hoặc khi không có bộ lọc
    const fetchAllOrders = useCallback(async () => {
        setAllOrdersLoading(true);
        setError(null);
        setAllOrders([]);

        const url = `http://localhost:8080/api/orders`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`[All Orders API] Lỗi HTTP! Status: ${response.status}. Chi tiết: ${errorBody}`);
            }
            
            const result = await response.json(); 
            
            if (Array.isArray(result)) {
                // Sắp xếp MỚI NHẤT -> CŨ NHẤT mặc định cho bảng (để dễ dàng lấy đơn hàng gần đây)
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


    // --- HÀM MỚI THEO YÊU CẦU: Lấy hóa đơn theo Tháng và Năm được chọn (/api/orders/filter) ---
    /**
     * Tải danh sách đơn hàng đã lọc theo tháng và năm cụ thể.
     * @param {number} year 
     * @param {number} month 
     */
    const fetchOrdersByMonthAndYear = useCallback(async (year, month) => {
        setAllOrdersLoading(true);
        setError(null);
        setAllOrders([]); // Xóa dữ liệu cũ

        // Endpoint: /api/orders/filter?year=2025&month=11
        const url = `http://localhost:8080/api/orders/filter?year=${year}&month=${month}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`[Filter Orders API] Lỗi HTTP! Status: ${response.status}. Chi tiết: ${errorBody}`);
            }
            
            const result = await response.json(); 
            
            if (Array.isArray(result)) {
                // API backend đã sắp xếp TĂNG DẦN (cũ -> mới), chúng ta lưu trực tiếp
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


    // Tải dữ liệu ban đầu khi Provider được mount
    useEffect(() => {
        // Lấy tháng và năm hiện tại để khởi tạo
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        // Khởi tạo data ban đầu: có thể dùng fetchOrdersByMonthAndYear cho tháng hiện tại
        // Tuy nhiên, vì bảng Deals dùng logic lọc trên frontend, ta vẫn cần fetchAllOrders để có dữ liệu gốc
        fetchAllOrders(); 
        
        fetchMonthlyRevenue(currentYear, currentMonth);
        fetchWeeklyStats(); 
        fetchPendingCount();

    }, [fetchMonthlyRevenue, fetchWeeklyStats, fetchPendingCount, fetchAllOrders]);

    // Giá trị được cung cấp cho Context
    const contextValue = {
        // Monthly Data 
        data: monthlyData, 
        loading: monthlyLoading,
        monthlyData,
        monthlyLoading,
        fetchMonthlyRevenue,
        
        // Weekly Data 
        weeklyStats,
        weeklyLoading,
        fetchWeeklyStats,
        
        // Pending Count Data
        pendingCount,
        pendingLoading,
        fetchPendingCount,
        
        // All Orders Data (MỚI)
        allOrders,
        allOrdersLoading,
        fetchAllOrders,
        
        // Hàm Lọc MỚI
        fetchOrdersByMonthAndYear, // Cung cấp hàm lọc cho component bên ngoài sử dụng

        // Common Error
        error, 
    };

    return (
        <StatisticalContext.Provider value={contextValue}>
            {children}
        </StatisticalContext.Provider>
    );
};

// 3. Custom Hook để dễ dàng sử dụng Context (Giữ nguyên)
export const useStatisticalContext = () => {
    const context = useContext(StatisticalContext);
    if (context === undefined) {
        throw new Error('useStatisticalContext phải được sử dụng bên trong StatisticalProvider');
    }
    return context;
};