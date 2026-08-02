import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Clock, Shield, Sparkles, BookOpen, Music, Heart, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "The Watches — 144 Hours of Continuous Worship",
  description:
    "Explore the prophetic worship watches of The Non-Stop Series™. Step into your assigned watch for unbroken praise, prayer, and Bible reading.",
  alternates: { canonical: "https://thenonstop.org/watches" },
};

export default function WatchesPage() {
  const watchTypes = [
    {
      title: "Praise & Worship Watches",
      desc: "Psalmists, choirs, and instrumentalists leading continuous adoration before God's throne.",
      icon: <Music className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "Prayer & Intercession Watches",
      desc: "Watchmen standing on the walls, lifting prayers for revival, healing, families, and nations.",
      icon: <Shield className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "Scripture Reading Watches",
      desc: "Public proclamation of the holy Word of God without interruption day and night.",
      icon: <BookOpen className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "The Night & Midnight Watches",
      desc: "Consecrated midnight encounters, deep intercession, and standing in the gap while the world sleeps.",
      icon: <Flame className="h-6 w-6 text-amber-500" />,
    },
  ];

  return (
    <main className="min-h-screen w-full relative pt-24 pb-16 bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold uppercase tracking-widest">
            <Clock className="h-3.5 w-3.5" /> 144 Continuous Hours
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">
            The Prophetic Watches
          </h1>
          <p className="text-xl text-amber-500 font-serif italic">
            "The Fire Must Not Go Out"
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            For 144 continuous hours, the altar remains active before the Lord through unbroken praise, worship, prayer, and Bible reading. Structured around rotating prophetic worship watches, every period represents a sacred assignment to keep the sound of worship rising day and night.
          </p>
          <blockquote className="p-4 rounded-xl bg-muted/40 border-l-4 border-amber-500 text-sm italic text-muted-foreground text-left">
            "So he left Asaph and his brothers there before the ark of the covenant of the Lord to minister before the ark regularly, as every day's work required." — 1 Chronicles 16:37
          </blockquote>
        </div>

        {/* What Is A Watch */}
        <div className="grid md:grid-cols-2 gap-10 items-center bg-muted/20 p-8 sm:p-12 rounded-3xl border border-border/50">
          <div className="space-y-4">
            <span className="text-xs font-mono text-amber-500 font-bold uppercase tracking-widest">Sacred Assignment</span>
            <h2 className="text-3xl font-semibold">What Is a Watch?</h2>
            <p className="text-muted-foreground leading-relaxed">
              A watch is a dedicated period of continuous ministry unto the Lord. Just as King David appointed singers and ministers to serve before the Ark continually, each watch in the Non-Stop Series is carried collectively by worshippers, watchmen, and intercessors.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> A moment of deep personal &amp; corporate worship
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> A time of intense intercession for nations
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> Continuous public reading of Scripture
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {watchTypes.map((type) => (
              <div key={type.title} className="p-5 rounded-2xl bg-background border border-border/60 shadow-xs space-y-2">
                <div>{type.icon}</div>
                <h3 className="font-semibold text-base">{type.title}</h3>
                <p className="text-xs text-muted-foreground leading-normal">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Night Watches Highlight */}
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 border border-white/10 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl space-y-4">
            <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">Deep Consecration</span>
            <h2 className="text-3xl sm:text-4xl font-semibold">The Night Watches</h2>
            <p className="text-neutral-300 leading-relaxed">
              Throughout Scripture, the night watches were moments of intense spiritual alertness, divine encounters, and intercession. The midnight and early morning watches become powerful moments of consecration — standing in the gap for families, cities, and generations while the world sleeps.
            </p>
            <p className="text-sm italic text-amber-300">
              "I have set watchmen on your walls, O Jerusalem; they shall never hold their peace day or night." — Isaiah 62:6
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6 py-8">
          <h2 className="text-3xl font-semibold">Take Your Place on the Altar</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Whether as a worshipper, intercessor, musician, choir member, or scripture reader, your voice matters in keeping the continuous sound ascending.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/get-involved">Take Your Watch</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/live">Watch Live Stream</Link>
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
