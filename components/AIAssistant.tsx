import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getAIAssistantReply } from '../services/geminiService';
import { type ChatMessage } from '../types';

const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'ai', text: "Hello! I'm Orbit AI. How can I help you today? You can ask me about social media strategy or how to use this app." }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const getCurrentPageName = () => {
        const path = location.pathname.split('/').pop() || 'dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            const currentPage = getCurrentPageName();
            const aiResponse = await getAIAssistantReply(userInput, newMessages, currentPage);
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-brand-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-brand-500 transition-transform hover:scale-110 z-50"
                aria-label="Open AI Assistant"
            >
                {isOpen ? <X size={32} /> : <Sparkles size={32} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50">
                    <header className="p-4 border-b border-gray-700 flex items-center gap-3">
                        <Bot className="w-8 h-8 text-brand-400" />
                        <div>
                            <h2 className="text-lg font-semibold text-white">Orbit AI Assistant</h2>
                            <p className="text-xs text-gray-400">Context: On <span className="font-medium text-brand-400">{getCurrentPageName()}</span> page</p>
                        </div>
                    </header>

                    <main className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-brand-800 flex-shrink-0 flex items-center justify-center">
                                        <Sparkles size={18} className="text-brand-300" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'ai' ? 'bg-gray-800 text-gray-300' : 'bg-brand-700 text-white'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                                 {msg.sender === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
                                        <User size={18} className="text-gray-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-800 flex-shrink-0 flex items-center justify-center">
                                    <Sparkles size={18} className="text-brand-300" />
                                </div>
                                <div className="max-w-[80%] p-3 rounded-lg bg-gray-800 text-gray-300">
                                   <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-brand-400 rounded-full animate-bounce"></span>
                                   </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </main>

                    <footer className="p-4 border-t border-gray-700">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-gray-800 border border-gray-600 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                            <button type="submit" disabled={isLoading} className="bg-brand-600 text-white p-2.5 rounded-full hover:bg-brand-500 disabled:bg-gray-600">
                                <Send size={20} />
                            </button>
                        </form>
                    </footer>
                </div>
            )}
        </>
    );
};

export default AIAssistant;
