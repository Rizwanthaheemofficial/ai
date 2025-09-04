import React, { useState, useContext } from 'react';
import { type Plan } from '../../types';
import { Check, PlusCircle, Trash2, ExternalLink } from 'lucide-react';
import PlanEditModal from '../../components/admin/PlanEditModal';
import { useNotification } from '../../context/NotificationContext';
import { SettingsContext } from '../../context/SettingsContext';

const PlanCard: React.FC<{ plan: Plan, onEdit: (plan: Plan) => void, onDelete: (planId: string) => void }> = ({ plan, onEdit, onDelete }) => {
    return (
        <div className={`border rounded-lg p-6 flex flex-col h-full relative ${plan.isPopular ? 'border-brand-500 bg-gray-800/50' : 'border-gray-700 bg-gray-800'}`}>
            {plan.isPopular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>}
            <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
            <div className="mt-4">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400">/ month</span>
            </div>
            <ul className="mt-6 space-y-3 text-gray-300 text-sm flex-grow">
                {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-6 flex gap-2">
                <button 
                    onClick={() => onEdit(plan)} 
                    className="w-full py-2 rounded-lg font-semibold bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                    Edit
                </button>
                 <button 
                    onClick={() => onDelete(plan.id)} 
                    className="p-2 rounded-lg font-semibold bg-red-800/50 text-red-400 hover:bg-red-800 transition-colors"
                >
                    <Trash2 size={18}/>
                </button>
            </div>
        </div>
    );
};


const AdminPlansPage: React.FC = () => {
    const { plans, setPlans } = useContext(SettingsContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const { addNotification } = useNotification();

    const handleOpenModal = (plan: Plan | null) => {
        setEditingPlan(plan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlan(null);
    };

    const handleSavePlan = (planToSave: Plan) => {
        if (editingPlan) {
            // Update existing plan
            setPlans(currentPlans => currentPlans.map(p => p.id === planToSave.id ? planToSave : p));
            addNotification(`Plan "${planToSave.name}" updated successfully.`, 'success');
        } else {
            // Add new plan
            setPlans(currentPlans => [...currentPlans, { ...planToSave, id: `new_${Date.now()}` }]);
            addNotification(`Plan "${planToSave.name}" created successfully.`, 'success');
        }
        handleCloseModal();
    };

    const handleDeletePlan = (planId: string) => {
        const planToDelete = plans.find(p => p.id === planId);
        if (planToDelete && window.confirm(`Are you sure you want to delete the "${planToDelete.name}" plan? This action cannot be undone.`)) {
            // NOTE: In a real app, you would check for active subscriptions before deleting.
            setPlans(currentPlans => currentPlans.filter(p => p.id !== planId));
            addNotification(`Plan "${planToDelete.name}" has been deleted.`, 'info');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Plan Management</h1>
                <button 
                    onClick={() => handleOpenModal(null)}
                    className="flex items-center gap-2 bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-600 transition-colors"
                >
                    <PlusCircle size={18} />
                    Create New Plan
                </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Billing & Subscriptions</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <p className="text-sm text-gray-400">Total Active Subscriptions</p>
                            <p className="text-3xl font-bold text-white">1,234</p>
                        </div>
                         <div className="bg-gray-900/50 p-4 rounded-lg">
                            <p className="text-sm text-gray-400">Monthly Recurring Revenue</p>
                            <p className="text-3xl font-bold text-white">$6,100</p>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-medium text-gray-300 mb-2">Manage Subscriptions</h4>
                        <div className="flex gap-4">
                            <button disabled className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-gray-400 py-2 rounded-md cursor-not-allowed">Manage in Stripe <ExternalLink size={14}/></button>
                            <button disabled className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-gray-400 py-2 rounded-md cursor-not-allowed">Manage in PayPal <ExternalLink size={14}/></button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Manage customer subscriptions, view invoices, and handle billing issues directly in your payment provider's dashboard.</p>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-300 mb-2">Process a Refund</h4>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Subscription or Transaction ID" className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white disabled:opacity-50" disabled />
                            <button disabled className="bg-red-800/50 text-red-400 px-4 rounded-md cursor-not-allowed font-semibold">Refund</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {plans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} onEdit={handleOpenModal} onDelete={handleDeletePlan} />
                ))}
            </div>

            {isModalOpen && (
                <PlanEditModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSavePlan}
                    plan={editingPlan}
                />
            )}
        </div>
    );
};

export default AdminPlansPage;