import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface ReminderEmailProps {
	name: string;
	title: string;
	body: string;
	link?: string;
}

export const ReminderEmail = ({
	name,
	title,
	body,
	link,
}: ReminderEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>{title}</Preview>
			<Tailwind>
				<Body className="bg-white text-black font-sans">
					<Container className="my-10 px-6 py-8 border rounded-md shadow-md max-w-xl">
						<Heading className="text-xl mb-6 font-bold">{title}</Heading>
						<Text className="text-sm leading-6">Hello {name},</Text>
						<Text className="text-sm leading-6">{body}</Text>
						{link && (
							<Section className="text-center my-6">
								<Link
									href={link}
									className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm"
								>
									View Schedule
								</Link>
							</Section>
						)}
						<Text className="text-xs text-gray-600 mt-6">
							You can manage notifications in your profile. Contact us at{" "}
							<a className="text-primary" href="mailto:no-reply@thenonstop.org">
								no-reply@thenonstop.org
							</a>
							.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default ReminderEmail;
