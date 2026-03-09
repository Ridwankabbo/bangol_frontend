import { Link } from 'react-router-dom';
import { FiX, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

export default function CartSidebar() {
    const { cartItems, cartOpen, cartTotal, cartCount, closeCartSidebar, removeFromCart, updateQuantity } = useCart();
    if (!cartOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[250] animate-fade-in" onClick={closeCartSidebar} />
            <aside className="fixed top-0 right-0 w-[400px] max-w-full h-full bg-white z-[300] flex flex-col shadow-2xl animate-slide-in-right">

                {/* Header */}
                <div className="flex items-start justify-between px-6 py-6 border-b border-gray-100 bg-green-50">
                    <div>
                        <h2 className="font-heading font-extrabold text-xl text-gray-800">My Cart</h2>
                        <p className="text-sm text-green-primary font-semibold mt-0.5">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={closeCartSidebar}
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm hover:bg-red-pale hover:text-red-primary transition-all">
                        <FiX />
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10 text-center">
                        <FiShoppingBag className="text-6xl text-gray-200" />
                        <h3 className="text-lg font-semibold text-gray-500">Your cart is empty</h3>
                        <p className="text-sm text-gray-400">Add some fresh items to get started!</p>
                        <button onClick={closeCartSidebar} className="btn-green px-6 py-2.5 rounded-full text-sm mt-2">
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-3.5 hover:border-green-200 hover:bg-green-50 transition-all">
                                    <div className="w-[70px] h-[70px] rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                                            onError={e => { e.target.src = `https://picsum.photos/seed/${item.id}/80/80`; }} />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{item.name}</p>
                                        <p className="text-sm text-green-primary font-bold">${item.price.toFixed(2)}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 bg-gray-100 hover:bg-green-100 hover:text-green-primary text-gray-600 font-bold flex items-center justify-center transition-all text-lg">
                                                    −
                                                </button>
                                                <span className="w-9 text-center text-sm font-bold text-gray-800 border-x border-gray-200">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 bg-gray-100 hover:bg-green-100 hover:text-green-primary text-gray-600 font-bold flex items-center justify-center transition-all text-lg">
                                                    +
                                                </button>
                                            </div>
                                            <span className="text-sm font-extrabold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-primary hover:bg-red-pale rounded-lg transition-all self-start">
                                        <FiTrash2 className="text-sm" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-gray-100 flex flex-col gap-4">
                            {/* Promo */}
                            <div className="flex gap-2">
                                <input type="text" placeholder="Promo code..." className="form-input flex-1 text-sm py-2.5" />
                                <button className="btn-outline-green px-4 py-2 rounded-xl text-sm font-semibold">Apply</button>
                            </div>

                            {/* Summary */}
                            <div className="flex flex-col gap-2 bg-gray-50 rounded-2xl p-4">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span><span className="font-semibold">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery</span>
                                    <span className={`font-semibold ${cartTotal >= 30 ? 'text-green-primary' : ''}`}>
                                        {cartTotal >= 30 ? 'FREE 🎉' : '$4.99'}
                                    </span>
                                </div>
                                {cartTotal < 30 && (
                                    <p className="text-[11px] text-center text-yellow-deep bg-yellow-pale border border-dashed border-yellow-primary rounded-lg py-2 px-3 font-semibold">
                                        Add ${(30 - cartTotal).toFixed(2)} more for free shipping!
                                    </p>
                                )}
                                <div className="flex justify-between font-extrabold text-base text-gray-800 pt-2 border-t border-dashed border-gray-200 mt-1">
                                    <span>Total</span>
                                    <span className="text-green-primary">${(cartTotal + (cartTotal >= 30 ? 0 : 4.99)).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <Link to="/cart" onClick={closeCartSidebar}
                                    className="w-full py-3 rounded-full border-2 border-green-primary text-green-primary text-sm font-bold text-center hover:bg-green-50 transition-all no-underline">
                                    View Cart
                                </Link>
                                <Link to="/checkout" onClick={closeCartSidebar}
                                    className="w-full py-3 rounded-full bg-gradient-to-r from-green-800 to-green-500 text-white text-sm font-bold text-center flex items-center justify-center gap-2 hover:shadow-green hover:-translate-y-0.5 transition-all no-underline">
                                    Checkout <FiArrowRight />
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
}
