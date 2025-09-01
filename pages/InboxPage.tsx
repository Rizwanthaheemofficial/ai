import React, { useState } from 'react';
import { MOCK_MESSAGES, SOCIAL_ICONS } from '../constants';
import { type Message, SocialProvider } from '../types';
import { Search, Inbox, Sparkles, Send } from 'lucide-react';
import { generateSmartReply } from '../services/geminiService';
import { useNotification } from '../context/NotificationContext';

const MessageItem: React.FC<{ message: Message, isSelected: boolean, onSelect: () => void }> = ({ message, isSelected, onSelect }) => {
    const Icon = SOCIAL_ICONS[message.platform];
    return (
        <button onClick={onSelect} className={`w-full text-left p-4 border-l-4 ${isSelected ? 'bg-gray-800 border-brand-500' : 'border-transparent hover:bg-gray-800/50'}`}>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <img src={message.sender.avatar} alt={message.sender.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className={`font-semibold ${!message.isRead ? 'text-white' : 'text-gray-300'}`}>{message.sender.name}</p>
                        <p className={`text-xs ${!message.isRead ? 'text-gray-300' : 'text-gray-500'}`}>{new Date(message.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
                <Icon className="w-5 h-5 text-gray-500" />
            </div>
            <p className={`text-sm mt-2 truncate ${!message.isRead ? 'text-gray-200' : 'text-gray-400'}`}>
                {message.content}
            </p>
        </button>
    );
};

const InboxPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(messages[0]);
    const [replySuggestions, setReplySuggestions] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const { addNotification } = useNotification();

    const handleSelectMessage = (message: Message) => {
        setSelectedMessage(message);
        setReplySuggestions([]); // Clear suggestions when changing message
        // Mark as read
        setMessages(prev => prev.map(m => m.id === message.id ? { ...m, isRead: true } : m));
    };

    const handleGenerateReplies = async () => {
        if (!selectedMessage) return;
        setIsGenerating(true);
        try {
            const result = await generateSmartReply(selectedMessage.content);
            const parsedResult = JSON.parse(result);
            setReplySuggestions([parsedResult.positive, parsedResult.neutral, parsedResult.quick]);
        } catch (error) {
            addNotification('Failed to generate smart replies.', 'error');
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };
    

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Message List Panel */}
            <div className="w-1/3 border-r border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-800">
                    <h1 className="text-2xl font-bold text-white">Universal Inbox</h1>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Search messages..." className="w-full bg-gray-700 border-gray-600 rounded-md pl-10 pr-4 py-2 text-white" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {messages.map(msg => (
                        <MessageItem 
                            key={msg.id} 
                            message={msg} 
                            isSelected={selectedMessage?.id === msg.id}
                            onSelect={() => handleSelectMessage(msg)}
                        />
                    ))}
                </div>
            </div>

            {/* Message Detail Panel */}
            <div className="w-2/3 flex flex-col bg-gray-950">
                {selectedMessage ? (
                    <>
                        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                            <img src={selectedMessage.sender.avatar} alt={selectedMessage.sender.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold text-white">{selectedMessage.sender.name}</p>
                                <p className="text-sm text-gray-400">on {selectedMessage.platform}</p>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.content}</p>
                                <p className="text-xs text-gray-500 text-right mt-2">{new Date(selectedMessage.timestamp).toLocaleString()}</p>
                            </div>
                            
                            {/* AI Assistant */}
                            <div className="bg-gray-900 border border-brand-800/50 rounded-lg p-4 space-y-3">
                                <h3 className="text-lg font-semibold text-brand-400 flex items-center gap-2"><Sparkles size={20}/> AI Assistant</h3>
                                {replySuggestions.length > 0 ? (
                                    <div className="space-y-2">
                                        {replySuggestions.map((reply, i) => (
                                            <div key={i} className="bg-gray-800 p-3 rounded-md text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">
                                                {reply}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <button onClick={handleGenerateReplies} disabled={isGenerating} className="w-full bg-brand-700/80 hover:bg-brand-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600">
                                        {isGenerating ? 'Thinking...' : 'Generate Smart Replies'}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-800 bg-gray-900">
                             <div className="relative">
                                <textarea rows={2} placeholder={`Reply to ${selectedMessage.sender.name}...`} className="w-full bg-gray-800 rounded-lg p-3 pr-20 text-white" />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-500 p-2 rounded-full">
                                    <Send className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                        <Inbox size={48} />
                        <h2 className="mt-4 text-xl font-semibold">Select a message</h2>
                        <p>Choose a conversation from the left to view details and reply.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboxPage;