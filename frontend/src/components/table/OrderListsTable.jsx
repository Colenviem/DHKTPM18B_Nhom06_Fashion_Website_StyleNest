import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

const orderTypes = [
  { id: 1, label: 'Health & Medicine' },
  { id: 2, label: 'Book & Stationary' },
  { id: 3, label: 'Services & Industry' },
  { id: 4, label: 'Fashion & Beauty' },
  { id: 5, label: 'Home & Living' },
  { id: 6, label: 'Electronics' },
  { id: 7, label: 'Mobile & Phone' },
  { id: 8, label: 'Accessories' },
];

const orderData = [
  { id: '00001', name: 'Chris Evans', location: '124 Lyfa Forge Suite 975', date: '2019-02-14', type: 'Electronics', status: 'Completed' },
  { id: '00002', name: 'Rosie Todd', location: '543 Weimann Mountain', date: '2019-07-29', type: 'Book & Stationary', status: 'Processing' },
  { id: '00003', name: 'Danial Hine', location: 'New Scottleberg', date: '2019-04-30', type: 'Health & Medicine', status: 'Rejected' },
  { id: '00004', name: 'Gilbert Smith', location: '042 Mylene Throughway', date: '2019-12-21', type: 'Mobile & Phone', status: 'Completed' },
  { id: '00005', name: 'Alan Cain', location: '124 Lyfa Forge Suite 975', date: '2019-01-09', type: 'Accessories', status: 'Processing' },
];

const getStatusClasses = (status) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700';
    case 'Processing': return 'bg-purple-100 text-purple-700';
    case 'Rejected': return 'bg-red-100 text-red-700';
    case 'On Hold': return 'bg-yellow-100 text-yellow-700';
    case 'In Transit': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } },
};

const OrderTypeFilterModal = ({ onClose, selectedTypes, setSelectedTypes }) => {
  const toggleType = (id) => {
    setSelectedTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
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
        {orderTypes.map(type => (
          <button
            key={type.id}
            onClick={() => toggleType(type.id)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-all
              ${selectedTypes.includes(type.id)
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-700'}
            `}
          >
            {type.label}
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow"
      >
        Apply Now
      </button>
    </motion.div>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-GB', options);
};

const OrderListsTable = () => {
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [currentOrderData] = useState(orderData);

  const filteredOrders = currentOrderData.filter(order => {
    const matchesType = selectedTypes.length === 0 || selectedTypes.map(id => orderTypes.find(t => t.id === id)?.label).includes(order.type);
    const matchesDate = filterDate ? order.date === filterDate : true;
    return matchesType && matchesDate;
  });

  const handleReset = () => {
    setFilterDate('');
    setSelectedTypes([]);
    setIsTypeFilterOpen(false);
  };

  return (
    <div className="p-6  bg-gray-50 min-h-screen pt-24">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Danh sách đặt hàng</h1>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white border border-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-shadow shadow-sm">
            <FiFilter className="w-4 h-4" /> Lọc Theo
          </button>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl text-sm font-medium shadow-sm cursor-pointer transition focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 appearance-none"
          />

          <div className="relative">
            <button
              onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
              className={`flex items-center gap-1 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
                selectedTypes.length > 0
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-sm'
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
          className="px-3 py-2 text-red-500 font-medium text-sm hover:text-red-700 transition-colors rounded-xl hover:bg-red-50"
        >
          Reset Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-600 uppercase tracking-wider font-semibold text-xs">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Type</th>
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
                <td colSpan="6" className="text-center py-8 text-gray-500 italic">Không tìm thấy đơn hàng nào phù hợp với bộ lọc.</td>
              </tr>
            )}
            {filteredOrders.map(order => (
              <motion.tr
                key={order.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-3 font-semibold text-gray-900">{order.id}</td>
                <td className="px-6 py-3 text-gray-700">{order.name}</td>
                <td className="px-6 py-3 text-gray-700 whitespace-nowrap">{order.location}</td>
                <td className="px-6 py-3 text-gray-700 whitespace-nowrap font-mono">{formatDate(order.date)}</td>
                <td className="px-6 py-3 text-gray-700">{order.type}</td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListsTable;