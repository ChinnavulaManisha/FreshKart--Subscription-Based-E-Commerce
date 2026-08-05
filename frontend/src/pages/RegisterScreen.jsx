import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, CheckCircle2, ShoppingBasket, Truck } from 'lucide-react';
import axios from '../api/axios';

const RegisterScreen = () => {
    const [step, setStep] = useState(1); // 1: Details, 3: Success
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { register, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/shop');
        }
    }, [navigate, user]);



    const registerHandler = async (e) => {
        if (e) e.preventDefault();
        setMessage(null);
        setError(null);

        if (!name.trim()) {
            setError('Please enter your full name');
            return;
        }
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        // Basic phone validation (removes common symbols and checks length)
        const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
        if (cleanPhone.length < 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        try {
            // Directly register the user
            await register(name, email, password, phone, '');

            setStep(3); // Success Step
            setTimeout(() => {
                navigate('/login', { state: { message: 'Account created successfully! Please login.' } });
            }, 3000);
        } catch (err) {
            setError(err || 'Failed to register');
            setLoading(false);
        }
    };

    const [isSocialLoading, setIsSocialLoading] = useState(null);

    const handleSocialLogin = (platform) => {
        setIsSocialLoading(platform);
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold z-50 flex items-center gap-2 animate-bounce';
        toast.innerHTML = `<img src="https://www.vectorlogo.zone/logos/${platform}/${platform}-icon.svg" class="h-5 w-5" /> Connecting to ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`;
        document.body.appendChild(toast);

        setTimeout(() => {
            setIsSocialLoading(null);
            toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-extrabold z-50 animate-pulse';
            toast.innerText = `${platform.charAt(0).toUpperCase() + platform.slice(1)} Identity Verified!`;
            setTimeout(() => toast.remove(), 2500);
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left Side - The Fresh Hero */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&q=80&w=1000"
                    alt="Join FreshKart"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-emerald-950/50"></div>

                <div className="relative z-10 w-full p-12 flex flex-col justify-end h-screen">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-white text-7xl font-['Pacifico'] mb-4 drop-shadow-xl">FreshKart</h1>
                        <div className="w-12 h-1 bg-white rounded-full mb-6 shadow-lg"></div>
                        <h2 className="text-4xl font-black text-white mb-4 leading-tight drop-shadow-md">Start Your <br /> Fresh Journey</h2>
                        <p className="text-white opacity-95 text-xl leading-relaxed font-bold max-w-sm drop-shadow-lg">
                            Quality is the only purchase that enriches your health beyond wealth.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10 lg:p-16 relative bg-white min-h-screen">
                <div className="max-w-xl w-full relative z-10">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full"
                            >
                                <div className="text-center mb-12 relative">
                                    <h2 className="text-6xl font-extrabold text-emerald-500 tracking-tight mb-3">Connect</h2>
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Establish Your Profile</p>
                                </div>

                                {(message || error) && (
                                    <div className={`${error ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-500'} border-l-4 p-4 mb-6 rounded-xl flex items-center gap-2`}>
                                        <p className={`${error ? 'text-red-700' : 'text-emerald-700'} font-bold text-sm text-center w-full`}>{message || error}</p>
                                    </div>
                                )}

                                <form onSubmit={registerHandler} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                    <div className="md:col-span-2 input-label-border group mb-4">
                                        <label className="bg-white">Full Name</label>
                                        <input type="text" placeholder="Johnathan Doe" value={name} onChange={(e) => setName(e.target.value)} className="py-2.5 group-focus-within:border-emerald-500/50" required />
                                        <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-emerald-500/50 transition-colors" />
                                    </div>

                                    <div className="md:col-span-2 input-label-border group mb-4">
                                        <label className="bg-white">Email Address</label>
                                        <input type="email" placeholder="john@freshkart.com" value={email} onChange={(e) => setEmail(e.target.value)} className="py-2.5 group-focus-within:border-emerald-500/50" required />
                                        <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-emerald-500/50 transition-colors" />
                                    </div>

                                    <div className="input-label-border group mb-4">
                                        <label className="bg-white">Password</label>
                                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="py-2.5 group-focus-within:border-emerald-500/50" required />
                                    </div>

                                    <div className="input-label-border group mb-4">
                                        <label className="bg-white">Confirm</label>
                                        <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="py-2.5 group-focus-within:border-emerald-500/50" required />
                                    </div>

                                    <div className="md:col-span-2 input-label-border group mb-4">
                                        <label className="bg-white">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="10-digit mobile number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            className="py-2.5 group-focus-within:border-emerald-500/50"
                                            required
                                        />
                                        <Phone size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-emerald-500/50 transition-colors" />
                                    </div>

                                    <div className="md:col-span-2 pt-1">
                                        <motion.button
                                            whileHover={{ scale: 1.01, backgroundColor: '#059669' }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-md uppercase tracking-wider text-xs transition-all disabled:opacity-50"
                                        >
                                            {loading ? 'Preparing...' : 'Create Account'}
                                        </motion.button>
                                    </div>
                                </form>

                                <div className="relative my-6 text-center">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                                    <span className="relative px-4 bg-white text-[8px] font-black text-gray-300 uppercase tracking-[0.3em] italic">Or Join With</span>
                                </div>

                                <div className="flex justify-center gap-6 mb-6">
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

                                <div className="text-center font-bold text-gray-400 text-xs">
                                    Account exists? <Link to="/login" className="text-gray-900 hover:text-emerald-700 transition-colors">Sign In</Link>
                                </div>
                            </motion.div>
                        )}



                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full text-center"
                            >
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                        className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-500/30 ring-8 ring-emerald-50"
                                    >
                                        <CheckCircle2 size={48} strokeWidth={2.5} />
                                    </motion.div>
                                    <h2 className="text-5xl font-black text-emerald-500 tracking-tight mb-3">Success!</h2>
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-8">Synchronizing Experience...</p>

                                    <div className="w-48 h-2 bg-emerald-50 rounded-full mx-auto relative overflow-hidden shadow-inner">
                                        <motion.div
                                            initial={{ left: "-100%" }}
                                            animate={{ left: "100%" }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute inset-0 bg-emerald-500"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default RegisterScreen;
