
import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import axios from '../api/axios';

const AdminDashboardScreen = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        lowStock: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetch for speed
                const [productsRes, analyticsRes] = await Promise.all([
                    axios.get('/products'),
                    axios.get('/orders/analytics')
                ]);

                const products = productsRes.data;
                const analytics = analyticsRes.data;

                const lowStockItems = products.filter(p => p.countInStock < 10);

                setStats({
                    totalProducts: analytics.totalProducts,
                    totalOrders: analytics.totalOrders,
                    totalUsers: analytics.totalUsers,
                    totalRevenue: analytics.totalSales,
                    lowStock: lowStockItems.slice(0, 5)
                });
                setLoading(false);
            } catch (error) {
                console.error("Dashboard Error:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                    <Icon size={24} className={`text-${color.split('-')[1]}-600`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trendValue}
                </div>
            </div>
            <div>
                <h3 className="text-gray-500 font-medium text-sm tracking-wide uppercase mb-1">{title}</h3>
                <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
            </div>
        </div>
    );

    if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Dashboard Analytics...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Dashboard Overview</h1>
                <p className="text-gray-500 font-medium">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                    trend="up"
                    trendValue="+12.5%"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                    trend="up"
                    trendValue="+8.1%"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-amber-500"
                    trend="up"
                    trendValue="+2.3%"
                />
                <StatCard
                    title="Active Customers"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-purple-500"
                    trend="up"
                    trendValue="+4.6%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Low Stock Alert */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-amber-500" size={20} />
                            <h2 className="text-lg font-bold text-gray-900">Low Stock Alerts</h2>
                        </div>
                        <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase tracking-wider">
                            {stats.lowStock.length} Items needing attention
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.lowStock.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-400 font-medium">Running smoothly! No low stock items.</td>
                                    </tr>
                                ) : (
                                    stats.lowStock.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 p-1">
                                                        <img src={product.image} alt="" className="w-full h-full object-contain" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm truncate max-w-[200px]">{product.name}</p>
                                                        <p className="text-xs text-gray-500">₹{product.price}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${product.countInStock === 0 ? 'bg-red-500' : 'bg-amber-500'}`}
                                                            style={{ width: `${Math.min((product.countInStock / 20) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-xs font-bold ${product.countInStock === 0 ? 'text-red-500' : 'text-amber-600'}`}>
                                                        {product.countInStock} Left
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <a href={`/admin/product/${product._id}/edit`} className="text-emerald-600 font-bold text-xs hover:underline">Restock</a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity / Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
                        <h2 className="text-xl font-bold mb-2">Pro Tip</h2>
                        <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
                            Keep your inventory updated. Products with professional images and detailed descriptions sell 35% faster.
                        </p>
                        <button className="w-full bg-white text-emerald-700 font-bold py-3 rounded-xl shadow-sm hover:shadow-md hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                            <TrendingUp size={18} /> View Analytics Report
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="text-gray-400" size={20} />
                            <h2 className="text-lg font-bold text-gray-900">Recent Updates</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">New order #1234 received</p>
                                    <p className="text-xs text-gray-400 mt-0.5">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Product "Tide 10kg" updated</p>
                                    <p className="text-xs text-gray-400 mt-0.5">15 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-2 h-2 mt-2 rounded-full bg-purple-500 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">3 New Customers registered</p>
                                    <p className="text-xs text-gray-400 mt-0.5">1 hour ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardScreen;
