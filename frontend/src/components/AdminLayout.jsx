import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Menu, Bell, Search, User, X, Package, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Search State
    const [searchTerm, setSearchTerm] = useState('');

    // Notifications State
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?.isAdmin) return;
            try {
                // Fetch low stock and info
                const { data: products } = await axios.get('/products');
                const lowStock = products.filter(p => p.countInStock < 10).map(p => ({
                    type: 'stock',
                    message: `Low Stock: ${p.name}`,
                    time: 'Action Needed',
                    link: `/admin/product/${p._id}/edit`,
                    id: p._id
                }));

                setNotifications(lowStock);
                setUnreadCount(lowStock.length);
            } catch (error) {
                console.error("Error fetching notifications", error);
            }
        };

        fetchNotifications();

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [user]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            if (!searchTerm.trim()) return;

            // Smart Redirect Logic
            if (searchTerm.toLowerCase().includes('order') || searchTerm.startsWith('#')) {
                navigate(`/admin/orders?search=${searchTerm.replace('#', '')}`);
            } else if (searchTerm.includes('@') || searchTerm.toLowerCase().includes('user')) {
                navigate(`/admin/users?search=${searchTerm}`);
            } else {
                // Default to product search
                navigate(`/admin/productlist?search=${searchTerm}`);
            }
            setSearchTerm(''); // Clear after search? Optional.
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen transition-all duration-300">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-500 hover:text-emerald-600 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all w-96">
                            <Search size={18} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products, orders, or users..."
                                className="bg-transparent border-none outline-none text-sm ml-3 w-full text-gray-700 placeholder:text-gray-400 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative transition-colors ${showNotifications ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-600'}`}
                            >
                                <Bell size={22} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                            </button>

                            {/* Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="font-bold text-gray-900">Notifications</h3>
                                        <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400 text-sm">No new notifications</div>
                                        ) : (
                                            notifications.map((note, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        navigate(note.link);
                                                        setShowNotifications(false);
                                                    }}
                                                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors flex gap-3 items-start"
                                                >
                                                    <div className={`mt-1 p-1.5 rounded-full ${note.type === 'stock' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        {note.type === 'stock' ? <AlertTriangle size={14} /> : <ShoppingBag size={14} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">{note.message}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{note.time}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                                        <button onClick={() => setShowNotifications(false)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Close</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                <p className="text-xs font-medium text-emerald-500">Administrator</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border-2 border-white shadow-sm ring-2 ring-gray-50">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-8 pb-20 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
