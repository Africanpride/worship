import { AboutCompliment } from "@/components/about-compliment";
import { MissionVision } from "@/components/mission-vision";

export default function Home() {
  return (
    <main className='flex flex-col min-h-screen w-full relative'>
      {/* Additional content sections can be added here */}
      <section className='py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-background hidden'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-6'>
            Diverse Voices, One Throne
          </h2>
          <p className='text-2xl text-muted-foreground leading-relaxed'>
            In an era of distractions, we choose to focus. Based on the biblical
            mandate to keep the fire on the altar burning (Leviticus 6:13), The
            Non-Stop is more than an event—it is a sacrifice of time. For 6 days
            and 6 nights, the music never stops, and the Word never ceases. We
            are recovering, reviving and restoring the tabernacle of David.
          </p>
        </div>
      </section>

      <section
        className='flex flex-1 items-center justify-center'
        data-usal='fade-u duration-500'
      >
        <div
          className='py-6 w-full'
          data-usal='fade-u duration-500 delay-200'
        >
          <div className='container'>
            <div className='flex flex-col items-center justify-start gap-6 lg:flex-row'>
              <div className='flex w-full flex-col items-start justify-start gap-2 lg:w-1/2'>
                <div className='pr-2'>
                  <h1 className='mb-6 text-2xl uppercase md:text-4xl lg:mb-8 lg:text-5xl'>
                    The Non-Stop Series
                  </h1>
                  <p className='mb-9 text-muted-foreground '>
                    For the past 22 years , the Logos-Rhema Foundation for
                    Leadership Resource Development, based in Accra, Ghana, has
                    organised and held under its auspices, a series of non-stop
                    praise & worship programmes. The series began with 24-hour
                    sessions which progressed to 48 hours, 72 hours, 96 hours,
                    120 hours, and now 144 hours; the first session of which was
                    held 2021.
                  </p>
                </div>

                <div className='flex flex-col items-center justify-center gap-6 md:flex-row'>
                  <img
                    alt='about 1'
                    className='aspect-[0.7] w-full rounded-lg object-cover object-top md:w-1/2'
                    src='/nonstop/nonstop-048.jpg'
                  />

                  <div className='flex w-full flex-col items-center justify-center gap-6 md:w-1/2'>
                    <img
                      alt='about 2'
                      className='aspect-[1.1] rounded-lg object-cover object-top'
                      src='/nonstop/nonstop-022.jpg'
                    />
                    <img
                      alt='about 3'
                      className='aspect-[0.7] rounded-lg object-cover object-top'
                      src='/nonstop/nonstop-004.jpg'
                    />
                  </div>
                </div>
              </div>

              <div className='flex w-full flex-col items-center justify-center gap-12 pt-12 lg:w-1/2 lg:pt-48'>
                <div className='flex flex-col items-center justify-center gap-6 md:flex-row'>
                  <img
                    alt='about 4'
                    className='aspect-[0.9] w-full rounded-lg object-cover object-top md:w-1/2'
                    src='/nonstop/nonstop-012.jpg'
                  />

                  <div className='flex w-full flex-col items-center justify-center gap-6 md:w-1/2'>
                    <img
                      alt='about 5'
                      className='aspect-[0.8] rounded-lg object-cover object-top'
                      src='/nonstop/nonstop-026.jpg'
                    />
                    <img
                      alt='about 6'
                      className='aspect-[0.9] rounded-lg object-cover object-top'
                      src='/nonstop/nonstop-010.jpg'
                    />
                  </div>
                </div>

                <div
                  className='px-8'
                  data-usal='fade-u duration-500'
                >
                  <h1 className='mb-8 text-2xl font-semibold lg:mb-6'>
                    Around-The-Clock Ministration
                  </h1>
                  <p className='mb-9 lg:text-2xl'>
                    Jesus said, “The hour is coming and is already here when the
                    true worshipers will worship the Father in spirit and truth;
                    for the Father is looking for those who will worship Him
                    that way.” (John 4:23-25)
                  </p>
                  <p className='text-muted-foreground'>
                    In the Old Testament days, there was one saint, David,
                    tasted the fruits of the truth of the word of God and the
                    powers of the world to come, he also tasted salvation and
                    experienced the Holy Spirit (Psalm 51). He was able to
                    experience all that because he understood how to touch the
                    heart of the Father (Acts 13:22). Regardless of his
                    weaknesses and many flaws, David genuinely, was out all time
                    to please God and to give Him pleasure. Because the purpose
                    of everyone’s creation as found in Revelations 4:11 is to
                    please and give the Lord, pleasure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className='py-16 block-preview-wrapper'
        data-usal='fade-u duration-500'
      >
        <div className="bg-[url('/nonstop/nonstop-040.jpg')] bg-cover bg-center rounded-xl bg-no-repeat pt-16">
          <div className='flex items-end sm:items-center justify-center lg:justify-start'>
            <div className='max-w-7xl px-4 lg:px-8 xl:px-16 lg:py-20 sm:py-16 py-8 mx-auto w-full h-full min-h-screen '>
              <div style={{ opacity: 1, transform: "none" }}>
                <div
                  data-slot='card'
                  data-size='default'
                  className='ring-foreground/10 bg-card text-card-foreground hidden
                   gap-4 overflow-hidden rounded-xl text-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl group/card flex flex-col w-full h-full max-w-md p-5 sm:p-10 border-none shadow-none'
                >
                  <div
                    data-slot='card-content'
                    className='group-data-[size=sm]/card:px-3 p-0'
                  >
                    <div className='flex flex-col gap-6'>
                      {/* <div className='flex flex-col gap-4'>
                        <div style={{ opacity: 1, transform: "none" }}>
                          <span
                            data-slot='badge'
                            data-variant='outline'
                            className='gap-1 rounded-4xl border transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden group/badge border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground px-3 py-1 h-7 text-sm font-normal'
                          >
                            Features
                          </span>
                        </div>
                        <p
                          className='text-3xl sm:text-4xl font-semibold'
                          style={{ opacity: 1, transform: "none" }}
                        >
                          Leading with innovative solution.
                        </p>
                        <p
                          className='text-base font-normal text-muted-foreground'
                          style={{ opacity: 1, transform: "none" }}
                        >
                          We're west coast change-makers in a complex world,
                          crafting purposeful and powerful brands with fluidity
                        </p>
                      </div> */}
                      <div
                        className='hidden sm:block'
                        style={{ opacity: 1, transform: "none" }}
                      >
                        <div className='p-5 border rounded-2xl flex flex-col gap-8'>
                          <div className='flex gap-4'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width={24}
                              height={24}
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              className='lucide lucide-layers shrink-0'
                              aria-hidden='true'
                            >
                              <path d='M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z' />
                              <path d='M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12' />
                              <path d='M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17' />
                            </svg>
                            <div className='flex flex-col gap-1'>
                              <p className='text-xl font-medium'>Recovery</p>
                              <p className='text-base text-muted-foreground'>
                                Reclaiming every spiritual inheritance that has
                                been stolen or dormant.
                              </p>
                            </div>
                          </div>
                          <div
                            data-orientation='horizontal'
                            role='separator'
                            aria-orientation='horizontal'
                            data-slot='separator'
                            className='bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch'
                          />
                          <div className='flex gap-4'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width={24}
                              height={24}
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              className='lucide lucide-layers shrink-0'
                              aria-hidden='true'
                            >
                              <path d='M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z' />
                              <path d='M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12' />
                              <path d='M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17' />
                            </svg>
                            <div className='flex flex-col gap-1'>
                              <p className='text-xl font-medium'>Revival</p>
                              <p className='text-base text-muted-foreground'>
                                Igniting a fresh passion for the Presence of God
                                that outlasts the event.
                              </p>
                            </div>
                          </div>
                          <div
                            data-orientation='horizontal'
                            role='separator'
                            aria-orientation='horizontal'
                            data-slot='separator'
                            className='bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch'
                          />
                          <div className='flex gap-4'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width={24}
                              height={24}
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              className='lucide lucide-shapes shrink-0'
                              aria-hidden='true'
                            >
                              <path d='M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z' />
                              <rect
                                x={3}
                                y={14}
                                width={7}
                                height={7}
                                rx={1}
                              />
                              <circle
                                cx='17.5'
                                cy='17.5'
                                r='3.5'
                              />
                            </svg>
                            <div className='flex flex-col gap-1'>
                              <p className='text-xl font-medium'>Restoration</p>
                              <p className='text-base text-muted-foreground'>
                                Returning to the original pattern of intimacy
                                where every believer has direct access to the
                                Throne.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ opacity: 1, transform: "none" }}>
                        <button
                          type='button'
                          tabIndex={0}
                          data-slot='button'
                          className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none bg-primary text-primary-foreground [a]:hover:bg-primary/80 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 h-12 w-full rounded-full cursor-pointer"
                        >
                          Get Started
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*$*/}
        {/*/$*/}
      </section>
      <section>
        <MissionVision />
      </section>
      <section
        className='container py-12 md:py-8 p-4'
        id='achievements'
        data-usal='fade-u duration-500'
      >
        <div className=''>
          <h2 className='mb-4 text-3xl sm:text-4xl'>Our Impact & Reach</h2>
          <p className='text-muted-foreground  mb-12 max-w-3xl text-base sm:text-lg'>
            Rooted in faith, growing in community. Witness the transformative
            power of worship as we reach souls across the globe and build a
            legacy of spiritual revival.
          </p>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <div
              data-slot='card'
              className='bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm gap-0 p-6 text-left hover:shadow-md transition-shadow'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-users text-primary mb-4 h-8 w-8'
              >
                <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                <circle
                  cx='9'
                  cy='7'
                  r='4'
                ></circle>
                <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                <path d='M16 3.13a4 4 0 0 1 0 7.75'></path>
              </svg>
              <div className='mb-1 text-3xl font-bold'>150k+</div>
              <div className='mb-3 text-sm font-medium'>Faithful Believers</div>
              <p className='text-muted-foreground text-sm'>
                United in spirit across diverse congregations and digital
                platforms.
              </p>
            </div>
            <div
              data-slot='card'
              className='bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm gap-0 p-6 text-left hover:shadow-md transition-shadow'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-flame text-primary mb-4 h-8 w-8'
              >
                <path d='M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'></path>
              </svg>
              <div className='mb-1 text-3xl font-bold'>500k+</div>
              <div className='mb-3 text-sm font-medium'>
                Praise, Word & Prayer
              </div>
              <p className='text-muted-foreground text-sm'>
                Sustaining a 144-hour continuous flow of worship, scripture
                reading, and intercession.
              </p>
            </div>
            <div
              data-slot='card'
              className='bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm gap-0 p-6 text-left hover:shadow-md transition-shadow'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-heart text-primary mb-4 h-8 w-8'
              >
                <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'></path>
              </svg>
              <div className='mb-1 text-3xl font-bold'>10k+</div>
              <div className='mb-3 text-sm font-medium'>Souls Restored</div>
              <p className='text-muted-foreground text-sm'>
                Documented testimonies of spiritual growth and life-changing
                renewal.
              </p>
            </div>
            <div
              data-slot='card'
              className='bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm gap-0 p-6 text-left hover:shadow-md transition-shadow'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-globe text-primary mb-4 h-8 w-8'
              >
                <circle
                  cx='12'
                  cy='12'
                  r='10'
                ></circle>
                <line
                  x1='2'
                  x2='22'
                  y1='12'
                  y2='12'
                ></line>
                <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'></path>
              </svg>
              <div className='mb-1 text-3xl font-bold'>25+</div>
              <div className='mb-3 text-sm font-medium'>Global Ministries</div>
              <p className='text-muted-foreground text-sm'>
                Partnering with mission-driven organizations across multiple
                nations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
