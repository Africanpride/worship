"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="en">
			<body
				style={{
					fontFamily: "system-ui, sans-serif",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					margin: 0,
					background: "#0a0a0a",
					color: "#fafafa",
				}}
			>
				<div style={{ textAlign: "center", padding: 24 }}>
					<h1 style={{ fontSize: 20, fontWeight: 500 }}>The NonStop Series</h1>
					<p style={{ color: "#a1a1aa", fontSize: 14, marginTop: 8 }}>
						A critical error occurred. Please try again.
					</p>
					{error.digest && (
						<p style={{ color: "#52525b", fontSize: 10, marginTop: 8 }}>
							ref: {error.digest}
						</p>
					)}
					<button
						onClick={reset}
						style={{
							marginTop: 20,
							padding: "10px 24px",
							borderRadius: 9999,
							border: "none",
							cursor: "pointer",
							background: "#fafafa",
							color: "#18181b",
							fontWeight: 600,
						}}
					>
						Try again
					</button>
				</div>
			</body>
		</html>
	);
}
