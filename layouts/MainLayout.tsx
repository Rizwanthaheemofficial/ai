import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AIAssistant from '../components/AIAssistant';
import { SettingsContext } from '../context/SettingsContext';

const MainLayout: React.FC = () => {
    const { systemSettings } = React.useContext(SettingsContext);
    const { seo } = systemSettings;

    React.useEffect(() => {
        document.title = seo.title || 'Orbit';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', seo.description || 'AI Social Growth Platform');
        }
    }, [seo]);
    
    // Effect to update the theme color
    React.useEffect(() => {
        const root = document.documentElement;
        if (seo.brandColor) {
            // Helper function to convert hex to RGB
            const hexToRgb = (hex: string) => {
                let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
            }
            const rgb = hexToRgb(seo.brandColor);
            if (rgb) {
                 root.style.setProperty('--color-brand-500', seo.brandColor);
                 root.style.setProperty('--color-brand-rgb', rgb);
            }
        }
    }, [seo.brandColor]);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-950 p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
            <AIAssistant />
        </div>
    );
};

export default MainLayout;