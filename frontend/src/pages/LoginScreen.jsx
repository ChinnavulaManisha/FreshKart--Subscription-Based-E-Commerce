import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShoppingBasket, Truck, Apple, ShoppingBag, Wheat, Milk, Pizza, Fish, Grape, Carrot } from 'lucide-react';

import { motion } from 'framer-motion';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginRole, setLoginRole] = useState('user');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRemember(true);
        }

        // Check for redirect message from registration
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
        }
    }, [location]);

    useEffect(() => {
        if (user) {
            navigate('/shop');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await login(email, password, remember, loginRole);
            navigate('/shop');
        } catch (err) {
            const errorMsg = typeof err === 'string' ? err : (err.response?.data?.message || err.message || 'Login failed');
            if (errorMsg === 'Network Error') {
                setError('Network Error: Please check if the backend server is running on port 5000');
            } else {
                setError(errorMsg);
            }
        }
    };

    const [isSocialLoading, setIsSocialLoading] = useState(null);

    const handleSocialLogin = (platform) => {
        setIsSocialLoading(platform);
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold z-50 flex items-center gap-2 animate-bounce';
        toast.innerHTML = `<img src="https://www.vectorlogo.zone/logos/${platform}/${platform}-icon.svg" class="h-5 w-5" /> Initializing ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`;
        document.body.appendChild(toast);

        setTimeout(() => {
            setIsSocialLoading(null);
            toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-extrabold z-50 animate-pulse';
            toast.innerText = `${platform.charAt(0).toUpperCase() + platform.slice(1)} Authentication Active!`;
            setTimeout(() => toast.remove(), 2500);
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
            {/* Left Side - The Fresh Hero */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 overflow-hidden">
                <video
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                    poster="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-shopping-in-the-fruit-and-vegetable-section-of-a-supermarket-41315-large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-emerald-950/40"></div>

                <div className="relative z-10 w-full p-12 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-white text-7xl font-['Pacifico'] mb-6 drop-shadow-2xl">FreshKart</h1>
                        <p className="text-white text-xl font-bold leading-relaxed max-w-sm drop-shadow-lg opacity-95">
                            Quality is the only purchase that enriches your health beyond wealth.
                        </p>
                    </motion.div>
                </div>

                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* Right Side - The Welcome Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10 lg:p-12 relative min-h-screen overflow-hidden bg-[radial-gradient(#10b981_0.5px,transparent_0.5px)] [background-size:32px_32px] [background-position:center]">
                <div className="absolute inset-0 bg-white/60 pointer-events-none"></div>
                {/* Grocery Silhouettes (Top) */}
                <div className="absolute top-6 right-6 w-20 h-20 opacity-10 pointer-events-none text-emerald-600">
                    <svg viewBox="0 0 100 100" fill="currentColor">
                        <path d="M20,40 L80,40 L70,80 L30,80 Z M40,20 L60,20 L60,40 L40,40 Z" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow" />
                    </svg>
                </div>

                <div className="max-w-md w-full relative z-10 pt-12">
                    {/* The Delivery Scooter Animation (Top Right) */}
                    <div className="absolute -top-4 -right-12 pointer-events-none opacity-40">
                        <svg width="140" height="40" viewBox="0 0 100 40" className="text-emerald-400 overflow-visible">
                            <path d="M0,35 Q50,0 100,20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_30s_linear_infinite]" />
                            <motion.g
                                animate={{ x: [0, 100], opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <Truck size={18} className="text-emerald-500 fill-emerald-500/10" />
                            </motion.g>
                        </svg>
                    </div>

                    {/* Fresh Produce Decoration (Top Left - Balancing) */}
                    <div className="absolute -top-6 -left-12 pointer-events-none opacity-40">
                        <svg width="140" height="40" viewBox="0 0 100 40" className="text-emerald-400 overflow-visible">
                            <path d="M100,35 Q50,0 0,20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_30s_linear_infinite]" />
                            <motion.g
                                animate={{ x: [100, 0], opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
                            >
                                <ShoppingBag size={18} className="text-emerald-500 fill-emerald-500/10" />
                            </motion.g>
                        </svg>
                    </div>

                    {/* High-Quality Background Decor (Lucide Icons) */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.12] overflow-hidden -z-10 text-emerald-600">
                        <Apple size={64} className="absolute -top-4 -left-4 rotate-12" />
                        <Milk size={48} className="absolute top-1/4 -right-2 -rotate-12" />
                        <Pizza size={56} className="absolute top-1/2 -left-6 rotate-[30deg]" />
                        <Fish size={44} className="absolute bottom-1/3 right-4 -rotate-45" />
                        <Grape size={60} className="absolute -bottom-4 left-1/4 rotate-12" />
                        <Carrot size={52} className="absolute bottom-10 right-1/4 -rotate-12" />
                        <Wheat size={40} className="absolute top-1/3 left-1/4 opacity-60" />
                        <ShoppingBasket size={48} className="absolute bottom-20 left-10 rotate-6" />
                        <Truck size={36} className="absolute top-10 right-1/3 opacity-40" />
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                        {['user', 'admin'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setLoginRole(role)}
                                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${loginRole === role
                                    ? 'bg-white text-emerald-600 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {role === 'user' ? 'Customer' : 'Admin'}
                            </button>
                        ))}
                    </div>

                    <div className="text-center mb-10">
                        <h2 className="text-6xl font-extrabold text-emerald-500 tracking-tight mb-2">Welcome</h2>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                            {loginRole === 'admin' ? 'Secure Admin Portal' : 'Login with Email'}
                        </p>
                    </div>

                    {(error || successMessage) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${error ? 'bg-red-50 border-red-500 text-red-700' : 'bg-emerald-50 border-emerald-500 text-emerald-700'} border-l-4 p-4 mb-6 rounded-xl text-sm font-bold flex items-center justify-center shadow-sm`}
                        >
                            {error || successMessage}
                        </motion.div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-4">
                        <div className="input-label-border group">
                            <label className="group-focus-within:text-emerald-500 transition-colors bg-white">Email Id</label>
                            <input
                                type="email"
                                placeholder={loginRole === 'admin' ? "admin@freshkart.com" : "name@freshkart.com"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="group-focus-within:border-emerald-500/50 py-2.5"
                                required
                            />
                            <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-emerald-400 transition-colors" />
                        </div>

                        <div className="input-label-border group">
                            <label className="group-focus-within:text-emerald-500 transition-colors bg-white">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="group-focus-within:border-emerald-500/50 py-2.5"
                                required
                            />
                            <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-emerald-400 transition-colors" />
                        </div>


                        <div className="flex justify-end -mt-2">
                            {loginRole === 'user' && <a href="#" className="text-[10px] font-bold text-gray-400 hover:text-emerald-500 transition-all uppercase tracking-widest">Forgot password?</a>}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: '#059669' }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-emerald-500 text-white font-black py-3.5 rounded-xl shadow-lg uppercase tracking-widest text-xs transition-all"
                        >
                            LOGIN AS {loginRole === 'admin' ? 'ADMIN' : 'CUSTOMER'}
                        </motion.button>
                    </form>

                    {loginRole === 'user' && (
                        <>
                            <div className="relative my-6 text-center">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                                <span className="relative px-4 bg-white text-[10px] font-black text-gray-300 uppercase tracking-widest italic">OR</span>
                            </div>

                            <div className="flex justify-center gap-6 mb-8 mt-4">
                                {[
                                    { id: 'google', icon: 'https://www.vectorlogo.zone/logos/google/google-icon.svg' },
                                    { id: 'facebook', icon: 'https://www.vectorlogo.zone/logos/facebook/facebook-official.svg' },
                                    { id: 'apple', icon: 'https://www.vectorlogo.zone/logos/apple/apple-icon.svg' }
                                ].map((platform) => (
                                    <motion.button
                                        key={platform.id}
                                        whileHover={{ scale: 1.1, translateY: -2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleSocialLogin(platform.id)}
                                        disabled={isSocialLoading !== null}
                                        className="w-14 h-14 bg-gray-50/80 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                                    >
                                        {isSocialLoading === platform.id ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
                                        ) : (
                                            <img src={platform.icon} alt={platform.id} className="w-6 h-6 grayscale-[0.2] opacity-80" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            <p className="text-center font-bold text-gray-400 text-xs">
                                New Customer? <Link to="/register" className="text-gray-900 hover:text-emerald-600 transition-colors">Sign Up</Link>
                            </p>
                        </>
                    )}
                </div>

                {/* Bottom Silhouettes (Mirroring the reference image skyline) */}
                <div className="absolute bottom-0 left-0 w-full h-24 opacity-30 pointer-events-none flex items-end justify-between px-4">
                    <div className="w-24 h-12 bg-emerald-500 rounded-t-lg opacity-20"></div>
                    <div className="w-16 h-20 bg-emerald-500 rounded-t-3xl opacity-10"></div>
                    <div className="w-32 h-6 bg-emerald-500 rounded-t-full opacity-15"></div>
                    <div className="w-20 h-16 bg-emerald-500 rounded-t-xl opacity-20"></div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
