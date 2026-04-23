"use client";

import React from "react";
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
	Copy,
	ExternalLink,
	LeafyGreen,
	Info,
} from "lucide-react";
import { toast } from "sonner";
import { phone, email } from '@/config/site';

export function DonationOptions() {
  const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Number copied to clipboard");
	};

  return (
    <div className="w-full">
      <Tabs defaultValue='cash' className='w-full'>
        <TabsList className='flex w-full bg-muted/30 p-1.5 border border-border/40 mb-10 h-auto min-h-[4.5rem] sm:min-h-[5rem] rounded-2xl items-stretch gap-2 backdrop-blur-sm !h-auto'>
          <TabsTrigger
            value='cash'
            className='group flex-1 data-[state=active]:bg-background data-[state=active]:text-amber-600 data-[state=active]:shadow-lg flex flex-col sm:flex-row items-center justify-center gap-3 rounded-xl py-3 px-4 transition-all duration-300 border border-transparent data-[state=active]:border-border/50 hover:bg-background/50 data-[state=active]:hover:bg-background !h-auto !whitespace-normal'
          >
            <div className='p-2 rounded-xl bg-amber-500/10 group-data-[state=active]:bg-amber-500 group-data-[state=active]:text-white group-data-[state=active]:shadow-inner transition-all duration-300 shrink-0'>
              <CreditCard className='size-4 sm:size-5' />
            </div>
            <div className='flex flex-col items-center sm:items-start text-center sm:text-left overflow-hidden'>
              <span className='font-bebas text-base sm:text-lg tracking-wider uppercase leading-none truncate w-full'>Cash</span>
              <span className='text-[9px] sm:text-[10px] font-bold opacity-60 uppercase tracking-[0.15em] mt-1 whitespace-nowrap'>Contribution</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value='kind'
            className='group flex-1 data-[state=active]:bg-background data-[state=active]:text-amber-600 data-[state=active]:shadow-lg flex flex-col sm:flex-row items-center justify-center gap-3 rounded-xl py-3 px-4 transition-all duration-300 border border-transparent data-[state=active]:border-border/50 hover:bg-background/50 data-[state=active]:hover:bg-background !h-auto !whitespace-normal'
          >
            <div className='p-2 rounded-xl bg-amber-500/10 group-data-[state=active]:bg-amber-500 group-data-[state=active]:text-white group-data-[state=active]:shadow-inner transition-all duration-300 shrink-0'>
              <Gift className='size-4 sm:size-5' />
            </div>
            <div className='flex flex-col items-center sm:items-start text-center sm:text-left overflow-hidden'>
              <span className='font-bebas text-base sm:text-lg tracking-wider uppercase leading-none truncate w-full'>In-Kind</span>
              <span className='text-[9px] sm:text-[10px] font-bold opacity-60 uppercase tracking-[0.15em] mt-1 whitespace-nowrap'>Sacrifice</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='cash' className='space-y-6'>
          <div className='flex flex-wrap items-center justify-between gap-3 px-1.5 mb-2'>
            <div className='flex items-center gap-2'>
              <div className='size-1.5 rounded-full bg-amber-500 animate-pulse' />
              <span className='text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground'>Secure Payment Methods</span>
            </div>
            <div className='flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded-full border border-border/50'>
              <span className='text-[9px] sm:text-[10px] font-bold text-emerald-500 uppercase tracking-tighter'>🔒 256-bit SSL</span>
            </div>
          </div>
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
                <div className='flex flex-1 flex-wrap items-center justify-between gap-4 pr-4'>
                  <div className='flex items-center gap-3 sm:gap-5'>
                    <div className='p-2 sm:p-3 rounded-xl transition-colors bg-amber-500/10 group-data-[state=open]:bg-amber-500/20 group-hover:bg-amber-500/20'>
                      <Smartphone className='size-5 sm:size-7 text-amber-500 dark:text-amber-400' />
                    </div>
                    <div className='text-left space-y-1'>
                      <p className='text-lg sm:text-xl text-foreground tracking-tight'>
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
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between bg-muted/50 p-4 rounded-xl border border-border gap-4'>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1'>
                        MTN / Telecel Cash
                      </p>
                      <p className='font-mono text-lg sm:text-xl text-amber-600 dark:text-amber-400 font-bold tracking-wider break-all'>
                        {phone}
                      </p>
                    </div>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 h-12 w-12 text-muted-foreground rounded-full'
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(phone);
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
                      <p className='font-mono text-lg sm:text-xl text-amber-600 dark:text-amber-400 font-bold tracking-wider break-all'>
                        {phone}
                      </p>
                    </div>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 h-12 w-12 text-muted-foreground rounded-full'
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(phone);
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
                <div className='flex flex-1 flex-wrap items-center justify-between gap-4 pr-4'>
                  <div className='flex items-center gap-3 sm:gap-5'>
                    <div className='p-2 sm:p-3 rounded-xl transition-colors bg-blue-500/10 group-data-[state=open]:bg-blue-500/20 group-hover:bg-blue-500/20'>
                      <svg
                        className='size-5 sm:size-7 text-blue-600 dark:text-blue-400'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                      >
                        <path d='M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.729C5.01 3.312 5.39 3 5.82 3h8.344c3.153 0 5.03 1.545 4.69 4.306-.356 2.898-2.14 4.545-5.013 4.545h-1.928a.48.48 0 0 0-.464.385l-1.07 6.786a.48.48 0 0 1-.47.412h.016zM12.5 13.5c3.0 0 5.5-1.5 6.0-5.0.4-3.5-1.5-5.0-5.5-5.0H6.5L3.5 21h4.0l1.0-6.5h4.0z' />
                      </svg>
                    </div>
                    <div className='text-left space-y-1'>
                      <p className='text-lg sm:text-xl text-foreground tracking-tight'>
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
                    <ExternalLink className='size-5 shrink-0' />
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
                <div className='flex flex-1 flex-wrap items-center justify-between gap-4 pr-4'>
                  <div className='flex items-center gap-3 sm:gap-5'>
                    <div className='p-2 sm:p-3 rounded-xl transition-colors bg-emerald-500/10 group-data-[state=open]:bg-emerald-500/20 group-hover:bg-emerald-500/20'>
                      <CreditCard className='size-5 sm:size-7 text-emerald-600 dark:text-emerald-400' />
                    </div>
                    <div className='text-left space-y-1'>
                      <p className='text-lg sm:text-xl text-foreground tracking-tight'>
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
                    <ExternalLink className='size-5 shrink-0' />
                  </a>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value='kind' className='space-y-6'>
          <div className='relative overflow-hidden p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 group'>
            <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
              <Gift className='size-20 text-amber-500' />
            </div>
            <div className='relative z-10 flex gap-5 items-center'>
              <div className='hidden sm:flex size-14 rounded-full bg-amber-500/10 items-center justify-center shrink-0'>
                <Info className='size-7 text-amber-600 dark:text-amber-400' />
              </div>
              <div>
                <h4 className='font-bebas text-2xl tracking-wide text-amber-600 dark:text-amber-400 mb-1'>Sacrifice in Kind - Silver Jubilee Edition</h4>
                <p className='text-[15px] font-opensans text-muted-foreground leading-relaxed max-w-lg'>
                  Beyond financial support, we gratefully accept resources that fuel the hospitality, logistics, and continuous worship of this historic 25th Anniversary Non-Stop.
                </p>
              </div>
            </div>
          </div>

          <Accordion
            type='single'
            collapsible
            className='w-full space-y-4'
          >
            <AccordionItem
              value='livestock'
              className='bg-card dark:border-white/10 dark:bg-white/5 border-border data-[state=open]:border-amber-500/50 data-[state=open]:bg-amber-500/10 rounded-xl border transition-all duration-300 px-5 group'
            >
              <AccordionTrigger className='hover:no-underline py-5 px-0'>
                <div className='flex flex-1 flex-wrap items-center justify-between gap-4 pr-4'>
                  <div className='flex items-center gap-3 sm:gap-5'>
                    <div className='p-2 sm:p-3 rounded-xl transition-colors bg-amber-500/10 group-data-[state=open]:bg-amber-500/20 group-hover:bg-amber-500/20'>
                      <Gift className='size-5 sm:size-7 text-amber-600 dark:text-amber-400' />
                    </div>
                    <div className='text-left space-y-1'>
                      <p className='text-lg sm:text-xl text-foreground tracking-tight'>
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
                      href={`tel:${phone}`}
                      className='flex items-center px-4 justify-center h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-mono text-base md:text-lg font-medium transition-colors border border-transparent hover:border-border gap-2'
                    >
                      <span className='shrink-0'>📞</span> <span className='truncate'>{phone}</span>
                    </a>
                    <a
                      href={`mailto:${email}`}
                      className='flex items-center px-4 justify-center h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-mono text-base md:text-lg font-medium transition-colors border border-transparent hover:border-border gap-2'
                    >
                      <span className='shrink-0'>✉️</span> <span className='truncate'>{email}</span>
                    </a>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value='food'
              className='bg-card dark:border-white/10 dark:bg-white/5 border-border data-[state=open]:border-green-500/50 data-[state=open]:bg-green-500/10 rounded-xl border transition-all duration-300 px-5 group'
            >
              <AccordionTrigger className='hover:no-underline py-5 px-0'>
                <div className='flex flex-1 flex-wrap items-center justify-between gap-4 pr-4'>
                  <div className='flex items-center gap-3 sm:gap-5'>
                    <div className='p-2 sm:p-3 rounded-xl transition-colors bg-green-500/10 group-data-[state=open]:bg-green-500/20 group-hover:bg-green-500/20'>
                      <LeafyGreen className='size-5 sm:size-7 text-green-600 dark:text-green-400' />
                    </div>
                    <div className='text-left space-y-1'>
                      <p className='text-lg sm:text-xl text-foreground tracking-tight'>
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
                      href={`tel:${phone}`}
                      className='flex items-center px-4 justify-center h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-mono text-base md:text-lg font-medium transition-colors border border-transparent hover:border-border gap-2'
                    >
                      <span className='shrink-0'>📞</span> <span className='truncate'>{phone}</span>
                    </a>
                    <a
                      href={`mailto:${email}`}
                      className='flex items-center px-4 justify-center h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-mono text-base md:text-lg font-medium transition-colors border border-transparent hover:border-border gap-2'
                    >
                      <span className='shrink-0'>✉️</span> <span className='truncate'>{email}</span>
                    </a>
                  </div>
                </div>
               </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value='logistics'
              className='bg-card dark:border-white/10 dark:bg-white/5 border-border data-[state=open]:border-blue-500/50 data-[state=open]:bg-blue-500/10 rounded-xl border transition-all duration-300 px-5 group'
            >
              <AccordionTrigger className='hover:no-underline py-5 px-0'>
                <div className='flex flex-1 flex-wrap items-center justify-between gap-4 pr-4'>
                  <div className='flex items-center gap-3 sm:gap-5'>
                    <div className='p-2 sm:p-3 rounded-xl transition-colors bg-blue-500/10 group-data-[state=open]:bg-blue-500/20 group-hover:bg-blue-500/20'>
                      <Smartphone className='size-5 sm:size-7 text-blue-600 dark:text-blue-400' />
                    </div>
                    <div className='text-left space-y-1'>
                      <p className='text-lg sm:text-xl text-foreground tracking-tight'>
                        Logistics & Equipment
                      </p>
                      <p className='text-[13px] font-opensans font-medium text-muted-foreground uppercase tracking-wider'>
                        Tents, Chairs, Lighting
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className='pt-0 pb-5'>
                <div className='pt-5 border-t border-border'>
                  <p className='text-[15px] font-opensans text-muted-foreground mb-5 text-center leading-relaxed'>
                    To provide{" "}
                    <strong className='text-foreground font-semibold'>
                      Logistics Support or Equipment
                    </strong>
                    , please coordinate with our operations team:
                  </p>
                  <div className='flex flex-col gap-3'>
                    <a
                      href={`tel:${phone}`}
                      className='flex items-center px-4 justify-center h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-mono text-base md:text-lg font-medium transition-colors border border-transparent hover:border-border gap-2'
                    >
                      <span className='shrink-0'>📞</span> <span className='truncate'>{phone}</span>
                    </a>
                    <a
                      href={`mailto:${email}`}
                      className='flex items-center px-4 justify-center h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-mono text-base md:text-lg font-medium transition-colors border border-transparent hover:border-border gap-2'
                    >
                      <span className='shrink-0'>✉️</span> <span className='truncate'>{email}</span>
                    </a>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
      <p className='mt-8 text-center text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]'>
        Thank you for your generosity in this 25th year of grace
      </p>
    </div>
  );
}
