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
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Gift, Heart, Info } from "lucide-react";

export function DonationDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-amber-500/20 bg-neutral-950 text-white p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 w-full" />
        
        <div className="p-6 pt-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-bebas tracking-wider flex items-center gap-2">
              <Heart className="text-amber-400 size-6 fill-amber-400" />
              Partner with the Fire
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-base">
              Your sacrifice sustains the 144-hour altar of worship. Choose your preferred way to give.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="cash" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-neutral-900 border border-white/5 mb-6">
              <TabsTrigger value="cash" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white uppercase font-bold text-[10px] tracking-widest">
                Cash Donation
              </TabsTrigger>
              <TabsTrigger value="kind" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white uppercase font-bold text-[10px] tracking-widest">
                In-Kind Sacrifice
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cash" className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {/* Mobile Money */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/50 transition-colors group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500/10 p-2 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                        <Smartphone className="size-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Mobile Money</p>
                        <p className="text-xs text-neutral-500">MTN, Vodafone, AirtelTigo</p>
                      </div>
                    </div>
                    <div className="text-xs font-bebas text-amber-400 bg-amber-400/10 px-2 py-1 rounded">GHANA</div>
                  </div>
                </div>

                {/* PayPal */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/50 transition-colors group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <svg className="size-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.729C5.01 3.312 5.39 3 5.82 3h8.344c3.153 0 5.03 1.545 4.69 4.306-.356 2.898-2.14 4.545-5.013 4.545h-1.928a.48.48 0 0 0-.464.385l-1.07 6.786a.48.48 0 0 1-.47.412h.016zM12.5 13.5c3.0 0 5.5-1.5 6.0-5.0.4-3.5-1.5-5.0-5.5-5.0H6.5L3.5 21h4.0l1.0-6.5h4.0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm">PayPal</p>
                        <p className="text-xs text-neutral-500">Global Payments</p>
                      </div>
                    </div>
                    <div className="text-xs font-bebas text-blue-400 bg-blue-400/10 px-2 py-1 rounded">GLOBAL</div>
                  </div>
                </div>

                {/* Credit Card */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/50 transition-colors group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                        <CreditCard className="size-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Credit / Debit Card</p>
                        <p className="text-xs text-neutral-500">Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                    <div className="text-xs font-bebas text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">SECURE</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="kind" className="space-y-4">
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-4">
                <div className="flex gap-3">
                  <Info className="size-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    We gratefully accept sacrifices in kind to support the hospitality and logistics of the Non-Stop.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/50 transition-colors text-center group cursor-pointer">
                  <div className="bg-white/5 p-3 rounded-full w-fit mx-auto mb-2 group-hover:bg-amber-500/10">
                    <Gift className="size-6 text-amber-400" />
                  </div>
                  <p className="font-bold text-sm">Livestock</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">Cows, Sheep, Goats</p>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/50 transition-colors text-center group cursor-pointer">
                  <div className="bg-white/5 p-3 rounded-full w-fit mx-auto mb-2 group-hover:bg-amber-500/10">
                    <Gift className="size-6 text-amber-400" />
                  </div>
                  <p className="font-bold text-sm">Food Supplies</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">Rice, Oil, Water</p>
                </div>
              </div>
              
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bebas text-lg h-12">
                Contact Logistics Team
              </Button>
            </TabsContent>
          </Tabs>

          <p className="mt-8 text-center text-[10px] text-neutral-600 uppercase tracking-[0.2em]">
            Thank you for your generosity
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
