"use client";
import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Loader2, Save, Edit3, Check, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CompleteAdmin() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '', price: '', category: 'clothing', description: '',
        images: [] as string[], sizes: [] as string[], colors: [] as string[]
    });

    const [tempSize, setTempSize] = useState('');
    const [tempColor, setTempColor] = useState('');

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        const { data } = await supabase.from('shop_products').select('*').order('created_at', { ascending: false });
        if (data) setProducts(data);
    };

    // QUICK SHOP-GA QO'SHISH FUNKSIYASI
    const toggleQuickShop = async (product: any) => {
        const quickShopCount = products.filter(p => p.is_quick_shop).length;

        if (!product.is_quick_shop && quickShopCount >= 4) {
            alert("Bosh sahifada faqat 4 ta mahsulot bo'lishi mumkin! Avval bittasini o'chiring.");
            return;
        }

        const { error } = await supabase
            .from('shop_products')
            .update({ is_quick_shop: !product.is_quick_shop })
            .eq('id', product.id);

        if (!error) fetchProducts();
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (form.images.length + files.length > 5) return alert("Maksimum 5 ta rasm!");

        setLoading(true);
        for (const file of files) {
            const path = `products/${Date.now()}-${file.name}`;
            const { data: upData } = await supabase.storage.from('shop-images').upload(path, file);
            if (upData) {
                const { data: urlData } = supabase.storage.from('shop-images').getPublicUrl(path);
                setForm(prev => ({ ...prev, images: [...prev.images, urlData.publicUrl] }));
            }
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price || form.images.length === 0) return alert("Hamma joyni to'ldiring!");
        setLoading(true);

        const payload = { ...form, price: Number(form.price) };

        if (editingId) {
            const { error } = await supabase.from('shop_products').update(payload).eq('id', editingId);
            if (!error) alert("Yangilandi!");
        } else {
            const { error } = await supabase.from('shop_products').insert([payload]);
            if (!error) alert("Qo'shildi!");
        }

        resetForm();
        fetchProducts();
        setLoading(false);
    };

    const resetForm = () => {
        setForm({ name: '', price: '', category: 'clothing', description: '', images: [], sizes: [], colors: [] });
        setEditingId(null);
    };

    return (
        <div className="max-w-6xl mx-auto mb-20 p-4 md:p-10 space-y-10">
            {/* 1. INPUT FORMA (Ozgartirilmadi) */}
            <div className="bg-white dark:bg-[#121212] rounded-[3rem] p-8 border border-gray-100 dark:border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black dark:text-white uppercase italic tracking-tighter">
                        {editingId ? "Tahrirlash" : "Yangi Mahsulot"}
                    </h2>
                    {editingId && (
                        <button onClick={resetForm} className="text-xs font-bold text-red-500 uppercase border border-red-500/20 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all">
                            Bekor qilish
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="grid grid-cols-5 gap-2">
                            {form.images.map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                        <X size={18} className="text-white" />
                                    </button>
                                </div>
                            ))}
                            {form.images.length < 5 && (
                                <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center cursor-pointer hover:border-brand-gold">
                                    <Plus className="text-gray-400" />
                                    <input type="file" hidden multiple onChange={handleUpload} />
                                </label>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-500 mb-2 ml-1">Razmerlar</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {form.sizes.map(s => (
                                        <span key={s} className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-white/5 dark:text-white rounded-xl text-sm font-bold">
                                            {s} <X size={14} className="text-red-500 cursor-pointer" onClick={() => setForm({ ...form, sizes: form.sizes.filter(x => x !== s) })} />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input value={tempSize} onChange={e => setTempSize(e.target.value)} placeholder="M, XL..." className="flex-1 bg-gray-50 dark:bg-white/5 dark:text-white rounded-xl px-4 py-2 text-sm outline-none" />
                                    <button onClick={() => { if (tempSize) { setForm({ ...form, sizes: [...form.sizes, tempSize] }); setTempSize(''); } }} className="p-2 bg-brand-gold rounded-xl"><Plus size={18} /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <input placeholder="Nomi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-50 dark:bg-white/5 dark:text-white rounded-2xl px-6 py-4 outline-none font-bold" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" placeholder="Narxi" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="bg-gray-50 dark:bg-white/5 dark:text-white rounded-2xl px-6 py-4 outline-none font-bold" />
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="bg-gray-50 dark:bg-white/5 dark:text-white rounded-2xl px-6 py-4 outline-none font-bold">
                                <option value="clothing">Kiyim</option>
                                <option value="shoes">Poyabzal</option>
                                <option value="tech">Texnika</option>
                            </select>
                        </div>
                        <textarea placeholder="Tavsif..." rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-gray-50 dark:bg-white/5 dark:text-white rounded-2xl px-6 py-4 outline-none resize-none" />
                        <button onClick={handleSubmit} disabled={loading} className="w-full py-5 bg-brand-gold text-black font-black rounded-3xl uppercase tracking-widest flex justify-center items-center gap-2">
                            {loading ? <Loader2 className="animate-spin" /> : editingId ? <><Check size={20} /> Yangilash</> : <><Save size={20} /> Saqlash</>}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. MAHSULOTLAR RO'YXATI - QUICK SHOP BOSHQARUVI BILAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                    <div key={p.id} className="bg-white dark:bg-white/5 p-4 rounded-[2.5rem] border border-gray-100 dark:border-white/5 flex items-center gap-4 hover:border-brand-gold/30 transition-all group relative overflow-hidden">

                        {/* QuickShop Indikatori */}
                        <button
                            onClick={() => toggleQuickShop(p)}
                            className={`absolute top-0 right-10 p-2 rounded-b-xl transition-all ${p.is_quick_shop ? 'bg-brand-gold text-black' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}
                            title={p.is_quick_shop ? "Bosh sahifadan olish" : "Bosh sahifaga qoshish"}
                        >
                            <Star size={16} fill={p.is_quick_shop ? "black" : "none"} />
                        </button>

                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                            <img src={p.images[0]} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black dark:text-white text-sm uppercase truncate italic">{p.name}</p>
                            <p className="text-brand-gold font-black">{p.price.toLocaleString()} KGS</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => { setForm(p); setEditingId(p.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                                <Edit3 size={16} />
                            </button>
                            <button onClick={async () => { if (confirm("O'chirilsinmi?")) { await supabase.from('shop_products').delete().eq('id', p.id); fetchProducts(); } }} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}