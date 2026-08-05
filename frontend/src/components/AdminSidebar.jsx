
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', name: 'Overview', icon: LayoutDashboard },
        { path: '/admin/productlist', name: 'Products', icon: Package },
        { path: '/admin/orders', name: 'Orders', icon: ShoppingBag },
        { path: '/admin/users', name: 'Customers', icon: Users },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden glass-effect"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-72 bg-white text-gray-700 transition-transform duration-300 ease-in-out border-r border-gray-200 shadow-sm
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-between px-8 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 p-2 rounded-lg shadow-sm">
                            <span className="font-black text-xl tracking-tighter text-white">FK</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">Admin<span className="text-emerald-500">Panel</span></span>
                    </div>
                    <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-gray-900">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 mt-4 overflow-y-auto h-[calc(100vh-160px)] custom-scrollbar">
                    <div className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Main Menu</div>

                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                className={`
                                    flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold
                                    ${isActive
                                        ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-600'}
                                `}
                            >
                                <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500 transition-colors'} />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all font-bold"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
