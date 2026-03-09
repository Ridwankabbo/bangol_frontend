import { Link } from 'react-router-dom';

const team = [
    { name: 'Michael Greene', role: 'Founder & CEO', emoji: '👨‍💼', bg: 'bg-green-100' },
    { name: 'Sarah Fresh', role: 'Head of Sourcing', emoji: '👩‍🌾', bg: 'bg-yellow-pale' },
    { name: 'David Bloom', role: 'Operations Lead', emoji: '👨‍🏭', bg: 'bg-red-pale' },
    { name: 'Lisa Chen', role: 'Customer Success', emoji: '👩‍💻', bg: 'bg-green-50' },
];

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50 pt-[70px]">
            {/* Hero */}
            <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-20 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="relative max-w-3xl mx-auto">
                    <span className="text-5xl mb-4 block">🌿</span>
                    <h1 className="font-heading font-black text-4xl mb-4">About <span className="text-yellow-bright">Bangol</span></h1>
                    <p className="text-white/80 text-lg leading-relaxed">
                        We believe everyone deserves access to fresh, healthy food. Since 2018, we've been connecting local farms directly with families, ensuring the freshest produce reaches your table daily.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="badge badge-new mb-4">Our Mission</span>
                            <h2 className="font-heading font-extrabold text-3xl text-gray-800 mb-5">Farm Fresh, <span className="text-green-primary">Every Day</span></h2>
                            <p className="text-gray-500 leading-relaxed mb-4">We partner directly with over 200 local and regional farms to bring you the freshest organic produce without the middlemen. Our rigorous quality standards ensure only the best reaches your door.</p>
                            <p className="text-gray-500 leading-relaxed mb-6">From seed to shelf in under 24 hours — that's our promise. We're committed to sustainable farming practices, fair wages for farmers, and zero food waste.</p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { num: '200+', label: 'Partner Farms', color: 'text-green-primary' },
                                    { num: '50K+', label: 'Happy Customers', color: 'text-yellow-deep' },
                                    { num: '500+', label: 'Products Daily', color: 'text-green-primary' },
                                    { num: '2hrs', label: 'Avg Delivery', color: 'text-red-primary' },
                                ].map(s => (
                                    <div key={s.label} className="bg-gray-50 rounded-2xl p-4 text-center">
                                        <p className={`font-heading font-black text-2xl ${s.color}`}>{s.num}</p>
                                        <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80" alt="Fresh farm" className="rounded-3xl shadow-2xl w-full h-80 object-cover" />
                            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-lg flex items-center gap-3">
                                <span className="text-3xl">🏅</span>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Certified Organic</p>
                                    <p className="text-xs text-gray-400">USDA & EU Certified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="font-heading font-extrabold text-3xl text-gray-800 mb-2">Meet the <span className="text-green-primary">Team</span></h2>
                    <p className="text-gray-400 text-sm mb-10">The passionate people behind every fresh delivery</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {team.map(t => (
                            <div key={t.name} className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all text-center">
                                <div className={`w-20 h-20 rounded-2xl ${t.bg} flex items-center justify-center mx-auto text-4xl mb-4`}>{t.emoji}</div>
                                <h3 className="font-heading font-bold text-gray-800 text-sm">{t.name}</h3>
                                <p className="text-xs text-gray-400 mt-1">{t.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-green-800 to-green-primary text-center px-6">
                <h2 className="font-heading font-black text-3xl text-white mb-3">Ready to Eat Fresh?</h2>
                <p className="text-white/70 mb-8">Join 50,000+ families enjoying farm-fresh groceries every week.</p>
                <Link to="/shop" className="btn-yellow px-10 py-4 rounded-full text-base font-bold no-underline shadow-yellow">Shop Now →</Link>
            </section>
        </div>
    );
}
