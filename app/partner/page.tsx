import HeroIntro from "@/components/HeroIntro";

export default function Home() {
  return (
    <main className='flex flex-col min-h-screen w-full relative'>
      <HeroIntro
        heading="Partner With Us for The Non-Stop"
        description="The 144-hour sacrifice of praise cannot happen without the support of kingdom-minded partners and sponsors. Join us in sustaining the fire on the altar, facilitating global reach, and impacting lives through the power of unbroken worship."
        ctaLabel="Become a Partner"
        ctaHref="#"
        pins={[
          { label: "Kingdom Focused 👑", className: "top-8 right-4 rotate-8" },
          { label: "Global Impact �", className: "bottom-15 left-6 -rotate-8" },
        ]}
      />

      <section>

        <div className='container py-24'>
          <div className='relative h-[500px] flex-1'>
            <div className='absolute inset-0 flex size-full items-center justify-center overflow-hidden rounded-xl object-cover'>
              <img
                src='/images/partner.jpg'
                alt='video'
                className='inline-block size-full max-w-full object-cover align-middle'
              />

              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='1em'
                height='1em'
                viewBox='0 0 24 24'
                className='absolute z-20 size-14 text-white'
              >
                <path
                  fill='currentColor'
                  d='m10.65 15.75l4.875-3.125q.35-.225.35-.625t-.35-.625L10.65 8.25q-.375-.25-.763-.038t-.387.663v6.25q0 .45.388.663t.762-.038M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22'
                ></path>
              </svg>
              <span className='absolute inset-0 z-10 bg-black/50'></span>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-12 pt-12 max-w-5xl mx-auto'>
            <div>
              <h1 className='mb-8 flex max-w-5xl text-4xl font-semibold leading-none   text-gray-800 md:text-5xl'>
                Fueling the Vision of Recovery, Revival, and Restoration
              </h1>
            </div>
            <div>
              <p className='text-xl leading-normal text-gray-500'>
                The Non-Stop is a massive undertaking that requires tremendous resources—from high-quality broadcasting for our global stream, to ensuring the logistics, safety, and hospitality of thousands of attendees over 6 straight days. By partnering with us, you become a foundational part of this historic altar of worship.
              </p>
              <div className='mt-8 flex justify-start gap-4'>
                <button className='flex items-center rounded-xl bg-blue-600 px-5 py-3 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 lg:px-6'>
                  Sponsor the Event
                </button>
                <button className='flex items-center rounded-xl border border-gray-600 px-5 py-3 text-center font-medium text-gray-600 transition duration-500 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 lg:px-6'>
                  View Sponsorship Tiers
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    className='ml-1 size-6'
                  >
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 12h14m-4 4l4-4m-4-4l4 4'
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
