
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { AuthContext } from '../App';
import { type User } from '../types';

const SignUpPage: React.FC = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate creating an account and logging in.
        // Fix: The login function requires a User object. A mock user is created for this prototype.
        const mockNewUser: User = {
            id: 99,
            name: 'New User',
            email: 'newuser@example.com',
            role: 'user',
            // FIX: Added missing 'planId' property required by the User type.
            planId: 'free',
        };
        login(mockNewUser);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="flex items-center justify-center gap-2">
                        <Rocket className="text-brand-500 h-10 w-10" />
                        <h1 className="text-4xl font-bold text-white">Orbit</h1>
                    </Link>
                    <p className="text-gray-400 mt-2">Create your account to get started.</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-2xl">
                    <form onSubmit={handleSignUp} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-500"
                        >
                           Create Account
                        </button>
                    </form>
                </div>
                 <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-brand-500 hover:text-brand-400">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
