import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ArrowRight } from 'lucide-react';

const LogoutScreen = () => {
    return (
        <div className="min-h-screen animate-gradient flex flex-col justify-center items-center px-4">
            <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_25px_100px_-15px_rgba(0,0,0,0.3)] text-center max-w-md w-full animate-fade-in">
                <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LogOut className="w-12 h-12 text-green-600 ml-2" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">See You Soon!</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    You have been successfully logged out. We hope to see you back for your daily essentials.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/login"
                        className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                    >
                        Sign In Again
                    </Link>
                    <Link
                        to="/"
                        className="block w-full bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 px-6 rounded-xl transition"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
            <p className="mt-8 text-gray-500 text-sm">
                Need help? <a href="#" className="text-green-600 hover:underline">Contact Support</a>
            </p>
        </div>
    );
};

export default LogoutScreen;
