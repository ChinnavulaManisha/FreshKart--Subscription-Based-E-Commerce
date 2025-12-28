import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { Package, Truck, CheckCircle, Home, Clock, AlertCircle } from 'lucide-react';

const TrackOrderScreen = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Determine token (Admin might view user order, or User view own)
                const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
                const token = userInfo?.token;

                if (!token) {
                    setError('Not authorized');
                    setLoading(false);
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                // Fetch single order directly from backend
                const { data } = await axios.get(`/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to load order');
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    if (error || !order) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-4">
            <AlertCircle size={48} className="text-gray-300 mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">We couldn't find that order</h1>
            <p className="text-gray-500 mb-6">{error || "It might belong to a different account."}</p>
            <Link to="/" className="px-6 py-2 bg-yellow-400 font-bold rounded text-gray-900">Go Home</Link>
        </div>
    );

    const steps = [
        { status: 'Order Placed', label: 'Ordered', icon: Package, date: order.createdAt },
        { status: 'Confirmed', label: 'Confirmed', icon: CheckCircle, date: null },
        { status: 'Packed', label: 'Packed', icon: Package, date: null },
        { status: 'Shipped', label: 'Shipped', icon: Truck, date: null },
        { status: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, date: null },
        { status: 'Delivered', label: 'Delivered', icon: Home, date: order.isDelivered ? order.deliveredAt : null },
    ];

    const currentStatusIndex = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].indexOf(order.orderStatus || 'Order Placed');

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Your Order</h1>
                        <p className="text-sm text-gray-500">Order ID: #{order._id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Main: Tracker */}
                    <div className="lg:col-span-2 space-y-6">

                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            <h2 className="font-bold text-lg text-gray-900 mb-6">Delivery Status</h2>

                            {/* Visual Tracker */}
                            <div className="relative mb-2 px-2">
                                <div className="absolute top-3 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                                <div
                                    className="absolute top-3 left-0 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-1000"
                                    style={{ width: `${(currentStatusIndex / (steps.length - 1)) * 100}%` }}
                                ></div>

                                <div className="flex justify-between">
                                    {steps.map((step, idx) => {
                                        const isCompleted = idx <= currentStatusIndex;

                                        return (
                                            <div key={idx} className="flex flex-col items-center gap-2">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 bg-white ${isCompleted
                                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                                    : 'border-gray-300 text-gray-300'
                                                    }`}>
                                                    {isCompleted ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-gray-300 rounded-full"></div>}
                                                </div>
                                                <p className={`text-[10px] font-bold uppercase tracking-wider text-center ${isCompleted ? 'text-emerald-700' : 'text-gray-400'
                                                    }`}>{step.label}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Detailed Text Timeline */}
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4">Latest Updates</h3>
                                <div className="space-y-4">
                                    {order.trackingHistory?.slice().reverse().map((h, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="text-xs text-gray-500 min-w-[120px]">
                                                {new Date(h.date).toLocaleDateString()} {new Date(h.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="border-l-2 border-emerald-100 pl-4 pb-2 relative">
                                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-400"></div>
                                                <p className="text-sm font-bold text-gray-900">{h.status}</p>
                                                <p className="text-sm text-gray-600">{h.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex gap-4 items-start">
                                        <div className="text-xs text-gray-500 min-w-[120px]">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="border-l-2 border-emerald-100 pl-4 relative">
                                            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-400"></div>
                                            <p className="text-sm font-bold text-gray-900">Order Placed</p>
                                            <p className="text-sm text-gray-600">Your order has been placed.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            <h2 className="font-bold text-lg text-gray-900 mb-4">Package Contents</h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <img src={item.image} className="w-16 h-16 object-contain border rounded p-1" alt={item.name} />
                                        <div>
                                            <Link to={`/product/${item.product}`} className="font-bold text-gray-900 hover:text-emerald-600 line-clamp-2">{item.name}</Link>
                                            <p className="text-xs text-gray-500">Qty: {item.qty} | Price: ₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase">Shipping Address</h3>
                            <div className="text-sm text-gray-600">
                                <p className="font-bold text-gray-900 mb-1">{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city},{order.shippingAddress.state}</p>
                                <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase">Payment Summary</h3>
                            <div className="text-sm text-gray-600 space-y-2">
                                <div className="flex justify-between">
                                    <span>Method</span>
                                    <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Item(s) Subtotal</span>
                                    <span>₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900">
                                    <span>Grand Total</span>
                                    <span>₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrackOrderScreen;
