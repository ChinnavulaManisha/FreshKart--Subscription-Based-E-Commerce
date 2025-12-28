import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search, ChevronRight, ShoppingBasket, Sparkles } from 'lucide-react';

const ProductsScreen = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            setSelectedCategory(category);
        } else {
            setSelectedCategory('All');
        }
    }, [searchParams]);

    const handleCategoryChange = (cat) => {
        if (cat === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', cat);
        }
        setSearchParams(searchParams);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/products');
                setProducts(data);
                setFilteredProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;

        if (selectedCategory !== 'All') {
            result = result.filter(product => product.category === selectedCategory);
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower) ||
                product.category.toLowerCase().includes(searchLower)
            );
        }

        setFilteredProducts(result);
    }, [selectedCategory, searchTerm, products]);

    if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-500 animate-pulse">Loading essentials...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    const categories = ['All', 'Dairy, Bread & Eggs', 'Fruits & Vegetables', 'Snacks & Munchies', 'Bakery & Biscuits', 'Cold Drinks & Juices', 'Chicken, Meat & Fish', 'Baby Care', 'Cleaning Essentials'];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Frozen Search Header - Compact & Clean */}
            <div className="sticky top-0 z-50 w-full mb-4">
                <div className="bg-white border-b border-gray-200 shadow-sm py-4">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for essentials..."
                                    className="block w-full pl-12 pr-16 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base font-bold placeholder:text-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-3 flex items-center"
                                    >
                                        <div className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-emerald-600 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all shadow-sm">
                                            Clear
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4 flex-grow">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Sticky */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="lg:sticky lg:top-28">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Categories
                                    </h2>
                                </div>
                                <div className="p-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryChange(cat)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${selectedCategory === cat
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                                                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                                                }`}
                                        >
                                            <span>{cat}</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${selectedCategory === cat ? 'rotate-90 text-white' : 'text-gray-300 group-hover:translate-x-1'
                                                }`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-grow">
                        {/* Title Row */}
                        <div className="mb-8 flex items-end justify-between px-2">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shop</h1>
                                <p className="text-gray-500 font-bold text-sm mt-1">{filteredProducts.length} essentials available</p>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-emerald-100 shadow-sm">
                                <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <ShoppingBasket size={48} className="text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No matching items</h3>
                                <p className="text-gray-500 mb-8 max-w-xs mx-auto font-medium">We couldn't find what you're looking for. Try a different search term or category.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedCategory('All') }}
                                    className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsScreen;
