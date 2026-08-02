import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Shield, Heart, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Prayer Wall — Standing in the Gap",
  description:
    "Submit your prayer requests and stand in agreement with intercessors across nations during 144 continuous hours of unbroken prayer.",
  alternates: { canonical: "https://thenonstop.org/prayer-wall" },
};

export default function PrayerWallPage() {
  const prayerFoci = [
    { title: "National Revival & Peace", desc: "Interceding for righteous governance, spiritual awakening, and peace across continents." },
    { title: "Families & Youth Restoration", desc: "Praying for broken homes, healing of relationships, and empowering the next generation." },
    { title: "Healing & Deliverance", desc: "Standing in faith for miraculous physical, emotional, and spiritual restoration." },
    { title: "The Global Church & Unity", desc: "Uniting the body of Christ in truth, holiness, and apostolic power." },
  ];

  return (
    <main className="min-h-screen w-full relative pt-24 pb-16 bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold uppercase tracking-widest">
            <Shield className="h-3.5 w-3.5" /> 24/7 Intercession
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">
            The Prayer Wall
          </h1>
          <p className="text-xl text-amber-500 font-serif italic">
            Standing in the Gap Day &amp; Night
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Throughout the 144 hours of The Non-Stop Series, dedicated watchmen and intercessors stand before the Lord without ceasing. Submit your prayer requests and agree with thousands of believers around the world.
          </p>
          <blockquote className="p-4 rounded-xl bg-muted/40 border-l-4 border-amber-500 text-sm italic text-muted-foreground text-left">
            "For My house shall be called a house of prayer for all nations." — Isaiah 56:7
          </blockquote>
        </div>

        {/* Prayer Focus Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold">Current Prayer Focuses</h2>
            <p className="text-muted-foreground text-sm">Key intercessory mandates active throughout the 144 hours.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {prayerFoci.map((focus) => (
              <div key={focus.title} className="p-6 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                  <h3 className="font-semibold text-lg">{focus.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-8">{focus.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Request Box */}
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 border border-white/10 space-y-6 max-w-3xl mx-auto text-center">
          <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400 mb-2">
            <Send className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-semibold">Submit a Prayer Request</h2>
          <p className="text-neutral-300 text-sm leading-relaxed max-w-lg mx-auto">
            Our intercessory teams pray over every submitted request during the continuous watches. You can also share praise reports and testimonies.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/contact">Submit Prayer Request</Link>
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
