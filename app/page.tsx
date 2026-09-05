import { getProducts, getCategories, getFarmValues, getProcessSteps, getDeliveryRegions, getTestimonials, getHomepageHero, getHomepagePromise } from '@/lib/supabase/api';
import { HeroSection } from '@/components/home/HeroSection';
import { OurPromise } from '@/components/home/OurPromise';
import { FarmIntro } from '@/components/home/FarmIntro';
import { FarmValues } from '@/components/home/FarmValues';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { ProcessJourney } from '@/components/home/ProcessJourney';
import { MilkReportSection } from '@/components/home/MilkReportSection';
import { DeliverySection } from '@/components/home/DeliverySection';
import { ProductCollection } from '@/components/home/ProductCollection';
import { AboutStory } from '@/components/home/AboutStory';
import { TestimonialSection } from '@/components/home/TestimonialSection';
import { FinalCTA } from '@/components/home/FinalCTA';

export const revalidate = 60; // revalidate every 60s

export default async function HomePage() {
  const [
    products,
    categories,
    farmValues,
    processSteps,
    deliveryRegions,
    testimonials,
    heroData,
    promiseData,
  ] = await Promise.all([
    getProducts(),
    getCategories(),
    getFarmValues(),
    getProcessSteps(),
    getDeliveryRegions(),
    getTestimonials(),
    getHomepageHero(),
    getHomepagePromise(),
  ]);

  const introData = {
    eyebrow: "OPEN AIR & SUNSHINE",
    heading: "Life begins in the pasture.",
    description: "Surrounded by wide green pastures, fresh breeze, and continuous access to natural shade and clean deep-well water. Our cows lead relaxed, healthy lives, yielding milk of exceptional natural creaminess and nutritional richness.",
    imageUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection data={heroData} />

      {/* 2. Our Promise Section */}
      <OurPromise data={promiseData} />

      {/* 3. Official Lab Milk Quality Report */}
      <MilkReportSection />

      {/* 4. Farm Introduction */}
      <FarmIntro data={introData} />

      {/* 5. Farm Values */}
      <FarmValues values={farmValues} />

      {/* 6. Visual Marquee */}
      <BrandMarquee />

      {/* 7. Process / Journey Section */}
      <ProcessJourney steps={processSteps} />

      {/* 8. Delivery Section */}
      <DeliverySection regions={deliveryRegions} />

      {/* 9. Product Collection */}
      <ProductCollection products={products} categories={categories} />

      {/* 9. About / Story Section */}
      <AboutStory />

      {/* 10. Testimonials */}
      <TestimonialSection testimonials={testimonials} />

      {/* 11. Final CTA */}
      <FinalCTA />
    </div>
  );
}
