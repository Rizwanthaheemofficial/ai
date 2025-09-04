
import React, { useState, useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import { Tool } from '../../types';
import { PlusCircle } from 'lucide-react';
import ToolEditModal from '../../components/admin/ToolEditModal';
import { useNotification } from '../../context/NotificationContext';

// Define the storable tool type, omitting the React component part
type StoredTool = Omit<Tool, 'icon'>;

const ToolRow: React.FC<{ tool: Tool; onEdit: () => void; onDelete: () => void; }> = ({ tool, onEdit, onDelete }) => (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50">
        <td className="p-4">
            <div className="flex items-center gap-3">
                <div className="text-brand-400 flex-shrink-0">{tool.icon}</div>
                <div>
                    <p className="font-medium text-white">{tool.name}</p>
                    <p className="text-sm text-gray-400 max-w-md truncate">{tool.description}</p>
                </div>
            </div>
        </td>
        <td className="p-4 text-sm text-gray-400">{tool.category}</td>
        <td className="p-4 text-right space-x-2">
            <button onClick={onEdit} className="px-3 py-1 text-xs font-medium text-blue-300 bg-blue-800/50 rounded-md hover:bg-blue-800">Edit</button>
            <button onClick={onDelete} className="px-3 py-1 text-xs font-medium text-red-400 bg-red-800/50 rounded-md hover:bg-red-800">Delete</button>
        </td>
    </tr>
);

const AdminToolsPage: React.FC = () => {
    const { tools, addTool, updateTool, deleteTool } = useContext(SettingsContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTool, setEditingTool] = useState<Tool | null>(null);
    const { addNotification } = useNotification();
    
    const handleOpenModal = (tool: Tool | null) => {
        setEditingTool(tool);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTool(null);
    };

    const handleSaveTool = (toolData: StoredTool | Omit<StoredTool, 'id'>) => {
        if ('id' in toolData) {
            // This is an existing tool being updated
            updateTool(toolData);
            addNotification(`Tool "${toolData.name}" updated successfully.`, 'success');
        } else {
            // This is a new tool being created
            addTool(toolData);
            addNotification(`Tool "${toolData.name}" created successfully.`, 'success');
        }
        handleCloseModal();
    };


    const handleDeleteTool = (tool: Tool) => {
        if (window.confirm(`Are you sure you want to delete the tool "${tool.name}"?`)) {
            deleteTool(tool.id);
            addNotification(`Tool "${tool.name}" has been deleted.`, 'info');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage AI Tools</h1>
                <button 
                    onClick={() => handleOpenModal(null)}
                    className="flex items-center gap-2 bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-600"
                >
                    <PlusCircle size={18} /> Add New Tool
                </button>
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-semibold">Tool</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tools.map(tool => (
                            <ToolRow 
                                key={tool.id} 
                                tool={tool} 
                                onEdit={() => handleOpenModal(tool)}
                                onDelete={() => handleDeleteTool(tool)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <ToolEditModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveTool}
                    tool={editingTool}
                />
            )}
        </div>
    );
};

export default AdminToolsPage;
