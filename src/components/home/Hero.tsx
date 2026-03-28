"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Hero() {
    const [banner, setBanner] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchBanner = async () => {
            const { data } = await supabase.from('banners').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1).single();
            if (data) setBanner(data);
        };
        fetchBanner();
    }, []);

    return (
        <section className="relative w-full h-[85vh] flex items-center bg-brand-black px-6 md:px-20 overflow-hidden">
            {banner?.image_url && (
                <div className="absolute inset-0">
                    <img src={banner.image_url} className="w-full h-full object-cover opacity-40" alt="Hero" />
                </div>
            )}
            <div className="relative z-10 max-w-4xl">
                <span className="text-brand-gold tracking-[5px] uppercase text-[10px] md:text-sm font-black mb-6 block animate-in fade-in slide-in-from-left duration-700">
                    {banner?.subtitle || "Abdulloh Tohir Uzgoniy taqdim etadi"}
                </span>
                <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.85] mb-8 uppercase italic tracking-tighter">
                    {banner?.title_line1 || "SO'Z VA"} <br />
                    <span className="text-brand-gold">{banner?.title_line2 || "NAFOSAT"}</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-2xl max-w-xl mb-12 leading-relaxed italic font-medium border-l-2 border-brand-gold/30 pl-6">
                    {banner?.description || '"Har bir satrda bir dunyo, har bir libosda bir ma\'no..."'}
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                    <button onClick={() => router.push('/shop')} className="w-full sm:w-auto rounded-2xl px-12 py-6 text-lg bg-brand-gold text-black font-black uppercase hover:scale-105 transition-all shadow-2xl shadow-brand-gold/20">
                        Do'konni ko'rish
                    </button>
                </div>
            </div>
        </section>
    );
}