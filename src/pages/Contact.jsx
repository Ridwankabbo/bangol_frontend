import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Contact() {
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div className="min-h-screen bg-gray-50 pt-[70px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-900 to-green-700 py-14 text-center px-6">
                <h1 className="font-heading font-black text-3xl text-white mb-2">Get in <span className="text-yellow-bright">Touch</span></h1>
                <p className="text-white/70 text-sm">We'd love to hear from you. Send us a message!</p>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Contact Info */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    {[
                        { icon: <FiMapPin />, title: 'Our Location', info: '42 Green Market Street, Fresh City, FC 12345', color: 'text-green-primary', bg: 'bg-green-50' },
                        { icon: <FiPhone />, title: 'Phone Number', info: '+1 (555) 234-5678', color: 'text-yellow-deep', bg: 'bg-yellow-pale' },
                        { icon: <FiMail />, title: 'Email Address', info: 'hello@bangolfresh.com', color: 'text-green-primary', bg: 'bg-green-50' },
                        { icon: <FiClock />, title: 'Working Hours', info: 'Mon–Sat: 7am – 9pm\nSun: 8am – 6pm', color: 'text-red-primary', bg: 'bg-red-pale' },
                    ].map(c => (
                        <div key={c.title} className="bg-white rounded-2xl shadow-card p-5 flex gap-4 items-start hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                            <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.color} flex items-center justify-center text-lg flex-shrink-0`}>{c.icon}</div>
                            <div>
                                <h3 className="font-heading font-bold text-gray-800 text-sm mb-1">{c.title}</h3>
                                <p className="text-sm text-gray-500 whitespace-pre-line">{c.info}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="lg:col-span-3 bg-white rounded-3xl shadow-card p-8">
                    {sent ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-10">
                            <span className="text-6xl">✅</span>
                            <h3 className="font-heading font-bold text-2xl text-gray-800">Message Sent!</h3>
                            <p className="text-gray-400 text-sm">Thank you! We'll get back to you within 24 hours.</p>
                            <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                className="btn-green px-8 py-3 rounded-full text-sm mt-4">
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="font-heading font-bold text-xl text-gray-800 mb-6">Send Us a Message</h2>
                            <form className="flex flex-col gap-5" onSubmit={e => { e.preventDefault(); setSent(true); }}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {[['name', 'Your Name', 'text', 'John Doe'], ['email', 'Email Address', 'email', 'you@example.com']].map(([k, l, t, p]) => (
                                        <div key={k} className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-700">{l}</label>
                                            <input type={t} placeholder={p} value={form[k]} onChange={e => update(k, e.target.value)} className="form-input" required />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Subject</label>
                                    <select value={form.subject} onChange={e => update('subject', e.target.value)} className="form-input" required>
                                        <option value="">— Select a topic —</option>
                                        <option>Order Inquiry</option>
                                        <option>Delivery Issue</option>
                                        <option>Product Quality</option>
                                        <option>Partnership</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Message</label>
                                    <textarea rows={5} placeholder="Write your message here..." value={form.message} onChange={e => update('message', e.target.value)}
                                        className="form-input resize-none" required />
                                </div>
                                <button type="submit" className="btn-green py-4 rounded-2xl text-sm flex items-center justify-center gap-2">
                                    <FiSend /> Send Message
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}