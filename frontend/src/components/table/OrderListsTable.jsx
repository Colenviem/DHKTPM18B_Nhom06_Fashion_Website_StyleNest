import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

const orderTypes = [
  { id: 'NORMAL', label: 'Nhanh' },
  { id: 'EXPRESS', label: 'Hỏa tốc' },
];


const getStatusClasses = (status) => {
  switch (status) {
    case 'Delivered': return 'bg-green-100 text-green-700';
    case 'PENDING': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

const OrderTypeFilterModal = ({ onClose, selectedTypes, setSelectedTypes }) => {
  const toggleType = (id) => {
    setSelectedTypes((prev) =>
        prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
      <motion.div
          className="absolute top-full mt-2 left-0 w-80 bg-white rounded-xl shadow-xl p-6 z-20 border border-gray-200"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
      >
        <h3 className="font-semibold text-lg text-gray-800 mb-4">Select Order Type</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {orderTypes.map((type) => (
              <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all
              ${
                      selectedTypes.includes(type.id)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
              >
                {type.label}
              </button>
          ))}
        </div>
        <button
            onClick={onClose}
            className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
        >
          Apply Now
        </button>
      </motion.div>
  );
};

const OrderListsTable = () => {
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();

        const mapped = data.map(order => ({
          id: order.orderNumber,
          name: order.user?.userName || "No Name",
          location: order.shippingAddress?.street || "No Address",
          date: order.createdAt,
          paymentMethod: order.paymentMethod || "Unknown",
          status: order.status
        }));

        setOrders(mapped);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-GB', options);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes
            .map((id) => orderTypes.find((t) => t.id === id)?.label)
            .includes(order.type);

    const matchesDate = filterDate
        ? order.date?.slice(0, 10) === filterDate
        : true;

    return matchesType && matchesDate;
  });


  const handleReset = () => {
    setFilterDate('');
    setSelectedTypes([]);
    setIsTypeFilterOpen(false);
  };

  return (
      <div className="p-6 bg-gray-50 min-h-screen pt-24">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Danh sách đặt hàng</h1>

        {/* Loading */}
        {loading && (
            <p className="text-center text-gray-600 text-lg">Đang tải dữ liệu...</p>
        )}

        {/* Error */}
        {error && (
            <p className="text-center text-red-600 text-lg">Lỗi: {error}</p>
        )}

        {!loading && !error && (
            <>
              {/* FILTER BAR */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">

                <div className="flex flex-wrap items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white border border-indigo-600 rounded-xl text-sm font-medium">
                    <FiFilter className="w-4 h-4" /> Lọc Theo
                  </button>

                  <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl text-sm shadow-sm"
                  />

                  <div className="relative">
                    <button
                        onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                        className={`flex items-center gap-1 px-4 py-2 border rounded-xl text-sm
                    ${
                            selectedTypes.length > 0
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      Loại Đơn Hàng {selectedTypes.length > 0 && `(${selectedTypes.length})`}
                      <FiChevronDown className="ml-1 w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {isTypeFilterOpen && (
                          <OrderTypeFilterModal
                              onClose={() => setIsTypeFilterOpen(false)}
                              selectedTypes={selectedTypes}
                              setSelectedTypes={setSelectedTypes}
                          />
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <button
                    onClick={handleReset}
                    className="px-3 py-2 text-red-500 font-medium text-sm hover:bg-red-50 rounded-xl"
                >
                  Reset Filter
                </button>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                  <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Payment</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                  </thead>

                  <motion.tbody
                      className="bg-white divide-y divide-gray-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                  >
                    {filteredOrders.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-gray-500 italic">
                            Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                          </td>
                        </tr>
                    )}

                    {filteredOrders.map((order) => (
                        <motion.tr
                            key={order.id}
                            className="hover:bg-gray-50 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                          <td className="px-6 py-3 font-semibold">{order.id}</td>
                          <td className="px-6 py-3">{order.name}</td>
                          <td className="px-6 py-3 whitespace-nowrap">{order.location}</td>
                          <td className="px-6 py-3 whitespace-nowrap font-mono">{formatDate(order.date)}</td>
                          <td className="px-6 py-3">{order.paymentMethod}</td>
                          <td className="px-6 py-3">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                        {order.status}
                      </span>
                          </td>
                        </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>
            </>
        )}
      </div>
  );
};

export default OrderListsTable;
