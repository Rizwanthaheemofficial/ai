
import React, { useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import { MOCK_PLANS, MOCK_AI_TOKEN_USAGE } from '../../constants';
import { Tool } from '../../types';
import { Sparkles, BrainCircuit, Check } from 'lucide-react';
import AiTokenUsageChart from '../../components/admin/AiTokenUsageChart';
import { useNotification } from '../../context/NotificationContext';

const AiControlPage: React.FC = () => {
    const { tools, updateTool } = useContext(SettingsContext);
    const { addNotification } = useNotification();

    const handlePlanToggle = (toolId: string, planId: string, isEnabled: boolean) => {
        const toolToUpdate = tools.find(t => t.id === toolId);
        if (!toolToUpdate) return;
        
        let newAvailablePlans: string[];
        if (isEnabled) {
            newAvailablePlans = [...toolToUpdate.availableOnPlans, planId];
        } else {
            newAvailablePlans = toolToUpdate.availableOnPlans.filter(pId => pId !== planId);
        }
        
        updateTool({ ...toolToUpdate, availableOnPlans: newAvailablePlans });
        addNotification(`${toolToUpdate.name} updated for ${planId} plan.`, 'info');
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">AI Features Control</h1>

            <div className="bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-700 flex items-center gap-4">
                    <div className="text-brand-400"><Sparkles size={22} /></div>
                    <h3 className="text-lg font-semibold text-white">Tool Availability by Plan</h3>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-400 mb-4">Enable or disable specific AI tools for each subscription plan. Changes are applied in real-time for all users.</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-gray-400 uppercase">
                                <tr>
                                    <th className="p-3 font-semibold">Tool</th>
                                    {MOCK_PLANS.map(plan => (
                                        <th key={plan.id} className="p-3 font-semibold text-center">{plan.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tools.map(tool => (
                                    <tr key={tool.id} className="border-t border-gray-700">
                                        <td className="p-3 font-medium text-white">{tool.name}</td>
                                        {MOCK_PLANS.map(plan => {
                                            const isEnabled = tool.availableOnPlans.includes(plan.id);
                                            return (
                                                <td key={plan.id} className="p-3 text-center">
                                                    <label htmlFor={`${tool.id}-${plan.id}`} className="cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600">
                                                        <input 
                                                            id={`${tool.id}-${plan.id}`}
                                                            type="checkbox" 
                                                            checked={isEnabled}
                                                            onChange={(e) => handlePlanToggle(tool.id, plan.id, e.target.checked)}
                                                            className="sr-only"
                                                        />
                                                        {isEnabled && <Check className="w-5 h-5 text-brand-400" />}
                                                    </label>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg h-96 flex flex-col">
                    <h2 className="text-xl font-semibold text-white mb-4">AI Token Usage (Last 30 Days)</h2>
                     <AiTokenUsageChart data={MOCK_AI_TOKEN_USAGE} />
                </div>

                <div className="bg-gray-800 rounded-lg shadow">
                    <div className="p-6 border-b border-gray-700 flex items-center gap-4">
                        <div className="text-brand-400"><BrainCircuit size={22} /></div>
                        <h3 className="text-lg font-semibold text-white">AI Model Management</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-gray-400">Manage the underlying AI models used for generation tasks.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Default Generation Model</label>
                            <select disabled className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white cursor-not-allowed">
                                <option>gemini-2.5-flash</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Add New Model (Coming Soon)</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Model Name (e.g., gemini-2.5-pro)" className="flex-1 bg-gray-700 rounded-md px-3 text-white disabled:opacity-50" disabled />
                                <button disabled className="bg-gray-600 text-white px-4 rounded-md font-semibold cursor-not-allowed">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AiControlPage;
