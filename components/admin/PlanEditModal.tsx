
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type Plan } from '../../types';

interface PlanEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (plan: Plan) => void;
    plan: Plan | null;
}

const PlanEditModal: React.FC<PlanEditModalProps> = ({ isOpen, onClose, onSave, plan }) => {
    const [formData, setFormData] = useState<Omit<Plan, 'id'>>({
        name: '',
        price: 0,
        features: [],
        isPopular: false,
    });

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                price: plan.price,
                features: plan.features,
                isPopular: plan.isPopular || false,
            });
        } else {
            setFormData({ name: '', price: 0, features: [], isPopular: false });
        }
    }, [plan, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             const { checked } = e.target as HTMLInputElement;
             setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({...prev, features: e.target.value.split('\n') }));
    }

    const handleSubmit = () => {
        const planToSave: Plan = {
            ...formData,
            id: plan?.id || `temp-${Date.now()}`,
            price: Number(formData.price),
        };
        onSave(planToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">{plan ? 'Edit Plan' : 'Create New Plan'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Plan Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">Price (per month)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="features" className="block text-sm font-medium text-gray-300 mb-2">Features (one per line)</label>
                        <textarea
                            id="features"
                            name="features"
                            rows={5}
                            value={formData.features.join('\n')}
                            onChange={handleFeaturesChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                        ></textarea>
                    </div>
                    <div className="flex items-center gap-2">
                         <input
                            type="checkbox"
                            id="isPopular"
                            name="isPopular"
                            checked={formData.isPopular}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-brand-600 focus:ring-brand-500"
                        />
                        <label htmlFor="isPopular" className="text-sm text-gray-300">Mark as Most Popular</label>
                    </div>
                </div>
                <div className="bg-gray-900 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-brand-700 rounded-md hover:bg-brand-600">
                        Save Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanEditModal;
