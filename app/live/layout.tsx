import type React from "react";

const layouts = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="px-2 sm:px-4 md:px-6 pt-20 container max-w-(--breakpoint-xl) mx-auto ">
			{children}
		</div>
	);
};

export default layouts;
