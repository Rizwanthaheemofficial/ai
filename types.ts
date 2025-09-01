import { ReactNode } from "react";

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'moderator';
    planId: string; // e.g., 'free', 'creator', 'business'
}

export enum SocialProvider {
    YouTube = 'YouTube',
    Facebook = 'Facebook',
    Instagram = 'Instagram',
    TikTok = 'TikTok',
    Twitter = 'X/Twitter',
    LinkedIn = 'LinkedIn',
    Pinterest = 'Pinterest'
}

export enum PostStatus {
    NeedsApproval = 'Needs Approval',
    Pending = 'Pending',
    Published = 'Published',
    Failed = 'Failed',
    Blocked = 'Blocked'
}

export interface SocialAccount {
    id: number;
    provider: SocialProvider;
    username: string;
    avatarUrl: string;
    followers: number;
    user_id: number;
    status?: 'connected' | 'error' | 'reconnecting';
}

export interface Post {
    id: number;
    user_id: number;
    content: string;
    media_url?: string;
    mediaFile?: File;
    provider: SocialProvider;
    scheduled_at: string;
    status: PostStatus;
}

export interface Plan {
    id: string;
    name: string;
    price: number;
    features: string[];
    isPopular?: boolean;
}

export interface AnalyticsData {
    name: string;
    followers: number;
    views: number;
    likes: number;
    comments: number;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

export interface Message {
    id: string;
    platform: SocialProvider;
    sender: {
        name: string;
        avatar: string;
    };
    content: string;
    timestamp: string;
    isRead: boolean;
    priority?: boolean;
}

export interface SentimentData {
    name: 'Positive' | 'Neutral' | 'Negative';
    value: number;
    color: string;
}

export type TrendCategory = 'Hashtags' | 'Sounds' | 'Formats';

export interface Trend {
    name: string;
    description: string;
}

export interface TrendRadarResult {
    category: TrendCategory;
    trends: Trend[];
}

export interface MarketplaceItem {
    id: string;
    type: 'Template' | 'Caption Pack' | 'Design';
    title: string;
    author: string;
    price: number;
    rating: number;
    imageUrl: string;
}

export interface ApiLog {
    id: number;
    timestamp: string;
    userEmail: string;
    tool: string;
    status: 'Success' | 'Failed';
}

export interface PostCount {
    platform: SocialProvider;
    count: number;
}

export interface ActivityItem {
    id: number;
    type: 'signup' | 'post' | 'comment';
    description: string;
    timestamp: string;
}

export interface MonthlyGrowthData {
    month: string;
    revenue: number;
}

export interface AiActivityData {
    tool: string;
    count: number;
    icon: React.ReactNode;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export interface Pod {
    id: string;
    name: string;
    description: string;
    niche: string;
    memberCount: number;
    imageUrl: string;
}

export interface PodMember {
    id: number;
    name: string;
    avatarUrl: string;
    contributionScore: number;
}

export interface PodPost {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    platform: SocialProvider;
    submittedAt: string;
}

export interface GeneratedPostFromVoice {
    platform: SocialProvider;
    content: string;
    image_prompt: string;
}

export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: ReactNode;
    iconName: string; // For persistence & lookup
    category: string;
    availableOnPlans: string[]; // e.g., ['free', 'creator']
}

export interface SeoSettings {
    title: string;
    description: string;
    logoUrl: string; // Base64 string for this prototype
    brandColor: string;
    customDomain: string;
}

export interface AiTokenUsage {
    tool: string;
    tokens: number;
}

export interface SupportTicket {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    subject: string;
    message: string;
    status: 'Open' | 'In Progress' | 'Closed';
    createdAt: string;
}

export interface PaymentGateway {
    isEnabled: boolean;
    publicKey: string;
    secretKey: string;
}

export interface CustomPaymentGateway {
    isEnabled: boolean;
    name: string;
    instructions: string;
}

export interface SystemSettings {
    seo: SeoSettings;
    apiKeys: {
        gemini: string;
    };
    paymentGateways: {
        stripe: PaymentGateway;
        paypal: PaymentGateway;
        jazzcash: PaymentGateway;
        easypaisa: PaymentGateway;
        custom: CustomPaymentGateway;
    };
    maintenanceMode: boolean;
}