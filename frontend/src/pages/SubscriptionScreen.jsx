import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useCart } from '../context/CartContext';
import { Calendar, Clock, Package, ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SubscriptionScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { subscribeToProduct } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [frequency, setFrequency] = useState('daily');
    const [duration, setDuration] = useState('1 Month');
    const [deliveryTime, setDeliveryTime] = useState('Morning (6 AM - 9 AM)');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubscribe = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const startDate = tomorrow.toISOString().split('T')[0];

        subscribeToProduct(product, qty, frequency, startDate, {
            duration,
            deliveryTime,
            billingType: 'Postpaid'
        });
        navigate('/cart');
    };

    if (loading) return <div className="text-center py-20 font-bold text-gray-500 animate-pulse">Loading subscription details...</div>;
    if (!product) return <div className="text-center py-20 text-red-500">Product not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-4xl mx-auto px-4 pt-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Shop
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left: Product Preview */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-center aspect-square overflow-hidden group">
                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={product.image}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <div className="px-4">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{product.name}</h1>
                            <p className="text-gray-500 font-medium leading-relaxed line-clamp-2">{product.description}</p>
                            <div className="flex items-center gap-2 mt-4 text-emerald-600">
                                <Sparkles size={18} />
                                <span className="font-black text-sm uppercase tracking-wider">Premium Subscription</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Subscription Form */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-emerald-500/5 border border-emerald-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                            Customize Schedule
                        </h2>

                        <div className="space-y-8">
                            {/* Frequency Selection */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                    <Calendar size={14} />
                                    Frequency
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['daily', 'weekly', 'monthly'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFrequency(f)}
                                            className={`py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${frequency === f
                                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200'
                                                    : 'bg-white text-gray-400 border-gray-100 hover:border-emerald-200 hover:text-emerald-600'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selection */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                    <Package size={14} />
                                    Quantity per delivery
                                </label>
                                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl w-fit">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-black hover:text-emerald-600 transition-colors shadow-sm"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-black text-gray-900 w-8 text-center">{qty}</span>
                                    <button
                                        onClick={() => setQty(qty + 1)}
                                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-black hover:text-emerald-600 transition-colors shadow-sm"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Time Slot Selection */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                    <Clock size={14} />
                                    Delivery Time Slot
                                </label>
                                <select
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white p-4 rounded-2xl font-bold text-gray-800 outline-none transition-all cursor-pointer"
                                    value={deliveryTime}
                                    onChange={(e) => setDeliveryTime(e.target.value)}
                                >
                                    <option>Morning (6 AM - 9 AM)</option>
                                    <option>Mid-day (11 AM - 2 PM)</option>
                                    <option>Evening (5 PM - 8 PM)</option>
                                </select>
                            </div>

                            {/* Duration Selection */}
                            <div className="space-y-4">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Duration</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['1 Month', '3 Months', '6 Months', 'Yearly'].map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => setDuration(d)}
                                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${duration === d
                                                    ? 'bg-gray-900 text-white border-gray-900'
                                                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                                                }`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={handleSubscribe}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98] mt-6 flex items-center justify-center gap-3"
                            >
                                Start Subscription
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionScreen;
