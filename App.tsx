

import React, { useState, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import SchedulerPage from './pages/SchedulerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ToolsPage from './pages/ToolsPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import InboxPage from './pages/InboxPage';
import GrowthPage from './pages/GrowthPage';
import MarketplacePage from './pages/MarketplacePage';
import EngagementPodsPage from './pages/EngagementPodsPage'; // Import the new Pods page
import TeamPage from './pages/TeamPage'; // Import the new Team page
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPlansPage from './pages/admin/AdminPlansPage';
import AdminPostsPage from './pages/admin/AdminPostsPage';
import AdminAccountsPage from './pages/admin/AdminAccountsPage';
import AdminApiUsagePage from './pages/admin/AdminApiUsagePage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminAiControlPage from './pages/admin/AdminAiControlPage'; // Import the new AI Control page
import AdminSupportPage from './pages/admin/AdminSupportPage'; // Import the new Support page
import AdminToolsPage from './pages/admin/AdminToolsPage';
import { NotificationProvider } from './context/NotificationContext';
import NotificationContainer from './components/NotificationContainer';
import { PostProvider } from './context/PostContext'; // Import the new PostProvider
import { SettingsContext, SettingsProvider } from './context/SettingsContext';
import useLocalStorage from './hooks/useLocalStorage';
import { User } from './types';
import { AccountProvider } from './context/AccountContext';
import { ActivityProvider } from './context/ActivityContext';
import { Wrench } from 'lucide-react';

// Define a clear interface for the AuthContext value
interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

// Create a more robust AuthContext
export const AuthContext = React.createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
});

const MaintenanceComponent = () => (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center text-center p-4">
        <Wrench size={64} className="text-brand-500 mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold text-white mb-2">Under Maintenance</h1>
        <p className="text-gray-400 max-w-md">
            We're currently performing some scheduled maintenance. We should be back online shortly. Thanks for your patience!
        </p>
    </div>
);

// A wrapper component to protect user routes
const PrivateWrapper = () => {
    const { user } = React.useContext(AuthContext);
    const { systemSettings } = useContext(SettingsContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (systemSettings.maintenanceMode && user.role !== 'admin') {
        return <MaintenanceComponent />; 
    }

    return <MainLayout />;
};


// A wrapper component to protect admin routes
const AdminWrapper = () => {
    const { user } = React.useContext(AuthContext);
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return user.role === 'admin' ? <MainLayout /> : <Navigate to="/dashboard" replace />;
}

// The main component that defines all the routes
function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected User Routes */}
            <Route element={<PrivateWrapper />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/scheduler" element={<SchedulerPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/inbox" element={<InboxPage />} />
                <Route path="/pods" element={<EngagementPodsPage />} />
                <Route path="/growth" element={<GrowthPage />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/pricing" element={<PricingPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<AdminWrapper />}>
                 <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                 <Route path="/admin/users" element={<AdminUsersPage />} />
                 <Route path="/admin/plans" element={<AdminPlansPage />} />
                 <Route path="/admin/posts" element={<AdminPostsPage />} />
                 <Route path="/admin/accounts" element={<AdminAccountsPage />} />
                 <Route path="/admin/usage" element={<AdminApiUsagePage />} />
                 <Route path="/admin/ai-control" element={<AdminAiControlPage />} />
                 <Route path="/admin/support" element={<AdminSupportPage />} />
                 <Route path="/admin/settings" element={<AdminSettingsPage />} />
                 <Route path="/admin/tools" element={<AdminToolsPage />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
    const [user, setUser] = useLocalStorage<User | null>('orbit_user', null);

    const authContextValue = {
        user,
        login: (userData: User) => {
            setUser(userData);
        },
        logout: () => {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            <NotificationProvider>
                <SettingsProvider>
                    <AccountProvider>
                        <ActivityProvider>
                            <PostProvider>
                                <HashRouter>
                                    <AppRoutes />
                                </HashRouter>
                                <NotificationContainer />
                            </PostProvider>
                        </ActivityProvider>
                    </AccountProvider>
                </SettingsProvider>
            </NotificationProvider>
        </AuthContext.Provider>
    );
}

export default App;