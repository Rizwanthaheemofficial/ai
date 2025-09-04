
import React, { useState, useContext, useMemo } from 'react';
import { MOCK_ANALYTICS_DATA } from '../constants';
import { SocialProvider, Tool } from '../types';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { fetchTrendRadar, buildAudiencePersona } from '../services/geminiService';
import { useActivity } from '../context/ActivityContext';
import { AuthContext } from '../App';
import { SettingsContext } from '../context/SettingsContext';

const GrowthToolCard: React.FC<{ tool: Tool, onClick: () => void }> = ({ tool, onClick }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-start justify-between">
                <div className="bg-gray-900 p-3 rounded-lg text-brand-400">
                   {tool.icon}
                </div>
            </div>
            <h3 className="text-lg font-semibold text-white mt-4">{tool.name}</h3>
            <p className="text-sm text-gray-400 mt-1 h-12">{tool.description}</p>
            <button 
                onClick={onClick}
                className="w-full mt-4 bg-gray-700 text-white py-2 rounded-md font-semibold hover:bg-gray-600"
            >
                Use Tool
            </button>
        </div>
    );
};

const TrendRadar: React.FC = () => {
    const [niche, setNiche] = useState('');
    const [platform, setPlatform] = useState(SocialProvider.TikTok);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();
    const { addApiLog } = useActivity();
    const { user } = useContext(AuthContext);
    
    const handleScan = async () => {
        if (!niche || !user) {
            addNotification('Please enter a niche to scan for trends.', 'error');
            return;
        }
        setIsLoading(true);
        setResult('');
        try {
            const output = await fetchTrendRadar(niche, platform);
            setResult(output);
            addApiLog({ userEmail: user.email, tool: 'Trend Radar', status: 'Success' });
        } catch (error) {
            addNotification(`Failed to fetch trends: ${error instanceof Error ? error.message : "Unknown Error"}`, 'error');
            addApiLog({ userEmail: user.email, tool: 'Trend Radar', status: 'Failed' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <p className="text-gray-400">Discover what's currently trending in your niche on social media.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder="Enter your niche (e.g., 'sustainable fashion')" className="md:col-span-2 w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"/>
                <select value={platform} onChange={e => setPlatform(e.target.value as SocialProvider)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
                    <option value={SocialProvider.TikTok}>TikTok</option>
                    <option value={SocialProvider.Instagram}>Instagram</option>
                    <option value={SocialProvider.Twitter}>X/Twitter</option>
                </select>
            </div>
            <button onClick={handleScan} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-brand-700 text-white px-4 py-3 rounded-md text-sm font-semibold hover:bg-brand-600 disabled:bg-gray-600">
                <Sparkles size={18} />
                {isLoading ? 'Scanning for Trends...' : 'Find Trends'}
            </button>
            {result && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-semibold text-brand-400 mb-4">Trending in "{niche}" on {platform}</h4>
                    <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }}></div>
                </div>
            )}
        </div>
    );
};

const PersonaBuilder: React.FC = () => {
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();
    const { addApiLog } = useActivity();
    const { user } = useContext(AuthContext);

    const handleBuild = async () => {
        if(!user) return;
        setIsLoading(true);
        setResult('');
        try {
            // In a real app, this would be dynamic. Here we serialize mock data.
            const dataSummary = `Follower growth is steady, engagement is highest on posts about productivity tips. Audience seems to be most active on weekdays. Average likes per post: ${MOCK_ANALYTICS_DATA.reduce((a, b) => a + b.likes, 0) / MOCK_ANALYTICS_DATA.length}.`;
            const output = await buildAudiencePersona(dataSummary);
            setResult(output);
            addApiLog({ userEmail: user.email, tool: 'Persona Builder', status: 'Success' });
        } catch (error) {
             addNotification(`Failed to build persona: ${error instanceof Error ? error.message : "Unknown Error"}`, 'error');
             addApiLog({ userEmail: user.email, tool: 'Persona Builder', status: 'Failed' });
        } finally {
            setIsLoading(false);
        }
    };

     return (
        <div className="space-y-6">
            <p className="text-gray-400">Let AI analyze your performance data to create a detailed profile of your ideal follower.</p>
            <button onClick={handleBuild} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-brand-700 text-white px-4 py-3 rounded-md text-sm font-semibold hover:bg-brand-600 disabled:bg-gray-600">
                <Sparkles size={18} />
                {isLoading ? 'Analyzing Data...' : 'Build My Audience Persona'}
            </button>
             {result && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                     <h4 className="text-lg font-semibold text-brand-400 mb-4">Your Ideal Follower Persona</h4>
                     <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }}></div>
                </div>
            )}
        </div>
     );
};


const GrowthPage: React.FC = () => {
    const [activeToolId, setActiveToolId] = useState<string | null>(null);
    const { tools } = useContext(SettingsContext);
    const { user } = useContext(AuthContext);

    const growthTools = useMemo(() => {
        if (!user) return [];
        return tools.filter(tool => 
            tool.category === 'Growth & Strategy' && tool.availableOnPlans.includes(user.planId)
        );
    }, [tools, user]);
    
    const activeTool = tools.find(t => t.id === activeToolId);

     const renderActiveTool = () => {
        switch (activeToolId) {
            case 'trend-radar':
                return <TrendRadar />;
            case 'persona-builder':
                return <PersonaBuilder />;
            default:
                if (activeToolId && activeTool) { // A tool is selected but not implemented above
                     return (
                        <div className="text-center p-8 bg-gray-800 rounded-lg">
                            <div className="bg-gray-900 p-4 rounded-lg inline-block text-brand-500 text-4xl">
                               {activeTool.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-4">{activeTool.name}</h3>
                            <p className="text-gray-400 mt-2 mb-6 max-w-md mx-auto">{activeTool.description}</p>
                            <span className="bg-brand-900 text-brand-300 font-semibold px-4 py-2 rounded-full">Coming Soon</span>
                            <p className="text-xs text-gray-500 mt-4">This tool's functionality is under development.</p>
                        </div>
                    );
                }
                // Default view: list of available growth tools
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {growthTools.map(tool => (
                            <GrowthToolCard key={tool.id} tool={tool} onClick={() => setActiveToolId(tool.id)} />
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                 {activeToolId && <button onClick={() => setActiveToolId(null)} className="flex items-center gap-2 font-semibold text-brand-400 hover:text-brand-300"><ArrowLeft size={16} /> Back to Growth Suite</button>}
                <h1 className="text-3xl font-bold text-white">
                    {activeTool ? activeTool.name : 'AI Growth Suite'}
                </h1>
            </div>
            <div>{renderActiveTool()}</div>
        </div>
    );
};

export default GrowthPage;
