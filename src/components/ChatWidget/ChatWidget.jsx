import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import { sendChatMessage } from '../../api/chat';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chat_history');
        return saved ? JSON.parse(saved) : [
            { role: 'assistant', text: 'Hi! I am your Bangol assistant. How can I help you find fresh products today?' }
        ];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('chat_history', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        const newUserMessage = { role: 'user', text: userMsg };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setLoading(true);

        try {
            console.log('Sending message:', userMsg);
            const response = await sendChatMessage(userMsg);
            console.log('Chat API Raw Response:', response);

            const assistantMsg = {
                role: 'assistant',
                text: response.message || response.text || "I found some great products for you!",
                products: response.products || []
            };

            console.log('Assistant Message Object:', assistantMsg);
            setMessages(prev => [...prev, assistantMsg]);

            if (response.products && response.products.length > 0) {
                window.dispatchEvent(new CustomEvent('ai_products_received', {
                    detail: response.products
                }));

                if (location.pathname !== '/shop') {
                    navigate('/shop');
                }
            }
        } catch (err) {
            console.error('Chat handleSend error:', err);
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-green-primary text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-all z-[100] animate-bounce-slow"
            >
                <FiMessageSquare />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 w-[350px] bg-white rounded-3xl shadow-2xl flex flex-col z-[100] transition-all overflow-hidden ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-800 to-green-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">🌿</div>
                    <div>
                        <p className="text-sm font-bold">Bangol Assistant</p>
                        <p className="text-[10px] text-green-100 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        <FiX />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${m.role === 'user'
                                    ? 'bg-green-primary text-white rounded-tr-none'
                                    : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                                    }`}>
                                    {m.text}
                                    {m.products && m.products.length > 0 && (
                                        <div className="mt-2 py-2 border-t border-gray-100 text-[10px] font-bold text-green-primary uppercase">
                                            Suggesting {m.products.length} products on Shop page...
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1 items-center shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-primary"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-10 h-10 bg-green-primary text-white rounded-xl flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            <FiSend />
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}