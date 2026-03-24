"use client";

import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroHeadline from "./hero-headline";
import { createFetch } from "@better-fetch/fetch";
import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const $fetch = createFetch({
  baseURL: "/api/settings",
});

export default function HeroSection() {
  const [heroSettings, setHeroSettings] = useState<{
    videoSource: "youtube" | "mux" | "local";
    videoId?: string;
    videoUrl?: string;
    startTime: number;
  } | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const muxPlayerRef = useRef<any>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await $fetch<any>("/hero");
        if (data) {
          setHeroSettings(data);
        } else {
          setHeroSettings({
            videoSource: "youtube",
            videoId: "bDk_nNbccnc",
            startTime: 108,
          });
        }
      } catch (error) {
        console.error("Failed to fetch hero settings:", error);
        setHeroSettings({
          videoSource: "youtube",
          videoId: "bDk_nNbccnc",
          startTime: 108,
        });
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!heroSettings || heroSettings.videoSource !== "youtube") return;

    // Load YouTube API script
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      if (iframeRef.current && window.YT && window.YT.Player) {
        new window.YT.Player(iframeRef.current, {
          events: {
            onReady: (event: any) => {
              setYtPlayer(event.target);
              // Ensure it starts muted as per background video norm
              event.target.mute();
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, [heroSettings]);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (heroSettings?.videoSource === "youtube" && ytPlayer) {
      if (newMuted) {
        ytPlayer.mute();
      } else {
        ytPlayer.unMute();
        ytPlayer.setVolume(100);
      }
    } else if (heroSettings?.videoSource === "local" && videoRef.current) {
      videoRef.current.muted = newMuted;
    } else if (heroSettings?.videoSource === "mux" && muxPlayerRef.current) {
      muxPlayerRef.current.muted = newMuted;
    }
  };

  if (!heroSettings) {
    return (
      <header className='relative w-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden'>
        <Loader2 className='h-8 w-8 animate-spin text-white/20' />
      </header>
    );
  }

  const { videoSource, videoId, videoUrl, startTime } = heroSettings;

  return (
    <header className='relative md:relative absolute top-0 left-0 w-full h-[100dvh] flex flex-col justify-center pb-10 overflow-hidden z-0 ' data-aos="fade-up"
     data-aos-anchor-placement="top-bottom">
      {/* Video Background Selection */}
      <div className='absolute inset-0 w-full h-full pointer-events-none overflow-hidden'>
        {videoSource === "youtube" && videoId && (
          <iframe
            key={videoId}
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&autohide=1&modestbranding=1&playlist=${videoId}&rel=0&enablejsapi=1&start=${startTime}&iv_load_policy=3&disablekb=1${origin ? `&origin=${origin}&widget_referrer=${origin}` : ""}`}
            className='absolute top-1/2 left-1/2 w-[150vw] h-[120vh] md:w-[150vw] md:h-[150vh] -translate-x-1/2 -translate-y-1/2 object-cover min-w-full min-h-full aspect-video'
            allow='autoplay; encrypted-media'
            title='Hero Video Background'
          />
        )}

        {videoSource === "mux" && videoUrl && (
          <MuxPlayer
            ref={muxPlayerRef}
            src={videoUrl}
            autoPlay
            muted
            loop


            className='absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover min-w-full min-h-full'
            stream-type='on-demand'
          />
        )}

        {videoSource === "local" && videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className='absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover min-w-full min-h-full'
          />
        )}
      </div>

      {/* Mute/Unmute Toggle */}
      <div className='absolute bottom-10 right-10 z-60'>
        <Button
          variant='outline'
          size='icon'
          onClick={toggleMute}
          className='rounded-full bg-black/20 backdrop-blur-md border-white/20 hover:bg-black text-white transition-all duration-300'
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className='h-5 w-5' />
          ) : (
            <Volume2 className='h-5 w-5' />
          )}
        </Button>
      </div>

      {/* Dark overlay for better text readability */}
      <div
        className='absolute inset-0 bg-black/40'
        aria-hidden='true'
      />

      <HeroHeadline className="z-50 px-4 md:px-16  xl:px-32 2xl:px-40 text-white" />
      {/* Content */}
      <div className='relative px-4 sm:px-6 lg:px-8 hidden'>
        <div className='mx-auto max-w-(--breakpoint-xl)'>
          <div className='max-w-5xl'>
            <h1 className='text-3xl text-zinc-100 sm:text-7xl dark:text-zinc-100 '>
              Recovery, Revival and the Restoration <br />
              of the Tabernacle of David
            </h1>
            <p className='mt-4 text-base text-zinc-200 dark:text-zinc-400 text-2xl'>
              Join us as we explore the profound truths of God's Word and
              experience His presence in a powerful way.
            </p>
            <div className='mt-6 flex gap-6'>
              <a
                className='group -m-1 p-1'
                aria-label='Follow on X'
                href='#'
              >
                <svg
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  className='h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300'
                >
                  <path d='M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.728L12.5962 11.6137L17.7652 19.0075H15.6438L11.4257 12.9742V12.9738Z' />
                </svg>
              </a>
              <a
                className='group -m-1 p-1'
                aria-label='Follow on Instagram'
                href='#'
              >
                <svg
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  className='h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300'
                >
                  <path d='M12 3c-2.444 0-2.75.01-3.71.054-.959.044-1.613.196-2.185.418A4.412 4.412 0 0 0 4.51 4.511c-.5.5-.809 1.002-1.039 1.594-.222.572-.374 1.226-.418 2.184C3.01 9.25 3 9.556 3 12s.01 2.75.054 3.71c.044.959.196 1.613.418 2.185.23.592.538 1.094 1.039 1.595.5.5 1.002.808 1.594 1.038.572.222 1.226.374 2.184.418C9.25 20.99 9.556 21 12 21s2.75-.01 3.71-.054c.959-.044 1.613-.196 2.185-.419a4.412 4.412 0 0 0 1.595-1.038c.5-.5.808-1.002 1.038-1.594.222-.572.374-1.226.418-2.184.044-.96.054-1.267.054-3.711s-.01-2.75-.054-3.71c-.044-.959-.196-1.613-.419-2.185A4.412 4.412 0 0 0 19.49 4.51c-.5-.5-1.002-.809-1.594-1.039-.572-.222-1.226-.374-2.184-.418C14.75 3.01 14.444 3 12 3Zm0 1.622c2.403 0 2.688.009 3.637.052.877.04 1.354.187 1.67.31.421.163.72.358 1.036.673.315.315.51.615.673 1.035.123.317.27.794.31 1.671.043.95.052 1.234.052 3.637s-.009 2.688-.052 3.637c-.04.877-.187 1.354-.31 1.67-.163.421-.358.72-.673 1.036a2.79 2.79 0 0 1-1.035.673c-.317.123-.794.27-1.671.31-.95.043-1.234.052-3.637.052s-2.688-.009-3.637-.052c-.877-.04-1.354-.187-1.67-.31a2.789 2.789 0 0 1-1.036-.673 2.79 2.79 0 0 1-.673-1.035c-.123-.317-.27-.794-.31-1.671-.043-.95-.052-1.234-.052-3.637s.009-2.688.052-3.637c.04-.877.187-1.354.31-1.67.163-.421.358-.72.673-1.036.315-.315.615-.51 1.035-.673.317-.123.794-.27 1.671-.31.95-.043 1.234-.052 3.637-.052Z' />
                  <path d='M12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-7.622a4.622 4.622 0 1 0 0 9.244 4.622 4.622 0 0 0 0-9.244Zm5.884-.182a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0Z' />
                </svg>
              </a>
              <a
                className='group -m-1 p-1'
                aria-label='Follow on GitHub'
                href='#'
              >
                <svg
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  className='h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12 2C6.475 2 2 6.588 2 12.253c0 4.537 2.862 8.369 6.838 9.727.5.09.687-.218.687-.487 0-.243-.013-1.05-.013-1.91C7 20.059 6.35 18.957 6.15 18.38c-.113-.295-.6-1.205-1.025-1.448-.35-.192-.85-.667-.013-.68.788-.012 1.35.744 1.538 1.051.9 1.551 2.338 1.116 2.912.846.088-.666.35-1.115.638-1.371-2.225-.256-4.55-1.14-4.55-5.062 0-1.115.387-2.038 1.025-2.756-.1-.256-.45-1.307.1-2.717 0 0 .837-.269 2.75 1.051.8-.23 1.65-.346 2.5-.346.85 0 1.7.115 2.5.346 1.912-1.333 2.75-1.05 2.75-1.05.55 1.409.2 2.46.1 2.716.637.718 1.025 1.628 1.025 2.756 0 3.934-2.337 4.806-4.562 5.062.362.32.675.936.675 1.897 0 1.371-.013 2.473-.013 2.82 0 .268.188.589.688.486a10.039 10.039 0 0 0 4.932-3.74A10.447 10.447 0 0 0 22 12.253C22 6.588 17.525 2 12 2Z'
                  />
                </svg>
              </a>
              <a
                className='group -m-1 p-1'
                aria-label='Follow on LinkedIn'
                href='#'
              >
                <svg
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  className='h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300'
                >
                  <path d='M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 01-1.548-1.549 1.548 1.548 0 111.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z' />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility skip link hint */}
      <div className='sr-only'>
        Hero section with video background. Main heading and subheading are
        editable. Press Enter or Space to edit, then click outside or press
        Enter to save changes.
      </div>
    </header>
  );
}
