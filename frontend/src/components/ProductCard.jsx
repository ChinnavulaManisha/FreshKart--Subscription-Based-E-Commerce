import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart, subscribeToProduct } = useCart();
    return (
        <div className="bg-white border border-gray-200 rounded-sm flex flex-col h-full hover:shadow-lg transition-shadow duration-300 relative group animate-fade-in-up">
            {product.isDeal && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm z-10">
                    Deal of the Day
                </div>
            )}

            <Link to={`/product/${product._id}`} className="bg-white p-4 flex justify-center items-center h-64 relative overflow-hidden group">
                <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                />
            </Link>

            <div className="p-4 flex-grow flex flex-col">
                <Link to={`/product/${product._id}`} className="hover:text-amber-600 transition-colors">
                    <h3 className="text-gray-900 font-medium text-base leading-snug line-clamp-2 mb-1">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating Block */}
                <div className="flex items-center mb-2">
                    <div className="flex text-amber-500 text-sm">
                        {'★'.repeat(Math.round(product.rating || 4))}
                        {'☆'.repeat(5 - Math.round(product.rating || 4))}
                    </div>
                    <span className="text-cyan-700 text-sm ml-2 hover:underline hover:text-amber-600 cursor-pointer">
                        {product.numReviews || Math.floor(Math.random() * 500)}
                    </span>
                </div>

                {/* Pricing Block */}
                <div className="mt-auto">
                    {product.isDeal ? (
                        <div className="mb-2">
                            <div className="flex items-baseline">
                                <span className="text-red-700 text-lg mr-2 font-light">-{product.discount || 15}%</span>
                                <span className="text-3xl font-medium text-gray-900">
                                    <span className="text-sm align-top font-normal">₹</span>
                                    {product.price}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                M.R.P.: <span className="line-through">₹{product.originalPrice || Math.floor(product.price * 1.2)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-2">
                            <span className="text-3xl font-medium text-gray-900">
                                <span className="text-sm align-top font-normal">₹</span>
                                {product.price}
                            </span>
                            <div className="text-xs text-gray-500">
                                M.R.P.: <span className="line-through">₹{product.originalPrice || Math.floor(product.price * 1.1)}</span>
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-gray-700 mb-3">
                        FREE Delivery by <span className="font-bold">Tomorrow</span>
                    </div>

                    <div className="space-y-2">
                        {product.isActive === false ? (
                            <button disabled className="w-full bg-gray-100 text-gray-400 py-3 rounded-full font-bold cursor-not-allowed uppercase text-xs tracking-wider">
                                Currently Unavailable
                            </button>
                        ) : product.countInStock === 0 ? (
                            <button disabled className="w-full bg-gray-200 text-gray-500 py-3 rounded-full font-bold cursor-not-allowed uppercase text-xs tracking-wider flex items-center justify-center gap-2">
                                Out of Stock
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all active:scale-95"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => navigate(`/subscribe/${product._id}`)}
                                    className="w-full text-center bg-gray-900 hover:bg-black text-white rounded-xl py-3 text-sm font-black uppercase tracking-widest shadow-lg shadow-gray-200 transition-all active:scale-95"
                                >
                                    Subscribe
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
