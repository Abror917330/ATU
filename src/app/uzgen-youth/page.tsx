"use client";
import { useState, useMemo, useEffect } from 'react';
import { Search, Newspaper, Calendar, Megaphone, Users, Heart, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/../store/useFavorites';

export interface YouthPost {
    id: string;
    type: 'news' | 'event' | 'announcement' | 'video';
    title: string;
    excerpt: string;
    content: string;
    image?: string;
    videoUrl?: string;
    thumbnail?: string;
    duration?: string;
    date: string;
    isNew?: boolean;
}

export const YOUTH_POSTS: YouthPost[] = [
    {
        id: '1',
        type: 'news',
        title: "O'zgan yoshlari uchrashdi",
        excerpt: "Bu oyda O'zgan shahridagi yoshlar guruhi birinchi yig'ilishini o'tkazdi.",
        content: "Bu oyda O'zgan shahridagi yoshlar guruhi birinchi yig'ilishini o'tkazdi. Yig'ilishda 50 dan ortiq yosh ishtirok etdi. Abdulloh Tohir Uzgoniy yoshlarga ilm va ma'naviyat haqida suhbat qurib berdi.",
        date: '2025-03-15',
        isNew: true,
    },
    {
        id: '2',
        type: 'event',
        title: "She'riyat kechasi — 25-mart",
        excerpt: "Abdulloh Tohir Uzgoniy boshchiligida she'riyat kechasi bo'lib o'tadi.",
        content: "Abdulloh Tohir Uzgoniy boshchiligida she'riyat kechasi 25-mart kuni soat 18:00 da bo'lib o'tadi. Barcha yoshlar taklif etiladi. Kirish bepul.",
        date: '2025-03-10',
        isNew: true,
    },
    {
        id: '3',
        type: 'video',
        title: "Yoshlar yig'ilishi — to'liq video",
        excerpt: "O'zgan yoshlari birinchi yig'ilishining to'liq video yozuvi.",
        content: "O'zgan yoshlari birinchi yig'ilishining to'liq video yozuvi. Abdulloh Tohir Uzgoniyning ma'ruzasini to'liq tomosha qiling.",
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '/uzgen/video-1.jpg',
        duration: '12:30',
        date: '2025-03-16',
        isNew: true,
    },
    {
        id: '4',
        type: 'announcement',
        title: "Yangi kitob chiqdi",
        excerpt: "Abdulloh Tohir Uzgoniyning yangi she'rlar to'plami nashrdan chiqdi.",
        content: "Abdulloh Tohir Uzgoniyning yangi she'rlar to'plami nashrdan chiqdi. Kitobni ATU Shop dan sotib olishingiz mumkin.",
        date: '2025-03-01',
    },
    {
        id: '5',
        type: 'video',
        title: "She'riyat kechasi — jonli efir",
        excerpt: "O'tgan she'riyat kechasining to'liq yozuvi.",
        content: "O'tgan she'riyat kechasining to'liq yozuvi. Abdulloh Tohir Uzgoniy va boshqa ijodkorlarning chiqishlarini tomosha qiling.",
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '/uzgen/video-2.jpg',
        duration: '45:00',
        date: '2025-02-25',
    },
    {
        id: '6',
        type: 'news',
        title: "Yoshlar sport musobaqasi",
        excerpt: "O'zgan yoshlari sport musobaqasida g'olib chiqdi.",
        content: "O'zgan yoshlari guruhining a'zolari o'tkazilgan sport musobaqasida birinchi o'rinni egalladi. Tabriklaymiz!",
        date: '2025-02-20',
    },
];

const TABS = [
    { id: 'all', label: 'Barchasi', icon: Users },
    { id: 'news', label: 'Yangiliklar', icon: Newspaper },
    { id: 'video', label: 'Videolar', icon: Video },
    { id: 'event', label: 'Tadbirlar', icon: Calendar },
    { id: 'announcement', label: "E'lonlar", icon: Megaphone },
];

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
    news: { label: 'Yangilik', color: 'bg-blue-500/10 text-blue-500' },
    event: { label: 'Tadbir', color: 'bg-green-500/10 text-green-500' },
    announcement: { label: "E'lon", color: 'bg-brand-gold/10 text-brand-gold' },
    video: { label: 'Video', color: 'bg-purple-500/10 text-purple-500' },
};

function LikeButton({ id }: { id: string }) {
    const { toggleCreative, isCreativeFaved } = useFavorites();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const faved = mounted && isCreativeFaved(id);

    return (
        <button
            onClick={e => { e.stopPropagation(); toggleCreative(id); }}
            className="p-2 rounded-full hover:scale-110 active:scale-95 transition-all shrink-0"
        >
            <Heart
                size={20}
                className={faved ? 'fill-red-500 text-red-500' : 'text-gray-300 dark:text-white/20'}
            />
        </button>
    );
}

export default function UzgenYouthPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const router = useRouter();

    const filtered = useMemo(() => {
        return YOUTH_POSTS.filter(post => {
            const matchTab = activeTab === 'all' || post.type === activeTab;
            const matchSearch =
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(search.toLowerCase());
            return matchTab && matchSearch;
        });
    }, [activeTab, search]);

    return (
        <main className="min-h-screen bg-main-bg pb-32 pt-6">
            <div className="max-w-4xl mx-auto px-4">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter dark:text-white">
                        <span className="text-brand-gold">UZGONIYLAR</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 italic">
                        Yoshlar guruhi yangiliklari va videolar
                    </p>
                </div>

                {/* SEARCH */}
                <div className="relative mb-6">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Qidirish..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm dark:text-white focus:outline-none focus:ring-2 ring-brand-gold transition-all"
                    />
                </div>

                {/* TABLAR */}
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-8">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all ${activeTab === tab.id
                                        ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20'
                                        : 'bg-white dark:bg-white/5 dark:text-white border border-gray-200 dark:border-white/10 hover:border-brand-gold'
                                    }`}
                            >
                                <Icon size={14} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* POSTLAR */}
                <div className="space-y-4">
                    {filtered.map(post => (
                        <div
                            key={post.id}
                            onClick={() => router.push(`/uzgen-youth/${post.id}`)}
                            className="group cursor-pointer bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-brand-gold transition-all overflow-hidden"
                        >
                            {/* VIDEO KARTA */}
                            {post.type === 'video' ? (
                                <div className="flex gap-4 p-4 items-center">
                                    <div className="relative w-28 h-28 bg-gray-100 dark:bg-white/10 rounded-2xl overflow-hidden shrink-0">
                                        {post.thumbnail ? (
                                            <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-purple-500/10">
                                                <Video size={32} className="text-purple-500" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                                                <Video size={18} className="text-black ml-0.5" />
                                            </div>
                                        </div>
                                        {post.duration && (
                                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                                {post.duration}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${TYPE_LABELS.video.color}`}>
                                                Video
                                            </span>
                                            {post.isNew && (
                                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-brand-gold text-black">
                                                    Yangi
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-black text-sm dark:text-white group-hover:text-brand-gold transition-colors uppercase italic line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">{post.date}</p>
                                    </div>
                                    <LikeButton id={post.id} />
                                </div>
                            ) : (
                                /* ODDIY POST KARTA */
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${TYPE_LABELS[post.type].color}`}>
                                                {TYPE_LABELS[post.type].label}
                                            </span>
                                            {post.isNew && (
                                                <span className="text-[10px] font-black px-2 py-1 rounded-full uppercase bg-brand-gold text-black">
                                                    Yangi
                                                </span>
                                            )}
                                        </div>
                                        <LikeButton id={post.id} />
                                    </div>

                                    <h3 className="font-black text-lg dark:text-white group-hover:text-brand-gold transition-colors uppercase italic mb-2">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs text-gray-400">{post.date}</span>
                                        <span className="text-xs text-brand-gold font-bold">Batafsil →</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Users size={48} className="text-gray-300" />
                            <p className="text-gray-400 font-bold">Hech narsa topilmadi</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}