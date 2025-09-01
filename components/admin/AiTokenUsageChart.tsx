
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { type AiTokenUsage } from '../../types';

interface AiTokenUsageChartProps {
    data: AiTokenUsage[];
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f97316', '#ec4899', '#f59e0b'];

const AiTokenUsageChart: React.FC<AiTokenUsageChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                data={data} 
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <YAxis type="category" dataKey="tool" stroke="#94a3b8" fontSize={12} width={80} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '0.5rem'
                    }} 
                    labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                    formatter={(value) => `${Number(value).toLocaleString()} tokens`}
                    cursor={{ fill: 'rgba(71, 85, 105, 0.2)' }}
                />
                <Bar dataKey="tokens" name="Tokens Used" radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AiTokenUsageChart;
