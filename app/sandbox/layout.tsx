import type React from "react";

const layouts = ({ children }: { children: React.ReactNode }) => {
	return <div className="px-2 py-18  mx-auto ">{children}</div>;
};

export default layouts;
