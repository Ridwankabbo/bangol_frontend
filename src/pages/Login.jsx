import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPass, setShowPass] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            const success = await login(formData.email, formData.password);
            if (success) navigate('/');
        } else {
            const success = await register({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password
            });
            if (success) setIsLogin(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-[70px] flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <span className="text-5xl">🌿</span>
                    <h1 className="font-heading font-black text-2xl text-gray-800 mt-3">Welcome to Bangol</h1>
                    <p className="text-gray-400 text-sm mt-1">Your fresh grocery destination</p>
                </div>

                <div className="bg-white rounded-3xl shadow-card-hover p-8">
                    {/* Tab Toggle */}
                    <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
                        {['Login', 'Register'].map(t => (
                            <button key={t} onClick={() => setIsLogin(t === 'Login')}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${(t === 'Login') === isLogin ? 'bg-white text-green-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                                {t}
                            </button>
                        ))}
                    </div>

                    {isLogin ? (
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="form-input pl-11" required />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-700">Password</label>
                                    <a href="#" className="text-xs text-green-primary hover:text-green-700 no-underline">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type={showPass ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="form-input pl-11 pr-11" required />
                                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPass ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" className="accent-green-600 w-4 h-4 rounded" />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <button type="submit" className="btn-green w-full py-4 rounded-2xl text-sm mt-2">Sign In</button>
                            <div className="relative text-center text-sm text-gray-400 before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-full before:h-px before:bg-gray-200">
                                <span className="relative bg-white px-4">or continue with</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
                                    <span>🔵</span> Google
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
                                    <span>🔷</span> Facebook
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">First Name</label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className="form-input pl-10" required />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="form-input" required />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="form-input pl-11" required />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type={showPass ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 characters" className="form-input pl-11 pr-11" required />
                                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPass ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            <label className="flex items-start gap-2.5 cursor-pointer">
                                <input type="checkbox" className="accent-green-600 w-4 h-4 rounded mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">I agree to the <a href="#" className="text-green-primary no-underline hover:underline">Terms of Service</a> and <a href="#" className="text-green-primary no-underline hover:underline">Privacy Policy</a></span>
                            </label>
                            <button type="submit" className="btn-green w-full py-4 rounded-2xl text-sm mt-2">Create Account</button>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-gray-400 mt-6">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-green-primary font-semibold hover:underline">
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}
