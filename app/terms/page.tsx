/* eslint-disable react/no-unescaped-entities */

import { email, phone } from "@/config/site";

export default function TermsOfService() {
	return (
		<>
			<div className="max-w-5xl mx-auto  md:p-16   space-y-6">
				<h1 className="text-3xl mb-4">
					Terms of Service for The Non-Stop Series Website
				</h1>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">Introduction</h2>
					<p>
						Welcome to the The Non-Stop Series website. By accessing or using
						our website and services, you agree to comply with and be bound by
						the following terms and conditions. Please review these terms
						carefully. If you do not agree with these terms, you should not use
						our website or services.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">Use of the Website</h2>
					<ul className="list-disc list-inside space-y-3 indent-[2%]">
						<li>
							<strong>Eligibility</strong>: You must be at least 18 years old to
							use our website and services.
						</li>
						<li>
							<strong>Compliance</strong>: You agree to use our website in
							compliance with all applicable laws and regulations.
						</li>
						<li>
							<strong>Account Responsibility</strong>: If you create an account,
							you are responsible for maintaining the confidentiality of your
							account information and for all activities that occur under your
							account.
						</li>
						<li>
							<strong>Prohibited Conduct</strong>: You agree not to engage in
							any activity that may interfere with or disrupt the website or its
							services.
						</li>
					</ul>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">Intellectual Property</h2>
					<p>
						All content on the The Non-Stop Series website, including text,
						graphics, logos, and images, is the property of The Non-Stop Series
						or its content suppliers and is protected by international copyright
						laws. You may not reproduce, distribute, or create derivative works
						from any content without prior written consent from The Strategic
						Voter.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">User Contributions</h2>
					<p>
						The Non-Stop Series may allow users to submit content, such as
						comments and posts. By submitting content, you grant The Strategic
						Voter a non-exclusive, royalty-free, perpetual, and worldwide
						license to use, reproduce, modify, and distribute your content in
						any media. You represent that you own or have the necessary rights
						to your submitted content.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						Disclaimers and Limitation of Liability
					</h2>
					<ul className="list-disc list-inside space-y-3 indent-[2%]">
						<li>
							<strong>Disclaimer of Warranties</strong>: The Non-Stop Series
							provides the website and services "as is" without any warranties,
							express or implied. The Non-Stop Series does not guarantee the
							accuracy or completeness of any information on the website.
						</li>
						<li>
							<strong>Limitation of Liability</strong>: The Non-Stop Series will
							not be liable for any indirect, incidental, special, or
							consequential damages arising from the use of or inability to use
							the website or services.
						</li>
					</ul>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">Governing Law</h2>
					<p>
						These Terms of Service are governed by and construed in accordance
						with the laws of Ghana. Any disputes arising from or related to
						these terms will be subject to the exclusive jurisdiction of the
						courts in Ghana.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						Changes to Terms of Service
					</h2>
					<p>
						The Non-Stop Series reserves the right to update or modify these
						Terms of Service at any time without prior notice. Your continued
						use of the website and services after any changes constitutes your
						acceptance of the new terms.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
					<p>
						If you have any questions or concerns about these Terms of Service,
						please contact us at:
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
					<p className="text-gray-600">Effective Date: 03/06/2026</p>
				</footer>
			</div>
		</>
	);
}
