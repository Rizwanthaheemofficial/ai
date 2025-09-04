import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AIAssistant from '../components/AIAssistant';
import { SettingsContext } from '../context/SettingsContext';

const MainLayout: React.FC = () => {
    const { systemSettings } = React.useContext(SettingsContext);
    const { seo } = systemSettings;

    // SEO and Branding Effect
    React.useEffect(() => {
        // Update title
        document.title = seo.title || 'Orbit';

        // Helper to update or create meta tags
        const setMetaTag = (attr: string, name: string, content: string) => {
            if (!content) return;
            let element = document.querySelector(`meta[${attr}='${name}']`) as HTMLMetaElement;
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Standard meta tags
        setMetaTag('name', 'description', seo.description);
        setMetaTag('name', 'keywords', seo.keywords);

        // Open Graph tags for social sharing
        setMetaTag('property', 'og:title', seo.title);
        setMetaTag('property', 'og:description', seo.description);
        setMetaTag('property', 'og:image', seo.ogImageUrl);
        setMetaTag('property', 'og:type', 'website');

        // Twitter card tags
        setMetaTag('name', 'twitter:card', 'summary_large_image');
        setMetaTag('name', 'twitter:site', seo.twitterHandle);
        setMetaTag('name', 'twitter:title', seo.title);
        setMetaTag('name', 'twitter:description', seo.description);
        setMetaTag('name', 'twitter:image', seo.ogImageUrl);

        // Update favicon
        let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.href = seo.faviconUrl || '/vite.svg'; // Default fallback

    }, [seo]);
    
    // Google Analytics Effect
    React.useEffect(() => {
        const gaId = seo.googleAnalyticsId;
        const scriptId = 'ga-tracking-script';
        const inlineScriptId = 'ga-inline-script';

        // Cleanup function to remove scripts
        const removeScripts = () => {
            const gtagScript = document.getElementById(scriptId);
            const inlineScript = document.getElementById(inlineScriptId);
            if (gtagScript) gtagScript.remove();
            if (inlineScript) inlineScript.remove();
        };

        if (!gaId) {
            removeScripts();
            return;
        }

        // Avoid re-adding the script if it already exists for the same ID
        if (document.getElementById(scriptId)?.dataset.gaId === gaId) {
            return;
        }
        
        // If script exists but ID is different, remove old ones
        removeScripts();

        const gtagScript = document.createElement('script');
        gtagScript.id = scriptId;
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        gtagScript.dataset.gaId = gaId; // Store ID for checking
        document.head.appendChild(gtagScript);

        const inlineScript = document.createElement('script');
        inlineScript.id = inlineScriptId;
        inlineScript.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
        `;
        document.head.appendChild(inlineScript);
        
        return removeScripts; // Cleanup on component unmount or when gaId changes
    }, [seo.googleAnalyticsId]);

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