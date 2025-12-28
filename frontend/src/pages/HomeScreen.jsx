import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, ChevronRight, Milk, Croissant, Apple, Carrot, Sparkles, Home as HomeIcon, Cookie, ShoppingBag } from 'lucide-react';

/**
 * HomeScreen Component
 * The main shopping dashboard for authenticated users
 * Features dynamic product listings, category-wise highlights, and trending deals
 */
const HomeScreen = () => {
    const navigate = useNavigate();

    // State Management: Stores all products fetched from the backend
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Data Fetch: Retrieve full product catalog on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    /**
     * Helper Function: getCategoryProduct
     * Extracts the first product matching a category to use its image for UI cards
     */
    const getCategoryProduct = (cat) => products.find(p => p.category === cat) || {};

    // UI Configuration for the Top Category Strip
    const categories = [
        { name: 'Dairy, Bread & Eggs', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
        { name: 'Fruits & Vegetables', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
        { name: 'Snacks & Munchies', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
        { name: 'Bakery & Biscuits', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
        { name: 'Cold Drinks & Juices', color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100' },
        { name: 'Chicken, Meat & Fish', color: 'bg-red-50 text-red-600 hover:bg-red-100' },
        { name: 'Baby Care', color: 'bg-pink-50 text-pink-600 hover:bg-pink-100' },
    ];

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-lg font-bold text-gray-600">Loading...</div></div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 1. HERO BANNER: High-impact full-width advertisement */}
            <div className="relative overflow-hidden w-full bg-emerald-900">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=2000&auto=format&fit=crop"
                        alt="Fresh Groceries"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="px-4 md:px-12 lg:px-20 py-24 md:py-32 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                            Fresh Groceries<br />Delivered Daily
                        </h1>
                        <p className="text-xl text-white/90 mb-8 font-medium">
                            Shop from our wide selection of fresh products and get them delivered to your doorstep
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                        >
                            <ShoppingBag size={24} />
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. CATEGORY QUICK-LINKS: Inline cards that float over the hero image */}
            <div className="container mx-auto px-4 -mt-12 relative z-20 mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {categories.map((cat, idx) => {
                        const prod = getCategoryProduct(cat.name);
                        return (
                            <Link
                                key={idx}
                                to={`/products?category=${cat.name}`}
                                className={`${cat.color} p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col items-center gap-3 group`}
                            >
                                <div className="bg-white rounded-xl p-3 w-full h-24 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={prod.image || 'https://via.placeholder.com/150'}
                                        alt={cat.name}
                                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
                                    />
                                </div>
                                <span className="font-bold text-sm text-center">{cat.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* 3. PROMO GRID: Featured deals and spotlight categories */}
            <div className="container mx-auto px-4 z-20 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Multi-item Category Highlight */}
                    <div className="bg-white p-5 z-30 h-[420px] flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Revamp your home in style</h2>
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <div className="flex flex-col">
                                <img src={getCategoryProduct('Cleaning Essentials').image} className="h-28 object-contain mb-1" />
                                <span className="text-xs text-gray-600">Cleaning</span>
                            </div>
                            <div className="flex flex-col">
                                <img src={getCategoryProduct('Baby Care').image} className="h-28 object-contain mb-1" />
                                <span className="text-xs text-gray-600">Baby Care</span>
                            </div>
                            <div className="flex flex-col">
                                <img src={getCategoryProduct('Dairy, Bread & Eggs').image} className="h-28 object-contain mb-1" />
                                <span className="text-xs text-gray-600">Dairy</span>
                            </div>
                            <div className="flex flex-col">
                                <img src={getCategoryProduct('Snacks & Munchies').image} className="h-28 object-contain mb-1" />
                                <span className="text-xs text-gray-600">Snacks</span>
                            </div>
                        </div>
                        <Link to="/products" className="text-cyan-700 text-sm font-medium hover:text-red-700 hover:underline mt-4">Explore all</Link>
                    </div>

                    {/* Single Item Spotlight (Beverages) */}
                    <div className="bg-white p-5 z-30 h-[420px] flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Up to 60% off | Beverages</h2>
                        <div className="flex-grow flex items-center justify-center bg-[#FEF8E7] p-4 rounded-lg overflow-hidden relative">
                            <img src={getCategoryProduct('Cold Drinks & Juices').image} className="max-h-56 mix-blend-multiply hover:scale-105 transition" />
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">Deal</div>
                        </div>
                        <Link to="/products?category=Cold Drinks & Juices" className="text-cyan-700 text-sm font-medium hover:text-red-700 hover:underline mt-4">See all deals</Link>
                    </div>

                    {/* Fresh Produce Spotlight */}
                    <div className="bg-white p-5 z-30 h-[420px] flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Fresh Fruits & Veggies</h2>
                        <div className="flex-grow flex items-center justify-center p-4">
                            <img src={getCategoryProduct('Fruits & Vegetables').image} className="max-h-60 object-contain hover:scale-105 transition" />
                        </div>
                        <Link to="/products?category=Fruits & Vegetables" className="text-cyan-700 text-sm font-medium hover:text-red-700 hover:underline mt-4">Shop Now</Link>
                    </div>

                    {/* Meat & Seafood Spotlight */}
                    <div className="bg-white p-5 z-30 h-[420px] flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Fresh Meat & Seafood</h2>
                        <div className="flex-grow flex items-center justify-center bg-[#F7FAFC] p-4 rounded-lg overflow-hidden relative">
                            <img src={getCategoryProduct('Chicken, Meat & Fish').image} className="max-h-56 hover:scale-105 transition object-contain" />
                        </div>
                        <Link to="/products?category=Chicken, Meat & Fish" className="text-cyan-700 text-sm font-medium hover:text-red-700 hover:underline mt-4">Shop fresh cuts</Link>
                    </div>
                </div>
            </div>

            {/* 4. TRENDING CAROUSEL: Horizontal scroll for popular items */}
            <div className="container mx-auto px-4 mt-8 bg-white p-6 shadow-sm overflow-hidden">
                <div className="flex items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Trending among customers</h2>
                    <Link to="/products" className="ml-4 text-sm text-cyan-700 hover:underline">See more</Link>
                </div>
                <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                    {products.slice(0, 10).map((product, idx) => (
                        <div key={idx} className="min-w-[180px] max-w-[180px] p-2 hover:shadow-lg transition rounded border border-transparent hover:border-gray-200">
                            <Link to={`/product/${product._id}`}>
                                <div className="bg-gray-50 h-40 flex items-center justify-center p-2 mb-2">
                                    <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                                </div>
                            </Link>
                            <div className="px-1">
                                <div className="bg-red-700 text-white text-xs font-bold inline-block px-1.5 py-0.5 rounded-sm mb-1">{product.discount || 20}% off</div>
                                <div className="text-red-700 font-bold text-sm">Deal of the Day</div>
                                <div className="text-base truncate text-gray-900 mt-1 hover:text-amber-600 cursor-pointer">{product.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. BEST SELLERS: Another row of horizontal products */}
            <div className="container mx-auto px-4 mt-8 bg-white p-6 shadow-sm overflow-hidden">
                <div className="flex items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Best Sellers in Grocery</h2>
                </div>
                <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                    {products.slice(10, 20).map((product, idx) => (
                        <Link key={idx} to={`/product/${product._id}`} className="min-w-[160px]">
                            <img src={product.image} className="h-48 w-auto object-contain mx-auto hover:scale-105 transition" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
