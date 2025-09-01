
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type Tool } from '../../types';
import { TOOL_ICONS } from '../../constants';

type StoredTool = Omit<Tool, 'icon'>;

interface ToolEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (toolData: StoredTool | Omit<StoredTool, 'id'>) => void;
    tool: Tool | null;
}

const ToolEditModal: React.FC<ToolEditModalProps> = ({ isOpen, onClose, onSave, tool }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Content Creation',
    });
    const [iconName, setIconName] = useState('caption-generator');
    const [availableOnPlans, setAvailableOnPlans] = useState<string[]>(['creator', 'business', 'agency']);

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
            setAvailableOnPlans(['creator', 'business', 'agency']);
        }
    }, [tool, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (tool) {
            // Editing an existing tool
            const toolToSave: StoredTool = {
                id: tool.id,
                ...formData,
                iconName,
                availableOnPlans,
            };
            onSave(toolToSave);
        } else {
            // Creating a new tool
            const toolToSave: Omit<StoredTool, 'id'> = {
                ...formData,
                iconName,
                availableOnPlans,
            };
            onSave(toolToSave);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">{tool ? 'Edit Tool' : 'Create New Tool'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Tool Name" className="w-full bg-gray-700 p-2 rounded-md" />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full bg-gray-700 p-2 rounded-md h-24" />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full bg-gray-700 p-2 rounded-md" />
                        <select value={iconName} onChange={e => setIconName(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md capitalize">
                           {Object.keys(TOOL_ICONS).map(key => (
                               <option key={key} value={key} className="capitalize">{key.replace(/-/g, ' ')}</option>
                           ))}
                        </select>
                    </div>
                     {/* A simple plan selector could be added here in a future version */}
                </div>
                <div className="bg-gray-900 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded-md">Cancel</button>
                    <button onClick={handleSubmit} className="bg-brand-600 px-4 py-2 rounded-md">Save Tool</button>
                </div>
            </div>
        </div>
    );
};

export default ToolEditModal;