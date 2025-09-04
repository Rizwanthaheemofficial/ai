
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MOCK_MARKETPLACE_ITEMS } from '../constants';
import { type MarketplaceItem } from '../types';
import { Star, Search, Filter } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { SettingsContext } from '../context/SettingsContext';

const MarketplaceCard: React.FC<{ item: MarketplaceItem }> = ({ item }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 group">
        <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
        <div className="p-4">
            <span className="text-xs bg-brand-900 text-brand-300 font-semibold px-2 py-1 rounded-full">{item.type}</span>
            <h3 className="font-bold text-white mt-2 truncate group-hover:text-brand-400">{item.title}</h3>
            <p className="text-sm text-gray-400">by {item.author}</p>
            <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold text-brand-500">${item.price}</p>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    <span className="text-sm font-medium text-gray-300">{item.rating}</span>
                </div>
            </div>
        </div>
    </div>
);

const MarketplacePage: React.FC = () => {
    const [items] = useLocalStorage<MarketplaceItem[]>('orbit_marketplace_items', MOCK_MARKETPLACE_ITEMS);
    const { systemSettings } = useContext(SettingsContext);

    if (!systemSettings.featureFlags?.marketplace) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Creator Marketplace</h1>
                <p className="text-gray-400 mt-2">Purchase high-quality templates, caption packs, and designs from top creators.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search for templates..." className="w-full bg-gray-700 border-gray-600 rounded-md pl-10 pr-4 py-2 text-white" />
                </div>
                 <div className="flex gap-4">
                    <select className="bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white">
                        <option>All Categories</option>
                        <option>Templates</option>
                        <option>Caption Packs</option>
                        <option>Designs</option>
                    </select>
                     <button className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600">
                        <Filter size={16} /> Filters
                    </button>
                 </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map(item => (
                    <MarketplaceCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default MarketplacePage;
