import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Music, Radio, Disc, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Music & Worship — Ministering Unto the Lord",
  description:
    "Discover the Davidic worship expression of The Non-Stop Series™. 144 hours of unbroken praise, prophetic songs, and presence-centered worship.",
  alternates: { canonical: "https://thenonstop.org/music-and-worship" },
};

export default function MusicAndWorshipPage() {
  const expressions = [
    { title: "Corporate Praise", desc: "Joyous, triumphant celebrations of God's goodness and victory." },
    { title: "Deep Worship & Adoration", desc: "Intimate, reverence-filled ministry directly before the Ark." },
    { title: "Prophetic & Spontaneous Songs", desc: "Spirit-inspired melodies and fresh songs of the Lord." },
    { title: "Scripture Songs & Psalms", desc: "Singing the word of God back to the Father." },
    { title: "Instrumental Soaking", desc: "Continuous musical ministry creating a peaceful, anointed atmosphere." },
    { title: "Sounds from the Nations", desc: "Indigenous praise expressions from ministers across Africa and global nations." },
  ];

  return (
    <main className="min-h-screen w-full relative pt-24 pb-16 bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold uppercase tracking-widest">
            <Music className="h-3.5 w-3.5" /> Unbroken Sound
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">
            Music &amp; Worship
          </h1>
          <p className="text-xl text-amber-500 font-serif italic">
            Ministering Unto the Lord
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            At the heart of the 144 Hours Non-Stop Series is continuous worship. Music is not treated merely as performance or entertainment, but as sacred ministry before the presence of God — a continuous offering ascending unto Him day and night.
          </p>
          <blockquote className="p-4 rounded-xl bg-muted/40 border-l-4 border-amber-500 text-sm italic text-muted-foreground text-left">
            "David and the leaders of the army set apart for the ministry some of the sons of Asaph, Heman, and Jeduthun, who were to prophesy with lyres, harps and cymbals." — 1 Chronicles 25:1
          </blockquote>
        </div>

        {/* Davidic Worship Culture */}
        <div className="bg-muted/30 p-8 sm:p-12 rounded-3xl border border-border/50 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-mono text-amber-500 font-bold uppercase tracking-widest">Pattern &amp; Spirit</span>
            <h2 className="text-3xl font-semibold">A Davidic Worship Expression</h2>
            <p className="text-muted-foreground leading-relaxed">
              The worship culture of the Non-Stop Series is built around the presence of God rather than personalities. Every musician, singer, choir, and psalmists serves as part of a larger continuous ministry.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {expressions.map((exp) => (
              <div key={exp.title} className="p-6 rounded-2xl bg-background border border-border/60 space-y-2">
                <div className="h-2 w-2 rounded-full bg-amber-500 mb-2" />
                <h3 className="font-semibold text-lg">{exp.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sounds from the Nations */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-bold uppercase tracking-widest">
              <Globe className="h-4 w-4" /> Global Unity
            </div>
            <h2 className="text-3xl font-semibold">Sounds From the Nations</h2>
            <p className="text-muted-foreground leading-relaxed">
              Over the years, the Non-Stop Series has hosted ministers, choirs, instrumentalists, and worship leaders from Ghana, Nigeria, South Africa, Rwanda, Ethiopia, Benin, Namibia, Israel, Egypt, Ivory Coast, Bahamas, Switzerland, France, the United States, and beyond — blending diverse tongues and styles into one harmonious offering.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-neutral-900 text-white border border-white/10 space-y-4">
            <h3 className="text-2xl font-semibold">Worship Beyond Performance</h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              "The altar of worship is not built around personalities or performances. It is built around the presence of God. Whether through a single instrument, a choir anthem, a spontaneous melody, or a quiet moment of adoration, every sound becomes part of the unbroken worship rising before God."
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6 pt-6">
          <h2 className="text-3xl font-semibold">Experience the Worship Live</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/live">Listen Live</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/get-involved">Join as a Psalmist / Choir</Link>
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
