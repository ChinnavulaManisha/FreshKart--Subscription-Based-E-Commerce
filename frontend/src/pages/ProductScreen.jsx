import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import {
    ArrowLeft, Star, ShoppingCart, Calendar, Clock,
    Package, Truck, Shield, AlertCircle, Send
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, subscribeToProduct } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Subscription Form State
    const [quantity, setQuantity] = useState(1);
    const [frequency, setFrequency] = useState('daily');
    const [duration, setDuration] = useState('1 Month');
    const [startDate, setStartDate] = useState('');
    const [subLoading, setSubLoading] = useState(false);

    // Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/products/${id}`);
                setProduct(data);

                // Fetch related products (same category)
                const { data: allProducts } = await axios.get('/products');
                const related = allProducts
                    .filter(p => p.category === data.category && p._id !== data._id)
                    .slice(0, 4);
                setRelatedProducts(related);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProduct();

        // Set default start date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setStartDate(tomorrow.toISOString().split('T')[0]);
    }, [id]);

    const submitSubscriptionHandler = async (e) => {
        e.preventDefault();
        setSubLoading(true);
        try {
            const start = new Date(startDate);
            const end = new Date(startDate);
            if (duration === '1 Week') end.setDate(end.getDate() + 7);
            else if (duration === '2 Weeks') end.setDate(end.getDate() + 14);
            else if (duration === '1 Month') end.setMonth(end.getMonth() + 1);
            else if (duration === '3 Months') end.setMonth(end.getMonth() + 3);

            subscribeToProduct(product, Number(quantity), frequency, startDate, {
                duration,
                endDate: end.toISOString().split('T')[0],
                billingType: 'Postpaid'
            });

            alert(`Subscribed to ${product.name}! Redirecting to cart...`);
            navigate('/cart');
        } catch (err) {
            alert(err.message);
            setSubLoading(false);
        }
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        setReviewError('');
        setReviewSuccess(false);

        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(`/products/${id}/reviews`, { rating, comment }, config);

            setReviewSuccess(true);
            setComment('');
            setRating(5);

            // Refresh product data
            const { data } = await axios.get(`/products/${id}`);
            setProduct(data);
        } catch (err) {
            setReviewError(err.response?.data?.message || err.message);
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Product not found</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Link to="/products" className="text-emerald-600 font-bold hover:underline">Back to Products</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-8 font-bold transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-96 object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {product.images && product.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-3">
                                {product.images.map((img, idx) => (
                                    <div key={idx} className="bg-white rounded-xl p-3 border border-gray-100 cursor-pointer hover:border-emerald-500 transition-colors">
                                        <img src={img} alt={`View ${idx}`} className="w-full h-20 object-contain mix-blend-multiply" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                                {product.category}
                            </span>
                            <h1 className="text-4xl font-black text-gray-900 mb-4">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600 font-medium">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
                            </div>

                            <div className="flex items-baseline gap-3 mb-6">
                                <p className="text-4xl font-black text-gray-900">₹{product.price}</p>
                                <span className="text-lg text-gray-400">/ unit</span>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-8">
                                {product.isActive === false ? (
                                    <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-xl font-bold">
                                        <AlertCircle size={18} /> Currently Unavailable
                                    </div>
                                ) : product.countInStock === 0 ? (
                                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl font-bold border border-red-100">
                                        <AlertCircle size={18} /> Out of Stock
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl font-bold border border-emerald-100">
                                        <Package size={18} /> In Stock ({product.countInStock} available)
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Purchase Options */}
                        {product.isActive !== false && product.countInStock > 0 && (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-900 font-bold py-4 px-6 rounded-xl shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={20} /> Add to Cart
                                    </button>
                                    <button
                                        onClick={() => {
                                            addToCart(product);
                                            navigate('/cart');
                                        }}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                                    >
                                        Buy Now
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1"><Truck size={16} /> Free Delivery</div>
                                    <div className="flex items-center gap-1"><Shield size={16} /> Secure Payment</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Subscription Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 mb-16 border border-indigo-100">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Subscribe & Save</h2>
                    <p className="text-gray-600 mb-6">Get this product delivered regularly and never run out!</p>

                    <form onSubmit={submitSubscriptionHandler} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Frequency</label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                            >
                                <option value="1 Week">1 Week</option>
                                <option value="2 Weeks">2 Weeks</option>
                                <option value="1 Month">1 Month</option>
                                <option value="3 Months">3 Months</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                                required
                            />
                        </div>
                        <div className="md:col-span-4">
                            <button
                                type="submit"
                                disabled={subLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
                            >
                                {subLoading ? 'Processing...' : 'Subscribe Now'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Reviews Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Write Review */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>

                            {reviewSuccess && (
                                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium">
                                    Review submitted successfully!
                                </div>
                            )}

                            {reviewError && (
                                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                                    {reviewError}
                                </div>
                            )}

                            <form onSubmit={submitReviewHandler} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    size={32}
                                                    className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows="4"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium resize-none"
                                        placeholder="Share your experience with this product..."
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={reviewLoading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Send size={18} /> {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-black text-gray-900 mb-6">Customer Reviews</h3>
                        {product.reviews && product.reviews.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                                <p className="text-gray-500 font-medium">No reviews yet. Be the first to review!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {product.reviews && product.reviews.map((review) => (
                                    <div key={review._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{review.name}</h4>
                                                <p className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-6">You May Also Like</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <Link
                                    key={relatedProduct._id}
                                    to={`/product/${relatedProduct._id}`}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group"
                                >
                                    <div className="mb-4 bg-gray-50 rounded-xl p-4">
                                        <img
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            className="w-full h-40 object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                        {relatedProduct.name}
                                    </h4>
                                    <p className="text-xl font-black text-gray-900">₹{relatedProduct.price}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductScreen;
