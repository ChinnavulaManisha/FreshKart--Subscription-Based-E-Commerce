import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Calendar, RefreshCw, Clock, CreditCard, ChevronRight, Package, AlertCircle, CheckCircle } from 'lucide-react';

const MySubscriptionsScreen = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const fetchSubscriptions = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('/subscriptions/my', config);
            setSubscriptions(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const cancelHandler = async (id, billingType) => {
        if (window.confirm('Are you sure you want to cancel this subscription?')) {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.put(`/subscriptions/${id}`, { status: 'cancelled' }, config);

                const feedback = billingType === 'Prepaid'
                    ? 'Payment should be received in your account within 2-3 days'
                    : 'Order cancelled';

                setMessage(feedback);
                fetchSubscriptions();

                // Clear message after 5 seconds
                setTimeout(() => setMessage(null), 5000);
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Loading your subscriptions...</div>;

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">My Subscriptions</h1>
                    <p className="text-gray-500 mt-1">Manage your recurring deliveries and habits.</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    {subscriptions.filter(s => s.status === 'active').length} Active
                </div>
            </div>

            {message && (
                <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                    <p className="text-emerald-800 font-bold flex items-center gap-2">
                        <CheckCircle size={18} /> {message}
                    </p>
                </div>
            )}

            {subscriptions.filter(s => s.status !== 'cancelled').length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RefreshCw size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">No active subscriptions</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">Subscribe to your favorite daily essentials and never run out of stock.</p>
                    <Link to="/products" className="bg-amazon_yellow hover:bg-amazon_orange text-gray-900 font-bold py-2 px-8 rounded-lg shadow-sm">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {subscriptions.filter(s => s.status !== 'cancelled').map((sub) => (
                        <div key={sub._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                            {/* Product Info */}
                            <div className="p-6 md:w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center text-center">
                                <img src={sub.product?.image} alt={sub.product?.name} className="w-32 h-32 object-contain mix-blend-multiply mb-4" />
                                <h4 className="font-bold text-gray-900 line-clamp-2">{sub.product?.name}</h4>
                                <p className="text-amazon_orange font-bold text-lg mt-1">₹{sub.product?.price * sub.quantity}</p>
                            </div>

                            {/* Subscription Details */}
                            <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 flex items-center gap-1">
                                            <RefreshCw size={12} /> Frequency
                                        </p>
                                        <p className="font-bold text-gray-800 capitalize italic">{sub.frequency}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 flex items-center gap-1">
                                            <Clock size={12} /> Duration
                                        </p>
                                        <p className="font-bold text-gray-800">{sub.duration || 'Flexible'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 flex items-center gap-1">
                                            <Calendar size={12} /> Period
                                        </p>
                                        <p className="text-sm font-medium text-gray-700">
                                            {new Date(sub.startDate).toLocaleDateString()} — {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'Ongoing'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 flex items-center gap-1">
                                            <CreditCard size={12} /> Billing
                                        </p>
                                        <p className={`text-sm font-bold px-2 py-0.5 rounded-lg inline-block ${sub.billingType === 'Prepaid' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'}`}>
                                            {sub.billingType === 'Prepaid' ? 'Paid' : 'Postpaid'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-between border-t pt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <AlertCircle size={16} className="text-amazon_orange" />
                                        <span>Next Delivery: <span className="font-bold text-gray-700">{new Date(sub.nextDeliveryDate).toLocaleDateString()}</span></span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-xs font-bold text-gray-500 hover:text-gray-800 px-3 py-1 border rounded transition">Pause</button>
                                        <button
                                            onClick={() => cancelHandler(sub._id, sub.billingType)}
                                            className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1 border border-red-100 bg-red-50 rounded transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-12 bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
                <Package className="text-amber-600 flex-shrink-0" size={24} />
                <div>
                    <h5 className="font-bold text-amber-900">About FreshKart Subscriptions</h5>
                    <p className="text-sm text-amber-800 mt-1">Subscribed items are delivered automatically based on your frequency. You can pause or cancel at any time before the next delivery date. Billing happens per delivery unless marked as Prepaid.</p>
                </div>
            </div>
        </div>
    );
};

export default MySubscriptionsScreen;
