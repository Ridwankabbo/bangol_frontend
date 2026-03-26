import { Link } from 'react-router-dom';
import { FiTrash2, FiArrowRight, FiShoppingBag, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { BASE_URL } from '../api/axios';

export default function Cart() {
    const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

    if (cartItems.length === 0) return (
        <div className="min-h-screen bg-gray-50 pt-[70px] flex flex-col items-center justify-center gap-5 px-6">
            <span className="text-8xl">🛒</span>
            <h2 className="font-heading font-extrabold text-2xl text-gray-700">Your cart is empty</h2>
            <p className="text-gray-400">Looks like you haven't added any items yet.</p>
            <Link to="/shop" className="btn-green px-8 py-3.5 rounded-full no-underline">Start Shopping</Link>
        </div>
    );

    const delivery = cartTotal >= 30 ? 0 : 4.99;
    const tax = cartTotal * 0.08;
    const total = cartTotal + delivery + tax;

    return (
        <div className="min-h-screen bg-gray-50 pt-[70px]">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
                    <Link to="/" className="hover:text-green-primary no-underline">Home</Link><FiChevronRight className="text-xs" />
                    <span className="text-green-primary font-medium">Cart</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-heading font-extrabold text-2xl text-gray-800">Shopping Cart <span className="text-green-primary">({cartItems.length})</span></h1>
                    <button onClick={clearCart} className="text-sm text-red-primary hover:text-red-dark flex items-center gap-1.5 transition-colors">
                        <FiTrash2 /> Clear All
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-card p-5 flex gap-4 hover:border-green-200 border border-transparent transition-all">
                                <Link to={`/product/${item.id}`} className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 no-underline">
                                    <img src={item.image ? (item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`) : ''} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform"
                                        onError={e => { e.target.src = `https://picsum.photos/seed/${item.id}/200/200`; }} />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-green-primary uppercase tracking-widest capitalize">{item.category}</p>
                                    <Link to={`/product/${item.id}`} className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug hover:text-green-primary transition-colors no-underline">{item.name}</Link>
                                    <p className="text-green-primary font-extrabold text-base mt-1">${formatPrice(item.price)}</p>
                                </div>
                                <div className="flex flex-col items-end justify-between gap-3">
                                    <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-gray-400 hover:text-red-primary hover:bg-red-pale rounded-lg transition-all">
                                        <FiTrash2 className="text-sm" />
                                    </button>
                                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 bg-gray-50 hover:bg-green-50 hover:text-green-primary text-gray-600 font-bold flex items-center justify-center text-lg transition-all">−</button>
                                        <span className="w-9 text-center text-sm font-bold text-gray-800 border-x border-gray-200">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 bg-gray-50 hover:bg-green-50 hover:text-green-primary text-gray-600 font-bold flex items-center justify-center text-lg transition-all">+</button>
                                    </div>
                                    <p className="font-extrabold text-gray-800 text-sm">${formatPrice(Number(item.price) * item.quantity)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-4">
                        {/* Promo */}
                        <div className="bg-white rounded-2xl shadow-card p-5">
                            <h3 className="font-heading font-bold text-gray-800 mb-4">Promo Code</h3>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Enter code..." className="form-input flex-1 py-3 text-sm" />
                                <button className="btn-outline-green px-4 py-3 rounded-xl text-sm font-semibold">Apply</button>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-card p-5">
                            <h3 className="font-heading font-bold text-gray-800 mb-5">Order Summary</h3>
                            <div className="flex flex-col gap-3">
                                {[
                                    { label: 'Subtotal', val: `$${formatPrice(cartTotal)}` },
                                    { label: 'Delivery', val: delivery === 0 ? 'FREE 🎉' : `$${formatPrice(delivery)}`, special: delivery === 0 },
                                    { label: 'Tax (8%)', val: `$${formatPrice(tax)}` },
                                ].map(r => (
                                    <div key={r.label} className="flex justify-between text-sm text-gray-600">
                                        <span>{r.label}</span>
                                        <span className={`font-semibold ${r.special ? 'text-green-primary' : ''}`}>{r.val}</span>
                                    </div>
                                ))}
                                {delivery > 0 && (
                                    <p className="text-[11px] text-yellow-deep bg-yellow-pale border border-dashed border-yellow-primary rounded-lg py-2 px-3 font-semibold text-center">
                                        Add ${formatPrice(30 - cartTotal)} more for free shipping!
                                    </p>
                                )}
                                <div className="border-t-2 border-dashed border-gray-200 pt-3 flex justify-between font-extrabold text-base text-gray-800">
                                    <span>Total</span>
                                    <span className="text-green-primary">${formatPrice(total)}</span>
                                </div>
                            </div>
                            <Link to="/checkout"
                                className="btn-green w-full py-4 rounded-2xl text-sm mt-5 no-underline flex items-center justify-center gap-2">
                                Proceed to Checkout <FiArrowRight />
                            </Link>
                            <Link to="/shop" className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-green-primary mt-3 transition-colors no-underline">
                                <FiShoppingBag /> Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}