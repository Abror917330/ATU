"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Save, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function BannerAdmin() {
    const [loading, setLoading] = useState(false);
    const [banner, setBanner] = useState({
        title_line1: '', title_line2: '', subtitle: '', description: '', image_url: ''
    });

    useEffect(() => {
        fetchCurrentBanner();
    }, []);

    const fetchCurrentBanner = async () => {
        const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false }).limit(1).single();
        if (data) setBanner(data);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const path = `hero/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('banners').upload(path, file);

        if (data) {
            const { data: urlData } = supabase.storage.from('banners').getPublicUrl(path);
            setBanner({ ...banner, image_url: urlData.publicUrl });
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setLoading(true);
        const { error } = await supabase.from('banners').insert([banner]);
        if (!error) alert("Banner yangilandi!");
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-[#0f0f0f] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl mt-10">
            <h2 className="text-3xl font-black mb-10 uppercase italic dark:text-white tracking-tighter">Bosh Bannerni <span className="text-brand-gold">Boshqarish</span></h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* RASM YUKLASH */}
                <div className="space-y-4">
                    <p className="text-xs font-black uppercase text-gray-500 ml-1">Banner Rasmi (HD tavsiya etiladi)</p>
                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center group">
                        {banner.image_url ? (
                            <>
                                <img src={banner.image_url} className="w-full h-full object-cover" />
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                                    <Upload className="text-white" />
                                    <input type="file" hidden onChange={handleImageUpload} />
                                </label>
                            </>
                        ) : (
                            <label className="flex flex-col items-center cursor-pointer">
                                <ImageIcon className="text-gray-400 mb-2" size={40} />
                                <span className="text-[10px] font-bold uppercase text-gray-400">Rasm yuklash</span>
                                <input type="file" hidden onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                </div>

                {/* MATNLAR */}
                <div className="space-y-4">
                    <input
                        placeholder="Subtitle (kichik matn)"
                        value={banner.subtitle}
                        onChange={e => setBanner({ ...banner, subtitle: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-2xl outline-none dark:text-white font-bold border border-transparent focus:border-brand-gold/30"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            placeholder="Sarlavha 1"
                            value={banner.title_line1}
                            onChange={e => setBanner({ ...banner, title_line1: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-2xl outline-none dark:text-white font-bold border border-transparent focus:border-brand-gold/30"
                        />
                        <input
                            placeholder="Sarlavha 2 (Tilla rang)"
                            value={banner.title_line2}
                            onChange={e => setBanner({ ...banner, title_line2: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-2xl outline-none text-brand-gold font-bold border border-transparent focus:border-brand-gold/30"
                        />
                    </div>
                    <textarea
                        placeholder="Tavsif (Description)"
                        rows={3}
                        value={banner.description}
                        onChange={e => setBanner({ ...banner, description: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-2xl outline-none dark:text-white resize-none border border-transparent focus:border-brand-gold/30"
                    />
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-5 bg-brand-gold text-black font-black rounded-3xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 shadow-xl shadow-brand-gold/20"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Bannerni Saqlash</>}
                    </button>
                </div>
            </div>
        </div>
    );
}