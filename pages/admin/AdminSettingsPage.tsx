import React, { useContext, useRef } from 'react';
import { Key, Wrench, Percent, Save, ToggleLeft, ToggleRight, CreditCard, Brush, Upload, Globe } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { SettingsContext } from '../../context/SettingsContext';
import { SystemSettings, PaymentGateway, CustomPaymentGateway } from '../../types';

const SettingsCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-700 flex items-center gap-4">
            <div className="text-brand-400">{icon}</div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="p-6 space-y-6">
            {children}
        </div>
    </div>
);

const ApiKeyInput: React.FC<{ serviceName: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ serviceName, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{serviceName}</label>
        <input type="password" value={value} onChange={onChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
    </div>
);


const AdminSettingsPage: React.FC = () => {
    const { addNotification } = useNotification();
    const { systemSettings, setSystemSettings } = useContext(SettingsContext);
    const logoInputRef = useRef<HTMLInputElement>(null);
    
    const handleSettingsChange = <T extends keyof SystemSettings>(section: T, key: keyof SystemSettings[T], value: any) => {
        // FIX: The `systemSettings[section]` could be a boolean (for maintenanceMode), which cannot be spread.
        // This check ensures we only attempt to spread object values, resolving the type error.
        const sectionValue = systemSettings[section];
        if (typeof sectionValue === 'object' && sectionValue !== null) {
            setSystemSettings({
                ...systemSettings,
                [section]: {
                    ...sectionValue,
                    [key]: value,
                },
            });
        }
    };

    const handleGatewayChange = (gateway: keyof SystemSettings['paymentGateways'], key: keyof PaymentGateway | keyof CustomPaymentGateway, value: any) => {
         setSystemSettings(prev => ({
            ...prev,
            paymentGateways: {
                ...prev.paymentGateways,
                [gateway]: {
                    ...prev.paymentGateways[gateway],
                    [key]: value
                }
            }
         }));
    };
    
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleSettingsChange('seo', 'logoUrl', reader.result as string)
                addNotification('Logo updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        } else {
            addNotification('Please select a valid image file.', 'error');
        }
    };

    const handleSaveChanges = () => {
        // useLocalStorage saves automatically, so this is for user feedback
        addNotification('System settings have been saved!', 'success');
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">System Settings</h1>
                <button onClick={handleSaveChanges} className="flex items-center gap-2 bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-600">
                    <Save size={16} /> Save All Changes
                </button>
            </div>
            
            <SettingsCard title="Website SEO & Branding" icon={<Brush size={22} />}>
                <input name="title" value={systemSettings.seo.title} onChange={(e) => handleSettingsChange('seo', 'title', e.target.value)} placeholder="Website Title" className="w-full bg-gray-700 p-2 rounded-md" />
                <textarea name="description" value={systemSettings.seo.description} onChange={(e) => handleSettingsChange('seo', 'description', e.target.value)} placeholder="Meta Description" className="w-full bg-gray-700 p-2 rounded-md h-20" />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                     <div className="flex gap-2">
                        <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" id="logo-upload" />
                        <label htmlFor="logo-upload" className="flex-1 cursor-pointer flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500">
                            <Upload size={16} /> {systemSettings.seo.logoUrl ? 'Change Logo' : 'Upload Logo'}
                        </label>
                        {systemSettings.seo.logoUrl && <img src={systemSettings.seo.logoUrl} alt="Logo Preview" className="h-10 w-auto bg-gray-900 rounded-md p-1" />}
                    </div>
                     <div className="flex items-center gap-2">
                         <label htmlFor="brandColor" className="text-sm font-medium text-gray-300">Theme Color</label>
                         <input id="brandColor" type="color" value={systemSettings.seo.brandColor} onChange={(e) => handleSettingsChange('seo', 'brandColor', e.target.value)} className="w-10 h-10 bg-transparent border-none rounded-md cursor-pointer" />
                     </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Custom Domain</label>
                    <div className="relative">
                        <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g., app.yourdomain.com" value={systemSettings.seo.customDomain} onChange={(e) => handleSettingsChange('seo', 'customDomain', e.target.value)} className="w-full bg-gray-700 pl-10 p-2 rounded-md" />
                    </div>
                </div>
            </SettingsCard>
            
             <SettingsCard title="Payment Gateway Configuration" icon={<CreditCard size={22} />}>
                {Object.keys(systemSettings.paymentGateways).filter(k => k !== 'custom').map(key => {
                    const gw = systemSettings.paymentGateways[key as keyof Omit<SystemSettings['paymentGateways'], 'custom'>];
                    return (
                        <div key={key} className="space-y-4 rounded-lg border border-gray-700 p-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white capitalize">{key}</h4>
                                <button onClick={() => handleGatewayChange(key as any, 'isEnabled', !gw.isEnabled)} className="flex items-center gap-2">
                                    {gw.isEnabled ? <ToggleRight size={36} className="text-brand-500" /> : <ToggleLeft size={36} className="text-gray-500" />}
                                </button>
                            </div>
                            {gw.isEnabled && <div className="border-t border-gray-700 pt-4 space-y-2">
                                <input type="text" placeholder="Public Key" value={gw.publicKey} onChange={e => handleGatewayChange(key as any, 'publicKey', e.target.value)} className="w-full bg-gray-700 p-2 rounded-md"/>
                                <input type="password" placeholder="Secret Key" value={gw.secretKey} onChange={e => handleGatewayChange(key as any, 'secretKey', e.target.value)} className="w-full bg-gray-700 p-2 rounded-md"/>
                            </div>}
                        </div>
                    )
                })}
                 <div className="space-y-4 rounded-lg border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">Custom Gateway</h4>
                        <button onClick={() => handleGatewayChange('custom', 'isEnabled', !systemSettings.paymentGateways.custom.isEnabled)} className="flex items-center gap-2">
                            {systemSettings.paymentGateways.custom.isEnabled ? <ToggleRight size={36} className="text-brand-500" /> : <ToggleLeft size={36} className="text-gray-500" />}
                        </button>
                    </div>
                    {systemSettings.paymentGateways.custom.isEnabled && <div className="border-t border-gray-700 pt-4 space-y-2">
                        <input type="text" placeholder="Gateway Name (e.g., Bank Transfer)" value={systemSettings.paymentGateways.custom.name} onChange={e => handleGatewayChange('custom', 'name', e.target.value)} className="w-full bg-gray-700 p-2 rounded-md"/>
                        <textarea placeholder="Instructions for user..." value={systemSettings.paymentGateways.custom.instructions} onChange={e => handleGatewayChange('custom', 'instructions', e.target.value)} className="w-full bg-gray-700 p-2 rounded-md h-24"/>
                    </div>}
                </div>
            </SettingsCard>
        </div>
    );
};

export default AdminSettingsPage;