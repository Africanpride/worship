import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const faq = [
	{
		question: "Is the event really 144 hours non-stop?",
		answer:
			"Yes. From the opening note to the final 'Amen,' the praise and Bible reading do not cease for 6 full days (144 hours). We have ministers and reading teams scheduled in shifts to ensure the altar remains active 24/7.",
	},
	{
		question: "Can I join the event at any time of day or night?",
		answer:
			"Absolutely. Our doors are open 24/7. Whether it is 3:00 AM or 3:00 PM, you are welcome to walk into the sanctuary to worship, pray, or listen to the Word. The livestream is also active around the clock.",
	},
	{
		question: "What is the 'Bible Reading Series' exactly?",
		answer:
			"Interwoven with the music, we have dedicated readers proclaiming the Holy Scriptures. Our goal is to read through significant portions (or the entirety) of the Bible aloud, believing that the public reading of the Word brings deliverance and clarity.",
	},
	{
		question: "Do I need to register or buy a ticket?",
		answer:
			"The Non-Stop is a free event open to everyone. However, we recommend 'Saving a Seat' via our registration link so we can send you schedule updates and digital resources for the 144-hour journey.",
	},
	{
		question: "How can my choir or ministry participate?",
		answer:
			"We are always looking for worshippers who carry the heart of David. Please visit our 'Partner' page or contact our administration team via the 'Join the Altar' form to submit your interest for future slots.",
	},
	{
		question: "Is there a specific dress code?",
		answer:
			"Come as you are. This is a place of deep encounter and prayer. We only ask that you dress modestly and comfortably for a focused environment of worship.",
	},
];

const FAQ = () => {
	return (
		<div
			className="flex items-center justify-center px-6 py-8"
			data-usal="fade-u duration-500"
		>
			<div className="max-w-2xl w-full">
				<h2 className="text-4xl md:text-5xl text-center md:text-left">
					Frequently Asked Questions
				</h2>
				<p className="mt-4 text-muted-foreground text-xl">
					Everything you need to know about joining the 144-hour sacrifice of
					praise.
				</p>

				<Accordion className="mt-8" type="single" collapsible>
					{faq.map(({ question, answer }, index) => (
						<AccordionItem key={index} value={`question-${index}`}>
							<AccordionTrigger className="text-left text-xl font-medium">
								{question}
							</AccordionTrigger>
							<AccordionContent className="text-base text-muted-foreground leading-relaxed">
								{answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
};

export default FAQ;
