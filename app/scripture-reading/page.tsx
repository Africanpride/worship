import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Volume2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Scripture Reading — Unbroken Word of God",
  description:
    "Explore the public reading of Scripture during The Non-Stop Series™. 144 hours of uninterrupted biblical proclamation.",
  alternates: { canonical: "https://thenonstop.org/scripture-reading" },
};

export default function ScriptureReadingPage() {
  return (
    <main className="min-h-screen w-full relative pt-24 pb-16 bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold uppercase tracking-widest">
            <BookOpen className="h-3.5 w-3.5" /> Public Reading of Scripture
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">
            Scripture Reading Altar
          </h1>
          <p className="text-xl text-amber-500 font-serif italic">
            Saturating the Earth with the Word of God
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Along with continuous praise, worship, and prayer, the Non-Stop Series features the uninterrupted public reading of Scripture. For 144 hours, readers declare the Living Word over lives, communities, and nations.
          </p>
          <blockquote className="p-4 rounded-xl bg-muted/40 border-l-4 border-amber-500 text-sm italic text-muted-foreground text-left">
            "Until I come, devote yourself to the public reading of Scripture, to exhortation, to teaching." — 1 Timothy 4:13
          </blockquote>
        </div>

        {/* 3 Pillars of Scripture Reading */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
            <Volume2 className="h-6 w-6 text-amber-500" />
            <h3 className="font-semibold text-lg">Atmospheric Saturation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When the Word is spoken aloud day and night, it shifts spiritual atmospheres and cleanses minds.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
            <ShieldCheck className="h-6 w-6 text-amber-500" />
            <h3 className="font-semibold text-lg">Prophetic Proclamation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Declaring God's promises, covenants, and statutes over cities, rulers, and the body of Christ.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <h3 className="font-semibold text-lg">Corporate Engagement</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Believers from all backgrounds participate by taking turns reading passages in various translations &amp; languages.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 pt-6">
          <h2 className="text-3xl font-semibold">Become a Scripture Reader</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Lend your voice to declare the holy scriptures during the 144 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/get-involved">Sign Up to Read Scripture</Link>
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
