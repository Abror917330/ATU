"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Feather, ShoppingBag, Users, Settings } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const links = [
        { name: 'Asosiy', href: '/', icon: Home },
        { name: 'Ijod', href: '/creative', icon: Feather },
        { name: 'Do\'kon', href: '/shop', icon: ShoppingBag },
        { name: 'Uzgoniylar', href: '/uzgen-youth', icon: Users },
        { name: 'Profil', href: '/settings', icon: Settings },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 z-50 w-full h-20 bg-white/80 dark:bg-black/90 backdrop-blur-xl border-t border-gray-100 dark:border-white/10 flex justify-around items-center pb-4">
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                    <Link key={link.href} href={link.href} className="flex flex-col items-center justify-center w-full h-full relative">
                        {isActive && (
                            <div className="absolute -top-1 w-10 h-1 bg-brand-gold rounded-full" />
                        )}
                        <Icon
                            size={22}
                            className={isActive ? "text-brand-gold" : "text-gray-400"}
                        />
                        <span className={`text-[10px] mt-1 font-bold ${isActive ? "text-brand-gold" : "text-gray-400"}`}>
                            {link.name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
