import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import {
    Package, Truck, MapPin, CreditCard, Calendar,
    ArrowLeft, CheckCircle, Clock, ShoppingBag,
    Download, ShieldCheck, Mail, Phone, AlertCircle
} from 'lucide-react';

const OrderDetailsScreen = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

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
                <Link to="/orders" className="text-emerald-600 font-bold hover:underline">Go Back to Orders</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <Link to="/orders" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold mb-2 transition-colors">
                            <ArrowLeft size={16} /> Back to Orders
                        </Link>
                        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                            Order #{order._id.substring(0, 10)}
                            <span className="text-sm font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                        </h1>
                    </div>
                    {(order.isPaid && !order.isDelivered) && (
                        <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100">
                            <Package size={18} /> Preparing for Dispatch
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <ShoppingBag className="text-emerald-600" /> Items in this Order
                            </h2>
                            <div className="space-y-6">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-6 items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-contain mix-blend-multiply bg-white rounded-xl p-2 border border-gray-100" />
                                        <div className="flex-grow">
                                            <Link to={`/product/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-1">
                                                {item.name}
                                            </Link>
                                            <p className="text-gray-500 text-sm mt-1">Qty: {item.qty} × ₹{item.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900">₹{(item.price * item.qty).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping & Payment Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Info */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <MapPin size={80} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Truck size={18} className="text-gray-400" /> Shipping Details
                                </h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p className="font-bold text-gray-900 text-base mb-2">{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                    <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                                    <div className="pt-4 mt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <ShieldCheck size={14} className="text-emerald-500" />
                                            <span className="font-bold text-gray-900">Delivery Status</span>
                                        </div>
                                        {order.isDelivered ? (
                                            <p className="text-emerald-600 font-medium">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</p>
                                        ) : (
                                            <p className="text-amber-600 font-medium">Not Delivered Yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <CreditCard size={80} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard size={18} className="text-gray-400" /> Payment Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Method</p>
                                        <p className="text-gray-900 font-bold">{order.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                        {order.isPaid ? (
                                            <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                                <CheckCircle size={16} /> Paid on {new Date(order.paidAt).toLocaleDateString()}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-700 font-bold">
                                                <Clock size={16} /> Not Paid
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 sticky top-8 border border-gray-100">
                            <h3 className="font-black text-2xl text-gray-900 mb-8">Order Summary</h3>

                            <div className="space-y-4 mb-8 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Items subtotal</span>
                                    <span className="font-bold text-gray-900">₹{order.itemsPrice ? order.itemsPrice.toFixed(2) : (order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-gray-900 font-bold">₹{order.shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Tax</span>
                                    <span className="font-bold text-gray-900">₹{order.taxPrice.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-end">
                                    <span className="font-bold text-gray-900 text-lg">Total Paid</span>
                                    <span className="text-3xl font-black text-gray-900">₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mb-4">
                                <Download size={18} /> Download Invoice
                            </button>
                            <div className="text-center">
                                <Link to="/orders" className="text-gray-500 hover:text-gray-900 text-sm font-bold">
                                    Need help with this order?
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsScreen;
