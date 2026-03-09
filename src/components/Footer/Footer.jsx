import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-2.5">
                            <span className="text-3xl">🌿</span>
                            <div>
                                <div className="font-heading font-extrabold text-xl text-green-light">Bangol</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Fresh Market</div>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed">Your trusted destination for fresh, organic, and premium quality groceries delivered straight to your door.</p>
                        <div className="flex gap-3">
                            {[
                                { Icon: FiFacebook, cls: 'bg-blue-600', label: 'Facebook' },
                                { Icon: FiTwitter, cls: 'bg-sky-500', label: 'Twitter' },
                                { Icon: FiInstagram, cls: 'bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600', label: 'Instagram' },
                                { Icon: FiYoutube, cls: 'bg-red-600', label: 'YouTube' },
                            ].map(({ Icon, cls, label }) => (
                                <a key={label} href="#" aria-label={label}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm transition-transform hover:-translate-y-1 hover:shadow-lg ${cls}`}>
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-bold text-white text-base mb-5 pb-3 border-b-2 border-green-primary inline-block">Quick Links</h4>
                        <ul className="flex flex-col gap-3">
                            {['Home', 'Shop', 'About Us', 'Contact', 'Blog'].map(l => (
                                <li key={l}>
                                    <Link to={l === 'Home' ? '/' : `/${l.toLowerCase().replace(' ', '-')}`}
                                        className="text-sm text-gray-400 hover:text-green-light transition-all hover:pl-1.5 duration-200 flex items-center gap-2 group no-underline">
                                        <span className="text-green-light text-xs">→</span>{l}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-heading font-bold text-white text-base mb-5 pb-3 border-b-2 border-green-primary inline-block">Categories</h4>
                        <ul className="flex flex-col gap-3">
                            {['Vegetables', 'Fruits', 'Dairy & Eggs', 'Bakery', 'Beverages', 'Organic'].map(c => (
                                <li key={c}>
                                    <Link to={`/shop?category=${c.toLowerCase().split(' ')[0]}`}
                                        className="text-sm text-gray-400 hover:text-green-light transition-all hover:pl-1.5 duration-200 flex items-center gap-2 no-underline">
                                        <span className="text-green-light text-xs">→</span>{c}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-heading font-bold text-white text-base mb-5 pb-3 border-b-2 border-green-primary inline-block">Contact Us</h4>
                        <ul className="flex flex-col gap-4 mb-6">
                            {[
                                { Icon: FiMapPin, text: '42 Green Market Street, Fresh City' },
                                { Icon: FiPhone, text: '+1 (555) 234-5678' },
                                { Icon: FiMail, text: 'hello@bangolfresh.com' },
                            ].map(({ Icon, text }) => (
                                <li key={text} className="flex items-start gap-3 text-sm">
                                    <Icon className="text-green-light flex-shrink-0 mt-0.5" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                        <div className="bg-white/5 rounded-xl p-4">
                            <h5 className="text-white text-sm font-semibold mb-2">Store Hours</h5>
                            <p className="text-xs text-gray-500">Mon–Sat: 7am – 9pm</p>
                            <p className="text-xs text-gray-500">Sunday: 8am – 6pm</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Bangol Fresh Market. All rights reserved.</p>
                    <div className="flex gap-6">
                        {['Privacy Policy', 'Terms of Service', 'Cookies'].map(l => (
                            <a key={l} href="#" className="text-xs text-gray-500 hover:text-green-light transition-colors no-underline">{l}</a>
                        ))}
                    </div>
                    <div className="flex gap-2 text-xl">💳 🏦 📱</div>
                </div>
            </div>
        </footer>
    );
}
