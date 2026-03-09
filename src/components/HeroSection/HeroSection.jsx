import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-primary to-green-800 pt-[70px]">
            {/* Decorative circles */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-yellow-primary/10 pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[150px] h-[150px] rounded-full bg-white/5 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 py-16 lg:py-24">
                {/* Content */}
                <div className="flex flex-col gap-6 animate-slide-in-up">
                    <span className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-yellow-bright px-4 py-2 rounded-full text-sm font-bold w-fit backdrop-blur-sm">
                        🌿 100% Certified Organic
                    </span>
                    <h1 className="font-heading font-black text-white leading-[1.1]" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}>
                        Fresh From Farm<br />
                        <span className="text-yellow-bright">To Your Table</span>
                    </h1>
                    <p className="text-white/80 text-lg leading-relaxed max-w-lg">
                        Discover the finest selection of fresh fruits, vegetables and organic products — delivered to your door within 2 hours.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link to="/shop" className="btn-yellow px-8 py-4 rounded-full text-base font-bold no-underline shadow-yellow hover:shadow-xl hover:-translate-y-1 transition-all">
                            🛍️ Shop Now
                        </Link>
                        <Link to="/shop" className="px-8 py-4 rounded-full text-base font-semibold border-2 border-white/50 text-white hover:bg-white/10 hover:border-white transition-all no-underline">
                            Explore Categories →
                        </Link>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-5 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 w-fit">
                        {[
                            { icon: '🚚', title: 'Free Delivery', sub: 'Orders over $30' },
                            { icon: '⭐', title: '4.9 Rating', sub: '50K+ Reviews' },
                            { icon: '🌿', title: 'Organic', sub: '99% Certified' },
                        ].map((b, i) => (
                            <div key={b.title} className="flex items-center gap-3">
                                {i > 0 && <div className="w-px h-10 bg-white/20" />}
                                <span className="text-2xl">{b.icon}</span>
                                <div>
                                    <p className="text-white text-sm font-bold leading-none">{b.title}</p>
                                    <p className="text-white/60 text-xs mt-0.5">{b.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image Side */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-[420px] h-[420px] rounded-full bg-white/10 border border-white/20" />
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"
                        alt="Fresh groceries"
                        className="relative z-10 w-full max-w-[520px] h-[400px] lg:h-[450px] object-cover rounded-3xl shadow-2xl"
                    />
                    {/* Floating labels */}
                    <div className="absolute top-6 -left-4 bg-white rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2.5 z-20 animate-float">
                        <span className="text-2xl">🥕</span>
                        <div>
                            <p className="text-gray-800 text-xs font-bold">Just Restocked!</p>
                            <p className="text-gray-400 text-[10px]">50+ new items</p>
                        </div>
                    </div>
                    <div className="absolute bottom-12 -right-4 bg-white rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2.5 z-20 animate-float [animation-delay:1s]">
                        <span className="text-2xl">🍓</span>
                        <div>
                            <p className="text-gray-800 text-xs font-bold">Fresh Today</p>
                            <p className="text-gray-400 text-[10px]">Delivered in 2hrs</p>
                        </div>
                    </div>
                    <div className="absolute -top-2 right-16 bg-white rounded-2xl p-3 shadow-lg z-20 text-center animate-float [animation-delay:0.5s]">
                        <p className="text-red-primary text-2xl font-black leading-none">30%</p>
                        <p className="text-red-primary text-xs font-extrabold tracking-widest">OFF</p>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                        {[
                            { num: '500+', label: 'Fresh Products' },
                            { num: '50K+', label: 'Happy Customers' },
                            { num: '99%', label: 'Organic Certified' },
                            { num: '2hr', label: 'Fast Delivery' },
                        ].map(s => (
                            <div key={s.label} className="py-7 text-center">
                                <div className="font-heading font-black text-3xl bg-gradient-to-r from-green-800 to-green-500 bg-clip-text text-transparent">{s.num}</div>
                                <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
