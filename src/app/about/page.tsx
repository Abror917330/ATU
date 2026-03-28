"use client";
import React, { useEffect, useState } from 'react';
import { Instagram, Send, Youtube, MapPin, BookOpen, Mic, ShoppingBag, Users, ChevronRight } from 'lucide-react';

export default function AboutPage() {
    const [mounted, setMounted] = useState(false);

    // Hydration xatosini oldini olish uchun
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] pb-32 pt-6">
            <div className="max-w-2xl mx-auto px-4">

                {/* HERO BLOK */}
                <div className="relative bg-[#0A0A0A] rounded-3xl overflow-hidden mb-6 p-8 border border-white/5">
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#D4AF37]/10 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-6 -right-6 text-[#D4AF37]/5 text-[8rem] font-black italic select-none">
                        ATU
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-black font-black text-2xl mb-6 shadow-xl shadow-[#D4AF37]/20">
                            A
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tight mb-1">
                            Abdulloh Tohir
                        </h1>
                        <h2 className="text-3xl font-black text-[#D4AF37] uppercase italic tracking-tight mb-4">
                            Uzgoniy
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Qirgʻizistonlik oʻzbek ijodkor, shoir va jamoat arbobi. Oʻzgan shahri farzandi.
                        </p>
                    </div>
                </div>

                {/* HAQIDA */}
                <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-6 mb-6 shadow-sm">
                    <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest mb-4">Haqida</h3>
                    <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        <p>
                            Abdulloh Tohir Uzgoniy — Qirgʻiziston, Oʻzgan shahrida tavallud topgan ijodkor shoir.
                            U oʻzbek tilida nafis va maʼnoli sheʼrlar yozadi.
                        </p>
                        <p>
                            ATU Portal — uning ijodini, yangiliklarini va mahsulotlarini bir joyda jamlagan rasmiy platforma.
                        </p>
                    </div>
                </div>

                {/* IJTIMOIY TARMOQLAR - MAP FUNKSIYASI TO'G'RILANDI */}
                <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden mb-8 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5">
                        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">Ijtimoiy tarmoqlar</h3>
                    </div>

                    {[
                        { icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', label: 'Instagram', handle: '@abdulloh_tohir_uzgoniy', href: '#' },
                        { icon: Send, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Telegram', handle: '@atu_uzgon', href: '#' },
                        { icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', label: 'YouTube', handle: 'ATU Uzgoniy', href: '#' },
                    ].map((social, i, arr) => (
                        <a
                            key={i}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${i !== arr.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''
                                }`}
                        >
                            <div className={`w-10 h-10 ${social.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                <social.icon size={18} className={social.color} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm dark:text-white">{social.label}</p>
                                <p className="text-xs text-gray-400">{social.handle}</p>
                            </div>
                            <ChevronRight size={16} className="text-[#D4AF37]" />
                        </a>
                    ))}
                </div>

                <p className="text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                    © 2026 ATU — Abdulloh Tohir Uzgoniy
                </p>
            </div>
        </main>
    );
}