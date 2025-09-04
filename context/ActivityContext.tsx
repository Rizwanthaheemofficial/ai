
import React, { createContext, ReactNode, useContext, useCallback } from 'react';
import { ActivityItem, ApiLog } from '../types';
import { MOCK_RECENT_ACTIVITY, MOCK_API_LOGS } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';

interface ActivityContextType {
    recentActivity: ActivityItem[];
    apiLogs: ApiLog[];
    addActivity: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
    addApiLog: (item: Omit<ApiLog, 'id' | 'timestamp'>) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [recentActivity, setRecentActivity] = useLocalStorage<ActivityItem[]>('orbit_activity', MOCK_RECENT_ACTIVITY);
    const [apiLogs, setApiLogs] = useLocalStorage<ApiLog[]>('orbit_api_logs', MOCK_API_LOGS);

    const addActivity = useCallback((item: Omit<ActivityItem, 'id' | 'timestamp'>) => {
        const newActivity: ActivityItem = {
            ...item,
            id: Date.now(),
            timestamp: new Date().toISOString(),
        };
        setRecentActivity(prev => [newActivity, ...prev].slice(0, 20)); // Keep last 20 activities
    }, [setRecentActivity]);
    
    const addApiLog = useCallback((item: Omit<ApiLog, 'id' | 'timestamp'>) => {
        const newLog: ApiLog = {
            ...item,
            id: Date.now(),
            timestamp: new Date().toISOString(),
        };
        setApiLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
    }, [setApiLogs]);

    return (
        <ActivityContext.Provider value={{ recentActivity, apiLogs, addActivity, addApiLog }}>
            {children}
        </ActivityContext.Provider>
    );
};

export const useActivity = () => {
    const context = useContext(ActivityContext);
    if (!context) {
        throw new Error('useActivity must be used within an ActivityProvider');
    }
    return context;
};
