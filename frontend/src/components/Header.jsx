import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Leaf, Search, Sparkles, Tag, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const isLandingPage = location.pathname === '/';
    const [currentPromo, setCurrentPromo] = React.useState(0);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const dropdownTimeoutRef = React.useRef(null);

    const promoMessages = [
        "🎉 Super Value Deals - Save More with Coupons",
        "🚚 Free Delivery on Orders Above ₹500",
        "⚡ Flash Sale - Up to 50% Off on Fresh Produce"
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromo((prev) => (prev + 1) % promoMessages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const logoutHandler = () => {
        logout();
        navigate('/logged-out');
    };

    const handleMouseEnter = () => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setShowDropdown(true);
    };

    const handleMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setShowDropdown(false);
        }, 300); // 300ms delay for stability
    };

    return (
        <header className="bg-white">
            {/* Promo Bar */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white text-center py-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBfiWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                <div className="relative h-6 flex items-center justify-center">
                    {promoMessages.map((message, index) => (
                        <span
                            key={index}
                            className={`absolute text-sm font-black tracking-wider uppercase transition-all duration-700 ease-in-out ${index === currentPromo
                                ? 'opacity-100 translate-x-0'
                                : index === (currentPromo - 1 + promoMessages.length) % promoMessages.length
                                    ? 'opacity-0 -translate-x-full'
                                    : 'opacity-0 translate-x-full'
                                }`}
                        >
                            {message}
                        </span>
                    ))}
                </div>
            </div>

            <div className={`bg-white transition-all duration-300 ${isLandingPage ? 'sticky top-0 z-50 shadow-sm' : ''}`}>
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0">
                        <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
                            <ShoppingCart size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tighter">
                            Fresh<span className="text-emerald-500">Kart</span>
                        </span>
                    </Link>


                    {/* Navigation Links */}
                    <nav className="flex items-center gap-6 shrink-0">
                        <Link to="/shop" className="text-gray-700 font-bold hover:text-emerald-600 transition-colors">Home</Link>
                        <Link to="/products" className="text-gray-700 font-bold hover:text-emerald-600 transition-colors">Groceries</Link>

                        {user && !user.isAdmin && (
                            <>
                                <Link to="/subscriptions" className="hidden lg:block text-gray-700 font-bold hover:text-emerald-600 transition-colors">My Subscriptions</Link>
                                <Link to="/orders" className="hidden lg:block text-gray-700 font-bold hover:text-emerald-600 transition-colors">My Orders</Link>
                            </>
                        )}

                        {!user?.isAdmin && (
                            <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors p-2 bg-gray-50 rounded-full px-4">
                                <div className="relative">
                                    <ShoppingCart size={20} />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                            {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                        </span>
                                    )}
                                </div>
                                <span className="font-bold hidden sm:block">Cart</span>
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-4">
                                <div
                                    className="relative py-2"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <button className="flex items-center text-gray-700 font-bold hover:text-emerald-600 transition-colors">
                                        <User className="w-5 h-5 mr-1" />
                                        {user.name}
                                    </button>
                                    {showDropdown && (
                                        <div className="absolute right-0 w-48 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">
                                                {user && !user.isAdmin && (
                                                    <>
                                                        <Link to="/subscriptions" className="block lg:hidden px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium">Subscriptions</Link>
                                                        <Link to="/orders" className="block lg:hidden px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium">Orders</Link>
                                                    </>
                                                )}
                                                <Link to="/profile" className="block px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium border-t border-gray-50">Profile</Link>
                                                {user.isAdmin && (
                                                    <Link to="/admin/dashboard" className="block px-4 py-3 hover:bg-emerald-50 text-emerald-700 font-bold border-t border-gray-50">
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button onClick={logoutHandler} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 font-bold hover:text-emerald-600 transition-colors">Login</Link>
                                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-emerald-100">
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
