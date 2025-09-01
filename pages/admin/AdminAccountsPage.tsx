import React from 'react';
import { MOCK_SOCIAL_ACCOUNTS, MOCK_USERS, SOCIAL_ICONS } from '../../constants';
import { type SocialAccount } from '../../types';
import { RefreshCw, ShieldAlert, CheckCircle } from 'lucide-react';

const AccountRow: React.FC<{ account: SocialAccount }> = ({ account }) => {
    const user = MOCK_USERS.find(u => u.id === account.user_id);
    const Icon = SOCIAL_ICONS[account.provider];

    const statusIndicator = {
        connected: <span className="flex items-center gap-1.5 text-xs text-green-400"><CheckCircle size={14}/> Connected</span>,
        error: <span className="flex items-center gap-1.5 text-xs text-red-400"><ShieldAlert size={14}/> Token Invalid</span>,
        reconnecting: <span className="flex items-center gap-1.5 text-xs text-yellow-400"><RefreshCw size={14} className="animate-spin"/> Reconnecting</span>
    };

    return (
        <tr className="border-b border-gray-800 hover:bg-gray-800/50">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <div>
                        <p className="font-medium text-white">{account.username}</p>
                        <p className="text-sm text-gray-400">{account.provider}</p>
                    </div>
                </div>
            </td>
             <td className="p-4">
                {user ? (
                     <div className="flex items-center gap-3">
                         <img src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=1e293b&color=e0f3ff`} alt={user.name} className="w-9 h-9 rounded-full"/>
                         <div>
                            <p className="text-sm font-medium text-gray-200">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                         </div>
                     </div>
                ) : (
                    <span className="text-sm text-gray-500">Unknown User</span>
                )}
            </td>
            <td className="p-4">{statusIndicator[account.status || 'connected']}</td>
            <td className="p-4 text-sm text-gray-400">{account.followers.toLocaleString()}</td>
            <td className="p-4 text-right">
                <button className="px-3 py-1 text-xs font-medium text-blue-300 bg-blue-800/50 rounded-md hover:bg-blue-800 flex items-center gap-1.5">
                    <RefreshCw size={14}/> Refresh Token
                </button>
            </td>
        </tr>
    );
}

const AdminAccountsPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Connected Accounts</h1>
            
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-semibold">Account</th>
                            <th className="p-4 font-semibold">Owner</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Followers</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_SOCIAL_ACCOUNTS.map(account => (
                            <AccountRow key={account.id} account={account} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAccountsPage;