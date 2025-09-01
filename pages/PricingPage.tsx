import React, { useContext } from 'react';
import { MOCK_PLANS } from '../constants';
import { Check } from 'lucide-react';
import { type Plan } from '../types';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';


const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChoosePlan = () => {
        if (!user) {
            navigate('/signup');
        } else {
            alert(`Redirecting to payment for ${plan.name} plan...`);
        }
    }
    
    const showButton = !user || user.role !== 'admin';

    return (
        <div className={`border rounded-lg p-8 flex flex-col h-full ${plan.isPopular ? 'border-brand-500 bg-gray-800/50 scale-105' : 'border-gray-700 bg-gray-800'}`}>
            {plan.isPopular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
            <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
            <p className="text-gray-400 mt-2 h-10">{plan.price > 0 ? `For growing brands, creators, and agencies.` : 'For individuals getting started.'}</p>
            <div className="mt-6">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400">/ month</span>
            </div>
            <ul className="mt-8 space-y-4 text-gray-300 flex-grow">
                {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            {showButton && (
                <button onClick={handleChoosePlan} className={`mt-10 w-full py-3 rounded-lg font-semibold ${plan.isPopular ? 'bg-brand-600 text-white hover:bg-brand-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                    {!user ? 'Get Started' : 'Choose Plan'}
                </button>
            )}
        </div>
    )
};


const PricingPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                    Plans that scale with you
                </h1>
                <p className="mt-4 text-xl text-gray-400">
                    Start for free, then upgrade to unlock powerful new growth tools.
                </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                {MOCK_PLANS.map(plan => (
                    <div key={plan.id} className="relative">
                        <PlanCard plan={plan} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingPage;