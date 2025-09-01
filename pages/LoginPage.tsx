
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { AuthContext } from '../App';
import { MOCK_USERS } from '../constants';
import { useNotification } from '../context/NotificationContext';

const LoginPage: React.FC = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [email, setEmail] = useState('jane.doe@example.com');
    const [password, setPassword] = useState('password');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        // --- This is a mock authentication check ---
        const foundUser = MOCK_USERS.find(user => user.email === email);
        
        // For this prototype, we'll accept a hardcoded password for any found user.
        // For the admin, we'll check a specific password.
        const passwordMatches = (foundUser?.role === 'admin' && password === 'admin123') || (foundUser?.role === 'user' && password === 'password');

        if (foundUser && passwordMatches) {
            login(foundUser);
            addNotification(`Welcome back, ${foundUser.name}!`, 'success');
            if (foundUser.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            addNotification('Invalid email or password.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="flex items-center justify-center gap-2">
                        <Rocket className="text-brand-500 h-10 w-10" />
                        <h1 className="text-4xl font-bold text-white">Orbit</h1>
                    </Link>
                    <p className="text-gray-400 mt-2">Welcome back! Please sign in to your account.</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                                placeholder="admin@orbit.io"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                                placeholder="admin123"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-500"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-brand-500 hover:text-brand-400">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
