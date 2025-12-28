
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Truck, CheckCircle, Clock, XCircle, Package, Calendar } from 'lucide-react';

const AdminOrderListScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        let result = orders;

        // Search Filter
        if (searchTerm) {
            result = result.filter(order =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Status Filter
        if (statusFilter !== 'All') {
            if (statusFilter === 'Delivered') {
                result = result.filter(order => order.isDelivered);
            } else if (statusFilter === 'Pending') {
                result = result.filter(order => !order.isDelivered);
            } else if (statusFilter === 'Paid') {
                result = result.filter(order => order.isPaid);
            } else if (statusFilter === 'Unpaid') {
                result = result.filter(order => !order.isPaid);
            }
        }

        setFilteredOrders(result);
    }, [orders, searchTerm, statusFilter]);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/orders');
            setOrders(data);
            setFilteredOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders', error);
            setLoading(false);
        }
    };

    const markAsDelivered = async (id) => {
        if (window.confirm('Mark this order as delivered?')) {
            try {
                await axios.put(`/orders/${id}/deliver`);
                fetchOrders();
            } catch (error) {
                console.error('Error updating order', error);
                alert("Failed to update status");
            }
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Orders...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Truck className="text-emerald-600" size={32} /> Order Management
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Track and manage customer orders</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer Name..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['All', 'Pending', 'Delivered', 'Paid', 'Unpaid'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${statusFilter === tab
                                ? 'bg-white text-emerald-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Payment</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Delivery</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500 font-bold">
                                        #{order._id.substring(0, 10).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{order.user ? order.user.name : 'Unknown User'}</div>
                                        <div className="text-xs text-gray-400">{order.user && order.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <Calendar size={14} className="text-gray-400" />
                                            {order.createdAt.substring(0, 10)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.isPaid ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                Paid {order.paidAt && order.paidAt.substring(0, 10)}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.isDelivered ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                Delivered {order.deliveredAt && order.deliveredAt.substring(0, 10)}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                Processing
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-gray-900">
                                        ₹{order.totalPrice}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {order.orderStatus === 'Cancelled' ? (
                                            <span className="text-[10px] text-red-500 font-bold italic">
                                                (Order cancelled by the customer)
                                            </span>
                                        ) : (
                                            !order.isDelivered && (
                                                <button
                                                    onClick={() => markAsDelivered(order._id)}
                                                    className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition shadow-sm active:scale-95"
                                                >
                                                    Mark Delivered
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length === 0 && (
                    <div className="p-12 text-center">
                        <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-400 font-medium">No orders found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrderListScreen;
