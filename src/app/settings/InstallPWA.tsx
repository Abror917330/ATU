"use client";
import { useState, useEffect } from 'react';
import { Download, Smartphone, Share, Plus, X, MoreVertical } from 'lucide-react';

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isPWA, setIsPWA] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsPWA(true);
            return;
        }

        const ua = navigator.userAgent;
        if (/android/i.test(ua)) {
            setIsAndroid(true);
        } else if (/iphone|ipad|ipod/i.test(ua)) {
            setIsIOS(true);
        }

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleAndroidInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsPWA(true);
            setDeferredPrompt(null);
        }
    };

    // O'rnatilgan bo'lsa
    if (isPWA) {
        return (
            <div className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
                    <Smartphone size={22} />
                </div>
                <div>
                    <h3 className="font-black text-sm dark:text-white">Ilova o'rnatilgan ✅</h3>
                    <p className="text-[11px] text-gray-500">Barcha imkoniyatlar faol</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="px-6 py-3 border-b border-gray-100 dark:border-white/5">
                <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">
                    Ilovani o'rnatish
                </span>
            </div>

            <div className="p-5">
                {/* Imkoniyatlar */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                        "🔔 Yangi she'rlar",
                        "🛍️ Buyurtma holati",
                        "⚡ Tezroq ishlaydi",
                        "📴 Oflayn ham ochiladi",
                    ].map((item, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-xl p-2 text-[11px] font-bold dark:text-white">
                            {item}
                        </div>
                    ))}
                </div>

                {/* ANDROID — bir tugma */}
                {isAndroid && (
                    <button
                        onClick={handleAndroidInstall}
                        className="w-full py-4 bg-brand-gold text-black font-black rounded-2xl text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-gold/20"
                    >
                        <Download size={18} /> Ilovani o'rnatish
                    </button>
                )}

                {/* IPHONE — yo'riqnoma */}
                {isIOS && (
                    <button
                        onClick={() => setShowIOSGuide(true)}
                        className="w-full py-4 bg-brand-gold text-black font-black rounded-2xl text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-gold/20"
                    >
                        <Smartphone size={18} /> Qanday o'rnatish?
                    </button>
                )}

                {/* DESKTOP */}
                {!isAndroid && !isIOS && (
                    <div className="text-center py-3">
                        <p className="text-xs text-gray-400">
                            📱 Telefoningizdan oching va o'rnating
                        </p>
                    </div>
                )}
            </div>

            {/* IPHONE YO'RIQNOMASI MODAL */}
            {showIOSGuide && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-end">
                    <div className="w-full bg-white dark:bg-brand-black rounded-t-3xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black dark:text-white">iPhone ga o'rnatish</h3>
                            <button
                                onClick={() => setShowIOSGuide(false)}
                                className="p-2 bg-gray-100 dark:bg-white/10 rounded-full"
                            >
                                <X size={20} className="dark:text-white" />
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 mb-4">
                            ⚠️ Faqat <strong>Safari</strong> brauzeri orqali ishlaydi
                        </p>

                        {[
                            { icon: <Share size={18} />, text: "Safari pastidagi ulashish tugmasini bos" },
                            { icon: <Plus size={18} />, text: '"Bosh ekranga qo\'shish" ni bos' },
                            { icon: <Download size={18} />, text: 'Yuqori o\'ngdagi "Qo\'shish" ni bos' },
                            { icon: <Smartphone size={18} />, text: "ATU ilovasi ekraningizda paydo bo'ladi!" },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 mb-2 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                <div className="w-8 h-8 bg-brand-gold rounded-xl flex items-center justify-center text-black font-black text-sm shrink-0">
                                    {i + 1}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-brand-gold shrink-0">{step.icon}</span>
                                    <p className="text-sm dark:text-white">{step.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}