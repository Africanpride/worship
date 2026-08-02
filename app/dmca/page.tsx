/* eslint-disable react/no-unescaped-entities */

import { email, phone } from "@/config/site";

export default function DMCAPolicy() {
	return (
		<>
			<div className="max-w-5xl mx-auto md:p-16 space-y-6">
				<h1 className="text-3xl mb-4">
					DMCA Policy for The Non-Stop Series Website
				</h1>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						Digital Millennium Copyright Act
					</h2>
					<p>
						The Non-Stop Series respects the intellectual property rights of
						others and expects its users to do the same. In accordance with the
						Digital Millennium Copyright Act (DMCA), we will respond
						expeditiously to claims of copyright infringement committed using
						our website that are reported to our Designated Copyright Agent,
						identified in the sample notice below.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						Reporting Copyright Infringement
					</h2>
					<p>
						If you are a copyright owner, or are authorized to act on behalf of
						one, or authorized to act under any exclusive right under copyright,
						please report alleged copyright infringements taking place on or
						through the Site by completing the following DMCA Notice of Alleged
						Infringement and delivering it to our Designated Copyright Agent.
					</p>
					<p className="mt-4">
						Upon receipt of the Notice as described below, we will take whatever
						action, in our sole discretion, it deems appropriate, including
						removal of the challenged material from the Site.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						DMCA Notice of Alleged Infringement ("Notice")
					</h2>
					<ul className="list-decimal list-inside space-y-3 indent-[2%]">
						<li>
							Identify the copyrighted work that you claim has been infringed.
						</li>
						<li>
							Identify the material that you claim is infringing (or to be the
							subject of infringing activity) and that is to be removed or
							access to which is to be disabled, and information reasonably
							sufficient to permit us to locate the material, including at a
							minimum, the URL of the link shown on the Site where such material
							may be found.
						</li>
						<li>
							Provide your mailing address, telephone number, and, if available,
							email address.
						</li>
						<li>
							Include both of the following statements in the body of the
							Notice:
							<ul className="list-disc list-inside ml-6 mt-2">
								<li>
									"I hereby state that I have a good faith belief that the
									disputed use of the copyrighted material is not authorized by
									the copyright owner, its agent, or the law (e.g., as a fair
									use)."
								</li>
								<li>
									"I hereby state that the information in this Notice is
									accurate and, under penalty of perjury, that I am the owner,
									or authorized to act on behalf of the owner, of the copyright
									or of an exclusive right under the copyright that is allegedly
									infringed."
								</li>
							</ul>
						</li>
						<li>
							Provide your full legal name and your electronic or physical
							signature.
						</li>
					</ul>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						Counter-Notice Procedure
					</h2>
					<p>
						If you receive a notification that material you posted on the Site
						has been removed due to a claim of copyright infringement, you may
						send us a counter-notification containing the following details:
					</p>
					<ul className="list-disc list-inside space-y-3 indent-[2%] mt-4">
						<li>Your physical or electronic signature.</li>
						<li>
							Identification of the material that has been removed or to which
							access has been disabled and the location at which the material
							appeared before it was removed or disabled.
						</li>
						<li>
							A statement under penalty of perjury that you have a good faith
							belief that the material was removed or disabled as a result of
							mistake or misidentification of the material to be removed or
							disabled.
						</li>
						<li>
							Your name, address, and telephone number, and a statement that you
							consent to the jurisdiction of the Federal District Court for the
							judicial district in which the address is located, or if your
							address is outside of the United States, for any judicial district
							in which the service provider may be found, and that you will
							accept service of process from the person who provided
							notification of infringement or an agent of such person.
						</li>
					</ul>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						Designated Copyright Agent
					</h2>
					<p>
						Deliver this Notice, with all items completed, to our Designated
						Copyright Agent:
					</p>
					<p className="mt-2 font-medium">
						DMCA Agent
						<br />
						The Non-Stop Series
						<br />
						C/O Logos-Rhema Foundation, Behind Trade Fair, La. Accra.
						<br />
						Email: {email}
						<br />
						Phone: {phone}
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						Repeat Infringer Policy
					</h2>
					<p>
						The Non-Stop Series reserves the right to terminate users who are
						found to be repeat infringers.
					</p>
				</section>

				<footer className="mt-6">
					<p className="text-gray-600">
						Effective Date: {new Date().toLocaleDateString("en-GB")}
					</p>
				</footer>
			</div>
		</>
	);
}
