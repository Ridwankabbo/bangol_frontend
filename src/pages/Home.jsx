import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiHeadphones } from 'react-icons/fi';
import HeroSection from '../components/HeroSection/HeroSection';
import CategoryCard from '../components/CategoryCard/CategoryCard';
import ProductCard from '../components/ProductCard/ProductCard';
import { getProducts, getCategories } from '../api/products';
import { formatPrice } from '../utils/format';
import { BASE_URL } from '../api/axios';

const features = [
    { icon: <FiTruck />, title: 'Free Delivery', desc: 'On orders over $30', color: 'text-green-primary', bg: 'bg-green-50' },
    { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '30-day return policy', color: 'text-yellow-deep', bg: 'bg-yellow-pale' },
    { icon: <FiShield />, title: 'Secure Payment', desc: '100% secure checkout', color: 'text-red-primary', bg: 'bg-red-pale' },
    { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Always here for you', color: 'text-green-primary', bg: 'bg-green-50' },
];

function SectionHeader({ title, highlight, subtitle, linkTo }) {
    return (
        <div className="flex items-end justify-between mb-10">
            <div>
                <h2 className="font-heading font-extrabold text-gray-800 text-3xl">
                    {title} <span className="text-green-primary">{highlight}</span>
                </h2>
                {subtitle && <p className="text-gray-400 text-sm mt-1.5">{subtitle}</p>}
                <div className="w-14 h-1 bg-gradient-to-r from-green-700 to-green-400 rounded-full mt-3" />
            </div>
            {linkTo && (
                <Link to={linkTo}
                    className="flex items-center gap-1.5 text-sm font-semibold text-green-primary hover:text-green-700 transition-colors no-underline group">
                    View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            )}
        </div>
    );
}

function PromoBar() {
    const msgs = ['🍃 Free delivery on orders over $30  •  ', '🌿 100% Organic Certified Products  •  ', '🚚 Same-day delivery available  •  ', '⭐ 50,000+ happy customers  •  '];
    return (
        <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white py-2.5 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
                {[...msgs, ...msgs].map((m, i) => (
                    <span key={i} className="text-sm font-medium tracking-wide px-4 text-yellow-bright">{m}</span>
                ))}
            </div>
        </div>
    );
}

function FlashDealCard({ product }) {
    const price = Number(product.price);
    const originalPrice = Number(product.originalPrice);
    const discount = originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return (
        <Link to={`/product/${product.id}`}
            className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex gap-0 group no-underline">
            <div className="w-28 h-28 flex-shrink-0 overflow-hidden">
                <img src={`${BASE_URL}${product.image}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => { e.target.src = `https://picsum.photos/seed/${product.id}/200/200`; }} />
            </div>
            <div className="flex flex-col justify-center p-4 flex-1">
                <p className="text-[10px] font-bold text-red-primary uppercase tracking-widest">Flash Deal</p>
                <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mt-0.5">{product.name}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-base font-extrabold text-green-primary">${formatPrice(product.price)}</span>
                    <span className="text-xs line-through text-gray-400">${formatPrice(product.originalPrice)}</span>
                    <span className="text-[10px] font-bold bg-red-primary text-white px-1.5 py-0.5 rounded-full">{discount}%</span>
                </div>
            </div>
        </Link>
    );
}

export default function Home() {
    const [activeTab, setActiveTab] = useState('featured');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            try {
                const [prodsData, catsData] = await Promise.all([
                    getProducts(),
                    getCategories()
                ]);
                setProducts(prodsData);
                setCategories(catsData);
            } catch (err) {
                console.error('Failed to fetch home products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const getFilteredProducts = () => {
        if (activeTab === 'new') return products.filter(p => p.badge === 'new');
        if (activeTab === 'best') return products.slice(0, 8); // Assuming best sellers are first few
        return products.filter(p => p.badge === 'featured' || !p.badge);
    };

    const flashDeals = products.filter(p => p.badge === 'sale' || p.badge === 'hot' || Number(p.originalPrice) > Number(p.price)).slice(0, 3);

    return (
        <div className="min-h-screen bg-gray-50">
            <PromoBar />
            <HeroSection />

            {/* Features Strip */}
            <section className="py-10 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {features.map(f => (
                            <div key={f.title} className="flex items-center gap-4 group">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${f.color} ${f.bg} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    {f.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{f.title}</p>
                                    <p className="text-xs text-gray-400">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <SectionHeader title="Shop by" highlight="Category" subtitle="Find exactly what you need" linkTo="/shop" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
                    </div>
                </div>
            </section>

            {/* Tabbed Products */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <SectionHeader title="Our" highlight="Products" subtitle="Hand-picked fresh selections" linkTo="/shop" />
                    <div className="flex flex-wrap gap-2 mb-8">
                        {[
                            { key: 'featured', label: 'Featured' },
                            { key: 'new', label: 'New Arrivals' },
                            { key: 'best', label: 'Best Sellers' },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                  ${activeTab === tab.key
                                        ? 'bg-gradient-to-r from-green-800 to-green-500 text-white shadow-green'
                                        : 'bg-white text-gray-600 hover:text-green-primary border border-gray-200 hover:border-green-200'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {getFilteredProducts().map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* Promo Banner */}
            <section className="py-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative bg-gradient-to-r from-green-900 to-green-600 rounded-3xl p-8 overflow-hidden flex flex-col justify-between min-h-[200px]">
                            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                            <div className="absolute -top-6 right-20 w-24 h-24 bg-white/5 rounded-full" />
                            <div>
                                <span className="badge badge-hot mb-3">Limited Offer</span>
                                <h3 className="font-heading font-black text-white text-2xl leading-tight">Fresh Organic<br />Vegetables</h3>
                                <p className="text-white/70 text-sm mt-2">Up to 40% off this week</p>
                            </div>
                            <Link to="/shop?category=vegetables" className="btn-yellow px-6 py-2.5 rounded-full text-sm w-fit no-underline mt-4">Shop Veggies</Link>
                        </div>
                        <div className="relative bg-gradient-to-r from-red-dark to-red-primary rounded-3xl p-8 overflow-hidden flex flex-col justify-between min-h-[200px]">
                            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                            <div className="absolute -top-6 right-20 w-24 h-24 bg-white/5 rounded-full" />
                            <div>
                                <span className="badge badge-new mb-3">New Season</span>
                                <h3 className="font-heading font-black text-white text-2xl leading-tight">Exotic Tropical<br />Fruits</h3>
                                <p className="text-white/70 text-sm mt-2">Discover summer flavours</p>
                            </div>
                            <Link to="/shop?category=fruits" className="btn-yellow px-6 py-2.5 rounded-full text-sm w-fit no-underline mt-4">Shop Fruits</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Flash Deals */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <SectionHeader title="⚡ Flash" highlight="Deals" subtitle="Grab them before they're gone!" linkTo="/shop" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {flashDeals.map(p => <FlashDealCard key={p.id} product={p} />)}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 bg-gradient-to-r from-green-900 via-green-800 to-green-900">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <span className="text-4xl">📬</span>
                    <h2 className="font-heading font-black text-white text-3xl mt-4 mb-3">Stay Fresh & Updated</h2>
                    <p className="text-white/70 mb-8">Get exclusive deals, fresh arrivals, and healthy recipes straight to your inbox.</p>
                    <form className="flex gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email address..."
                            className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-yellow-primary focus:bg-white/15 transition-all text-sm" />
                        <button type="submit" className="btn-yellow px-6 py-3.5 rounded-full text-sm font-bold flex-shrink-0">
                            Subscribe
                        </button>
                    </form>
                    <p className="text-white/40 text-xs mt-4">No spam, unsubscribe anytime.</p>
                </div>
            </section>
        </div>
    );
}