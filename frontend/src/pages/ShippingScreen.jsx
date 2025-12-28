import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from '../api/axios';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartStats, cartItems } = useCart();
    const savedAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);

    const [newAddress, setNewAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        state: '',
        country: 'India',
        landmark: '',
        name: user?.name || '',
        placeType: 'Home',
        phone: user?.phone || ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/shipping');
        } else if (user.addresses && user.addresses.length > 0) {
            setAddresses(user.addresses);
            const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
            setSelectedAddressId(defaultAddr._id);
        } else {
            setIsAddingNew(true);
        }
    }, [user, navigate]);

    const handlePincodeChange = async (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        setNewAddress({ ...newAddress, postalCode: value });

        if (value.length === 6) {
            try {
                const { data } = await axios.get(`/utils/pincode/${value}`);
                if (data) {
                    setNewAddress(prev => ({
                        ...prev,
                        city: data.District,
                        state: data.State
                    }));
                }
            } catch (error) {
                console.error('Pincode fetch failed:', error);
            }
        }
    };

    const handleAddressSubmit = (e) => {
        if (e) e.preventDefault();
        let finalAddress;
        if (isAddingNew) {
            finalAddress = { ...newAddress };
        } else {
            finalAddress = addresses.find(a => a._id === selectedAddressId);
        }
        localStorage.setItem('shippingAddress', JSON.stringify(finalAddress));
        navigate('/payment');
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 max-w-4xl py-8">
                <CheckoutSteps step1 step2 />

                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Select a delivery address</h1>

                        {addresses.length > 0 && !isAddingNew && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    {addresses.map(addr => (
                                        <div
                                            key={addr._id}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${selectedAddressId === addr._id ? 'border-yellow-400 bg-yellow-50/20 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${selectedAddressId === addr._id ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    {addr.placeType}
                                                </span>
                                                {selectedAddressId === addr._id && (
                                                    <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-900 mb-1">{addr.name}</h3>
                                            <p className="text-sm text-gray-600 mb-1">{addr.addressLine}</p>
                                            <p className="text-sm text-gray-600 mb-2">{addr.city}, {addr.state} - {addr.postalCode}</p>
                                            <p className="text-xs font-bold text-gray-400">Phone: {addr.phone}</p>
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => setIsAddingNew(true)}
                                        className="p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex flex-col items-center justify-center gap-3 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                            <Plus size={20} />
                                        </div>
                                        <span className="font-bold text-gray-500 group-hover:text-emerald-700">Add New Address</span>
                                    </div>
                                </div>

                                {/* Continue Button for Selected Address */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleAddressSubmit}
                                        className="px-10 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg shadow-yellow-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </>
                        )}

                        {isAddingNew && (
                            <div className="max-w-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Add a new address</h2>
                                    {addresses.length > 0 && (
                                        <button
                                            onClick={() => setIsAddingNew(false)}
                                            className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
                                        >
                                            <ArrowLeft size={16} /> Back to saved addresses
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleAddressSubmit} className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Full name (First and Last name)</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all outline-none bg-blue-50/20"
                                            value={newAddress.name}
                                            onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">Mobile number</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all outline-none bg-blue-50/20"
                                                value={newAddress.phone}
                                                onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">Pincode</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all outline-none"
                                                placeholder="6 digits [0-9] PIN code"
                                                value={newAddress.postalCode}
                                                onChange={handlePincodeChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">City</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 outline-none"
                                                value={newAddress.city}
                                                onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">State</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 outline-none"
                                                value={newAddress.state}
                                                onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Flat, House no., Building, Company, Apartment</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all outline-none"
                                            value={newAddress.address}
                                            onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex gap-6 pt-2">
                                        {['Home', 'Work'].map(type => (
                                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="placeType"
                                                    checked={newAddress.placeType === type}
                                                    onChange={() => setNewAddress({ ...newAddress, placeType: type })}
                                                    className="w-5 h-5 text-yellow-400 focus:ring-yellow-400 border-gray-300"
                                                />
                                                <span className="font-bold text-gray-700 group-hover:text-emerald-600">{type}</span>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="pt-4">
                                        <button type="submit" className="w-full sm:w-auto px-10 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg shadow-yellow-100 transition-all hover:-translate-y-0.5 active:translate-y-0">
                                            Use this address
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingScreen;
