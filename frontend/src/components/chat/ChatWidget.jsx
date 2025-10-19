import React, { useState } from "react";

const CloseIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const MessageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const primaryColor = "bg-indigo-600 hover:bg-indigo-700";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="w-80 h-96 md:h-[450px] bg-white shadow-xl rounded-xl flex flex-col border border-gray-100 overflow-hidden transform transition-all duration-300 ease-out">
          <div className="flex justify-between items-center bg-indigo-600 text-white px-4 py-3 shadow-md">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <span className="font-bold text-lg">Hỗ trợ từ FASCO</span>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-indigo-700 transition"
              aria-label="Đóng cửa sổ chat"
            >
              <CloseIcon className="text-xl" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 text-sm">
            <div className="flex justify-start mb-4">
              <div className="bg-indigo-100 text-indigo-800 p-3 rounded-xl rounded-tl-sm max-w-[85%] shadow-sm">
                <p className="font-medium">👋 Chào bạn!</p>
                <p className="mt-1">Mình là trợ lý ảo của FASCO. Bạn cần hỗ trợ về vấn đề gì?</p>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 bg-white">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="w-full px-4 py-2 text-sm border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 ${primaryColor}`}
          aria-label="Mở chat"
        >
          <MessageIcon className="text-2xl" />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;