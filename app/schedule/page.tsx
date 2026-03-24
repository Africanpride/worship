import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import UpcomingEventsList from "@/components/upcoming-events-list";

export default async function SchedulePage() {
  const events = await prisma.event.findMany({
    where: {
      status: "published",
    },
    orderBy: {
      startDate: "asc",
    },
  });

  const nextEvent = events[0];
  const otherEvents = events.slice(1);

  if (!nextEvent) {
    return (
      <main className="w-full py-32 text-center">
        <h1 className="text-4xl font-bebas mb-4">Upcoming Schedule</h1>
        <p className="text-muted-foreground">Stay tuned! We are finalizing our upcoming gathering dates.</p>
        <div className="mt-10">
          <a
            href="/get-involved"
            className="inline-flex h-12 px-8 rounded-full bg-primary text-primary-foreground items-center font-bold text-sm"
          >
            Get Involved
          </a>
        </div>
      </main>
    );
  }

  const startDate = new Date(nextEvent.startDate);
  const day = format(startDate, "dd");
  const month = format(startDate, "MMM");
  const year = format(startDate, "yyyy");
  const fullDateRange = `${format(startDate, "MMMM d")} – ${format(new Date(nextEvent.endDate), "d, yyyy")}`;

  return (
		<main className='w-full py-20' id='UpNextCard'>
			{/* Hero Banner */}
			<div
				className='w-full h-[220px] sm:h-[420px] bg-center bg-cover relative flex items-end pt-20'
				style={{
					backgroundImage: nextEvent.poster
						? `url('${nextEvent.poster}')`
						: "url('/images/community_worship.jpg')",
				}}
			>
				<div className='absolute inset-0 bg-black/60' />
				<div className='relative z-10 max-w-5xl mx-auto w-full px-4 pb-12'>
					<p className='text-xs sm:text-sm uppercase tracking-[0.3em] text-primary mb-2 font-bold'>
						Next Event
					</p>
					<h1 className='text-4xl sm:text-7xl font-bebas text-white leading-tight tracking-wider'>
						{nextEvent.title}
					</h1>
				</div>
			</div>

			{/* Main Event Card */}
			<div className='max-w-7xl mx-auto -mt-16 relative z-20 px-4'>
				<div className='flex flex-col md:flex-row rounded-3xl overflow-hidden border shadow-2xl bg-card text-card-foreground'>
					{/* Date Strip */}
					<div className='flex flex-row items-center justify-center gap-3 md:flex-col md:justify-center md:items-center py-6 px-8 md:py-12 md:w-1/4 bg-primary text-primary-foreground font-bebas shrink-0'>
						<div className='text-xl md:text-3xl'>{month}</div>
						<div className='text-5xl md:text-9xl font-bold leading-none'>
							{day}
						</div>
						<div className='text-xl md:text-2xl'>{year}</div>
					</div>

					{/* Content Column */}
					<div className='p-6 sm:p-10 flex flex-col gap-6 flex-1'>
						<div className='space-y-2'>
							<h2 className='text-2xl sm:text-4xl font-bebas tracking-wide'>
								{nextEvent.tagline || nextEvent.title}
							</h2>
							{nextEvent.category && (
								<div className='inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20'>
									{nextEvent.category}
								</div>
							)}
						</div>

						<div className='text-sm sm:text-base text-muted-foreground leading-relaxed space-y-4'>
							{nextEvent.description ? (
								<div
									className='prose prose-invert max-w-none text-muted-foreground'
									dangerouslySetInnerHTML={{
										__html: nextEvent.description.replace(
											/\n/g,
											"<br/>",
										),
									}}
								/>
							) : (
								<p>
									Experience unbroken worship, deep
									intercession, and the raw presence of God.
									Join us as we press into the heart of the
									Father together.
								</p>
							)}
						</div>

						<div className='pt-6 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-muted-foreground'>
							<div className='flex items-center gap-3'>
								<div className='bg-muted p-2 rounded-lg'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='18'
										height='18'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='text-amber-400'
									>
										<rect
											width='18'
											height='18'
											x='3'
											y='4'
											rx='2'
											ry='2'
										/>
										<line x1='16' x2='16' y1='2' y2='6' />
										<line x1='8' x2='8' y1='2' y2='6' />
										<line x1='3' x2='21' y1='10' y2='10' />
									</svg>
								</div>
								<div className='grid grid-cols-2 gap-4 flex-1'>
									<div>
										<p className='font-bold text-foreground'>
											Starts
										</p>
										<p className='font-medium text-foreground leading-tight'>
											{format(startDate, "MMMM d, yyyy")}
											<span className='block text-xs text-muted-foreground mt-0.5 tracking-wider'>
												@ {format(startDate, "h:mm aa")}
											</span>
										</p>
									</div>
									<div>
										<p className='font-bold text-foreground'>
											Ends
										</p>
										<p className='font-medium text-foreground leading-tight'>
											{format(
												new Date(nextEvent.endDate),
												"MMMM d, yyyy",
											)}
											<span className='block text-xs text-muted-foreground mt-0.5 tracking-wider'>
												@ {format(
													new Date(nextEvent.endDate),
													"h:mm aa",
												)}
											</span>
										</p>
									</div>
								</div>
							</div>
							<div className='flex items-center gap-3'>
								<div className='bg-muted p-2 rounded-lg'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='18'
										height='18'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='text-amber-400'
									>
										<path d='M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z' />
										<circle cx='12' cy='10' r='3' />
									</svg>
								</div>
								<div>
									<p className='font-bold text-foreground'>
										Location
									</p>
									<p>
										{nextEvent.location ||
											"Online / To Be Announced"}
									</p>
								</div>
							</div>
						</div>

						{nextEvent.registrationUrl && (
							<div className='pt-4'>
								<a
									href={nextEvent.registrationUrl}
									target='_blank'
									className='inline-flex h-14 px-10 rounded-full bg-primary text-primary-foreground items-center font-bebas text-xl tracking-wider hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95'
								>
									Register Now
								</a>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Other Events List */}
			<div className='mt-20'>
				<UpcomingEventsList events={otherEvents} />
			</div>

			{/* CTA section preserved */}
			<div className='max-w-5xl mx-auto py-20 px-4'>
				<div className='rounded-3xl p-8 sm:p-12 bg-neutral-900 border border-white/10 text-center relative overflow-hidden'>
					<div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none' />
					<h2 className='text-3xl md:text-5xl font-bebas mb-4 text-white'>
						Sustain the Fire
					</h2>
					<p className='text-neutral-400 mb-8 max-w-2xl mx-auto text-base sm:text-lg'>
						Every hour of worship is a collective sacrifice. Join
						our community of intercessors, worshippers, and
						builders.
					</p>
					<a
						href='/get-involved'
						className='inline-flex items-center justify-center h-14 px-12 rounded-full bg-white text-black font-bebas text-xl tracking-wider hover:bg-neutral-200 transition-colors'
					>
						Get Involved
					</a>
				</div>
			</div>
		</main>
  );
}
