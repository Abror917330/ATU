export type PostCategory = 'Barchasi' | 'Yangiliklar' | 'Tadbir' | 'E’lon';

export interface YouthPost {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    category: PostCategory;
    fullText: string;
}

export const YOUTH_POSTS: YouthPost[] = [
    {
        id: '1',
        title: 'Uzgoniylar uchrashuvi 2024',
        description: 'O‘sh shahrida yoshlar bilan uchrashuv tashkil etildi.',
        image: 'https://images.unsplash.com',
        date: '2024-03-20',
        category: 'Tadbir',
        fullText: 'To‘liq matn bu yerda bo‘ladi...'
    },
    {
        id: '2',
        title: 'Yangi loyiha: "Kitobxon yoshlar"',
        description: 'Kitob o‘qishni targ‘ib qiluvchi yangi tanlov e’lon qilindi.',
        image: 'https://images.unsplash.com',
        date: '2024-03-18',
        category: 'E’lon',
        fullText: 'Tanlov shartlari haqida batafsil...'
    },
];
