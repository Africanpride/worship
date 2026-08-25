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

interface SlotReassignedEmailProps {
	name: string;
	eventTitle: string;
	startTime: Date;
	endTime: Date;
	trackLabel?: string | null;
	reassignedToName?: string | null;
	scheduleLink?: string;
}

export const SlotReassignedEmail = ({
	name,
	eventTitle,
	startTime,
	endTime,
	trackLabel = null,
	reassignedToName = null,
	scheduleLink = "https://thenonstop.org/schedule",
}: SlotReassignedEmailProps) => {
	const previewText = `Your worship slot for ${eventTitle} has been reassigned`;

	const slotLabel = `${startTime.toLocaleString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	})} – ${endTime.toLocaleTimeString("en-GB", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	})}`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white text-black font-sans">
					<Container className="my-10 px-6 py-8 border rounded-md shadow-md max-w-xl">
						<Heading className="text-xl mb-6 font-bold">
							Your Worship Slot Was Reassigned
						</Heading>

						<Text className="text-sm leading-6">Hello {name},</Text>

						<Text className="text-sm leading-6">
							A team admin has reassigned your worship slot for{" "}
							<strong>{eventTitle}</strong>:
						</Text>

						<Text className="text-sm leading-6">
							<strong>Event:</strong> {eventTitle}
							<br />
							{trackLabel && (
								<>
									<strong>Track:</strong> {trackLabel}
									<br />
								</>
							)}
							<br />
							<strong>Slot:</strong> {slotLabel}
						</Text>

						<Text className="text-sm leading-6">
							{reassignedToName
								? `The hour has now been assigned to ${reassignedToName}.`
								: "The hour is now unassigned."}{" "}
							If you believe this was a mistake or would like to pick another
							open hour, visit the schedule page.
						</Text>

						<Section className="text-center my-6">
							<Link
								href={scheduleLink}
								className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm"
							>
								View the Schedule
							</Link>
						</Section>

						<Text className="text-xs text-gray-600 mt-6">
							If you need any assistance, please contact us at{" "}
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

export default SlotReassignedEmail;
