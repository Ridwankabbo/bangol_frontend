import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiSearch, FiMenu, FiX, FiUser, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    {
        label: 'Categories', to: '#',
        dropdown: [
            { label: '🥦 Vegetables', to: '/shop?category=vegetables' },
            { label: '🍎 Fruits', to: '/shop?category=fruits' },
            { label: '🥛 Dairy & Eggs', to: '/shop?category=dairy' },
            { label: '🍞 Bakery', to: '/shop?category=bakery' },
            { label: '🧃 Beverages', to: '/shop?category=beverages' },
            { label: '🌿 Organic', to: '/shop?category=organic' },
        ]
    },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
    const { cartCount, wishlist, toggleCartSidebar } = useCart();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const [query, setQuery] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
            setQuery(''); setSearchOpen(false);
        }
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 h-[70px] transition-all duration-300
        ${scrolled ? 'bg-white shadow-xl translate-y-0' : 'bg-white/95 backdrop-blur-xl border-b border-gray-100'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center h-full gap-8">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
                        <span className="text-3xl">🌿</span>
                        <div className="flex flex-col leading-none">
                            <span className="font-heading font-extrabold text-xl text-green-primary">Bangol</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Fresh Market</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1 flex-1">
                        {navLinks.map(link => (
                            <div key={link.label} className="relative group"
                                onMouseEnter={() => link.dropdown && setOpenDropdown(link.label)}
                                onMouseLeave={() => setOpenDropdown(null)}>
                                <NavLink to={link.to === '#' ? '/shop' : link.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 no-underline
                    ${isActive && link.to !== '#' ? 'text-green-primary bg-green-50' : 'text-gray-600 hover:text-green-primary hover:bg-green-50'}`
                                    }>
                                    {link.label}
                                    {link.dropdown && <FiChevronDown className="text-xs group-hover:rotate-180 transition-transform duration-200" />}
                                </NavLink>
                                {link.dropdown && openDropdown === link.label && (
                                    <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-card-hover border border-gray-100 min-w-[200px] overflow-hidden z-50 animate-slide-in-up">
                                        {link.dropdown.map(item => (
                                            <Link key={item.label} to={item.to}
                                                className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-green-primary transition-all duration-150 hover:pl-7 no-underline"
                                                onClick={() => setOpenDropdown(null)}>
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Action Icons */}
                    <div className="flex items-center gap-1.5 ml-auto">
                        <button onClick={() => setSearchOpen(!searchOpen)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-green-primary hover:bg-green-50 transition-all duration-150">
                            <FiSearch className="text-lg" />
                        </button>
                        <Link to="/wishlist" className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-green-primary hover:bg-green-50 transition-all duration-150 no-underline">
                            <FiHeart className="text-lg" />
                            {wishlist.length > 0 && (
                                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>
                            )}
                        </Link>

                        <div className="relative">
                            {user ? (
                                <button onClick={() => setUserDropdown(!userDropdown)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-primary transition-all">
                                    <FiUser className="text-lg" />
                                    <span className="text-sm font-semibold max-w-[80px] truncate">{user.username}</span>
                                    <FiChevronDown className={`text-xs transition-transform ${userDropdown ? 'rotate-180' : ''}`} />
                                </button>
                            ) : (
                                <Link to="/login" className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-green-primary hover:bg-green-50 transition-all duration-150 no-underline">
                                    <FiUser className="text-lg" />
                                </Link>
                            )}
                            {userDropdown && (
                                <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-card-hover border border-gray-100 min-w-[160px] overflow-hidden z-50 animate-slide-in-up">
                                    <button onClick={() => { logout(); setUserDropdown(false); }} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-primary hover:bg-red-pale transition-all">
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        <button onClick={toggleCartSidebar}
                            className="relative w-10 h-10 rounded-full flex items-center justify-center text-green-primary bg-green-50 hover:bg-green-100 transition-all duration-150">
                            <FiShoppingCart className="text-lg" />
                            {cartCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-green-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
                            )}
                        </button>
                        <Link to="/shop" className="hidden xl:flex btn-green px-5 py-2.5 text-sm ml-2 no-underline">Shop Now</Link>

                        {/* Mobile Toggle */}
                        <button onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all">
                            {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                        </button>
                    </div>
                </div>

                {/* Search Dropdown */}
                {searchOpen && (
                    <div className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-card-hover py-4 animate-slide-in-up z-40">
                        <div className="max-w-7xl mx-auto px-6">
                            <form onSubmit={handleSearch} className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-full px-5 py-2 focus-within:border-green-primary focus-within:ring-4 focus-within:ring-green-50 transition-all">
                                <FiSearch className="text-gray-400 text-lg flex-shrink-0" />
                                <input autoFocus type="text" placeholder="Search for fresh products..."
                                    value={query} onChange={e => setQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none" />
                                <button type="submit" className="btn-green px-5 py-2 text-sm">Search</button>
                                <button type="button" onClick={() => setSearchOpen(false)} className="p-1 text-gray-400 hover:text-red-primary transition-colors">
                                    <FiX />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Sidebar */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] animate-fade-in" onClick={() => setMobileOpen(false)} />
                    <div className="fixed top-0 left-0 w-[300px] h-full bg-white z-[300] flex flex-col shadow-2xl animate-slide-in-left">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <span className="text-3xl">🌿</span>
                                <span className="font-heading font-extrabold text-xl text-green-primary">Bangol</span>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-600 hover:text-red-primary transition-colors">
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        <nav className="flex-1 p-4 overflow-y-auto flex flex-col gap-1">
                            {navLinks.map(link => (
                                <div key={link.label}>
                                    <NavLink to={link.to === '#' ? '/shop' : link.to}
                                        className={({ isActive }) =>
                                            `block px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline
                      ${isActive ? 'bg-green-50 text-green-primary' : 'text-gray-600 hover:bg-gray-50'}`
                                        }
                                        onClick={() => setMobileOpen(false)}>
                                        {link.label}
                                    </NavLink>
                                    {link.dropdown && link.dropdown.map(item => (
                                        <Link key={item.label} to={item.to}
                                            className="block pl-8 py-2.5 text-sm text-gray-400 hover:text-green-primary transition-all no-underline"
                                            onClick={() => setMobileOpen(false)}>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </nav>
                        <div className="p-4 border-t border-gray-100 flex flex-col gap-3">
                            <Link to="/login" className="btn-outline-green py-3 rounded-full text-center text-sm font-semibold no-underline" onClick={() => setMobileOpen(false)}>
                                Login / Register
                            </Link>
                            <button onClick={() => { toggleCartSidebar(); setMobileOpen(false); }}
                                className="btn-green py-3 rounded-full text-sm">
                                <FiShoppingCart /> Cart ({cartCount})
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}