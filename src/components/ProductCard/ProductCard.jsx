
import { Link } from 'react-router-dom';
import { FiStar, FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';

export default function ProductCard({ product }) {
    console.log(product);
    
    const { addToCart, toggleWishlist, isInWishlist, isInCart } = useCart();
    const price = Number(product.price);
    const originalPrice = Number(product.originalPrice);

    const discount = originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : null;
    const inWishlist = isInWishlist(product.id);
    const inCart = isInCart(product.id);

    const badges = {
        new: { label: 'New', cls: 'badge-new' },
        sale: { label: `${discount}% Off`, cls: 'badge-sale' },
        hot: { label: '🔥 Hot', cls: 'badge-hot' },
        organic: { label: '🌿 Organic', cls: 'badge-organic' },
    };
    const badge = product.badge ? badges[product.badge] : null;

    const renderStars = (rating) =>
        Array.from({ length: 5 }, (_, i) => (
            <FiStar key={i} className={`text-xs ${i < Math.round(rating) ? 'text-yellow-primary fill-yellow-primary' : 'text-gray-200'}`} />
        ));

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover group flex flex-col">
            {/* Image */}
            <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
                {product.product_image && product.product_image.length > 0 && (
                    <img src={`http://localhost:8000/${product.product_image[0].image}`} alt={product.product_image[0].alt_text}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy" />
                )}
                {badge && <span className={`${badge.cls} absolute top-3 left-3 z-10`}>{badge.label}</span>}

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-10">
                    <button onClick={() => toggleWishlist(product)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-md transition-all
              ${inWishlist ? 'bg-red-pale text-red-primary' : 'bg-white text-gray-600 hover:bg-red-pale hover:text-red-primary'}`}>
                        <FiHeart className={inWishlist ? 'fill-current' : ''} />
                    </button>
                    <Link to={`/product/${product.id}`}
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-sm text-gray-600 shadow-md hover:bg-green-50 hover:text-green-primary transition-all no-underline">
                        <FiEye />
                    </Link>
                </div>

                {product.stock <= 10 && product.stock > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-primary text-white text-[10px] font-bold text-center py-1 tracking-wide">
                        Only {product.stock} left!
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-1.5 flex-1">
                <p className="text-[10px] font-bold text-green-primary uppercase tracking-widest">{product.category}</p>
                <Link to={`/product/${product.id}`}
                    className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-green-primary transition-colors leading-snug no-underline">
                    {product.name}
                </Link>
                <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                    <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-green-primary">${formatPrice(product.price)}</span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">${formatPrice(product.originalPrice)}</span>
                        )}
                    </div>
                    <button onClick={() => addToCart(product)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200
              ${inCart
                                ? 'bg-yellow-pale text-yellow-deep border border-yellow-primary'
                                : 'bg-gradient-to-r from-green-700 to-green-500 text-white hover:shadow-green hover:scale-105'}`}>
                        <FiShoppingCart />
                        {inCart ? 'Added ✓' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
}
