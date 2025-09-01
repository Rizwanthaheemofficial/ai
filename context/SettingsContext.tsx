import React, { createContext, ReactNode, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Tool, SystemSettings } from '../types';
import { TOOL_ICONS } from '../constants';
import { Sparkles } from 'lucide-react';

// Define the shape of a tool object that is safe to store in localStorage
type StoredTool = Omit<Tool, 'icon'>;

interface SettingsContextType {
    tools: Tool[]; // This will be the fully-hydrated tool object with the icon component
    systemSettings: SystemSettings;
    setSystemSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
    addTool: (tool: Omit<StoredTool, 'id'>) => void;
    updateTool: (tool: StoredTool) => void;
    deleteTool: (toolId: string) => void;
}

export const SettingsContext = createContext<SettingsContextType>({
    tools: [],
    systemSettings: {
        seo: { title: 'Orbit', description: '', logoUrl: '', brandColor: '#4291ff', customDomain: '' },
        apiKeys: { gemini: '' },
        paymentGateways: {
            stripe: { isEnabled: true, publicKey: '', secretKey: ''},
            paypal: { isEnabled: true, publicKey: '', secretKey: ''},
            jazzcash: { isEnabled: false, publicKey: '', secretKey: ''},
            easypaisa: { isEnabled: false, publicKey: '', secretKey: ''},
            custom: { isEnabled: false, name: '', instructions: '' },
        },
        maintenanceMode: false,
    },
    setSystemSettings: () => {},
    addTool: () => {},
    updateTool: () => {},
    deleteTool: () => {},
});

const initialStoredTools: StoredTool[] = [
    { name: 'AI Caption Generator', description: 'Generate engaging captions for your posts using Gemini AI.', id: 'caption-generator', iconName: 'caption-generator', category: 'Content Creation', availableOnPlans: ['free', 'creator', 'business', 'agency'] },
    { name: 'Hashtag Generator', description: 'Find the best hashtags to increase your reach and engagement.', id: 'hashtag-generator', iconName: 'hashtag-generator', category: 'Content Creation', availableOnPlans: ['creator', 'business', 'agency'] },
    { name: 'AI Content Idea Generator', description: 'Brainstorm creative and engaging post ideas for any topic.', id: 'content-idea-generator', iconName: 'content-idea-generator', category: 'Content Creation', availableOnPlans: ['creator', 'business', 'agency'] },
    { name: 'Smart Caption Rewriter', description: 'Turn boring text into engaging, high-impact social captions.', id: 'caption-rewriter', iconName: 'caption-rewriter', category: 'Content Creation', availableOnPlans: ['creator', 'business', 'agency'] },
    { name: 'Social SEO Analyzer', description: 'Get AI-powered tips to optimize your posts for better reach.', id: 'seo-analyzer', iconName: 'seo-analyzer', category: 'Optimization', availableOnPlans: ['business', 'agency'] },
    { name: 'One-Click Export', description: 'Auto-create vertical, square, and compressed versions of your video.', id: 'one-click-export', iconName: 'one-click-export', category: 'Optimization', availableOnPlans: ['agency'] },
    { name: 'Ad Creative Optimizer', description: 'AI suggests better titles, CTAs, and thumbnails for your ads.', id: 'ad-optimizer', iconName: 'ad-optimizer', category: 'Optimization', availableOnPlans: ['agency'] },
    { name: 'AI Proposal Generator', description: 'For agencies managing clients, auto-create proposals & invoices.', id: 'proposal-generator', iconName: 'proposal-generator', category: 'Business & Agency', availableOnPlans: ['agency'] },
    { name: 'AI Meme Generator', description: 'Generates memes using current trending templates to boost engagement.', id: 'meme-generator', iconName: 'meme-generator', category: 'Engagement', availableOnPlans: ['creator', 'business', 'agency'] },
];


const initialSystemSettings: SystemSettings = {
    seo: {
        title: 'Orbit - AI Social Growth Platform',
        description: 'The complete AI-powered platform for content creation, scheduling, trend analysis, and audience engagement.',
        logoUrl: '',
        brandColor: '#4291ff', // Default brand color
        customDomain: '',
    },
    apiKeys: {
        gemini: '',
    },
    paymentGateways: {
        stripe: { isEnabled: true, publicKey: '', secretKey: '' },
        paypal: { isEnabled: true, publicKey: '', secretKey: '' },
        jazzcash: { isEnabled: false, publicKey: '', secretKey: '' },
        easypaisa: { isEnabled: false, publicKey: '', secretKey: '' },
        custom: { isEnabled: false, name: 'Bank Transfer', instructions: 'Please transfer the total amount to the following account...' },
    },
    maintenanceMode: false,
};


export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [storedTools, setStoredTools] = useLocalStorage<StoredTool[]>('orbit_tools', initialStoredTools);
    const [systemSettings, setSystemSettings] = useLocalStorage<SystemSettings>('orbit_system_settings', initialSystemSettings);

    // Memoize the conversion from stored data to renderable data with React components
    const tools = useMemo(() => {
        return storedTools.map(tool => {
            const IconComponent = TOOL_ICONS[tool.iconName] || Sparkles;
            return {
                ...tool,
                icon: <IconComponent className="w-8 h-8 text-brand-500" />
            };
        });
    }, [storedTools]);

    const addTool = (toolData: Omit<StoredTool, 'id'>) => {
        const newTool: StoredTool = {
            ...toolData,
            id: `custom-${Date.now()}`
        };
        setStoredTools(prevTools => [...prevTools, newTool]);
    };

    const updateTool = (updatedTool: StoredTool) => {
        setStoredTools(prevTools => prevTools.map(t => t.id === updatedTool.id ? updatedTool : t));
    };

    const deleteTool = (toolId: string) => {
        setStoredTools(prevTools => prevTools.filter(t => t.id !== toolId));
    };

    return (
        <SettingsContext.Provider value={{ tools, systemSettings, setSystemSettings, addTool, updateTool, deleteTool }}>
            {children}
        </SettingsContext.Provider>
    );
};