import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from '../api/axios';
import { MapPin, CreditCard, ShoppingBag, Package, Truck, Info, ArrowLeft, CheckCircle } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const { cartItems, cartStats, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    // Get stored data
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
    const paymentMethod = localStorage.getItem('paymentMethod');
    const paymentDetails = JSON.parse(localStorage.getItem('paymentDetails') || '{}');
    const upiApp = paymentDetails.upiApp;

    if (!shippingAddress) {
        navigate('/shipping');
    }
    if (!paymentMethod) {
        navigate('/payment');
    }

    // Calculate final totals
    const isCOD = paymentMethod === 'Cash on Delivery';
    const codCharge = isCOD ? 9 : 0;
    const finalTotal = Number(cartStats.totalPrice) + codCharge;

    const placeOrderHandler = async () => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: Number(item.price),
                    product: item._id,
                    isSubscription: item.isSubscription || false,
                    frequency: item.frequency,
                    startDate: item.startDate,
                })),
                shippingAddress,
                paymentMethod: paymentMethod || 'Cash on Delivery',
                itemsPrice: Number(cartStats.itemsPrice),
                shippingPrice: Number(cartStats.shippingPrice),
                taxPrice: Number(cartStats.taxPrice),
                totalPrice: Number(finalTotal),
                codCharge: Number(codCharge),
                isPaid: !isCOD
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.post('/orders', orderData, config);

            // Cleanup
            clearCart();
            localStorage.removeItem('shippingAddress');
            localStorage.removeItem('paymentMethod');
            localStorage.removeItem('paymentDetails');

            // Direct Redirection
            navigate('/order-success', { state: { orderId: data._id } });

        } catch (error) {
            console.error('Order placement error details:', error);
            const message = error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
            alert(`Order placement failed: ${message}`);
            setLoading(false);
        }
    };

    if (!shippingAddress || !paymentMethod) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white relative">
            {/* BRAND THEMED LOADING OVERLAY */}
            {loading && (
                <div className="fixed inset-0 z-[999] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center animate-in fade-in duration-300">
                        {/* FreshKart Logo with subtle float animation */}
                        <div className="mb-6 relative">
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/10 border border-emerald-100 animate-bounce">
                                <ShoppingBag size={48} strokeWidth={2.5} />
                            </div>
                            {/* Simple circular spinner around the logo */}
                            <div className="absolute -inset-4 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                        </div>

                        {/* Minimalistic status message */}
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Processing Order</h3>
                            <div className="flex justify-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75"></span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150"></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 max-w-5xl py-8">
                <CheckoutSteps step1 step2 step3 step4 />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Section */}
                        <div className="border border-gray-100 rounded-3xl p-8 bg-white shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                                    <p className="text-xs text-gray-500 font-medium">Where your order will be delivered</p>
                                </div>
                                <Link to="/shipping" className="ml-auto text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-4 py-2 rounded-xl">Edit</Link>
                            </div>
                            <div className="pl-14">
                                <p className="font-bold text-gray-900 text-lg mb-1">{shippingAddress.name}</p>
                                <p className="text-gray-600 leading-relaxed">{shippingAddress.address}</p>
                                <p className="text-gray-600">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}</p>
                                <div className="mt-4 flex items-center gap-2 text-gray-400 font-medium text-sm">
                                    <Truck size={16} /> Standard Delivery in 2-3 Business Days
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="border border-gray-100 rounded-3xl p-8 bg-white shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Payment Selection</h2>
                                    <p className="text-xs text-gray-500 font-medium">How you'll pay for this order</p>
                                </div>
                                <Link to="/payment" className="ml-auto text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-4 py-2 rounded-xl">Change</Link>
                            </div>
                            <div className="pl-14">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 text-lg">{paymentMethod}</span>
                                    {isCOD && <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase px-2 py-1 rounded">Pay on delivery</span>}
                                </div>
                                {paymentMethod === 'UPI' && upiApp && <p className="text-gray-500 text-sm mt-1">Via {upiApp}</p>}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border border-gray-100 rounded-3xl p-8 bg-white shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                                    <p className="text-xs text-gray-500 font-medium">{cartItems.length} Products in your basket</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-6 items-center p-4 rounded-3xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                        <div className="relative">
                                            <img src={item.image} alt={item.name} className="w-20 h-20 object-contain bg-white rounded-2xl p-2 border border-gray-100 transition-transform group-hover:scale-105" />
                                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 font-black px-2 py-0.5 rounded-lg text-xs shadow-sm shadow-yellow-100 border-2 border-white">{item.qty}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                                            <p className="text-gray-400 text-sm font-medium">₹{item.price.toFixed(2)} each</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-gray-900">₹{(item.qty * item.price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-[32px] p-8 sticky top-8 text-white shadow-2xl shadow-gray-200">
                            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                Total Summary
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-400 font-medium">
                                    <span>Items Subtotal</span>
                                    <span className="text-white font-bold">₹{cartStats.itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 font-medium">
                                    <span>Delivery Charge</span>
                                    <span className="text-emerald-400 font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between text-gray-400 font-medium">
                                    <span>Tax</span>
                                    <span className="text-white font-bold">₹{cartStats.taxPrice.toFixed(2)}</span>
                                </div>
                                {isCOD && (
                                    <div className="flex justify-between text-yellow-400 font-medium">
                                        <span>COD Handling</span>
                                        <span className="font-bold">₹9.00</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-800 pt-6 mt-6 flex justify-between items-end">
                                    <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">Total</span>
                                    <span className="text-4xl font-black">₹{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                onClick={placeOrderHandler}
                                className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${loading ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95'}`}
                            >
                                Confirm & Place Order <CheckCircle size={22} />
                            </button>

                            <p className="mt-6 text-[10px] text-gray-500 text-center leading-relaxed font-medium">
                                By placing your order, you agree to our <span className="underline cursor-pointer hover:text-gray-300">Privacy Notice</span> and <span className="underline cursor-pointer hover:text-gray-300">Terms of Use</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;
