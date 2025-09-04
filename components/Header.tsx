import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import { Bell, PlusCircle, Settings, LogOut } from 'lucide-react';
import CreatePostModal from './CreatePostModal';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { PostContext } from '../context/PostContext';
import { SocialProvider } from '../types';
import { SettingsContext } from '../context/SettingsContext';

const Header: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { addPost } = useContext(PostContext);
    const { plans } = useContext(SettingsContext);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { addNotification } = useNotification();

    const userPlanName = useMemo(() => {
        if (!user || !plans) return 'User';
        const plan = plans.find(p => p.id === user.planId);
        return plan ? plan.name : 'User';
    }, [user, plans]);


    const handleCreatePost = (content: string, platform: string, scheduledAt: Date | null, mediaFile: File | null) => {
        if (!user) return; // Should not happen if button is visible

        addPost({
            content,
            provider: platform as SocialProvider,
            scheduledAt: scheduledAt ?? new Date(),
            mediaFile: mediaFile,
            userId: user.id
        });
        
        const message = scheduledAt ? `Post for ${platform} has been scheduled!` : `Post for ${platform} published!`;
        addNotification(message, 'success');
        setIsModalOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null; // Don't render header if not logged in

    return (
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center">
                 {/* Search bar can be implemented here if needed */}
            </div>
            <div className="flex items-center gap-4">
                {user.role === 'user' && (
                     <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-600 transition-colors"
                    >
                        <PlusCircle size={18} />
                        Create Post
                    </button>
                )}
                <button className="text-gray-400 hover:text-white">
                    <Bell size={20} />
                </button>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3">
                        <img
                            className="h-9 w-9 rounded-full object-cover"
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=1f53b0&color=f0faff`}
                            alt="User avatar"
                        />
                        <div>
                            <p className="text-sm font-medium text-white text-left">{user.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user.role === 'admin' ? 'Administrator' : `${userPlanName} Plan`}</p>
                        </div>
                    </button>
                    {isDropdownOpen && (
                         <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                             {user.role === 'user' && (
                                <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                    <Settings size={16} />
                                    Settings
                                </Link>
                             )}
                             <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                                 <LogOut size={16} />
                                 Logout
                             </button>
                         </div>
                    )}
                </div>
            </div>
            <CreatePostModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onCreatePost={handleCreatePost}
            />
        </header>
    );
};

export default Header;