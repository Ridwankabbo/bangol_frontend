import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiHeart, FiShoppingCart, FiChevronRight, FiMinus, FiPlus, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
import ProductCard from '../components/ProductCard/ProductCard';
import { getProductById, getProducts } from '../api/products';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, toggleWishlist, isInWishlist } = useCart();
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImg, setSelectedImg] = useState(0);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const data = await getProductById(id);
                setProduct(data);

                // Fetch related products (e.g., same category)
                const relatedData = await getProducts({ category: data.category });
                setRelated(relatedData.filter(p => p.id !== data.id).slice(0, 4));
            } catch (err) {
                console.error('Failed to fetch product details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="min-h-screen pt-[70px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen pt-[70px] flex flex-col items-center justify-center gap-4">
            <span className="text-6xl">😕</span>
            <h2 className="font-heading text-2xl font-bold text-gray-600">Product not found</h2>
            <Link to="/shop" className="btn-green px-6 py-3 rounded-full no-underline">Back to Shop</Link>
        </div>
    );

    const imgs = [product.image, ...Array(3).fill(0).map((_, i) => `https://picsum.photos/seed/${product.id + i + 10}/600/400`)].filter(Boolean);
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;
    const inWishlist = isInWishlist(product.id);

    const renderStars = (r) => Array.from({ length: 5 }, (_, i) => (
        <FiStar key={i} className={`text-sm ${i < Math.round(r) ? 'text-yellow-primary fill-current' : 'text-gray-200'}`} />
    ));

    const reviews = [
        { name: 'Sarah M.', rating: 5, date: '2 days ago', text: 'Absolutely fresh and delicious! Will definitely order again.', avatar: 'SM' },
        { name: 'James K.', rating: 4, date: '1 week ago', text: 'Great quality, arrived perfectly packaged and very fresh.', avatar: 'JK' },
        { name: 'Emily R.', rating: 5, date: '2 weeks ago', text: 'Outstanding freshness and quality. Highly recommend!', avatar: 'ER' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-[70px]">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
                    <Link to="/" className="hover:text-green-primary no-underline">Home</Link><FiChevronRight className="text-xs" />
                    <Link to="/shop" className="hover:text-green-primary no-underline">Shop</Link><FiChevronRight className="text-xs" />
                    <Link to={`/shop?category=${product.category}`} className="hover:text-green-primary capitalize no-underline">{product.category}</Link><FiChevronRight className="text-xs" />
                    <span className="text-green-primary font-medium truncate">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-card p-8">
                    {/* Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-50">
                            <img src={imgs[selectedImg]} alt={product.name} className="w-full h-full object-cover"
                                onError={e => { e.target.src = `https://picsum.photos/seed/${product.id}/600/400`; }} />
                            {product.badge && (
                                <span className={`absolute top-4 left-4 badge badge-${product.badge}`}>
                                    {product.badge === 'sale' ? `${discount}% Off` : product.badge}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            {imgs.map((img, i) => (
                                <button key={i} onClick={() => setSelectedImg(i)}
                                    className={`w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImg === i ? 'border-green-primary' : 'border-gray-100 hover:border-green-200'}`}>
                                    <img src={img} alt="" className="w-full h-full object-cover"
                                        onError={e => { e.target.src = `https://picsum.photos/seed/${product.id + i}/120/80`; }} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-5">
                        <div>
                            <p className="text-xs font-bold text-green-primary uppercase tracking-widest mb-2 capitalize">{product.category}</p>
                            <h1 className="font-heading font-extrabold text-2xl text-gray-800 leading-snug">{product.name}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
                            <span className="text-sm font-semibold text-gray-600">{product.rating}</span>
                            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
                        </div>
                        <div className="flex items-baseline gap-3 pb-5 border-b border-gray-100">
                            <span className="font-heading font-black text-3xl text-green-primary">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                            )}
                            {discount && <span className="badge badge-sale">{discount}% Off</span>}
                        </div>
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex gap-2"><span className="text-gray-500 w-20">Weight:</span><span className="font-semibold text-gray-800">{product.weight}</span></div>
                            <div className="flex gap-2"><span className="text-gray-500 w-20">Origin:</span><span className="font-semibold text-gray-800">{product.origin}</span></div>
                            <div className="flex gap-2"><span className="text-gray-500 w-20">Stock:</span>
                                <span className={`font-semibold ${product.stock <= 10 ? 'text-red-primary' : 'text-green-primary'}`}>
                                    {product.stock <= 10 ? `Only ${product.stock} left!` : 'In Stock'}
                                </span>
                            </div>
                        </div>

                        {/* Quantity & Cart */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div className="flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="w-11 h-11 bg-gray-50 hover:bg-green-50 hover:text-green-primary text-gray-600 flex items-center justify-center transition-all">
                                    <FiMinus />
                                </button>
                                <span className="w-12 text-center font-bold text-gray-800 border-x-2 border-gray-200 h-11 flex items-center justify-center">{qty}</span>
                                <button onClick={() => setQty(q => q + 1)}
                                    className="w-11 h-11 bg-gray-50 hover:bg-green-50 hover:text-green-primary text-gray-600 flex items-center justify-center transition-all">
                                    <FiPlus />
                                </button>
                            </div>
                            <button onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); }}
                                className="btn-green flex-1 min-w-[160px] py-3.5 rounded-2xl text-sm">
                                <FiShoppingCart /> Add to Cart
                            </button>
                            <button onClick={() => toggleWishlist(product)}
                                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all
                  ${inWishlist ? 'border-red-primary bg-red-pale text-red-primary' : 'border-gray-200 text-gray-500 hover:border-red-primary hover:text-red-primary hover:bg-red-pale'}`}>
                                <FiHeart className={inWishlist ? 'fill-current' : ''} />
                            </button>
                        </div>

                        {/* Perks */}
                        <div className="bg-green-50 rounded-2xl p-4 grid grid-cols-3 gap-3 mt-2">
                            {[
                                { icon: <FiTruck />, text: 'Free Delivery over $30' },
                                { icon: <FiRefreshCw />, text: '30-day Returns' },
                                { icon: <FiShield />, text: 'Quality Guarantee' },
                            ].map(p => (
                                <div key={p.text} className="flex flex-col items-center gap-1.5 text-center">
                                    <span className="text-green-primary text-lg">{p.icon}</span>
                                    <span className="text-xs text-gray-600 font-medium leading-tight">{p.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-8 bg-white rounded-3xl shadow-card overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        {['description', 'reviews'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 text-sm font-semibold capitalize transition-all border-b-2
                  ${activeTab === tab ? 'border-green-primary text-green-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                                {tab} {tab === 'reviews' && `(${product.reviews})`}
                            </button>
                        ))}
                    </div>
                    <div className="p-8">
                        {activeTab === 'description' ? (
                            <div>
                                <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                    {[['Category', product.category], ['Weight', product.weight], ['Origin', product.origin], ['Rating', `${product.rating}/5`], ['Reviews', product.reviews], ['Stock', product.stock]].map(([k, v]) => (
                                        <div key={k} className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{k}</p>
                                            <p className="text-sm font-bold text-gray-800 mt-1 capitalize">{v}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5">
                                {reviews.map(r => (
                                    <div key={r.name} className="flex gap-4 p-5 bg-gray-50 rounded-2xl">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {r.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-gray-800 text-sm">{r.name}</h4>
                                                <span className="text-xs text-gray-400">{r.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <FiStar key={i} className={`text-xs ${i < r.rating ? 'text-yellow-primary fill-current' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related */}
                {related.length > 0 && (
                    <div className="mt-10">
                        <h2 className="font-heading font-extrabold text-2xl text-gray-800 mb-6">Related <span className="text-green-primary">Products</span></h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {related.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
