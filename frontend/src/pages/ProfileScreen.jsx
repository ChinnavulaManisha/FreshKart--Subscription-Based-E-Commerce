import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Edit, X, Plus, Trash2, Settings, Shield, Key, AlertCircle } from 'lucide-react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const ProfileScreen = () => {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        postalCode: '',
        city: '',
        state: '',
        addressLine: '',
        landmark: '',
        placeType: 'Home'
    });

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAddresses(user.addresses || []);
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(null);
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token || JSON.parse(sessionStorage.getItem('userInfo'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.put('/users/profile', { name, email, password }, config);

            const remember = !!localStorage.getItem('userInfo');
            const storage = remember ? localStorage : sessionStorage;
            storage.setItem('userInfo', JSON.stringify(data));

            setMessage({ type: 'success', text: 'Profile Updated Successfully' });
            setIsEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.response ? error.response.data.message : error.message });
        } finally {
            setLoading(false);
        }
    };

    const deleteAddressHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token || JSON.parse(sessionStorage.getItem('userInfo'))?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const updatedAddresses = addresses.filter(a => a._id !== id);
                const { data } = await axios.put('/users/profile', { addresses: updatedAddresses }, config);

                // Update local storage/session storage to persist changes
                const remember = !!localStorage.getItem('userInfo');
                const storage = remember ? localStorage : sessionStorage;
                storage.setItem('userInfo', JSON.stringify(data));


                // Update global state
                setUser(data);
                setAddresses(updatedAddresses);
                setMessage({ type: 'success', text: 'Address Removed Successfully' });
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to remove address' });
            }
        }
    };

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

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token || JSON.parse(sessionStorage.getItem('userInfo'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Add new address to existing list
            const updatedAddresses = [...addresses, { ...newAddress }];
            const { data } = await axios.put('/users/profile', { addresses: updatedAddresses }, config);

            // Update local storage/session storage to persist changes
            const remember = !!localStorage.getItem('userInfo');
            const storage = remember ? localStorage : sessionStorage;
            storage.setItem('userInfo', JSON.stringify(data));

            // Update global state
            setUser(data);
            setAddresses(data.addresses);
            setMessage({ type: 'success', text: 'Address Added Successfully!' });
            setShowAddressModal(false);
            setNewAddress({
                name: user?.name || '',
                phone: user?.phone || '',
                postalCode: '',
                city: '',
                state: '',
                addressLine: '',
                landmark: '',
                placeType: 'Home'
            });
        } catch (error) {
            setMessage({ type: 'error', text: error.response ? error.response.data.message : error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900">My Account</h1>
                    <p className="text-gray-500 mt-2">Manage your profile, settings, and addresses</p>
                </div>

                {message && (
                    <div className={`p-4 mb-8 rounded-xl font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.type === 'success' ? <Shield size={20} /> : <AlertCircle size={20} />}
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Settings */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Settings className="text-emerald-600" /> Profile
                                </h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 text-sm font-bold"
                                >
                                    {isEditing ? <><X size={16} /> Cancel</> : <><Edit size={16} /> Edit</>}
                                </button>
                            </div>

                            {!isEditing ? (
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="bg-white p-3 rounded-full shadow-sm text-emerald-600">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Full Name</p>
                                            <p className="font-bold text-gray-900">{user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="bg-white p-3 rounded-full shadow-sm text-emerald-600">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Email Address</p>
                                            <p className="font-bold text-gray-900 break-all">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-3 text-indigo-800 text-xs font-bold">
                                        <Shield size={16} /> Secure Account
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={submitHandler} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Key size={14} /> Change Password</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <input
                                                    type="password"
                                                    placeholder="New Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-sm"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="password"
                                                    placeholder="Confirm New Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 mt-4"
                                    >
                                        {loading ? 'Saving Changes...' : 'Save Changes'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Addresses & Orders Link */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link to="/orders" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">Order History</h3>
                                <p className="text-sm text-gray-500">View and track your past orders</p>
                            </Link>
                            <Link to="/subscriptions" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">My Subscriptions</h3>
                                <p className="text-sm text-gray-500">Manage your recurring orders</p>
                            </Link>
                        </div>

                        {/* Addresses */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <MapPin className="text-emerald-600" /> Saved Addresses
                                </h2>
                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                                >
                                    <Plus size={16} /> Add New
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.length === 0 ? (
                                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <MapPin className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                                        <p className="text-gray-500 font-medium">No saved addresses found</p>
                                    </div>
                                ) : (
                                    addresses.map((addr) => (
                                        <div key={addr._id} className="relative p-6 rounded-2xl border border-gray-200 bg-white hover:border-emerald-200 hover:shadow-md transition-all group">
                                            <button
                                                onClick={() => deleteAddressHandler(addr._id)}
                                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete Address"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider mb-3">
                                                {addr.placeType || 'Home'}
                                            </span>
                                            <h3 className="font-bold text-gray-900 mb-1">{addr.name}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                                {addr.addressLine}, {addr.landmark ? `Near ${addr.landmark}, ` : ''}{addr.city}, {addr.state} - {addr.postalCode}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">Phone: {addr.phone}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div
                        className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <MapPin className="text-emerald-600" /> Add New Address
                            </h3>
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddressSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recipient Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-sm"
                                        value={newAddress.name}
                                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="10-digit mobile number"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-sm"
                                        value={newAddress.phone}
                                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pincode</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="6 digits"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-sm"
                                            value={newAddress.postalCode}
                                            onChange={handlePincodeChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="City"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-sm"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">State</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="State"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-sm"
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address (House No, Building, Street)</label>
                                    <textarea
                                        required
                                        rows="2"
                                        placeholder="e.g. #123, 4th Cross, Main Road"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-sm resize-none"
                                        value={newAddress.addressLine}
                                        onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Near Market"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-sm"
                                        value={newAddress.landmark}
                                        onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address Type</label>
                                    <div className="flex gap-4">
                                        {['Home', 'Office'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setNewAddress({ ...newAddress, placeType: type })}
                                                className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all text-sm ${newAddress.placeType === type ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                                            >
                                                {type === 'Home' ? '🏠 Home' : '💼 Office'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileScreen;
