import React from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    MapPin,
    Phone,
    ArrowRight,
    ShoppingCart,
    ChevronUp
} from 'lucide-react';

const Footer = () => {
    const [newsletterEmail, setNewsletterEmail] = React.useState('');
    const [newsletterMessage, setNewsletterMessage] = React.useState('');

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!newsletterEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setNewsletterMessage('Please enter a valid email address');
            setTimeout(() => setNewsletterMessage(''), 3000);
            return;
        }
        setNewsletterMessage('✓ Successfully subscribed!');
        setNewsletterEmail('');
        setTimeout(() => setNewsletterMessage(''), 3000);
    };


    return (
        <footer className="font-sans">
            {/* Back to Top */}
            <button
                onClick={scrollToTop}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-4 font-bold transition-all duration-300 active:scale-95"
            >
                Back to top
            </button>

            {/* Main Footer Content */}
            <div className="bg-gray-950 text-white pt-12 pb-6">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Column 1: Brand & About */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
                                    <ShoppingCart size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-2xl font-black tracking-tighter">
                                    Fresh<span className="text-emerald-500">Kart</span>
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Your one-stop shop for fresh groceries and daily essentials. We deliver quality products straight to your doorstep with love and care.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center hover:bg-emerald-600 hover:scale-110 transition-all duration-300">
                                    <Facebook size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center hover:bg-emerald-600 hover:scale-110 transition-all duration-300">
                                    <Twitter size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center hover:bg-emerald-600 hover:scale-110 transition-all duration-300">
                                    <Instagram size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center hover:bg-emerald-600 hover:scale-110 transition-all duration-300">
                                    <Youtube size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Customer Care */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white border-l-4 border-emerald-500 pl-3">Customer Care</h3>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-2 group">
                                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    Help Center
                                </li>
                                <li className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-2 group">
                                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    Returns & Refunds
                                </li>
                                <li className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-2 group">
                                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    Shipping Info
                                </li>
                                <li className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-2 group">
                                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    Contact Us
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Contact Details */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white border-l-4 border-emerald-500 pl-3">Get in Touch</h3>
                            <ul className="space-y-5 text-sm text-gray-400">
                                <li className="flex items-start gap-3">
                                    <MapPin size={20} className="text-emerald-500 shrink-0" />
                                    <span>Sector 12, Noida, Uttar Pradesh 201301</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone size={20} className="text-emerald-500 shrink-0" />
                                    <span>+91 98765 43210</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail size={20} className="text-emerald-500 shrink-0" />
                                    <span>support@freshkart.com</span>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Newsletter */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white border-l-4 border-emerald-500 pl-3">Join Newsletter</h3>
                            <p className="text-sm text-gray-400 mb-4">Subscribe to get special offers and once-in-a-lifetime deals.</p>
                            <form onSubmit={handleNewsletterSubmit} className="relative">
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                                <button type="submit" className="absolute right-2 top-2 bg-emerald-500 hover:bg-emerald-600 p-1.5 rounded-lg transition-colors">
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                            {newsletterMessage && (
                                <div className={`mt-3 text-sm font-medium ${newsletterMessage.includes('✓') ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {newsletterMessage}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-900 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} <span className="text-emerald-500 font-semibold">FreshKart</span>.com, Inc. All rights reserved.
                        </div>
                        <div className="flex gap-8 text-xs font-medium text-gray-500">
                            <span className="hover:text-emerald-400 cursor-pointer transition-colors uppercase tracking-wider">Privacy Policy</span>
                            <span className="hover:text-emerald-400 cursor-pointer transition-colors uppercase tracking-wider">Terms of Service</span>
                            <span className="hover:text-emerald-400 cursor-pointer transition-colors uppercase tracking-wider">Cookie Policy</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
