import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard/ProductCard';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
    const { wishlist } = useCart();

    return (
        <div className="min-h-screen bg-gray-50 pt-[70px]">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
                    <Link to="/" className="hover:text-green-primary no-underline">Home</Link><FiChevronRight className="text-xs" />
                    <span className="text-green-primary font-medium">Wishlist</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-heading font-extrabold text-2xl text-gray-800">
                        My Wishlist <span className="text-red-primary">({wishlist.length})</span>
                    </h1>
                    {wishlist.length > 0 && (
                        <Link to="/shop" className="btn-green px-5 py-2.5 rounded-full text-sm no-underline">
                            <FiShoppingCart /> Shop More
                        </Link>
                    )}
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-card">
                        <span className="text-7xl">💔</span>
                        <h3 className="font-heading font-extrabold text-xl text-gray-600 mt-5">Your wishlist is empty</h3>
                        <p className="text-gray-400 text-sm mt-2 mb-8">Save items you love by clicking the heart icon</p>
                        <Link to="/shop" className="btn-green px-8 py-3.5 rounded-full no-underline">Discover Products</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
