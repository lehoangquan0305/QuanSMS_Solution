import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import '../assets/css/chatbot.css';

// Component tạo hiệu ứng chữ chạy từ từ cho AI cực chuyên nghiệp
const EffectTypingText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        setDisplayedText(''); // reset lại chuỗi rỗng khi nhận text mới
        const timer = setInterval(() => {
            if (i < text.length) {
                // Lấy từng ký tự
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 20); // Tốc độ gõ chữ (ms) - chỉnh nhỏ nếu muốn chạy nhanh hơn
        return () => clearInterval(timer);
    }, [text]);

    return <span>{displayedText}</span>;
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hệ thống đã kết nối... Bạn cần trợ giúp gì?', isNew: false }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false); // Trạng thái AI đang suy nghĩ
    const chatBodyRef = useRef(null);

    // Tự động cuộn xuống đáy khi có tin nhắn mới
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true); // Bật hiệu ứng dấu 3 chấm chờ AI

        try {
            const response = await axios.post('http://localhost:5001/api/chat', { message: input });
            // Đánh dấu 'isNew: true' để chỉ tin nhắn mới nhất này kích hoạt hiệu ứng chữ gõ chạy
            setMessages((prev) => [...prev, { sender: 'ai', text: response.data.reply, isNew: true }]);
        } catch {
            setMessages((prev) => [...prev, { sender: 'ai', text: "Lỗi kết nối máy chủ. Thử lại sau!", isNew: true }]);
        } finally {
            setIsTyping(false); // Tắt hiệu ứng 3 chấm suy nghĩ
        }
    };

    return (
        <div className="chatbot-wrapper">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>⚡ CYBER_AI CORE</span>
                        <button onClick={() => setIsOpen(false)}><FaTimes /></button>
                    </div>

                    <div className="chat-body" ref={chatBodyRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`msg ${m.sender}`}>
                                {m.sender === 'ai' && m.isNew ? (
                                    <EffectTypingText text={m.text} />
                                ) : (
                                    m.text
                                )}
                            </div>
                        ))}

                        {/* Hiệu ứng 3 dấu chấm nhấp nháy khi đợi AI trả lời */}
                        {isTyping && (
                            <div className="msg ai">
                                <div className="typing-dots">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="chat-footer">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Nhập lệnh vào hệ thống..."
                        />
                        <button onClick={sendMessage}><FaPaperPlane /></button>
                    </div>
                </div>
            )}

            <button className="chat-bubble" onClick={() => setIsOpen(!isOpen)}>
                <FaComments />
            </button>
        </div>
    );
};

export default Chatbot;