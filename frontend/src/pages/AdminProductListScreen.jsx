
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Search, Filter, MoreHorizontal, Eye, EyeOff } from 'lucide-react';

const AdminProductListScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/login');
            return;
        }
        fetchProducts();
    }, [user, navigate]);

    useEffect(() => {
        let result = products;
        if (searchTerm) {
            result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (filterCategory !== 'All') {
            result = result.filter(p => p.category === filterCategory);
        }
        setFilteredProducts(result);
    }, [products, searchTerm, filterCategory]);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/products');
            setProducts(data);
            setFilteredProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products', error);
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product', error);
            }
        }
    };

    const toggleProductStatus = async (product) => {
        try {
            await axios.put(`/products/${product._id}`, {
                ...product,
                isActive: !product.isActive
            });
            fetchProducts();
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 font-bold">Loading Inventory...</div>;

    const categories = ['All', ...new Set(products.map(p => p.category))];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Inventory</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage {products.length} products across {categories.length - 1} categories</p>
                </div>
                <button
                    onClick={() => navigate('/admin/product/create')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-200"
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products by name, ID..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 focus:outline-none cursor-pointer"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-12">
                                    <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                </th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Inventory</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className={`hover:bg-gray-50/50 transition-colors group ${!product.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 bg-white p-1">
                                                <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 line-clamp-1">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.category} • {product.brand}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.isActive !== false ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Disabled
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${product.countInStock < 10 ? 'text-amber-600' : 'text-gray-700'}`}>
                                                {product.countInStock}
                                            </span>
                                            <span className="text-xs text-gray-400">in stock</span>
                                        </div>
                                        <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${product.countInStock < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${Math.min((product.countInStock / 50) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        ₹{product.price}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => toggleProductStatus(product)}
                                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                                title={product.isActive !== false ? "Disable" : "Enable"}
                                            >
                                                {product.isActive !== false ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteHandler(product._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredProducts.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-gray-400 font-medium">No products found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProductListScreen;
