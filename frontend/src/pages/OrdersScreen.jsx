import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag, AlertCircle } from 'lucide-react';

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('/orders/my', config);
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold">Retry</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Order History</h1>
                        <p className="text-gray-500 mt-2">Check the status of your recent orders</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <ShoppingBag size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't bought anything yet. Explore our products and start shopping for your daily essentials.</p>
                        <Link to="/" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1">
                            Start Shopping <ChevronRight size={20} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    {/* Order Info */}
                                    <div className="space-y-4 flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                #{order._id.substring(0, 10)}
                                            </span>
                                            <span className="text-gray-400 text-sm font-medium">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 items-center">
                                            {/* Order Status Badge */}
                                            {order.orderStatus === 'Cancelled' ? (
                                                <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold border border-red-100">
                                                    <AlertCircle size={16} /> Cancelled
                                                </div>
                                            ) : order.isDelivered ? (
                                                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-100">
                                                    <CheckCircle size={16} /> Delivered
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-bold border border-amber-100">
                                                    <Truck size={16} /> Processing
                                                </div>
                                            )}

                                            {/* Payment Status Badge */}
                                            {order.isPaid ? (
                                                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-100">
                                                    <CheckCircle size={16} /> Paid
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold border border-red-100">
                                                    <Clock size={16} /> Payment Pending
                                                </div>
                                            )}
                                        </div>

                                        {/* Items Preview */}
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {order.orderItems.slice(0, 4).map((item, idx) => (
                                                <div key={idx} className="relative w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 p-2">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                    <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                                                        {item.qty}
                                                    </span>
                                                </div>
                                            ))}
                                            {order.orderItems.length > 4 && (
                                                <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs flex-shrink-0">
                                                    +{order.orderItems.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action & Total */}
                                    <div className="flex flex-col justify-between items-end min-w-[150px] border-l border-gray-100 pl-6 border-dashed md:border-solid">
                                        <div className="text-right mb-4">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                                            <p className="text-2xl font-black text-gray-900">₹{order.totalPrice}</p>
                                        </div>
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-gray-200 hover:shadow-emerald-200 hover:-translate-y-1"
                                        >
                                            View Order <ArrowRightIcon className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Icon Component
const ArrowRightIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

export default OrdersScreen;
