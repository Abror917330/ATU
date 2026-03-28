"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, User, Settings, Instagram, Send, Moon, Sun, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();

    const navLinks = [
        { name: 'Asosiy', href: '/', id: '01' },
        { name: 'Ijod', href: '/creative', id: '02' },
        { name: 'Do\'kon', href: '/shop', id: '03' },
        { name: 'Uzgoniylar', href: '/uzgen-youth', id: '04' },
    ];


    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <>
            <nav className="sticky top-0 z-40 w-full bg-white dark:bg-brand-black/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    {/* LOGOTIP */}
                    <Link href="/" className="text-3xl font-black tracking-tighter flex items-center group">
                        <span className="text-brand-gold group-hover:scale-110 transition-transform">A</span>
                        <span className="text-black dark:text-white mx-0.5">T</span>
                        <span className="text-brand-gold group-hover:scale-110 transition-transform">U</span>
                    </Link>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[3px] dark:text-white">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className={`hover:text-brand-gold transition-colors italic ${pathname === link.href ? 'text-brand-gold border-b-2 border-brand-gold' : ''}`}>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">


                        {/* HAMBURGER TUGMASI */}
                        <button onClick={() => setIsOpen(true)} className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl hover:bg-brand-gold hover:text-black transition-all dark:text-white text-black">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* SIDEBAR (HAMBURGER) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-9998" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed right-0 top-0 h-full w-[85%] sm:w-100 bg-white dark:bg-brand-black z-9999 p-8 flex flex-col border-l border-gray-200 dark:border-white/10 overflow-y-auto">

                            {/* TEPADAGI SETTINGS (Tillar va Rejim) */}
                            <div className="flex justify-between items-center mb-8">


                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-brand-gold hover:scale-110 transition-transform"
                                >
                                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} className="text-black" />}
                                </button>
                            </div>

                            <div className="flex justify-between items-center mb-10">
                                <span className="text-brand-gold font-bold italic tracking-widest text-sm uppercase">Navigation</span>
                                <button onClick={() => setIsOpen(false)} className="p-2 border border-gray-200 dark:border-white/10 rounded-full dark:text-white hover:text-brand-gold"><X size={24} /></button>
                            </div>

                            <Link href="/settings" onClick={() => setIsOpen(false)} className="mb-8 p-5 bg-gray-50 dark:bg-white/5 rounded-4xl border border-gray-100 dark:border-white/5 flex items-center gap-4 group hover:border-brand-gold transition-colors">
                                <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center text-black shadow-lg shadow-brand-gold/20 group-hover:rotate-12 transition-transform">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold dark:text-white group-hover:text-brand-gold transition-colors text-sm">
                                        Profil
                                    </h4>
                                    <p className="text-[9px] text-gray-400 uppercase tracking-[2px]">
                                        Imkoniyatlarni kengaytiring
                                    </p>
                                </div>
                            </Link>

                            {/* ASOSIY LINKLAR */}
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="group py-4 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-brand-gold opacity-40 group-hover:opacity-100 transition-opacity tracking-tighter">{link.id}</span>
                                            <span className="text-2xl font-bold dark:text-white text-black uppercase italic group-hover:translate-x-2 transition-transform">{link.name}</span>
                                        </div>
                                        <span className="text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </Link>
                                ))}
                            </div>

                            {/* QO'SHIMCHA SOZLAMALAR */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <Link href="/favorites" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-xs font-bold dark:text-white hover:bg-brand-gold/10 transition-colors"><Heart size={16} className="text-red-500" /> Sevimlilar</Link>
                                <Link href="/settings" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-xs font-bold dark:text-white hover:bg-brand-gold/10 transition-colors"><Settings size={16} className="text-gray-500" /> Sozlamalar</Link>
                            </div>

                            {/* IJTIMOIY TARMOQLAR */}
                            <div className="mt-auto pt-10 flex justify-center gap-8">
                                <Instagram className="text-gray-400 hover:text-brand-gold cursor-pointer transition-colors" />
                                <Send className="text-gray-400 hover:text-brand-gold cursor-pointer transition-colors" />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
