
import React, { useState, useMemo, useContext } from 'react';
import { Users, FileText, DollarSign, Sparkles, Send, MessageSquare, UserPlus, FileUp, TrendingUp, PenSquare, BotMessageSquare } from 'lucide-react';
import { MOCK_USERS, MOCK_MONTHLY_GROWTH_DATA } from '../../constants';
import { useNotification } from '../../context/NotificationContext';
import { PostContext } from '../../context/PostContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { ActivityItem, AiActivityData, MonthlyGrowthData, PostCount, SocialProvider, User } from '../../types';
import { useActivity } from '../../context/ActivityContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-gray-800 p-6 rounded-lg flex items-center shadow-lg">
        <div className={`p-4 rounded-full mr-5 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400 font-medium">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const ActivityIcon: React.FC<{type: ActivityItem['type']}> = ({ type }) => {
    switch (type) {
        case 'signup': return <UserPlus className="w-5 h-5 text-green-400" />;
        case 'post': return <FileUp className="w-5 h-5 text-blue-400" />;
        case 'comment': return <MessageSquare className="w-5 h-5 text-purple-400" />;
        default: return null;
    }
};

const AdminDashboardPage: React.FC = () => {
    const { addNotification } = useNotification();
    const { posts } = useContext(PostContext);
    const { recentActivity, apiLogs } = useActivity();
    const [users] = useLocalStorage<User[]>('orbit_users', MOCK_USERS);
    const [monthlyGrowthData] = useLocalStorage<MonthlyGrowthData[]>('orbit_monthly_growth', MOCK_MONTHLY_GROWTH_DATA);
    const [announcement, setAnnouncement] = useState('');

    const handleSendAnnouncement = () => {
        if (!announcement.trim()) {
            addNotification('Announcement message cannot be empty.', 'error');
            return;
        }
        addNotification(`Announcement sent: "${announcement}"`, 'success');
        setAnnouncement('');
    };
    
    const postsByPlatform: PostCount[] = useMemo(() => {
        const counts = posts.reduce((acc, post) => {
            acc[post.provider] = (acc[post.provider] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.values(SocialProvider).map(platform => ({
            platform,
            count: counts[platform] || 0,
        }));
    }, [posts]);

    const aiActivityData: AiActivityData[] = useMemo(() => {
        const counts = apiLogs.reduce((acc, log) => {
            if (log.status === 'Success') {
                acc[log.tool] = (acc[log.tool] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const toolDetails: Record<string, { name: string, icon: React.ReactNode }> = {
            'Caption': { name: 'Captions Generated', icon: <BotMessageSquare className="w-5 h-5 text-purple-400" /> },
            'Caption Rewriter': { name: 'Captions Rewritten', icon: <PenSquare className="w-5 h-5 text-blue-400" /> },
            'Trend Radar': { name: 'Trends Analyzed', icon: <TrendingUp className="w-5 h-5 text-green-400" /> },
            'Proposal Generator': { name: 'Proposals Created', icon: <FileText className="w-5 h-5 text-yellow-400" /> },
        };
        
        return Object.entries(toolDetails).map(([key, details]) => ({
            tool: details.name,
            count: counts[key] || 0,
            icon: details.icon,
        }));
    }, [apiLogs]);

    const totalAiUsage = aiActivityData.reduce((sum, item) => sum + item.count, 0);
    const totalRevenue = monthlyGrowthData.reduce((sum, item) => sum + item.revenue, 0);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`$${totalRevenue.toLocaleString()}`}
                    icon={<DollarSign size={24} />} 
                    color="bg-green-500/20 text-green-300" 
                />
                <StatCard 
                    title="Total Users" 
                    value={users.length.toString()} 
                    icon={<Users size={24} />} 
                    color="bg-blue-500/20 text-blue-300" 
                />
                <StatCard 
                    title="Total Posts" 
                    value={posts.length.toString()} 
                    icon={<FileText size={24} />} 
                    color="bg-purple-500/20 text-purple-300" 
                />
                <StatCard 
                    title="AI Tools Usage" 
                    value={totalAiUsage.toLocaleString()} 
                    icon={<Sparkles size={24} />} 
                    color="bg-yellow-500/20 text-yellow-300" 
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg h-96 flex flex-col">
                    <h2 className="text-xl font-semibold text-white mb-4">Monthly Growth (MRR)</h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} unit="$" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} 
                                labelStyle={{ color: '#e2e8f0' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#4ade80" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg h-96 flex flex-col">
                    <h2 className="text-xl font-semibold text-white mb-4">AI Activity</h2>
                    <ul className="space-y-4 flex-1">
                        {aiActivityData.map(activity => (
                             <li key={activity.tool} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-md">
                                 <div className="flex items-center gap-3">
                                    {activity.icon}
                                    <p className="text-sm text-gray-300">{activity.tool}</p>
                                 </div>
                                <p className="font-bold text-white">{activity.count.toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg h-96 flex flex-col">
                    <h2 className="text-xl font-semibold text-white mb-4">Posts by Platform</h2>
                    <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={postsByPlatform} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="platform" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} 
                                labelStyle={{ color: '#e2e8f0' }}
                                cursor={{ fill: 'rgba(71, 85, 105, 0.2)' }}
                            />
                            <Bar dataKey="count" fill="#4291ff" name="Posts" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg h-96 flex flex-col">
                    <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                    <div className="flex-1 overflow-y-auto pr-2">
                        <ul className="space-y-4">
                            {recentActivity.map(activity => (
                                 <li key={activity.id} className="flex items-center gap-4">
                                    <div className="bg-gray-900/50 p-2 rounded-full">
                                        <ActivityIcon type={activity.type} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">{activity.description}</p>
                                        <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">System Announcement</h2>
                <div className="space-y-4">
                    <textarea
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        rows={3}
                        placeholder="Announce a new feature or maintenance window..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                    ></textarea>
                    <button
                        onClick={handleSendAnnouncement}
                        className="w-full flex items-center justify-center gap-2 bg-brand-700 text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-brand-600 transition-colors"
                    >
                        <Send size={16} /> Send to All Users
                    </button>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboardPage;
