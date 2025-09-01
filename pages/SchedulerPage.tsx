import React from 'react';
import { SOCIAL_ICONS } from '../constants';
import { type Post } from '../types';
import { PostContext } from '../context/PostContext';

const CalendarDay: React.FC<{ day: number; posts: Post[] }> = ({ day, posts }) => (
    <div className="border border-gray-700 h-28 p-2 flex flex-col">
        <span className="text-sm font-medium self-end">{day}</span>
        <div className="flex-1 overflow-y-auto space-y-1 mt-1">
            {posts.map(post => {
                 const Icon = SOCIAL_ICONS[post.provider];
                 return (
                     <div key={post.id} className="text-xs p-1 rounded-sm bg-brand-900/50 flex items-center gap-1 truncate">
                        <Icon className="w-3 h-3 text-brand-400 flex-shrink-0" />
                        <span className="truncate">{post.content}</span>
                     </div>
                 );
            })}
        </div>
    </div>
);

const PostRow: React.FC<{post: Post}> = ({ post }) => {
    const Icon = SOCIAL_ICONS[post.provider];
    const statusColor = {
        'Needs Approval': 'bg-blue-900 text-blue-300',
        Pending: 'bg-yellow-900 text-yellow-300',
        Published: 'bg-green-900 text-green-300',
        Failed: 'bg-red-900 text-red-300',
        Blocked: 'bg-gray-700 text-gray-400 line-through'
    };
    return (
        <tr className="border-b border-gray-800 hover:bg-gray-800">
            <td className="p-4 flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-400" />
                <div className="max-w-md">
                   <p className="truncate text-sm font-medium text-white">{post.content}</p>
                   {post.mediaFile && <span className="text-xs text-brand-500">{post.mediaFile.name}</span>}
                </div>
            </td>
            <td className="p-4 text-sm text-gray-400">{new Date(post.scheduled_at).toLocaleString()}</td>
            <td className="p-4">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[post.status]}`}>
                    {post.status}
                </span>
            </td>
            <td className="p-4 text-right">
                <button className="text-gray-400 hover:text-white text-sm">Edit</button>
            </td>
        </tr>
    );
};

const SchedulerPage: React.FC = () => {
    const { posts } = React.useContext(PostContext);
    
    // This is a dummy implementation of a calendar.
    // A real app would use a library like react-big-calendar or build a more robust component.
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    const getPostsForDay = (day: number) => {
        const today = new Date();
        return posts.filter(p => {
            const postDate = new Date(p.scheduled_at);
            return postDate.getMonth() === today.getMonth() && postDate.getFullYear() === today.getFullYear() && postDate.getDate() === day;
        });
    }
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Scheduler</h1>
                 {/* The Create Post button is in the header */}
            </div>

            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Calendar View (Current Month)</h2>
                <div className="grid grid-cols-7 bg-gray-900 rounded-lg border border-gray-700">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="p-2 text-center text-xs font-bold text-gray-400 border-b border-r border-gray-700">{d}</div>
                    ))}
                    {daysInMonth.map(day => <CalendarDay key={day} day={day} posts={getPostsForDay(day)} />)}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-white mb-4">All Posts</h2>
                <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800 text-xs text-gray-400 uppercase">
                            <tr>
                                <th className="p-4 font-semibold">Content</th>
                                <th className="p-4 font-semibold">Scheduled At</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.length > 0 ? (
                                posts.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()).map(post => (
                                    <PostRow key={post.id} post={post} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-gray-500">You haven't scheduled any posts yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SchedulerPage;