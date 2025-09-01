import React from 'react';
import { MOCK_USERS, SOCIAL_ICONS } from '../../constants';
import { type Post, type User, PostStatus } from '../../types';
import { PostContext } from '../../context/PostContext';
import { useNotification } from '../../context/NotificationContext';
import { Check, X } from 'lucide-react';

const PostRow: React.FC<{
    post: Post,
    user?: User,
    onApprove: (postId: number) => void,
    onBlock: (postId: number) => void
}> = ({ post, user, onApprove, onBlock }) => {
    const Icon = SOCIAL_ICONS[post.provider];
    const statusColor = {
        [PostStatus.NeedsApproval]: 'bg-blue-900 text-blue-300',
        [PostStatus.Pending]: 'bg-yellow-900 text-yellow-300',
        [PostStatus.Published]: 'bg-green-900 text-green-300',
        [PostStatus.Failed]: 'bg-red-900 text-red-300',
        [PostStatus.Blocked]: 'bg-gray-700 text-gray-400',
    };
    return (
        <tr className={`border-b border-gray-800 hover:bg-gray-800/50 ${post.status === PostStatus.Blocked ? 'opacity-50' : ''}`}>
            <td className="p-4">
                 <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="max-w-md">
                        <p className={`truncate text-sm font-medium ${post.status === PostStatus.Blocked ? 'text-gray-500 line-through' : 'text-white'}`}>{post.content}</p>
                         {post.mediaFile && <span className="text-xs text-brand-500">{post.mediaFile.name}</span>}
                    </div>
                </div>
            </td>
            <td className="p-4">
                {user && (
                     <div className="flex items-center gap-2">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=1e293b&color=e0f3ff`}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-gray-300">{user.name}</span>
                     </div>
                )}
            </td>
            <td className="p-4 text-sm text-gray-400">{new Date(post.scheduled_at).toLocaleString()}</td>
            <td className="p-4">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[post.status]}`}>
                    {post.status}
                </span>
            </td>
            <td className="p-4 text-right">
                {post.status === PostStatus.NeedsApproval ? (
                     <div className="flex justify-end gap-2">
                        <button onClick={() => onApprove(post.id)} className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-300 bg-green-800/50 rounded-md hover:bg-green-800">
                           <Check size={14} /> Approve
                        </button>
                        <button onClick={() => onBlock(post.id)} className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-400 bg-red-800/50 rounded-md hover:bg-red-800">
                           <X size={14} /> Block
                        </button>
                    </div>
                ) : (
                    <span className="text-xs text-gray-500 italic">No actions available</span>
                )}
            </td>
        </tr>
    );
};


const AdminPostsPage: React.FC = () => {
    const { posts, updatePostStatus } = React.useContext(PostContext);
    const { addNotification } = useNotification();
    
    const handleApprove = (postId: number) => {
        updatePostStatus(postId, PostStatus.Pending);
        addNotification('Post approved and is now pending publication.', 'success');
        // In a real app, you would also notify the post owner.
    };

    const handleBlock = (postId: number) => {
        updatePostStatus(postId, PostStatus.Blocked);
        addNotification('Post has been blocked and will not be published.', 'info');
         // In a real app, you would also notify the post owner.
    };

    return (
         <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Content Oversight</h1>
            
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-semibold">Content</th>
                            <th className="p-4 font-semibold">User</th>
                            <th className="p-4 font-semibold">Scheduled At</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length > 0 ? (
                            posts
                                .sort((a, b) => {
                                    // Sort by status first to bring 'Needs Approval' to the top
                                    if (a.status === PostStatus.NeedsApproval && b.status !== PostStatus.NeedsApproval) return -1;
                                    if (a.status !== PostStatus.NeedsApproval && b.status === PostStatus.NeedsApproval) return 1;
                                    return new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime();
                                })
                                .map(post => {
                                    const user = MOCK_USERS.find(u => u.id === post.user_id);
                                    return <PostRow 
                                        key={post.id} 
                                        post={post} 
                                        user={user} 
                                        onApprove={handleApprove}
                                        onBlock={handleBlock}
                                    />;
                                })
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center p-8 text-gray-500">No posts have been created on the platform yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPostsPage;