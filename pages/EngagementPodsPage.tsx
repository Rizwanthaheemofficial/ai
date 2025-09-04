
import React, { useState, useMemo, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MOCK_PODS, MOCK_POD_MEMBERS, MOCK_POD_POSTS, SOCIAL_ICONS } from '../constants';
import { type Pod, PodMember, PodPost } from '../types';
import { Users, Search, PlusCircle, ArrowLeft, ThumbsUp, MessageSquare, Award, Star } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { SettingsContext } from '../context/SettingsContext';

// --- Reusable Components ---

const PodCard: React.FC<{ pod: Pod, onJoin: (pod: Pod) => void }> = ({ pod, onJoin }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col">
        <img src={pod.imageUrl} alt={pod.name} className="w-full h-32 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <span className="text-xs bg-brand-900 text-brand-300 font-semibold px-2 py-1 rounded-full self-start">{pod.niche}</span>
            <h3 className="font-bold text-white mt-2 text-lg">{pod.name}</h3>
            <p className="text-sm text-gray-400 mt-1 flex-grow">{pod.description}</p>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users size={16} />
                    <span>{pod.memberCount} members</span>
                </div>
                <button onClick={() => onJoin(pod)} className="bg-brand-700 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-brand-600">
                    Join
                </button>
            </div>
        </div>
    </div>
);

const CreatePodModal: React.FC<{ isOpen: boolean, onClose: () => void, onCreate: (pod: Pod) => void }> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [niche, setNiche] = useState('General');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!name || !description) return;
        onCreate({
            id: Date.now().toString(),
            name,
            description,
            niche,
            memberCount: 1,
            imageUrl: `https://picsum.photos/seed/newpod${Date.now()}/400/200`
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Create a New Pod</h2>
                </div>
                <div className="p-6 space-y-4">
                    <input type="text" placeholder="Pod Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md text-white" />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md text-white h-24" />
                    <input type="text" placeholder="Niche (e.g., SaaS, Fashion)" value={niche} onChange={e => setNiche(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md text-white" />
                </div>
                <div className="bg-gray-900 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded-md">Cancel</button>
                    <button onClick={handleSubmit} className="bg-brand-600 px-4 py-2 rounded-md">Create Pod</button>
                </div>
            </div>
        </div>
    );
};

const PodDetailView: React.FC<{ pod: Pod, onBack: () => void }> = ({ pod, onBack }) => {
    const { addNotification } = useNotification();
    const [members, setMembers] = useLocalStorage<PodMember[]>(`orbit_pod_${pod.id}_members`, MOCK_POD_MEMBERS);
    const [posts, setPosts] = useLocalStorage<PodPost[]>(`orbit_pod_${pod.id}_posts`, MOCK_POD_POSTS);

    const handleEngage = (postId: string, type: 'like' | 'comment') => {
        // Simulate engagement
        setPosts(currentPosts => currentPosts.filter(p => p.id !== postId));
        
        // Add points to the current user (mocked as the first user)
        setMembers(prevMembers => prevMembers.map((m, i) => i === 0 ? {...m, contributionScore: m.contributionScore + (type === 'like' ? 1 : 3)} : m));

        addNotification(`You ${type}d the post! +${type === 'like' ? 1 : 3} points`, 'success');
    };

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 font-semibold text-brand-400 hover:text-brand-300">
                <ArrowLeft size={16} /> Back to All Pods
            </button>
            <div className="flex gap-6 items-start">
                <img src={pod.imageUrl} alt={pod.name} className="w-48 h-32 object-cover rounded-lg"/>
                <div>
                    <h1 className="text-3xl font-bold text-white">{pod.name}</h1>
                    <p className="text-gray-400 mt-1">{pod.description}</p>
                    <span className="text-xs bg-brand-900 text-brand-300 font-semibold px-2 py-1 rounded-full mt-2 inline-block">{pod.niche}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Engagement Feed */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold text-white">Posts to Engage With</h2>
                    {posts.length > 0 ? posts.map(post => {
                        const Icon = SOCIAL_ICONS[post.platform];
                        return (
                            <div key={post.id} className="bg-gray-800 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-white">{post.authorName}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Icon className="w-3 h-3" /> on {post.platform}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 my-3">{post.content}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEngage(post.id, 'like')} className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 text-blue-300 py-2 rounded-md hover:bg-blue-500/30">
                                        <ThumbsUp size={16} /> Like
                                    </button>
                                     <button onClick={() => handleEngage(post.id, 'comment')} className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 text-green-300 py-2 rounded-md hover:bg-green-500/30">
                                        <MessageSquare size={16} /> Comment
                                    </button>
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="text-center p-8 bg-gray-800 rounded-lg">
                            <p className="text-gray-500">No posts currently need engagement. Great job!</p>
                        </div>
                    )}
                </div>

                {/* Leaderboard */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Award size={20} /> Leaderboard</h2>
                    <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                        {members.sort((a,b) => b.contributionScore - a.contributionScore).map((member, index) => (
                            <div key={member.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold w-6 text-center">{index + 1}</span>
                                    <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full" />
                                    <span className="text-sm text-gray-300">{member.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-400">
                                    <Star size={14} fill="currentColor" />
                                    {member.contributionScore}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Page Component ---

const EngagementPodsPage: React.FC = () => {
    const { systemSettings } = useContext(SettingsContext);
    const [pods, setPods] = useLocalStorage<Pod[]>('orbit_pods', MOCK_PODS);
    const [myPods, setMyPods] = useLocalStorage<string[]>('orbit_my_pods', ['1']); // User has joined pod with id '1'
    const [selectedPod, setSelectedPod] = useState<Pod | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { addNotification } = useNotification();

    if (!systemSettings.featureFlags?.engagementPods) {
        return <Navigate to="/dashboard" replace />;
    }
    
    const discoverPods = useMemo(() => pods.filter(p => !myPods.includes(p.id)), [pods, myPods]);
    const joinedPods = useMemo(() => pods.filter(p => myPods.includes(p.id)), [pods, myPods]);
    
    const handleJoinPod = (pod: Pod) => {
        setMyPods(prev => [...prev, pod.id]);
        addNotification(`You have successfully joined the "${pod.name}" pod!`, 'success');
    };
    
    const handleCreatePod = (newPod: Pod) => {
        setPods(prev => [newPod, ...prev]);
        setMyPods(prev => [newPod.id, ...prev]);
        addNotification(`Pod "${newPod.name}" created successfully!`, 'success');
    };
    
    if (selectedPod) {
        return <PodDetailView pod={selectedPod} onBack={() => setSelectedPod(null)} />;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Smart Engagement Pods</h1>
                    <p className="text-gray-400 mt-1">Boost your reach by exchanging engagement with other real users in your niche.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-600">
                    <PlusCircle size={18} /> Create Pod
                </button>
            </div>
            
            {joinedPods.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">My Pods</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {joinedPods.map(pod => (
                             <div key={pod.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col">
                                <img src={pod.imageUrl} alt={pod.name} className="w-full h-32 object-cover" />
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-bold text-white text-lg">{pod.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                                        <Users size={16} />
                                        <span>{pod.memberCount} members</span>
                                    </div>
                                    <button onClick={() => setSelectedPod(pod)} className="w-full mt-4 bg-gray-700 text-white py-2 rounded-md font-semibold hover:bg-gray-600">
                                        Enter Pod
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div>
                 <h2 className="text-xl font-semibold text-white mb-4">Discover Pods</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {discoverPods.map(pod => (
                        <PodCard key={pod.id} pod={pod} onJoin={handleJoinPod} />
                    ))}
                </div>
            </div>

            <CreatePodModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreatePod}
            />
        </div>
    );
};

export default EngagementPodsPage;
