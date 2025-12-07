import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import * as XLSX from 'xlsx'; // Import thư viện XLSX
import { saveAs } from 'file-saver'; // Import thư viện saveAs
import { useStatisticalContext } from '../../context/StatisticalContext'; // sửa đường dẫn nếu cần

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6b7280'];

// Hàm định dạng tiền tệ Việt Nam đồng
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value);
};

// Component Tooltip tùy chỉnh cho biểu đồ (giữ nguyên)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-blue-600 font-bold text-lg">{formatCurrency(payload[0].value)}</p>
        <p className="text-sm text-gray-600">
          Chiếm {(payload[0].payload.percent * 100).toFixed(1)}% tổng doanh thu
        </p>
      </div>
    );
  }
  return null;
};

// Hàm hiển thị label phần trăm trên biểu đồ (giữ nguyên)
const renderCustomizedLabel = ({ percent }) => {
  return percent > 0.05 ? `${(percent * 100).toFixed(1)}%` : '';
};

export default function StatisticalPage() {
  const { topProducts, topProductsLoading, fetchTop5Products } = useStatisticalContext();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // LƯU Ý: Đổi tên handleView thành handleFetchData để gọi API
  const handleFetchData = () => {
    fetchTop5Products(selectedYear, selectedMonth);
  };
  
  useEffect(() => {
    handleFetchData();
  }, [selectedYear, selectedMonth, fetchTop5Products]);

  // Tính tổng doanh thu (giữ nguyên)
  const totalRevenue = useMemo(
    () => topProducts.reduce((sum, item) => sum + item.revenue, 0),
    [topProducts]
  );

  // Dữ liệu chi tiết cho bảng và xuất Excel
  const detailData = useMemo(() => {
    return topProducts
      .filter(item => item.name !== "Các sản phẩm khác")
      .map(item => ({
        ...item,
        percent: totalRevenue > 0 ? item.revenue / totalRevenue : 0,
      }));
  }, [topProducts, totalRevenue]);

  // Dữ liệu cho biểu đồ (giữ nguyên)
  const pieChartData = useMemo(() => {
      if (topProducts.length === 0) return [];

      const others = topProducts.find(item => item.name === 'Các sản phẩm khác');
      const topItems = topProducts.filter(item => item.name !== 'Các sản phẩm khác');

      const top5 = topItems.slice(0, 5); 

      const result = top5.map(item => ({
        ...item,
        percent: totalRevenue > 0 ? item.revenue / totalRevenue : 0,
      }));

      if (others && topItems.length >= 5) {
        result.push({
          ...others,
          percent: totalRevenue > 0 ? others.revenue / totalRevenue : 0,
        });
      }

      return result;
    }, [topProducts, totalRevenue]);


  // Danh sách năm (giữ nguyên)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2022 }, 
    (_, i) => currentYear - i
  ); 
  
  // --- HÀM XUẤT EXCEL MỚI ---
  const handleExportExcel = () => {
    if (detailData.length === 0) {
      alert(`Không có dữ liệu sản phẩm để xuất cho tháng ${selectedMonth}/${selectedYear}.`);
      return;
    }

    // 1. Chuẩn bị dữ liệu cho Excel
    const excelData = detailData.map((item, index) => ({
      'STT': index + 1,
      'Tên Sản Phẩm': item.name,
      'Doanh Thu (VND)': item.revenue,
      'Phần Trăm (%)': (item.percent * 100).toFixed(2),
    }));

    excelData.push({
      'STT': '',
      'Tên Sản Phẩm': 'TỔNG CỘNG:',
      'Doanh Thu (VND)': totalRevenue,
      'Phần Trăm (%)': '100.00',
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    for (let i = 4; i <= excelData.length + 3; i++) {
        const cell = worksheet[`C${i}`];
        if (cell) {
            cell.t = 'n'; // Set type to Number
            cell.z = '#,##0'; // Định dạng số không có thập phân
        }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DoanhThuSanPham');

    // 3. Xuất file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    const fileName = `BaoCao_DoanhThu_T${selectedMonth}_N${selectedYear}.xlsx`;
    saveAs(data, fileName);
  };
  // --- KẾT THÚC HÀM XUẤT EXCEL MỚI ---


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Thống Kê Doanh Thu Sản Phẩm Theo Tháng
      </h1>

      {/* Bộ lọc */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {/* Chọn Tháng */}
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700">Tháng:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>
                  {m < 10 ? `0${m}` : m}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn Năm */}
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700">Năm:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          {/* Nút Xem báo cáo (để trigger useEffect) */}
           <button
            onClick={handleFetchData} // Giữ lại nút này nếu bạn cần trigger API thủ công
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
          >
            Xem dữ liệu
          </button>

          {/* Nút Xuất Excel MỚI */}
          <button
            onClick={handleExportExcel}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
            disabled={topProductsLoading || totalRevenue === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Hiển thị Nội dung (Giữ nguyên) */}
      {topProductsLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <span className="ml-4 text-lg">Đang tải...</span>
        </div>
      ) : topProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg">
            Không có dữ liệu cho tháng {selectedMonth < 10 ? '0' + selectedMonth : selectedMonth}/{selectedYear}
          </p>
        </div>
      ) : (
        <div>
          {/* Tổng doanh thu */}
          <div className="text-center mb-8 bg-white rounded-xl shadow p-6">
            <p className="text-gray-600 text-lg">Tổng doanh thu tháng</p>
            <p className="text-5xl font-bold text-blue-600 mt-3">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-gray-500 mt-2">
              Tháng {selectedMonth < 10 ? '0' + selectedMonth : selectedMonth}/{selectedYear}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Biểu đồ tròn */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Top 5 Sản Phẩm có doanh thu cao nhất
              </h2>
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={190}
                    fill="#8884d8"
                    dataKey="revenue"
                    nameKey="name"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bảng chi tiết */}
            <div className="bg-white rounded-2xl shadow-lg p-1">
              <h3 className="text-xl font-bold text-gray-800 mb-5 text-center">
                Chi Tiết Tất Cả Sản Phẩm ({detailData.length})
              </h3>
              <div className="max-h-116 overflow-y-auto">
                <div className="space-y-3">
                  {detailData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-200 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <p
                          className="font-medium text-gray-800 max-w-48 truncate"
                          title={item.name}
                        >
                          {item.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          {formatCurrency(item.revenue)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(item.percent * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-100 rounded-xl font-bold">
                    <p className="text-lg text-blue-800">TỔNG CỘNG</p>
                    <p className="text-lg text-blue-800">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}