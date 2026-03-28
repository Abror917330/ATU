import Hero from "@/components/home/Hero";
import  FeaturedCreative  from "@/components/home/FeaturedCreative";
import { QuickShop } from "@/components/home/QuickShop";
import { UzgoniylarPreview } from "@/components/home/UzgoniylarPreview";

export default function HomePage() {
  return (
    <div className="bg-main-bg min-h-screen pb-20 md:pb-0 transition-colors duration-300">
      <Hero />
      <div className="divide-y divide-gray-100 dark:divide-white/5">
        <FeaturedCreative />
        <QuickShop />
        <UzgoniylarPreview />
      </div>
    </div>
  );
}