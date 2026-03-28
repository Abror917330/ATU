"use client";
import { useState, useEffect } from 'react';
import { User, Moon, Sun, Bell, BellOff, Download, Heart, ShoppingBag, Info, ChevronRight, LogIn, UserPlus, Shield } from 'lucide-react';
import { useTheme } from 'next-themes';
import InstallPWA from './InstallPWA';
import Link from 'next/link';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [isLoggedIn] = useState(false); // Kelajakda Supabase bilan

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-main-bg pb-28 pt-6 px-4 max-w-2xl mx-auto">

            {/* AUTH BLOKI */}
            {!isLoggedIn ? (
                <div className="mb-8 p-6 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center">
                            <User size={32} className="text-brand-gold" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black dark:text-white">Akkauntga kiring</h2>
                            <p className="text-xs text-gray-400 mt-1">Barcha imkoniyatlardan foydalaning</p>
                        </div>
                    </div>

                    {/* Imkoniyatlar */}
                    <div className="mb-6 space-y-2">
                        {[
                            { icon: Heart, text: "Sevimli she'rlar va mahsulotlarni saqlash" },
                            { icon: Bell, text: "Yangi she'r va mahsulotlarda bildirishnoma" },
                            { icon: ShoppingBag, text: "Buyurtma tarixi va kuzatuv" },
                            { icon: Shield, text: "Shaxsiy profil va sozlamalar" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <item.icon size={16} className="text-brand-gold shrink-0" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/auth/login" className="flex items-center justify-center gap-2 py-3 bg-brand-gold text-black font-black rounded-2xl text-sm hover:opacity-90 transition-opacity">
                            <LogIn size={16} />
                            Kirish
                        </Link>
                        <Link href="/auth/register" className="flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-white/10 dark:text-white font-black rounded-2xl text-sm hover:opacity-90 transition-opacity">
                            <UserPlus size={16} />
                            Ro'yxatdan o'tish
                        </Link>
                    </div>
                </div>
            ) : (
                /* Kirgan foydalanuvchi */
                <div className="mb-8 p-6 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 flex items-center gap-4">
                    <div className="w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center text-black font-black text-2xl">
                        A
                    </div>
                    <div>
                        <h2 className="text-xl font-black dark:text-white">Foydalanuvchi</h2>
                        <p className="text-xs text-gray-400">user@email.com</p>
                    </div>
                </div>
            )}

            {/* SOZLAMALAR */}
            <div className="space-y-4">

                {/* Ko'rinish */}
                <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden">
                    <div className="px-6 py-3 border-b border-gray-100 dark:border-white/5">
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Ko'rinish</span>
                    </div>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {theme === 'dark' ? <Moon size={20} className="text-brand-gold" /> : <Sun size={20} className="text-brand-gold" />}
                            <div className="text-left">
                                <p className="text-sm font-bold dark:text-white">Tungi rejim</p>
                                <p className="text-xs text-gray-400">{theme === 'dark' ? 'Yoqilgan' : 'O\'chirilgan'}</p>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-brand-gold' : 'bg-gray-200'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full m-0.5 transition-transform shadow ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </button>
                </div>

                {/* Bildirishnomalar */}
                <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden">
                    <div className="px-6 py-3 border-b border-gray-100 dark:border-white/5">
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Bildirishnomalar</span>
                    </div>
                    <button
                        onClick={() => setNotifications(!notifications)}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {notifications ? <Bell size={20} className="text-brand-gold" /> : <BellOff size={20} className="text-gray-400" />}
                            <div className="text-left">
                                <p className="text-sm font-bold dark:text-white">Yangiliklar</p>
                                <p className="text-xs text-gray-400">Yangi she'r va mahsulotlar</p>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-brand-gold' : 'bg-gray-200'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full m-0.5 transition-transform shadow ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </button>
                </div>

                {/* PWA O'rnatish */}
                <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden">
<InstallPWA />
                </div>

                {/* Sayit haqida */}
                <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden">
                    <div className="px-6 py-3 border-b border-gray-100 dark:border-white/5">
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Haqida</span>
                    </div>
                    <Link href="/about" className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <Info size={20} className="text-brand-gold" />
                            <div className="text-left">
                                <p className="text-sm font-bold dark:text-white">ATU haqida</p>
                                <p className="text-xs text-gray-400">Abdulloh Tohir Uzgoniy</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                    </Link>
                </div>

            </div>

            {/* Versiya */}
            <p className="text-center text-[10px] text-gray-300 dark:text-gray-700 mt-10 uppercase tracking-widest">
                ATU Portal v1.0
            </p>
        </div>
    );
}