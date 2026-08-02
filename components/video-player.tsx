import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

type Player = (typeof videojs.players)[string];

interface VideoPlayerProps {
	url: string;
	isLive?: boolean;
	playing?: boolean;
	controls?: boolean;
	thumbnail?: string | null;
}

export function VideoPlayer({
	url,
	isLive = false,
	playing = false,
	controls = true,
	thumbnail,
}: VideoPlayerProps) {
	const videoRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<Player | null>(null);
	const [isReady, setIsReady] = useState(false);

	const isYouTube =
		url && (url.includes("youtube.com") || url.includes("youtu.be"));

	let ytVideoId = "";
	if (isYouTube) {
		const match = url.match(
			/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/))([\w-]{11})/,
		);
		if (match && match[1]) {
			ytVideoId = match[1];
		}
	}

	useEffect(() => {
		if (isYouTube) return; // Video.js is not needed for YouTube

		// Make sure Video.js player is only initialized once

		if (!playerRef.current) {
			// The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
			const videoElement = document.createElement("video-js");
			videoElement.classList.add("vjs-big-play-centered");
			videoRef.current?.appendChild(videoElement);

			const player = (playerRef.current = videojs(
				videoElement,
				{
					autoplay: playing,
					controls: controls,
					responsive: true,
					fluid: true, // Scales the player to fit the container
					sources: [
						{
							src: url,
							type: url.endsWith(".m3u8")
								? "application/x-mpegURL"
								: "video/mp4",
						},
					],
					poster: thumbnail || undefined,
				},
				() => {
					videojs.log("player is ready");
					setIsReady(true);
				},
			));

			// You could update an existing player in the `else` block here
			// on prop change, for example:
		} else {
			const player = playerRef.current;
			player.autoplay(playing);
			player.src({
				src: url,
				type: url.endsWith(".m3u8") ? "application/x-mpegURL" : "video/mp4",
			});
			if (thumbnail) player.poster(thumbnail);
		}
	}, [url, playing, controls, thumbnail]);

	// Dispose the Video.js player when the functional component unmounts
	useEffect(() => {
		const player = playerRef.current;

		return () => {
			if (player && !player.isDisposed()) {
				player.dispose();
				playerRef.current = null;
			}
		};
	}, [playerRef]);

	if (isYouTube) {
		return (
			<div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
				{isLive && (
					<div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-sm font-semibold tracking-wider backdrop-blur-sm shadow-xl">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
						</span>
						LIVE
					</div>
				)}
				{ytVideoId ? (
					<iframe
						src={`https://www.youtube.com/embed/${ytVideoId}?autoplay=${playing ? 1 : 0}&controls=${controls ? 1 : 0}&rel=0`}
						className="w-full h-full border-0 absolute inset-0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-neutral-500">
						Invalid YouTube URL
					</div>
				)}
			</div>
		);
	}

	return (
		<div
			className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
			data-vjs-player
		>
			{isLive && (
				<div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-sm font-semibold tracking-wider backdrop-blur-sm shadow-xl">
					<span className="relative flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
						<span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
					</span>
					LIVE
				</div>
			)}
			<div ref={videoRef} className="w-full h-full" />
		</div>
	);
}
