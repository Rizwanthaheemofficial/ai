
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Check } from 'lucide-react';
import { MOCK_PLANS, LANDING_FEATURES } from '../constants';
import { type Plan } from '../types';
import { SettingsContext } from '../context/SettingsContext';

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => (
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
        <Link to="/signup" className={`block text-center mt-10 w-full py-3 rounded-lg font-semibold ${plan.isPopular ? 'bg-brand-600 text-white hover:bg-brand-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
           Get Started
        </Link>
    </div>
);


const LandingPage: React.FC = () => {
    // FIX: The context provides 'systemSettings', not 'seoSettings'. Destructure the correct object.
    const { systemSettings } = useContext(SettingsContext);

    return (
        <div className="bg-gray-950 text-gray-200">
            {/* Header */}
            <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-800 sticky top-0 bg-gray-950/80 backdrop-blur-sm z-50">
                <Link to="/" className="flex items-center gap-2">
                    {systemSettings.seo.logoUrl ? (
                        <img src={systemSettings.seo.logoUrl} alt="Custom Logo" className="h-8 w-auto" />
                    ) : (
                        <Rocket className="text-brand-500 h-8 w-8" />
                    )}
                    <h1 className="text-2xl font-bold text-white">Orbit</h1>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <a href="#features" className="hover:text-brand-400">Features</a>
                    <a href="#pricing" className="hover:text-brand-400">Pricing</a>
                </nav>
                <div className="flex items-center gap-3">
                    <Link to="/login" className="text-sm font-semibold hover:text-brand-400">Log In</Link>
                    <Link to="/signup" className="bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-600">
                        Sign Up Free
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="px-6 md:px-12">
                <section className="text-center py-20 md:py-32">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                        Your All-In-One<br/>
                        <span className="text-brand-500">AI Social Growth Engine.</span>
                    </h2>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400">
                        Stop guessing, start growing. Orbit is the complete AI-powered platform for content creation, scheduling, trend analysis, and audience engagement.
                    </p>
                    <div className="mt-10">
                         <Link to="/signup" className="bg-brand-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-500 transition-transform hover:scale-105">
                            Start Your Free Trial
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="text-brand-400 font-semibold">FEATURES</span>
                        <h3 className="text-3xl font-bold text-white mt-2">The Smartest Way to Manage Social Media</h3>
                        <p className="mt-4 text-gray-400">
                           From AI-powered content creation that matches your unique brand voice to a trend radar that keeps you relevant, Orbit is packed with features to make you stand out.
                        </p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {LANDING_FEATURES.map(feature => (
                             <div key={feature.title} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                                {feature.icon}
                                <h4 className="mt-4 text-lg font-semibold text-white">{feature.title}</h4>
                                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20">
                    <div className="text-center">
                         <span className="text-brand-400 font-semibold">PRICING</span>
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl mt-2">
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
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 mt-20">
                <div className="max-w-7xl mx-auto py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                     <div className="flex items-center gap-2">
                        {systemSettings.seo.logoUrl ? (
                            <img src={systemSettings.seo.logoUrl} alt="Custom Logo" className="h-7 w-auto" />
                        ) : (
                            <Rocket className="text-brand-500 h-7 w-7" />
                        )}
                        <span className="text-xl font-bold text-white">Orbit</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-4 md:mt-0">
                        © {new Date().getFullYear()} Orbit, Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;