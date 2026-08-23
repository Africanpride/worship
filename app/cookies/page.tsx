/* eslint-disable react/no-unescaped-entities */

import { email, phone } from "@/config/site";

export default function CookiesPolicy() {
	return (
		<>
			<div className="max-w-5xl mx-auto md:p-16 space-y-6">
				<h1 className="text-3xl mb-4">Cookies Policy</h1>

				<section className="">
					<h2 className="text-2xl mb-2">Introduction</h2>
					<p>
						This Cookies Policy explains how The Non-Stop Series ("we", "us", or
						"our") uses cookies and similar technologies when you visit our
						website. This policy provides information about what these
						technologies are, why we use them, and your rights to control our
						use of them.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl mb-2">What Are Cookies?</h2>
					<p>
						Cookies are small data files that are placed on your computer or
						mobile device when you visit a website. Cookies are widely used by
						website owners in order to make their websites work, or to work more
						efficiently, as well as to provide reporting information.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl mb-2">How We Use Cookies</h2>
					<p className="mb-2">
						We use first-party and third-party cookies for several reasons. Some
						cookies are required for technical reasons in order for our website
						to operate, and we refer to these as "essential" or "strictly
						necessary" cookies. Other cookies also enable us to track and target
						the interests of our users to enhance the experience on our website.
					</p>
					<ul className="list-disc list-inside space-y-3 indent-[2%] mt-4">
						<li>
							<strong>Essential Cookies</strong>: These cookies are strictly
							necessary to provide you with services available through our
							website and to use some of its features, such as access to secure
							areas or handling video streaming playback.
						</li>
						<li>
							<strong>Performance and Functionality Cookies</strong>: These
							cookies are used to enhance the performance and functionality of
							our website but are non-essential to their use. However, without
							these cookies, certain functionality (like videos) may become
							unavailable.
						</li>
						<li>
							<strong>Analytics and Customization Cookies</strong>: These
							cookies collect information that is used either in aggregate form
							to help us understand how our website is being used or how
							effective our marketing campaigns are, or to help us customize our
							website for you.
						</li>
					</ul>
				</section>

				<section className="">
					<h2 className="text-2xl mb-2">Third-Party Technologies</h2>
					<p>
						In addition to our own cookies, we may also use various third-party
						cookies to report usage statistics, deliver video streams
						effectively (e.g., Mux, YouTube), and authenticate users securely.
						These third parties may use cookies alone or in conjunction with web
						beacons or other tracking technologies to collect information about
						you when you use our website.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl mb-2">Your Choices Regarding Cookies</h2>
					<p>
						You have the right to decide whether to accept or reject cookies.
						You can set or amend your web browser controls to accept or refuse
						cookies. If you choose to reject cookies, you may still use our
						website though your access to some functionality and areas of our
						website might be restricted or degraded.
					</p>
					<p className="mt-2">
						To learn how to manage cookies on popular browsers, please visit the
						browser developer's official support websites.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl mb-2">Updates to This Policy</h2>
					<p>
						We may update this Cookies Policy from time to time in order to
						reflect, for example, changes to the cookies we use or for other
						operational, legal, or regulatory reasons. Please revisit this
						Cookies Policy regularly to stay informed about our use of cookies
						and related technologies.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl mb-2">Contact Us</h2>
					<p>
						If you have any questions about our use of cookies or other
						technologies, please contact us at:
					</p>
					<p className="mt-2">
						The Non-Stop Series
						<br />
						C/O Logos-Rhema Foundation, Behind Trade Fair, La. Accra. <br />
						Email: {email} <br />
						Phone: {phone}
					</p>
				</section>

				<footer className=" mt-6">
					<p className="text-muted-foreground">Effective Date: 31/03/2026</p>
				</footer>
			</div>
		</>
	);
}
