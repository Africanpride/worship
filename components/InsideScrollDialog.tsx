"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ScrollArea } from "@base-ui/react/scroll-area";
import React from "react";
import { Button } from "@/components/ui/button";
import { DonationOptions } from "./DonationOptions";

export default function InsideScrollDialog({
	children,
}: {
	children: React.ReactElement;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger render={children} />
			<Dialog.Portal>
				<Dialog.Backdrop className="fixed inset-0 z-50 bg-black opacity-20 transition-opacity duration-[250ms] ease-[cubic-bezier(0.45,1.005,0,1.005)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute" />
				<Dialog.Viewport className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden py-0 sm:py-6 [@media(min-height:600px)]:pb-12 [@media(min-height:600px)]:pt-8">
					<Dialog.Popup
						data-lenis-prevent
						className="relative flex w-full sm:w-[min(40rem,calc(100vw-2rem))] max-h-[90vh] sm:max-h-full max-w-full min-h-0 flex-col overflow-hidden rounded-t-3xl sm:rounded-lg bg-background p-5 sm:p-8 text-foreground shadow-[0_24px_45px_rgba(0,0,0,0.2)] border border-border transition-all duration-[300ms] ease-[cubic-bezier(0.45,1.005,0,1.005)] data-[starting-style]:translate-y-[100%] sm:data-[starting-style]:translate-y-0 sm:data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:translate-y-[100%] sm:data-[ending-style]:translate-y-0 sm:data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0"
					>
						<div className="mb-2 flex items-start justify-between gap-3">
							<Dialog.Title className="m-0 text-2xl sm:text-3xl font-bebas tracking-wider leading-tight">
								Partner with the Non-Stop Series
							</Dialog.Title>
						</div>
						<Dialog.Description className="m-0 mb-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
							Your sacrifice sustains the 144-hour altar of worship. Choose your
							preferred way to give.
						</Dialog.Description>
						<ScrollArea.Root className="relative flex min-h-0 flex-1 overflow-hidden before:absolute before:top-0 before:h-px before:w-full before:bg-border before:content-[''] after:absolute after:bottom-0 after:h-px after:w-full after:bg-border after:content-['']">
							<ScrollArea.Viewport className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-4 sm:py-6 pr-4 sm:pr-6 pl-1 focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-blue-800">
								<ScrollArea.Content className="flex flex-col gap-6">
									<DonationOptions />
								</ScrollArea.Content>
							</ScrollArea.Viewport>
							<ScrollArea.Scrollbar className="pointer-events-none absolute m-1 flex w-[0.25rem] justify-center rounded-[1rem] opacity-0 transition-opacity duration-[250ms] data-[hovering]:pointer-events-auto data-[hovering]:opacity-100 data-[hovering]:duration-[75ms] data-[scrolling]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:duration-[75ms] md:w-[0.325rem]">
								<ScrollArea.Thumb className="w-full rounded-[inherit] bg-muted-foreground/30 before:absolute before:left-1/2 before:top-1/2 before:h-[calc(100%+1rem)] before:w-[calc(100%+1rem)] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
							</ScrollArea.Scrollbar>
						</ScrollArea.Root>
						<div className="mt-4 flex justify-end gap-3">
							<Dialog.Close
								render={
									<Button variant="outline" className="cursor-pointer">
										Close
									</Button>
								}
							/>
						</div>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
