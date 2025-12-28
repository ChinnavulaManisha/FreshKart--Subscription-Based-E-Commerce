

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { ArrowLeft, Save, Upload, X, Plus, AlertCircle, Check } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

const AdminEditProductScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discount: 0,
        brand: '',
        category: '',
        countInStock: 0,
        description: '',
        image: '',
        images: [],
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Temp state for new image URL input
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`/products/${id}`);
            setFormData({
                name: data.name,
                price: data.price,
                discount: data.discount || 0,
                brand: data.brand || '',
                category: data.category,
                countInStock: data.countInStock,
                description: data.description,
                image: data.image,
                images: data.images || [],
                isActive: data.isActive !== undefined ? data.isActive : true
            });
        } catch (error) {
            console.error('Error fetching product', error);
            setError('Failed to fetch product details.');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddImage = () => {
        if (newImageUrl && !formData.images.includes(newImageUrl)) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, newImageUrl]
            }));
            setNewImageUrl('');
        }
    };

    const __handleRemoveImage = (imgToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img !== imgToRemove)
        }));
    };

    const setMainImage = (img) => {
        setFormData(prev => ({
            ...prev,
            image: img
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Use main image as fallback if images array is empty, or ensure main image is in array
        const finalImages = formData.images.length > 0 ? formData.images : [formData.image];
        const finalData = {
            ...formData,
            price: Number(formData.price),
            countInStock: Number(formData.countInStock),
            discount: Number(formData.discount),
            images: finalImages
        };

        try {
            if (isEditMode) {
                await axios.put(`/products/${id}`, finalData);
            } else {
                await axios.post('/products', finalData);
            }
            navigate('/admin/productlist');
        } catch (error) {
            console.error('Error saving product', error);
            setError(error.response?.data?.message || 'Error saving product');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button onClick={() => navigate('/admin/productlist')} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-2 transition-colors font-medium">
                        <ArrowLeft size={18} /> Back to Inventory
                    </button>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Status:</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900">{formData.isActive ? 'Active' : 'Disabled'}</span>
                        </label>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3 text-red-700 font-medium">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">General Information</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
                                <input
                                    type="text" name="name" value={formData.name} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-medium"
                                    placeholder="e.g., Amul Taaza Toned Milk - 1L"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                    <select
                                        name="category" value={formData.category} onChange={handleChange} required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-medium bg-white"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Dairy, Bread & Eggs">Dairy, Bread & Eggs</option>
                                        <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                                        <option value="Snacks & Munchies">Snacks & Munchies</option>
                                        <option value="Bakery & Biscuits">Bakery & Biscuits</option>
                                        <option value="Cold Drinks & Juices">Cold Drinks & Juices</option>
                                        <option value="Chicken, Meat & Fish">Chicken, Meat & Fish</option>
                                        <option value="Baby Care">Baby Care</option>
                                        <option value="Cleaning Essentials">Cleaning Essentials</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Brand</label>
                                    <input
                                        type="text" name="brand" value={formData.brand} onChange={handleChange} required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-medium"
                                        placeholder="e.g. Amul"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    name="description" value={formData.description} onChange={handleChange} rows="5"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-medium"
                                    placeholder="Detailed product description..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Pricing & Inventory</h3>
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Base Price (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                    <input
                                        type="number" name="price" value={formData.price} onChange={handleChange} required
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Discount (%)</label>
                                <div className="relative">
                                    <input
                                        type="number" name="discount" value={formData.discount} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Stock Qty</label>
                                <input
                                    type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Images & Actions */}
                <div className="space-y-8">
                    {/* Image Upload Component */}
                    {isEditMode && (
                        <ImageUploader
                            productId={id}
                            currentImage={formData.image}
                            hasImage={formData.hasImage}
                            onUploadSuccess={(updatedProduct) => {
                                setFormData(prev => ({
                                    ...prev,
                                    image: updatedProduct.image,
                                    hasImage: updatedProduct.hasImage
                                }));
                            }}
                        />
                    )}

                    {/* Legacy Image URL Section (for new products only) */}
                    {!isEditMode && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Product Media</h3>

                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> After creating the product, you'll be able to upload a real product image. Products without images cannot be purchased by customers.
                                </p>
                            </div>

                            {/* Main Image Preview */}
                            <div className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-6 overflow-hidden relative group">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <Upload className="mx-auto mb-2 opacity-50" size={32} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Placeholder Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Image URL Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Temporary Image URL (Optional)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        className="flex-grow px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-500"
                                        placeholder="https://..."
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddImage}
                                        className="bg-gray-900 text-white p-2 rounded-lg hover:bg-black transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Gallery Grid */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {formData.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setMainImage(img)}
                                            className={`aspect-square rounded-lg border cursor-pointer overflow-hidden relative group ${formData.image === img ? 'ring-2 ring-emerald-500 border-transparent' : 'border-gray-200'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            {formData.image === img && (
                                                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                                    <Check size={16} className="text-white drop-shadow-md" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        {loading ? 'Saving Changes...' : 'Save Product'}
                    </button>

                    {isEditMode && (
                        <button
                            type="button"
                            onClick={() => navigate('/admin/productlist')}
                            className="w-full bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-100 hover:bg-red-50 px-8 py-3 rounded-xl font-bold uppercase tracking-widest transition-all text-xs"
                        >
                            Cancel Changes
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AdminEditProductScreen;
