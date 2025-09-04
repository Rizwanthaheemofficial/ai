
import React, { useState, useEffect, useContext } from 'react';
import { SOCIAL_ICONS } from '../constants';
import { SocialProvider } from '../types';
import { LinkIcon, XCircle, Bot, Sparkles } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { trainBrandVoice } from '../services/geminiService';
import { useAccounts } from '../context/AccountContext';
import { AuthContext } from '../App';

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="p-6 space-y-4">
            {children}
        </div>
    </div>
);

const SettingsPage: React.FC = () => {
    const allProviders = Object.values(SocialProvider);
    const { addNotification } = useNotification();
    const { user } = useContext(AuthContext);
    const { accounts, addAccount, removeAccount } = useAccounts();
    const userAccounts = user ? accounts.filter(acc => acc.user_id === user.id) : [];

    const [brandVoiceInput, setBrandVoiceInput] = useState('');
    const [brandVoiceProfile, setBrandVoiceProfile] = useState('');
    const [isTraining, setIsTraining] = useState(false);

    useEffect(() => {
        const savedProfile = localStorage.getItem('orbit_brand_voice');
        if (savedProfile) {
            setBrandVoiceProfile(savedProfile);
        }
    }, []);

    const handleTrainAI = async () => {
        if (!brandVoiceInput.trim()) {
            addNotification('Please paste some of your past posts to train the AI.', 'error');
            return;
        }
        setIsTraining(true);
        try {
            const profile = await trainBrandVoice(brandVoiceInput);
            setBrandVoiceProfile(profile);
            localStorage.setItem('orbit_brand_voice', profile);
            addNotification('Your Brand Voice has been trained and saved!', 'success');
        } catch (error) {
            addNotification(`Training failed: ${error instanceof Error ? error.message : "Unknown error"}`, 'error');
        } finally {
            setIsTraining(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white">Settings</h1>

            <SettingsCard title="AI Brand Voice">
                 <p className="text-sm text-gray-400 -mt-2 mb-4">Train the AI on your unique writing style. Once trained, all AI-generated content will match your brand's voice.</p>
                 <textarea
                    rows={6}
                    value={brandVoiceInput}
                    onChange={(e) => setBrandVoiceInput(e.target.value)}
                    placeholder="Paste 5-10 of your recent social media posts here. The more, the better!"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                />
                 <div className="flex justify-end">
                    <button onClick={handleTrainAI} disabled={isTraining} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-700 rounded-md hover:bg-brand-600 disabled:bg-gray-600">
                        <Sparkles size={16}/> {isTraining ? 'Training AI...' : 'Train AI on My Voice'}
                    </button>
                </div>
                {brandVoiceProfile && (
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-brand-400 mb-2 flex items-center gap-2"><Bot size={18}/> Your Brand Voice Profile</h4>
                        <div className="text-sm text-gray-300 whitespace-pre-wrap prose prose-invert max-w-none prose-p:my-1" dangerouslySetInnerHTML={{ __html: brandVoiceProfile.replace(/\n/g, '<br/>') }} />
                    </div>
                )}
            </SettingsCard>

            <SettingsCard title="Profile Information">
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input type="text" defaultValue={user?.name} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <input type="email" defaultValue={user?.email} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"/>
                </div>
                <div className="flex justify-end">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-brand-700 rounded-md hover:bg-brand-600">Save Changes</button>
                </div>
            </SettingsCard>

            <SettingsCard title="Connected Accounts">
                <p className="text-sm text-gray-400 -mt-2 mb-4">Manage your connected social media profiles.</p>
                <div className="space-y-3">
                    {allProviders.map(provider => {
                        const connectedAccount = userAccounts.find(acc => acc.provider === provider);
                        const Icon = SOCIAL_ICONS[provider];
                        return (
                             <div key={provider} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-md">
                                <div className="flex items-center gap-3">
                                    <Icon className="w-6 h-6" />
                                    <span className="font-semibold">{connectedAccount ? connectedAccount.username : provider}</span>
                                </div>
                                {connectedAccount ? (
                                     <button onClick={() => removeAccount(connectedAccount.id)} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-semibold">
                                         <XCircle size={16}/> Disconnect
                                     </button>
                                ) : (
                                     <button onClick={() => user && addAccount(provider, user.id)} className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 font-semibold" disabled={!user}>
                                         <LinkIcon size={16}/> Connect
                                     </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </SettingsCard>
        </div>
    );
};

export default SettingsPage;
