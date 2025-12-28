import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
    Clock,
    Gift,
    Package,
    RotateCcw,
    Apple,
    Wheat,
    Coffee,
    Drumstick,
    Heart,
    Sparkles,
    ArrowRight,
} from "lucide-react";

/**
 * Static Asset Definitions
 * Using local and high-quality Unsplash placeholders for hero imagery
 */
const heroVeggies = "/hero-basket.jpg";
const personalCareImg = "/personal-care.png";
const drinksImg = "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop";
const iceCreamImg = "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=400&auto=format&fit=crop";

/**
 * Landing Page Component
 * The high-conversion entry point for new users and returning customers
 */
const LandingPage = () => {
    // Auth Logic: Determines if the user is redirected to Shop or Login
    const { user } = useAuth();
    const isAuthenticated = !!user;

    // UI Configuration for Product Categories
    const categories = [
        { icon: Wheat, label: "Dairy, Bread & Eggs", color: "bg-blue-100 text-blue-600" },
        { icon: Apple, label: "Fruits & Vegetables", color: "bg-green-100 text-green-600" },
        { icon: Package, label: "Snacks & Munchies", color: "bg-yellow-100 text-yellow-600" },
        { icon: Coffee, label: "Bakery & Biscuits", color: "bg-orange-100 text-orange-600" },
        { icon: Package, label: "Cold Drinks & Juices", color: "bg-cyan-100 text-cyan-600" },
        { icon: Drumstick, label: "Chicken, Meat & Fish", color: "bg-red-100 text-red-600" },
        { icon: Heart, label: "Baby Care", color: "bg-pink-100 text-pink-600" },
        { icon: Sparkles, label: "Cleaning Essentials", color: "bg-purple-100 text-purple-600" },
    ];

    // Core Value Propositions
    const features = [
        {
            icon: Clock,
            title: "10 minute grocery now",
            description: "Get your order delivered to your doorstep at the earliest.",
            color: "text-blue-600",
        },
        {
            icon: Gift,
            title: "Best Prices & Offers",
            description: "Cheaper prices than your local supermarket.",
            color: "text-emerald-600",
        },
        {
            icon: Package,
            title: "Wide Assortment",
            description: "5000+ products across all grocery categories.",
            color: "text-purple-600",
        },
        {
            icon: RotateCcw,
            title: "Easy Returns",
            description: "Doorstep returns with instant refunds.",
            color: "text-orange-600",
        },
    ];

    // Dynamic Promotional Content
    const promoBanners = [
        {
            title: "10% cashback on personal care",
            subtitle: "Max cashback: ₹120",
            bg: "bg-blue-50",
            img: personalCareImg,
        },
        {
            title: "Say yes to season's fresh",
            subtitle: "Refresh your day the fruity way",
            bg: "bg-yellow-50",
            img: drinksImg,
        },
        {
            title: "When in doubt, eat ice cream",
            subtitle: "Enjoy a scoop of summer today",
            bg: "bg-pink-50",
            img: iceCreamImg,
        },
    ];

    return (
        <div className="min-h-screen font-sans bg-white pb-20">
            {/* HER0: Entrance animations powered by Framer Motion */}
            <section className="relative py-16 md:py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">

                        {/* LEFT CONTENT: Animates in from the left */}
                        <motion.div
                            initial={{ opacity: 0, x: -80 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f85c5c] text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-red-100">
                                Exclusive Offer 10%
                            </span>

                            <h1 className="text-5xl md:text-6xl font-black text-[#1a1a1a] mb-5 leading-[1.1] tracking-tight">
                                SuperMarket For <br />
                                <span className="text-emerald-500">Fresh Grocery</span>
                            </h1>

                            <p className="text-gray-500 text-lg mb-8 max-w-lg leading-relaxed font-medium">
                                Introduced a new model for online grocery shopping and convenient home delivery.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to={isAuthenticated ? "/shop" : "/login"}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-black text-base flex items-center gap-2 transition-all shadow-xl shadow-emerald-100 transform hover:-translate-y-1 active:scale-95"
                                >
                                    Get Started <ArrowRight size={20} strokeWidth={3} />
                                </Link>
                                <Link
                                    to="/products"
                                    className="bg-white border-2 border-emerald-500 text-emerald-600 px-8 py-3.5 rounded-xl font-black text-base transition-all hover:bg-emerald-50 active:scale-95"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        </motion.div>

                        {/* RIGHT IMAGE: Animates in from the right with a delay */}
                        <motion.div
                            initial={{ opacity: 0, x: 80 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            className="relative flex justify-center"
                        >
                            <div className="absolute inset-0 bg-emerald-100 rounded-full blur-[80px] opacity-20 -z-10 scale-110"></div>
                            <img
                                src={heroVeggies}
                                alt="Fresh Grocery Basket"
                                className="max-w-[100%] w-[100%] h-auto object-contain drop-shadow-[0_20px_50px_rgba(16,185,129,0.15)]"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* PROMO: Visual grid of current offers */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {promoBanners.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`${b.bg} relative overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer h-[280px]`}
                            >
                                <div className="relative z-10 h-full p-8 flex flex-col justify-end w-[55%]">
                                    <div>
                                        <h3 className="font-bold text-2xl mb-2 text-gray-800 leading-tight">{b.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{b.subtitle}</p>
                                    </div>
                                    <Link
                                        to="/products"
                                        className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold inline-block hover:bg-gray-800 transition-colors w-fit"
                                    >
                                        Shop Now
                                    </Link>
                                </div>

                                <img
                                    src={b.img}
                                    alt=""
                                    className="absolute right-0 top-0 h-full w-[45%] object-cover rounded-r-3xl transition-transform group-hover:scale-110 duration-500"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CATEGORIES: Quick-access navigation cards */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-black text-gray-900 mb-4">
                        Shop Popular Categories
                    </h2>
                    <p className="text-gray-500 mb-16 max-w-xl mx-auto font-medium">
                        Freshness delivered right to your door with our wide variety of categories.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {categories.map((c, i) => {
                            const Icon = c.icon;
                            return (
                                <Link
                                    to="/products"
                                    key={i}
                                    className="bg-white rounded-3xl p-8 text-center hover:shadow-2xl hover:shadow-emerald-100 transition-all transform hover:-translate-y-2 group"
                                >
                                    <div
                                        className={`${c.color} w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6`}
                                    >
                                        <Icon size={36} />
                                    </div>
                                    <p className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors uppercase text-sm tracking-widest">{c.label}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FEATURES: Visual breakdown of service benefits */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                            Why Choose FreshKart?
                        </h2>
                        <div className="h-1.5 w-24 bg-emerald-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                                    <div className={`${f.color} mb-6 bg-gray-50 w-16 h-16 flex items-center justify-center rounded-2xl transition-colors group-hover:bg-emerald-50`}>
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="font-black text-lg mb-3 text-gray-800 tracking-tight">{f.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION: Encourages user to sign up for subscriptions */}
            <section className="py-20 mb-10">
                <div className="container mx-auto px-6">
                    <div className="bg-[#111] rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/20 rounded-full -mr-40 -mt-40 blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/20 rounded-full -ml-40 -mb-40 blur-[100px]"></div>

                        <h2 className="text-5xl md:text-6xl font-black mb-8 relative z-10 leading-tight">Start Your Subscription <br /> & Save Thousands</h2>
                        <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed font-medium">
                            Get fresh groceries delivered daily with our flexible subscription plans.
                            Cancel or pause anytime. No hidden fees.
                        </p>
                        <div className="flex justify-center gap-6 relative z-10">
                            <Link to="/register" className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 transform hover:-translate-y-1">
                                Join Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
