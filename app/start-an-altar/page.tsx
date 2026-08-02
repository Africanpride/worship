import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Flame, Globe, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Start an Altar — Establish Continuous Worship",
  description:
    "Learn how to establish a continuous worship altar in your home, church, campus, or city. Join a global network of unbroken praise.",
  alternates: { canonical: "https://thenonstop.org/start-an-altar" },
};

export default function StartAnAltarPage() {
  const steps = [
    { number: "01", title: "Gather the Watchmen", desc: "Unite worshippers, psalmists, intercessors, and readers in your community." },
    { number: "02", title: "Establish the Schedule", desc: "Divide 24 hours (or multi-day periods) into manageable 1 to 2 hour worship watches." },
    { number: "03", title: "Focus on Presence", desc: "Remove veils and distractions; center every watch on praise, prayer, and scripture." },
    { number: "04", title: "Connect to the Global Altar", desc: "Register your altar with The Non-Stop Series network for prayer backing and resources." },
  ];

  return (
    <main className="min-h-screen w-full relative pt-24 pb-16 bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold uppercase tracking-widest">
            <Flame className="h-3.5 w-3.5" /> Multiply the Fire
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">
            Start an Altar
          </h1>
          <p className="text-xl text-amber-500 font-serif italic">
            Continuous Worship in Every City &amp; Nation
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The vision of The Non-Stop Series extends beyond one annual gathering. Our desire is to inspire homes, churches, campuses, and communities to establish their own altars of continuous worship until the sound of heaven fills the earth.
          </p>
        </div>

        {/* 4 Step Guide */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">How to Start a Local Altar</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="p-6 rounded-2xl bg-muted/30 border border-border/60 space-y-3 relative overflow-hidden">
                <span className="font-mono text-4xl font-bold text-amber-500/20 block">{step.number}</span>
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Altar Registration Callout */}
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 border border-white/10 text-center space-y-6 max-w-3xl mx-auto">
          <Globe className="h-10 w-10 text-amber-400 mx-auto" />
          <h2 className="text-3xl font-semibold">Register Your Local Altar</h2>
          <p className="text-neutral-300 text-sm leading-relaxed max-w-lg mx-auto">
            Whether starting a 24-hour watch or a weekly continuous prayer room, register your altar with Logos-Rhema Foundation to receive guidance, devotionals, and live stream connection.
          </p>
          <div className="pt-2">
            <Button asChild size="lg" className="rounded-full bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/contact">Register Your Altar</Link>
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
