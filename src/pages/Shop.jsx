import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiGrid, FiList, FiChevronRight, FiX, FiSearch, FiCpu } from 'react-icons/fi';
import ProductCard from '../components/ProductCard/ProductCard';
import { getProducts, getCategories, getProductsByCategory } from '../api/products';
import toast from 'react-hot-toast';

const SORT_OPTIONS = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'new', label: 'Newest' },
];

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [aiProducts, setAiProducts] = useState(null); // null means no AI recommendations active
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('default');
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [mobileFilter, setMobileFilter] = useState(false);
    const [view, setView] = useState('grid');

    const selectedCategory = searchParams.get('category') || 'all';
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    useEffect(() => {
        const fetchShopProducts = async () => {
            if (aiProducts) return;
            setLoading(true);
            try {
                const params = {};
                if (searchQuery) params.search = searchQuery;

                if (sort === 'price-asc') params.ordering = 'price';
                else if (sort === 'price-desc') params.ordering = '-price';
                else if (sort === 'rating') params.ordering = '-rating';
                else if (sort === 'new') params.ordering = '-created_at';

                let data;
                if (selectedCategory !== 'all') {
                    data = await getProductsByCategory(selectedCategory, params);
                } else {
                    data = await getProducts(params);
                }
                setProducts(data);
            } catch (err) {
                console.error('Failed to fetch shop products:', err);
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchShopProducts();
    }, [selectedCategory, searchQuery, sort, aiProducts]);

    useEffect(() => {
        const handleAIProducts = (e) => {
            setAiProducts(e.detail);
            toast.success('AI updated your product list!', { icon: '🤖' });
        };
        window.addEventListener('ai_products_received', handleAIProducts);
        return () => window.removeEventListener('ai_products_received', handleAIProducts);
    }, []);

    const displayProducts = aiProducts || products;
    const filtered = displayProducts.filter(p => {
        const price = Number(p.price);
        if (isNaN(price)) return true; // Show items with missing/invalid price by default
        const matchesPrice = price >= priceRange[0] && (priceRange[1] >= 100 ? true : price <= priceRange[1]);
        return matchesPrice;
    });

    const setCategory = (slug) => {
        setAiProducts(null); // Clear AI results when manually navigating
        const p = new URLSearchParams(searchParams);
        if (slug === 'all') p.delete('category'); else p.set('category', slug);
        p.delete('search');
        setSearchParams(p);
    };

    const FilterPanel = () => (
        <div className="flex flex-col gap-6">
            {/* AI Status */}
            {aiProducts && (
                <div className="bg-green-50 border border-green-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-green-primary mb-2">
                        <FiCpu className="animate-pulse" />
                        <span className="text-xs font-bold uppercase">AI Recommended</span>
                    </div>
                    <p className="text-[10px] text-green-700 leading-tight mb-3">These products were suggested based on your recent chat.</p>
                    <button onClick={() => setAiProducts(null)} className="w-full py-2 bg-white text-green-primary border border-green-200 rounded-xl text-xs font-bold hover:bg-green-50 transition-all">
                        Clear AI Results
                    </button>
                </div>
            )}

            {/* Categories */}
            <div>
                <h3 className="font-heading font-bold text-gray-800 text-sm mb-3 uppercase tracking-wide">Categories</h3>
                <div className="flex flex-col gap-1">
                    <button onClick={() => setCategory('all')}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${selectedCategory === 'all' && !aiProducts ? 'bg-green-50 text-green-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <span>🛍️ All Products</span>
                    </button>
                    {categories.map(cat => (
                        <button key={cat.slug} onClick={() => setCategory(cat.slug)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${selectedCategory === cat.slug && !aiProducts ? 'bg-green-50 text-green-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span>{cat.icon} {cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="border-t border-gray-100 pt-6">
                <h3 className="font-heading font-bold text-gray-800 text-sm mb-4 uppercase tracking-wide">Price Range</h3>
                <input type="range" min="0" max="100" value={priceRange[1]} onChange={e => setPriceRange([0, +e.target.value])}
                    className="w-full accent-green-500" />
                <div className="flex items-center justify-between text-sm font-semibold text-gray-600 mt-2">
                    <span>$0</span><span className="text-green-primary">${priceRange[1]}+</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-[70px]">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
                    <Link to="/" className="hover:text-green-primary transition-colors no-underline">Home</Link>
                    <FiChevronRight className="text-xs" />
                    <span className="text-green-primary font-medium">Shop</span>
                    {searchQuery && <><FiChevronRight className="text-xs" /><span className="text-green-primary font-medium">"{searchQuery}"</span></>}
                    {aiProducts && <><FiChevronRight className="text-xs" /><span className="text-green-primary font-medium italic">AI Recommendations</span></>}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Sidebar – Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                            <FilterPanel />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl shadow-card px-5 py-4 mb-6">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setMobileFilter(true)}
                                    className="lg:hidden flex items-center gap-2 text-sm font-semibold text-gray-600 px-4 py-2 border border-gray-200 rounded-xl hover:border-green-primary hover:text-green-primary transition-all">
                                    <FiFilter /> Filter
                                </button>
                                <p className="text-sm text-gray-500 text-pretty">
                                    {aiProducts ? (
                                        <span>🤖 AI found <span className="font-bold text-green-primary">{filtered.length}</span> matching products</span>
                                    ) : (
                                        <>Showing <span className="font-bold text-gray-800">{filtered.length}</span> results
                                            {selectedCategory !== 'all' && <span className="text-green-primary"> in {categories.find(c => c.slug === selectedCategory)?.name}</span>}
                                            {searchQuery && <span className="text-green-primary"> for "{searchQuery}"</span>}</>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-nowrap">
                                {!aiProducts && (
                                    <select value={sort} onChange={e => setSort(e.target.value)}
                                        className="px-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-green-primary text-gray-600">
                                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                )}
                                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                                    <button onClick={() => setView('grid')} className={`p-2.5 text-sm ${view === 'grid' ? 'bg-green-primary text-white' : 'text-gray-600 hover:bg-gray-50'} transition-all`}><FiGrid /></button>
                                    <button onClick={() => setView('list')} className={`p-2.5 text-sm ${view === 'list' ? 'bg-green-primary text-white' : 'text-gray-600 hover:bg-gray-50'} transition-all`}><FiList /></button>
                                </div>
                            </div>
                        </div>

                        {loading && !aiProducts ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
                                ))}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-card">
                                <span className="text-6xl text-nowrap">🔍</span>
                                <h3 className="font-heading text-xl font-bold text-gray-500 mt-4 text-pretty">No products found</h3>
                                <p className="text-gray-400 text-sm mt-2 text-pretty">Try adjusting your filters or search term.</p>
                                <button onClick={() => { setCategory('all'); setAiProducts(null); }} className="btn-green px-6 py-2.5 rounded-full text-sm mt-6">Clear Filters</button>
                            </div>
                        ) : (
                            <div className={view === 'grid'
                                ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                                : 'flex flex-col gap-4'}>
                                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilter && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-[200] animate-fade-in" onClick={() => setMobileFilter(false)} />
                    <div className="fixed top-0 left-0 w-72 h-full bg-white z-[300] flex flex-col shadow-2xl animate-slide-in-left">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 text-nowrap">
                            <h3 className="font-heading font-bold text-gray-800">Filters</h3>
                            <button onClick={() => setMobileFilter(false)} className="text-gray-500 hover:text-red-primary transition-colors"><FiX /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5"><FilterPanel /></div>
                        <div className="p-5 border-t border-gray-100">
                            <button onClick={() => setMobileFilter(false)} className="btn-green w-full py-3 rounded-full text-sm">Apply Filters</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}