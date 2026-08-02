import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog & Devotionals — Reflections from the Altar",
  description:
    "Read daily devotionals, teachings, and spiritual reflections from The Non-Stop Series™ 144-hour worship convocation.",
  alternates: { canonical: "https://thenonstop.org/blog" },
};

export default function BlogPage() {
  const samplePosts = [
    {
      title: "Recovering the Altar of David",
      category: "Devotional",
      date: "Day 1 Reflection",
      excerpt: "Why Davidic worship removes every veil and opens continuous access to God's manifested presence.",
    },
    {
      title: "The Mystery of the Night Watch",
      category: "Teaching",
      date: "Day 3 Reflection",
      excerpt: "Understanding the spiritual power of standing before the Lord during the midnight and early morning hours.",
    },
    {
      title: "Why 144 Hours? Scriptural Completion",
      category: "Vision",
      date: "Day 5 Reflection",
      excerpt: "Exploring the numerology of 24 elders, 120 priests, and 144 hours of unbroken ministry.",
    },
  ];

  return (
    <main className="min-h-screen w-full relative pt-24 pb-16 bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold uppercase tracking-widest">
            <BookOpen className="h-3.5 w-3.5" /> Daily Insights
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">
            Blog &amp; Devotionals
          </h1>
          <p className="text-xl text-amber-500 font-serif italic">
            Reflections from the Altar
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Stay nourished with daily devotionals, key scriptural revelations, teaching summaries, and testimonies recorded throughout the 144-hour series.
          </p>
        </div>

        {/* Featured Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {samplePosts.map((post) => (
            <div key={post.title} className="p-6 rounded-2xl bg-muted/30 border border-border/60 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-500 font-bold uppercase tracking-wider">{post.category}</span>
                  <span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                </div>
                <h2 className="text-xl font-semibold leading-snug">{post.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
              </div>
              <div className="pt-2">
                <Button variant="ghost" size="sm" className="p-0 text-amber-500 hover:text-amber-600 font-semibold gap-1">
                  Read Reflection <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
