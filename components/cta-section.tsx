import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CTASection() {
	return (
		<section
			className="max-w-7xl px-4 lg:px-8 xl:px-16 lg:py-20 sm:py-16 py-8 mx-auto w-full"
			data-usal="fade-u duration-500"
		>
			<div className="container mx-auto text-center lg:text-start">
				<div className="bg-primary/5 dark:bg-muted/30 flex w-full flex-col-reverse gap-4 rounded-lg p-12 md:rounded-3xl lg:flex-row lg:items-center lg:px-14 lg:py-10 min-h-[400px] overflow-hidden relative">
					<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
					<div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />

					<div className="grow space-y-6 relative z-10">
						<h2 className="text-3xl md:text-5xl font-bebas tracking-wider uppercase">
							Join the <span className="text-primary">Eternal Sound</span> of
							Heaven{" "}
							<span className="text-xs font-sans align-middle bg-primary/10 text-primary px-2 py-1 rounded inline-block ml-2">
								Silver Jubilee Edition
							</span>
						</h2>
						{/* <h6 className='text-3xl font-bold md:text-4xl lg:text-5xl tracking-tight leading-tight'>
              Join the <span className='text-primary'>Eternal Sound</span> of
              Heaven
            </h6> */}
						<p className="text-muted-foreground lg:text-xl max-w-3xl leading-relaxed">
							Become part of a 25-year spiritual legacy. Join thousands across
							the globe in a movement of recovery, revival, and restoration
							through the power of unending worship.
						</p>
						<div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
							<Button
								asChild
								variant="default"
								size="lg"
								className="rounded-full px-10 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
							>
								<a href="/partner" className="cursor-pointer">
									Partner with the Mission
								</a>
							</Button>
						</div>
					</div>
					<div className="m-auto flex shrink-0 flex-col gap-4 sm:flex-row lg:m-0 relative z-10">
						<figure className="relative aspect-square w-48 lg:w-72 drop-shadow-2xl">
							<Image
								src="/images/cta.webp"
								fill
								alt="The Non-Stop Series Call to Action"
								sizes="(max-width: 1024px) 192px, 288px"
								className="object-contain"
								priority
							/>
						</figure>
					</div>
				</div>
			</div>
		</section>
	);
}
