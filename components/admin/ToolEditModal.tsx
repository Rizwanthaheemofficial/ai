
import React, { useState, useEffect, useContext } from 'react';
import { X } from 'lucide-react';
import { type Tool, type Plan } from '../../types';
import { TOOL_ICONS } from '../../constants';
import { SettingsContext } from '../../context/SettingsContext';

type StoredTool = Omit<Tool, 'icon'>;

interface ToolEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (toolData: StoredTool | Omit<StoredTool, 'id'>) => void;
    tool: Tool | null;
}

const ToolEditModal: React.FC<ToolEditModalProps> = ({ isOpen, onClose, onSave, tool }) => {
    const { plans } = useContext(SettingsContext);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Content Creation',
    });
    const [iconName, setIconName] = useState('caption-generator');
    const [availableOnPlans, setAvailableOnPlans] = useState<string[]>([]);

    useEffect(() => {
        if (tool) {
            setFormData({
                name: tool.name,
                description: tool.description,
                category: tool.category,
            });
            setIconName(tool.iconName);
            setAvailableOnPlans(tool.availableOnPlans);
        } else {
             // Reset to default for a new tool
            setFormData({ name: '', description: '', category: 'Content Creation' });
            setIconName('caption-generator');
            setAvailableOnPlans([]);
        }
    }, [tool, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handlePlanChange = (planId: string, checked: boolean) => {
        setAvailableOnPlans(prev => {
            const newPlans = new Set(prev);
            if (checked) {
                newPlans.add(planId);
            } else {
                newPlans.delete(planId);
            }
            return Array.from(newPlans);
        });
    };

    const handleSubmit = () => {
        const baseToolData = {
            ...formData,
            iconName,
            availableOnPlans,
        };

        if (tool) {
            // Editing an existing tool
            onSave({ ...baseToolData, id: tool.id });
        } else {
            // Creating a new tool
            onSave(baseToolData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">{tool ? 'Edit Tool' : 'Create New Tool'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label htmlFor="tool-name" className="block text-sm font-medium text-gray-300 mb-2">Tool Name</label>
                        <input id="tool-name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., AI Caption Generator" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                    </div>
                    <div>
                        <label htmlFor="tool-description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea id="tool-description" name="description" value={formData.description} onChange={handleChange} placeholder="A short description of what this tool does." className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white h-24" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="tool-category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                           <input id="tool-category" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Content Creation" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                        </div>
                        <div>
                           <label htmlFor="tool-icon" className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                           <select id="tool-icon" value={iconName} onChange={e => setIconName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white capitalize">
                               {Object.keys(TOOL_ICONS).sort().map(key => (
                                   <option key={key} value={key} className="capitalize">{key.replace(/-/g, ' ')}</option>
                               ))}
                           </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Available On Plans</label>
                        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-900/50 rounded-md border border-gray-700">
                            {plans.map(p => (
                                <div key={p.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`plan-${p.id}-${tool?.id || 'new'}`}
                                        checked={availableOnPlans.includes(p.id)}
                                        onChange={(e) => handlePlanChange(p.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-brand-600 focus:ring-brand-500"
                                    />
                                    <label htmlFor={`plan-${p.id}-${tool?.id || 'new'}`} className="text-sm text-gray-300">{p.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-brand-700 rounded-md hover:bg-brand-600">Save Tool</button>
                </div>
            </div>
        </div>
    );
};

export default ToolEditModal;
