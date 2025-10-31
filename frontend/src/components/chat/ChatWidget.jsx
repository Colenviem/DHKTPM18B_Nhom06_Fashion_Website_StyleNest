import React, { useState } from "react";
import { FiX, FiMessageSquare, FiSend } from "react-icons/fi";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Chào bạn! Mình là trợ lý ảo của FASCO. Bạn cần hỗ trợ về vấn đề gì?" },
  ]);
  const [input, setInput] = useState("");

  const primaryColor = "bg-gradient-to-r from-indigo-600 to-purple-600";

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Box */}
      {isOpen && (
        <div
          className={`w-80 h-[460px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Header */}
          <div
            className={`flex justify-between items-center px-4 py-3 text-white ${primaryColor} shadow-md`}
          >
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <span className="font-semibold text-lg tracking-wide">
                Hỗ trợ FASCO
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition"
              aria-label="Đóng chat"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Chat body */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 text-sm space-y-4">
            {messages.map((msg, i) =>
              msg.from === "bot" ? (
                <div key={i} className="flex justify-start">
                  <div className="bg-indigo-100 text-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                    {msg.text}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
            />
            <button
              onClick={handleSend}
              className={`p-2.5 rounded-full text-white ${primaryColor} hover:scale-105 transition`}
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl ${primaryColor} hover:scale-110 active:scale-95 transition-transform`}
          aria-label="Mở chat"
        >
          <FiMessageSquare size={26} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;