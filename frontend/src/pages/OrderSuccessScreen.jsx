import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Truck } from 'lucide-react';

const OrderSuccessScreen = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="min-h-screen bg-gray-50/30 flex items-center justify-center py-12 lg:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex flex-col items-center text-center">

                    {/* SUCCESS MESSAGE SECTION */}
                    <div className="mb-12 w-full max-w-2xl">
                        <div className="mb-8 relative inline-block mx-auto">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
                            <div className="relative p-6 rounded-full bg-emerald-100 text-emerald-600 animate-in zoom-in duration-500">
                                <CheckCircle size={80} />
                            </div>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                            Order Placed Successfully!
                        </h1>
                        <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                            Success! We've received your order and sent a confirmation email to your inbox.
                        </p>

                        <div className="flex flex-col gap-4 max-w-md mx-auto">
                            {orderId && (
                                <Link to={`/track-order/${orderId}`} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                                    <Truck size={20} /> Track Your Order
                                </Link>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/orders" className="w-full py-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm">
                                    History
                                </Link>
                                <Link to="/products" className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
                                    Shop
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* WHAT HAPPENS NEXT SECTION */}
                    <div className="w-full max-w-md mt-8">
                        <div className="bg-white border border-gray-100 rounded-[40px] p-8 lg:p-10 shadow-2xl shadow-gray-200/50 transform transition hover:scale-[1.02] duration-300 relative overflow-hidden group text-left">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3 relative z-10">
                                <span className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-lg shadow-sm">🚚</span>
                                What happens next?
                            </h3>

                            <div className="space-y-8 relative z-10">
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-gray-200">1</div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">We pack it with care.</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">Our team hand-picks your fresh items immediately.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">Swift Pickup.</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">Our delivery partner collects your package.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">Delivered to you.</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">Guaranteed by <strong className="text-emerald-600">Tomorrow, 9 PM</strong>.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderSuccessScreen;
