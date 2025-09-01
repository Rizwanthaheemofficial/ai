
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { type Notification, type NotificationType } from '../types';

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (message: string, type?: NotificationType) => void;
    removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (message: string, type: NotificationType = 'info') => {
        const id = Date.now();
        const newNotification: Notification = { id, message, type };
        setNotifications(prev => [...prev, newNotification]);

        setTimeout(() => {
            removeNotification(id);
        }, 5000); // Auto-remove after 5 seconds
    };

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    // Fix: Use 'useContext' directly instead of the incorrect 'aistudiocanvas.useContext'.
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
