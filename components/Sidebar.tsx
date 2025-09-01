
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { USER_NAV_LINKS, ADMIN_NAV_LINKS } from '../constants';
import { AuthContext } from '../App';
import { SettingsContext } from '../context/SettingsContext';

const Sidebar: React.FC = () => {
    const { user } = useContext(AuthContext);
    // FIX: The context provides 'systemSettings', not 'seoSettings'. Destructure the correct object.
    const { systemSettings } = useContext(SettingsContext);
    const navLinks = user?.role === 'admin' ? ADMIN_NAV_LINKS : USER_NAV_LINKS;
    const homeLink = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

    return (
        <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
            <div className="h-16 flex items-center justify-center px-4 border-b border-gray-800">
                <a href={`#${homeLink}`} className="flex items-center">
                    {systemSettings.seo.logoUrl ? (
                        <img src={systemSettings.seo.logoUrl} alt="Custom Logo" className="h-8 w-auto mr-2" />
                    ) : (
                        <Rocket className="text-brand-500 h-8 w-8 mr-2" />
                    )}
                    <h1 className="text-2xl font-bold text-white">Orbit</h1>
                </a>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.href}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                                isActive
                                    ? 'bg-brand-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        {link.icon}
                        <span className="ml-3">{link.name}</span>
                    </NavLink>
                ))}
            </nav>
            {user?.role !== 'admin' && (
                <div className="px-4 py-4 border-t border-gray-800">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h3 className="font-semibold text-white">Upgrade to Pro</h3>
                        <p className="text-xs text-gray-400 mt-1 mb-3">Unlock all features and grow your business.</p>
                        <a href="#/pricing" className="block w-full bg-brand-700 text-white text-sm font-semibold py-2 rounded-md hover:bg-brand-600 transition-colors">
                            Upgrade Now
                        </a>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;