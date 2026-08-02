import React from "react";
import CTASection from "./cta-section";
import { FooterComponent } from "./footer-main";
import { Button } from "./ui/button";
import { Marquee } from "./ui/marquee";
import { Separator } from "./ui/separator";

const footer = () => {
	return (
		<>
			{/* <Separator className='my-5 mb-8' /> */}
			<CTASection />
			<FooterComponent />
		</>
	);
};

export default footer;
