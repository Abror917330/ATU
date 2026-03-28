"use client";
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, ArrowLeft, X, Music, Video, Feather, ImageIcon, Loader2, Edit3, Search, Eye, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreativeAdmin() {
    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form holati
    const [activeType, setActiveType] = useState<'poem' | 'video' | 'audio'>('poem');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [showOnHome, setShowOnHome] = useState(true);

    useEffect(() => { fetchItems(); }, []);

    async function fetchItems() {
        const { data } = await supabase.from('creative_items').select('*').order('created_at', { ascending: false });
        if (data) setItems(data);
    }

    // Tahrirlashni boshlash
    const startEdit = (item: any) => {
        setEditingId(item.id);
        setTitle(item.title);
        setActiveType(item.type);
        setThumbnailUrl(item.thumbnail || '');
        setShowOnHome(item.show_on_home);
        if (item.type === 'poem') {
            setContent(item.content);
            setFileUrl('');
        } else {
            setFileUrl(item.content);
            setContent('');
        }
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Universal yuklash funksiyasi (Rasm, Video, Audio uchun)
    async function uploadFile(file: File, folder: string) {
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('creative').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('creative').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            alert("Yuklashda xatolik yuz berdi!");
            return null;
        } finally { setUploading(false); }
    }

    async function handleSave() {
        if (!title) return alert("Sarlavha majburiy!");
        if (activeType !== 'poem' && !fileUrl) return alert("Fayl yuklanmagan!");
        if (activeType === 'poem' && !content) return alert("She'r matnini kiriting!");

        const payload: any = {
            title,
            type: activeType,
            thumbnail: thumbnailUrl,
            content: activeType === 'poem' ? content : fileUrl,
            show_on_home: showOnHome,
        };

        if (editingId) {
            const { error } = await supabase.from('creative_items').update(payload).eq('id', editingId);
            if (!error) alert("Yangilandi!");
        } else {
            payload.created_at = new Date().toISOString();
            const { error } = await supabase.from('creative_items').insert([payload]);
            if (!error) alert("Qo'shildi!");
        }

        setIsAdding(false);
        resetForm();
        fetchItems();
    }

    function resetForm() {
        setTitle(''); setContent(''); setFileUrl(''); setThumbnailUrl(''); setEditingId(null); setActiveType('poem');
    }

    const filteredItems = useMemo(() => {
        return items.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [items, searchTerm]);

    return (
        <div className="min-h-screen bg-white text-black pb-20">
            {/* HEADER */}
            <div className="sticky top-0 z-50 bg-black text-[#D4AF37] p-5 flex justify-between items-center border-b-2 border-[#D4AF37]">
                <button onClick={() => router.push('/admin')} className="p-2 border-2 border-[#D4AF37] rounded-xl">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="font-black italic uppercase text-lg">IJOD BOSHQARUVI</h1>
                <button onClick={() => { setIsAdding(!isAdding); if (isAdding) resetForm(); }} className="bg-[#D4AF37] text-black p-2 rounded-xl border-2 border-black">
                    {isAdding ? <X size={24} /> : <Plus size={24} />}
                </button>
            </div>

            <div className="p-4 max-w-2xl mx-auto">
                {isAdding && (
                    <div className="bg-white border-[4px] border-black rounded-[2.5rem] p-6 mb-10 shadow-[8px_8px_0px_0px_rgba(212,175,55,1)]">
                        {/* TURINI TANLASH */}
                        <div className="flex gap-2 mb-6 p-2 bg-black rounded-2xl">
                            {(['poem', 'video', 'audio'] as const).map(t => (
                                <button key={t} onClick={() => { setActiveType(t); setFileUrl(''); }} className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] flex flex-col items-center gap-1 transition-all ${activeType === t ? 'bg-[#D4AF37] text-black' : 'bg-transparent text-white opacity-40'}`}>
                                    {t === 'poem' ? <Feather size={16} /> : t === 'video' ? <Video size={16} /> : <Music size={16} />}
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <input className="w-full p-4 border-2 border-black rounded-xl font-bold outline-none focus:ring-2 ring-[#D4AF37]" value={title} onChange={e => setTitle(e.target.value)} placeholder="Sarlavha..." />

                            {/* MUQOVA RASMI */}
                            <div className="relative h-32 bg-gray-50 border-2 border-dashed border-black rounded-xl flex flex-col items-center justify-center overflow-hidden">
                                {thumbnailUrl ? (
                                    <>
                                        <img src={thumbnailUrl} className="w-full h-full object-cover" />
                                        <button onClick={() => setThumbnailUrl('')} className="absolute top-2 right-2 bg-black text-white p-1 rounded-full"><X size={14} /></button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center">
                                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) { const url = await uploadFile(file, 'thumbnails'); if (url) setThumbnailUrl(url); }
                                        }} />
                                        <ImageIcon size={24} className="mb-1 text-gray-400" />
                                        <span className="text-[10px] font-black uppercase text-gray-400">Rasm yuklash</span>
                                    </label>
                                )}
                            </div>

                            {/* DINAMIK INPUTLAR (She'r, Video yoki Audio uchun) */}
                            {activeType === 'poem' ? (
                                <textarea className="w-full p-4 border-2 border-black rounded-xl font-medium h-40 outline-none" value={content} onChange={e => setContent(e.target.value)} placeholder="She'r satrlarini kiriting..." />
                            ) : (
                                <div className={`p-6 border-2 border-black rounded-xl flex flex-col items-center justify-center transition-colors ${fileUrl ? 'bg-green-50 border-green-500' : 'bg-gray-50'}`}>
                                    {fileUrl ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <CheckCircle2 size={32} className="text-green-500" />
                                            <span className="text-[10px] font-black text-green-600 uppercase">Fayl Tayyor!</span>
                                            <button onClick={() => setFileUrl('')} className="text-[9px] underline text-red-500 font-bold uppercase">O'chirish</button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center gap-2">
                                            <input type="file" accept={activeType === 'video' ? "video/*" : "audio/*"} className="hidden" onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) { const url = await uploadFile(file, activeType === 'video' ? 'videos' : 'audios'); if (url) setFileUrl(url); }
                                            }} />
                                            {activeType === 'video' ? <Video size={30} /> : <Music size={30} />}
                                            <span className="text-[10px] font-black uppercase italic">
                                                {uploading ? "Yuklanmoqda..." : `${activeType} Tanlash`}
                                            </span>
                                        </label>
                                    )}
                                </div>
                            )}

                            <button disabled={uploading} onClick={handleSave} className="w-full bg-black text-[#D4AF37] py-5 rounded-2xl font-black uppercase text-lg active:scale-95 transition-all shadow-[4px_4px_0px_0px_rgba(212,175,55,1)]">
                                {uploading ? <Loader2 className="animate-spin mx-auto" /> : editingId ? "SAQLASH" : "E'LON QILISH"}
                            </button>
                        </div>
                    </div>
                )}

                {/* QIDIRUV VA RO'YXAT */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Qidirish..." className="w-full p-4 pl-12 border-2 border-black rounded-xl font-bold uppercase text-xs outline-none focus:border-[#D4AF37]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                <div className="grid gap-4">
                    {filteredItems.map(item => (
                        <div key={item.id} className="flex flex-col p-4 border-2 border-black rounded-2xl bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 bg-black rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-[#D4AF37]">
                                    {item.thumbnail ? <img src={item.thumbnail} className="w-full h-full object-cover" /> : (item.type === 'poem' ? <Feather size={20} /> : item.type === 'video' ? <Video size={20} /> : <Music size={20} />)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black uppercase text-xs truncate">{item.title}</h3>
                                    <div className="flex gap-2 items-center mt-1">
                                        <span className="text-[8px] font-black uppercase bg-black text-[#D4AF37] px-2 py-0.5 rounded-md">{item.type}</span>
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                                            <Eye size={12} /> {item.views_list || 0} / {item.views_detail || 0}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => startEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit3 size={18} /></button>
                                    <button onClick={async () => { if (confirm("O'chirilsinmi?")) { await supabase.from('creative_items').delete().eq('id', item.id); fetchItems(); } }} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}