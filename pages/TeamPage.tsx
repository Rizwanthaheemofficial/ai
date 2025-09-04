import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: 'Owner' | 'Admin' | 'Member';
}

const TeamPage: React.FC = () => {
    const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('orbit_team_members', [
        { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Owner' },
        { id: 2, name: 'John Smith', email: 'john.smith@example.com', role: 'Admin' },
        { id: 3, name: 'Emily White', email: 'emily.white@example.com', role: 'Member' },
    ]);

    const handleRemoveMember = (memberId: number) => {
        const memberToRemove = teamMembers.find(m => m.id === memberId);
        if (memberToRemove?.role === 'Owner') {
            alert("The team owner cannot be removed.");
            return;
        }
        if (window.confirm(`Are you sure you want to remove ${memberToRemove?.name}?`)) {
            setTeamMembers(prev => prev.filter(m => m.id !== memberId));
        }
    };

    const handleRoleChange = (memberId: number, newRole: TeamMember['role']) => {
        setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    };


    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Team Management</h1>
                    <p className="text-gray-400 mt-1">Manage your team members and their permissions.</p>
                </div>
                <button className="flex items-center gap-2 bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-600">
                    <PlusCircle size={18} /> Invite New Member
                </button>
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-semibold">User</th>
                            <th className="p-4 font-semibold">Role</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.map(member => (
                             <tr key={member.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="p-4">
                                     <div className="flex items-center gap-3">
                                         <img 
                                            src={`https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=1e293b&color=e0f3ff`}
                                            alt={member.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="font-medium text-white">{member.name}</p>
                                            <p className="text-sm text-gray-400">{member.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                     <select 
                                        value={member.role}
                                        onChange={(e) => handleRoleChange(member.id, e.target.value as TeamMember['role'])}
                                        disabled={member.role === 'Owner'}
                                        className="bg-gray-700 border-gray-600 rounded-md p-1.5 text-xs text-white focus:ring-brand-500 focus:border-brand-500 capitalize disabled:opacity-70 disabled:cursor-not-allowed"
                                     >
                                        <option>Owner</option>
                                        <option>Admin</option>
                                        <option>Member</option>
                                     </select>
                                </td>
                                <td className="p-4 text-right">
                                    {member.role !== 'Owner' && (
                                        <button 
                                            onClick={() => handleRemoveMember(member.id)}
                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-800/50 rounded-full"
                                            aria-label={`Remove ${member.name}`}
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    )}
                                </td>
                             </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamPage;