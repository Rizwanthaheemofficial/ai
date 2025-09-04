
import React, { createContext, ReactNode, useContext } from 'react';
import { SocialAccount, SocialProvider } from '../types';
import { MOCK_SOCIAL_ACCOUNTS } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';
import { useNotification } from './NotificationContext';

interface AccountContextType {
    accounts: SocialAccount[];
    addAccount: (provider: SocialProvider, userId: number) => void;
    removeAccount: (accountId: number) => void;
}

export const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accounts, setAccounts] = useLocalStorage<SocialAccount[]>('orbit_accounts', MOCK_SOCIAL_ACCOUNTS);
    const { addNotification } = useNotification();

    const addAccount = (provider: SocialProvider, userId: number) => {
        // In a real app, this would involve an OAuth flow.
        // For this prototype, we'll add a mock account.
        addNotification(`Simulating connection to ${provider}...`, 'info');
        setTimeout(() => {
            const newAccount: SocialAccount = {
                id: Date.now(),
                user_id: userId,
                provider,
                username: `${provider.toLowerCase()}_user_${Math.floor(Math.random() * 1000)}`,
                avatarUrl: `https://picsum.photos/seed/${Date.now()}/40/40`,
                followers: Math.floor(Math.random() * 100000),
                status: 'connected',
            };
            setAccounts(prev => [...prev, newAccount]);
            addNotification(`${provider} connected successfully!`, 'success');
        }, 1500);
    };

    const removeAccount = (accountId: number) => {
        const accountToRemove = accounts.find(acc => acc.id === accountId);
        if (accountToRemove && window.confirm(`Are you sure you want to disconnect your ${accountToRemove.provider} account?`)) {
            setAccounts(prev => prev.filter(acc => acc.id !== accountId));
            addNotification(`${accountToRemove.provider} disconnected.`, 'info');
        }
    };

    return (
        <AccountContext.Provider value={{ accounts, addAccount, removeAccount }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccounts = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccounts must be used within an AccountProvider');
    }
    return context;
};
