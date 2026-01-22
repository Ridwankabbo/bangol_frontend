import React, { useState, useMemo } from 'react';
import {
    Trash2,
    Minus,
    Plus,
    ChevronLeft,
    ShoppingCart,
    CreditCard,
    ShieldCheck,
    Heart,
    Info
} from 'lucide-react';

/**
 * MOCK_DATA represents initial items in the cart.
 * In a real app, this would come from a global state (Context/Redux) or an API.
 */
const INITIAL_CART = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 299.00,
        color: "Midnight Black",
        size: "One Size",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&h=300&auto=format&fit=crop",
        inStock: true
    },
    {
        id: 2,
        name: "Minimalist Leather Watch",
        price: 150.00,
        color: "Tan/Silver",
        size: "42mm",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&h=300&auto=format&fit=crop",
        inStock: true
    },
    {
        id: 3,
        name: "Cotton Canvas Tote Bag",
        price: 45.00,
        color: "Natural",
        size: "Medium",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300&h=300&auto=format&fit=crop",
        inStock: false
    }
];

const SAVED_ITEMS = [
    {
        id: 101,
        name: "Ergonomic Desk Chair",
        price: 450.00,
        image: "https://images.unsplash.com/photo-1505843490701-5be5d0b19d58?q=80&w=300&h=300&auto=format&fit=crop"
    }
];

export default function App() {
    const [cartItems, setCartItems] = useState([]);
    const [promoCode, setPromoCode] = useState("");
    const [isPromoApplied, setIsPromoApplied] = useState(false);

    // --- Logic ---

    const fetchCartItems = async () => {
        const request = await fetch('http://localhost:8000/products/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if(request.ok){
            const result = await request.json();
            console.log(result);
            
        }
    }

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    // Calculations
    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [cartItems]);

    const shipping = subtotal > 500 ? 0 : 15.00;
    const tax = subtotal * 0.08; // 8% mock tax
    const discount = isPromoApplied ? subtotal * 0.1 : 0; // 10% discount
    const total = subtotal + shipping + tax - discount;

    const handleApplyPromo = (e) => {
        e.preventDefault();
        if (promoCode.toUpperCase() === "SAVE10") {
            setIsPromoApplied(true);
        } else {
            alert("Invalid Promo Code. Try 'SAVE10'");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 font-sans selection:bg-indigo-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 cursor-pointer">
                        <ShoppingCart className="w-6 h-6" />
                        <span>LuminaStore</span>
                    </div>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
                        <a href="#" className="hover:text-indigo-600 transition-colors">Shop</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Categories</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
                    </nav>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                        JD
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-indigo-600 cursor-pointer w-fit group">
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Continue Shopping</span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                    Shopping Cart
                    <span className="ml-3 text-lg font-normal text-gray-500">({cartItems.length} items)</span>
                </h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">

                    {/* Cart Items List */}
                    <section className="lg:col-span-8">
                        {cartItems.length === 0 ? (
                            <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
                                <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
                                <button className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                                    Browse Products
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 sm:gap-6">
                                        {/* Image */}
                                        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-base sm:text-lg font-bold text-gray-900">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                                    <p>Color: <span className="text-gray-900">{item.color}</span></p>
                                                    <p>Size: <span className="text-gray-900">{item.size}</span></p>
                                                </div>
                                                {!item.inStock && (
                                                    <div className="mt-2 flex items-center gap-1.5 text-amber-600 text-xs font-semibold">
                                                        <Info className="w-3.5 h-3.5" />
                                                        Ships in 2-3 weeks
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="p-2 hover:bg-gray-200 transition-colors text-gray-600"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-4 py-1 font-semibold text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="p-2 hover:bg-gray-200 transition-colors text-gray-600"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-4">
                                                    <button className="text-gray-400 hover:text-rose-500 transition-colors p-1" title="Save for later">
                                                        <Heart className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                                                        title="Remove"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Save for Later Section */}
                        {SAVED_ITEMS.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Saved for later</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {SAVED_ITEMS.map(item => (
                                        <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-200 flex gap-4 items-center">
                                            <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                                                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                                <button className="mt-1 text-xs font-bold text-indigo-600 hover:text-indigo-700">Move to cart</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Order Summary */}
                    <aside className="mt-16 lg:mt-0 lg:col-span-4 sticky top-24">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Summary Items */}
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <span>Shipping estimate</span>
                                        <Info className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                    <span className="text-gray-900 font-medium">
                                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax estimate</span>
                                    <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                                </div>
                                {isPromoApplied && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span>Discount (SAVE10)</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between">
                                <span className="text-lg font-bold text-gray-900">Order total</span>
                                <span className="text-2xl font-black text-indigo-600">${total.toFixed(2)}</span>
                            </div>

                            {/* Promo Code Input */}
                            <form onSubmit={handleApplyPromo} className="mt-8">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Promo Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {isPromoApplied && (
                                    <p className="mt-2 text-xs text-emerald-600 font-medium">Promo code successfully applied!</p>
                                )}
                            </form>

                            {/* Checkout Buttons */}
                            <div className="mt-8 space-y-3">
                                <button className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-[0.98]">
                                    <CreditCard className="w-5 h-5" />
                                    Checkout Now
                                </button>
                                <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                                </button>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Secure Checkout Powered by Lumina
                            </div>
                        </div>

                        {/* Small Promotion/Ad */}
                        <div className="mt-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 text-xl font-bold">✨</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-indigo-900">Unlock Free Shipping</p>
                                <p className="text-xs text-indigo-700">Add $50 more to qualify for free delivery!</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer / Legal */}
            <footer className="mt-24 border-t border-gray-200 py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                    <p>&copy; 2024 LuminaStore Inc. All rights reserved.</p>
                    <div className="mt-4 flex justify-center gap-6">
                        <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
                        <a href="#" className="hover:text-indigo-600">Terms of Service</a>
                        <a href="#" className="hover:text-indigo-600">Cookie Settings</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}