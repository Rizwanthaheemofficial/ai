
import React, { useState, useContext } from 'react';
import { generateCaption, generateHashtags, generateSEOTips, generateContentIdeas, rewriteCaption, generateProposal } from '../services/geminiService';
import { SocialProvider, Tool } from '../types';
import { Sparkles, Clipboard, TrendingUp, ArrowLeft, PenSquare, FileText, BotMessageSquare } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { SettingsContext } from '../context/SettingsContext';
import { AuthContext } from '../App';

const ToolCard: React.FC<{ tool: Tool, onClick: () => void }> = ({ tool, onClick }) => (
    <button onClick={onClick} className="bg-gray-800 p-6 rounded-lg text-left w-full hover:bg-gray-700/50 border border-transparent hover:border-brand-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-transparent">
        <div className="flex items-start gap-4">
            <div className="bg-gray-900 p-3 rounded-lg flex-shrink-0">
               {tool.icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{tool.description}</p>
            </div>
        </div>
    </button>
);

const AIGenerator: React.FC<{
    inputPlaceholder: string;
    generateFunction: (prompt: string, platform: string, toneOrStyle: string) => Promise<string>;
    showTone?: boolean;
    buttonText: string;
    showPlatform?: boolean;
}> = ({ inputPlaceholder, generateFunction, showTone = false, buttonText, showPlatform = true }) => {
    const [prompt, setPrompt] = useState('');
    const [tone, setTone] = useState('Friendly');
    const [platform, setPlatform] = useState(SocialProvider.Instagram);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setResult('');
        try {
            const output = await generateFunction(prompt, platform, tone);
            setResult(output);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addNotification(`Error generating content: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        addNotification('Copied to clipboard!', 'success');
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {showPlatform && (
                    <select value={platform} onChange={e => setPlatform(e.target.value as SocialProvider)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                        {Object.values(SocialProvider).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                 )}
                 {showTone && (
                     <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                         <option>Friendly</option>
                         <option>Professional</option>
                         <option>Humorous</option>
                         <option>Inspirational</option>
                         <option>Excited</option>
                     </select>
                 )}
            </div>
            <textarea
                rows={4}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={inputPlaceholder}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
            />
            <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full flex items-center justify-center gap-2 bg-brand-700 text-white px-4 py-3 rounded-md text-sm font-semibold hover:bg-brand-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                <Sparkles size={18} />
                {isLoading ? 'Generating...' : buttonText}
            </button>
            {result && (
                <div className="bg-gray-900 p-4 rounded-lg relative border border-gray-700">
                    <pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm">{result}</pre>
                    <button onClick={copyToClipboard} className="absolute top-2 right-2 text-gray-400 hover:text-white">
                        <Clipboard size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

const SEOAnalyzer: React.FC = () => {
    // This component remains largely the same but is now rendered conditionally
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [platform, setPlatform] = useState(SocialProvider.Instagram);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleGenerate = async () => {
        if (!topic || !content) {
            addNotification('Please provide both a topic/title and content.', 'error');
            return;
        }
        setIsLoading(true);
        setResult('');
        try {
            const output = await generateSEOTips(topic, content, platform);
            setResult(output);
        } catch (error) {
            addNotification(`Error generating tips: ${error instanceof Error ? error.message : "Unknown error"}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    return (
         <div className="space-y-6">
            <select value={platform} onChange={e => setPlatform(e.target.value as SocialProvider)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                {Object.values(SocialProvider).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter post topic or title..." className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"/>
            <textarea rows={5} value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your post content here..." className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"/>
            <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-brand-700 text-white px-4 py-3 rounded-md text-sm font-semibold hover:bg-brand-600 disabled:bg-gray-600">
                <TrendingUp size={18} />
                {isLoading ? 'Analyzing...' : 'Analyze SEO'}
            </button>
            {result && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-semibold text-brand-400 mb-4">SEO Recommendations</h4>
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm prose prose-invert" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }} />
                </div>
            )}
        </div>
    );
};

const CaptionRewriter: React.FC = () => {
    const [caption, setCaption] = useState('');
    const [style, setStyle] = useState('More Engaging');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleGenerate = async () => {
        if (!caption) return;
        setIsLoading(true);
        setResult('');
        try {
            const output = await rewriteCaption(caption, style);
            setResult(output);
        } catch(error) {
            addNotification(`Error rewriting caption: ${error instanceof Error ? error.message : "Unknown error"}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <select value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                <option>More Engaging</option>
                <option>More Professional</option>
                <option>Add Humor</option>
                <option>Make it Concise</option>
            </select>
            <textarea rows={5} value={caption} onChange={e => setCaption(e.target.value)} placeholder="Paste your original caption here..." className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"/>
            <button onClick={handleGenerate} disabled={isLoading || !caption} className="w-full flex items-center justify-center gap-2 bg-brand-700 text-white px-4 py-3 rounded-md text-sm font-semibold hover:bg-brand-600 disabled:bg-gray-600">
                <PenSquare size={18} />
                {isLoading ? 'Rewriting...' : 'Rewrite Caption'}
            </button>
            {result && (
                 <div className="bg-gray-900 p-4 rounded-lg relative border border-gray-700">
                    <p className="text-gray-200 whitespace-pre-wrap">{result}</p>
                 </div>
            )}
        </div>
    );
};

const ProposalGenerator: React.FC = () => {
    const [client, setClient] = useState('');
    const [scope, setScope] = useState('');
    const [price, setPrice] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleGenerate = async () => {
        if (!client || !scope || !price) {
             addNotification('Please fill all fields.', 'error');
             return;
        };
        setIsLoading(true);
        setResult('');
        try {
            const output = await generateProposal(client, scope, price);
            setResult(output);
        } catch(error) {
            addNotification(`Error generating proposal: ${error instanceof Error ? error.message : "Unknown error"}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

     return (
        <div className="space-y-6">
            <input type="text" value={client} onChange={e => setClient(e.target.value)} placeholder="Client Name (e.g., 'The Coffee Corner')" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"/>
            <textarea rows={4} value={scope} onChange={e => setScope(e.target.value)} placeholder="Project Scope (e.g., 'Manage Instagram and Facebook, 3 posts per week...')" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"/>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Total Price (e.g., '500')" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"/>
            <button onClick={handleGenerate} disabled={isLoading || !client} className="w-full flex items-center justify-center gap-2 bg-brand-700 text-white px-4 py-3 rounded-md text-sm font-semibold hover:bg-brand-600 disabled:bg-gray-600">
                <FileText size={18} />
                {isLoading ? 'Generating...' : 'Generate Proposal'}
            </button>
            {result && (
                 <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }}></div>
                 </div>
            )}
        </div>
    );
}

const ToolsPage: React.FC = () => {
    const { tools } = useContext(SettingsContext);
    const { user } = useContext(AuthContext);
    const [activeToolId, setActiveToolId] = useState<string | null>(null);

    const availableTools = React.useMemo(() => {
        if (!user) return [];
        return tools.filter(tool => tool.availableOnPlans.includes(user.planId));
    }, [tools, user]);

    const activeTool = availableTools.find(t => t.id === activeToolId);

    const categories = [...new Set(availableTools.map(t => t.category))];

    const renderActiveTool = () => {
        if (!activeTool) return null;

        switch (activeTool.id) {
            case 'caption-generator':
                return <AIGenerator 
                    buttonText="Generate Caption" 
                    inputPlaceholder="Describe your post, e.g., 'A photo of our new coffee blend'" 
                    generateFunction={(prompt, platform, tone) => generateCaption(prompt, tone, platform)}
                    showTone={true}
                />;
            case 'hashtag-generator':
                return <AIGenerator 
                    buttonText="Generate Hashtags"
                    inputPlaceholder="Enter the topic of your post, e.g., 'digital marketing tips'"
                    generateFunction={(prompt, platform) => generateHashtags(prompt, platform)}
                />;
            case 'content-idea-generator':
                 return <AIGenerator
                    buttonText="Generate Ideas"
                    inputPlaceholder="Enter a topic to brainstorm, e.g., 'healthy breakfast recipes'"
                    generateFunction={(prompt, platform) => generateContentIdeas(prompt, platform)}
                />;
            case 'caption-rewriter':
                return <CaptionRewriter />;
            case 'proposal-generator':
                return <ProposalGenerator />;
            case 'seo-analyzer':
                return <SEOAnalyzer />;
            default:
                return (
                    <div className="text-center p-8 bg-gray-800 rounded-lg">
                        <div className="bg-gray-900 p-4 rounded-lg inline-block text-brand-500 text-4xl">
                           {activeTool.icon || <BotMessageSquare size={40}/>}
                        </div>
                        <h3 className="text-2xl font-bold text-white mt-4">{activeTool.name}</h3>
                        <p className="text-gray-400 mt-2 mb-6 max-w-md mx-auto">{activeTool.description}</p>
                        <span className="bg-brand-900 text-brand-300 font-semibold px-4 py-2 rounded-full">Coming Soon</span>
                        <p className="text-xs text-gray-500 mt-4">This tool's functionality is under development.</p>
                    </div>
                );
        }
    };
    
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                {activeTool && <button onClick={() => setActiveToolId(null)} className="flex items-center gap-2 font-semibold text-brand-400 hover:text-brand-300"><ArrowLeft size={16} /> Back to Tools</button>}
                <h1 className="text-3xl font-bold text-white">
                    {activeTool ? activeTool.name : 'AI Tools Suite'}
                </h1>
            </div>
            
            {activeTool ? renderActiveTool() : (
                 <div className="space-y-10">
                    {categories.map(category => (
                        <div key={category}>
                            <h2 className="text-xl font-semibold text-gray-300 mb-4 pb-2 border-b border-gray-800">{category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {availableTools.filter(t => t.category === category).map(tool => (
                                    <ToolCard key={tool.id} tool={tool} onClick={() => setActiveToolId(tool.id)} />
                                ))}
                            </div>
                        </div>
                    ))}
                 </div>
            )}
        </div>
    );
};

export default ToolsPage;
