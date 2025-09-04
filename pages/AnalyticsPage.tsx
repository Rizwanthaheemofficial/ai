
import React from 'react';
import AnalyticsChart from '../components/AnalyticsChart';
import EngagementComparisonChart from '../components/EngagementComparisonChart';
import SentimentChart from '../components/SentimentChart';
import { MOCK_ANALYTICS_DATA, MOCK_SENTIMENT_DATA } from '../constants';
import { useAccounts } from '../context/AccountContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { AnalyticsData, SentimentData } from '../types';

const AnalyticsPage: React.FC = () => {
    const { accounts } = useAccounts();
    const [analyticsData] = useLocalStorage<AnalyticsData[]>('orbit_analytics_data', MOCK_ANALYTICS_DATA);
    const [sentimentData] = useLocalStorage<SentimentData[]>('orbit_sentiment_data', MOCK_SENTIMENT_DATA);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            
            <div className="flex items-center gap-4">
                <label htmlFor="account-filter" className="text-sm font-medium">Filter by account:</label>
                <select id="account-filter" className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500">
                    <option value="all">All Accounts</option>
                    {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.provider} - {acc.username}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnalyticsChart 
                    data={analyticsData} 
                    dataKey="followers" 
                    title="Follower Growth" 
                    color="#60a5fa" 
                />
                <AnalyticsChart 
                    data={analyticsData} 
                    dataKey="views" 
                    title="Content Views" 
                    color="#4ade80"
                />
                <EngagementComparisonChart
                    data={analyticsData}
                    title="Engagement Comparison (Likes vs. Comments)"
                />
                <SentimentChart
                    data={sentimentData}
                    title="Audience Sentiment"
                />
            </div>
        </div>
    );
};

export default AnalyticsPage;
