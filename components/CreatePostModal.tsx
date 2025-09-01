
import React, { useState, useRef } from 'react';
import { X, Calendar, Image as ImageIcon, Paperclip, XCircle } from 'lucide-react';
import { SocialProvider } from '../types';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreatePost: (content: string, platform: string, scheduledAt: Date | null, mediaFile: File | null) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onCreatePost }) => {
    const [content, setContent] = useState('');
    const [platform, setPlatform] = useState<string>(SocialProvider.Twitter);
    const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const resetState = () => {
        setContent('');
        setPlatform(SocialProvider.Twitter);
        setScheduledAt(null);
        setMediaFile(null);
        setMediaPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handleClose = () => {
        resetState();
        onClose();
    };
    
    const handleSubmit = () => {
        if (!content || !platform) {
            alert('Please add some content for your post.');
            return;
        }
        onCreatePost(content, platform, scheduledAt, mediaFile);
        handleClose();
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setScheduledAt(new Date(e.target.value));
        } else {
            setScheduledAt(null);
        }
    }
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setMediaPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setMediaPreview(null); // No preview for non-image files
            }
        }
    };

    const handleRemoveMedia = () => {
        setMediaFile(null);
        setMediaPreview(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity" onClick={handleClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Create a new post</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="platform" className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                            <select
                                id="platform"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                            >
                                {Object.values(SocialProvider).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                            <textarea
                                id="content"
                                rows={6}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                                placeholder="What's on your mind?"
                            ></textarea>
                             {mediaPreview && (
                                <div className="mt-4 relative w-40 h-40">
                                    <img src={mediaPreview} alt="Media preview" className="rounded-lg object-cover w-full h-full" />
                                    <button onClick={handleRemoveMedia} className="absolute -top-2 -right-2 bg-gray-900 rounded-full text-red-400 hover:text-red-300">
                                        <XCircle size={24} />
                                    </button>
                                </div>
                            )}
                             {mediaFile && !mediaPreview && (
                                <div className="mt-4 flex items-center gap-3 bg-gray-700 p-3 rounded-lg relative">
                                    <Paperclip className="w-6 h-6 text-gray-400" />
                                    <div className="text-sm">
                                        <p className="font-medium text-white">{mediaFile.name}</p>
                                        <p className="text-gray-400">{(mediaFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button onClick={handleRemoveMedia} className="absolute top-1 right-1 text-red-400 hover:text-red-300">
                                        <XCircle size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="media-upload" accept="image/*,video/*" />
                                <label htmlFor="media-upload" className="cursor-pointer text-gray-400 hover:text-brand-400 flex items-center gap-2">
                                    <ImageIcon size={20} /> Add Image/Video
                                </label>
                                <div className="relative flex items-center gap-2 text-gray-400 hover:text-brand-400">
                                    <Calendar size={20} />
                                    <label htmlFor="schedule-date" className="cursor-pointer">Schedule</label>
                                    <input 
                                        type="datetime-local" 
                                        id="schedule-date"
                                        className="absolute left-0 opacity-0 w-full h-full cursor-pointer"
                                        onChange={handleDateChange}
                                        />
                                </div>
                            </div>
                            {scheduledAt && <span className="text-xs text-gray-400">{scheduledAt.toLocaleString()}</span>}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-700 rounded-md hover:bg-brand-600"
                    >
                        {scheduledAt ? 'Schedule Post' : 'Post Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
