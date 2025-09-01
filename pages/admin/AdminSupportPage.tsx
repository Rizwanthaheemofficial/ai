
import React, { useState } from 'react';
import { MOCK_SUPPORT_TICKETS } from '../../constants';
import { SupportTicket } from '../../types';
import { Inbox, ArrowLeft, Sparkles, Send } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { generateSupportReply } from '../../services/geminiService';

const TicketItem: React.FC<{ ticket: SupportTicket, onSelect: () => void }> = ({ ticket, onSelect }) => {
    const statusColor = {
        'Open': 'bg-green-500',
        'In Progress': 'bg-yellow-500',
        'Closed': 'bg-gray-600'
    };
    return (
        <button onClick={onSelect} className="w-full text-left p-4 hover:bg-gray-800/50 border-b border-gray-800">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-white truncate max-w-xs">{ticket.subject}</p>
                    <p className="text-sm text-gray-400">{ticket.user.name}</p>
                </div>
                <span className={`w-3 h-3 rounded-full ${statusColor[ticket.status]} flex-shrink-0 mt-1`}></span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{new Date(ticket.createdAt).toLocaleString()}</p>
        </button>
    );
};

const AdminSupportPage: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { addNotification } = useNotification();

    const handleGenerateReply = async () => {
        if (!selectedTicket) return;
        setIsGenerating(true);
        setReplyText('');
        try {
            const result = await generateSupportReply(selectedTicket.subject, selectedTicket.message);
            setReplyText(result);
        } catch (error) {
            addNotification('Failed to generate AI reply.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    if (selectedTicket) {
        return (
            <div className="space-y-6">
                 <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 font-semibold text-brand-400 hover:text-brand-300">
                    <ArrowLeft size={16} /> Back to All Tickets
                </button>
                <div className="bg-gray-800 rounded-lg">
                    <div className="p-6 border-b border-gray-700">
                        <h1 className="text-2xl font-bold text-white">{selectedTicket.subject}</h1>
                        <p className="text-sm text-gray-400">From: {selectedTicket.user.name} ({selectedTicket.user.email})</p>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-300 whitespace-pre-wrap">{selectedTicket.message}</p>
                    </div>
                </div>

                 <div className="bg-gray-800 rounded-lg">
                    <div className="p-6 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-white">Reply</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <textarea 
                            rows={8} 
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white"
                        />
                        <div className="flex justify-between items-center">
                             <button onClick={handleGenerateReply} disabled={isGenerating} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-700/80 rounded-md hover:bg-brand-700 disabled:bg-gray-600">
                                <Sparkles size={16}/> {isGenerating ? 'Generating...' : 'AI Generate Reply'}
                            </button>
                             <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500">
                                <Send size={16}/> Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
         <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Support System</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 rounded-lg h-full flex flex-col">
                        <div className="p-4 border-b border-gray-700">
                            <h2 className="font-semibold text-white">All Tickets</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {tickets.map(ticket => (
                                <TicketItem key={ticket.id} ticket={ticket} onSelect={() => setSelectedTicket(ticket)} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 flex flex-col items-center justify-center text-center text-gray-500 bg-gray-800/50 rounded-lg h-96">
                    <Inbox size={48} />
                    <h2 className="mt-4 text-xl font-semibold">Select a Ticket</h2>
                    <p>Choose a ticket from the left to view details and reply.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminSupportPage;
