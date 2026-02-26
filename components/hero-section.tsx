'use client';

import { useState } from 'react';

export default function HeroSection() {
  const [heading, setHeading] = useState('Discover Something Amazing');
  const [subheading, setSubheading] = useState('Premium experiences crafted for excellence');
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [isEditingSubheading, setIsEditingSubheading] = useState(false);

  return (
    <section className="relative w-full h-dvh overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        preload="metadata"
      >
        <source
          src="https://videos.pexels.com/video-files/8954233/8954233-hd_1920_1080_30fps.mp4"
          type="video/mp4"
        />
        {/* Fallback for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Editable Heading */}
          <div
            className="cursor-pointer group"
            onClick={() => setIsEditingHeading(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsEditingHeading(true);
              }
            }}
            aria-label="Click to edit heading"
          >
            {isEditingHeading ? (
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                onBlur={() => setIsEditingHeading(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingHeading(false);
                  }
                }}
                autoFocus
                className="w-full bg-transparent text-4xl sm:text-5xl lg:text-6xl font-bold text-white outline-none border-b-2 border-white/50 text-center pb-2 leading-tight"
                aria-label="Edit heading text"
              />
            ) : (
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-balance leading-tight group-hover:text-white/90 transition-colors">
                {heading}
              </h1>
            )}
          </div>

          {/* Editable Subheading */}
          <div
            className="cursor-pointer group"
            onClick={() => setIsEditingSubheading(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsEditingSubheading(true);
              }
            }}
            aria-label="Click to edit subheading"
          >
            {isEditingSubheading ? (
              <input
                type="text"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                onBlur={() => setIsEditingSubheading(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingSubheading(false);
                  }
                }}
                autoFocus
                className="w-full bg-transparent text-lg sm:text-xl lg:text-2xl text-white/90 outline-none border-b-2 border-white/30 text-center pb-2"
                aria-label="Edit subheading text"
              />
            ) : (
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 text-balance group-hover:text-white transition-colors">
                {subheading}
              </p>
            )}
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              className="px-8 py-3 sm:px-10 sm:py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
              aria-label="Get started button"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Accessibility skip link hint */}
      <div className="sr-only">
        Hero section with video background. Main heading and subheading are editable. Press Enter or Space to edit, then click outside or press Enter to save changes.
      </div>
    </section>
  );
}
