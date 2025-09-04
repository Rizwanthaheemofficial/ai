
import React, { useState, useMemo } from 'react';
import { MOCK_USERS } from '../../constants';
import { type User } from '../../types';
import { Search, Edit, KeyRound } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const UserRow: React.FC<{ 
    user: User;
    onRoleChange: (userId: number, newRole: User['role']) => void;
    onAction: (msg: string, type?: 'success' | 'info' | 'error') => void;
}> = ({ user, onRoleChange, onAction }) => {
    
    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onRoleChange(user.id, e.target.value as User['role']);
    };

    return (
        <tr className="border-b border-gray-800 hover:bg-gray-800/50">
            <td className="p-4">
                <div className="flex items-center gap-3">
                     <img 
                        src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=1e293b&color=e0f3ff`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="p-4">
                 <select 
                    value={user.role} 
                    onChange={handleRoleChange}
                    className="bg-gray-700 border-gray-600 rounded-md p-1.5 text-xs text-white focus:ring-brand-500 focus:border-brand-500 capitalize"
                 >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                 </select>
            </td>
            <td className="p-4 text-sm text-gray-400">2024-07-25</td>
            <td className="p-4 text-right space-x-2">
                <button onClick={() => onAction(`Editing user: ${user.name}`)} className="p-2 text-gray-400 hover:text-white"><Edit size={16}/></button>
                <button onClick={() => onAction(`Password reset link sent to ${user.email}`, 'success')} className="p-2 text-gray-400 hover:text-white"><KeyRound size={16}/></button>
                <button onClick={() => onAction(`Suspended user: ${user.name}`)} className="px-3 py-1 text-xs font-medium text-yellow-300 bg-yellow-800/50 rounded-md hover:bg-yellow-800">Suspend</button>
            </td>
        </tr>
    );
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useLocalStorage<User[]>('orbit_users', MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const { addNotification } = useNotification();

    const filteredUsers = useMemo(() => {
        return users
            .filter(user => {
                if (roleFilter !== 'all' && user.role !== roleFilter) {
                    return false;
                }
                if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return false;
                }
                return true;
            });
    }, [searchTerm, roleFilter, users]);

    const handleAction = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
        addNotification(message, type);
    };

    const handleRoleChange = (userId: number, newRole: User['role']) => {
        setUsers(currentUsers => currentUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
        const user = users.find(u => u.id === userId);
        if (user) {
            addNotification(`${user.name}'s role updated to ${newRole}.`, 'success');
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            
            <div className="flex gap-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 border-gray-600 rounded-md pl-10 pr-4 py-2 text-white" 
                    />
                </div>
                <select 
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
                >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-semibold">User</th>
                            <th className="p-4 font-semibold">Role</th>
                            <th className="p-4 font-semibold">Joined Date</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <UserRow key={user.id} user={user} onRoleChange={handleRoleChange} onAction={handleAction} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;
