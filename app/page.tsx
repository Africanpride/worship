import HeroSection from '@/components/hero-section';

export default function Page() {
  return (
    <main className="w-full">
      <HeroSection />
      
      {/* Additional content sections can be added here */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">More Content Below</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Add your additional sections here. The hero section above features a full-screen video background with editable text that maintains excellent readability and accessibility.
          </p>
        </div>
      </section>
    </main>
  );
}
