import { email, phone } from "@/config/site";

export default function Privacy() {
	return (
		<>
			<div className="max-w-5xl mx-auto  md:p-16   space-y-6">
				<h1 className="text-3xl mb-4">Privacy Policy</h1>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">Introduction</h2>
					<p>
						The Non-Stop Series is committed to protecting the privacy and
						security of our members and visitors to our website. This Privacy
						Policy explains how we collect, use, and protect your personal
						information when you interact with us online and offline. By using
						our website or services, you consent to the terms of this Privacy
						Policy.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						Information We Collect
					</h2>
					<ul className="list-disc list-inside space-y-3 indent-[2%]">
						<li>
							<strong>Contact Information</strong>: Name, email address, phone
							number, and mailing address.
						</li>
						<li>
							<strong>Membership Information</strong>: Details provided during
							the membership application process, including professional
							background and areas of interest.
						</li>
						<li>
							<strong>Event Participation</strong>: Information related to your
							participation in our events, workshops, and activities.
						</li>
						<li>
							<strong>Donations</strong>: Information related to your donations,
							including payment details and donation history.
						</li>
						<li>
							<strong>Website Usage</strong>: Data collected through cookies and
							similar technologies to understand how you use our website and
							improve your experience.
						</li>
					</ul>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						How We Use Your Information
					</h2>
					<ul className="list-disc list-inside space-y-3 indent-[2%]">
						<li>
							<strong>Membership Management</strong>: To process membership
							applications, renewals, and provide member benefits.
						</li>
						<li>
							<strong>Communication</strong>: To send you updates, newsletters,
							and information about our events and services.
						</li>
						<li>
							<strong>Event Management</strong>: To organize and manage our
							events, workshops, and activities.
						</li>
						<li>
							<strong>Donations</strong>: To process and acknowledge donations,
							and to provide you with information about how your donations are
							used.
						</li>
						<li>
							<strong>Website Improvement</strong>: To analyze website usage and
							improve our online presence and services.
						</li>
						<li>
							<strong>Legal Compliance</strong>: To comply with legal
							obligations and protect our rights and interests.
						</li>
					</ul>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						How We Share Your Information
					</h2>
					<p>
						We do not sell or rent your personal information to third parties.
						We may share your information in the following circumstances:
					</p>
					<ul className="list-disc list-inside space-y-3 indent-[2%]">
						<li>
							<strong>Service Providers</strong>: With trusted third-party
							service providers who assist us in operating our website,
							conducting our business, or providing services to you, under
							strict confidentiality agreements.
						</li>
						<li>
							<strong>Legal Requirements</strong>: If required by law, we may
							disclose your information to comply with legal obligations or
							protect our rights.
						</li>
						<li>
							<strong>Event Partners</strong>: With partners and sponsors of our
							events for the purpose of organizing and managing events, provided
							you have given consent.
						</li>
					</ul>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">Data Security</h2>
					<p>
						We take the security of your personal information seriously. We
						implement appropriate technical and organizational measures to
						protect your data from unauthorized access, alteration, disclosure,
						or destruction.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
					<p>
						You have the following rights regarding your personal information:
					</p>
					<ul className="list-disc list-inside space-y-3 indent-[2%]">
						<li>
							<strong>Access</strong>: You can request access to the personal
							information we hold about you.
						</li>
						<li>
							<strong>Correction</strong>: You can request correction of
							inaccurate or incomplete personal information.
						</li>
						<li>
							<strong>Deletion</strong>: You can request the deletion of your
							personal information, subject to legal requirements.
						</li>
						<li>
							<strong>Objection</strong>: You can object to the processing of
							your personal information under certain circumstances.
						</li>
						<li>
							<strong>Data Portability</strong>: You can request a copy of your
							personal information in a structured, commonly used, and
							machine-readable format.
						</li>
					</ul>
					<p>
						To exercise these rights, please contact us using the contact
						information provided below.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						Cookies and Tracking Technologies
					</h2>
					<p>
						Our website uses cookies and similar tracking technologies to
						enhance your experience. You can manage your cookie preferences
						through your browser settings. For more information, please refer to
						our Cookie Policy.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">
						Changes to This Privacy Policy
					</h2>
					<p>
						We may update this Privacy Policy from time to time. We will notify
						you of any significant changes by posting the new Privacy Policy on
						our website. Your continued use of our services after such changes
						constitutes your acceptance of the new Privacy Policy.
					</p>
				</section>

				<section className="">
					<h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
					<p>
						If you have any questions or concerns about this Privacy Policy or
						our data practices, please contact us at:
					</p>
					<p className="mt-2">
						The Non-Stop Series <br />
						C/O Logos-Rhema Foundation, Behind Trade Fair, La. Accra. <br />
						Email: <a href="mailto:{email}" className="cursor-pointer">{email}</a> <br />
						Phone: {phone}
					</p>
				</section>

				<footer className=" mt-6">
					<p className="text-gray-600">Effective Date: 31/03/2026</p>
				</footer>
			</div>
		</>
	);
}
