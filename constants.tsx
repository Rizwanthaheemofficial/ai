
import React from 'react';
import { SocialProvider, PostStatus, type User, type SocialAccount, type Post, type Plan, type AnalyticsData, type Message, type SentimentData, type MarketplaceItem, type ApiLog, type PostCount, type ActivityItem, MonthlyGrowthData, AiActivityData, Pod, PodMember, PodPost, AiTokenUsage, SupportTicket } from './types';
import { LayoutDashboard, CalendarClock, BarChart3, Wrench, Settings, Rocket, BotMessageSquare, Share2, Palette, TrendingUp, Lightbulb, Users, Package, FileText, Inbox, LineChart, Store, Link2, Terminal, Sparkles, PenSquare, LifeBuoy, Search, BarChart2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const USER_NAV_LINKS = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Inbox', href: '/inbox', icon: <Inbox size={20} /> },
    { name: 'Scheduler', href: '/scheduler', icon: <CalendarClock size={20} /> },
    { name: 'Analytics', href: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Pods', href: '/pods', icon: <Users size={20} /> },
    { name: 'Growth', href: '/growth', icon: <LineChart size={20} /> },
    { name: 'Tools', href: '/tools', icon: <Wrench size={20} /> },
    { name: 'Marketplace', href: '/marketplace', icon: <Store size={20} /> },
    { name: 'Team', href: '/team', icon: <Users size={20} /> },
    { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
];

export const ADMIN_NAV_LINKS = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', href: '/admin/users', icon: <Users size={20} /> },
    { name: 'Plans', href: '/admin/plans', icon: <Package size={20} /> },
    { name: 'Posts', href: '/admin/posts', icon: <FileText size={20} /> },
    { name: 'Support', href: '/admin/support', icon: <LifeBuoy size={20} /> },
    { name: 'Accounts', href: '/admin/accounts', icon: <Link2 size={20} /> },
    { name: 'API Usage', href: '/admin/usage', icon: <Terminal size={20} /> },
    { name: 'AI Control', href: '/admin/ai-control', icon: <Sparkles size={20} /> },
    { name: 'Manage Tools', href: '/admin/tools', icon: <Wrench size={20} /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
];


export const MOCK_USERS: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@orbit.io', role: 'admin', planId: 'agency' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', role: 'user', planId: 'business'},
    { id: 3, name: 'John Smith', email: 'john.smith@example.com', role: 'user', planId: 'creator'},
    { id: 4, name: 'Emily White', email: 'emily.white@example.com', role: 'moderator', planId: 'creator'},
    { id: 5, name: 'Free User', email: 'free.user@example.com', role: 'user', planId: 'free' },
];

export const MOCK_SOCIAL_ACCOUNTS: SocialAccount[] = [
    { id: 1, user_id: 2, provider: SocialProvider.Facebook, username: 'fb_business_page', avatarUrl: 'https://picsum.photos/seed/fb/40/40', followers: 12503, status: 'connected' },
    { id: 2, user_id: 2, provider: SocialProvider.Instagram, username: '@insta_shop', avatarUrl: 'https://picsum.photos/seed/ig/40/40', followers: 89345, status: 'connected' },
    { id: 3, user_id: 3, provider: SocialProvider.Twitter, username: '@tweet_co', avatarUrl: 'https://picsum.photos/seed/tw/40/40', followers: 2310, status: 'error' },
    { id: 4, user_id: 4, provider: SocialProvider.LinkedIn, username: 'linkedin-company', avatarUrl: 'https://picsum.photos/seed/li/40/40', followers: 4567, status: 'connected' },
    { id: 5, user_id: 3, provider: SocialProvider.TikTok, username: '@tiktokfun', avatarUrl: 'https://picsum.photos/seed/tt/40/40', followers: 150234, status: 'connected' },
];

export const MOCK_SCHEDULED_POSTS: Post[] = [
    { id: 1, user_id: 2, provider: SocialProvider.Instagram, content: 'Exciting new product launch next week! Stay tuned for more details. #productlaunch #newrelease', media_url: 'https://picsum.photos/seed/post1/400/300', scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), status: PostStatus.NeedsApproval },
    { id: 2, user_id: 3, provider: SocialProvider.Facebook, content: 'Our team had a great time at the conference. Thanks to everyone who stopped by our booth!', scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), status: PostStatus.NeedsApproval },
    { id: 3, user_id: 2, provider: SocialProvider.Twitter, content: 'Quick tip: Use Orbit to schedule your posts and save hours every week! #socialmediamarketing', scheduled_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), status: PostStatus.NeedsApproval },
    { id: 4, user_id: 4, provider: SocialProvider.LinkedIn, content: 'We are hiring! Looking for a talented frontend developer to join our growing team. Apply here: [link]', media_url: 'https://picsum.photos/seed/post4/400/200', scheduled_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: PostStatus.Published },
];

export const MOCK_PLANS: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['1 Social Account', '10 Posts/Month', 'Basic Analytics', 'AI Caption Generator'],
        isPopular: false,
    },
    {
        id: 'creator',
        name: 'Creator',
        price: 29,
        features: [
            '5 Social Accounts',
            'Unlimited Posts',
            'Full Analytics Suite',
            'All AI Content Tools',
            'Brand Voice Trainer',
            'Social SEO Analyzer',
        ],
        isPopular: true,
    },
    {
        id: 'business',
        name: 'Business',
        price: 79,
        features: [
            '10 Social Accounts',
            'Team Collaboration (3 Users)',
            'Universal Inbox + AI Assistant',
            'AI Trend Radar',
            'Audience Persona Builder',
            'Priority Support',
        ],
        isPopular: false,
    },
    {
        id: 'agency',
        name: 'Agency',
        price: 149,
        features: [
            '50 Social Accounts',
            'Unlimited Team Members',
            'All Business Features',
            'AI Proposal Generator',
            'Content Gap Analyzer',
            'Creator Marketplace Access',
        ],
        isPopular: false,
    },
];


export const MOCK_ANALYTICS_DATA: AnalyticsData[] = [
  { name: 'Jan', followers: 4000, views: 2400, likes: 2400, comments: 120 },
  { name: 'Feb', followers: 4300, views: 1398, likes: 2210, comments: 250 },
  { name: 'Mar', followers: 4800, views: 9800, likes: 2290, comments: 300 },
  { name: 'Apr', followers: 5100, views: 3908, likes: 2000, comments: 280 },
  { name: 'May', followers: 5500, views: 4800, likes: 2181, comments: 410 },
  { name: 'Jun', followers: 5800, views: 3800, likes: 2500, comments: 320 },
  { name: 'Jul', followers: 6200, views: 4300, likes: 2100, comments: 350 },
];

export const MOCK_SENTIMENT_DATA: SentimentData[] = [
    { name: 'Positive', value: 489, color: '#4ade80' },
    { name: 'Neutral', value: 213, color: '#94a3b8' },
    { name: 'Negative', value: 45, color: '#f87171' },
];

export const MOCK_MESSAGES: Message[] = [
    { id: '1', platform: SocialProvider.Instagram, sender: { name: 'creative_user', avatar: 'https://picsum.photos/seed/msg1/40/40' }, content: 'Wow, this looks amazing! When will it be available?', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), isRead: false, priority: true },
    { id: '2', platform: SocialProvider.Facebook, sender: { name: 'Mark P.', avatar: 'https://picsum.photos/seed/msg2/40/40' }, content: 'Can you tell me more about the materials used?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isRead: false },
    { id: '3', platform: SocialProvider.Twitter, sender: { name: 'TechGuru', avatar: 'https://picsum.photos/seed/msg3/40/40' }, content: 'Great insight! Thanks for sharing.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), isRead: true },
    { id: '4', platform: SocialProvider.LinkedIn, sender: { name: 'Sarah Connell', avatar: 'https://picsum.photos/seed/msg4/40/40' }, content: 'Interesting article. I have a follow-up question regarding the Q3 data...', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isRead: false, priority: true },
    { id: '5', platform: SocialProvider.Instagram, sender: { name: 'wanderlust_gal', avatar: 'https://picsum.photos/seed/msg5/40/40' }, content: '❤️', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isRead: true },
];

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
    { id: '1', type: 'Template', title: 'Modern Carousel Pack', author: 'DesignPro', price: 15, rating: 4.8, imageUrl: 'https://picsum.photos/seed/mkt1/300/200' },
    { id: '2', type: 'Caption Pack', title: 'E-Commerce Engagement Boosters', author: 'CopyWiz', price: 25, rating: 4.9, imageUrl: 'https://picsum.photos/seed/mkt2/300/200' },
    { id: '3', type: 'Design', title: 'Animated Stories (10 pack)', author: 'MotionMaster', price: 40, rating: 4.7, imageUrl: 'https://picsum.photos/seed/mkt3/300/200' },
    { id: '4', type: 'Template', title: 'Real Estate Post Templates', author: 'RealtyDesigns', price: 18, rating: 4.8, imageUrl: 'https://picsum.photos/seed/mkt4/300/200' },
];

export const LANDING_FEATURES = [
    { icon: <Sparkles size={28} className="text-brand-400" />, title: 'AI Growth Engine', description: 'Leverage a full suite of AI tools from content creation to trend analysis, designed to accelerate your growth.' },
    { icon: <Palette size={28} className="text-brand-400" />, title: 'Brand Voice Trainer', description: 'Train our AI on your unique style, and generate content that sounds authentically like you, every single time.' },
    { icon: <Inbox size={28} className="text-brand-400" />, title: 'Universal Inbox & AI Assistant', description: 'Manage all your DMs and comments in one place. Let our AI help you draft natural, engaging replies instantly.' },
    { icon: <TrendingUp size={28} className="text-brand-400" />, title: 'AI Trend Radar', description: 'Never miss a trend. Our AI scans social media for trending sounds, hashtags, and formats so you can create relevant content.' },
    { icon: <CalendarClock size={28} className="text-brand-400" />, title: 'Visual Content Calendar', description: 'Plan your social media strategy with an intuitive drag-and-drop calendar. See your entire schedule at a glance.' },
    { icon: <FileText size={28} className="text-brand-400" />, title: 'AI Proposal Generator', description: 'Perfect for agencies. Auto-create professional proposals and invoices for your clients in seconds.' },
];


export const MOCK_API_LOGS: ApiLog[] = [
    { id: 1, timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), userEmail: 'jane.doe@example.com', tool: 'Caption Generator', status: 'Success' },
    { id: 2, timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), userEmail: 'john.smith@example.com', tool: 'Trend Radar', status: 'Success' },
    { id: 3, timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), userEmail: 'emily.white@example.com', tool: 'Brand Voice Trainer', status: 'Success' },
    { id: 4, timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), userEmail: 'jane.doe@example.com', tool: 'Smart Reply', status: 'Failed' },
    { id: 5, timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), userEmail: 'john.smith@example.com', tool: 'Caption Rewriter', status: 'Success' },
];

export const MOCK_POSTS_BY_PLATFORM: PostCount[] = [
    { platform: SocialProvider.Facebook, count: 45 },
    { platform: SocialProvider.Instagram, count: 82 },
    { platform: SocialProvider.Twitter, count: 120 },
    { platform: SocialProvider.LinkedIn, count: 25 },
    { platform: SocialProvider.TikTok, count: 68 },
];

export const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
    { id: 1, type: 'signup', description: 'alex.jones@example.com just signed up.', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { id: 2, type: 'post', description: 'Jane Doe scheduled an Instagram post.', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { id: 3, type: 'comment', description: 'New high-priority comment in Inbox.', timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString() },
    { id: 4, type: 'post', description: 'John Smith published a post to X/Twitter.', timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString() },
];

export const MOCK_MONTHLY_GROWTH_DATA: MonthlyGrowthData[] = [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1800 },
    { month: 'Mar', revenue: 2200 },
    { month: 'Apr', revenue: 3100 },
    { month: 'May', revenue: 3900 },
    { month: 'Jun', revenue: 5200 },
    { month: 'Jul', revenue: 6100 },
];

export const MOCK_AI_ACTIVITY_DATA: AiActivityData[] = [
    { tool: 'Captions Generated', count: 1245, icon: <BotMessageSquare className="w-5 h-5 text-purple-400" /> },
    { tool: 'Captions Rewritten', count: 876, icon: <PenSquare className="w-5 h-5 text-blue-400" /> },
    { tool: 'Trends Analyzed', count: 453, icon: <TrendingUp className="w-5 h-5 text-green-400" /> },
    { tool: 'Proposals Created', count: 121, icon: <FileText className="w-5 h-5 text-yellow-400" /> },
];

export const MOCK_AI_TOKEN_USAGE: AiTokenUsage[] = [
    { tool: 'Caption Gen', tokens: 185000 },
    { tool: 'Smart Reply', tokens: 240000 },
    { tool: 'Trend Radar', tokens: 350000 },
    { tool: 'Caption Rewrite', tokens: 150000 },
    { tool: 'Persona Builder', tokens: 290000 },
    { tool: 'Support Assist', tokens: 410000 },
];

export const MOCK_PODS: Pod[] = [
    { id: '1', name: 'SaaS Founders Hub', description: 'A group for SaaS founders to exchange engagement and growth hacks.', niche: 'SaaS & Tech', memberCount: 15, imageUrl: 'https://picsum.photos/seed/pod1/400/200' },
    { id: '2', name: 'Fashion & Lifestyle Creators', description: 'Connect with other fashion influencers to boost your Instagram presence.', niche: 'Fashion', memberCount: 42, imageUrl: 'https://picsum.photos/seed/pod2/400/200' },
    { id: '3', name: 'Food Bloggers Unite', description: 'Share your latest recipes and get engagement from fellow foodies.', niche: 'Food & Cooking', memberCount: 28, imageUrl: 'https://picsum.photos/seed/pod3/400/200' },
    { id: '4', name: 'Digital Nomad Network', description: 'A pod for travelers and remote workers to grow their online brand.', niche: 'Travel', memberCount: 8, imageUrl: 'https://picsum.photos/seed/pod4/400/200' },
];

export const MOCK_POD_MEMBERS: PodMember[] = [
    { id: 2, name: 'Jane Doe', avatarUrl: `https://ui-avatars.com/api/?name=Jane+Doe&background=1f53b0&color=f0faff`, contributionScore: 258 },
    { id: 3, name: 'John Smith', avatarUrl: `https://ui-avatars.com/api/?name=John+Smith&background=1f53b0&color=f0faff`, contributionScore: 192 },
    { id: 4, name: 'Emily White', avatarUrl: `https://ui-avatars.com/api/?name=Emily+White&background=1f53b0&color=f0faff`, contributionScore: 154 },
    { id: 5, name: 'Alex Johnson', avatarUrl: `https://ui-avatars.com/api/?name=Alex+Johnson&background=1f53b0&color=f0faff`, contributionScore: 98 },
    { id: 6, name: 'Sara Chen', avatarUrl: `https://ui-avatars.com/api/?name=Sara+Chen&background=1f53b0&color=f0faff`, contributionScore: 45 },
];

export const MOCK_POD_POSTS: PodPost[] = [
    { id: 'p1', authorName: 'John Smith', authorAvatar: MOCK_POD_MEMBERS[1].avatarUrl, content: 'Just launched a new feature for our app! Check it out and let me know what you think. #SaaS #StartupLife', platform: SocialProvider.LinkedIn, submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'p2', authorName: 'Emily White', authorAvatar: MOCK_POD_MEMBERS[2].avatarUrl, content: 'Excited to share my latest blog post on building a personal brand. Feedback is welcome!', platform: SocialProvider.Twitter, submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    { id: 'p3', authorName: 'Alex Johnson', authorAvatar: MOCK_POD_MEMBERS[3].avatarUrl, content: 'Our new landing page is live! What do you all think of the new design?', platform: SocialProvider.Instagram, submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
];


export const SOCIAL_ICONS: Record<SocialProvider, React.FC<React.SVGProps<SVGSVGElement>>> = {
    [SocialProvider.Facebook]: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
    ),
    [SocialProvider.Instagram]: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
    ),
    [SocialProvider.Twitter]: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9s-1.4-.4-2.8-.8c0 0-4.5 7.8-10.4 8.7 0 0-2.3.8-4.3-.4 0 0-2.3-1-2.8-2.3 0 0 .4 3.1 5.7 1.5 0 0-2.3-1-3.6-2.5 0 0-.8-1.9.8-3.1 0 0 3.9.4 5.7 2.5 0 0 .4-2.8 4.3-5.2s4.3-1.5 4.3-1.5z"></path></svg>
    ),
    [SocialProvider.LinkedIn]: (props) => (
       <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
    ),
    [SocialProvider.TikTok]: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.46-2.9-1.6-1.92-2.34-4.29-2.1-6.77.24-2.48 1.3-4.88 3.03-6.53 1.87-1.78 4.4-2.58 6.79-2.46v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 1.93.01 3.85-.02 5.76-.02 1.08.38 2.14 1.07 2.94.93 1.06 2.36 1.68 3.8 1.63 1.44-.05 2.89-.35 4.2-.97.57-.26 1.1-.59 1.62-.93V.02z"></path></svg>
    ),
    [SocialProvider.Pinterest]: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.7 7.8 6.5 9.1-.1-1.1.1-2.4.4-3.5.3-1.2 1.9-8.1 1.9-8.1s-.5-.9-.5-2.3c0-2.1 1.2-3.7 2.8-3.7 1.3 0 1.9.9 1.9 2.1 0 1.3-.8 3.2-1.3 5-1 3.4 1.7 6.2 5 6.2 6.1 0 9.7-7.2 9.7-15.1 0-6.4-5.1-10.9-11.4-10.9z"></path></svg>
    ),
    [SocialProvider.YouTube]: (props) => (
       <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21.582 7.042c-.221-.815-.863-1.455-1.68-1.677C18.238 5 12 5 12 5s-6.238 0-7.902.365c-.817.222-1.459.862-1.68-1.677C2 8.708 2 12 2 12s0 3.292.418 4.958c.221.815.863 1.455 1.68 1.677C5.762 19 12 19 12 19s6.238 0 7.902-.365c.817.222 1.459.862 1.68-1.677C22 15.292 22 12 22 12s0-3.292-.418-4.958zM10 15.464V8.536L16 12l-6 3.464z"></path></svg>
    ),
};

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
    { id: 1, user: MOCK_USERS[2], subject: 'Problem with billing', message: 'Hi there, I was charged twice for my subscription this month. Can you please look into this?', status: 'Open', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 2, user: MOCK_USERS[3], subject: 'Feature Request: Dark Mode', message: 'The app is great, but I would really love a dark mode option for the dashboard!', status: 'In Progress', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 3, user: MOCK_USERS[4], subject: 'How to connect Pinterest?', message: 'I am trying to connect my Pinterest account but I keep getting an error message. Can you help?', status: 'Closed', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 4, user: MOCK_USERS[2], subject: 'Video upload failed', message: 'I tried to upload a video for a scheduled TikTok post and it failed with a generic error. The file is a .mp4 and is about 50MB.', status: 'Open', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
];


// A map to associate tool IDs with their icon components for dynamic rendering
export const TOOL_ICONS: Record<string, LucideIcon> = {
    'ad-optimizer': Rocket,
    'caption-generator': BotMessageSquare,
    'caption-rewriter': Palette,
    'content-gap-analyzer': Lightbulb,
    'content-idea-generator': Lightbulb,
    'engagement-pods': Share2,
    'growth-forecasting': BarChart2,
    'hashtag-generator': Sparkles,
    'influencer-finder': Search,
    'meme-generator': TrendingUp,
    'one-click-export': Share2,
    'persona-builder': Users,
    'proposal-generator': FileText,
    'seo-analyzer': TrendingUp,
    'trend-radar': LineChart,
    'voice-to-post': Wrench,
};
