"use client";

import { createFetch } from "@better-fetch/fetch";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import HeroHeadline from "./hero-headline";

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

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const { data } = await $fetch<any>("/hero");
				if (data) {
					setHeroSettings(data);
				} else {
					setHeroSettings({
						videoSource: "youtube",
						videoId: "w34sNb74sJs",
						startTime: 10,
					});
				}
			} catch (error) {
				console.error("Failed to fetch hero settings:", error);
				setHeroSettings({
					videoSource: "youtube",
					videoId: "w34sNb74sJs",
					startTime: 10,
				});
			}
		};
		fetchSettings();
	}, []);

	useEffect(() => {
		if (!heroSettings || heroSettings.videoSource !== "youtube") return;
	}, [heroSettings]);

	const toggleMute = () => {
		const newMuted = !isMuted;
		setIsMuted(newMuted);

		if (heroSettings?.videoSource === "youtube" && iframeRef.current) {
			try {
				if (newMuted) {
					iframeRef.current.contentWindow?.postMessage(
						JSON.stringify({ event: "command", func: "mute", args: [] }),
						"*",
					);
				} else {
					iframeRef.current.contentWindow?.postMessage(
						JSON.stringify({ event: "command", func: "unMute", args: [] }),
						"*",
					);
					iframeRef.current.contentWindow?.postMessage(
						JSON.stringify({
							event: "command",
							func: "setVolume",
							args: [100],
						}),
						"*",
					);
				}
			} catch (e) {
				console.error("Error setting YT player mute state:", e);
			}
		} else if (heroSettings?.videoSource === "local" && videoRef.current) {
			videoRef.current.muted = newMuted;
			if (!newMuted) videoRef.current.volume = 1;
		} else if (heroSettings?.videoSource === "mux" && muxPlayerRef.current) {
			muxPlayerRef.current.muted = newMuted;
			if (!newMuted) muxPlayerRef.current.volume = 1;
		}
	};

	if (!heroSettings) {
		return (
			<header className="relative w-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden">
				<Loader2 className="h-8 w-8 animate-spin text-white/20" />
			</header>
		);
	}

	const { videoSource, videoId, videoUrl, startTime } = heroSettings;
	const originUrl = typeof window !== "undefined" ? window.location.origin : "";

	return (
		<header
			className="relative bg-black top-0 left-0 w-full h-[100dvh] flex flex-col justify-center pb-10 overflow-hidden z-0 "
			data-aos="fade-up"
			data-aos-anchor-placement="top-bottom"
		>
			{/* Video Background Selection */}
			<div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden ">
				{videoSource === "youtube" && videoId && (
					<iframe
						key={videoId}
						ref={iframeRef}
						src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&autohide=1&modestbranding=1&playlist=${videoId}&rel=0&enablejsapi=1&start=${startTime}&iv_load_policy=3&disablekb=1${originUrl ? `&origin=${originUrl}&widget_referrer=${originUrl}` : ""}`}
						className="absolute top-1/2 left-1/2 w-[150vw] h-[120vh] md:w-[150vw] md:h-[150vh] -translate-x-1/2 -translate-y-1/2 object-cover min-w-full min-h-full aspect-video"
						allow="autoplay; encrypted-media"
						title="Hero Video Background"
					/>
				)}

				{videoSource === "mux" && videoUrl && (
					<MuxPlayer
						ref={muxPlayerRef}
						src={videoUrl}
						autoPlay
						muted={isMuted}
						loop
						className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover min-w-full min-h-full"
						stream-type="on-demand"
					/>
				)}

				{videoSource === "local" && videoUrl && (
					<video
						ref={videoRef}
						src={videoUrl}
						autoPlay
						muted={isMuted}
						loop
						playsInline
						className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover min-w-full min-h-full"
					/>
				)}
			</div>

			{/* Mute/Unmute Toggle */}
			<div className="absolute bottom-10 right-10 z-60">
				<Button
					variant="outline"
					size="icon"
					onClick={toggleMute}
					className="rounded-full bg-black/20 backdrop-blur-md border-white/20 hover:bg-black text-white transition-all duration-300 cursor-pointer"
					aria-label={isMuted ? "Unmute video" : "Mute video"}
				>
					{isMuted ? (
						<VolumeX className="h-5 w-5" />
					) : (
						<Volume2 className="h-5 w-5" />
					)}
				</Button>
			</div>

			{/* Dark overlay for better text readability */}
			<div className="absolute inset-0 bg-black/40" aria-hidden="true" />

			<HeroHeadline className="z-50 px-4 md:px-16  xl:px-32 2xl:px-40 text-white" />
			{/* Accessibility skip link hint */}
			<div className="sr-only">
				Hero section with video background. Main heading and subheading are
				editable. Press Enter or Space to edit, then click outside or press
				Enter to save changes.
			</div>
		</header>
	);
}
