"use client";

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	CreditCard,
	Smartphone,
	Gift,
	Heart,
	Info,
	Copy,
	ExternalLink,
	LeafyGreen,
} from "lucide-react";
import { toast } from "sonner";

export function DonationDialog({ children }: { children: React.ReactNode }) {
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Number copied to clipboard");
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[550px] border-amber-500/20 bg-background text-foreground p-0 overflow-hidden'>
				<div className='bg-gradient-to-r from-amber-600 to-amber-400 h-2 w-full shrink-0' />

				<div className='px-6 pt-8 pb-4 border-b border-border/50 shrink-0'>
					<DialogHeader>
						<DialogTitle className='text-4xl font-bebas tracking-wider flex items-center gap-2'>
							{/* <Heart className='text-amber-500 size-7 fill-amber-500' /> */}
							Partner with the Fire
						</DialogTitle>
						<DialogDescription className='text-muted-foreground text-lg'>
							Your sacrifice sustains the 144-hour altar of
							worship. Choose your preferred way to give.
						</DialogDescription>
					</DialogHeader>
				</div>

				<div className='px-6 py-6 max-h-[70vh] overflow-y-auto no-scrollbar'>
					<Tabs defaultValue='cash' className='w-full'>
						<TabsList className='grid w-full grid-cols-2 bg-muted border border-border mb-8 h-14 min-h-[54px]'>
							<TabsTrigger
								value='cash'
								className='data-[state=active]:bg-amber-500 data-[state=active]:text-primary-foreground uppercase font-semibold text-xs sm:text-sm tracking-wide h-full'
							>
								Cash Donation
							</TabsTrigger>
							<TabsTrigger
								value='kind'
								className='data-[state=active]:bg-amber-500 data-[state=active]:text-primary-foreground uppercase font-semibold text-xs sm:text-sm tracking-wide h-full'
							>
								In-Kind Sacrifice
							</TabsTrigger>
						</TabsList>

						<TabsContent value='cash' className='space-y-5'>
							<Accordion
								type='single'
								collapsible
								className='w-full space-y-4'
							>
								{/* Mobile Money */}
								<AccordionItem
									value='momo'
									className='bg-card dark:border-white/10 dark:bg-white/5 border-border data-[state=open]:border-amber-500/50 data-[state=open]:bg-amber-500/10 rounded-xl border transition-all duration-300 px-5 group'
								>
									<AccordionTrigger className='hover:no-underline py-5 px-0'>
										<div className='flex flex-1 items-center justify-between pr-4'>
											<div className='flex items-center gap-5'>
												<div className='p-3 rounded-xl transition-colors bg-amber-500/10 group-data-[state=open]:bg-amber-500/20 group-hover:bg-amber-500/20'>
													<Smartphone className='size-7 text-amber-500 dark:text-amber-400' />
												</div>
												<div className='text-left space-y-1'>
													<p className='text-xl text-foreground tracking-tight'>
														Mobile Money
													</p>
													<p className='text-sm font-opensans text-muted-foreground'>
														MTN, Vodafone,
														AirtelTigo
													</p>
												</div>
											</div>
											<div
												className='text-xs font-bold font-opensans tracking-wider text-amber-600 dark:text-amber-400 
											bg-amber-500/10 px-3 py-1.5 rounded-md uppercase'
											>
												GHANA
											</div>
										</div>
									</AccordionTrigger>
									<AccordionContent className='pt-0 pb-5'>
										<div className='pt-5 border-t border-border space-y-4'>
											<div className='flex items-center justify-between bg-muted/50 p-4 rounded-xl border border-border'>
												<div>
													<p className='text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1'>
														MTN / Telecel Cash
													</p>
													<p className='font-mono text-xl text-amber-600 dark:text-amber-400 font-bold tracking-wider'>
														024 123 4567
													</p>
												</div>
												<Button
													size='icon'
													variant='ghost'
													className='hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 h-12 w-12 text-muted-foreground rounded-full'
													onClick={(e) => {
														e.stopPropagation();
														copyToClipboard(
															"0241234567",
														);
													}}
												>
													<Copy className='size-6' />
												</Button>
											</div>
											<div className='flex items-center justify-between bg-muted/50 p-4 rounded-xl border border-border'>
												<div>
													<p className='text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1'>
														AT Money
													</p>
													<p className='font-mono text-xl text-amber-600 dark:text-amber-400 font-bold tracking-wider'>
														026 987 6543
													</p>
												</div>
												<Button
													size='icon'
													variant='ghost'
													className='hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 h-12 w-12 text-muted-foreground rounded-full'
													onClick={(e) => {
														e.stopPropagation();
														copyToClipboard(
															"0269876543",
														);
													}}
												>
													<Copy className='size-6' />
												</Button>
											</div>
											<p className='text-center text-[15px]  font-opensans  text-muted-foreground mt-4 font-medium'>
												Account Name:{" "}
												<span className='text-foreground font-semibold'>
													The Non-Stop Worship
												</span>
											</p>
										</div>
									</AccordionContent>
								</AccordionItem>

								{/* PayPal */}
								<AccordionItem
									value='paypal'
									className='bg-card dark:border-white/10 dark:bg-white/5 border-border data-[state=open]:border-blue-500/50 data-[state=open]:bg-blue-500/10 rounded-xl border transition-all duration-300 px-5 group'
								>
									<AccordionTrigger className='hover:no-underline py-5 px-0'>
										<div className='flex flex-1 items-center justify-between pr-4'>
											<div className='flex items-center gap-5'>
												<div className='p-3 rounded-xl transition-colors bg-blue-500/10 group-data-[state=open]:bg-blue-500/20 group-hover:bg-blue-500/20'>
													<svg
														className='size-7 text-blue-600 dark:text-blue-400'
														viewBox='0 0 24 24'
														fill='currentColor'
													>
														<path d='M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.729C5.01 3.312 5.39 3 5.82 3h8.344c3.153 0 5.03 1.545 4.69 4.306-.356 2.898-2.14 4.545-5.013 4.545h-1.928a.48.48 0 0 0-.464.385l-1.07 6.786a.48.48 0 0 1-.47.412h.016zM12.5 13.5c3.0 0 5.5-1.5 6.0-5.0.4-3.5-1.5-5.0-5.5-5.0H6.5L3.5 21h4.0l1.0-6.5h4.0z' />
													</svg>
												</div>
												<div className='text-left space-y-1'>
													<p className='text-xl text-foreground tracking-tight'>
														PayPal
													</p>
													<p className='text-sm  font-opensans  text-muted-foreground'>
														Global Payments
													</p>
												</div>
											</div>
											<div className='text-xs font-bold  font-opensans  tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-md uppercase'>
												GLOBAL
											</div>
										</div>
									</AccordionTrigger>
									<AccordionContent className='pt-0 pb-5'>
										<div className='pt-5 border-t border-border text-center'>
											<p className='text-[15px]  font-opensans  text-muted-foreground leading-relaxed mb-6'>
												Send your contribution securely
												via PayPal. You will be
												redirected to our official
												gateway.
											</p>
											<a
												href='#'
												target='_blank'
												className='inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold transition-colors'
											>
												Proceed to PayPal{" "}
												<ExternalLink className='size-5' />
											</a>
										</div>
									</AccordionContent>
								</AccordionItem>

								{/* Credit Card */}
								<AccordionItem
									value='card'
									className='bg-card dark:border-white/10 dark:bg-white/5 border-border data-[state=open]:border-emerald-500/50 data-[state=open]:bg-emerald-500/10 rounded-xl border transition-all duration-300 px-5 group'
								>
									<AccordionTrigger className='hover:no-underline py-5 px-0'>
										<div className='flex flex-1 items-center justify-between pr-4'>
											<div className='flex items-center gap-5'>
												<div className='p-3 rounded-xl transition-colors bg-emerald-500/10 group-data-[state=open]:bg-emerald-500/20 group-hover:bg-emerald-500/20'>
													<CreditCard className='size-7 text-emerald-600 dark:text-emerald-400' />
												</div>
												<div className='text-left space-y-1'>
													<p className='text-xl text-foreground tracking-tight'>
														Credit / Debit Card
													</p>
													<p className='text-sm  font-opensans  text-muted-foreground'>
														Visa, Mastercard, Amex
													</p>
												</div>
											</div>
											<div className='text-xs font-bold  font-opensans  tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md uppercase'>
												SECURE
											</div>
										</div>
									</AccordionTrigger>
									<AccordionContent className='pt-0 pb-5'>
										<div className='pt-5 border-t border-border text-center'>
											<p className='text-[15px]  font-opensans  text-muted-foreground leading-relaxed mb-6'>
												Support us globally using any
												major credit or debit card
												through our secure Stripe
												portal.
											</p>
											<a
												href='#'
												target='_blank'
												className='inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold transition-colors'
											>
												Pay via Card{" "}
												<ExternalLink className='size-5' />
											</a>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</TabsContent>

						<TabsContent value='kind' className='space-y-5'>
							<div className='p-5 rounded-xl border border-amber-500/30 bg-amber-500/10 mb-2'>
								<div className='flex gap-4 items-start'>
									<Info className='size-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5' />
									<p className='text-[15px]  font-opensans  text-foreground/80 leading-relaxed font-medium'>
										We gratefully accept sacrifices in kind
										to support the hospitality and logistics
										of the Non-Stop.
									</p>
								</div>
							</div>

							<Accordion
								type='single'
								collapsible
								className='w-full space-y-4'
							>
								<AccordionItem
									value='livestock'
									className='bg-card dark:border-white/10 dark:bg-white/5 border-border data-[state=open]:border-amber-500/50 data-[state=open]:bg-amber-500/10 data-[state=open]:shadow-[0_0_15px_rgba(245,158,11,0.1)] rounded-xl border transition-all duration-300 px-5 group'
								>
									<AccordionTrigger className='hover:no-underline py-5 px-0'>
										<div className='flex flex-1 items-center justify-between pr-4'>
											<div className='flex items-center gap-5'>
												<div className='p-3 rounded-xl transition-colors bg-amber-500/10 group-data-[state=open]:bg-amber-500/20 group-hover:bg-amber-500/20'>
													<Gift className='size-7 text-amber-600 dark:text-amber-400 group-data-[state=open]:text-amber-600 dark:group-data-[state=open]:text-amber-400' />
												</div>
												<div className='text-left space-y-1'>
													<p className='text-xl text-foreground tracking-tight'>
														Livestock
													</p>
													<p className='text-[13px]  font-opensans  font-medium text-muted-foreground uppercase tracking-wider'>
														Cows, Sheep, Goats
													</p>
												</div>
											</div>
										</div>
									</AccordionTrigger>
									<AccordionContent className='pt-0 pb-5'>
										<div className='pt-5 border-t border-border'>
											<p className='text-[15px]  font-opensans  text-muted-foreground mb-5 text-center leading-relaxed'>
												To deliver{" "}
												<strong className='text-foreground font-semibold'>
													Live Animals (Cow, Sheep,
													etc.)
												</strong>
												, please contact our logistics
												coordinator directly:
											</p>
											<div className='flex flex-col gap-3'>
												<a
													href='tel:+233241234567'
													className='flex items-center justify-center h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-mono text-lg font-medium transition-colors border border-transparent hover:border-border'
												>
													📞 +233 24 123 4567
												</a>
												<a
													href='mailto:logistics@thenonstop.com'
													className='flex items-center justify-center h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-mono text-lg font-medium transition-colors border border-transparent hover:border-border'
												>
													✉️ logistics@thenonstop.org
												</a>
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem
									value='food'
									className='bg-card dark:border-white/10 dark:bg-white/5 border-border data-[state=open]:border-green-500/50 data-[state=open]:bg-green-500/10 data-[state=open]:shadow-[0_0_15px_rgba(34,197,94,0.1)] rounded-xl border transition-all duration-300 px-5 group'
								>
									<AccordionTrigger className='hover:no-underline py-5 px-0'>
										<div className='flex flex-1 items-center justify-between pr-4'>
											<div className='flex items-center gap-5'>
												<div className='p-3 rounded-xl transition-colors bg-green-500/10 group-data-[state=open]:bg-green-500/20 group-hover:bg-green-500/20'>
													<LeafyGreen className='size-7 text-green-600 dark:text-green-400 group-data-[state=open]:text-green-600 dark:group-data-[state=open]:text-green-400' />
												</div>
												<div className='text-left space-y-1'>
													<p className='text-xl text-foreground tracking-tight'>
														Food Supplies
													</p>
													<p className='text-[13px]  font-opensans  font-medium text-muted-foreground uppercase tracking-wider'>
														Rice, Oil, Water
													</p>
												</div>
											</div>
										</div>
									</AccordionTrigger>
									<AccordionContent className='pt-0 pb-5'>
										<div className='pt-5 border-t border-border'>
											<p className='text-[15px]  font-opensans  text-muted-foreground mb-5 text-center leading-relaxed'>
												To deliver{" "}
												<strong className='text-foreground font-semibold'>
													Food & Water Supplies
												</strong>
												, please contact our logistics
												coordinator directly:
											</p>
											<div className='flex flex-col gap-3'>
												<a
													href='tel:+233241234567'
													className='flex items-center justify-center h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-mono text-lg font-medium transition-colors border border-transparent hover:border-border'
												>
													📞 +233 24 123 4567
												</a>
												<a
													href='mailto:logistics@thenonstop.com'
													className='flex items-center justify-center h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-mono text-lg font-medium transition-colors border border-transparent hover:border-border'
												>
													✉️ logistics@thenonstop.org
												</a>
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</TabsContent>
					</Tabs>

					<p className='mt-8 text-center text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]'>
						Thank you for your generosity
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
