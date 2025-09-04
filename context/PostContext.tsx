
import React, { createContext, useEffect, ReactNode } from 'react';
import { Post, PostStatus, SocialProvider } from '../types';
import { MOCK_SCHEDULED_POSTS } from '../constants';
import { useNotification } from './NotificationContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { useActivity } from './ActivityContext';

interface PostContextType {
    posts: Post[];
    addPost: (newPostData: { content: string, provider: SocialProvider, scheduledAt: Date, mediaFile: File | null, userId: number }) => void;
    updatePostStatus: (postId: number, newStatus: PostStatus) => void;
}

export const PostContext = createContext<PostContextType>({
    posts: [],
    addPost: () => {},
    updatePostStatus: () => {},
});

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useLocalStorage<Post[]>('orbit_posts', MOCK_SCHEDULED_POSTS);
    const { addNotification } = useNotification();
    const { addActivity } = useActivity();

    const addPost = (newPostData: { content: string, provider: SocialProvider, scheduledAt: Date, mediaFile: File | null, userId: number }) => {
        const newPost: Post = {
            id: Date.now(),
            user_id: newPostData.userId,
            content: newPostData.content,
            provider: newPostData.provider,
            scheduled_at: newPostData.scheduledAt.toISOString(),
            status: PostStatus.NeedsApproval, // New posts now require approval
            mediaFile: newPostData.mediaFile || undefined,
        };
        setPosts(prevPosts => [...prevPosts, newPost]);
    };

    const updatePostStatus = (postId: number, newStatus: PostStatus) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, status: newStatus } : post
            )
        );
    };

    // Simulate a cron job to publish scheduled posts
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            let postsUpdated = false;

            setPosts(currentPosts => {
                const updatedPosts = currentPosts.map(post => {
                    if (post.status === PostStatus.Pending && new Date(post.scheduled_at) <= now) {
                        postsUpdated = true;
                        // In a real app, you would notify based on the user ID of the post owner
                        addNotification(`A post for ${post.provider} has been published!`, 'success');
                        
                        addActivity({
                            type: 'post',
                            description: `A post was published to ${post.provider}.`
                        });

                        return { ...post, status: PostStatus.Published };
                    }
                    return post;
                });

                // Only update state if a post's status actually changed
                if (postsUpdated) {
                    return updatedPosts;
                }
                return currentPosts;
            });

        }, 15000); // Check every 15 seconds for demonstration

        return () => clearInterval(interval);
    }, [addNotification, setPosts, addActivity]);

    return (
        <PostContext.Provider value={{ posts, addPost, updatePostStatus }}>
            {children}
        </PostContext.Provider>
    );
};
