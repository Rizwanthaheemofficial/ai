
import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-400" />,
    error: <XCircle className="w-6 h-6 text-red-400" />,
    info: <Info className="w-6 h-6 text-blue-400" />,
};

const colors = {
    success: 'bg-green-800/90 border-green-600',
    error: 'bg-red-800/90 border-red-600',
    info: 'bg-blue-800/90 border-blue-600',
};

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed bottom-5 right-5 z-[100] space-y-3 w-full max-w-sm">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg shadow-2xl border text-white backdrop-blur-sm ${colors[notification.type]}`}
                    role="alert"
                >
                    <div className="flex-shrink-0">{icons[notification.type]}</div>
                    <p className="flex-1 text-sm font-medium">{notification.message}</p>
                    <button 
                        onClick={() => removeNotification(notification.id)} 
                        className="p-1 rounded-full hover:bg-white/10"
                        aria-label="Close notification"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;
