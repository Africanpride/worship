import HeroSection from "@/components/hero-section";
import { Ministration } from "../components/ministrations-main";
import FAQ from "@/components/faq";
import { AboutCompliment } from "@/components/about-compliment";
import HeroHeadline from "@/components/hero-headline";

export default function Page() {
  return (
      <main className='w-full relative'>
        <HeroSection />
        <section className='px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 container max-w-(--breakpoint-xl) mx-auto '>
          <AboutCompliment />
          <Ministration />
        </section>
        <section id="faq" className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 container max-w-(--breakpoint-xl) mx-auto">
          <FAQ />
        </section>
      </main>
  );
}
