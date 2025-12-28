import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, RefreshCw, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CartScreen = () => {
    const { cartItems, removeFromCart, updateQuantity, cartStats } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const checkoutHandler = () => {
        if (user) {
            navigate('/shipping');
        } else {
            navigate('/login?redirect=/shipping');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-64 h-64 bg-emerald-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="w-32 h-32 opacity-80 mix-blend-multiply" />
                </div>
                <h2 className="text-4xl font-black text-emerald-950 mb-4 tracking-tight">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-md text-lg font-medium">Looks like you haven't added any fresh essentials yet. Let's fill it up with goodness!</p>
                <Link to="/shop" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl shadow-emerald-200 hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3">
                    <ArrowLeft size={20} /> Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Shopping Cart</h1>
                        <p className="text-gray-500 font-medium">You have <span className="text-emerald-600 font-bold">{cartItems.reduce((acc, item) => acc + item.qty, 0)} items</span> in your cart</p>
                    </div>
                    <Link to="/shop" className="hidden md:flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                        <ArrowLeft size={18} /> Continue Shopping
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3 xl:w-3/4 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.cartKey} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow group">
                                {/* Image */}
                                <Link to={`/product/${item._id}`} className="shrink-0 relative">
                                    <div className="w-32 h-32 bg-gray-50 rounded-2xl p-4 flex items-center justify-center">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                </Link>

                                {/* Info */}
                                <div className="flex-grow text-center sm:text-left w-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <Link to={`/product/${item._id}`} className="text-xl font-bold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-2">
                                                {item.name}
                                            </Link>
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{item.brand || 'FreshKart Essentials'}</div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <div className="text-2xl font-black text-gray-900">₹{item.price}</div>
                                            {item.originalPrice > item.price && (
                                                <div className="text-sm text-gray-400 line-through font-medium">₹{item.originalPrice}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Meta Badges */}
                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1">
                                            In Stock
                                        </span>
                                        {item.isSubscription && (
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg flex items-center gap-1 border border-indigo-100">
                                                <RefreshCw size={12} /> {item.frequency} Subscription
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                            <button
                                                onClick={() => updateQuantity(item.cartKey, Math.max(1, Number(item.qty) - 1))}
                                                disabled={item.qty <= 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-gray-900">{item.qty}</span>
                                            <button
                                                onClick={() => updateQuantity(item.cartKey, Number(item.qty) + 1)}
                                                disabled={item.qty >= item.countInStock}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.cartKey)}
                                            className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold text-sm transition-colors py-2 px-4 rounded-xl hover:bg-red-50"
                                        >
                                            <Trash2 size={16} /> <span className="hidden sm:inline">Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Card */}
                    <div className="lg:w-1/3 xl:w-1/4">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 sticky top-28 border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{cartStats.itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Tax estimate</span>
                                    <span>₹0.00</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-end">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-3xl font-black text-emerald-600 tracking-tight">₹{cartStats.itemsPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={checkoutHandler}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                            >
                                Checkout Now <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={20} />
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-4 text-gray-400 grayscale opacity-60">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png" className="h-6" alt="Mastercard" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4" alt="Visa" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" className="h-4" alt="UPI" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartScreen;
