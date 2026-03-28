export type CreativeType = 'poem' | 'video' | 'audio';

export interface CreativeItem {
    id: string;
    type: CreativeType;
    title: string;
    content?: string;
    videoUrl?: string;
    audioUrl?: string;
    thumbnail?: string;
    duration?: string;
    date: string;
    likes: number;
    isNew?: boolean;
}

export const CREATIVE_ITEMS: CreativeItem[] = [
    {
        id: '1',
        type: 'poem',
        title: "Ona yurt",
        content: `O'zgan tog'lari orasida tug'ildim,
Har tosh, har daryo — mening qo'shig'im.
Abdulloh Tohir — so'z bilan yashaydi,
Har misrada bir umr, bir orzum...`,
        date: '2025-03-01',
        likes: 124,
        isNew: true,
    },
    {
        id: '2',
        type: 'poem',
        title: "Sabr",
        content: `Sabr — oltin, degan so'z bor qadimdan,
Har mushkulda bir nur yashiringan.
Qiyinchilik — imtihon, ne'mat u,
O'tgan kunlar — tajriba, hayot u...`,
        date: '2025-02-15',
        likes: 89,
    },
    {
        id: '3',
        type: 'video',
        title: "Yangi she'r o'qish — Ona yurt",
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '/creative/video-1.jpg',
        duration: '3:45',
        date: '2025-02-20',
        likes: 256,
        isNew: true,
    },
    {
        id: '4',
        type: 'audio',
        title: "Quron tilovati",
        audioUrl: '/creative/audio-1.mp3',
        thumbnail: '/creative/audio-thumb-1.jpg',
        duration: '5:20',
        date: '2025-01-10',
        likes: 312,
    },
];