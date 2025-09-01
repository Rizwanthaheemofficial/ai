
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type AnalyticsData } from '../types';

interface EngagementComparisonChartProps {
    data: AnalyticsData[];
    title: string;
}

const EngagementComparisonChart: React.FC<EngagementComparisonChartProps> = ({ data, title }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-80">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #334155',
                            borderRadius: '0.5rem'
                        }} 
                        labelStyle={{ color: '#e2e8f0' }}
                        cursor={{ fill: 'rgba(71, 85, 105, 0.2)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Bar dataKey="likes" fill="#f87171" name="Likes" />
                    <Bar dataKey="comments" fill="#c084fc" name="Comments" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EngagementComparisonChart;
