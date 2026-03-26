import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/format';

const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirm'];

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        country: 'US',
        payment: 'card'
    });
    const [placed, setPlaced] = useState(false);
    const [loading, setLoading] = useState(false);

    const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const delivery = cartTotal >= 30 ? 0 : 4.99;
    const tax = cartTotal * 0.08;
    const total = cartTotal + delivery + tax;

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            // Structure data for backend checkout API
            const orderData = {
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                shipping_address: {
                    first_name: form.firstName,
                    last_name: form.lastName,
                    email: form.email,
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                    zip: form.zip,
                    country: form.country
                },
                payment_method: form.payment,
                total: total,
                subtotal: cartTotal,
                tax: tax,
                delivery: delivery
            };

            await api.post('order/checkout/', orderData);

            clearCart();
            setPlaced(true);
            toast.success('Order placed successfully!');
        } catch (err) {
            console.error('Checkout failed:', err);
            toast.error(err.response?.data?.detail || 'Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (placed) return (
        <div className="min-h-screen bg-gray-50 pt-[70px] flex flex-col items-center justify-center gap-6 text-center px-6">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-primary text-5xl shadow-green">✅</div>
            <h2 className="font-heading font-black text-3xl text-gray-800">Order Placed!</h2>
            <p className="text-gray-500 max-w-md">Thank you for your order! You'll receive a confirmation email at <strong>{form.email}</strong>. Estimated delivery: <strong>2 hours</strong>.</p>
            <p className="text-2xl font-black text-green-primary">Total: ${formatPrice(total)}</p>
            <div className="flex gap-4 flex-wrap justify-center">
                <Link to="/shop" className="btn-green px-8 py-3.5 rounded-full no-underline">Continue Shopping</Link>
                <Link to="/" className="btn-outline-green px-8 py-3.5 rounded-full no-underline">Go Home</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-[70px]">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
                    <Link to="/" className="hover:text-green-primary no-underline">Home</Link><FiChevronRight className="text-xs" />
                    <Link to="/cart" className="hover:text-green-primary no-underline">Cart</Link><FiChevronRight className="text-xs" />
                    <span className="text-green-primary font-medium">Checkout</span>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-3xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className="flex flex-col items-center gap-1">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
                    ${i < step ? 'bg-green-primary text-white' : i === (step - 1) ? 'bg-green-100 text-green-primary border-2 border-green-primary' : 'bg-gray-100 text-gray-400'}`}>
                                        {i < (step - 1) ? <FiCheck /> : i + 1}
                                    </div>
                                    <span className={`text-xs font-medium ${i < step ? 'text-green-primary' : 'text-gray-400'}`}>{s}</span>
                                </div>
                                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < (step - 1) ? 'bg-green-primary' : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                    {step === 1 && (
                        <div className="bg-white rounded-3xl shadow-card p-8">
                            <h2 className="font-heading font-bold text-xl text-gray-800 mb-6">Shipping Details</h2>
                            {!user && (
                                <div className="mb-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-center justify-between">
                                    <p className="text-sm text-yellow-800 font-medium">Checkout as guest or sign in for faster checkout.</p>
                                    <Link to="/login" className="text-sm font-bold text-yellow-900 underline">Sign In</Link>
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {[['firstName', 'First Name'], ['lastName', 'Last Name'], ['email', 'Email Address'], ['phone', 'Phone Number']].map(([k, l]) => (
                                    <div key={k} className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700">{l}</label>
                                        <input type={k === 'email' ? 'email' : 'text'} value={form[k]} onChange={e => update(k, e.target.value)}
                                            className="form-input" placeholder={l} required />
                                    </div>
                                ))}
                                <div className="sm:col-span-2 flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Street Address</label>
                                    <input type="text" value={form.address} onChange={e => update('address', e.target.value)} className="form-input" placeholder="123 Main St" required />
                                </div>
                                {[['city', 'City'], ['zip', 'ZIP Code'], ['country', 'Country']].map(([k, l]) => (
                                    <div key={k} className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700">{l}</label>
                                        <input type="text" value={form[k]} onChange={e => update(k, e.target.value)} className="form-input" placeholder={l} required />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!form.email || !form.address}
                                className="btn-green w-full py-4 rounded-2xl text-sm mt-8 disabled:opacity-50 disabled:cursor-not-allowed">
                                Continue to Payment
                            </button>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="bg-white rounded-3xl shadow-card p-8">
                            <h2 className="font-heading font-bold text-xl text-gray-800 mb-6">Payment Method</h2>
                            <div className="flex flex-col gap-4">
                                {[
                                    { key: 'card', label: 'Credit / Debit Card', icon: '💳' },
                                    { key: 'paypal', label: 'PayPal', icon: '🅿️' },
                                    { key: 'mobile', label: 'Mobile Banking', icon: '📱' },
                                ].map(p => (
                                    <label key={p.key}
                                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all
                      ${form.payment === p.key ? 'border-green-primary bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                                        <input type="radio" name="payment" value={p.key} checked={form.payment === p.key} onChange={e => update('payment', e.target.value)} className="hidden" />
                                        <span className="text-2xl">{p.icon}</span>
                                        <span className="font-semibold text-gray-800">{p.label}</span>
                                        {form.payment === p.key && <FiCheck className="ml-auto text-green-primary font-bold text-lg" />}
                                    </label>
                                ))}
                                {form.payment === 'card' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 animate-fade-in">
                                        <div className="sm:col-span-2 flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-700">Card Number</label>
                                            <input type="text" placeholder="•••• •••• •••• ••••" className="form-input" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-700">Expiry Date</label>
                                            <input type="text" placeholder="MM / YY" className="form-input" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-700">CVV</label>
                                            <input type="text" placeholder="•••" className="form-input" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setStep(1)} className="btn-outline-green flex-1 py-4 rounded-2xl text-sm">← Back</button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="btn-green flex-1 py-4 rounded-2xl text-sm flex items-center justify-center gap-2">
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        'Place Order 🎉'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-3xl shadow-card p-6 h-fit sticky top-24">
                    <h3 className="font-heading font-bold text-gray-800 mb-5">Order Summary</h3>
                    <div className="flex flex-col gap-3 max-h-60 overflow-y-auto mb-4 pr-1">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover"
                                    onError={e => { e.target.src = `https://picsum.photos/seed/${item.id}/60/60`; }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-700 line-clamp-1">{item.name}</p>
                                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                                </div>
                                <p className="text-sm font-bold text-green-primary flex-shrink-0">${formatPrice(Number(item.price) * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-dashed border-gray-200 pt-4 flex flex-col gap-2.5">
                        <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span className="font-semibold">${formatPrice(cartTotal)}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Delivery</span><span className={`font-semibold ${delivery === 0 ? 'text-green-primary' : ''}`}>{delivery === 0 ? 'FREE' : `$${formatPrice(delivery)}`}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Tax (8%)</span><span className="font-semibold">${formatPrice(tax)}</span></div>
                        <div className="flex justify-between font-extrabold text-base text-gray-800 pt-2 border-t border-gray-200 mt-1">
                            <span>Total</span><span className="text-green-primary">${formatPrice(total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}