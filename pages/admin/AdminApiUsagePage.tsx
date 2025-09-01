import React from 'react';
import { MOCK_API_LOGS } from '../../constants';
import { type ApiLog } from '../../types';

const LogRow: React.FC<{ log: ApiLog }> = ({ log }) => {
    const statusColor = log.status === 'Success' ? 'text-green-400' : 'text-red-400';
    return (
        <tr className="border-b border-gray-800 hover:bg-gray-800/50 text-sm">
            <td className="p-4 text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
            <td className="p-4 text-gray-300">{log.userEmail}</td>
            <td className="p-4 text-gray-300 font-medium">{log.tool}</td>
            <td className={`p-4 font-semibold ${statusColor}`}>{log.status}</td>
        </tr>
    );
};

const AdminApiUsagePage: React.FC = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">API Usage & Logs</h1>
            
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-semibold">Timestamp</th>
                            <th className="p-4 font-semibold">User Email</th>
                            <th className="p-4 font-semibold">Tool Used</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_API_LOGS.map(log => (
                            <LogRow key={log.id} log={log} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminApiUsagePage;