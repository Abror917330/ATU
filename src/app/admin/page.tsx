"use client";
import { useRouter } from 'next/navigation';
import { PenTool, ShoppingBag, Users, Image as ImageIcon, LogOut, ChevronRight } from 'lucide-react';

const MENU_ITEMS = [
    {
        id: 'creative',
        label: 'IJOD BO\'LIMI',
        desc: "She'rlar, Videolar va Audio fayllarni boshqarish",
        icon: PenTool,
        color: 'bg-[#D4AF37]', // Oltin rang
        path: '/admin/creative'
    },
    {
        id: 'shop',
        label: 'DO\'KON (SHOP)',
        desc: "Mahsulotlar, narxlar va rasmlarni tahrirlash",
        icon: ShoppingBag,
        color: 'bg-blue-600',
        path: '/admin/shop'
    },
    {
        id: 'youth',
        label: 'UZGONIYLAR',
        desc: "Yangiliklar va tadbirlarni qo'shish",
        icon: Users,
        color: 'bg-green-600',
        path: '/admin/youth'
    },
    {
        id: 'banners',
        label: 'ASOSIY BANNER',
        desc: "Bosh sahifadagi katta rasmlar va yozuvlar",
        icon: ImageIcon,
        color: 'bg-purple-600',
        path: '/admin/banners'
    },
];

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white text-black p-4 md:p-10">
            <div className="max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-12 border-b-4 border-black pb-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter">
                            ADMIN<span className="text-[#D4AF37]">PANEL</span>
                        </h1>
                        <p className="font-bold uppercase text-sm tracking-[3px] mt-2">Boshqaruv tizimi</p>
                    </div>
                    <button className="bg-red-600 text-white p-4 rounded-2xl hover:bg-red-700 transition-all shadow-lg">
                        <LogOut size={24} />
                    </button>
                </div>

                {/* MENYULAR */}
                <div className="grid grid-cols-1 gap-6">
                    {MENU_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => router.push(item.path)}
                            className="group relative flex items-center justify-between p-8 bg-gray-50 border-2 border-black rounded-[2rem] hover:bg-black hover:text-white transition-all duration-300"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`${item.color} p-5 rounded-2xl text-white shadow-md group-hover:scale-110 transition-transform`}>
                                    <item.icon size={32} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-[1000] uppercase text-2xl italic">{item.label}</h3>
                                    <p className="text-gray-500 group-hover:text-gray-300 font-medium">{item.desc}</p>
                                </div>
                            </div>
                            <ChevronRight size={32} className="text-[#D4AF37]" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}