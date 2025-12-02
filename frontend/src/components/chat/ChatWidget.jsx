import React, { useState, useRef, useEffect } from "react";
import { FiX, FiMessageSquare, FiSend, FiTrash2 } from "react-icons/fi";

import axiosClient from "../../api/axiosClient";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Xin chào! Mình là trợ lý ảo StyleNest.\nMình có thể giúp bạn tìm **sản phẩm**, kiểm tra **đơn hàng** hoặc tư vấn **size**.\n\nBạn cần hỗ trợ gì hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    "Sản phẩm mới nhất",
    "Kiểm tra đơn hàng",
    "Chính sách đổi trả",
    "Phí ship đi Hà Nội"
  ];

  const primaryColor = "bg-gradient-to-r from-indigo-600 to-purple-600";
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (messageOverride) => {
    const textToSend = messageOverride || input;
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: textToSend }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axiosClient.post("/chat", { message: textToSend });

      const botReply = res.data;
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "❌ **Mất kết nối!**\nVui lòng kiểm tra lại mạng hoặc thử lại sau." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await axiosClient.post("/chat", { message: "reset" });
    } catch (error) {
      console.error("Lỗi khi reset:", error);
    }

    setMessages([{
      from: "bot",
      text: "🧹 Lịch sử đã được xóa.\nBạn cần tìm món đồ thời trang nào tiếp theo?"
    }]);
  };

  const MarkdownComponents = {
    a: ({ node, ...props }) => {
      if (props.href && props.href.startsWith('/')) {
        return (
            <Link
                to={props.href}
                className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors"
                {...props}
            />
        );
      }
      return <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />;
    },
    // eslint-disable-next-line no-unused-vars
    ul: ({ node, ...props }) => <ul className="list-disc ml-4 mt-1 mb-2 space-y-1" {...props} />,
    // eslint-disable-next-line no-unused-vars
    ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mt-1 mb-2 space-y-1" {...props} />,
    // eslint-disable-next-line no-unused-vars
    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
    // eslint-disable-next-line no-unused-vars
    strong: ({ node, ...props }) => <span className="font-bold text-indigo-700" {...props} />,
    // eslint-disable-next-line no-unused-vars
    p: ({ node, ...props }) => <p className="mb-1 last:mb-0 leading-relaxed" {...props} />
  };

  return (
      <div className="fixed bottom-6 right-6 z-[9999] font-sans">
        {isOpen && (
            <div className={`w-[360px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out ${isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className={`flex justify-between items-center px-4 py-3 text-white ${primaryColor} shadow-md`}>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border border-white/50 absolute bottom-0 right-0"></div>
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">StyleNest AI</h3>
                    <p className="text-[10px] opacity-90">Luôn sẵn sàng hỗ trợ</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={handleReset} className="p-1.5 rounded-full hover:bg-white/20 transition text-white/90" title="Xóa lịch sử chat">
                    <FiTrash2 size={16} />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-white/20 transition" aria-label="Đóng chat">
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 text-sm space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}>
                      {msg.from === "bot" && (
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-1 flex-shrink-0 text-xs">🤖</div>
                      )}
                      <div className={`px-4 py-3 max-w-[85%] shadow-sm ${msg.from === "bot" ? "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm" : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-sm"}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-1 flex-shrink-0 text-xs">🤖</div>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex space-x-1 items-center h-10">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                )}
              </div>

              {!isLoading && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 overflow-x-auto no-scrollbar flex gap-2">
                    {quickQuestions.map((q, idx) => (
                        <button key={idx} onClick={() => handleSend(q)} className="whitespace-nowrap px-3 py-1.5 bg-white border border-indigo-100 rounded-full text-xs text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm flex-shrink-0">
                          {q}
                        </button>
                    ))}
                  </div>
              )}

              <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all disabled:opacity-60"
                />
                <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className={`p-2.5 rounded-full text-white ${primaryColor} hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}>
                  <FiSend size={18} />
                </button>
              </div>
            </div>
        )}

        {!isOpen && (
            <button onClick={() => setIsOpen(true)} className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl ${primaryColor} hover:scale-110 active:scale-95 transition-transform animate-bounce-slow relative group`} aria-label="Mở chat">
              <FiMessageSquare size={26} />
              <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Chat với AI</span>
            </button>
        )}
      </div>
  );
};

export default ChatWidget;