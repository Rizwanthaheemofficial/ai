
import React from 'react';
import { MOCK_SOCIAL_ACCOUNTS, SOCIAL_ICONS } from '../constants';
import { Users, MessageSquare, BarChart, ThumbsUp, PlusCircle } from 'lucide-react';
import { type SocialAccount, type Post } from '../types';
import { PostContext } from '../context/PostContext';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-gray-800 p-5 rounded-lg flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const AccountCard: React.FC<{ account: SocialAccount }> = ({ account }) => {
    const Icon = SOCIAL_ICONS[account.provider];
    return (
        <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
                <img src={account.avatarUrl} alt={account.username} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold text-white">{account.username}</p>
                    <p className="text-sm text-gray-400">{account.provider}</p>
                </div>
            </div>
            <div className="text-right">
                 <p className="font-semibold text-white">{account.followers.toLocaleString()}</p>
                 <p className="text-xs text-gray-500">Followers</p>
            </div>
        </div>
    );
}

const PostItem: React.FC<{ post: Post }> = ({ post }) => {
    const Icon = SOCIAL_ICONS[post.provider];
    return (
        <div className="flex items-start gap-4 p-4 hover:bg-gray-800 rounded-lg">
            <div className="text-gray-500 mt-1">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-300 truncate">{post.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                    Scheduled for {new Date(post.scheduled_at).toLocaleString()}
                </p>
            </div>
             <span className={`text-xs px-2 py-1 rounded-full ${post.status === 'Pending' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>
                {post.status}
            </span>
        </div>
    );
};


const DashboardPage: React.FC = () => {
    const { posts } = React.useContext(PostContext);
    const totalFollowers = MOCK_SOCIAL_ACCOUNTS.reduce((sum, acc) => sum + acc.followers, 0);
    const upcomingPosts = posts.filter(p => p.status === 'Pending').sort((a,b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Followers" value={totalFollowers.toLocaleString()} icon={<Users size={22} />} color="bg-blue-500/20 text-blue-400" />
                <StatCard title="Total Posts" value={posts.length.toString()} icon={<MessageSquare size={22} />} color="bg-green-500/20 text-green-400" />
                <StatCard title="Engagement Rate" value="2.7%" icon={<BarChart size={22} />} color="bg-purple-500/20 text-purple-400" />
                <StatCard title="Total Likes" value="12.k" icon={<ThumbsUp size={22} />} color="bg-red-500/20 text-red-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white">Connected Accounts</h2>
                        <button className="text-brand-500 hover:text-brand-400 text-sm font-medium flex items-center gap-1">
                            <PlusCircle size={16} /> Add New
                        </button>
                    </div>
                    <div className="space-y-4">
                        {MOCK_SOCIAL_ACCOUNTS.map(acc => <AccountCard key={acc.id} account={acc} />)}
                    </div>
                </div>

                <div className="lg:col-span-2">
                     <h2 className="text-xl font-semibold text-white mb-6">Upcoming Posts</h2>
                     <div className="bg-gray-800/50 rounded-lg">
                        <div className="space-y-2">
                           {upcomingPosts.length > 0 ? (
                                upcomingPosts.slice(0, 4).map(post => <PostItem key={post.id} post={post} />)
                           ) : (
                                <p className="p-4 text-center text-gray-500">No upcoming posts.</p>
                           )}
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;