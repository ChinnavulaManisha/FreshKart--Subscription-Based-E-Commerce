import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Truck, Plus, CheckCircle, Smartphone, ArrowLeft } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCart } from '../context/CartContext';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const { cartStats } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [upiApp, setUpiApp] = useState('Google Pay');
    const [upiId, setUpiId] = useState('');
    const [isUpiVerified, setIsUpiVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [upiError, setUpiError] = useState('');
    
    // UI Mock States
    const [showUpiModal, setShowUpiModal] = useState(false);
    const [paymentTimer, setPaymentTimer] = useState(300);

    useEffect(() => {
        let interval;
        if (showUpiModal && paymentTimer > 0) {
            interval = setInterval(() => {
                setPaymentTimer((prev) => prev - 1);
            }, 1000);
        } else if (paymentTimer === 0) {
            setShowUpiModal(false);
            setUpiError('Payment request timed out.');
        }
        return () => clearInterval(interval);
    }, [showUpiModal, paymentTimer]);

    const handleMockPaymentSuccess = () => {
        setShowUpiModal(false);
        navigate('/placeorder');
    };

    // Load saved method
    useEffect(() => {
        const savedMethod = localStorage.getItem('paymentMethod');
        if (savedMethod) setPaymentMethod(savedMethod);
    }, []);

    const handleVerifyUpi = async () => {
        // Validation: Only @ibl and @ybl handles are allowed
        const isValidHandle = upiId.endsWith('@ibl') || upiId.endsWith('@ybl');

        if (!isValidHandle) {
            setUpiError('invalid upi id');
            return;
        }

        setIsVerifying(true);
        setUpiError('');

        // Simulate API call for verification
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsVerifying(false);
        setIsUpiVerified(true);
    };

    const submitHandler = (e) => {
        if (e) e.preventDefault();

        if (paymentMethod === 'UPI' && !isUpiVerified) {
            setUpiError('Please verify your UPI ID before proceeding');
            return;
        }

        localStorage.setItem('paymentMethod', paymentMethod);
        if (paymentMethod === 'UPI') {
            localStorage.setItem('paymentDetails', JSON.stringify({ upiApp, upiId }));
            setShowUpiModal(true);
            setPaymentTimer(300);
            return;
        }
        navigate('/placeorder');
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 max-w-4xl py-8">
                <CheckoutSteps step1 step2 step3 />

                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Select a payment method</h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Payment Options */}
                            <div className="md:col-span-2 space-y-4">
                                {/* UPI Option */}
                                <div
                                    onClick={() => setPaymentMethod('UPI')}
                                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-yellow-400 bg-yellow-50/20 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${paymentMethod === 'UPI' ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                <Smartphone size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">UPI</h3>
                                                <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'UPI' && (
                                            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                                                <CheckCircle size={14} className="text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {paymentMethod === 'UPI' && (
                                        <div className="pt-4 border-t border-yellow-100/50 space-y-4">
                                            <div className="grid grid-cols-3 gap-3">
                                                {['Google Pay', 'PhonePe', 'Paytm'].map(app => (
                                                    <button
                                                        key={app}
                                                        onClick={(e) => { e.stopPropagation(); setUpiApp(app); }}
                                                        className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all border ${upiApp === app ? 'bg-white border-yellow-400 text-yellow-600 shadow-sm' : 'bg-gray-50 border-transparent text-gray-500'}`}
                                                    >
                                                        {app}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase">Enter UPI ID</label>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-grow">
                                                        <input
                                                            type="text"
                                                            placeholder="mobilenumber@upi"
                                                            value={upiId}
                                                            onChange={(e) => { setUpiId(e.target.value); setIsUpiVerified(false); setUpiError(''); }}
                                                            className={`w-full px-4 py-2 text-sm border-2 rounded-lg outline-none transition-all ${isUpiVerified ? 'border-emerald-100 bg-emerald-50/30' : 'border-gray-100 focus:border-yellow-400'}`}
                                                        />
                                                        {isUpiVerified && (
                                                            <div className="absolute right-3 top-2.5 text-emerald-500">
                                                                <CheckCircle size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={handleVerifyUpi}
                                                        disabled={isVerifying || !upiId || isUpiVerified}
                                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${isUpiVerified ? 'bg-emerald-500 text-white cursor-default' : 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800 disabled:opacity-50'}`}
                                                    >
                                                        {isVerifying ? 'Verifying...' : isUpiVerified ? 'Verified' : 'Verify'}
                                                    </button>
                                                </div>
                                                {upiError && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{upiError}</p>}
                                                {isUpiVerified && <p className="text-[10px] text-emerald-600 mt-1 ml-1 font-bold">UPI ID linked successfully</p>}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center justify-center">
                                                <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Or Scan to Pay</p>
                                                <div className="p-2 bg-white border-2 border-gray-100 rounded-xl shadow-sm hover:border-yellow-400 transition-colors cursor-pointer">
                                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi%3A%2F%2Fpay%3Fpa%3Dfreshkart%40okaxis%26pn%3DFreshkart%20Store%26cu%3DINR%26am%3D${cartStats?.totalPrice || 0}`} alt="Freshkart UPI QR Code" className="w-32 h-32 object-contain rounded-lg" />
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-2 font-medium">Scan with any UPI App (Google Pay, PhonePe, Paytm)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Card Option */}
                                <div
                                    onClick={() => setPaymentMethod('Card')}
                                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-yellow-400 bg-yellow-50/20 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${paymentMethod === 'Card' ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                <CreditCard size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Credit or Debit Card</h3>
                                                <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'Card' && (
                                            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                                                <CheckCircle size={14} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* COD Option */}
                                <div
                                    onClick={() => setPaymentMethod('Cash on Delivery')}
                                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery' ? 'border-yellow-400 bg-yellow-50/20 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${paymentMethod === 'Cash on Delivery' ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                <Truck size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
                                                <p className="text-xs text-gray-500">Pay at your doorstep</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'Cash on Delivery' && (
                                            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                                                <CheckCircle size={14} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    {paymentMethod === 'Cash on Delivery' && (
                                        <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md inline-block">
                                            Convenience fee of ₹9 applies
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar / Final Action */}
                            <div className="md:col-span-1">
                                <div className="bg-white border-2 border-gray-100 p-6 rounded-xl shadow-sm sticky top-8">
                                    <button
                                        onClick={submitHandler}
                                        className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg shadow-yellow-100 transition-all hover:-translate-y-0.5 active:translate-y-0 mb-4"
                                    >
                                        Use this payment method
                                    </button>
                                    <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                                        You can review your order before it's final. We use secure encryption for all transactions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* UPI Collect Request Mock Modal */}
            {showUpiModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative border-4 border-yellow-400 m-4">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Smartphone size={32} className="text-yellow-600 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Approve Payment</h2>
                        <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">
                            A collect request of <span className="font-bold text-gray-900">₹{Number(cartStats?.totalPrice || 0).toFixed(2)}</span> has been sent to your <span className="font-bold text-yellow-600">{upiApp}</span> app linked to <span className="font-bold">{upiId}</span>.
                        </p>
                        
                        <div className="text-4xl font-black text-gray-900 mb-8 tracking-wider">
                            {Math.floor(paymentTimer / 60).toString().padStart(2, '0')}:{(paymentTimer % 60).toString().padStart(2, '0')}
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleMockPaymentSuccess}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-lg transition-all"
                            >
                                Simulate Payment Success
                            </button>
                            <button
                                onClick={() => { setShowUpiModal(false); setUpiError('Payment cancelled by user.'); }}
                                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                            >
                                Cancel Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentScreen;
